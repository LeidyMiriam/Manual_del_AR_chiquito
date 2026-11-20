/**
 * home.js
 * Funciones exclusivas de la página de inicio:
 * - Consejo de la veterana (rota entre varios consejos).
 * - Progreso de lectura: muestra qué secciones del manual ya se leyeron.
 *
 * Requiere: data/site-content.js, js/storage.js, js/language.js y js/main.js.
 */

/* ---------- Consejo de la veterana ---------- */

/** Muestra un consejo y permite pasar al siguiente con un botón. */
function setupVeteranTips() {
    const tipTitle = document.getElementById('veteran-tip-title');
    const tipText = document.getElementById('veteran-tip-text');
    const nextTipButton = document.getElementById('next-tip-button');
    if (!tipTitle || !tipText || !nextTipButton) {
        return;
    }

    let currentTipIndex = 0;

    function showTip(tipIndex) {
        const tip = VETERAN_TIPS[tipIndex];
        tipTitle.innerHTML = translated(tip.title);
        tipText.innerHTML = translated(tip.text);
    }

    nextTipButton.addEventListener('click', () => {
        currentTipIndex = (currentTipIndex + 1) % VETERAN_TIPS.length;
        showTip(currentTipIndex);
    });

    showTip(currentTipIndex);
}

/* ---------- Progreso de lectura ---------- */

/** Dibuja las tarjetas de las 8 secciones y la barra de progreso de lectura. */
function renderReadingProgress() {
    const sectionGrid = document.getElementById('section-grid');
    const progressBar = document.getElementById('reading-progress-bar');
    const progressCount = document.getElementById('reading-progress-count');
    if (!sectionGrid || !progressBar || !progressCount) {
        return;
    }

    const readSections = getReadSections();

    sectionGrid.innerHTML = SITE_SECTIONS.map((section) => {
        const isRead = readSections.includes(section.slug);
        return `
            <a class="section-card${isRead ? ' is-read' : ''}" href="${buildPath(section.path)}">
                <span class="section-card__status badge badge--free">${bilingual('✓ Read', '✓ Leída')}</span>
                <span class="section-card__number">${section.number}</span>
                <span class="section-card__title">${translated(section.title)}</span>
                <span class="section-card__summary">${translated(section.summary)}</span>
            </a>
        `;
    }).join('');

    const readCount = SITE_SECTIONS.filter((section) => readSections.includes(section.slug)).length;
    progressBar.style.width = `${(readCount / SITE_SECTIONS.length) * 100}%`;
    progressCount.textContent = `${readCount}/${SITE_SECTIONS.length}`;
}

/* ---------- Inicio ---------- */
setupVeteranTips();
renderReadingProgress();
