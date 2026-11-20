/**
 * reactions.js
 * Laboratorio elemental (página Reacciones).
 * - El usuario elige el elemento aplicado (aura) y el elemento que lo activa.
 * - Se muestra la reacción resultante, su tipo, multiplicador y reacciones derivadas.
 * - También dibuja la enciclopedia de reacciones y las fichas de reacciones avanzadas.
 *
 * Requiere: data/elements.js, data/reactions.js, js/language.js y js/main.js.
 */

/** Elementos seleccionados en el laboratorio (por defecto, el ejemplo del concepto). */
const labState = {
    auraElement: 'hydro',
    triggerElement: 'electro'
};

/**
 * Crea la etiqueta <img> del ícono de un elemento.
 * @param {string} elementId - Id del elemento.
 * @returns {string} HTML de la imagen.
 */
function createElementIcon(elementId) {
    const element = findElementById(elementId);
    return `<img src="${buildPath(element.icon)}" alt="${element.name}" title="${element.name}" width="28" height="28">`;
}

/**
 * Une una lista de nombres: ['A', 'B', 'C'] -> "A, B or C" / "A, B o C".
 * Acepta nombres simples u objetos { en, es }.
 * @param {Array<string|object>} names - Nombres a unir.
 * @returns {string} HTML con la lista en los dos idiomas.
 */
function joinNamesWithOr(names) {
    const joinInLanguage = (language, conjunction) => {
        const languageNames = names.map((name) => (typeof name === 'string' ? name : name[language]));
        if (languageNames.length <= 1) {
            return languageNames.join('');
        }
        return `${languageNames.slice(0, -1).join(', ')} ${conjunction} ${languageNames[languageNames.length - 1]}`;
    };
    return bilingual(joinInLanguage('en', 'or'), joinInLanguage('es', 'o'));
}

/**
 * Nombre de una reacción: en inglés su nombre en inglés; en español, su nombre en español.
 * @param {object} reaction - Reacción con nameEn y nameEs.
 * @returns {string} HTML bilingüe.
 */
function reactionName(reaction) {
    return bilingual(reaction.nameEn, reaction.nameEs);
}

/**
 * Subtítulo de una reacción. En español se agrega el nombre en inglés,
 * porque la traducción del juego puede variar.
 * @param {object} reaction - Reacción con nameEn.
 * @param {{en: string, es: string}} detail - Texto que acompaña al nombre.
 * @returns {string} HTML bilingüe.
 */
function reactionSubtitle(reaction, detail) {
    return bilingual(detail.en, `${reaction.nameEn} · ${detail.es}`);
}

/* ---------- Selectores de elementos ---------- */

/**
 * Dibuja los siete botones de un selector.
 * @param {string} containerId - Id del contenedor.
 * @param {string} pickerName - 'auraElement' o 'triggerElement' (clave de labState).
 */
function renderElementPicker(containerId, pickerName) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    container.innerHTML = ELEMENTS.map((element) => `
        <button class="element-option element--${element.id}" type="button"
                data-picker="${pickerName}" data-element="${element.id}" aria-pressed="false">
            <img src="${buildPath(element.icon)}" alt="">
            ${element.name}
        </button>
    `).join('');
}

/** Marca como presionados los botones de los elementos elegidos. */
function updatePickerButtons() {
    document.querySelectorAll('.element-option').forEach((button) => {
        const isSelected = labState[button.dataset.picker] === button.dataset.element;
        button.setAttribute('aria-pressed', String(isSelected));
    });
}

/* ---------- Resultado ---------- */

/**
 * Crea el texto del multiplicador de una reacción amplificadora.
 * @param {object} reaction - Reacción encontrada.
 * @returns {string} HTML del multiplicador, o vacío si no aplica.
 */
function buildMultiplierMarkup(reaction) {
    if (!reaction.triggerMultipliers) {
        return '';
    }

    const triggerName = findElementById(labState.triggerElement).name;
    const auraName = findElementById(labState.auraElement).name;
    const multiplier = reaction.triggerMultipliers[labState.triggerElement];
    const reversedMultiplier = reaction.triggerMultipliers[labState.auraElement];

    return `
        <span class="reaction-result__multiplier">${bilingual('Multiplier', 'Multiplicador')} ×${multiplier}</span>
        <p>${bilingual(
            `Because <strong>${triggerName}</strong> triggers the reaction on <strong>${auraName}</strong>. If you swap the order, the multiplier is ×${reversedMultiplier}.`,
            `Porque <strong>${triggerName}</strong> activa la reacción sobre <strong>${auraName}</strong>. Si inviertes el orden, el multiplicador es ×${reversedMultiplier}.`
        )}</p>
    `;
}

