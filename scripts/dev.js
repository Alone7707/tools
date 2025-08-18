const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动开发模式...');

const electronProcess = spawn('electron', ['.'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

electronProcess.on('close', (code) => {
  console.log(`开发模式已退出，代码: ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  electronProcess.kill('SIGINT');
});