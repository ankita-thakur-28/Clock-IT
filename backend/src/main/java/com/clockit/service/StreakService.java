package com.clockit.service;

import com.clockit.model.DailyLog;
import com.clockit.repository.DailyLogRepository;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StreakService {

    private final DailyLogRepository dailyLogRepository;
    private final Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public StreakService(DailyLogRepository dailyLogRepository) {
        this.dailyLogRepository = dailyLogRepository;
        this.clock = Clock.systemDefaultZone();
    }

    public StreakService(DailyLogRepository dailyLogRepository, Clock clock) {
        this.dailyLogRepository = dailyLogRepository;
        this.clock = clock;
    }

    /**
     * Calculates the current active streak of consecutive days logged.
     * If user logged today -> streak counts consecutive days up to today.
     * If user hasn't logged today yet -> streak counts consecutive days up to yesterday.
     * If user missed yesterday -> streak is 0.
     */
    public int calculateCurrentStreak(Long userId) {
        List<DailyLog> logs = dailyLogRepository.findAllByUserIdOrderByLogDateDesc(userId);
        if (logs.isEmpty()) {
            return 0;
        }

        Map<LocalDate, DailyLog> logMap = logs.stream()
                .filter(DailyLog::isDayActive)
                .collect(Collectors.toMap(DailyLog::getLogDate, l -> l, (existing, replace) -> existing));

        if (logMap.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now(clock);
        LocalDate checkDate = today;

        // If today is not logged, check if yesterday was logged
        if (!logMap.containsKey(today)) {
            checkDate = today.minusDays(1);
            if (!logMap.containsKey(checkDate)) {
                return 0;
            }
        }

        int streak = 0;
        while (logMap.containsKey(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }

        return streak;
    }

    public boolean isTodayActive(Long userId) {
        LocalDate today = LocalDate.now(clock);
        return dailyLogRepository.findByUserIdAndLogDate(userId, today)
                .map(DailyLog::isDayActive)
                .orElse(false);
    }
}
