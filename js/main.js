/**
 * main.js
 * Lógica compartida por todas las páginas:
 * - Dibuja el encabezado (con el menú y el selector de idioma) y el pie de página.
 * - Controla el menú desplegable en pantallas pequeñas.
 * - Dibuja los enlaces "Sección anterior / siguiente".
 * - Controla el botón "Marcar sección como leída" (progreso del viajero).
 * - Ofrece utilidades comunes: rutas, formato de números, texto y fecha del juego.
 *
 * Requiere: js/storage.js y js/language.js (en <head>) y data/site-content.js.
 *
 * Cada página indica en <body> dónde está la raíz del sitio y cuál es su sección:
 *   <body data-root="../" data-page="equipos">
 */

/* ---------- Datos de la página actual ---------- */
const PAGE_ROOT = document.body.dataset.root || './';
const CURRENT_PAGE = document.body.dataset.page || 'inicio';

/** Hora local (24 h) a la que el juego reinicia las actividades diarias. */
const GAME_RESET_HOUR = 4;

/* ---------- Utilidades comunes ---------- */

/**
 * Convierte una ruta relativa a la raíz del sitio en una ruta válida desde la página actual.
 * @param {string} relativePath - Ruta desde la raíz (por ejemplo, 'pages/pity.html').
 * @returns {string} Ruta lista para usar en href o src.
 */
function buildPath(relativePath) {
    return PAGE_ROOT + relativePath;
}

/**
 * Da formato a un número con separadores de miles (por ejemplo, 8362650 -> "8,362,650").
 * @param {number} value - Número a formatear.
 * @returns {string} Número con formato.
 */
function formatNumber(value) {
    return Math.round(value).toLocaleString('en-US');
}

/**
 * Pasa un texto a minúsculas y le quita los acentos para comparar sin errores.
 * Ejemplo: "Exploración" -> "exploracion".
 * @param {string} text - Texto original.
 * @returns {string} Texto normalizado.
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

/**
 * Devuelve la "fecha del juego": la fecha actual menos la hora de reinicio.
 * Así, a las 2:00 a. m. del martes todavía cuenta como lunes para el juego.
 * @param {Date} [date] - Fecha de referencia (por defecto, ahora).
 * @returns {Date} Fecha desplazada.
 */
function getGameDate(date = new Date()) {
    return new Date(date.getTime() - GAME_RESET_HOUR * 60 * 60 * 1000);
}

/**
 * Convierte una fecha en una clave de texto "AAAA-MM-DD" (hora local).
 * @param {Date} date - Fecha a convertir.
 * @returns {string} Clave de la fecha.
 */
function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/* ---------- Encabezado y menú ---------- */

/** Dibuja el encabezado del sitio dentro de <header id="site-header">. */
function renderSiteHeader() {
    const headerElement = document.getElementById('site-header');
    if (!headerElement) {
        return;
    }

    const homeLink = { slug: 'inicio', title: { en: 'Home', es: 'Inicio' }, path: 'index.html' };
    const navigationLinks = [homeLink, ...SITE_SECTIONS, ...EXTRA_PAGES];

    const linksMarkup = navigationLinks.map((link) => {
        const isActive = link.slug === CURRENT_PAGE;
        const activeClass = isActive ? ' is-active' : '';
        const ariaCurrent = isActive ? ' aria-current="page"' : '';
        return `<li><a class="site-nav__link${activeClass}"${ariaCurrent} href="${buildPath(link.path)}">${translated(link.title)}</a></li>`;
    }).join('');

    headerElement.innerHTML = `
        <div class="site-header__inner">
            <a class="brand" href="${buildPath('index.html')}">
                <span class="brand__star" aria-hidden="true">✦</span>
                <span class="brand__text">
                    <span class="brand__name">Manual del AR Chikito</span>
                    <span class="brand__tagline">${bilingual('Teyvat survival guide', 'Guía de supervivencia de Teyvat')}</span>
                </span>
            </a>
            <div class="site-header__actions">
                <div class="language-switch" role="group" aria-label="Language / Idioma">
                    <button class="language-switch__option" type="button" data-language="en" lang="en" aria-pressed="false">EN</button>
                    <button class="language-switch__option" type="button" data-language="es" lang="es" aria-pressed="false">ES</button>
                </div>
                <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
                    <span class="nav-toggle__bar"></span>
                    <span class="nav-toggle__bar"></span>
                    <span class="nav-toggle__bar"></span>
                    <span class="visually-hidden">${bilingual('Open menu', 'Abrir menú')}</span>
                </button>
            </div>
        </div>
        <nav id="site-nav" class="site-nav" aria-label="Menu" data-aria-label-en="Manual sections" data-aria-label-es="Secciones del manual">
            <ul class="site-nav__list">${linksMarkup}</ul>
        </nav>
    `;
}

