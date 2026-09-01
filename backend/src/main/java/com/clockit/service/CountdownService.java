package com.clockit.service;

import com.clockit.model.Phase;
import com.clockit.model.User;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class CountdownService {

    private final Clock clock;

    public CountdownService() {
        this.clock = Clock.systemDefaultZone();
    }

    // For testability
    public CountdownService(Clock clock) {
        this.clock = clock;
    }

    public long calculateDaysRemaining(LocalDate milestoneDate) {
        LocalDate today = LocalDate.now(clock);
        return ChronoUnit.DAYS.between(today, milestoneDate);
    }

    public Phase determinePhase(long daysRemaining) {
        return Phase.fromDaysRemaining(daysRemaining);
    }

    public int calculateProgressPercentage(User user, long daysRemaining) {
        LocalDate today = LocalDate.now(clock);
        LocalDate startDate = (user.getCreatedAt() != null) ? user.getCreatedAt().toLocalDate() : today;
        LocalDate milestoneDate = user.getMilestoneDate();

        long totalDays = ChronoUnit.DAYS.between(startDate, milestoneDate);
        if (totalDays <= 0) {
            // Fallback: estimate from standard 180-day countdown baseline
            double progress = ((180.0 - daysRemaining) / 180.0) * 100.0;
            return (int) Math.max(0, Math.min(100, Math.round(progress)));
        }

        long elapsedDays = ChronoUnit.DAYS.between(startDate, today);
        if (elapsedDays < 0) {
            return 0;
        }

        double percent = ((double) elapsedDays / (double) totalDays) * 100.0;
        return (int) Math.max(0, Math.min(100, Math.round(percent)));
    }
}
