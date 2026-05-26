// Don't restore scroll on reload, and strip any leftover hash on load
// so a stuck #results (etc.) doesn't auto-jump on refresh.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
}

// Hero nav anchors: smooth scroll without writing the hash to the URL.
document.querySelectorAll('.hero a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
});

// Show floating sidebar only while the viewport is actually inside #results
// (the section's bounds straddle the middle of the viewport), so it does
// not bleed into the adjacent Overflow / Efficiency sections.
(() => {
    const sidebar = document.querySelector('.tabs.sidebar');
    const target = document.querySelector('#results');
    if (!sidebar || !target) return;
    const check = () => {
        const rect = target.getBoundingClientRect();
        const middle = window.innerHeight / 2;
        const inside = rect.top <= middle && rect.bottom >= middle;
        sidebar.classList.toggle('is-visible', inside);
    };
    window.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    check();
})();

// Tab switcher
(() => {

    document.querySelectorAll('.tabs').forEach(group => {
        const tabs = group.querySelectorAll('.tab');
        const container = group.closest('.tab-group');
        if (!container) return;
        const panels = container.querySelectorAll('.tab-panel');
        const resultsSection = document.querySelector('#results');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const panel = container.querySelector(`#${target}`);
                if (panel) panel.classList.add('active');
                // Jump back to the top of the Results section so the user
                // sees the new panel from the start instead of mid-scroll.
                if (resultsSection) {
                    resultsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
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
})();
