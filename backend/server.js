// Backend PitchMind AI: giữ khóa API an toàn + lưu lịch sử chat vào database
import http from 'node:http';
import { listSessions, saveSessions } from './db.js';

const PORT = Number(process.env.PORT) || 3001;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_BODY = 5 * 1024 * 1024; // 5 MB

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Dữ liệu quá lớn'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(Object.assign(new Error('JSON không hợp lệ'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const { pathname } = url;

  try {
    // Kiểm tra backend còn sống
    if (req.method === 'GET' && pathname === '/api/health') {
      const keyOk = Boolean(process.env.GEMINI_API_KEY) && !process.env.GEMINI_API_KEY.startsWith('dan_khoa');
      return send(res, 200, { ok: true, geminiKeyConfigured: keyOk });
    }

    // Chuyển tiếp yêu cầu tới Gemini, thêm khóa API ở phía server
    const geminiMatch = pathname.match(/^\/api\/gemini\/([\w.-]+)$/);
    if (req.method === 'POST' && geminiMatch) {
      const key = process.env.GEMINI_API_KEY;
      if (!key || key.startsWith('dan_khoa')) {
        return send(res, 500, { error: { message: 'Chưa có GEMINI_API_KEY trong backend/.env' } });
      }
      const body = await readBody(req);
      const upstream = await fetch(`${GEMINI_BASE}/${geminiMatch[1]}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
      });
      const text = await upstream.text();
      res.writeHead(upstream.status, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(text);
    }

    // Lịch sử chat trong database
    if (pathname === '/api/sessions') {
      if (req.method === 'GET') return send(res, 200, listSessions());
      if (req.method === 'PUT') {
        const list = await readBody(req);
        if (!Array.isArray(list)) return send(res, 400, { error: { message: 'Cần một mảng cuộc trò chuyện' } });
        saveSessions(list);
        return send(res, 200, { ok: true, count: list.length });
      }
    }

    send(res, 404, { error: { message: 'Không tìm thấy' } });
  } catch (err) {
    console.error(err);
    send(res, err.status || 502, { error: { message: err.message || 'Lỗi máy chủ' } });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend chạy tại http://127.0.0.1:${PORT}`);
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith('dan_khoa')) {
    console.warn('⚠ Chưa điền GEMINI_API_KEY trong backend/.env, chat AI sẽ chưa hoạt động.');
  }
});
