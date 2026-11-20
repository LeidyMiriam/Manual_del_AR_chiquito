/**
 * resource-planner.js
 * Herramientas de la página Recursos:
 * - Planificador de resina: cuándo se llena y en qué se puede gastar.
 * - Calculadora de EXP y Mora para subir a un personaje.
 *
 * Requiere: data/materials.js, js/storage.js, js/language.js y js/main.js.
 */

/* ---------- Planificador de resina ---------- */

/**
 * Convierte minutos en un texto legible ("5 h 20 min").
 * @param {number} totalMinutes - Minutos totales.
 * @returns {string} Texto con horas y minutos.
 */
function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

/**
 * Describe en los dos idiomas la hora aproximada a la que se llena la resina.
 * @param {number} minutesFromNow - Minutos que faltan.
 * @returns {string} HTML bilingüe, por ejemplo "today at 9:40 PM" / "hoy a las 21:40".
 */
function describeFullTime(minutesFromNow) {
    const now = new Date();
    const fullDate = new Date(now.getTime() + minutesFromNow * 60 * 1000);
    const englishTime = fullDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const spanishTime = fullDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const dayDifference = Math.round(
        (new Date(fullDate.toDateString()) - new Date(now.toDateString())) / (24 * 60 * 60 * 1000)
    );

    if (dayDifference === 0) {
        return bilingual(`today at ${englishTime}`, `hoy a las ${spanishTime}`);
    }
    if (dayDifference === 1) {
        return bilingual(`tomorrow at ${englishTime}`, `mañana a las ${spanishTime}`);
    }
    return bilingual(`in ${dayDifference} days, at ${englishTime}`, `en ${dayDifference} días, a las ${spanishTime}`);
}

/**
 * Limita un número a un rango.
 * @param {number} value - Valor original.
 * @param {number} minimum - Mínimo permitido.
 * @param {number} maximum - Máximo permitido.
 * @returns {number} Valor dentro del rango.
 */
