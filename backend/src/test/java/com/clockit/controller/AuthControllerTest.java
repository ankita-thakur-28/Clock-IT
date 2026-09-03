package com.clockit.controller;

import com.clockit.dto.AuthResponse;
import com.clockit.dto.LoginRequest;
import com.clockit.dto.RegisterRequest;
import com.clockit.dto.UpdateMilestoneRequest;
import com.clockit.dto.UserResponse;
import com.clockit.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        AuthController authController = new AuthController(authService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
    }

    @Test
    @DisplayName("POST /api/auth/register returns 201 Created with JWT")
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest("Test User", "test@clockit.app", "password123");
        UserResponse userResponse = new UserResponse();
        userResponse.setId(10L);
        userResponse.setName("Test User");
        userResponse.setEmail("test@clockit.app");

        AuthResponse authResponse = new AuthResponse("mock-jwt-token", userResponse, false);

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.name").value("Test User"))
                .andExpect(jsonPath("$.hasMilestone").value(false));
    }

    @Test
    @DisplayName("POST /api/auth/register with existing email returns 400")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest("Test User", "existing@clockit.app", "password123");
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("An account with this email already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("An account with this email already exists"));
    }

    @Test
    @DisplayName("POST /api/auth/login returns 200 with JWT and user")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("test@clockit.app", "password123");
        UserResponse userResponse = new UserResponse();
        userResponse.setId(10L);
        userResponse.setName("Test User");
        userResponse.setEmail("test@clockit.app");

        AuthResponse authResponse = new AuthResponse("mock-jwt-token", userResponse, true);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.hasMilestone").value(true));
    }

    @Test
    @DisplayName("POST /api/auth/login with wrong password returns 401 Unauthorized")
    void testLoginWrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("test@clockit.app", "wrongpassword");
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    @DisplayName("PUT /api/v1/users/{id}/milestone updates milestone and returns user")
    void testUpdateMilestone() throws Exception {
        LocalDate futureDate = LocalDate.now().plusDays(100);
        UpdateMilestoneRequest request = new UpdateMilestoneRequest(futureDate, "Wedding", "Tone & Sculpt");

        UserResponse userResponse = new UserResponse();
        userResponse.setId(10L);
        userResponse.setName("Test User");
        userResponse.setMilestoneDate(futureDate);
        userResponse.setMilestoneType("Wedding");
        userResponse.setGoal("Tone & Sculpt");
        userResponse.setDaysRemaining(100);

        when(authService.updateMilestone(eq(10L), any(UpdateMilestoneRequest.class))).thenReturn(userResponse);

        String jsonPayload = """
                {
                    "milestoneDate": "%s",
                    "milestoneType": "Wedding",
                    "goal": "Tone & Sculpt"
                }
                """.formatted(futureDate);

        mockMvc.perform(put("/api/v1/users/10/milestone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.milestoneType").value("Wedding"))
                .andExpect(jsonPath("$.daysRemaining").value(100));
    }
}
