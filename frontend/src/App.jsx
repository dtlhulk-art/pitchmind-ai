import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Flame,
  ShieldAlert,
  ClipboardList,
  Send,
  Sparkles,
  MessageSquare,
  Plus,
  Trash2,
  Volume2,
  Square,
  Globe,
  HelpCircle,
  Swords,
  Compass,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
  Award,
  Zap,
  BookOpen,
  Users,
  Info,
  Search,
  Copy,
  Check
} from 'lucide-react';

// ==========================================
// CẤU HÌNH NHÂN VẬT AI (PERSONAS)
// ==========================================
const PERSONAS = [
  {
    id: 'commentator',
    name: 'BLV Nhiệt Huyết',
    role: 'Bình luận viên Cabin',
    icon: Flame,
    color: 'from-amber-500 to-orange-600',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    voiceName: 'Fenrir', // Giọng sôi nổi, hào hứng
    description: 'Sôi nổi, giàu cảm xúc, dùng ngôn từ đậm chất cabin bình luận bóng đá Việt Nam.',
    systemPrompt: `Bạn là một Bình luận viên bóng đá kỳ cựu, cực kỳ nhiệt huyết, giàu cảm xúc và am hiểu sâu sắc bóng đá thế giới lẫn bóng đá Việt Nam (V-League, ĐTQG Việt Nam).
Phong cách trả lời:
- Hào hứng, truyền lửa, sử dụng các thuật ngữ bình luận cuốn hút, giàu hình ảnh (như "cú sút cháy lưới", "pha bẻ lưng hậu vệ", "cảm xúc vỡ òa", "những chiến binh Sao Vàng"...).
- Dù giàu cảm xúc nhưng thông tin, số liệu, lịch sử và kết quả phải hoàn toàn chính xác.
- Trình bày rõ ràng bằng Markdown, sử dụng tiêu đề, danh sách và bảng biểu khi so sánh cầu thủ/đội bóng.
- Luôn trả lời bằng tiếng Việt.`
  },
  {
    id: 'analyst',
    name: 'Chuyên Gia Chiến Thuật',
    role: 'Phân tích viên Dữ liệu & Sơ đồ',
    icon: ClipboardList,
    color: 'from-emerald-500 to-teal-600',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    voiceName: 'Charon', // Giọng điềm tĩnh, thông thái
    description: 'Phân tích chuyên sâu sơ đồ đội hình, pressing, xG, không gian và đối đầu chiến thuật.',
    systemPrompt: `Bạn là một Chuyên gia phân tích chiến thuật và dữ liệu bóng đá hiện đại (tương tự các chuyên gia tại Opta, The Athletic hay ban huấn luyện chuyên nghiệp).
Phong cách trả lời:
- Sắc bén, logic, đi sâu vào cấu trúc đội hình (4-3-3, 3-2-5 khi kiểm soát bóng, 4-4-2 khối thấp...), cơ chế pressing (Gegenpressing, High-block, Mid-block), chuyển đổi trạng thái (Transition), half-space (hành lang trong), và các chỉ số thống kê (xG, xA, PPDA, Progressive Passes).
- Khi người dùng hỏi về cầu thủ hoặc trận đấu, hãy mổ xẻ vai trò chiến thuật, điểm mạnh/yếu và cách khắc chế.
- Trình bày khoa học bằng Markdown, có các mục rõ ràng và bảng so sánh thông số nếu phù hợp.
- Luôn trả lời bằng tiếng Việt.`
  },
  {
    id: 'referee',
    name: 'Trọng Tài FIFA / VAR',
    role: 'Chuyên gia Luật IFAB & Tình huống',
    icon: ShieldAlert,
    color: 'from-yellow-400 to-red-500',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    voiceName: 'Kore', // Giọng dứt khoát, rõ ràng
    description: 'Giải thích chuẩn xác luật thi đấu IFAB/FIFA, VAR, việt vị, thẻ phạt và tranh cãi.',
    systemPrompt: `Bạn là Trọng tài bóng đá cấp cao chuẩn FIFA và chuyên gia phòng VAR, nắm vững toàn bộ Luật bóng đá hiện hành của IFAB (International Football Association Board).
Phong cách trả lời:
- Công tâm, dứt khoát, chuẩn mực và rõ ràng như tiếng còi trên sân.
- Khi giải thích luật hoặc tình huống tranh cãi (việt vị, lỗi dùng tay chơi bóng - handball, DOGSO, SPA, quy trình can thiệp của VAR, thẻ vàng/thẻ đỏ), hãy trích dẫn tinh thần hoặc điều khoản cụ thể của Luật IFAB (ví dụ: Luật số 11 - Việt vị, Luật số 12 - Lỗi và hành vi sai trái).
- Đưa ra các ví dụ tình huống thực tế trên sân để người hâm mộ dễ hiểu.
- Trình bày mạch lạc bằng Markdown, luôn trả lời bằng tiếng Việt.`
  }
];

