/**
 * storage.js
 * Funciones para guardar y leer datos en LocalStorage.
 *
 * Todo el progreso del viajero (idioma, checklist, secciones leídas, datos de las
 * calculadoras) se guarda en el navegador: no hace falta una cuenta ni una base de datos.
 * Las claves llevan un prefijo para no chocar con otros sitios.
 *
 * Se usan bloques try/catch porque LocalStorage puede no estar disponible
 * (por ejemplo, en ventanas privadas o con el almacenamiento bloqueado).
 * En ese caso el sitio sigue funcionando, solo que sin recordar nada.
 *
 * Se carga en <head>, antes que language.js.
 */

const STORAGE_PREFIX = 'arChikito.';

/** Claves usadas en todo el sitio (en un solo lugar para evitar errores de escritura). */
const STORAGE_KEYS = {
    language: 'language',
    readSections: 'readSections',
    dailyChecklist: 'dailyChecklist',
    weeklyChecklist: 'weeklyChecklist',
    pityCalculator: 'pityCalculator',
    resinPlanner: 'resinPlanner'
};

/**
 * Lee un valor guardado.
 * @param {string} key - Clave sin prefijo (usar STORAGE_KEYS).
 * @param {*} fallbackValue - Valor que se devuelve si no hay nada guardado.
 * @returns {*} El valor guardado (ya convertido desde JSON) o fallbackValue.
 */
function loadData(key, fallbackValue) {
    try {
        const storedText = localStorage.getItem(STORAGE_PREFIX + key);
        return storedText === null ? fallbackValue : JSON.parse(storedText);
    } catch (error) {
        return fallbackValue;
    }
}

/**
 * Guarda un valor (se convierte a JSON).
 * @param {string} key - Clave sin prefijo (usar STORAGE_KEYS).
 * @param {*} value - Valor a guardar.
 */
function saveData(key, value) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
        console.warn('No se pudo guardar en LocalStorage:', error);
    }
}
