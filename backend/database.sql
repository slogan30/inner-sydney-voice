-- reference for Supabase database schema

CREATE TABLE providers (
    provider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    date_interval TEXT,
    place_id TEXT, -- Google Map API's unique ID
    address TEXT, -- Store the formatted address from Google
    phone TEXT,
    email TEXT,
    website_url TEXT,
    provider_id UUID,
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE CASCADE
);

CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
