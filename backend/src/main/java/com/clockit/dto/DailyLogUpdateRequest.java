package com.clockit.dto;

public class DailyLogUpdateRequest {

    private String module; // "weight" | "skincare_am" | "skincare_pm" | "nutrition" | "workout" | "energy"
    private Double weightAm;
    private Double weightPm;
    private Boolean skincareAmDone;
    private Boolean skincarePmDone;
    private Boolean nutritionLogged;
    private Integer nutritionCalories;
    private String nutritionSummary;
    private Boolean workoutCompleted;
    private String workoutName;
    private Boolean bodyCareDone;
    private Integer workoutDurationMinutes;
    private Integer energyScore;
    private String notes;

    public DailyLogUpdateRequest() {
    }

    public Boolean getBodyCareDone() {
        return bodyCareDone;
    }

    public void setBodyCareDone(Boolean bodyCareDone) {
        this.bodyCareDone = bodyCareDone;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
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

    public Boolean getSkincareAmDone() {
        return skincareAmDone;
    }

    public void setSkincareAmDone(Boolean skincareAmDone) {
        this.skincareAmDone = skincareAmDone;
    }

    public Boolean getSkincarePmDone() {
        return skincarePmDone;
    }

    public void setSkincarePmDone(Boolean skincarePmDone) {
        this.skincarePmDone = skincarePmDone;
    }

    public Boolean getNutritionLogged() {
        return nutritionLogged;
    }

    public void setNutritionLogged(Boolean nutritionLogged) {
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

    public Boolean getWorkoutCompleted() {
        return workoutCompleted;
    }

    public void setWorkoutCompleted(Boolean workoutCompleted) {
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
}
