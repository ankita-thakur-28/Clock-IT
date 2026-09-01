package com.clockit.service;

import com.clockit.model.DailyLog;
import com.clockit.model.User;
import com.clockit.repository.DailyLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    private DailyLogRepository dailyLogRepository;

    private StreakService streakService;
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-08-24T12:00:00Z"), ZoneId.of("UTC"));
    private final LocalDate today = LocalDate.now(fixedClock); // 2026-08-24

    @BeforeEach
    void setUp() {
        streakService = new StreakService(dailyLogRepository, fixedClock);
    }

    @Test
    void calculateCurrentStreak_whenNoLogs_returnsZero() {
        when(dailyLogRepository.findAllByUserIdOrderByLogDateDesc(1L)).thenReturn(Collections.emptyList());

        int streak = streakService.calculateCurrentStreak(1L);

        assertEquals(0, streak, "Brand new user with no logs should have 0 streak");
    }

    @Test
    void calculateCurrentStreak_whenLoggedTodayOnly_returnsOne() {
        User user = new User();
        user.setId(1L);

        DailyLog logToday = new DailyLog(user, today);
        logToday.setSkincareAmDone(true);

        when(dailyLogRepository.findAllByUserIdOrderByLogDateDesc(1L)).thenReturn(List.of(logToday));

        int streak = streakService.calculateCurrentStreak(1L);

        assertEquals(1, streak, "User logged today should have 1d streak");
    }

    @Test
    void calculateCurrentStreak_whenLoggedYesterdayAndToday_returnsTwo() {
        User user = new User();
        user.setId(1L);

        DailyLog logToday = new DailyLog(user, today);
        logToday.setSkincareAmDone(true);

        DailyLog logYesterday = new DailyLog(user, today.minusDays(1));
        logYesterday.setWorkoutCompleted(true);

        when(dailyLogRepository.findAllByUserIdOrderByLogDateDesc(1L)).thenReturn(Arrays.asList(logToday, logYesterday));

        int streak = streakService.calculateCurrentStreak(1L);

        assertEquals(2, streak, "Consecutive days should return 2d streak");
    }

    @Test
    void calculateCurrentStreak_whenMissedYesterdayAndNotLoggedToday_returnsZero() {
        User user = new User();
        user.setId(1L);

        DailyLog oldLog = new DailyLog(user, today.minusDays(3));
        oldLog.setSkincareAmDone(true);

        when(dailyLogRepository.findAllByUserIdOrderByLogDateDesc(1L)).thenReturn(List.of(oldLog));

        int streak = streakService.calculateCurrentStreak(1L);

        assertEquals(0, streak, "Missed days should reset streak to 0");
    }
}
