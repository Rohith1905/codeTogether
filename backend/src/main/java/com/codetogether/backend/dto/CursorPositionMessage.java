package com.codetogether.backend.dto;

/**
 * Message class for broadcasting cursor position in real-time.
 * Used to show where other users are currently editing.
 */
public class CursorPositionMessage {

    private String userId;
    private String userName;
    private String fileId;
    private Integer line;
    private Integer column;
    private Long timestamp;

    // TODO: Add validation annotations

    public CursorPositionMessage() {
    }

    public CursorPositionMessage(String userId, String userName, String fileId, Integer line, Integer column,
            Long timestamp) {
        this.userId = userId;
        this.userName = userName;
        this.fileId = fileId;
        this.line = line;
        this.column = column;
        this.timestamp = timestamp;
    }

    // Getters and Setters

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public Integer getLine() {
        return line;
    }

    public void setLine(Integer line) {
        this.line = line;
    }

    public Integer getColumn() {
        return column;
    }

    public void setColumn(Integer column) {
        this.column = column;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
