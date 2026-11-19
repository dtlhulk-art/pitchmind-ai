// Lớp truy cập database (SQLite có sẵn trong Node.js, không cần cài thêm gì)
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.resolve(here, '../database');
mkdirSync(dbDir, { recursive: true });

const db = new DatabaseSync(process.env.DB_PATH || path.join(dbDir, 'pitchmind.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(readFileSync(path.join(dbDir, 'schema.sql'), 'utf8'));

// Trả về toàn bộ cuộc trò chuyện kèm tin nhắn, đúng dạng frontend đang dùng
export function listSessions() {
  const sessions = db.prepare('SELECT id, title, updated_at, position FROM sessions ORDER BY position').all();
  const getMessages = db.prepare('SELECT data FROM messages WHERE session_id = ? ORDER BY position');
  return sessions.map((s) => ({
    id: s.id,
    title: s.title,
    updatedAt: s.updated_at,
    messages: getMessages.all(s.id).map((m) => JSON.parse(m.data)),
  }));
}

// Ghi đè toàn bộ danh sách cuộc trò chuyện (đồng bộ từ frontend)
export function saveSessions(list) {
  const keepIds = list.map((s) => String(s.id));
  db.exec('BEGIN');
  try {
    // Xóa cuộc trò chuyện không còn trong danh sách (tin nhắn xóa theo)
    const existing = db.prepare('SELECT id FROM sessions').all().map((r) => r.id);
    const del = db.prepare('DELETE FROM sessions WHERE id = ?');
    for (const id of existing) if (!keepIds.includes(id)) del.run(id);

    const upsert = db.prepare(
      `INSERT INTO sessions (id, title, updated_at, position) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, updated_at = excluded.updated_at, position = excluded.position`
    );
    const clearMsgs = db.prepare('DELETE FROM messages WHERE session_id = ?');
    const addMsg = db.prepare(
      'INSERT OR REPLACE INTO messages (session_id, id, position, role, data) VALUES (?, ?, ?, ?, ?)'
    );

    list.forEach((s, i) => {
      const sid = String(s.id);
      upsert.run(sid, String(s.title ?? ''), s.updatedAt == null ? null : String(s.updatedAt), i);
      clearMsgs.run(sid);
      (s.messages || []).forEach((m, j) => {
        addMsg.run(sid, String(m.id ?? `m-${j}`), j, String(m.role ?? ''), JSON.stringify(m));
      });
    });
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
