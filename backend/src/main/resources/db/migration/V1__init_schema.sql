-- V1__init_schema.sql
-- Initial schema for CLOCK-IT Users and Tracking Preferences

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    milestone_date DATE NOT NULL,
    milestone_type VARCHAR(100) NOT NULL,
    goal VARCHAR(100) NOT NULL,
    height VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tracking_preferences (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_milestone_date ON users(milestone_date);
CREATE INDEX IF NOT EXISTS idx_user_tracking_preferences_user_id ON user_tracking_preferences(user_id);
