-- V3__allow_null_milestone_and_add_password_hash.sql
-- Allow new user accounts to be created before onboarding milestone selection

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE users ALTER COLUMN milestone_date DROP NOT NULL;
ALTER TABLE users ALTER COLUMN milestone_type DROP NOT NULL;
ALTER TABLE users ALTER COLUMN goal DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_users_email'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
    END IF;
END $$;