// ==========================================
// CÂU HỎI GỢI Ý NHANH (QUICK PROMPTS)
// ==========================================
const QUICK_PROMPTS = [
  {
    category: 'Chiến thuật',
    icon: Compass,
    title: 'Phân tích 4-3-3 vs 3-5-2',
    prompt: 'Hãy phân tích ưu nhược điểm của sơ đồ 4-3-3 khi đối đầu với sơ đồ 3-5-2. Đội dùng 4-3-3 cần khai thác khoảng trống nào để giành chiến thắng?'
  },
  {
    category: 'Lịch sử',
    icon: Trophy,
    title: 'Lịch sử World Cup & Kỷ lục',
    prompt: 'Tổng hợp những cột mốc lịch sử vĩ đại nhất của World Cup, các đội vô địch nhiều nhất và những kỷ lục cá nhân khó phá vỡ nhất.'
  },
  {
    category: 'Việt Nam',
    icon: Flame,
    title: 'Bóng đá Việt Nam & V-League',
    prompt: 'Điểm lại những dấu ấn lịch sử đáng tự hào nhất của Đội tuyển Bóng đá Quốc gia Việt Nam và sự phát triển chiến thuật tại V-League hiện nay.'
  },
  {
    category: 'Luật IFAB',
    icon: ShieldAlert,
    title: 'Luật Việt vị & Chạm tay mới nhất',
    prompt: 'Giải thích chi tiết và dễ hiểu nhất về Luật Việt vị và Luật chạm tay (Handball) trong vòng cấm theo quy định IFAB hiện hành. Khi nào chạm tay trong vòng cấm KHÔNG bị thổi phạt đền?'
  },
  {
    category: 'Châu Âu',
    icon: Award,
    title: 'Kỷ lục Champions League',
    prompt: 'Những trận lội ngược dòng kinh điển nhất lịch sử UEFA Champions League và lý do giải đấu này luôn có sức hấp dẫn đặc biệt.'
  },
  {
    category: 'Thuật ngữ',
    icon: BookOpen,
    title: 'Số 9 ảo (False 9) & Half-space',
    prompt: 'Giải thích vai trò của "Số 9 ảo" (False 9) và khái niệm "Half-space" (Hành lang trong) trong bóng đá hiện đại kèm ví dụ các cầu thủ điển hình.'
  }
];

// ==========================================
// DỮ LIỆU SA BÀN CHIẾN THUẬT (TACTICAL FORMATIONS)
// ==========================================
const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Hiện Đại (Kiểm soát & Tấn công biên)',
    desc: 'Cân bằng hoàn hảo giữa phòng ngự và tấn công, tạo các tam giác phối hợp ở hai hành lang trong.',
    positions: [
      { id: 'GK', label: 'GK', x: 50, y: 90, role: 'Thủ môn quét (Sweeper Keeper)' },
      { id: 'LB', label: 'LB', x: 16, y: 70, role: 'Hậu vệ biên trái' },
      { id: 'LCB', label: 'CB', x: 38, y: 74, role: 'Trung vệ lệch trái' },
      { id: 'RCB', label: 'CB', x: 62, y: 74, role: 'Trung vệ lệch phải' },
      { id: 'RB', label: 'RB', x: 84, y: 70, role: 'Hậu vệ biên phải (Inverted/Overlap)' },
      { id: 'CDM', label: 'CDM', x: 50, y: 54, role: 'Tiền vệ mỏ neo (Số 6)' },
      { id: 'LCM', label: 'CM', x: 30, y: 42, role: 'Tiền vệ kiến thiết / Box-to-Box (Số 8)' },
      { id: 'RCM', label: 'CM', x: 70, y: 42, role: 'Tiền vệ tấn công lệch phải (Số 8)' },
      { id: 'LW', label: 'LW', x: 18, y: 22, role: 'Tiền đạo cánh trái (Inside Forward)' },
      { id: 'ST', label: 'ST', x: 50, y: 16, role: 'Trung phong cắm (Số 9)' },
      { id: 'RW', label: 'RW', x: 82, y: 22, role: 'Tiền đạo cánh phải (Winger)' }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1 Linh Hoạt (Double Pivot)',
    desc: 'Sử dụng 2 tiền vệ trụ che chắn trước hàng thủ và giải phóng hoàn toàn nhạc trưởng Số 10.',
    positions: [
      { id: 'GK', label: 'GK', x: 50, y: 90, role: 'Thủ môn' },
      { id: 'LB', label: 'LB', x: 15, y: 72, role: 'Hậu vệ trái' },
      { id: 'LCB', label: 'CB', x: 38, y: 75, role: 'Trung vệ' },
      { id: 'RCB', label: 'CB', x: 62, y: 75, role: 'Trung vệ' },
      { id: 'RB', label: 'RB', x: 85, y: 72, role: 'Hậu vệ phải' },
      { id: 'LDM', label: 'CDM', x: 36, y: 56, role: 'Tiền vệ trụ thu hồi bóng' },
      { id: 'RDM', label: 'DLP', x: 64, y: 56, role: 'Tiền vệ kiến thiết lùi sâu' },
      { id: 'LAM', label: 'LM', x: 18, y: 34, role: 'Tiền vệ cánh trái' },
      { id: 'CAM', label: 'CAM', x: 50, y: 34, role: 'Nhạc trưởng hộ công (Số 10)' },
      { id: 'RAM', label: 'RM', x: 82, y: 34, role: 'Tiền vệ cánh phải' },
      { id: 'ST', label: 'ST', x: 50, y: 15, role: 'Tiền đạo cắm' }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Áp Đảo Tuyến Giữa (Wing-backs)',
    desc: '3 trung vệ vững chắc kết hợp đôi Wing-back lên công về thủ và cặp tiền đạo song sát.',
    positions: [
      { id: 'GK', label: 'GK', x: 50, y: 90, role: 'Thủ môn' },
      { id: 'LCB', label: 'LCB', x: 26, y: 75, role: 'Trung vệ lệch trái' },
      { id: 'CCB', label: 'CB', x: 50, y: 78, role: 'Trung vệ thòng (Libero)' },
      { id: 'RCB', label: 'RCB', x: 74, y: 75, role: 'Trung vệ lệch phải' },
      { id: 'LWB', label: 'LWB', x: 12, y: 48, role: 'Chạy cánh trái (Wing-back)' },
      { id: 'RWB', label: 'RWB', x: 88, y: 48, role: 'Chạy cánh phải (Wing-back)' },
      { id: 'CDM', label: 'CDM', x: 50, y: 56, role: 'Tiền vệ mỏ neo' },
      { id: 'LCM', label: 'CM', x: 33, y: 42, role: 'Tiền vệ trung tâm trái' },
      { id: 'RCM', label: 'CM', x: 67, y: 42, role: 'Tiền vệ trung tâm phải' },
      { id: 'LST', label: 'ST', x: 37, y: 18, role: 'Tiền đạo lùi / Chạy chỗ' },
      { id: 'RST', label: 'ST', x: 63, y: 18, role: 'Tiền đạo mục tiêu (Target Man)' }
    ]
  }
};