/**
 * Crea la lista de reacciones derivadas (por ejemplo, Hiperflorecimiento).
 * @param {object} reaction - Reacción encontrada.
 * @returns {string} HTML de la lista, o vacío si no hay.
 */
function buildDerivedMarkup(reaction) {
    if (!reaction.derived) {
        return '';
    }

    const derivedItems = reaction.derived.map((derived) => `
        <li>${bilingual(
            `<strong>${derived.nameEn}</strong>: ${derived.text.en}`,
            `<strong>${derived.nameEs}</strong> (${derived.nameEn}): ${derived.text.es}`
        )}</li>
    `).join('');

    return `
        <div class="reaction-result__section">
            <strong>${bilingual('Derived reactions', 'Reacciones derivadas')}</strong>
            <ul>${derivedItems}</ul>
        </div>
    `;
}

/**
 * Crea el aviso de versiones avanzadas (Lunares o Estelares) que coinciden
 * con los elementos elegidos.
 * @param {object} reaction - Reacción encontrada.
 * @returns {string} HTML del aviso, o vacío si no hay.
 */
function buildAdvancedMarkup(reaction) {
    if (!reaction.advancedIds) {
        return '';
    }

    const selectedElements = [labState.auraElement, labState.triggerElement];
    const matchingAdvanced = reaction.advancedIds
        .map(findAdvancedReactionById)
        .filter((advanced) => advanced.elements.every((elementId) => selectedElements.includes(elementId)));

    if (matchingAdvanced.length === 0) {
        return '';
    }

    const advancedItems = matchingAdvanced.map((advanced) => `
        <li>${bilingual(
            `<strong>${advanced.nameEn}</strong>: only with `,
            `<strong>${advanced.nameEs}</strong> (${advanced.nameEn}): solo con `
        )}${joinNamesWithOr(advanced.enablers)}${bilingual(' on the team.', ' en el equipo.')}</li>
    `).join('');

    return `
        <div class="reaction-result__section">
            <strong>${bilingual('Advanced version', 'Versión avanzada')}</strong>
            <ul>${advancedItems}</ul>
        </div>
    `;
}

/** Dibuja el resultado de la combinación elegida. */
function renderReactionResult() {
    const resultElement = document.getElementById('reaction-result');
    if (!resultElement) {
        return;
    }

    const auraElement = findElementById(labState.auraElement);
    const triggerElement = findElementById(labState.triggerElement);
    const reaction = findReaction(auraElement.id, triggerElement.id);

    const formulaMarkup = `
        <div class="reaction-result__formula">
            ${createElementIcon(auraElement.id)} + ${createElementIcon(triggerElement.id)} =
        </div>
    `;

    if (!reaction) {
        const explanation = auraElement.id === triggerElement.id
            ? bilingual(
                `Two ${auraElement.name} don't react: you just apply more ${auraElement.name} to the enemy.`,
                `Dos veces ${auraElement.name} no reaccionan: solo aplicas más ${auraElement.name} al enemigo.`
            )
            : bilingual(
                `${auraElement.name} and ${triggerElement.name} don't react with each other.`,
                `${auraElement.name} y ${triggerElement.name} no reaccionan entre sí.`
            );

        resultElement.innerHTML = `
            ${formulaMarkup}
            <h3 class="reaction-result__name">${bilingual('No reaction', 'Sin reacción')}</h3>
            <p>${explanation}</p>
            <p class="result-panel__note">${bilingual(
                "Remember: Dendro doesn't react with Anemo, Geo or Cryo, and Anemo doesn't react with Geo either.",
                'Recuerda: Dendro no reacciona con Anemo, Geo ni Cryo, y Anemo tampoco reacciona con Geo.'
            )}</p>
        `;
        return;
    }

    resultElement.innerHTML = `
        ${formulaMarkup}
        <h3 class="reaction-result__name">${reactionName(reaction)}</h3>
        <span class="reaction-result__english">${reactionSubtitle(reaction, REACTION_TYPES[reaction.type].label)}</span>
        ${buildMultiplierMarkup(reaction)}
        <p>${translated(reaction.description)}</p>
        <p><strong>${bilingual('Tip:', 'Consejo:')}</strong> ${translated(reaction.tip)}</p>
        ${buildDerivedMarkup(reaction)}
        ${buildAdvancedMarkup(reaction)}
    `;
}

