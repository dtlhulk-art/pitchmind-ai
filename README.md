# PitchMind AI

```
pitchmind-ai/
├── frontend/   Giao diện (React + Vite + Tailwind), chạy ở http://localhost:5173
├── backend/    Máy chủ Node.js (cổng 3001): giữ khóa API, gọi Gemini, đọc/ghi database
├── database/   schema.sql (cấu trúc bảng) + pitchmind.db (tự tạo khi chạy)
└── scripts/    dev.js (chạy cả hai cùng lúc)
```

## Cách hoạt động
Trình duyệt (frontend) -> /api -> backend -> Google Gemini
                                      └-> database (SQLite) lưu lịch sử chat

## Chạy lần đầu
1. Cài Node.js bản 22.13 trở lên.
2. Mở `backend/.env`, điền `GEMINI_API_KEY=khoa_cua_ban`.
3. Mở Terminal ở thư mục gốc `pitchmind-ai` và chạy:
   npm run setup
   npm run dev
4. Mở http://localhost:5173

Các lần sau chỉ cần `npm run dev`.
