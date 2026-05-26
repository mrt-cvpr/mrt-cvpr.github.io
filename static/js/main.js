// Tab switcher
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tabs').forEach(group => {
        const tabs = group.querySelectorAll('.tab');
        const container = group.closest('.tab-group');
        if (!container) return;
        const panels = container.querySelectorAll('.tab-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const panel = container.querySelector(`#${target}`);
                if (panel) panel.classList.add('active');
            });
        });
    });

    // BibTeX copy
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const code = document.querySelector('.bibtex pre').innerText;
            try {
                await navigator.clipboard.writeText(code);
                const original = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = original; }, 1400);
            } catch (e) {
                console.error('Copy failed', e);
            }
        });
    }
});
