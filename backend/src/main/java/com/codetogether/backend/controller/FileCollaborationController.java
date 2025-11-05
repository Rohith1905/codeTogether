package com.codetogether.backend.controller;

import com.codetogether.backend.dto.FileEditRequest;
import com.codetogether.backend.dto.FilePresenceRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FileCollaborationController {

    private final SimpMessagingTemplate messagingTemplate;

    // fileId -> Set<username>
    private final Map<String, Set<String>> activeEditors = new ConcurrentHashMap<>();

    // fileId -> content (Latest in-memory content)
    private final Map<String, String> activeFileContents = new ConcurrentHashMap<>();

    @MessageMapping("/join-file-room")
    public void joinFileRoom(@Payload FilePresenceRequest request) {
        log.info("User {} joined file room: {}", request.getUsername(), request.getFileId());

        // Sync new user with latest cached content if exists
        String cachedContent = activeFileContents.get(request.getFileId());
        if (cachedContent != null) {
            FileEditRequest syncMessage = new FileEditRequest();
            syncMessage.setRoomId(request.getRoomId());
            syncMessage.setFileId(request.getFileId());
            syncMessage.setContent(cachedContent);

            String topic = String.format("/topic/room.%s.file.%s.edit", request.getRoomId(), request.getFileId());
            messagingTemplate.convertAndSend(topic, syncMessage);
        }
    }

    @MessageMapping("/leave-file-room")
    public void leaveFileRoom(@Payload FilePresenceRequest request) {
        log.info("User {} left file room: {}", request.getUsername(), request.getFileId());
        removeUserFromEditing(request.getFileId(), request.getUsername(), request.getRoomId());
    }

    @MessageMapping("/file-edit")
    public void handleFileEdit(@Payload FileEditRequest request) {
        // Cache the latest content
        activeFileContents.put(request.getFileId(), request.getContent());

        // Broadcast change to specific file topic
        String topic = String.format("/topic/room.%s.file.%s.edit", request.getRoomId(), request.getFileId());
        messagingTemplate.convertAndSend(topic, request);
    }

    @MessageMapping("/editing-started")
    public void handleEditingStarted(@Payload FilePresenceRequest request) {
        activeEditors.computeIfAbsent(request.getFileId(), k -> ConcurrentHashMap.newKeySet())
                .add(request.getUsername());
        broadcastEditingStatus(request.getRoomId(), request.getFileId());
    }

    @MessageMapping("/editing-stopped")
    public void handleEditingStopped(@Payload FilePresenceRequest request) {
        removeUserFromEditing(request.getFileId(), request.getUsername(), request.getRoomId());
    }

    @MessageMapping("/auto-save-toggle")
    public void handleAutoSaveToggle(@Payload Map<String, Object> payload) {
        String roomId = (String) payload.get("roomId");
        String fileId = (String) payload.get("fileId");
        Boolean enabled = (Boolean) payload.get("enabled");
        String username = (String) payload.get("username");

        log.info("Auto-save toggle: {} by {} for file {}", enabled, username, fileId);

        // Broadcast to all users in the room
        String topic = String.format("/topic/room.%s.file.%s.autosave", roomId, fileId);
        Map<String, Object> message = Map.of(
                "enabled", enabled,
                "username", username);
        messagingTemplate.convertAndSend(topic, message);
    }

    private void removeUserFromEditing(String fileId, String username, String roomId) {
        Set<String> editors = activeEditors.get(fileId);
        if (editors != null) {
            editors.remove(username);
            if (editors.isEmpty()) {
                activeEditors.remove(fileId);
            }
            broadcastEditingStatus(roomId, fileId);
        }
    }

    private void broadcastEditingStatus(String roomId, String fileId) {
        Set<String> editors = activeEditors.getOrDefault(fileId, Set.of());
        int count = editors.size();

        // Broadcast to global room topic for FileTree indicators
        String topic = String.format("/topic/room.%s.editing-indicators", roomId);
        Map<String, Object> statusUpdate = Map.of(
                "fileId", fileId,
                "editingCount", count,
                "editors", editors);
        messagingTemplate.convertAndSend(topic, (Object) statusUpdate);
    }
}
