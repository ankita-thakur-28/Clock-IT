package com.clockit.service;

import com.clockit.config.JwtTokenProvider;
import com.clockit.dto.AuthResponse;
import com.clockit.dto.ForgotPasswordRequest;
import com.clockit.dto.GoogleAuthRequest;
import com.clockit.dto.LoginRequest;
import com.clockit.dto.RegisterRequest;
import com.clockit.dto.ResetPasswordRequest;
import com.clockit.dto.UpdateMilestoneRequest;
import com.clockit.dto.UserResponse;
import com.clockit.model.User;
import com.clockit.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    private final Map<String, OtpRecord> resetOtpStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public record OtpRecord(String otp, Instant expiresAt) {}

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

    @Transactional(readOnly = true)
    public Map<String, Object> requestPasswordReset(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email address"));

        // Generate 6-digit numeric OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);
        Instant expiresAt = Instant.now().plus(10, ChronoUnit.MINUTES);

        resetOtpStorage.put(normalizedEmail, new OtpRecord(otp, expiresAt));
        log.info("🔑 [CLOCK-IT AUTH] Verification code for {}: {} (Expires in 10 minutes)", normalizedEmail, otp);

        return Map.of(
                "message", "Verification code sent to " + normalizedEmail,
                "expiresInMinutes", 10
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email address"));

        OtpRecord record = resetOtpStorage.get(normalizedEmail);
        if (record == null) {
            throw new IllegalArgumentException("No active verification code found. Please request a new code.");
        }

        if (Instant.now().isAfter(record.expiresAt())) {
            resetOtpStorage.remove(normalizedEmail);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        if (!record.otp().equals(request.getOtp() != null ? request.getOtp().trim() : "")) {
            throw new IllegalArgumentException("Invalid verification code. Please check your code and try again.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        resetOtpStorage.remove(normalizedEmail);
        log.info("✅ Password successfully reset for {}", normalizedEmail);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (request.getIdToken() != null && !request.getIdToken().isBlank()) {
            log.info("🔐 Google idToken received for account: {}", normalizedEmail);
        }

        User user = userRepository.findByEmail(normalizedEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(normalizedEmail);
            String displayName = request.getName();
            if (displayName == null || displayName.isBlank()) {
                int atIdx = normalizedEmail.indexOf('@');
                displayName = atIdx > 0 ? normalizedEmail.substring(0, atIdx) : "User";
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
