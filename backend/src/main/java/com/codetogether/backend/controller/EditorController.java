package com.codetogether.backend.controller;

import com.codetogether.backend.dto.CodeChangeMessage;
import com.codetogether.backend.dto.CodeSyncResponse;
import com.codetogether.backend.dto.CursorMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class EditorController {

    @MessageMapping("/editor.update")
    @SendTo("/topic/editor/{roomId}")
    public CodeSyncResponse handleCodeUpdate(@Payload CodeChangeMessage message, @DestinationVariable String roomId) {
        // In a real app, we would save the change to DB/Redis here
        return new CodeSyncResponse(
                message.fileId(),
                message.content(),
                message.userId(),
                LocalDateTime.now(),
                message.cursorPos());
    }

    // Keeping this for compatibility with implementation plan if needed,
    // but usually cursor updates are separate to reduce payload size
    @MessageMapping("/editor.cursor")
    @SendTo("/topic/cursor/{roomId}")
    public CursorMessage handleCursorUpdate(@Payload CursorMessage message, @DestinationVariable String roomId) {
        return message;
    }
}
