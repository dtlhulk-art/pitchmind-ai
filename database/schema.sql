-- Cấu trúc database của PitchMind AI (SQLite)
-- File database thật được tạo tự động tại database/pitchmind.db khi chạy backend.

-- Mỗi cuộc trò chuyện là một dòng
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  updated_at  TEXT,               -- nhãn hiển thị, ví dụ "Hôm nay"
  position    INTEGER NOT NULL DEFAULT 0   -- thứ tự trong danh sách
);

-- Các tin nhắn thuộc một cuộc trò chuyện
CREATE TABLE IF NOT EXISTS messages (
  session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  id          TEXT NOT NULL,
  position    INTEGER NOT NULL,   -- thứ tự tin nhắn
  role        TEXT NOT NULL,      -- 'user' hoặc 'assistant'
  data        TEXT NOT NULL,      -- toàn bộ tin nhắn dạng JSON (text, personaId, sources...)
  PRIMARY KEY (session_id, id)
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, position);
