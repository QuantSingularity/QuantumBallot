-- QuantumBallot database initialisation
-- Runs once when the postgres container is first created

\set ON_ERROR_STOP on

-- Revoke public schema privileges
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE quantumballot FROM PUBLIC;

-- Create application role with minimal privileges
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_role') THEN
    CREATE ROLE app_role;
  END IF;
END
$$;

GRANT CONNECT ON DATABASE quantumballot TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT CREATE ON SCHEMA public TO app_role;

-- Grant app_role to the app user
GRANT app_role TO quantumballot;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
