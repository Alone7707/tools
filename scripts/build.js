const { exec } = require('child_process');
const path = require('path');

console.log('🚀 开始构建应用...');

const buildCommands = [
  'npm run lint',
  'npm run test',
  'electron-builder'
];

let currentCommand = 0;

function runNextCommand() {
  if (currentCommand >= buildCommands.length) {
    console.log('✅ 构建完成！');
    return;
  }

  const command = buildCommands[currentCommand];
  console.log(`📦 执行: ${command}`);
  
  const child = exec(command, {
    cwd: path.join(__dirname, '..')
  });

  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  child.on('close', (code) => {
    if (code === 0) {
      currentCommand++;
      runNextCommand();
    } else {
      console.error(`❌ 构建失败，命令 "${command}" 返回代码 ${code}`);
      process.exit(1);
    }
  });
}

runNextCommand();