/* ---------- Enciclopedia y reacciones avanzadas ---------- */

/** Dibuja todas las reacciones agrupadas por tipo. */
function renderReactionEncyclopedia() {
    const encyclopediaElement = document.getElementById('reaction-encyclopedia');
    if (!encyclopediaElement) {
        return;
    }

    encyclopediaElement.innerHTML = Object.keys(REACTION_TYPES).map((typeId) => {
        const reactionType = REACTION_TYPES[typeId];
        const reactionCards = REACTIONS
            .filter((reaction) => reaction.type === typeId)
            .map((reaction) => `
                <article class="card reaction-entry">
                    <div class="reaction-entry__elements">${reaction.elements.map(createElementIcon).join('')}</div>
                    <h4 class="card__title">${reactionName(reaction)}</h4>
                    <span class="reaction-entry__english" lang="es">${reaction.nameEn}</span>
                    <p class="card__text">${translated(reaction.description)}</p>
                </article>
            `).join('');

        return `
            <div class="reaction-group">
                <div class="reaction-group__header">
                    <h3 class="reaction-group__title">${translated(reactionType.groupTitle)}</h3>
                    <p class="reaction-group__description">${translated(reactionType.description)}</p>
                </div>
                <div class="grid grid--3">${reactionCards}</div>
            </div>
        `;
    }).join('');
}

/** Dibuja las fichas de reacciones Lunares y Estelares. */
function renderAdvancedReactions() {
    const advancedElement = document.getElementById('advanced-reactions');
    if (!advancedElement) {
        return;
    }

    advancedElement.innerHTML = ADVANCED_REACTIONS.map((advanced) => `
        <article class="card advanced-card">
            <div class="advanced-card__family">
                <span class="badge badge--gold">${bilingual(`${advanced.family.en} reaction`, `Reacción ${advanced.family.es}`)}</span>
                <span class="badge badge--version">${bilingual('Depends on the version', 'Depende de la versión')}</span>
            </div>
            <div class="reaction-entry__elements">${advanced.elements.map(createElementIcon).join('')}</div>
            <h4 class="card__title">${reactionName(advanced)}</h4>
            <span class="reaction-entry__english">${reactionSubtitle(advanced, {
                en: `replaces ${advanced.replaces.en}`,
                es: `reemplaza a ${advanced.replaces.es}`
            })}</span>
            <p class="card__text">${translated(advanced.description)}</p>
            <p class="advanced-card__enablers"><strong>${bilingual('Who triggers it:', 'Quién la activa:')}</strong> ${joinNamesWithOr(advanced.enablers)}.</p>
        </article>
    `).join('');
}

/* ---------- Eventos ---------- */

function setupLabEvents() {
    const labPickers = document.getElementById('lab-pickers');
    const swapButton = document.getElementById('swap-elements-button');
    const randomButton = document.getElementById('random-elements-button');

    // Un solo listener para los 14 botones (delegación de eventos)
    labPickers.addEventListener('click', (event) => {
        const elementButton = event.target.closest('.element-option');
        if (!elementButton) {
            return;
        }
        labState[elementButton.dataset.picker] = elementButton.dataset.element;
        updatePickerButtons();
        renderReactionResult();
    });

    swapButton.addEventListener('click', () => {
        [labState.auraElement, labState.triggerElement] = [labState.triggerElement, labState.auraElement];
        updatePickerButtons();
        renderReactionResult();
    });

    randomButton.addEventListener('click', () => {
        const randomIndex = () => Math.floor(Math.random() * ELEMENTS.length);
        labState.auraElement = ELEMENTS[randomIndex()].id;
        labState.triggerElement = ELEMENTS[randomIndex()].id;
        updatePickerButtons();
        renderReactionResult();
    });
}

/* ---------- Inicio ---------- */
renderElementPicker('aura-picker', 'auraElement');
renderElementPicker('trigger-picker', 'triggerElement');
setupLabEvents();
updatePickerButtons();
renderReactionResult();
renderReactionEncyclopedia();
renderAdvancedReactions();
