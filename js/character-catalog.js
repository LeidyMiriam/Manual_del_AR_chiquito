/**
 * character-catalog.js
 * Página Equipos:
 * - Dibuja los avatares de los equipos recomendados (listas con data-team-members).
 * - Fichero de personajes: una tarjeta por personaje a partir de CHARACTERS,
 *   con filtros por elemento, rol, forma de conseguirlo y nombre.
 *
 * Requiere: data/elements.js, data/characters.js, js/language.js y js/main.js.
 */

/** Filtros activos. 'all' significa "sin filtrar". */
const catalogFilters = {
    element: 'all',
    role: 'all',
    origin: 'all',
    name: ''
};

/**
 * Devuelve el nombre de un personaje en los dos idiomas, para buscarlo por texto.
 * @param {object} character - Personaje de CHARACTERS.
 * @returns {string} Nombre (o nombres) en un solo texto.
 */
function getSearchableName(character) {
    return typeof character.name === 'string' ? character.name : `${character.name.en} ${character.name.es}`;
}

/* ---------- Equipos recomendados ---------- */

/** Dibuja los avatares de cada lista con data-team-members="id,id,id". */
function renderRecommendedTeamMembers() {
    document.querySelectorAll('[data-team-members]').forEach((membersList) => {
        membersList.innerHTML = membersList.dataset.teamMembers.split(',').map((characterId) => {
            const character = findCharacterById(characterId);
            return `
                <li class="team-member element--${character.element}">
                    <img src="${buildPath(`assets/images/characters/${character.id}.webp`)}" alt="" width="60" height="60" loading="lazy">
                    ${translated(character.name)}
                </li>
            `;
        }).join('');
    });
}

/* ---------- Componentes ---------- */

/**
 * Crea la tarjeta HTML de un personaje (componente reutilizable).
 * @param {object} character - Personaje de CHARACTERS.
 * @returns {string} HTML de la tarjeta.
 */
function createCharacterCard(character) {
    const element = findElementById(character.element);
    const roleBadges = character.roles
        .map((role) => `<span class="badge">${translated(CHARACTER_ROLES[role])}</span>`)
        .join('');
    const originBadgeClass = character.origin === 'gratis' ? 'badge badge--free' : 'badge badge--gold';
    const englishName = typeof character.name === 'string' ? character.name : character.name.en;
    const spanishName = typeof character.name === 'string' ? character.name : character.name.es;

    return `
        <article class="character-card element--${element.id}">
            <header class="character-card__header">
                <img class="character-card__portrait" src="${buildPath(`assets/images/characters/${character.id}.webp`)}"
                     alt="" data-alt-en="Portrait of ${englishName}" data-alt-es="Retrato de ${spanishName}"
                     width="76" height="76" loading="lazy">
                <div>
                    <h3 class="character-card__name">${translated(character.name)}</h3>
                    <span class="character-card__rarity" aria-label="${character.rarity}★"
                          data-aria-label-en="${character.rarity} stars" data-aria-label-es="${character.rarity} estrellas">${'★'.repeat(character.rarity)}</span>
                    <span class="character-card__weapon">${translated(WEAPON_TYPES[character.weapon])}</span>
                </div>
            </header>
            <div class="character-card__body">
                <div class="character-card__tags">
                    <span class="element-badge element--${element.id}"><img src="${buildPath(element.icon)}" alt="">${element.name}</span>
                    <span class="${originBadgeClass}">${translated(CHARACTER_ORIGINS[character.origin])}</span>
                    ${roleBadges}
                </div>
                <p class="character-card__summary">${translated(character.summary)}</p>
                <p class="character-card__obtain"><strong>${bilingual('How to get them:', 'Cómo conseguirlo:')}</strong> ${translated(character.obtain)}</p>
                <p class="character-card__tip">${translated(character.tip)}</p>
            </div>
        </article>
    `;
}

/* ---------- Filtros ---------- */

/**
 * Devuelve los personajes que cumplen todos los filtros activos.
 * @returns {object[]} Personajes filtrados.
 */
