// Chạy backend và frontend cùng lúc bằng một lệnh: npm run dev
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (name, dir) => {
  const p = spawn('npm', ['run', 'dev'], { cwd: path.join(root, dir), shell: true, stdio: 'inherit' });
  p.on('exit', (code) => {
    console.log(`[${name}] đã dừng (mã ${code})`);
    process.exit(code ?? 0);
  });
  return p;
};
run('backend', 'backend');
run('frontend', 'frontend');