// ==========================================
// NGÂN HÀNG CÂU HỎI QUIZ MẶC ĐỊNH
// ==========================================
const INITIAL_QUIZ_QUESTIONS = [
  {
    question: 'Đội tuyển quốc gia nào giữ kỷ lục vô địch FIFA World Cup nhiều lần nhất trong lịch sử (tính đến 2026)?',
    options: ['Đức', 'Argentina', 'Brazil', 'Ý'],
    correctIndex: 2,
    explanation: 'Đội tuyển Brazil giữ kỷ lục với 5 lần vô địch World Cup vào các năm 1958, 1962, 1970, 1994 và 2002.'
  },
  {
    question: 'Theo luật IFAB, trong tình huống nào sau đây cầu thủ đứng ở vị trí việt vị sẽ KHÔNG bị phạt việt vị khi nhận bóng trực tiếp?',
    options: [
      'Nhận bóng từ quả đá phạt trực tiếp',
      'Nhận bóng từ quả ném biên, phát bóng lên hoặc phạt góc',
      'Nhận bóng bật ra từ cột dọc sau cú sút của đồng đội',
      'Nhận bóng khi chỉ còn 1 hậu vệ đối phương đứng phía dưới'
    ],
    correctIndex: 1,
    explanation: 'Theo Luật 11 của IFAB, không có lỗi việt vị nếu cầu thủ nhận bóng trực tiếp từ quả phát bóng (goal kick), ném biên (throw-in) hoặc phạt góc (corner kick).'
  },
  {
    question: 'Đội tuyển Việt Nam đã giành chức vô địch AFF Cup lần đầu tiên vào năm nào sau bàn thắng lịch sử của Lê Công Vinh?',
    options: ['2004', '2008', '2018', '2022'],
    correctIndex: 1,
    explanation: 'Năm 2008, cú đánh đầu ngược ở phút bù giờ của Lê Công Vinh vào lưới Thái Lan tại sân Mỹ Đình đã giúp ĐT Việt Nam lần đầu vô địch Đông Nam Á.'
  },
  {
    question: 'Chỉ số "xG" trong phân tích thống kê bóng đá hiện đại là viết tắt của thuật ngữ nào?',
    options: [
      'Extra Goals (Bàn thắng phụ)',
      'Expected Goals (Bàn thắng kỳ vọng)',
      'Extreme Game (Trận đấu kịch tính)',
      'Exact Goal-line (Vạch vôi chuẩn xác)'
    ],
    correctIndex: 1,
    explanation: 'xG (Expected Goals - Bàn thắng kỳ vọng) đo lường chất lượng của một cơ hội dứt điểm dựa trên khoảng cách, góc sút, bộ phận dứt điểm và áp lực từ hậu vệ.'
  }
];

// ==========================================
// HÀM TIỆN ÍCH GỌI GEMINI API & XỬ LÝ ÂM THANH
// ==========================================
// Khóa API nằm ở backend (backend/.env), frontend chỉ gọi qua /api
const CHAT_MODEL = 'gemini-3.8-flash';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const geminiUrl = (model) => `/api/gemini/${model}`;

async function fetchWithRetry(url, options, maxRetries = 3) {
  let delay = 1000;
  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${response.status}`;
      lastError = new Error(`[${response.status}] ${msg}`);
      console.error('Gemini API lỗi:', response.status, errData);
      // Lỗi 4xx (trừ 429) là lỗi cấu hình (sai khóa, sai model...) nên không thử lại
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw lastError;
      }
    } catch (err) {
      lastError = err;
      if (err === lastError && /^\[4\d\d\]/.test(err.message) && !err.message.startsWith('[429]')) throw err;
    }
    await new Promise((res) => setTimeout(res, delay));
    delay *= 2;
  }
  throw lastError || new Error('Không thể kết nối tới máy chủ AI sau nhiều lần thử.');
}

// Chuyển đổi Base64 sang ArrayBuffer cho TTS PCM16
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Đóng gói PCM16 sang WAV Blob
function pcmToWav(pcm16, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm16.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < pcm16.length; i++, offset += 2) {
    view.setInt16(offset, pcm16[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// ==========================================
// COMPONENT HIỂN THỊ ĐỊNH DẠNG MARKDOWN ĐẸP MẮT
// ==========================================
function FormattedMessage({ text }) {
  if (!text) return null;

  // Tách các dòng để xử lý bảng, tiêu đề, danh sách
  const lines = text.split('\n');
  const elements = [];
  let tableBuffer = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  const renderInline = (str) => {
    // Xử lý in đậm **text** và `code`
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-emerald-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-slate-800 text-amber-300 rounded border border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const flushTable = (keyPrefix) => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer
      .filter((r) => !r.match(/^\s*\|[-:\s|]+\|\s*$/))
      .map((r) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim())
      );

    if (rows.length > 0) {
      const header = rows[0];
      const body = rows.slice(1);
      elements.push(
        <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-emerald-500/30 bg-slate-900/80">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-emerald-950/80 text-emerald-300 uppercase border-b border-emerald-500/30">
              <tr>
                {header.map((col, idx) => (
                  <th key={idx} className="px-3 py-2.5 font-semibold">
                    {renderInline(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-200">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableBuffer = [];
  };

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${idx}`}
            className="my-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto"
          >
            {codeBuffer.join('\n')}
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushTable(idx);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Kiểm tra dòng thuộc bảng Markdown
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      tableBuffer.push(line);
      return;
    } else if (tableBuffer.length > 0) {
      flushTable(idx);
    }

    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-base font-bold text-amber-400 mt-3 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
          {renderInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={idx} className="text-lg font-extrabold text-emerald-400 mt-4 mb-1.5 border-b border-emerald-500/20 pb-1">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={idx} className="text-xl font-black text-white mt-4 mb-2">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-emerald-400 mt-1.5 text-xs">⚽</span>
          <span className="flex-1 leading-relaxed">{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+\.)\s(.*)$/);
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 pl-1">
          <span className="font-bold text-amber-400 min-w-[1.4rem]">{match[1]}</span>
          <span className="flex-1 leading-relaxed">{renderInline(match[2])}</span>
        </div>
      );
    } else {
      elements.push(
        <p key={idx} className="leading-relaxed my-1">
          {renderInline(line)}
        </p>
      );
    }
  });

  if (tableBuffer.length > 0) {
    flushTable('end');
  }

  return <div className="space-y-0.5 text-sm sm:text-base">{elements}</div>;
}

