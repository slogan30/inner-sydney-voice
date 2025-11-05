-- reference for Supabase database schema

CREATE TABLE providers (
    provider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    date_interval TEXT,
    repeat_interval INTEGER,
    phone TEXT,
    email TEXT,
    website_url TEXT,
    provider_id UUID,
    place_id TEXT,
    address TEXT,
    category TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE CASCADE
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMPTZ,
    role TEXT DEFAULT 'user'
);