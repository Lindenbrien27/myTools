// Document Elements
const previewFrame = document.getElementById('previewFrame');
const copyBtn = document.getElementById('copyBtn');
const inlineCssToggle = document.getElementById('inlineCssToggle');

// Mode & Tab Controls
const modeRadios = document.querySelectorAll('input[name="codeMode"]');
const tabGroup = document.getElementById('tabGroup');
const tabBtns = document.querySelectorAll('.tab-btn');

// Textareas
const singleEditor = document.getElementById('singleEditor');
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');

// Dimension & View Elements
const workspace = document.getElementById('workspace');
const previewWidthInput = document.getElementById('previewWidth');
const previewHeightInput = document.getElementById('previewHeight');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const resetBtn = document.getElementById('resetBtn');

let currentActiveTab = 'html';
let isFullscreen = false;
let isUpdatingFromIframe = false; // Flag to stop infinite rendering loops

// Starter Placeholders
singleEditor.value = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center; }
        .box { background: #ffffff; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h2 { color: #0070f3; margin-top: 0; }
        p { color: #555555; font-size: 16px; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="box">
        <h2>Interactive Visual Canvas</h2>
        <p>This paragraph contains <b>bold text</b> and <i>italic text</i>. Try clicking here directly and changing these sentences!</p>
    </div>
</body>
</html>`;

htmlEditor.value = `<div class="box">\n    <h2>Split Components Source</h2>\n    <p>This is a <b>split template</b> structure. Click directly here to modify layout contents visually!</p>\n</div>`;
cssEditor.value = `body { font-family: Arial, sans-serif; padding: 20px; background-color: #eef2f7; text-align: center; }\n.box { background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #ddd; display: inline-block; max-width: 500px; }\nh2 { color: #28a745; }`;
jsEditor.value = `console.log("Unified preview engine is running.");`;

// THE INLINER COMPILATION ENGINE
function inlineCSS(htmlContent, cssContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const virtualStyle = doc.createElement('style');
    virtualStyle.textContent = cssContent;
    doc.head.appendChild(virtualStyle);
    
    const sheet = virtualStyle.sheet;
    if (!sheet) return htmlContent;

    const rules = Array.from(sheet.cssRules);
    rules.forEach(rule => {
        if (rule.type === CSSRule.STYLE_RULE) {
            try {
                const targets = doc.querySelectorAll(rule.selectorText);
                targets.forEach(element => {
                    let currentStyles = element.getAttribute('style') || '';
                    if (currentStyles && !currentStyles.endsWith(';')) currentStyles += ';';
                    element.setAttribute('style', currentStyles + rule.style.cssText);
                });
            } catch (e) {
                console.warn("Skipping selector rule:", rule.selectorText);
            }
        }
    });

    virtualStyle.remove();
    return doc.documentElement.outerHTML;
}

// Helper function to build a unified single-file layout string
function getCompiledCode(cleanForCopy = false) {
    const activeMode = document.querySelector('input[name="codeMode"]:checked').value;
    const shouldInline = inlineCssToggle.checked;
    
    if (activeMode === 'single') {
        if (!shouldInline || !cleanForCopy) return singleEditor.value;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(singleEditor.value, 'text/html');
        const styleTags = Array.from(doc.querySelectorAll('style'));
        let combinedCss = styleTags.map(tag => tag.textContent).join('\n');
        
        styleTags.forEach(tag => tag.remove());
        return inlineCSS(doc.documentElement.outerHTML, combinedCss);
    } else {
        if (shouldInline && cleanForCopy) {
            const baseSkeleton = `<!DOCTYPE html><html><head></head><body>${htmlEditor.value}<script>${jsEditor.value}<\/script></body></html>`;
            return inlineCSS(baseSkeleton, cssEditor.value);
        }
        
        return `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${cssEditor.value}\n</style>\n</head>\n<body>\n${htmlEditor.value}\n<script>\n${jsEditor.value}\n<\/script>\n</body>\n</html>`;
    }
}

// TWO-WAY SYNCHRONIZATION ENGINE (Iframe -> Code Editor)
function syncIframeToEditor() {
    if (isUpdatingFromIframe) return;
    isUpdatingFromIframe = true;

    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const activeMode = document.querySelector('input[name="codeMode"]:checked').value;

    if (activeMode === 'single') {
        // Create a clone to clean out the temporary contenteditable flags before saving
        const clone = doc.documentElement.cloneNode(true);
        clone.body.removeAttribute('contenteditable');
        singleEditor.value = "<!DOCTYPE html>\n" + clone.outerHTML;
    } else {
        // In split mode, extract only the inner contents of the body tag
        const innerBodyHtml = doc.body.innerHTML;
        htmlEditor.value = innerBodyHtml;
    }

    isUpdatingFromIframe = false;
}

// Compilation engine for rendering live frame layouts
function updatePreview() {
    if (isUpdatingFromIframe) return;

    const activeMode = document.querySelector('input[name="codeMode"]:checked').value;
    let frameLayout = '';

    if (activeMode === 'single') {
        frameLayout = singleEditor.value;
    } else {
        frameLayout = `<!DOCTYPE html><html><head><style>${cssEditor.value}</style></head><body>${htmlEditor.value}<script>${jsEditor.value}<\/script></body></html>`;
    }

    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(frameLayout);
    doc.close();

    // Make the content editable and hook the text monitor events
    doc.body.setAttribute('contenteditable', 'true');
    doc.body.addEventListener('input', syncIframeToEditor);
}

// DIMENSIONS & VIEW ACTIONS LOGIC
function applyCustomDimensions() {
    const w = previewWidthInput.value;
    const h = previewHeightInput.value;
    previewFrame.style.width = w ? `${w}px` : '100%';
    previewFrame.style.height = h ? `${h}px` : '100%';
}

previewWidthInput.addEventListener('input', applyCustomDimensions);
previewHeightInput.addEventListener('input', applyCustomDimensions);

// Toggle Full Screen Workspace Mode
fullscreenBtn.addEventListener('click', () => {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
        workspace.classList.add('fullscreen-active');
        fullscreenBtn.innerText = '🗗 Exit Full Screen';
    } else {
        workspace.classList.remove('fullscreen-active');
        fullscreenBtn.innerText = '⛶ Full Screen';
    }
});

// Reset Frame Viewport back to Default
resetBtn.addEventListener('click', () => {
    previewWidthInput.value = '';
    previewHeightInput.value = '';
    previewFrame.style.width = '100%';
    previewFrame.style.height = '100%';
    
    if (isFullscreen) {
        isFullscreen = false;
        workspace.classList.remove('fullscreen-active');
        fullscreenBtn.innerText = '⛶ Full Screen';
    }
});

// Handle Mode Switching (Single vs Split)
modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'single') {
            tabGroup.classList.add('hidden');
            singleEditor.classList.remove('hidden');
            htmlEditor.classList.add('hidden');
            cssEditor.classList.add('hidden');
            jsEditor.classList.add('hidden');
        } else {
            tabGroup.classList.remove('hidden');
            singleEditor.classList.add('hidden');
            switchTab(currentActiveTab);
        }
        updatePreview();
    });
});

// Handle Tab Switching inside Split View
function switchTab(tabName) {
    currentActiveTab = tabName;
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    htmlEditor.classList.add('hidden');
    cssEditor.classList.add('hidden');
    jsEditor.classList.add('hidden');

    if (tabName === 'html') htmlEditor.classList.remove('hidden');
    if (tabName === 'css') cssEditor.classList.remove('hidden');
    if (tabName === 'js') jsEditor.classList.remove('hidden');
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
});

// Real-time listener for typing changes in textareas
[singleEditor, htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('input', updatePreview);
});

// Copy Action Listener
copyBtn.addEventListener('click', async () => {
    const fullCodePayload = getCompiledCode(true); // passing 'true' outputs optimized production styles

    try {
        await navigator.clipboard.writeText(fullCodePayload);
        
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied! ✅';
        copyBtn.style.backgroundColor = '#1e7e34';
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = '#28a745';
        }, 2000);
    } catch (err) {
        alert('Could not copy automatically. Please copy text manually.');
    }
});

// Initialize workspace load layout
updatePreview();