// ==========================================
// COMPONENT CHÍNH: PITCHMIND AI
// ==========================================
export default function FootballAIChatbot() {
  // Quản lý danh sách các phiên chat
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('pitchmind_sessions_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'default-session',
        title: 'Trò chuyện Bóng đá Mở đầu',
        updatedAt: 'Hôm nay',
        messages: [
          {
            id: 'welcome-msg',
            role: 'assistant',
            personaId: 'commentator',
            text: `Xin chào người hâm mộ cuồng nhiệt của môn thể thao vua! ⚽🔥\n\nChào mừng bạn đến với **PitchMind AI — Trợ lý Bóng đá Toàn năng**. Bạn có thể hỏi tôi bất cứ điều gì về:\n- **Lịch sử & Kỷ lục:** World Cup, Champions League, Ngoại hạng Anh, La Liga, V-League, ĐTQG Việt Nam...\n- **Phân tích Chiến thuật:** Sơ đồ 4-3-3, 3-5-2, Gegenpressing, chỉ số xG, vai trò Số 9 ảo...\n- **So sánh Cầu thủ & CLB:** Đặt lên bàn cân hai siêu sao hoặc hai đội bóng bất kỳ.\n- **Luật thi đấu IFAB & VAR:** Giải đáp mọi pha bóng tranh cãi, việt vị, chạm tay trong vòng cấm.\n\nHãy chọn **Phong cách trả lời** ở thanh trên cùng hoặc bấm vào các **Gợi ý nhanh** bên dưới để bắt đầu trận cầu kiến thức ngay bây giờ!`,
            sources: []
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id || 'default-session');
  const [selectedPersonaId, setSelectedPersonaId] = useState('commentator');
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Điều hướng responsive & sidebar
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [rightTab, setRightTab] = useState('quiz'); // 'quiz' | 'tactics' | 'compare'

  // Trạng thái So sánh Cầu thủ / Đội bóng
  const [compareType, setCompareType] = useState('Cầu thủ');
  const [entityA, setEntityA] = useState('');
  const [entityB, setEntityB] = useState('');
  const [compareCriteria, setCompareCriteria] = useState('Toàn diện (Kỹ năng, Danh hiệu, Tầm ảnh hưởng)');

  // Trạng thái Sa bàn Chiến thuật
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [selectedPlayerNode, setSelectedPlayerNode] = useState(null);

  // Trạng thái Đố vui Bóng đá (Quiz)
  const [quizQuestions, setQuizQuestions] = useState(INITIAL_QUIZ_QUESTIONS);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Trạng thái Đọc giọng nói Bình luận (TTS)
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [loadingTtsId, setLoadingTtsId] = useState(null);
  const audioRef = useRef(null);

  // Trạng thái Copy & Toast
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const messagesEndRef = useRef(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  // Lưu lịch sử: LocalStorage (dự phòng) + Database qua backend
  const dbLoadedRef = useRef(false);

  // Lần đầu mở app: nạp lịch sử từ database
  useEffect(() => {
    let cancelled = false;
    fetch('/api/sessions')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setSessions(data);
          setActiveSessionId(data[0].id);
        }
        dbLoadedRef.current = true;
      })
      .catch((e) => console.warn('Chưa kết nối được database (backend chưa chạy?):', e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pitchmind_sessions_v1', JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
    if (!dbLoadedRef.current) return; // chưa nạp xong thì không ghi đè database
    const timer = setTimeout(() => {
      fetch('/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessions)
      }).catch((e) => console.warn('Lưu database lỗi:', e.message));
    }, 800);
    return () => clearTimeout(timer);
  }, [sessions]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Tạo cuộc trò chuyện mới
  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: `Hiệp đấu mới #${sessions.length + 1}`,
      updatedAt: 'Vừa xong',
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          personaId: selectedPersonaId,
          text: `Trận đấu mới đã sẵn sàng! Tôi đang ở chế độ **${currentPersona.name}**. Bạn muốn bàn luận về giải đấu, cầu thủ hay chiến thuật nào?`,
          sources: []
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setLeftDrawerOpen(false);
  };

  // Xóa một cuộc trò chuyện
  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      showToast('Cần giữ lại ít nhất 1 cuộc trò chuyện!');
      return;
    }
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Sao chép nội dung tin nhắn
  const handleCopyMessage = (id, text) => {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Phát âm thanh TTS Bình luận viên
  const handleSpeakMessage = async (msg) => {
    if (playingMessageId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingMessageId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingMessageId(null);
    }

    setLoadingTtsId(msg.id);
    try {
      const persona = PERSONAS.find((p) => p.id === msg.personaId) || currentPersona;
      // Rút gọn bớt ký tự Markdown để đọc mượt mà và giới hạn độ dài hợp lý
      const cleanText = msg.text
        .replace(/[#*`|_~]/g, '')
        .replace(/\n+/g, '. ')
        .slice(0, 750);

      const styleInstruction =
        persona.id === 'commentator'
          ? 'Đọc với giọng bình luận viên bóng đá sôi nổi, hào hứng, đầy nhiệt huyết:'
          : persona.id === 'analyst'
          ? 'Đọc với giọng chuyên gia phân tích chiến thuật điềm tĩnh, sắc sảo:'
          : 'Đọc với giọng trọng tài dứt khoát, rõ ràng, chuẩn mực:';

      const payload = {
        contents: [
          {
            parts: [{ text: `${styleInstruction} ${cleanText}` }]
          }
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: persona.voiceName || 'Fenrir' }
            }
          }
        },
        model: TTS_MODEL
      };

      const apiUrl = geminiUrl(TTS_MODEL);
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || 'audio/L16;rate=24000';

      if (audioData) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        const pcmBuffer = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmBuffer);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setPlayingMessageId(msg.id);

        audio.onended = () => {
          setPlayingMessageId(null);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setPlayingMessageId(null);
          showToast('Lỗi khi phát âm thanh bình luận.');
        };
        await audio.play();
      } else {
        showToast('Không nhận được dữ liệu giọng nói từ AI.');
      }
    } catch (error) {
      console.error(error);
      showToast('Không thể tạo giọng đọc lúc này. Vui lòng thử lại!');
    } finally {
      setLoadingTtsId(null);
    }
  };

  // Gửi câu hỏi tới Gemini API
  const sendMessage = async (customText = null) => {
    const promptToSend = (customText !== null ? customText : inputPrompt).trim();
    if (!promptToSend || isLoading) return;

    if (customText === null) {
      setInputPrompt('');
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptToSend
    };

    // Cập nhật tiêu đề phiên nếu vẫn là mặc định
    const updatedSessions = sessions.map((session) => {
      if (session.id === activeSession.id) {
        const isDefaultTitle =
          session.title.startsWith('Trò chuyện Bóng đá') || session.title.startsWith('Hiệp đấu mới');
        return {
          ...session,
          title: isDefaultTitle ? promptToSend.slice(0, 38) + (promptToSend.length > 38 ? '...' : '') : session.title,
          updatedAt: 'Vừa xong',
          messages: [...session.messages, userMsg]
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setIsLoading(true);

    try {
      // Lấy ngữ cảnh 6 tin nhắn gần nhất để cuộc trò chuyện liền mạch
      const recentHistory = activeSession.messages.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const contents = [
        ...recentHistory,
        {
          role: 'user',
          parts: [{ text: promptToSend }]
        }
      ];

      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: currentPersona.systemPrompt }]
        }
      };

      if (useSearchGrounding) {
        payload.tools = [{ google_search: {} }];
      }

      const apiUrl = geminiUrl(CHAT_MODEL);
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const candidate = result?.candidates?.[0];
      const replyText =
        candidate?.content?.parts?.[0]?.text ||
        'Trọng tài đang kiểm tra lại tín hiệu VAR! Bạn vui lòng đặt lại câu hỏi nhé.';

      let sources = [];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions
          .map((attr) => ({
            uri: attr.web?.uri,
            title: attr.web?.title
          }))
          .filter((s) => s.uri && s.title)
          .slice(0, 4);
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        personaId: selectedPersonaId,
        text: replyText,
        sources
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [...s.messages, botMsg] } : s))
      );
    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        personaId: selectedPersonaId,
        text: `⚠️ **Tín hiệu đường truyền sân vận động bị gián đoạn:** ${error.message || 'Vui lòng thử lại sau giây lát.'}`,
        sources: []
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [...s.messages, errorMsg] } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý tạo câu hỏi So sánh nhanh
  const handleRunComparison = (e) => {
    e.preventDefault();
    if (!entityA.trim() || !entityB.trim()) {
      showToast('Vui lòng nhập đầy đủ tên 2 cầu thủ hoặc đội bóng cần so sánh!');
      return;
    }
    const prompt = `Hãy đặt lên bàn cân so sánh chi tiết hai ${compareType.toLowerCase()}: **${entityA.trim()}** và **${entityB.trim()}** theo tiêu chí: ${compareCriteria}. Vui lòng lập bảng so sánh các chỉ số/tiêu chí quan trọng và đưa ra nhận định tổng kết khách quan.`;
    setRightDrawerOpen(false);
    sendMessage(prompt);
  };

  // Tạo bộ câu hỏi Đố vui Bóng đá mới bằng AI (Structured JSON Schema)
  const handleGenerateAIQuiz = async () => {
    if (isGeneratingQuiz) return;
    setIsGeneratingQuiz(true);
    try {
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: 'Tạo 4 câu hỏi trắc nghiệm bóng đá hấp dẫn bằng tiếng Việt (bao gồm World Cup, Champions League, Ngoại hạng Anh, bóng đá Việt Nam và Luật bóng đá IFAB). Đảm bảo thông tin chính xác 100%.'
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                question: { type: 'STRING' },
                options: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                correctIndex: { type: 'INTEGER' },
                explanation: { type: 'STRING' }
              },
              propertyOrdering: ['question', 'options', 'correctIndex', 'explanation']
            }
          }
        }
      };

      const apiUrl = geminiUrl(CHAT_MODEL);
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuizQuestions(parsed);
          setCurrentQuizIdx(0);
          setSelectedOption(null);
          showToast('Đã tạo bộ câu hỏi Đố vui Bóng đá mới bằng AI!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể tạo câu hỏi mới lúc này. Hãy thử lại sau!');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectQuizOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setQuizAnsweredCount((prev) => prev + 1);
    if (idx === quizQuestions[currentQuizIdx].correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setCurrentQuizIdx((prev) => (prev + 1) % quizQuestions.length);
  };

  const currentQuiz = quizQuestions[currentQuizIdx] || INITIAL_QUIZ_QUESTIONS[0];
  const currentFormationData = FORMATIONS[selectedFormation];

  return (
    <div className="min-h-screen h-screen w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none sm:select-auto">
      {/* HỌA TIẾT SÂN CỎ NỀN */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.35), transparent 60%),
            repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0px, rgba(16, 185, 129, 0.05) 45px, transparent 45px, transparent 90px)
          `
        }}
      />

      {/* THÔNG BÁO TOAST */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/95 border border-emerald-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* HEADER ĐỈNH: LOGO, CHỌN CHẾ ĐỘ & TÌM KIẾM  */}
      {/* ========================================== */}
      <header className="relative z-20 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0">
        {/* Cụm Trái: Nút Menu Mobile + Thương hiệu */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLeftDrawerOpen(!leftDrawerOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition"
            title="Lịch sử trò chuyện"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-600/30 border border-emerald-300/40">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
                  PITCHMIND AI
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  PRO 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Trợ lý AI Chiến thuật, Lịch sử & Luật Bóng đá
              </p>
            </div>
          </div>
        </div>

        {/* Cụm Giữa: Chọn 3 Phong cách trả lời (Personas) */}
        <div className="hidden md:flex items-center bg-slate-950/90 p-1 rounded-2xl border border-slate-800 gap-1">
          {PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const active = selectedPersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedPersonaId(persona.id);
                  showToast(`Đã chuyển sang phong cách: ${persona.name}`);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? `bg-gradient-to-r ${persona.color} text-white shadow-md`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{persona.name}</span>
              </button>
            );
          })}
        </div>

        {/* Cụm Phải: Bật/tắt Google Search Grounding & Mở bảng Tiện ích */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUseSearchGrounding(!useSearchGrounding);
              showToast(
                !useSearchGrounding
                  ? 'Đã BẬT tra cứu dữ liệu bóng đá trực tuyến (Google Search)'
                  : 'Đã TẮT tra cứu Google Search'
              );
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              useSearchGrounding
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Sử dụng Google Search để cập nhật dữ liệu bóng đá mới nhất"
          >
            <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-emerald-400 animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">Dữ liệu Live</span>
          </button>

          <button
            onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
            className="xl:hidden p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1 text-xs font-bold"
            title="Mở Bảng Chiến thuật & Quiz"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Quiz & Sa bàn</span>
          </button>
        </div>
      </header>

      {/* THANH CHỌN PHONG CÁCH TRÊN MOBILE */}
      <div className="md:hidden relative z-10 bg-slate-900/95 border-b border-slate-800 px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
        {PERSONAS.map((persona) => {
          const Icon = persona.icon;
          const active = selectedPersonaId === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                active
                  ? `bg-gradient-to-r ${persona.color} text-white shadow`
                  : 'text-slate-400 bg-slate-950/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{persona.name}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* BỐ CỤC 3 CỘT CHÍNH                         */}
      {/* ========================================== */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* ------------------------------------------ */}
        {/* CỘT TRÁI: LỊCH SỬ CHAT & GIẢI ĐẤU NỔI BẬT  */}
        {/* ------------------------------------------ */}
        {leftDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setLeftDrawerOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-emerald-500/20 flex flex-col transition-transform duration-300 ${
            leftDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nút Tạo Trận Đấu / Đoạn Chat Mới */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleNewSession}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo cuộc trò chuyện mới</span>
            </button>
            <button
              onClick={() => setLeftDrawerOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Danh sách Lịch sử Đoạn Chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center justify-between">
              <span>Lịch sử thảo luận</span>
              <span className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">
                {sessions.length}
              </span>
            </div>

            {sessions.map((session) => {
              const isCurrent = session.id === activeSession.id;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setLeftDrawerOpen(false);
                  }}
                  className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer border transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow'
                      : 'bg-slate-950/40 border-transparent hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare
                      className={`w-4 h-4 shrink-0 ${
                        isCurrent ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{session.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {session.messages.length} tin nhắn • {session.updatedAt}
                      </p>
                    </div>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      title="Xóa cuộc trò chuyện"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Khám phá nhanh Giải đấu */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2 mb-2 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Chuyên mục Giải đấu</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    label: '🏆 FIFA World Cup',
                    query: 'Phân tích lịch sử, thể thức hiện tại và những nhà vô địch vĩ đại nhất của FIFA World Cup.'
                  },
                  {
                    label: '⭐ UEFA Champions League',
                    query: 'Kể tên các CLB giàu truyền thống nhất UEFA Champions League và phân tích sức hấp dẫn của thể thức thi đấu hiện nay.'
                  },
                  {
                    label: '🦁 Ngoại Hạng Anh (EPL)',
                    query: 'Tại sao giải Ngoại hạng Anh (Premier League) lại là giải đấu hấp dẫn và khắc nghiệt nhất hành tinh? Phân tích lối chơi đặc trưng của nhóm Big 6.'
                  },
                  {
                    label: '🇻🇳 V-League & ĐT Việt Nam',
                    query: 'Phân tích bản sắc lối chơi của Đội tuyển Quốc gia Việt Nam và những CLB giàu thành tích nhất lịch sử V-League.'
                  },
                  {
                    label: '🇪🇸 La Liga & El Clasico',
                    query: 'Lịch sử đối đầu kinh điển Siêu kinh điển El Clasico giữa Real Madrid và Barcelona cả về danh hiệu lẫn triết lý bóng đá.'
                  }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setLeftDrawerOpen(false);
                      sendMessage(item.query);
                    }}
                    className="text-left px-3 py-2 rounded-xl bg-slate-950/60 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-emerald-300 transition flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin Phong cách AI hiện tại ở chân Sidebar */}
          <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-slate-950 to-emerald-950/50 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentPersona.badgeClass}`}>
                Đang kích hoạt
              </span>
            </div>
            <p className="text-xs font-bold text-white">{currentPersona.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {currentPersona.description}
            </p>
          </div>
        </aside>

        {/* ------------------------------------------ */}
        {/* CỘT GIỮA: KHUNG CHAT CHÍNH & QUICK PROMPTS */}
        {/* ------------------------------------------ */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50 relative">
          {/* Danh sách Tin nhắn */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-5">
            {activeSession.messages.map((msg) => {
              const isUser = msg.role === 'user';
              const msgPersona = PERSONAS.find((p) => p.id === msg.personaId) || currentPersona;
              const PersonaIcon = msgPersona.icon;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar AI */}
                  {!isUser && (
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${msgPersona.color} flex items-center justify-center shrink-0 shadow-lg mt-1`}
                    >
                      <PersonaIcon className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Bong bóng nội dung */}
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 shadow-xl ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-tr-none border border-emerald-400/30'
                        : 'bg-slate-900/95 text-slate-100 rounded-tl-none border border-slate-800'
                    }`}
                  >
                    {/* Header nhỏ trên mỗi tin nhắn của Bot */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${msgPersona.badgeClass}`}>
                            {msgPersona.name}
                          </span>
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {msgPersona.role}
                          </span>
                        </div>

                        {/* Nút Đọc Bình Luận (TTS) & Sao chép */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSpeakMessage(msg)}
                            disabled={loadingTtsId === msg.id}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                              playingMessageId === msg.id
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                            }`}
                            title="Nghe đọc bình luận bằng giọng AI"
                          >
                            {loadingTtsId === msg.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : playingMessageId === msg.id ? (
                              <Square className="w-3 h-3 fill-current" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {loadingTtsId === msg.id
                                ? 'Đang tạo mic...'
                                : playingMessageId === msg.id
                                ? 'Dừng đọc'
                                : 'Nghe BLV'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Sao chép câu trả lời"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Nội dung chính */}
                    {isUser ? (
                      <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}

                    {/* Nguồn trích dẫn Google Search (nếu có) */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/90">
                        <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <Search className="w-3 h-3 text-emerald-400" />
                          <span>Nguồn dữ liệu tham khảo trực tuyến:</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-300 truncate max-w-[220px] transition"
                            >
                              🔗 {src.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Hiệu ứng Đang xử lý */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentPersona.color} flex items-center justify-center shrink-0 shadow-lg animate-pulse`}
                >
                  <currentPersona.icon className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl rounded-tl-none px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">
                    {currentPersona.name} đang phân tích băng hình & số liệu...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Gợi ý Câu hỏi nhanh (Quick Prompts) */}
          <div className="px-3 sm:px-6 py-2 bg-slate-900/60 border-t border-slate-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gợi ý:
              </span>
              {QUICK_PROMPTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => sendMessage(item.prompt)}
                    disabled={isLoading}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950/80 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-medium text-slate-200 hover:text-emerald-300 transition shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ô Nhập Câu Hỏi Bóng Đá */}
          <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-emerald-500/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="max-w-4xl mx-auto flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={`Hỏi ${currentPersona.name} về lịch sử giải đấu, cầu thủ, sơ đồ chiến thuật hoặc luật VAR...`}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 resize-none outline-none transition"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="h-12 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-40 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition shrink-0"
              >
                <span>Sút!</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* ------------------------------------------ */}
        {/* CỘT PHẢI: QUIZ BÓNG ĐÁ, SA BÀN & SO SÁNH    */}
        {/* ------------------------------------------ */}
        {rightDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 xl:hidden"
            onClick={() => setRightDrawerOpen(false)}
          />
        )}

        <aside
          className={`fixed xl:static inset-y-0 right-0 z-40 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-emerald-500/20 flex flex-col transition-transform duration-300 ${
            rightDrawerOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
          }`}
        >
          {/* Thanh chuyển Tab tiện ích */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-1">
            <div className="flex-1 grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRightTab('quiz')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                  rightTab === 'quiz'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz</span>
              </button>
              <button
                onClick={() => setRightTab('tactics')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                  rightTab === 'tactics'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sa bàn</span>
              </button>
              <button
                onClick={() => setRightTab('compare')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                  rightTab === 'compare'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>So sánh</span>
              </button>
            </div>

            <button
              onClick={() => setRightDrawerOpen(false)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* NỘI DUNG TAB PHẢI */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ========================================== */}
            {/* TAB 1: ĐỐ VUI BÓNG ĐÁ NHANH (QUIZ)          */}
            {/* ========================================== */}
            {rightTab === 'quiz' && (
              <div className="space-y-4">
                {/* Bảng tỉ số Quiz */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-3.5 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Bảng Tỉ Số Kiến Thức
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Câu {currentQuizIdx + 1}/{quizQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/80 rounded-xl px-4 py-2.5 border border-slate-800">
                    <div>
                      <p className="text-[11px] text-slate-400">Điểm chính xác</p>
                      <p className="text-xl font-black text-emerald-400">
                        {quizScore} <span className="text-xs font-normal text-slate-500">/ {quizAnsweredCount} câu đã trả lời</span>
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateAIQuiz}
                      disabled={isGeneratingQuiz}
                      className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
                      title="Dùng Gemini AI sinh bộ câu hỏi mới"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingQuiz ? 'Đang tạo...' : 'Đề AI mới'}</span>
                    </button>
                  </div>
                </div>

                {/* Câu hỏi hiện tại */}
                <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {currentQuiz.question}
                  </h3>

                  <div className="space-y-2">
                    {currentQuiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuiz.correctIndex;
                      let btnStyle =
                        'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200';

                      if (selectedOption !== null) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                        } else {
                          btnStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>
                            <strong className="mr-2 text-amber-400">
                              {String.fromCharCode(65 + idx)}.
                            </strong>
                            {opt}
                          </span>
                          {selectedOption !== null && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {selectedOption !== null && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Giải thích đáp án */}
                  {selectedOption !== null && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
                      <p className="font-bold text-emerald-300 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Giải thích từ Trọng tài AI:</span>
                      </p>
                      <p className="leading-relaxed text-slate-300">{currentQuiz.explanation}</p>
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setRightDrawerOpen(false);
                            sendMessage(
                              `Hãy phân tích sâu hơn về chủ đề trong câu hỏi này: "${currentQuiz.question}"`
                            );
                          }}
                          className="text-[11px] font-bold text-amber-400 hover:underline"
                        >
                          Hỏi AI sâu hơn →
                        </button>
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                        >
                          Câu tiếp theo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* TAB 2: SA BÀN CHIẾN THUẬT TƯƠNG TÁC        */}
            {/* ========================================== */}
            {rightTab === 'tactics' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Chọn Sơ Đồ Đội Hình:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.keys(FORMATIONS).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          setSelectedFormation(fmt);
                          setSelectedPlayerNode(null);
                        }}
                        className={`py-2 rounded-xl text-xs font-black border transition ${
                          selectedFormation === fmt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/40'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sân cỏ SVG tương tác */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800">
                  {/* Kẻ vạch sân bóng */}
                  <svg viewBox="0 0 100 130" className="w-full h-full">
                    {/* Đường biên ngoài */}
                    <rect
                      x="4"
                      y="4"
                      width="92"
                      height="122"
                      fill="none"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="0.8"
                    />
                    {/* Đường giữa sân */}
                    <line
                      x1="4"
                      y1="65"
                      x2="96"
                      y2="65"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="0.8"
                    />
                    {/* Vòng tròn giữa sân */}
                    <circle
                      cx="50"
                      cy="65"
                      r="12"
                      fill="none"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="0.8"
                    />
                    <circle cx="50" cy="65" r="1" fill="rgba(255,255,255,0.6)" />
                    {/* Vòng cấm địa trên */}
                    <rect
                      x="22"
                      y="4"
                      width="56"
                      height="18"
                      fill="none"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="0.8"
                    />
                    {/* Vòng cấm địa dưới */}
                    <rect
                      x="22"
                      y="108"
                      width="56"
                      height="18"
                      fill="none"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="0.8"
                    />
                  </svg>

                  {/* Các vị trí cầu thủ trên sa bàn */}
                  {currentFormationData.positions.map((pos) => {
                    const isSelected = selectedPlayerNode?.id === pos.id;
                    return (
                      <button
                        key={pos.id}
                        onClick={() => setSelectedPlayerNode(pos)}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all shadow-lg ${
                          pos.id === 'GK'
                            ? 'bg-amber-400 text-slate-950 border-2 border-white'
                            : isSelected
                            ? 'bg-white text-emerald-900 scale-125 ring-4 ring-amber-400'
                            : 'bg-slate-950/90 text-emerald-300 border-2 border-emerald-400 hover:scale-110'
                        }`}
                        title={pos.role}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>

                {/* Thông tin vị trí & nút gửi AI phân tích */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-amber-400">
                    {currentFormationData.name}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedPlayerNode
                      ? `📌 Vị trí ${selectedPlayerNode.label}: ${selectedPlayerNode.role}. Bấm nút bên dưới để nhờ Chuyên gia AI phân tích sâu vị trí này!`
                      : currentFormationData.desc}
                  </p>
                  <button
                    onClick={() => {
                      setRightDrawerOpen(false);
                      setSelectedPersonaId('analyst');
                      const prompt = selectedPlayerNode
                        ? `Trong sơ đồ ${selectedFormation}, hãy phân tích chi tiết nhiệm vụ chiến thuật, cách di chuyển không bóng và những cầu thủ xuất sắc nhất thế giới ở vị trí **${selectedPlayerNode.label} (${selectedPlayerNode.role})**.`
                        : `Hãy phân tích toàn diện sơ đồ chiến thuật **${selectedFormation}** (${currentFormationData.name}): cách vận hành khi tấn công, khi phòng ngự, điểm mạnh, điểm yếu và các đội bóng tiêu biểu sử dụng sơ đồ này.`;
                      sendMessage(prompt);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>
                      {selectedPlayerNode
                        ? `Phân tích vị trí ${selectedPlayerNode.label} trong ${selectedFormation}`
                        : `Nhờ AI mổ xẻ sơ đồ ${selectedFormation}`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* TAB 3: SO SÁNH CẦU THỦ / ĐỘI BÓNG          */}
            {/* ========================================== */}
            {rightTab === 'compare' && (
              <form onSubmit={handleRunComparison} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Swords className="w-4 h-4" />
                    <span>Đặt Lên Bàn Cân So Sánh</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl">
                    {['Cầu thủ', 'Đội bóng'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setCompareType(type)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          compareType === type
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      {compareType} thứ nhất (A):
                    </label>
                    <input
                      type="text"
                      value={entityA}
                      onChange={(e) => setEntityA(e.target.value)}
                      placeholder={
                        compareType === 'Cầu thủ'
                          ? 'VD: Lionel Messi, Nguyễn Quang Hải...'
                          : 'VD: Real Madrid, Manchester City...'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      {compareType} thứ hai (B):
                    </label>
                    <input
                      type="text"
                      value={entityB}
                      onChange={(e) => setEntityB(e.target.value)}
                      placeholder={
                        compareType === 'Cầu thủ'
                          ? 'VD: Cristiano Ronaldo, Lamine Yamal...'
                          : 'VD: Barcelona, Arsenal...'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Tiêu chí phân tích:
                    </label>
                    <select
                      value={compareCriteria}
                      onChange={(e) => setCompareCriteria(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="Toàn diện (Kỹ năng, Danh hiệu, Tầm ảnh hưởng)">
                        Toàn diện (Kỹ năng, Danh hiệu, Tầm ảnh hưởng)
                      </option>
                      <option value="Phân tích Chiến thuật & Đóng góp lối chơi">
                        Phân tích Chiến thuật & Đóng góp lối chơi
                      </option>
                      <option value="Thống kê Bàn thắng, Kiến tạo & Hiệu suất đỉnh cao">
                        Thống kê Bàn thắng, Kiến tạo & Hiệu suất
                      </option>
                      <option value="Lịch sử đối đầu trực tiếp (Head-to-Head)">
                        Lịch sử đối đầu trực tiếp (Head-to-Head)
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Swords className="w-4 h-4" />
                    <span>So sánh & Lập bảng ngay</span>
                  </button>
                </div>

                {/* Các cặp đấu kinh điển gợi ý */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kèo So Sánh Kinh Điển</span>
                  </p>
                  {[
                    { a: 'Lionel Messi', b: 'Cristiano Ronaldo', type: 'Cầu thủ' },
                    { a: 'Erling Haaland', b: 'Kylian Mbappé', type: 'Cầu thủ' },
                    { a: 'Kevin De Bruyne', b: 'Luka Modrić', type: 'Cầu thủ' },
                    { a: 'Real Madrid', b: 'Manchester City', type: 'Đội bóng' }
                  ].map((pair, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setCompareType(pair.type);
                        setEntityA(pair.a);
                        setEntityB(pair.b);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center justify-between transition"
                    >
                      <span>
                        <strong className="text-white">{pair.a}</strong>{' '}
                        <span className="text-amber-400 font-bold mx-1">VS</span>{' '}
                        <strong className="text-white">{pair.b}</strong>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                        Chọn
                      </span>
                    </button>
                  ))}
                </div>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}