function clampNumber(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

/** Calcula y dibuja el resultado del planificador de resina. */
function renderResinPlan() {
    const currentResinInput = document.getElementById('current-resin');
    const fragileResinInput = document.getElementById('fragile-resin');
    const resultElement = document.getElementById('resin-result');

    const currentResin = clampNumber(Math.floor(Number(currentResinInput.value) || 0), 0, RESIN_CONFIG.maxResin);
    const fragileResin = clampNumber(Math.floor(Number(fragileResinInput.value) || 0), 0, 999);
    saveData(STORAGE_KEYS.resinPlanner, { currentResin, fragileResin });

    const missingResin = RESIN_CONFIG.maxResin - currentResin;
    const minutesToFull = missingResin * RESIN_CONFIG.minutesPerResin;
    const resinWithFragile = currentResin + fragileResin * RESIN_CONFIG.fragileResinValue;
    const duration = formatDuration(minutesToFull);

    const fullMessage = missingResin === 0
        ? `<p>${bilingual(
            '<strong>I told you: your resin is full.</strong> Every 8 minutes that pass is a point thrown in the trash. Come on, go spend it.',
            '<strong>Te lo dije: tu resina está llena.</strong> Cada 8 minutos que pasan es un punto tirado a la basura. Ándale, ve a gastarla.'
        )}</p>`
        : `<p>${bilingual('Your resin fills up', 'Tu resina se llena')} <strong>${describeFullTime(minutesToFull)}</strong>
           ${bilingual(`(in ${duration}).`, `(en ${duration}).`)}</p>`;

    const activityStats = RESIN_ACTIVITIES.map((activity) => `
        <div class="result-stat">
            <span class="result-stat__value">${Math.floor(currentResin / activity.cost)}</span>
            <span class="result-stat__label">${translated(activity.name)} ${bilingual(`(${activity.cost} each)`, `(${activity.cost} c/u)`)}</span>
        </div>
    `).join('');

    const fragileMessage = fragileResin > 0
        ? `<p>${bilingual(
            `With your ${fragileResin} Fragile Resin you'd have ${formatNumber(resinWithFragile)} resin in total. Are you AR 45 yet? If not, save them; I'm telling you from experience.`,
            `Con tus ${fragileResin} resinas frágiles tendrías ${formatNumber(resinWithFragile)} de resina en total. ¿Ya eres AR 45? Si no, guárdalas; te lo digo por experiencia.`
        )}</p>`
        : '';

    resultElement.innerHTML = `
        ${fullMessage}
        <div class="result-stats">${activityStats}</div>
        ${fragileMessage}
        <p class="result-panel__note">${bilingual(
            `With your current resin you can do any of these options (not all at once). It regenerates 1 point every ${RESIN_CONFIG.minutesPerResin} minutes up to ${RESIN_CONFIG.maxResin}.`,
            `Con tu resina actual puedes hacer cualquiera de estas opciones (no todas a la vez). Se regenera 1 punto cada ${RESIN_CONFIG.minutesPerResin} minutos hasta ${RESIN_CONFIG.maxResin}.`
        )}</p>
    `;
}

/** Conecta los campos del planificador de resina. */
function setupResinPlanner() {
    const currentResinInput = document.getElementById('current-resin');
    const fragileResinInput = document.getElementById('fragile-resin');
    if (!currentResinInput || !fragileResinInput) {
        return;
    }

    const savedPlan = loadData(STORAGE_KEYS.resinPlanner, null);
    if (savedPlan) {
        currentResinInput.value = savedPlan.currentResin;
        fragileResinInput.value = savedPlan.fragileResin;
    }

    currentResinInput.addEventListener('input', renderResinPlan);
    fragileResinInput.addEventListener('input', renderResinPlan);
    renderResinPlan();
}

/* ---------- Calculadora de EXP y Mora ---------- */

/** Llena los selectores de nivel a partir de CHARACTER_EXP_MILESTONES. */
function fillLevelSelects() {
    const fromLevelSelect = document.getElementById('from-level');
    const toLevelSelect = document.getElementById('to-level');

    // Las <option> no admiten <span>: su texto se traduce con data-text-en / data-text-es
    const optionsMarkup = CHARACTER_EXP_MILESTONES.map((milestone) => `
        <option value="${milestone.level}" data-text-en="Level ${milestone.level}" data-text-es="Nivel ${milestone.level}">Level ${milestone.level}</option>
    `).join('');

    fromLevelSelect.innerHTML = optionsMarkup;
    toLevelSelect.innerHTML = optionsMarkup;
    fromLevelSelect.value = '1';
    toLevelSelect.value = '80';
    applyTranslatedAttributes(fromLevelSelect);
    applyTranslatedAttributes(toLevelSelect);
}

/**
 * Calcula EXP, libros y Mora para subir de un nivel a otro.
 * @param {number} fromLevel - Nivel actual (sin ascender todavía).
 * @param {number} toLevel - Nivel objetivo.
 * @returns {object} Resultados del cálculo.
 */
function calculateLevelingCost(fromLevel, toLevel) {
    const fromMilestone = CHARACTER_EXP_MILESTONES.find((milestone) => milestone.level === fromLevel);
    const toMilestone = CHARACTER_EXP_MILESTONES.find((milestone) => milestone.level === toLevel);
    const requiredExp = toMilestone.totalExp - fromMilestone.totalExp;

    // Ascensiones necesarias: las de los niveles tope desde el nivel actual hasta antes del objetivo
    const ascensionLevels = Object.keys(ASCENSION_MORA_BY_LEVEL)
        .map(Number)
        .filter((level) => level >= fromLevel && level < toLevel);
    const ascensionMora = ascensionLevels.reduce((total, level) => total + ASCENSION_MORA_BY_LEVEL[level], 0);
    const levelingMora = requiredExp * EXP_BOOK.moraPerExpPoint;

    return {
        requiredExp,
        requiredBooks: Math.ceil(requiredExp / EXP_BOOK.expPerBook),
        levelingMora,
        ascensionMora,
        ascensionCount: ascensionLevels.length,
        totalMora: levelingMora + ascensionMora
    };
}

/** Dibuja el resultado de la calculadora de EXP. */
function renderLevelingCost() {
    const fromLevel = Number(document.getElementById('from-level').value);
    const toLevel = Number(document.getElementById('to-level').value);
    const resultElement = document.getElementById('exp-result');

    if (toLevel <= fromLevel) {
        resultElement.innerHTML = `<p>${bilingual(
            'Not like that, traveler: the target level has to be higher than the current one. Neither Mora nor time goes backwards.',
            'Así no, viajero: el nivel objetivo tiene que ser mayor que el actual. Ni la Mora ni el tiempo regresan.'
        )}</p>`;
        return;
    }

    const cost = calculateLevelingCost(fromLevel, toLevel);
    const requiredExp = formatNumber(cost.requiredExp);
    const levelingMora = formatNumber(cost.levelingMora);
    const ascensionMora = formatNumber(cost.ascensionMora);

    resultElement.innerHTML = `
        <div class="result-stats">
            <div class="result-stat">
                <span class="result-stat__value">${formatNumber(cost.requiredBooks)}</span>
                <span class="result-stat__label">${bilingual(`${EXP_BOOK.name.en} books`, `Libros de ${EXP_BOOK.name.es}`)}</span>
            </div>
            <div class="result-stat">
                <span class="result-stat__value">${formatNumber(cost.totalMora)}</span>
                <span class="result-stat__label">${bilingual('Total Mora', 'Mora en total')}</span>
            </div>
            <div class="result-stat">
                <span class="result-stat__value">${cost.ascensionCount}</span>
                <span class="result-stat__label">${bilingual('Ascensions', 'Ascensiones')}</span>
            </div>
        </div>
        <p>${bilingual(
            `EXP needed: <strong>${requiredExp}</strong>. Mora for leveling: <strong>${levelingMora}</strong>. Mora for ascending: <strong>${ascensionMora}</strong>.`,
            `EXP necesaria: <strong>${requiredExp}</strong>. Mora para subir de nivel: <strong>${levelingMora}</strong>. Mora para ascender: <strong>${ascensionMora}</strong>.`
        )}</p>
        <p class="result-panel__note">${bilingual(
            "Assumes you haven't ascended yet at the starting level. It doesn't include ascension materials (gems, local specialties, boss and enemy drops) or talents.",
            'Se asume que aún no ascendiste en el nivel de partida. No incluye los materiales de ascensión (gemas, especialidades locales, materiales de jefes y de enemigos) ni los talentos.'
        )}</p>
    `;
}

/** Conecta los selectores de la calculadora de EXP. */
function setupExpCalculator() {
    const fromLevelSelect = document.getElementById('from-level');
    const toLevelSelect = document.getElementById('to-level');
    if (!fromLevelSelect || !toLevelSelect) {
        return;
    }

    fillLevelSelects();
    fromLevelSelect.addEventListener('change', renderLevelingCost);
    toLevelSelect.addEventListener('change', renderLevelingCost);
    renderLevelingCost();
}

/* ---------- Inicio ---------- */
setupResinPlanner();
setupExpCalculator();
