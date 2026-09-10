package com.clockit.service;

import com.clockit.config.JwtTokenProvider;
import com.clockit.dto.AuthResponse;
import com.clockit.dto.GoogleAuthRequest;
import com.clockit.dto.LoginRequest;
import com.clockit.dto.RegisterRequest;
import com.clockit.dto.ResetPasswordRequest;
import com.clockit.dto.UpdateMilestoneRequest;
import com.clockit.dto.UserResponse;
import com.clockit.model.User;
import com.clockit.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());
        UserResponse userResponse = userService.mapToResponse(savedUser);

        return new AuthResponse(token, userResponse, false);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        UserResponse userResponse = userService.mapToResponse(user);
        boolean hasMilestone = user.getMilestoneDate() != null;

        return new AuthResponse(token, userResponse, hasMilestone);
    }

    @Transactional
    public UserResponse updateMilestone(Long userId, UpdateMilestoneRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setMilestoneDate(request.getMilestoneDate());
        user.setMilestoneType(request.getMilestoneType());
        user.setGoal(request.getGoal());
        if (request.getTrackingPreferences() != null) {
            user.setTrackingPreferences(request.getTrackingPreferences());
        }
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }

        User savedUser = userRepository.save(user);
        return userService.mapToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return userService.mapToResponse(user);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email address"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(normalizedEmail);
            String displayName = request.getName();
            if (displayName == null || displayName.isBlank()) {
                displayName = "Glow Prepper";
            }
            newUser.setName(displayName.trim());
            newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            return userRepository.save(newUser);
        });

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        UserResponse userResponse = userService.mapToResponse(user);
        boolean hasMilestone = user.getMilestoneDate() != null;

        return new AuthResponse(token, userResponse, hasMilestone);
    }
}
