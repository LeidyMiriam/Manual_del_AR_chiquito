/**
 * language.js
 * Idioma del sitio: inglés por defecto, con opción de español.
 *
 * Cómo funciona:
 * - Cada texto está escrito dos veces, en elementos con lang="en" y lang="es".
 *   El CSS (styles.css) muestra solo el que coincide con el atributo lang de <html>.
 * - Los atributos que no pueden llevar etiquetas (alt, placeholder, aria-label, title)
 *   y el texto de las <option> se guardan en data-<atributo>-en / data-<atributo>-es,
 *   y este archivo los copia al atributo real según el idioma activo.
 * - El título de la pestaña sale de data-title-en / data-title-es en <body>.
 *
 * Se carga en <head> (después de storage.js) para aplicar el idioma guardado
 * antes de que se dibuje la página y así no se vean los dos idiomas por un instante.
 */

const SUPPORTED_LANGUAGES = ['en', 'es'];
const DEFAULT_LANGUAGE = 'en';

/** Atributos que se traducen con data-<atributo>-<idioma>. */
const TRANSLATABLE_ATTRIBUTES = ['alt', 'placeholder', 'aria-label', 'title'];

/**
 * Devuelve el idioma activo.
 * @returns {string} 'en' o 'es'.
 */
function getLanguage() {
    const savedLanguage = loadData(STORAGE_KEYS.language, DEFAULT_LANGUAGE);
    return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

/* ---------- Ayudantes para escribir texto en los dos idiomas desde JavaScript ---------- */

/**
 * Crea el HTML de un texto en los dos idiomas.
 * @param {string} englishText - Texto en inglés (puede incluir HTML).
 * @param {string} spanishText - Texto en español (puede incluir HTML).
 * @returns {string} Dos <span>, uno por idioma.
 */
function bilingual(englishText, spanishText) {
    return `<span lang="en">${englishText}</span><span lang="es">${spanishText}</span>`;
}

/**
 * Convierte un dato de texto en HTML bilingüe.
 * Acepta un texto simple (igual en los dos idiomas) o un objeto { en, es }.
 * @param {string|{en: string, es: string}} text - Texto a mostrar.
 * @returns {string} HTML listo para insertar.
 */
function translated(text) {
    return typeof text === 'string' ? text : bilingual(text.en, text.es);
}

/**
 * Devuelve solo el texto del idioma activo (para atributos, que no admiten <span>).
 * @param {string|{en: string, es: string}} text - Texto simple u objeto { en, es }.
 * @returns {string} Texto en el idioma activo.
 */
function textInCurrentLanguage(text) {
    return typeof text === 'string' ? text : text[getLanguage()];
}

/* ---------- Aplicar el idioma ---------- */

/**
 * Copia los atributos traducidos (data-alt-en, data-placeholder-es...) al atributo real.
 * Se llama al cargar, al cambiar de idioma y después de dibujar contenido nuevo.
 * @param {ParentNode} [root] - Parte de la página a revisar (por defecto, toda).
 */
function applyTranslatedAttributes(root = document) {
    const language = getLanguage();

    TRANSLATABLE_ATTRIBUTES.forEach((attributeName) => {
        root.querySelectorAll(`[data-${attributeName}-${language}]`).forEach((element) => {
            element.setAttribute(attributeName, element.getAttribute(`data-${attributeName}-${language}`));
        });
    });

    // Las <option> no pueden contener <span>, así que se cambia su texto directamente
    root.querySelectorAll(`[data-text-${language}]`).forEach((element) => {
        element.textContent = element.getAttribute(`data-text-${language}`);
    });

    const pageTitle = document.body && document.body.getAttribute(`data-title-${language}`);
    if (pageTitle) {
        document.title = pageTitle;
    }
}

/**
 * Cambia el idioma del sitio y lo recuerda para la próxima visita.
 * @param {string} language - 'en' o 'es'.
 */
function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return;
    }

    saveData(STORAGE_KEYS.language, language);
    document.documentElement.lang = language;
    applyTranslatedAttributes();

    document.querySelectorAll('[data-language]').forEach((languageButton) => {
        languageButton.setAttribute('aria-pressed', String(languageButton.dataset.language === language));
    });
}

/* ---------- Inicio: se ejecuta en <head>, antes de dibujar la página ---------- */
document.documentElement.lang = getLanguage();
