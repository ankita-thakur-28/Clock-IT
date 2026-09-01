-- V2__create_daily_logs.sql
-- Schema for Daily Habit Logs and Tracking

CREATE TABLE IF NOT EXISTS daily_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weight_am DOUBLE PRECISION,
    weight_pm DOUBLE PRECISION,
    energy_score INT,
    skincare_am_done BOOLEAN NOT NULL DEFAULT FALSE,
    skincare_pm_done BOOLEAN NOT NULL DEFAULT FALSE,
    nutrition_logged BOOLEAN NOT NULL DEFAULT FALSE,
    nutrition_calories INT,
    nutrition_summary VARCHAR(255),
    workout_completed BOOLEAN NOT NULL DEFAULT FALSE,
    workout_name VARCHAR(255),
    workout_duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_log_date UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);
