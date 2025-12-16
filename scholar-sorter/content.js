// content.js - 引用数全数字修复版

let allArticlesData = [];
let isProcessing = false;
let stopSignal = false;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    if (document.querySelector('#gs_deep_sort_container')) return;

    const toolbar = document.querySelector('#gs_ab_md');
    
    // UI 部分
    const container = document.createElement('div');
    container.id = 'gs_deep_sort_container';
    container.style.marginTop = '10px';
    container.style.padding = '10px';
    container.style.backgroundColor = '#f8f9fa';
    container.style.borderRadius = '8px';
    container.style.border = '1px solid #dadce0';

    const btnArea = document.createElement('div');
    const startBtn = createButton('🚀 抓取20页并排序 ', '#1a73e8');
    const stopBtn = createButton('⏹ 停止', '#d93025');
    stopBtn.style.display = 'none';

    const progressArea = document.createElement('div');
    progressArea.style.marginTop = '8px';
    progressArea.style.display = 'none';
    
    const progressText = document.createElement('div');
    progressText.id = 'gs_progress_text';
    progressText.style.fontSize = '12px';
    progressText.style.marginBottom = '5px';
    progressText.style.color = '#202124';
    progressText.innerText = '准备就绪...';

    const progressBarBg = document.createElement('div');
    progressBarBg.style.width = '100%';
    progressBarBg.style.height = '8px';
    progressBarBg.style.backgroundColor = '#e8eaed';
    progressBarBg.style.borderRadius = '4px';
    progressBarBg.style.overflow = 'hidden';

    const progressBarFill = document.createElement('div');
    progressBarFill.id = 'gs_progress_fill';
    progressBarFill.style.width = '0%';
    progressBarFill.style.height = '100%';
    progressBarFill.style.backgroundColor = '#1a73e8';
    progressBarFill.style.transition = 'width 0.3s ease';

    progressBarBg.appendChild(progressBarFill);
    progressArea.appendChild(progressText);
    progressArea.appendChild(progressBarBg);

    startBtn.addEventListener('click', async () => {
        if (isProcessing) return;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        progressArea.style.display = 'block';
        await startDeepSort(20); 
    });

    stopBtn.addEventListener('click', () => {
        stopSignal = true;
        stopBtn.innerText = '正在停止...';
    });

    btnArea.appendChild(startBtn);
    btnArea.appendChild(stopBtn);
    container.appendChild(btnArea);
    container.appendChild(progressArea);

    const parent = document.querySelector('#gs_res_ccl_mid');
    if(parent) {
        parent.insertBefore(container, parent.firstChild);
    } else if (toolbar) {
        toolbar.appendChild(container);
    }
}

function createButton(text, color) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.style.padding = '6px 16px';
    btn.style.marginRight = '10px';
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = color;
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.fontSize = '13px';
    btn.style.fontWeight = '500';
    return btn;
}

async function startDeepSort(targetPages) {
    isProcessing = true;
    stopSignal = false;
    allArticlesData = [];
    
    const progressFill = document.getElementById('gs_progress_fill');
    const progressText = document.getElementById('gs_progress_text');
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('start');

    for (let i = 0; i < targetPages; i++) {
        if (stopSignal) break;

        const start = i * 10;
        const progressPercent = Math.min(((i + 1) / targetPages) * 100, 95);
        progressFill.style.width = `${progressPercent}%`;
        progressText.innerText = `正在读取第 ${i + 1} / ${targetPages} 页...`;
        
        currentUrl.searchParams.set('start', start);
        
        try {
            const response = await fetch(currentUrl.toString());
            if (response.status === 429) {
                progressText.innerHTML = `<span style="color:#d93025;">❌ 访问过频 (HTTP 429)</span>`;
                isProcessing = false;
                return;
            }
            const text = await response.text();
            if (text.includes("CAPTCHA") || text.includes("recaptcha")) {
                progressText.innerHTML = `<span style="color:#d93025;">⚠️ 触发验证码，已停止。</span>`;
                isProcessing = false;
                return;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const articles = extractArticlesFromDoc(doc);
            allArticlesData.push(...articles);

            // 延时
            let delay = 1500 + Math.random() * 2000;
            if ((i + 1) % 5 === 0 && i !== targetPages - 1) {
                progressText.innerText += ` (长休息...)`;
                delay += 5000; 
            }
            if (i < targetPages - 1) await sleep(delay);

        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    progressFill.style.width = '100%';
    progressText.innerText = `排序中...`;
    
    allArticlesData.sort((a, b) => b.citations - a.citations);
    renderSortedResults();
    
    progressText.innerHTML = `<span style="color:#137333;">✅ 完成！请检查红色数字是否正确。</span>`;
    isProcessing = false;
}

function extractArticlesFromDoc(doc) {
    const elements = Array.from(doc.querySelectorAll('.gs_r.gs_or.gs_scl'));
    return elements.map(el => {
        const count = getCitationCount(el);
        
        // Debug Tag
        const titleLink = el.querySelector('h3.gs_rt');
        if (titleLink) {
            const oldTag = titleLink.querySelector('.gs-ref-debug');
            if (oldTag) oldTag.remove();

            const debugTag = document.createElement('span');
            debugTag.className = 'gs-ref-debug';
            debugTag.style.color = '#d93025';
            debugTag.style.fontWeight = 'bold';
            debugTag.style.fontSize = '13px';
            debugTag.style.marginRight = '6px';
            debugTag.innerText = `[Ref: ${count}]`;
            titleLink.insertBefore(debugTag, titleLink.firstChild);
        }
        
        return {
            html: el.outerHTML,
            citations: count
        };
    });
}

// --- 核心修复区域 ---
function getCitationCount(element) {
    const text = element.innerText;
    
    // 正则逻辑升级：
    // 1. (?: ... ) 匹配前缀 (Cited by, 被引用次数 等)
    // 2. \s*:?\s* 忽略冒号和空格
    // 3. (\d[\d,]*) 关键修改在这里！
    //    \d      : 必须以数字开头
    //    [\d,]* : 后面跟随任意数量的“数字”或“逗号”
    //    这个组合可以匹配 "3934", "1,234", "10", "12,345,678" 等所有情况
    
    const regex = /(?:Cited by|Cite by|Cited|被引用次数|被引用次數|被引用|引用)\s*:?\s*(\d[\d,]*)/i;
    
    const match = text.match(regex);
    if (match && match[1]) {
        // 拿到类似 "3934" 或 "1,234" 的字符串，去掉逗号转数字
        const cleanNumber = match[1].replace(/,/g, '');
        return parseInt(cleanNumber, 10);
    }
    return 0;
}

function renderSortedResults() {
    const mainContainer = document.querySelector('#gs_res_ccl_mid');
    if (!mainContainer) return;
    mainContainer.innerHTML = '';

    const info = document.createElement('div');
    info.style.padding = '12px';
    info.style.marginBottom = '15px';
    info.style.backgroundColor = '#e6f4ea';
    info.style.color = '#137333';
    info.innerHTML = `📊 <b>结果已排序</b> (共 ${allArticlesData.length} 条) - 修复了大数字截断问题`;
    mainContainer.appendChild(info);

    allArticlesData.forEach(item => {
        mainContainer.insertAdjacentHTML('beforeend', item.html);
    });
    
    const endNote = document.createElement('div');
    endNote.innerText = '--- 到底了 ---';
    endNote.style.textAlign = 'center';
    endNote.style.padding = '30px';
    mainContainer.appendChild(endNote);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}