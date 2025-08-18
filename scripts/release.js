const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

console.log(`🚀 发布版本 ${packageJson.version}...`);

const releaseSteps = [
  {
    name: '代码检查',
    command: 'npm run lint'
  },
  {
    name: '运行测试',
    command: 'npm run test'
  },
  {
    name: '构建应用',
    command: 'npm run build'
  },
  {
    name: '创建发布包',
    command: 'electron-builder --publish=never'
  }
];

async function runRelease() {
  for (const step of releaseSteps) {
    console.log(`📦 ${step.name}...`);
    
    try {
      await new Promise((resolve, reject) => {
        const child = exec(step.command, {
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
            console.log(`✅ ${step.name} 完成`);
            resolve();
          } else {
            reject(new Error(`${step.name} 失败`));
          }
        });
      });
    } catch (error) {
      console.error(`❌ 发布失败: ${error.message}`);
      process.exit(1);
    }
  }
  
  console.log('🎉 发布完成！');
}

runRelease();