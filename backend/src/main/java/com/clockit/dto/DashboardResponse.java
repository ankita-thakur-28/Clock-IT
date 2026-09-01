package com.clockit.dto;

import java.time.LocalDate;
import java.util.List;

public class DashboardResponse {

    private UserSummary user;
    private CountdownSummary countdown;
    private StreakSummary streak;
    private List<WeeklyDayItem> weeklyStrip;
    private TodayGlowSummary todayGlow;

    public DashboardResponse() {
    }

    public static class UserSummary {
        private Long id;
        private String name;
        private String milestoneType;
        private LocalDate milestoneDate;
        private String goal;
        private String height;

        public UserSummary() {}

        public UserSummary(Long id, String name, String milestoneType, LocalDate milestoneDate, String goal, String height) {
            this.id = id;
            this.name = name;
            this.milestoneType = milestoneType;
            this.milestoneDate = milestoneDate;
            this.goal = goal;
            this.height = height;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getMilestoneType() { return milestoneType; }
        public void setMilestoneType(String milestoneType) { this.milestoneType = milestoneType; }
        public LocalDate getMilestoneDate() { return milestoneDate; }
        public void setMilestoneDate(LocalDate milestoneDate) { this.milestoneDate = milestoneDate; }
        public String getGoal() { return goal; }
        public void setGoal(String goal) { this.goal = goal; }
        public String getHeight() { return height; }
        public void setHeight(String height) { this.height = height; }
    }

    public static class CountdownSummary {
        private long daysRemaining;
        private String phase;
        private String phaseTitle;
        private String phaseDescription;
        private int progressPercentage;
        private String subtitle;

        public CountdownSummary() {}

        public CountdownSummary(long daysRemaining, String phase, String phaseTitle, String phaseDescription, int progressPercentage, String subtitle) {
            this.daysRemaining = daysRemaining;
            this.phase = phase;
            this.phaseTitle = phaseTitle;
            this.phaseDescription = phaseDescription;
            this.progressPercentage = progressPercentage;
            this.subtitle = subtitle;
        }

