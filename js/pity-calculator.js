/**
 * pity-calculator.js
 * Wish Tracker: calculadora educativa del pity (página Pity).
 * Calcula a cuántos deseos estás del límite teórico de 5★, cuántos deseos
 * tienes ahorrados y cuál sería el peor caso para conseguir lo promocional.
 *
 * No calcula probabilidades ni predice cuándo saldrá un 5★.
 *
 * Requiere: js/storage.js, js/language.js y js/main.js.
 */

/** Protogemas que cuesta un Destino. */
const PRIMOGEMS_PER_WISH = 160;

/**
 * Reglas de cada tipo de banner.
 * - hardPity: límite teórico (el 5★ está garantizado en ese deseo).
 * - softPity: deseo aproximado desde el que la probabilidad sube (dato de la comunidad).
 * - hasGuarantee: si existe el sistema de garantizado.
 * - Los textos visibles van en { en, es }.
 */
const WISH_BANNERS = {
    character: {
        bannerName: { en: 'featured character banner', es: 'banner de personaje promocional' },
        hardPity: 90,
        softPity: 74,
        hasGuarantee: true,
        guaranteeQuestion: { en: 'Do you have the featured banner guarantee?', es: '¿Tienes el garantizado del banner promocional?' },
        situationWithGuarantee: {
            en: "Your next 5★ will be the featured character. You already lost a 50/50: now it's your turn.",
            es: 'Tu siguiente 5★ será el personaje promocional. Ya perdiste un 50/50: ahora te toca.'
        },
        situationWithoutGuarantee: {
            en: 'Your next 5★ on the featured banner is subject to the 50/50 system.',
            es: 'Tu siguiente 5★ en el banner promocional está sujeto al sistema 50/50.'
        }
    },
    weapon: {
        bannerName: { en: 'weapon banner', es: 'banner de armas' },
        hardPity: 80,
        softPity: 63,
        hasGuarantee: true,
        guaranteeQuestion: { en: 'Is your Epitomized Path already full?', es: '¿Tu Camino Epitomizado ya está completo?' },
        situationWithGuarantee: {
            en: 'Your next 5★ will be the weapon you chose in the Epitomized Path.',
            es: 'Tu siguiente 5★ será el arma que elegiste en el Camino Epitomizado.'
        },
        situationWithoutGuarantee: {
            en: 'Your next 5★ has a 75% chance of being one of the two featured weapons, but not necessarily the one you chose.',
            es: 'Tu siguiente 5★ tiene 75 % de probabilidad de ser una de las dos armas promocionales, pero no necesariamente la que elegiste.'
        }
    },
    standard: {
        bannerName: { en: 'standard banner', es: 'banner permanente' },
        hardPity: 90,
        softPity: 74,
        hasGuarantee: false,
        situationWithoutGuarantee: {
            en: "Your next 5★ will be any character or weapon from the standard banner. There's no 50/50 here.",
            es: 'Tu siguiente 5★ será cualquier personaje o arma del banner permanente. Aquí no existe el 50/50.'
        }
    }
};

/** Estado de la calculadora (se guarda en LocalStorage). */
const pityState = Object.assign(
    { bannerType: 'character', pullsSinceLastFiveStar: 0, hasGuarantee: false, primogems: 0, fates: 0 },
    loadData(STORAGE_KEYS.pityCalculator, {})
);

/* ---------- Cálculo ---------- */

/**
 * Calcula todos los resultados a partir del estado.
 * @returns {object} Resultados del cálculo.
 */
function calculatePity() {
    const banner = WISH_BANNERS[pityState.bannerType];
    const hasGuarantee = banner.hasGuarantee && pityState.hasGuarantee;
    const wishesToHardPity = banner.hardPity - pityState.pullsSinceLastFiveStar;
    const wishesToSoftPity = Math.max(0, banner.softPity - pityState.pullsSinceLastFiveStar);
    const savedWishes = pityState.fates + Math.floor(pityState.primogems / PRIMOGEMS_PER_WISH);

    // Peor caso: si no tienes garantizado, puedes perder una vez y necesitar otro pity completo
    const worstCaseWishes = banner.hasGuarantee && !hasGuarantee
        ? wishesToHardPity + banner.hardPity
        : wishesToHardPity;

    return {
        banner,
        hasGuarantee,
        wishesToHardPity,
        wishesToSoftPity,
        savedWishes,
        worstCaseWishes,
        missingWishes: Math.max(0, wishesToHardPity - savedWishes),
        missingWorstCase: Math.max(0, worstCaseWishes - savedWishes)
    };
}

/* ---------- Dibujo ---------- */

