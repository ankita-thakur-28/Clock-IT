package com.clockit.controller;

import com.clockit.dto.DailyLogItemResponse;
import com.clockit.dto.DailyLogUpdateRequest;
import com.clockit.dto.DashboardResponse;
import com.clockit.service.DashboardService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        DashboardController controller = new DashboardController(dashboardService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /api/v1/users/{id}/logs should return historical logs")
    void testGetUserLogs() throws Exception {
        LocalDate d1 = LocalDate.of(2026, 8, 20);
        DailyLogItemResponse item = new DailyLogItemResponse();
        item.setId(10L);
        item.setLogDate(d1);
        item.setWeightAm(54.2);
        item.setSkincareAmDone(true);
        item.setDayActive(true);

        when(dashboardService.getUserDailyLogs(eq(1L), any(), any())).thenReturn(List.of(item));

        mockMvc.perform(get("/api/v1/users/1/logs?startDate=2026-08-01&endDate=2026-08-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].logDate").value("2026-08-20"))
                .andExpect(jsonPath("$[0].weightAm").value(54.2))
                .andExpect(jsonPath("$[0].skincareAmDone").value(true))
                .andExpect(jsonPath("$[0].dayActive").value(true));
    }

    @Test
    @DisplayName("POST /api/v1/users/{id}/logs/{date} should update and return specific date log")
    void testUpdateLogForDate() throws Exception {
        LocalDate targetDate = LocalDate.of(2026, 8, 25);
        DailyLogItemResponse item = new DailyLogItemResponse();
        item.setId(11L);
        item.setLogDate(targetDate);
        item.setWeightAm(53.9);
        item.setDayActive(true);

        when(dashboardService.updateLogForDate(eq(1L), eq(targetDate), any(DailyLogUpdateRequest.class))).thenReturn(item);

        mockMvc.perform(post("/api/v1/users/1/logs/2026-08-25")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "weightAm": 53.9
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.logDate").value("2026-08-25"))
                .andExpect(jsonPath("$.weightAm").value(53.9));
    }
}
