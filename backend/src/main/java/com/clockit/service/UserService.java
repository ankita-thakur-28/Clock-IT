package com.clockit.service;

import com.clockit.dto.CreateUserRequest;
import com.clockit.dto.UserResponse;
import com.clockit.model.Phase;
import com.clockit.model.User;
import com.clockit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CountdownService countdownService;

    public UserService(UserRepository userRepository, CountdownService countdownService) {
        this.userRepository = userRepository;
        this.countdownService = countdownService;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMilestoneDate(request.getMilestoneDate());
        user.setMilestoneType(request.getMilestoneType());
        user.setGoal(request.getGoal());
        user.setTrackingPreferences(request.getTrackingPreferences() != null ? request.getTrackingPreferences() : List.of());
        user.setHeight(request.getHeight());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse mapToResponse(User user) {
        long daysRemaining = countdownService.calculateDaysRemaining(user.getMilestoneDate());
        Phase phase = countdownService.determinePhase(daysRemaining);
        int progressPercentage = countdownService.calculateProgressPercentage(user, daysRemaining);

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMilestoneDate(user.getMilestoneDate());
        response.setMilestoneType(user.getMilestoneType());
        response.setGoal(user.getGoal());
        response.setTrackingPreferences(user.getTrackingPreferences());
        response.setHeight(user.getHeight());
        response.setCreatedAt(user.getCreatedAt());

        response.setDaysRemaining(daysRemaining);
        response.setPhase(phase);
        response.setPhaseTitle(phase.getTitle());
        response.setPhaseDescription(phase.getDescription());
        response.setProgressPercentage(progressPercentage);

        return response;
    }
}
