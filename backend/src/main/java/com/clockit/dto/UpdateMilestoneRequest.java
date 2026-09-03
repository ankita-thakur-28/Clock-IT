package com.clockit.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class UpdateMilestoneRequest {

    @NotNull(message = "Milestone date is required")
    @Future(message = "Milestone date must be in the future")
    private LocalDate milestoneDate;

    @NotBlank(message = "Milestone type is required")
    private String milestoneType;

    @NotBlank(message = "Goal is required")
    private String goal;

    private List<String> trackingPreferences = new ArrayList<>();

    private String height;

    public UpdateMilestoneRequest() {
    }

    public UpdateMilestoneRequest(LocalDate milestoneDate, String milestoneType, String goal) {
        this.milestoneDate = milestoneDate;
        this.milestoneType = milestoneType;
        this.goal = goal;
    }

    public LocalDate getMilestoneDate() {
        return milestoneDate;
    }

    public void setMilestoneDate(LocalDate milestoneDate) {
        this.milestoneDate = milestoneDate;
    }

    public String getMilestoneType() {
        return milestoneType;
    }

    public void setMilestoneType(String milestoneType) {
        this.milestoneType = milestoneType;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public List<String> getTrackingPreferences() {
        return trackingPreferences;
    }

    public void setTrackingPreferences(List<String> trackingPreferences) {
        this.trackingPreferences = trackingPreferences;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }
}
