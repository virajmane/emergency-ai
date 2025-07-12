-- Emergency response logging system
CREATE TABLE IF NOT EXISTS emergency_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    emergency_type VARCHAR(100),
    user_location POINT,
    emergency_description TEXT,
    ai_analysis JSONB,
    recommended_services JSONB,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for location-based queries
CREATE INDEX IF NOT EXISTS idx_emergency_logs_location ON emergency_logs USING GIST (user_location);

-- Index for emergency type analysis
CREATE INDEX IF NOT EXISTS idx_emergency_logs_type ON emergency_logs (emergency_type);

-- Sample emergency response data for testing
INSERT INTO emergency_logs (session_id, emergency_type, user_location, emergency_description, ai_analysis, recommended_services, response_time_ms) VALUES
('test-001', 'medical-cardiac', POINT(-74.0060, 40.7128), 'Chest pain and difficulty breathing', 
 '{"urgency": "critical", "actions": ["Call 911", "Take aspirin if not allergic", "Sit down and rest"]}',
 '[{"name": "Mount Sinai Hospital", "distance": 0.8, "specialties": ["Cardiology", "Emergency"]}]',
 1200),
('test-002', 'fire', POINT(-74.0060, 40.7128), 'Kitchen fire spreading to living room',
 '{"urgency": "critical", "actions": ["Call 911", "Evacuate immediately", "Close doors behind you"]}',
 '[{"name": "FDNY Engine 1", "distance": 0.3, "specialties": ["Fire suppression", "Rescue"]}]',
 800);