/** Abre y cierra el menú en pantallas pequeñas. */
function setupMobileNavigation() {
    const toggleButton = document.querySelector('.nav-toggle');
    const navigation = document.getElementById('site-nav');
    if (!toggleButton || !navigation) {
        return;
    }

    function setMenuOpen(isOpen) {
        navigation.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', String(isOpen));
    }

    toggleButton.addEventListener('click', () => {
        const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!isOpen);
    });

    // Cierra el menú al elegir una sección o al presionar Escape
    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });
}

/**
 * Los botones de idioma llevan lang="en"/"es" para que los lectores de pantalla
 * los pronuncien bien, pero deben verse siempre. Por eso usan data-language
 * y el CSS los excluye de la regla que oculta el otro idioma.
 */
function setupLanguageSwitch() {
    document.querySelectorAll('[data-language]').forEach((languageButton) => {
        languageButton.addEventListener('click', () => {
            setLanguage(languageButton.dataset.language);
        });
    });
}

/* ---------- Pie de página ---------- */

/** Dibuja el pie de página dentro de <footer id="site-footer">. */
function renderSiteFooter() {
    const footerElement = document.getElementById('site-footer');
    if (!footerElement) {
        return;
    }

    footerElement.innerHTML = `
        <div class="site-footer__inner container">
            <div class="site-footer__column site-footer__column--about">
                <h2 class="site-footer__title">Manual del AR Chikito</h2>
                <p>${bilingual(
                    "A survival guide for travelers from AR 1 to AR 45. It's not a wiki or a competitive guide: it's the veteran friend who tells you what you're doing wrong and helps you fix it.",
                    'Guía de supervivencia para viajeros de AR 1 a AR 45. No es una wiki ni una guía competitiva: es la amiga veterana que te dice qué estás haciendo mal y te ayuda a arreglarlo.'
                )}</p>
                <p><strong>${bilingual('Last update:', 'Última actualización:')}</strong> ${translated(SITE_INFO.lastUpdate)}<br>
                <strong>${bilingual('Reference version:', 'Versión de referencia:')}</strong> ${SITE_INFO.gameVersion}.
                ${bilingual('Some recommendations depend on the game version.', 'Algunas recomendaciones dependen de la versión del juego.')}</p>
            </div>
            <div class="site-footer__column">
                <h2 class="site-footer__title">${bilingual('Sources', 'Fuentes')}</h2>
                <ul class="site-footer__list">
                    <li><a href="https://wiki.hoyolab.com/pc/genshin/entry/" target="_blank" rel="noopener">HoYoWiki</a></li>
                    <li><a href="https://keqingmains.com/" target="_blank" rel="noopener">KeqingMains</a></li>
                    <li><a href="https://act.hoyolab.com/ys/app/interactive-map/" target="_blank" rel="noopener">${bilingual('HoYoLAB interactive map', 'Mapa interactivo de HoYoLAB')}</a></li>
                    <li><a href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki" target="_blank" rel="noopener">Genshin Impact Wiki</a></li>
                    <li><a href="https://www.hoyolab.com/" target="_blank" rel="noopener">HoYoLAB</a></li>
                </ul>
            </div>
        </div>
        <div class="site-footer__legal">
            <p>${bilingual(
                'Unofficial fan project, not affiliated with HoYoverse. Genshin Impact, its characters and images are property of HoYoverse.',
                'Proyecto de fans no oficial, sin afiliación con HoYoverse. Genshin Impact, sus personajes e imágenes son propiedad de HoYoverse.'
            )}</p>
            <p class="site-footer__author">${bilingual('Created by', 'Creado por')} Leidy Miriam Morayta Pérez</p>
            <p class="site-footer__signature">Manual del AR Chikito · ${bilingual('Made by and for travelers', 'Hecho por y para viajeros')}</p>
        </div>
    `;
}

