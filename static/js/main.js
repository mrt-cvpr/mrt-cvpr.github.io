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


// Floating sidebar with dynamic positioning.
// Behavior on wide viewports (>=1580px):
//   (1) When Results' tab-group is first scrolled into view, the sidebar
//       sits at the top of the tab-group, aligned with the section title.
//   (2) As the user scrolls down the sidebar slides down the viewport
//       (still following the tab-group's top) until it reaches the
//       vertical middle of the viewport.
//   (3) From there it parks at the middle while panels scroll past.
//   (4) When the tab-group's bottom approaches, the sidebar rides out
//       with it instead of disappearing in the middle.
// On narrow viewports the sidebar collapses to an inline row above the
// panels (handled entirely in CSS).
(() => {
    const sidebar = document.querySelector('.tabs.sidebar');
    const tabgroup = document.querySelector('.results-tabgroup');
    const container = document.querySelector('#results > .container');
    if (!sidebar || !tabgroup || !container) return;
    const SIDEBAR_GAP = 32;
    const WIDE_BREAKPOINT = 1580;

    const title = document.querySelector('#results .section-title');

    function update() {
        if (window.innerWidth < WIDE_BREAKPOINT) {
            sidebar.classList.remove('is-floating');
            sidebar.style.top = '';
            sidebar.style.left = '';
            return;
        }
        const tg = tabgroup.getBoundingClientRect();
        const vh = window.innerHeight;
        // Hide while #results is entirely above/below the viewport.
        if (tg.bottom < 0 || tg.top > vh) {
            sidebar.classList.remove('is-floating');
            return;
        }
        sidebar.classList.add('is-floating');
        const sh = sidebar.offsetHeight;
        const middle = Math.max(24, (vh - sh) / 2);
        // Anchor to the title so the sidebar appears at the same height as
        // the title when the section first scrolls in. Once the title has
        // climbed past the vertical middle, park the sidebar at the middle.
        const titleTop = title ? title.getBoundingClientRect().top : tg.top;
        // Cap by the bottom of the tab-group so the sidebar rides out with
        // the section instead of disappearing mid-screen.
        const maxTop = tg.bottom - sh - 24;
        const top = Math.min(Math.max(titleTop, middle), maxTop);
        // Horizontal: align with the left gutter outside the centered container.
        const cRect = container.getBoundingClientRect();
        const left = Math.max(16, cRect.left - sidebar.offsetWidth - SIDEBAR_GAP);
        sidebar.style.top = top + 'px';
        sidebar.style.left = left + 'px';
    }

    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    update();
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
