package com.clockit.controller;

import com.clockit.dto.AuthResponse;
import com.clockit.dto.LoginRequest;
import com.clockit.dto.RegisterRequest;
import com.clockit.dto.UpdateMilestoneRequest;
import com.clockit.dto.UserResponse;
import com.clockit.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/api/auth/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || !(authentication.getCredentials() instanceof Long)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        Long userId = (Long) authentication.getCredentials();
        try {
            UserResponse response = authService.getCurrentUser(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping({"/api/v1/users/{id}/milestone", "/api/users/{id}/milestone"})
    public ResponseEntity<?> updateMilestone(@PathVariable Long id,
                                             @Valid @RequestBody UpdateMilestoneRequest request) {
        try {
            UserResponse response = authService.updateMilestone(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