function getFilteredCharacters() {
    const nameQuery = normalizeText(catalogFilters.name);

    return CHARACTERS.filter((character) => {
        const matchesElement = catalogFilters.element === 'all' || character.element === catalogFilters.element;
        const matchesRole = catalogFilters.role === 'all' || character.roles.includes(catalogFilters.role);
        const matchesOrigin = catalogFilters.origin === 'all' || character.origin === catalogFilters.origin;
        const matchesName = normalizeText(getSearchableName(character)).includes(nameQuery);
        return matchesElement && matchesRole && matchesOrigin && matchesName;
    });
}

/** Dibuja los botones de filtro por elemento a partir de ELEMENTS. */
function renderElementFilter() {
    const elementFilter = document.getElementById('element-filter');
    if (!elementFilter) {
        return;
    }

    const elementButtons = ELEMENTS.map((element) => `
        <button class="chip" type="button" data-element="${element.id}" aria-pressed="false">
            <img src="${buildPath(element.icon)}" alt="">${element.name}
        </button>
    `).join('');

    elementFilter.innerHTML = `
        <button class="chip" type="button" data-element="all" aria-pressed="true">${bilingual('All', 'Todos')}</button>
        ${elementButtons}
    `;
}

/** Marca como presionado el botón del elemento seleccionado. */
function updateElementFilterButtons() {
    document.querySelectorAll('#element-filter [data-element]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.element === catalogFilters.element));
    });
}

/* ---------- Dibujo ---------- */

/** Dibuja las tarjetas que cumplen los filtros y actualiza el contador. */
function renderCatalog() {
    const catalogGrid = document.getElementById('character-grid');
    const catalogCount = document.getElementById('catalog-count');
    if (!catalogGrid || !catalogCount) {
        return;
    }

    const filteredCharacters = getFilteredCharacters();
    catalogCount.innerHTML = bilingual(
        `Showing ${filteredCharacters.length} of ${CHARACTERS.length} characters`,
        `Mostrando ${filteredCharacters.length} de ${CHARACTERS.length} personajes`
    );

    if (filteredCharacters.length === 0) {
        catalogGrid.innerHTML = `<p class="empty-state">${bilingual(
            'Nobody matches all those filters. Oh well, remove one (or accept that Noelle is the answer).',
            'Nadie cumple todos esos filtros. Ni modo, quita alguno (o acepta que Noelle es la respuesta).'
        )}</p>`;
        return;
    }

    catalogGrid.innerHTML = filteredCharacters.map(createCharacterCard).join('');
    applyTranslatedAttributes(catalogGrid);
}

/* ---------- Eventos ---------- */

function setupCatalogEvents() {
    const elementFilter = document.getElementById('element-filter');
    const roleFilter = document.getElementById('role-filter');
    const originFilter = document.getElementById('origin-filter');
    const nameFilter = document.getElementById('name-filter');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    elementFilter.addEventListener('click', (event) => {
        const elementButton = event.target.closest('[data-element]');
        if (!elementButton) {
            return;
        }
        catalogFilters.element = elementButton.dataset.element;
        updateElementFilterButtons();
        renderCatalog();
    });

    roleFilter.addEventListener('change', () => {
        catalogFilters.role = roleFilter.value;
        renderCatalog();
    });

    originFilter.addEventListener('change', () => {
        catalogFilters.origin = originFilter.value;
        renderCatalog();
    });

    nameFilter.addEventListener('input', () => {
        catalogFilters.name = nameFilter.value.trim();
        renderCatalog();
    });

    clearFiltersButton.addEventListener('click', () => {
        catalogFilters.element = 'all';
        catalogFilters.role = 'all';
        catalogFilters.origin = 'all';
        catalogFilters.name = '';
        roleFilter.value = 'all';
        originFilter.value = 'all';
        nameFilter.value = '';
        updateElementFilterButtons();
        renderCatalog();
    });
}

/* ---------- Inicio ---------- */
renderRecommendedTeamMembers();
renderElementFilter();
setupCatalogEvents();
renderCatalog();
