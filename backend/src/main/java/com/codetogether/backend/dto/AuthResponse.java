package com.codetogether.backend.dto;

/**
 * DTO for authentication responses.
 * Contains JWT token and user information.
 */
public class AuthResponse {

    private String accessToken;
    private String userId;
    private String username;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String userId, String username, String email) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
