package com.clockit.dto;

import com.clockit.model.DailyLog;
import java.time.LocalDate;

public class DailyLogItemResponse {

    private Long id;
    private LocalDate logDate;
    private Double weightAm;
    private Double weightPm;
    private boolean skincareAmDone;
    private boolean skincarePmDone;
    private boolean nutritionLogged;
    private Integer nutritionCalories;
    private String nutritionSummary;
    private boolean workoutCompleted;
    private String workoutName;
    private Integer workoutDurationMinutes;
    private Integer energyScore;
    private String notes;
    private boolean isDayActive;
    private int completedCount;

    public DailyLogItemResponse() {
    }

    public static DailyLogItemResponse fromEntity(DailyLog log) {
        DailyLogItemResponse res = new DailyLogItemResponse();
        res.setId(log.getId());
        res.setLogDate(log.getLogDate());
        res.setWeightAm(log.getWeightAm());
        res.setWeightPm(log.getWeightPm());
        res.setSkincareAmDone(log.isSkincareAmDone());
        res.setSkincarePmDone(log.isSkincarePmDone());
        res.setNutritionLogged(log.isNutritionLogged());
        res.setNutritionCalories(log.getNutritionCalories());
        res.setNutritionSummary(log.getNutritionSummary());
        res.setWorkoutCompleted(log.isWorkoutCompleted());
        res.setWorkoutName(log.getWorkoutName());
        res.setWorkoutDurationMinutes(log.getWorkoutDurationMinutes());
        res.setEnergyScore(log.getEnergyScore());
        res.setNotes(log.getNotes());
        res.setDayActive(log.isDayActive());
        res.setCompletedCount(log.getCompletedRoutineCount());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getEnergyScore() {
        return energyScore;
    }

    public void setEnergyScore(Integer energyScore) {
        this.energyScore = energyScore;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isDayActive() {
        return isDayActive;
    }

    public void setDayActive(boolean dayActive) {
        isDayActive = dayActive;
    }

    public int getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(int completedCount) {
        this.completedCount = completedCount;
    }
}
