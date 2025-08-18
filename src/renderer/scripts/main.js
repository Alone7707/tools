// 渲染进程主脚本
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    initializeApp();
});

async function initializeApp() {
    // 设置系统信息
    await setupSystemInfo();
    
    // 设置导航
    setupNavigation();
    
    // 设置窗口控制
    setupWindowControls();
    
    // 设置文件管理
    setupFileManager();
    
    console.log('🚀 Electron Tools 渲染进程已加载');
}

async function setupSystemInfo() {
    if (window.electronAPI?.systemInfo) {
        const info = window.electronAPI.systemInfo;
        document.getElementById('app-version').textContent = '1.0.0';
        document.getElementById('system-platform').textContent = info.platform;
        document.getElementById('uptime').textContent = new Date().toLocaleTimeString();
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // 添加活动状态
            link.classList.add('active');
            const targetId = link.getAttribute('href').substring(1);
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
}

function setupWindowControls() {
    if (window.electronAPI?.windowControls) {
        const controls = window.electronAPI.windowControls;
        
        document.querySelector('.btn-minimize')?.addEventListener('click', () => {
            controls.minimize();
        });
        
        document.querySelector('.btn-maximize')?.addEventListener('click', () => {
            controls.maximize();
        });
        
        document.querySelector('.btn-close')?.addEventListener('click', () => {
            controls.close();
        });
    }
}

function setupFileManager() {
    const selectFileBtn = document.getElementById('select-file');
    const fileContent = document.getElementById('file-content');
    
    if (selectFileBtn && window.electronAPI?.fileOperations) {
        selectFileBtn.addEventListener('click', async () => {
            try {
                const result = await window.electronAPI.fileOperations.openFile();
                if (result.success) {
                    fileContent.innerHTML = `<pre>${result.content}</pre>`;
                }
            } catch (error) {
                console.error('文件操作失败:', error);
                fileContent.innerHTML = `<p style="color: red;">错误: ${error.message}</p>`;
            }
        });
    }
}