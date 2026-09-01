package com.clockit.controller;

import com.clockit.model.Phase;
import com.clockit.model.User;
import com.clockit.repository.UserRepository;
import com.clockit.service.CountdownService;
import com.clockit.service.UserService;
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
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    private MockMvc mockMvc;
    private UserService userService;
    private CountdownService countdownService;

    @BeforeEach
    void setUp() {
        countdownService = new CountdownService();
        userService = new UserService(userRepository, countdownService);
        UserController userController = new UserController(userService);
        HealthController healthController = new HealthController();

        mockMvc = MockMvcBuilders.standaloneSetup(userController, healthController).build();
    }

    @Test
    @DisplayName("GET /api/health should return UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.app").value("CLOCK-IT Backend API"));
    }

    @Test
    @DisplayName("POST /api/users should create and return user with computed phase")
    void testCreateUser() throws Exception {
        LocalDate milestoneDate = LocalDate.now().plusDays(142);
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Ankita");
        savedUser.setEmail("ankita@example.com");
        savedUser.setMilestoneDate(milestoneDate);
        savedUser.setMilestoneType("Wedding");
        savedUser.setGoal("Tone & Sculpt");
        savedUser.setTrackingPreferences(List.of("Energy & mood"));
        savedUser.setHeight("163 cm");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        String jsonPayload = """
                {
                    "name": "Ankita",
                    "email": "ankita@example.com",
                    "milestoneDate": "%s",
                    "milestoneType": "Wedding",
                    "goal": "Tone & Sculpt",
                    "trackingPreferences": ["Energy & mood"],
                    "height": "163 cm"
                }
                """.formatted(milestoneDate.toString());

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Ankita"))
                .andExpect(jsonPath("$.phase").value("FOUNDATION"))
                .andExpect(jsonPath("$.phaseTitle").value("Foundation Phase"))
                .andExpect(jsonPath("$.daysRemaining").value(142));
    }

    @Test
    @DisplayName("GET /api/users/{id} should return user when found")
    void testGetUserById() throws Exception {
        LocalDate milestoneDate = LocalDate.now().plusDays(50);
        
        User user = new User();
        user.setId(2L);
        user.setName("Ankita");
        user.setMilestoneDate(milestoneDate);
        user.setMilestoneType("Race");
        user.setGoal("Feel Stronger");

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Ankita"))
                .andExpect(jsonPath("$.phase").value("BUILD"))
                .andExpect(jsonPath("$.daysRemaining").value(50));
    }
}
