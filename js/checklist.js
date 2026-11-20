/**
 * checklist.js
 * Checklists de la página Rutina (diaria y semanal).
 *
 * Un mismo componente sirve para las dos listas:
 * - Las tareas se escriben en el HTML (cada checkbox tiene un value único).
 * - El progreso se guarda en LocalStorage junto con el "periodo" (día o semana).
 * - Si cambia el periodo (pasaron las 4:00 o empezó otra semana), la lista se reinicia sola.
 *
 * Requiere: js/storage.js, js/language.js y js/main.js.
 */

/** Cada cuánto se revisa si ya cambió el día (en milisegundos). */
const PERIOD_CHECK_INTERVAL = 60 * 1000;

/* ---------- Periodos ---------- */

/** @returns {string} Clave del día de juego actual (cambia a las 4:00). */
function getDailyPeriodKey() {
    return toDateKey(getGameDate());
}

/** @returns {string} Clave de la semana de juego actual (fecha de su lunes). */
function getWeeklyPeriodKey() {
    const gameDate = getGameDate();
    const daysSinceMonday = (gameDate.getDay() + 6) % 7;
    const monday = new Date(gameDate.getFullYear(), gameDate.getMonth(), gameDate.getDate() - daysSinceMonday);
    return toDateKey(monday);
}

/** @returns {Date} Próximo reinicio diario (hoy o mañana a las 4:00). */
function getNextDailyReset() {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setHours(GAME_RESET_HOUR, 0, 0, 0);
    if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1);
    }
    return nextReset;
}

/** @returns {Date} Próximo reinicio semanal (lunes a las 4:00). */
function getNextWeeklyReset() {
    const nextReset = getNextDailyReset();
    while (nextReset.getDay() !== 1) {
        nextReset.setDate(nextReset.getDate() + 1);
    }
    return nextReset;
}

/**
 * Describe en los dos idiomas cuánto falta para una fecha ("5 h 12 min" o "3 days and 5 h").
 * @param {Date} targetDate - Fecha futura.
 * @returns {string} HTML bilingüe con el tiempo restante.
 */
function describeTimeUntil(targetDate) {
    const totalMinutes = Math.max(0, Math.round((targetDate - new Date()) / 60000));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
        const plural = days === 1 ? '' : 's';
        return bilingual(`${days} day${plural} and ${hours} h`, `${days} día${plural} y ${hours} h`);
    }
    return `${hours} h ${minutes} min`;
}

/* ---------- Componente de checklist ---------- */

/**
 * Activa una checklist con contador, barra de progreso, botón de reinicio y guardado.
 * @param {object} config - Configuración de la lista.
 * @param {string} config.listId - Id del <ul> que contiene los checkboxes.
 * @param {string} config.counterId - Id del texto "0/6".
 * @param {string} config.progressBarId - Id de la barra de progreso.
 * @param {string} config.resetButtonId - Id del botón de reinicio.
 * @param {string} config.resetInfoId - Id del texto con el próximo reinicio.
 * @param {string} config.doneMessageId - Id del mensaje que aparece al completar todo.
 * @param {string} config.storageKey - Clave de STORAGE_KEYS donde se guarda.
 * @param {Function} config.getPeriodKey - Devuelve la clave del periodo actual.
 * @param {Function} config.getNextReset - Devuelve la fecha del próximo reinicio.
 */
function setupChecklist(config) {
    const listElement = document.getElementById(config.listId);
    if (!listElement) {
        return;
    }

    const checkboxes = [...listElement.querySelectorAll('input[type="checkbox"]')];
    const counterElement = document.getElementById(config.counterId);
    const progressBar = document.getElementById(config.progressBarId);
    const resetButton = document.getElementById(config.resetButtonId);
    const resetInfo = document.getElementById(config.resetInfoId);
    const doneMessage = document.getElementById(config.doneMessageId);

    // Estado guardado: { periodKey, completedTaskIds }
    let checklistState = loadData(config.storageKey, null);

    /** Reinicia la lista si el estado guardado es de otro día u otra semana. */
    function resetIfPeriodChanged() {
        const currentPeriodKey = config.getPeriodKey();
        if (!checklistState || checklistState.periodKey !== currentPeriodKey) {
            checklistState = { periodKey: currentPeriodKey, completedTaskIds: [] };
            saveData(config.storageKey, checklistState);
            return true;
        }
        return false;
    }

    /** Refleja el estado en la pantalla. */
    function renderChecklist() {
        checkboxes.forEach((checkbox) => {
            const isDone = checklistState.completedTaskIds.includes(checkbox.value);
            checkbox.checked = isDone;
            checkbox.closest('.checklist__item').classList.toggle('is-done', isDone);
        });

        const completedCount = checklistState.completedTaskIds.length;
        counterElement.textContent = `${completedCount}/${checkboxes.length}`;
        progressBar.style.width = `${(completedCount / checkboxes.length) * 100}%`;
        doneMessage.hidden = completedCount < checkboxes.length;
        resetInfo.innerHTML = `${bilingual('Resets itself in', 'Se reinicia sola en')} ${describeTimeUntil(config.getNextReset())}.`;
    }

    listElement.addEventListener('change', (event) => {
        if (event.target.type !== 'checkbox') {
            return;
        }
        resetIfPeriodChanged();

        const taskId = event.target.value;
        checklistState.completedTaskIds = event.target.checked
            ? [...checklistState.completedTaskIds, taskId]
            : checklistState.completedTaskIds.filter((completedId) => completedId !== taskId);

        saveData(config.storageKey, checklistState);
        renderChecklist();
    });

    resetButton.addEventListener('click', () => {
        checklistState.completedTaskIds = [];
        saveData(config.storageKey, checklistState);
        renderChecklist();
    });

    // Si la página se queda abierta, revisa cada minuto si ya cambió el periodo
    setInterval(() => {
        resetIfPeriodChanged();
        renderChecklist();
    }, PERIOD_CHECK_INTERVAL);

    // Se descartan ids que ya no existan en el HTML (por si se edita la lista)
    resetIfPeriodChanged();
    const validTaskIds = checkboxes.map((checkbox) => checkbox.value);
    checklistState.completedTaskIds = checklistState.completedTaskIds.filter((taskId) => validTaskIds.includes(taskId));
    renderChecklist();
}

/* ---------- Inicio ---------- */
setupChecklist({
    listId: 'daily-checklist',
    counterId: 'daily-counter',
    progressBarId: 'daily-progress-bar',
    resetButtonId: 'daily-reset-button',
    resetInfoId: 'daily-reset-info',
    doneMessageId: 'daily-done-message',
    storageKey: STORAGE_KEYS.dailyChecklist,
    getPeriodKey: getDailyPeriodKey,
    getNextReset: getNextDailyReset
});

setupChecklist({
    listId: 'weekly-checklist',
    counterId: 'weekly-counter',
    progressBarId: 'weekly-progress-bar',
    resetButtonId: 'weekly-reset-button',
    resetInfoId: 'weekly-reset-info',
    doneMessageId: 'weekly-done-message',
    storageKey: STORAGE_KEYS.weeklyChecklist,
    getPeriodKey: getWeeklyPeriodKey,
    getNextReset: getNextWeeklyReset
});
