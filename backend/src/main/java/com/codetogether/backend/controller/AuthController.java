package com.codetogether.backend.controller;

import com.codetogether.backend.dto.AuthResponse;
import com.codetogether.backend.dto.LoginRequest;
import com.codetogether.backend.dto.RegisterRequest;
import com.codetogether.backend.model.User;
import com.codetogether.backend.repository.UserRepository;
import com.codetogether.backend.service.CustomUserDetailsService;
import com.codetogether.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 * Handles user login and registration.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            UserRepository userRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticate user and return JWT token.
     * 
     * Endpoint: POST /api/auth/login
     * 
     * @param loginRequest the login credentials
     * @return ResponseEntity with JWT token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails);

        // Fetch user to get email and ID
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User found in details but not repository"));

        return ResponseEntity.ok(new AuthResponse(token, user.getId().toString(), user.getUsername(), user.getEmail()));
    }

    /**
     * Register a new user and return JWT token.
     * 
     * Endpoint: POST /api/auth/register
     * 
     * @param registerRequest the registration details
     * @return ResponseEntity with JWT token and user info
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null) {
                public String getMessage() {
                    return "Username is already taken";
                }
            });
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null) {
                public String getMessage() {
                    return "Email is already taken";
                }
            });
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        userRepository.save(newUser);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUsername());
        final String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity
                .ok(new AuthResponse(token, newUser.getId().toString(), newUser.getUsername(), newUser.getEmail()));
    }

    /**
     * Validate JWT token.
     * 
     * Endpoint: POST /api/auth/validate
     * 
     * @param token the JWT token to validate
     * @return ResponseEntity with validation result
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return ResponseEntity.ok(jwtUtil.validateToken(token, userDetails));
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    /**
     * Refresh JWT token.
     * 
     * Endpoint: POST /api/auth/refresh
     * 
     * @param token the current JWT token
     * @return ResponseEntity with new JWT token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token, userDetails)) {
                String newToken = jwtUtil.generateToken(userDetails);
                // Fetch user to get email and ID
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                return ResponseEntity
                        .ok(new AuthResponse(newToken, user.getId().toString(), user.getUsername(), user.getEmail()));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
