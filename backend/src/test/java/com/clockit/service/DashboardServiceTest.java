package com.clockit.service;

import com.clockit.dto.DailyLogUpdateRequest;
import com.clockit.dto.DashboardResponse;
import com.clockit.model.DailyLog;
import com.clockit.model.User;
import com.clockit.repository.DailyLogRepository;
import com.clockit.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DailyLogRepository dailyLogRepository;

    private DashboardService dashboardService;
    private User testUser;
    private final LocalDate fixedToday = LocalDate.of(2026, 8, 31);

    @BeforeEach
    void setUp() {
        Clock fixedClock = Clock.fixed(Instant.parse("2026-08-31T00:00:00Z"), ZoneId.of("UTC"));
        CountdownService countdownService = new CountdownService();
        StreakService streakService = new StreakService(dailyLogRepository, fixedClock);

        dashboardService = new DashboardService(
                userRepository,
                dailyLogRepository,
                countdownService,
                streakService,
                fixedClock
        );

        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Ankita");
        testUser.setMilestoneDate(LocalDate.of(2027, 1, 15));
        testUser.setMilestoneType("Wedding");
        testUser.setGoal("Tone & Sculpt");
    }

    @Test
    @DisplayName("Partial Log: Weight only (55.4 kg) should persist exact weight and not fabricate other routines")
    void testWeightOnlyPersistence() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        DailyLog existingLog = new DailyLog(testUser, fixedToday);
        when(dailyLogRepository.findByUserIdAndLogDate(eq(1L), eq(fixedToday))).thenReturn(Optional.of(existingLog));
        when(dailyLogRepository.save(any(DailyLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DailyLogUpdateRequest request = new DailyLogUpdateRequest();
        request.setWeightAm(55.4);

        DashboardResponse response = dashboardService.updateTodayLog(1L, request);

        assertNotNull(response);
        DashboardResponse.TodayGlowSummary glow = response.getTodayGlow();
        assertNotNull(glow);

        // Exact weight must be 55.4
        assertTrue(glow.getWeightCard().isLogged());
        assertEquals(55.4, glow.getWeightCard().getWeightAm());
        assertEquals("Logged ✓", glow.getWeightCard().getBadge());

        // Other routines must remain UNLOGGED / FALSE
        assertFalse(glow.getSkincareCard().isAmDone());
        assertEquals("Log", glow.getSkincareCard().getBadge());
        assertFalse(glow.getNutritionCard().isLogged());
        assertEquals("Log", glow.getNutritionCard().getBadge());
        assertFalse(glow.getWorkoutCard().isCompleted());
        assertEquals("Start", glow.getWorkoutCard().getBadge());

        // Counter must be exactly 1 of 4
        assertEquals(1, glow.getCompletedCount());
        assertEquals(4, glow.getTotalCount());
    }

    @Test
    @DisplayName("Partial Log: Weight (55.4 kg) + Skincare AM should reflect 2 of 4 without fabricating workout")
    void testWeightAndSkincarePartialLog() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        DailyLog existingLog = new DailyLog(testUser, fixedToday);
        when(dailyLogRepository.findByUserIdAndLogDate(eq(1L), eq(fixedToday))).thenReturn(Optional.of(existingLog));
        when(dailyLogRepository.save(any(DailyLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DailyLogUpdateRequest request = new DailyLogUpdateRequest();
        request.setWeightAm(55.4);
        request.setSkincareAmDone(true);

        DashboardResponse response = dashboardService.updateTodayLog(1L, request);

        DashboardResponse.TodayGlowSummary glow = response.getTodayGlow();
        assertTrue(glow.getWeightCard().isLogged());
        assertEquals(55.4, glow.getWeightCard().getWeightAm());
        assertTrue(glow.getSkincareCard().isAmDone());
        assertFalse(glow.getWorkoutCard().isCompleted());
        assertFalse(glow.getNutritionCard().isLogged());

        assertEquals(2, glow.getCompletedCount());
    }
}
