package com.codetogether.backend.controller;

import com.codetogether.backend.dto.SimpleMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.message")
    public void handleMessage(@Payload Map<String, String> payload) {
        String roomId = payload.get("roomId");
        String userId = payload.get("userId");
        String name = payload.get("name");
        String text = payload.get("text");

        if (roomId == null || text == null)
            return;

        SimpleMessage msg = new SimpleMessage(userId, name, text);

        // Topic: /topic/room.{roomId}.chat
        // Frontend expects: socket.on("chat.message", msg => ...)
        // We send just the msg object? Or wrapped?
        // User spec: "Broadcast to room: { userId, name, text }"
        // So we send the raw object.
        messagingTemplate.convertAndSend((String) ("/topic/room." + roomId + ".chat"), msg);
    }
}
