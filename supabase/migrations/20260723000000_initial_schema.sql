-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TENANTS & USERS
-- ==========================================

CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In Supabase, the actual users table is auth.users. 
-- We map a public.users profile to it.
CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'college_admin', 'super_admin');

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. DOMAIN PROFILES
-- ==========================================

CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id),
    branch VARCHAR(100),
    graduation_year INT,
    gpa DECIMAL(3,2),
    skills JSONB DEFAULT '[]',
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE college_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. CORE FEATURES
-- ==========================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES recruiters(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, screening, interviewed, offered, rejected
    match_score DECIMAL(5,2), -- AI generated match score out of 100
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, job_id)
);

-- ==========================================
-- 4. AI AGENT DATA (TWINS, ROADMAPS, INTERVIEWS)
-- ==========================================

CREATE TABLE career_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
    readiness_score DECIMAL(5,2),
    placement_probability DECIMAL(5,2),
    salary_forecast JSONB, -- {min, max, currency}
    skill_gaps JSONB,
    last_computed TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roadmap_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    order_index INT NOT NULL
);

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL, -- Optional, could be general mock
    overall_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    feedback_summary TEXT,
    transcript_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. CHAT SYSTEM
-- ==========================================

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL, -- 'ARIA', 'ECHO'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'agent'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. INDEXING
-- ==========================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_college ON student_profiles(college_id);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_interviews_student ON interviews(student_id);
CREATE INDEX idx_roadmaps_student ON roadmaps(student_id);
CREATE INDEX idx_roadmap_steps_roadmap ON roadmap_steps(roadmap_id);
CREATE INDEX idx_chat_sessions_student ON chat_sessions(student_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);

-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and update their own profile" 
ON student_profiles FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "College staff can view their students" 
ON student_profiles FOR SELECT 
USING (
    college_id IN (
        SELECT college_id FROM college_staff WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Recruiters can view applicant profiles"
ON student_profiles FOR SELECT
USING (
    id IN (
        SELECT student_id FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN recruiters r ON j.company_id = r.company_id
        WHERE r.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can view open jobs"
ON jobs FOR SELECT
USING (status = 'open');

CREATE POLICY "Recruiters can manage their company jobs"
ON jobs FOR ALL
USING (
    company_id IN (
        SELECT company_id FROM recruiters WHERE user_id = auth.uid()
    )
);
