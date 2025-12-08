package com.codetogether.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 * Allows the frontend application to make requests to the backend API.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Allow requests from frontend (Vite dev server runs on port 5173 by default)
                .allowedOrigins(
                        "http://localhost:5173", // Vite default dev server
                        "http://localhost:3000", // Alternative React dev server
                        "http://localhost:4173" // Vite preview server
                )
                // Allowed HTTP methods
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                // Allow credentials (for JWT tokens in Authorization header)
                .allowCredentials(true)
                // Allowed request headers
                .allowedHeaders("*")
                // Expose Authorization header to frontend
                .exposedHeaders("Authorization")
                // Cache preflight request for 1 hour
                .maxAge(3600);
    }
}
