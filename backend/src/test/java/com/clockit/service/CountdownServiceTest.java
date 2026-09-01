package com.clockit.service;

import com.clockit.model.Phase;
import com.clockit.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CountdownServiceTest {

    private CountdownService countdownService;
    private final LocalDate fixedToday = LocalDate.of(2026, 8, 22);

    @BeforeEach
    void setUp() {
        Clock fixedClock = Clock.fixed(
                Instant.parse("2026-08-22T00:00:00Z"),
                ZoneId.of("UTC")
        );
        countdownService = new CountdownService(fixedClock);
    }

    @Test
    @DisplayName("Should compute correct days remaining")
    void testCalculateDaysRemaining() {
        LocalDate milestone = fixedToday.plusDays(142);
        long daysRemaining = countdownService.calculateDaysRemaining(milestone);
        assertEquals(142, daysRemaining);
    }

    @Test
    @DisplayName("Should assign Foundation phase for > 90 days out")
    void testFoundationPhase() {
        assertEquals(Phase.FOUNDATION, countdownService.determinePhase(180));
        assertEquals(Phase.FOUNDATION, countdownService.determinePhase(91));
    }

    @Test
    @DisplayName("Should assign Build phase for 30 to 89 days out")
    void testBuildPhase() {
        assertEquals(Phase.BUILD, countdownService.determinePhase(90));
        assertEquals(Phase.BUILD, countdownService.determinePhase(50));
        assertEquals(Phase.BUILD, countdownService.determinePhase(30));
    }

    @Test
    @DisplayName("Should assign Refine phase for 7 to 29 days out")
    void testRefinePhase() {
        assertEquals(Phase.REFINE, countdownService.determinePhase(29));
        assertEquals(Phase.REFINE, countdownService.determinePhase(15));
        assertEquals(Phase.REFINE, countdownService.determinePhase(7));
    }

    @Test
    @DisplayName("Should assign Arrival phase for 0 to 6 days out")
    void testArrivalPhase() {
        assertEquals(Phase.ARRIVAL, countdownService.determinePhase(6));
        assertEquals(Phase.ARRIVAL, countdownService.determinePhase(1));
        assertEquals(Phase.ARRIVAL, countdownService.determinePhase(0));
    }

    @Test
    @DisplayName("Should assign Maintenance & Glow phase for past milestone dates")
    void testMaintenancePhase() {
        assertEquals(Phase.MAINTENANCE, countdownService.determinePhase(-1));
        assertEquals(Phase.MAINTENANCE, countdownService.determinePhase(-30));
    }
}
