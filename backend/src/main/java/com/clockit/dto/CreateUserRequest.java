package com.clockit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String email;

    @NotNull(message = "Milestone date is required")
    private LocalDate milestoneDate;

    @NotBlank(message = "Milestone type is required")
    private String milestoneType;

    @NotBlank(message = "Goal is required")
    private String goal;

    private List<String> trackingPreferences;

    private String height;

    public CreateUserRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