        public long getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }
        public String getPhase() { return phase; }
        public void setPhase(String phase) { this.phase = phase; }
        public String getPhaseTitle() { return phaseTitle; }
        public void setPhaseTitle(String phaseTitle) { this.phaseTitle = phaseTitle; }
        public String getPhaseDescription() { return phaseDescription; }
        public void setPhaseDescription(String phaseDescription) { this.phaseDescription = phaseDescription; }
        public int getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }
        public String getSubtitle() { return subtitle; }
        public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    }

    public static class StreakSummary {
        private int currentStreak;
        private String streakText; // "0d", "1d", "14d"
        private boolean activeToday;

        public StreakSummary() {}

        public StreakSummary(int currentStreak, String streakText, boolean activeToday) {
            this.currentStreak = currentStreak;
            this.streakText = streakText;
            this.activeToday = activeToday;
        }

        public int getCurrentStreak() { return currentStreak; }
        public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
        public String getStreakText() { return streakText; }
        public void setStreakText(String streakText) { this.streakText = streakText; }
        public boolean isActiveToday() { return activeToday; }
        public void setActiveToday(boolean activeToday) { this.activeToday = activeToday; }
    }

    public static class WeeklyDayItem {
        private String dayOfWeek; // "M", "T", "W", "T", "F", "S", "S"
        private int dayOfMonth;   // 17, 18, 19, 20...
        private LocalDate date;
        private boolean isToday;
        private boolean isCompleted;
        private String status;    // "COMPLETED" | "TODAY" | "MISSED" | "FUTURE"

        public WeeklyDayItem() {}

        public WeeklyDayItem(String dayOfWeek, int dayOfMonth, LocalDate date, boolean isToday, boolean isCompleted, String status) {
            this.dayOfWeek = dayOfWeek;
            this.dayOfMonth = dayOfMonth;
            this.date = date;
            this.isToday = isToday;
            this.isCompleted = isCompleted;
            this.status = status;
        }

        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        public int getDayOfMonth() { return dayOfMonth; }
        public void setDayOfMonth(int dayOfMonth) { this.dayOfMonth = dayOfMonth; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public boolean isToday() { return isToday; }
        public void setToday(boolean today) { isToday = today; }
        public boolean isCompleted() { return isCompleted; }
        public void setCompleted(boolean completed) { isCompleted = completed; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class TodayGlowSummary {
        private int completedCount;
        private int totalCount = 4;
        private WeightCardSummary weightCard;
        private SkincareCardSummary skincareCard;
        private NutritionCardSummary nutritionCard;
        private BodyCareCardSummary bodyCareCard;
        private WorkoutCardSummary workoutCard;

        public TodayGlowSummary() {}

        public int getCompletedCount() { return completedCount; }
        public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }
        public int getTotalCount() { return totalCount; }
        public void setTotalCount(int totalCount) { this.totalCount = totalCount; }
        public WeightCardSummary getWeightCard() { return weightCard; }
        public void setWeightCard(WeightCardSummary weightCard) { this.weightCard = weightCard; }
        public SkincareCardSummary getSkincareCard() { return skincareCard; }
        public void setSkincareCard(SkincareCardSummary skincareCard) { this.skincareCard = skincareCard; }
        public NutritionCardSummary getNutritionCard() { return nutritionCard; }
        public void setNutritionCard(NutritionCardSummary nutritionCard) { this.nutritionCard = nutritionCard; }
        public BodyCareCardSummary getBodyCareCard() { return bodyCareCard; }
        public void setBodyCareCard(BodyCareCardSummary bodyCareCard) { this.bodyCareCard = bodyCareCard; }
        public WorkoutCardSummary getWorkoutCard() { return workoutCard; }
        public void setWorkoutCard(WorkoutCardSummary workoutCard) { this.workoutCard = workoutCard; }
    }

    public static class BodyCareCardSummary {
        private boolean completed;
        private boolean bodyDone;
        private boolean hairDone;
        private String badge;
        private String detail;

        public BodyCareCardSummary() {}
        public BodyCareCardSummary(boolean completed, boolean bodyDone, boolean hairDone, String badge, String detail) {
            this.completed = completed;
            this.bodyDone = bodyDone;
            this.hairDone = hairDone;
            this.badge = badge;
            this.detail = detail;
        }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
        public boolean isBodyDone() { return bodyDone; }
        public void setBodyDone(boolean bodyDone) { this.bodyDone = bodyDone; }
        public boolean isHairDone() { return hairDone; }
        public void setHairDone(boolean hairDone) { this.hairDone = hairDone; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class WeightCardSummary {
        private boolean logged;
        private Double weightAm;
        private String badge;
        private String detail;

        public WeightCardSummary() {}
        public WeightCardSummary(boolean logged, Double weightAm, String badge, String detail) {
            this.logged = logged;
            this.weightAm = weightAm;
            this.badge = badge;
            this.detail = detail;
        }

        public boolean isLogged() { return logged; }
        public void setLogged(boolean logged) { this.logged = logged; }
        public Double getWeightAm() { return weightAm; }
        public void setWeightAm(Double weightAm) { this.weightAm = weightAm; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class SkincareCardSummary {
        private boolean amDone;
        private boolean pmDone;
        private String badge;
        private String detail;

        public SkincareCardSummary() {}
        public SkincareCardSummary(boolean amDone, boolean pmDone, String badge, String detail) {
            this.amDone = amDone;
            this.pmDone = pmDone;
            this.badge = badge;
            this.detail = detail;
        }

        public boolean isAmDone() { return amDone; }
        public void setAmDone(boolean amDone) { this.amDone = amDone; }
        public boolean isPmDone() { return pmDone; }
        public void setPmDone(boolean pmDone) { this.pmDone = pmDone; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class NutritionCardSummary {
        private boolean logged;
        private Integer calories;
        private String summary;
        private String badge;
        private String detail;

        public NutritionCardSummary() {}
        public NutritionCardSummary(boolean logged, Integer calories, String summary, String badge, String detail) {
            this.logged = logged;
            this.calories = calories;
            this.summary = summary;
            this.badge = badge;
            this.detail = detail;
        }

        public boolean isLogged() { return logged; }
        public void setLogged(boolean logged) { this.logged = logged; }
        public Integer getCalories() { return calories; }
        public void setCalories(Integer calories) { this.calories = calories; }
        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class WorkoutCardSummary {
        private boolean completed;
        private String workoutName;
        private Integer durationMinutes;
        private String badge;
        private String detail;

        public WorkoutCardSummary() {}
        public WorkoutCardSummary(boolean completed, String workoutName, Integer durationMinutes, String badge, String detail) {
            this.completed = completed;
            this.workoutName = workoutName;
            this.durationMinutes = durationMinutes;
            this.badge = badge;
            this.detail = detail;
        }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
        public String getWorkoutName() { return workoutName; }
        public void setWorkoutName(String workoutName) { this.workoutName = workoutName; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public UserSummary getUser() { return user; }
    public void setUser(UserSummary user) { this.user = user; }
    public CountdownSummary getCountdown() { return countdown; }
    public void setCountdown(CountdownSummary countdown) { this.countdown = countdown; }
    public StreakSummary getStreak() { return streak; }
    public void setStreak(StreakSummary streak) { this.streak = streak; }
    public List<WeeklyDayItem> getWeeklyStrip() { return weeklyStrip; }
    public void setWeeklyStrip(List<WeeklyDayItem> weeklyStrip) { this.weeklyStrip = weeklyStrip; }
    public TodayGlowSummary getTodayGlow() { return todayGlow; }
    public void setTodayGlow(TodayGlowSummary todayGlow) { this.todayGlow = todayGlow; }
}