/* ---------- Paginación entre secciones ---------- */

/** Dibuja los enlaces a la sección anterior y siguiente en <nav id="section-pagination">. */
function renderSectionPagination() {
    const paginationElement = document.getElementById('section-pagination');
    if (!paginationElement) {
        return;
    }

    const currentIndex = SITE_SECTIONS.findIndex((section) => section.slug === CURRENT_PAGE);
    const homeLink = { title: { en: 'Home', es: 'Inicio' }, path: 'index.html' };
    const previousSection = currentIndex > 0 ? SITE_SECTIONS[currentIndex - 1] : homeLink;
    const nextSection = currentIndex < SITE_SECTIONS.length - 1 ? SITE_SECTIONS[currentIndex + 1] : homeLink;

    paginationElement.innerHTML = `
        <a class="pagination-link" href="${buildPath(previousSection.path)}">
            <span class="pagination-link__label">${bilingual('← Previous', '← Anterior')}</span>
            <span class="pagination-link__title">${translated(previousSection.title)}</span>
        </a>
        <a class="pagination-link pagination-link--next" href="${buildPath(nextSection.path)}">
            <span class="pagination-link__label">${bilingual('Next →', 'Siguiente →')}</span>
            <span class="pagination-link__title">${translated(nextSection.title)}</span>
        </a>
    `;
}

/* ---------- Progreso: secciones leídas ---------- */

/**
 * Devuelve la lista de secciones marcadas como leídas.
 * @returns {string[]} Slugs de las secciones leídas.
 */
function getReadSections() {
    return loadData(STORAGE_KEYS.readSections, []);
}

/** Controla el botón "Marcar sección como leída" (si existe en la página). */
function setupMarkAsReadButton() {
    const markReadButton = document.getElementById('mark-read-button');
    if (!markReadButton) {
        return;
    }

    function updateButton() {
        const isRead = getReadSections().includes(CURRENT_PAGE);
        markReadButton.setAttribute('aria-pressed', String(isRead));
        markReadButton.innerHTML = isRead
            ? bilingual('✓ Section read', '✓ Sección leída')
            : bilingual('Mark section as read', 'Marcar sección como leída');
    }

    markReadButton.addEventListener('click', () => {
        const readSections = getReadSections();
        const updatedSections = readSections.includes(CURRENT_PAGE)
            ? readSections.filter((slug) => slug !== CURRENT_PAGE)
            : [...readSections, CURRENT_PAGE];

        saveData(STORAGE_KEYS.readSections, updatedSections);
        updateButton();
    });

    updateButton();
}

/** Escribe la fecha de actualización en los elementos con [data-last-update]. */
function fillLastUpdateLabels() {
    document.querySelectorAll('[data-last-update]').forEach((element) => {
        element.innerHTML = bilingual(
            `Updated: ${SITE_INFO.lastUpdate.en} · Version ${SITE_INFO.gameVersion}`,
            `Actualizado: ${SITE_INFO.lastUpdate.es} · Versión ${SITE_INFO.gameVersion}`
        );
    });
}

/* ---------- Inicio ---------- */
renderSiteHeader();
setupMobileNavigation();
setupLanguageSwitch();
renderSiteFooter();
renderSectionPagination();
setupMarkAsReadButton();
fillLastUpdateLabels();
setLanguage(getLanguage());
