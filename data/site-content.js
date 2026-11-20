/**
 * site-content.js
 * Contenido general que se reutiliza en varias páginas:
 * datos de mantenimiento, secciones del manual (menú y paginación),
 * páginas extra del menú y consejos de la veterana.
 *
 * Los textos visibles se escriben como { en, es } (ver js/language.js).
 */

/** Fecha de la última revisión del contenido y versión del juego de referencia. */
const SITE_INFO = {
    lastUpdate: { en: 'November 19, 2026', es: '19 de noviembre de 2026' },
    gameVersion: '7.2'
};

/**
 * Secciones del manual en orden de lectura.
 * path es relativo a la raíz del sitio.
 */
const SITE_SECTIONS = [
    {
        slug: 'primeros-pasos',
        number: '01',
        title: { en: 'First steps', es: 'Primeros pasos' },
        summary: { en: 'AR and basic systems', es: 'AR y sistemas básicos' },
        path: 'pages/primeros-pasos.html'
    },
    {
        slug: 'equipos',
        number: '02',
        title: { en: 'Teams', es: 'Equipos' },
        summary: { en: 'Roles, characters and builds', es: 'Roles, personajes y builds' },
        path: 'pages/equipos.html'
    },
    {
        slug: 'reacciones',
        number: '03',
        title: { en: 'Reactions', es: 'Reacciones' },
        summary: { en: 'Elements and combinations', es: 'Elementos y combinaciones' },
        path: 'pages/reacciones.html'
    },
    {
        slug: 'recursos',
        number: '04',
        title: { en: 'Resources', es: 'Recursos' },
        summary: { en: 'Resin, Mora and materials', es: 'Resina, Mora y materiales' },
        path: 'pages/recursos.html'
    },
    {
        slug: 'rutina',
        number: '05',
        title: { en: 'Daily routine', es: 'Rutina diaria' },
        summary: { en: 'Checklist and Battle Pass', es: 'Checklist y pase' },
        path: 'pages/rutina.html'
    },
    {
        slug: 'exploracion',
        number: '06',
        title: { en: 'Exploration', es: 'Exploración' },
        summary: { en: 'Map and gathering', es: 'Mapa y recolección' },
        path: 'pages/exploracion.html'
    },
    {
        slug: 'actividades',
        number: '07',
        title: { en: 'Activities', es: 'Actividades' },
        summary: { en: 'Bosses and endgame', es: 'Jefes y endgame' },
        path: 'pages/actividades.html'
    },
    {
        slug: 'pity',
        number: '08',
        title: { en: 'Pity', es: 'El pity' },
        summary: { en: 'Wishes and guarantees', es: 'Deseos y garantías' },
        path: 'pages/pity.html'
    }
];

/** Páginas del menú que no son secciones numeradas del manual. */
const EXTRA_PAGES = [
    { slug: 'glosario', title: { en: 'Glossary', es: 'Glosario' }, path: 'pages/glosario.html' },
    { slug: 'herramientas', title: { en: 'Tools', es: 'Herramientas' }, path: 'pages/herramientas.html' }
];

/** Consejos que rotan en la tarjeta "Consejo de la veterana" del inicio. */
const VETERAN_TIPS = [
    {
        title: { en: "Don't spend your Fragile Resin.", es: 'No gastes las resinas frágiles.' },
        text: {
            en: "Save it for AR 45, I'm telling you from experience. Already used it all? Oh well, you screwed up. Okay, let me help: from today on, keep the ones events give you.",
            es: 'Guárdalas para AR 45, te lo digo por experiencia. ¿Ya te las acabaste? Ni modo, ya la cagaste. A ver, te ayudo: desde hoy junta las que te den en eventos.'
        }
    },
    {
        title: { en: "You don't need 300,000 damage to kill a Slime.", es: 'No necesitas 300.000 de daño para matar un Slime.' },
        text: {
            en: "Relax. First build four characters properly, then we'll worry about the numbers.",
            es: 'Tranqui. Primero arma bien a cuatro personajes y luego nos preocupamos por los números.'
        }
    },
    {
        title: { en: 'Yes, Noelle can do it.', es: 'Sí, Noelle puede hacerlo.' },
        text: {
            en: 'Shield, healing and damage in one girl the game gives you for free. Let her work, please.',
            es: 'Escudo, curación y daño en una sola chica que el juego te regala. Déjala trabajar, por favor.'
        }
    },
    {
        title: { en: 'Pity is not your enemy.', es: 'El pity no es tu enemigo.' },
        text: {
            en: 'Well, it is, but you have to understand it. I told you: check the pity section before you pull.',
            es: 'Bueno, sí, pero hay que entenderlo. Te lo dije: pasa por la sección del pity antes de tirar.'
        }
    },
    {
        title: { en: 'Full resin is wasted resin.', es: 'Resina llena es resina desperdiciada.' },
        text: {
            en: "Once it hits 200 it stops going up. Left it full all weekend? Oh well. Okay: today, spend it even if it's on Mora blossoms.",
            es: 'Al llegar a 200 deja de subir. ¿La dejaste llena todo el fin de semana? Ni modo. A ver: hoy gástala aunque sea en flores de Mora.'
        }
    },
    {
        title: { en: 'Do your daily commissions.', es: 'Haz tus comisiones diarias.' },
        text: {
            en: "That's 60 Primogems a day. Do them even if you feel lazy; your future self on the next banner will thank you.",
            es: 'Son 60 Protogemas al día. Hazlas aunque te dé flojera; tu yo del próximo banner te lo va a agradecer.'
        }
    },
    {
        title: { en: "Your favorite character isn't meta?", es: '¿Tu personaje favorito no está en el meta?' },
        text: {
            en: 'What a tragedy. Oh well. Okay, let me help you make it work.',
            es: 'Qué tragedia. Ni modo. A ver, te ayudo a hacerlo funcionar.'
        }
    },
    {
        title: { en: 'Open the interactive map.', es: 'Abre el mapa interactivo.' },
        text: {
            en: "Leveling a character to 90 takes 168 local specialties. I told you: don't look for them blindly.",
            es: 'Subir a un personaje a nivel 90 pide 168 especialidades locales. Te lo dije: no las busques a ciegas.'
        }
    }
];

/**
 * Busca una sección del manual por su slug.
 * @param {string} slug - Identificador de la sección.
 * @returns {object|undefined} La sección encontrada.
 */
function findSectionBySlug(slug) {
    return SITE_SECTIONS.find((section) => section.slug === slug);
}
