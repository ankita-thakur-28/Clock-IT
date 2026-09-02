package com.clockit.controller;

import com.clockit.dto.DailyLogItemResponse;
import com.clockit.dto.DailyLogUpdateRequest;
import com.clockit.dto.DashboardResponse;
import com.clockit.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping({"/api/v1/users/{id}/dashboard", "/api/users/{id}/dashboard"})
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getDashboard(id));
    }

    @PostMapping({"/api/v1/users/{id}/logs/today", "/api/users/{id}/logs/today"})
    public ResponseEntity<DashboardResponse> updateTodayLog(
            @PathVariable Long id,
            @RequestBody DailyLogUpdateRequest request
    ) {
        return ResponseEntity.ok(dashboardService.updateTodayLog(id, request));
    }

    @GetMapping({"/api/v1/users/{id}/logs", "/api/users/{id}/logs"})
    public ResponseEntity<List<DailyLogItemResponse>> getUserLogs(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(dashboardService.getUserDailyLogs(id, startDate, endDate));
    }

    @PostMapping({"/api/v1/users/{id}/logs/{date}", "/api/users/{id}/logs/{date}"})
    public ResponseEntity<DailyLogItemResponse> updateLogForDate(
            @PathVariable Long id,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody DailyLogUpdateRequest request
    ) {
        return ResponseEntity.ok(dashboardService.updateLogForDate(id, date, request));
    }
}
