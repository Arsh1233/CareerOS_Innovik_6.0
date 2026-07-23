-- Initial Supabase PostgreSQL Schema for CareerOS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base function for soft deletes update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-------------------------------------------------------------------------------
-- 1. USERS (Extends Supabase auth.users)
-------------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own record" ON users FOR SELECT USING (auth.uid() = id);

-------------------------------------------------------------------------------
-- 2. PROFILES
-------------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_deleted = false);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 3. COLLEGES
-------------------------------------------------------------------------------
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_colleges_name ON colleges(name);
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Colleges viewable by all" ON colleges FOR SELECT USING (is_deleted = false);

-------------------------------------------------------------------------------
-- 4. STUDENTS
-------------------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    graduation_year TEXT,
    major TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_students_college_id ON students(college_id);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own" ON students FOR ALL USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 5. RECRUITERS
-------------------------------------------------------------------------------
CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_recruiters_company ON recruiters(company_name);
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recruiters can view own" ON recruiters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view recruiters" ON recruiters FOR SELECT USING (is_deleted = false);

-------------------------------------------------------------------------------
-- 6. RESUMES
-------------------------------------------------------------------------------
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    storage_url TEXT NOT NULL,
    parsed_data JSONB,
    ats_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_resumes_student_id ON resumes(student_id);

-------------------------------------------------------------------------------
-- 7. SKILLS
-------------------------------------------------------------------------------
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_skills_student_id ON skills(student_id);
CREATE INDEX idx_skills_name ON skills(skill_name);

-------------------------------------------------------------------------------
-- 8. CAREER TWINS
-------------------------------------------------------------------------------
CREATE TABLE career_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    readiness_score FLOAT NOT NULL,
    strengths JSONB,
    weaknesses JSONB,
    recommended_roles JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_twins_readiness ON career_twins(readiness_score);

-------------------------------------------------------------------------------
-- 9. ROADMAPS
-------------------------------------------------------------------------------
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    goal_role TEXT,
    tasks JSONB,
    progress_percentage FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_roadmaps_student ON roadmaps(student_id);

-------------------------------------------------------------------------------
-- 10. JOBS
-------------------------------------------------------------------------------
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-------------------------------------------------------------------------------
-- 11. INTERVIEW SESSIONS
-------------------------------------------------------------------------------
CREATE TABLE interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    overall_score FLOAT,
    feedback_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_interviews_student ON interview_sessions(student_id);
CREATE INDEX idx_interviews_job ON interview_sessions(job_id);

-------------------------------------------------------------------------------
-- 12. APPLICATIONS
-------------------------------------------------------------------------------
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'applied',
    match_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_score ON applications(match_score);

-------------------------------------------------------------------------------
-- 13. ANALYTICS
-------------------------------------------------------------------------------
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_analytics_type ON analytics(metric_type);
CREATE INDEX idx_analytics_entity ON analytics(entity_id);

-- Attach update triggers to all tables
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_colleges_modtime BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_students_modtime BEFORE UPDATE ON students FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_recruiters_modtime BEFORE UPDATE ON recruiters FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_resumes_modtime BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_skills_modtime BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_career_twins_modtime BEFORE UPDATE ON career_twins FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_roadmaps_modtime BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_jobs_modtime BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_interviews_modtime BEFORE UPDATE ON interview_sessions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_applications_modtime BEFORE UPDATE ON applications FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_analytics_modtime BEFORE UPDATE ON analytics FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
