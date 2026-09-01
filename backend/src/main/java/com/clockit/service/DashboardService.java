package com.clockit.service;

import com.clockit.dto.DailyLogUpdateRequest;
import com.clockit.dto.DashboardResponse;
import com.clockit.model.DailyLog;
import com.clockit.model.Phase;
import com.clockit.model.User;
import com.clockit.repository.DailyLogRepository;
import com.clockit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final DailyLogRepository dailyLogRepository;
    private final CountdownService countdownService;
    private final StreakService streakService;
    private final Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public DashboardService(
            UserRepository userRepository,
            DailyLogRepository dailyLogRepository,
            CountdownService countdownService,
            StreakService streakService
    ) {
        this.userRepository = userRepository;
        this.dailyLogRepository = dailyLogRepository;
        this.countdownService = countdownService;
        this.streakService = streakService;
        this.clock = Clock.systemDefaultZone();
    }

    public DashboardService(
            UserRepository userRepository,
            DailyLogRepository dailyLogRepository,
            CountdownService countdownService,
            StreakService streakService,
            Clock clock
    ) {
        this.userRepository = userRepository;
        this.dailyLogRepository = dailyLogRepository;
        this.countdownService = countdownService;
        this.streakService = streakService;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        LocalDate today = LocalDate.now(clock);
        long daysRemaining = countdownService.calculateDaysRemaining(user.getMilestoneDate());
        Phase phase = countdownService.determinePhase(daysRemaining);
        int progressPercent = countdownService.calculateProgressPercentage(user, daysRemaining);

        // 1. User Summary
        DashboardResponse.UserSummary userSummary = new DashboardResponse.UserSummary(
                user.getId(),
                user.getName(),
                user.getMilestoneType(),
                user.getMilestoneDate(),
                user.getGoal(),
                user.getHeight()
        );

        // 2. Countdown Summary
        String targetEventName = (user.getMilestoneType() != null && !user.getMilestoneType().isBlank())
                ? user.getMilestoneType()
                : "Big Day";
        String subtitle = daysRemaining + " days to your " + targetEventName;

        DashboardResponse.CountdownSummary countdownSummary = new DashboardResponse.CountdownSummary(
                daysRemaining,
                phase.name(),
                phase.getTitle(),
                phase.getDescription(),
                progressPercent,
                subtitle
        );

        // 3. Streak Summary
        int currentStreak = streakService.calculateCurrentStreak(userId);
        boolean activeToday = streakService.isTodayActive(userId);
        DashboardResponse.StreakSummary streakSummary = new DashboardResponse.StreakSummary(
                currentStreak,
                currentStreak + "d",
                activeToday
        );

        // 4. Weekly Strip (Monday to Sunday around today)
        List<DashboardResponse.WeeklyDayItem> weeklyStrip = buildWeeklyStrip(userId, today);

        // 5. Today's Glow Routine Grid
        DailyLog todayLog = dailyLogRepository.findByUserIdAndLogDate(userId, today)
                .orElseGet(() -> new DailyLog(user, today));

        DashboardResponse.TodayGlowSummary todayGlow = buildTodayGlow(todayLog);

        DashboardResponse response = new DashboardResponse();
        response.setUser(userSummary);
        response.setCountdown(countdownSummary);
        response.setStreak(streakSummary);
        response.setWeeklyStrip(weeklyStrip);
        response.setTodayGlow(todayGlow);

        return response;
    }

    @Transactional(readOnly = true)
    public List<com.clockit.dto.DailyLogItemResponse> getUserDailyLogs(Long userId, LocalDate startDate, LocalDate endDate) {
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        List<DailyLog> logs;
        if (startDate != null && endDate != null) {
            logs = dailyLogRepository.findAllByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, startDate, endDate);
        } else {
            logs = dailyLogRepository.findAllByUserIdOrderByLogDateDesc(userId);
        }

        return logs.stream()
                .map(com.clockit.dto.DailyLogItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public com.clockit.dto.DailyLogItemResponse updateLogForDate(Long userId, LocalDate date, DailyLogUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        DailyLog log = dailyLogRepository.findByUserIdAndLogDate(userId, date)
                .orElseGet(() -> new DailyLog(user, date));

        if (request.getWeightAm() != null) {
            log.setWeightAm(request.getWeightAm());
        }
        if (request.getWeightPm() != null) {
            log.setWeightPm(request.getWeightPm());
        }
        if (request.getSkincareAmDone() != null) {
            log.setSkincareAmDone(request.getSkincareAmDone());
        }
        if (request.getSkincarePmDone() != null) {
            log.setSkincarePmDone(request.getSkincarePmDone());
        }
        if (request.getBodyCareDone() != null) {
            log.setNutritionLogged(request.getBodyCareDone());
        } else if (request.getNutritionLogged() != null) {
            log.setNutritionLogged(request.getNutritionLogged());
        }
        if (request.getNutritionCalories() != null) {
            log.setNutritionCalories(request.getNutritionCalories());
        }
        if (request.getNutritionSummary() != null) {
            log.setNutritionSummary(request.getNutritionSummary());
        }
        if (request.getWorkoutCompleted() != null) {
            log.setWorkoutCompleted(request.getWorkoutCompleted());
        }
        if (request.getWorkoutName() != null) {
            log.setWorkoutName(request.getWorkoutName());
        }
        if (request.getWorkoutDurationMinutes() != null) {
            log.setWorkoutDurationMinutes(request.getWorkoutDurationMinutes());
        }
        if (request.getEnergyScore() != null) {
            log.setEnergyScore(request.getEnergyScore());
        }
        if (request.getNotes() != null) {
            log.setNotes(request.getNotes());
        }

        DailyLog saved = dailyLogRepository.save(log);
        return com.clockit.dto.DailyLogItemResponse.fromEntity(saved);
    }

    @Transactional
    public DashboardResponse updateTodayLog(Long userId, DailyLogUpdateRequest request) {
        LocalDate today = LocalDate.now(clock);
        updateLogForDate(userId, today, request);
        return getDashboard(userId);
    }

    private List<DashboardResponse.WeeklyDayItem> buildWeeklyStrip(Long userId, LocalDate today) {
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<DailyLog> weekLogs = dailyLogRepository.findAllByUserIdAndLogDateBetweenOrderByLogDateAsc(userId, monday, sunday);
        Map<LocalDate, DailyLog> logMap = weekLogs.stream()
                .collect(Collectors.toMap(DailyLog::getLogDate, l -> l, (a, b) -> a));

        List<DashboardResponse.WeeklyDayItem> items = new ArrayList<>();
        String[] dayLabels = {"M", "T", "W", "T", "F", "S", "S"};

        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            boolean isToday = date.equals(today);
            DailyLog dayLog = logMap.get(date);
            boolean isCompleted = dayLog != null && dayLog.isDayActive();

            String status = "FUTURE";
            if (isToday) {
                status = isCompleted ? "COMPLETED" : "TODAY";
            } else if (date.isBefore(today)) {
                status = isCompleted ? "COMPLETED" : "MISSED";
            }

            items.add(new DashboardResponse.WeeklyDayItem(
                    dayLabels[i],
                    date.getDayOfMonth(),
                    date,
                    isToday,
                    isCompleted,
                    status
            ));
        }

        return items;
    }

    private DashboardResponse.TodayGlowSummary buildTodayGlow(DailyLog log) {
        DashboardResponse.TodayGlowSummary summary = new DashboardResponse.TodayGlowSummary();

        // 1. Weight Card
        boolean weightLogged = log.getWeightAm() != null;
        String weightBadge = weightLogged ? "Logged ✓" : "Log";
        String weightDetail = weightLogged ? "AM: " + log.getWeightAm() + " kg" : "Tap to record";
        summary.setWeightCard(new DashboardResponse.WeightCardSummary(weightLogged, log.getWeightAm(), weightBadge, weightDetail));

        // 2. Skincare Card
        boolean skincareDone = log.isSkincareAmDone();
        String skincareBadge = skincareDone ? "Done ✓" : "Log";
        String skincareDetail = skincareDone ? "SPF & Glow Protected" : "SPF & Vitamin C";
        summary.setSkincareCard(new DashboardResponse.SkincareCardSummary(skincareDone, log.isSkincarePmDone(), skincareBadge, skincareDetail));

        // 3. Nutrition / Hair & Body Card
        boolean nutritionDone = log.isNutritionLogged();
        String nutritionBadge = nutritionDone ? "Done ✓" : "Log";
        String nutritionDetail = nutritionDone ? "Glow & Nourished · Done" : "Scalp Oil, Scrub & Butter";
        summary.setNutritionCard(new DashboardResponse.NutritionCardSummary(nutritionDone, log.getNutritionCalories(), log.getNutritionSummary(), nutritionBadge, nutritionDetail));
        summary.setBodyCareCard(new DashboardResponse.BodyCareCardSummary(nutritionDone, nutritionDone, nutritionDone, nutritionBadge, nutritionDetail));

        // 4. Workout Card
        boolean workoutDone = log.isWorkoutCompleted();
        String workoutBadge = workoutDone ? "Done ✓" : "Start";
        String workoutDetail = workoutDone
                ? (log.getWorkoutName() != null ? log.getWorkoutName() : "Workout") + (log.getWorkoutDurationMinutes() != null ? " · " + log.getWorkoutDurationMinutes() + "m" : "")
                : "Glutes & Core · 40m";
        summary.setWorkoutCard(new DashboardResponse.WorkoutCardSummary(workoutDone, log.getWorkoutName(), log.getWorkoutDurationMinutes(), workoutBadge, workoutDetail));

        // Total Completed Count out of 4
        int completed = 0;
        if (weightLogged) completed++;
        if (skincareDone) completed++;
        if (nutritionDone) completed++;
        if (workoutDone) completed++;

        summary.setCompletedCount(completed);
        summary.setTotalCount(4);

        return summary;
    }
}