/**
 * Crea un bloque de estadística del panel de resultados.
 * @param {string|number} value - Valor grande.
 * @param {string} label - Descripción (HTML).
 * @returns {string} HTML del bloque.
 */
function createResultStat(value, label) {
    return `
        <div class="result-stat">
            <span class="result-stat__value">${value}</span>
            <span class="result-stat__label">${label}</span>
        </div>
    `;
}

/**
 * Texto sobre los ahorros del usuario.
 * @param {object} result - Resultado de calculatePity().
 * @returns {string} HTML bilingüe.
 */
function buildSavingsMarkup(result) {
    if (result.missingWishes === 0) {
        return bilingual(
            `With your savings (${result.savedWishes} wishes) you <strong>reach the theoretical limit</strong>.`,
            `Con tus ahorros (${result.savedWishes} deseos) <strong>alcanzas el límite teórico</strong>.`
        );
    }

    const missingPrimogems = formatNumber(result.missingWishes * PRIMOGEMS_PER_WISH);
    return bilingual(
        `With your savings (${result.savedWishes} wishes) you're missing <strong>${result.missingWishes} wishes</strong> (${missingPrimogems} Primogems) for the theoretical limit. Oh well, time to save Primogems.`,
        `Con tus ahorros (${result.savedWishes} deseos) te faltan <strong>${result.missingWishes} deseos</strong> (${missingPrimogems} Protogemas) para el límite teórico. Ni modo, a juntar Protogemas.`
    );
}

/**
 * Texto del peor caso (solo si hay 50/50 o 75/25 de por medio).
 * @param {object} result - Resultado de calculatePity().
 * @returns {string} HTML bilingüe, o vacío si no aplica.
 */
function buildWorstCaseMarkup(result) {
    if (!result.banner.hasGuarantee || result.hasGuarantee) {
        return '';
    }

    if (result.missingWorstCase === 0) {
        return `<p>${bilingual(
            `Even in the worst case (losing and reaching the limit again) you're covered: you'd need ${result.worstCaseWishes} wishes.`,
            `Incluso en el peor caso (perder y volver a llegar al límite) te alcanza: necesitarías ${result.worstCaseWishes} deseos.`
        )}</p>`;
    }

    return `<p>${bilingual(
        `In the worst case (losing and reaching the limit again) you'd need up to <strong>${result.worstCaseWishes} wishes</strong>. You'd be missing ${result.missingWorstCase}.`,
        `En el peor caso (perder y volver a llegar al límite) necesitarías hasta <strong>${result.worstCaseWishes} deseos</strong>. Te faltarían ${result.missingWorstCase}.`
    )}</p>`;
}

/** Dibuja el resultado completo de la calculadora. */
function renderPityResult() {
    const resultElement = document.getElementById('pity-result');
    const result = calculatePity();
    const { banner } = result;

    const situationText = result.hasGuarantee ? banner.situationWithGuarantee : banner.situationWithoutGuarantee;
    const softPityLabel = result.wishesToSoftPity === 0
        ? bilingual('Already in the zone where the chance goes up', 'Ya estás en la zona donde la probabilidad sube')
        : bilingual(`Wishes to the "soft pity" zone (approx. ${banner.softPity})`, `Deseos para la zona de «soft pity» (aprox. ${banner.softPity})`);

    const filledPercent = (pityState.pullsSinceLastFiveStar / banner.hardPity) * 100;
    const softMarkerPercent = (banner.softPity / banner.hardPity) * 100;

    resultElement.innerHTML = `
        <p><strong>${bilingual('Your situation:', 'Tu situación:')}</strong> ${translated(situationText)}</p>
        <div class="pity-meter" aria-hidden="true">
            <div class="pity-meter__track">
                <div class="pity-meter__fill"></div>
            </div>
            <span class="pity-meter__soft-marker"></span>
            <div class="pity-meter__labels">
                <span>0</span>
                <span>Soft pity ≈ ${banner.softPity}</span>
                <span>${banner.hardPity}</span>
            </div>
        </div>
        <div class="result-stats">
            ${createResultStat(result.wishesToHardPity, bilingual('Wishes to the theoretical limit', 'Deseos hasta el límite teórico'))}
            ${createResultStat(result.wishesToSoftPity, softPityLabel)}
            ${createResultStat(result.savedWishes, bilingual('Wishes you have saved', 'Deseos que tienes ahorrados'))}
        </div>
        <p>${bilingual(
            `<strong>Result:</strong> you're ${result.wishesToHardPity} wishes away from the theoretical five-star limit of the ${banner.bannerName.en}. This isn't a prediction of when it will show up.`,
            `<strong>Resultado:</strong> estás a ${result.wishesToHardPity} deseos de distancia del límite teórico de cinco estrellas del ${banner.bannerName.es}. No representa una predicción de cuándo aparecerá.`
        )}</p>
        <p>${buildSavingsMarkup(result)}</p>
        ${buildWorstCaseMarkup(result)}
    `;

    // El avance del medidor se ajusta desde JS porque depende del cálculo
    resultElement.querySelector('.pity-meter__fill').style.width = `${filledPercent}%`;
    resultElement.querySelector('.pity-meter__soft-marker').style.left = `${softMarkerPercent}%`;
}

