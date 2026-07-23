-- 002_agent_tasks.sql
-- Tracking table for Asynchronous AI Workflow execution

CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_agent TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    result_data JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_tasks_user_id ON agent_tasks(user_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);

-- Ensure Realtime is enabled for this table so frontend gets instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE agent_tasks;

-- RLS: Users can only view their own tasks
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own agent tasks" ON agent_tasks FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER update_agent_tasks_modtime 
BEFORE UPDATE ON agent_tasks 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
