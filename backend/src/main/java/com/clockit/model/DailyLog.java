package com.clockit.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_logs", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_log_date", columnNames = {"user_id", "log_date"})
})
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "weight_am")
    private Double weightAm;

    @Column(name = "weight_pm")
    private Double weightPm;

    @Column(name = "energy_score")
    private Integer energyScore;

    @Column(name = "skincare_am_done", nullable = false)
    private boolean skincareAmDone = false;

    @Column(name = "skincare_pm_done", nullable = false)
    private boolean skincarePmDone = false;

    @Column(name = "nutrition_logged", nullable = false)
    private boolean nutritionLogged = false;

    @Column(name = "nutrition_calories")
    private Integer nutritionCalories;

    @Column(name = "nutrition_summary")
    private String nutritionSummary;

    @Column(name = "workout_completed", nullable = false)
    private boolean workoutCompleted = false;

    @Column(name = "workout_name")
    private String workoutName;

    @Column(name = "workout_duration_minutes")
    private Integer workoutDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public DailyLog() {
    }

    public DailyLog(User user, LocalDate logDate) {
        this.user = user;
        this.logDate = logDate;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isDayActive() {
        return skincareAmDone || skincarePmDone || (weightAm != null) || nutritionLogged || workoutCompleted;
    }

    public int getCompletedRoutineCount() {
        int count = 0;
        if (weightAm != null) count++;
        if (skincareAmDone) count++;
        if (nutritionLogged) count++;
        if (workoutCompleted) count++;
        return count;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Double getWeightAm() {
        return weightAm;
    }

    public void setWeightAm(Double weightAm) {
        this.weightAm = weightAm;
    }

    public Double getWeightPm() {
        return weightPm;
    }

    public void setWeightPm(Double weightPm) {
        this.weightPm = weightPm;
    }

    public Integer getEnergyScore() {
        return energyScore;
    }

    public void setEnergyScore(Integer energyScore) {
        this.energyScore = energyScore;
    }

    public boolean isSkincareAmDone() {
        return skincareAmDone;
    }

    public void setSkincareAmDone(boolean skincareAmDone) {
        this.skincareAmDone = skincareAmDone;
    }

    public boolean isSkincarePmDone() {
        return skincarePmDone;
    }

    public void setSkincarePmDone(boolean skincarePmDone) {
        this.skincarePmDone = skincarePmDone;
    }

    public boolean isNutritionLogged() {
        return nutritionLogged;
    }

    public void setNutritionLogged(boolean nutritionLogged) {
        this.nutritionLogged = nutritionLogged;
    }

    public Integer getNutritionCalories() {
        return nutritionCalories;
    }

    public void setNutritionCalories(Integer nutritionCalories) {
        this.nutritionCalories = nutritionCalories;
    }

    public String getNutritionSummary() {
        return nutritionSummary;
    }

    public void setNutritionSummary(String nutritionSummary) {
        this.nutritionSummary = nutritionSummary;
    }

    public boolean isWorkoutCompleted() {
        return workoutCompleted;
    }

    public void setWorkoutCompleted(boolean workoutCompleted) {
        this.workoutCompleted = workoutCompleted;
    }

    public String getWorkoutName() {
        return workoutName;
    }

    public void setWorkoutName(String workoutName) {
        this.workoutName = workoutName;
    }

    public Integer getWorkoutDurationMinutes() {
        return workoutDurationMinutes;
    }

    public void setWorkoutDurationMinutes(Integer workoutDurationMinutes) {
        this.workoutDurationMinutes = workoutDurationMinutes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