/** Ajusta el formulario al tipo de banner (límite del campo y pregunta del garantizado). */
function updateFormForBanner() {
    const banner = WISH_BANNERS[pityState.bannerType];
    const maxPulls = banner.hardPity - 1;

    document.getElementById('pulls-input').max = maxPulls;
    document.getElementById('pulls-hint').innerHTML = bilingual(
        `Between 0 and ${maxPulls}. You can see it in your wish history.`,
        `Entre 0 y ${maxPulls}. Lo ves en el historial de deseos.`
    );
    document.getElementById('guarantee-field').hidden = !banner.hasGuarantee;
    if (banner.hasGuarantee) {
        document.getElementById('guarantee-label').innerHTML = translated(banner.guaranteeQuestion);
    }

    document.querySelectorAll('[data-banner]').forEach((bannerButton) => {
        bannerButton.setAttribute('aria-pressed', String(bannerButton.dataset.banner === pityState.bannerType));
    });
    document.querySelectorAll('[data-guarantee]').forEach((guaranteeButton) => {
        const buttonValue = guaranteeButton.dataset.guarantee === 'yes';
        guaranteeButton.setAttribute('aria-pressed', String(buttonValue === pityState.hasGuarantee));
    });
}

/**
 * Lee un campo numérico y lo limita a un rango.
 * @param {HTMLInputElement} inputElement - Campo a leer.
 * @param {number} maximum - Máximo permitido.
 * @returns {number} Número entero entre 0 y maximum.
 */
function readNumberInput(inputElement, maximum) {
    const value = Math.floor(Number(inputElement.value) || 0);
    return Math.min(Math.max(value, 0), maximum);
}

/** Guarda el estado y vuelve a dibujar todo. */
function refreshPityCalculator() {
    saveData(STORAGE_KEYS.pityCalculator, pityState);
    updateFormForBanner();
    renderPityResult();
}

/* ---------- Eventos ---------- */

function setupPityCalculator() {
    const bannerSelector = document.getElementById('banner-selector');
    const guaranteeSelector = document.getElementById('guarantee-selector');
    const pullsInput = document.getElementById('pulls-input');
    const primogemsInput = document.getElementById('primogems-input');
    const fatesInput = document.getElementById('fates-input');
    if (!bannerSelector) {
        return;
    }

    // Recupera los valores guardados en los campos
    pullsInput.value = pityState.pullsSinceLastFiveStar;
    primogemsInput.value = pityState.primogems;
    fatesInput.value = pityState.fates;

    bannerSelector.addEventListener('click', (event) => {
        const bannerButton = event.target.closest('[data-banner]');
        if (!bannerButton) {
            return;
        }
        pityState.bannerType = bannerButton.dataset.banner;
        // Si el nuevo banner tiene un límite menor, se ajusta el contador
        const maxPulls = WISH_BANNERS[pityState.bannerType].hardPity - 1;
        pityState.pullsSinceLastFiveStar = Math.min(pityState.pullsSinceLastFiveStar, maxPulls);
        pullsInput.value = pityState.pullsSinceLastFiveStar;
        refreshPityCalculator();
    });

    guaranteeSelector.addEventListener('click', (event) => {
        const guaranteeButton = event.target.closest('[data-guarantee]');
        if (guaranteeButton) {
            pityState.hasGuarantee = guaranteeButton.dataset.guarantee === 'yes';
            refreshPityCalculator();
        }
    });

    pullsInput.addEventListener('input', () => {
        pityState.pullsSinceLastFiveStar = readNumberInput(pullsInput, WISH_BANNERS[pityState.bannerType].hardPity - 1);
        refreshPityCalculator();
    });

    primogemsInput.addEventListener('input', () => {
        pityState.primogems = readNumberInput(primogemsInput, 9999999);
        refreshPityCalculator();
    });

    fatesInput.addEventListener('input', () => {
        pityState.fates = readNumberInput(fatesInput, 99999);
        refreshPityCalculator();
    });

    refreshPityCalculator();
}

/* ---------- Inicio ---------- */
setupPityCalculator();
