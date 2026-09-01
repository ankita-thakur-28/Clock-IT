package com.clockit.model;

public enum Phase {
    FOUNDATION("Foundation Phase", "Building your routine, steadily", 90, 180),
    BUILD("Build Phase", "Progressive overload & targeted definition", 30, 89),
    REFINE("Refine Phase", "Tapering strain & protecting your energy", 7, 29),
    ARRIVAL("Arrival Phase", "Rest prioritized & final glow prep", 0, 6),
    MAINTENANCE("Maintenance & Glow", "Evergreen habit mode & steady progress", -999, -1);

    private final String title;
    private final String description;
    private final int minDays;
    private final int maxDays;

    Phase(String title, String description, int minDays, int maxDays) {
        this.title = title;
        this.description = description;
        this.minDays = minDays;
        this.maxDays = maxDays;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public static Phase fromDaysRemaining(long daysRemaining) {
        if (daysRemaining > 90) {
            return FOUNDATION;
        } else if (daysRemaining >= 30) {
            return BUILD;
        } else if (daysRemaining >= 7) {
            return REFINE;
        } else if (daysRemaining >= 0) {
            return ARRIVAL;
        } else {
            return MAINTENANCE;
        }
    }
}
