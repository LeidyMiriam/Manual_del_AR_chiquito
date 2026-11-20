/**
 * domains.js
 * "¿Qué dominios abren hoy?" (página Actividades).
 * Usa el día de la semana actual (según el reinicio de las 4:00) para mostrar
 * qué libros de talento se pueden conseguir en cada región. También permite
 * consultar cualquier otro día.
 *
 * Requiere: data/materials.js, js/language.js y js/main.js.
 */

/** Orden en que se muestran los días (de lunes a domingo, según Date.getDay()). */
const DAY_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const SUNDAY = 0;

/** Día de juego actual (0 = domingo). */
const todayGameDay = getGameDate().getDay();

/** Día seleccionado en el selector. */
let selectedDay = todayGameDay;

/**
 * Nombre de un día en los dos idiomas.
 * @param {number} dayNumber - Día según Date.getDay().
 * @returns {string} HTML bilingüe.
 */
function dayName(dayNumber) {
    return bilingual(WEEK_DAYS.en[dayNumber], WEEK_DAYS.es[dayNumber]);
}

/** Dibuja los botones de los siete días. */
function renderDaySelector() {
    const daySelector = document.getElementById('day-selector');
    if (!daySelector) {
        return;
    }

    daySelector.innerHTML = DAY_DISPLAY_ORDER.map((dayNumber) => {
        const isToday = dayNumber === todayGameDay;
        const todayClass = isToday ? ' is-today' : '';
        const todayLabel = isToday ? ` ${bilingual('(today)', '(hoy)')}` : '';
        return `<button class="chip${todayClass}" type="button" data-day="${dayNumber}" aria-pressed="false">${dayName(dayNumber)}${todayLabel}</button>`;
    }).join('');
}

/** Dibuja los libros disponibles en el día seleccionado. */
function renderDomainsForDay() {
    const domainGrid = document.getElementById('domain-grid');
    const domainsStatus = document.getElementById('domains-status');
    if (!domainGrid || !domainsStatus) {
        return;
    }

    document.querySelectorAll('#day-selector [data-day]').forEach((dayButton) => {
        dayButton.setAttribute('aria-pressed', String(Number(dayButton.dataset.day) === selectedDay));
    });

    const englishDay = WEEK_DAYS.en[selectedDay];
    const spanishDay = WEEK_DAYS.es[selectedDay].toLowerCase();
    const isToday = selectedDay === todayGameDay;

    domainsStatus.innerHTML = selectedDay === SUNDAY
        ? bilingual(
            `On ${englishDay} all domains are open. It's the day to catch up.`,
            `El ${spanishDay} abren todos los dominios. Es el día para ponerte al corriente.`
        )
        : bilingual(
            `Talent books available on ${englishDay}${isToday ? ' (today)' : ''}:`,
            `Libros de talento disponibles el ${spanishDay}${isToday ? ' (hoy)' : ''}:`
        );

    domainGrid.innerHTML = TALENT_BOOK_SCHEDULE.map((regionSchedule) => {
        const availableBooks = regionSchedule.books.filter((book) =>
            selectedDay === SUNDAY || book.days.includes(selectedDay)
        );

        // En español se agrega el nombre en inglés, que es el que usan la mayoría de las guías
        const booksMarkup = availableBooks.map((book) => `
            <li>${bilingual(
                `“${book.nameEn}”`,
                `«${book.nameEs}» <small class="domain-card__english">${book.nameEn}</small>`
            )}</li>
        `).join('');

        return `
            <article class="card domain-card">
                <h3 class="domain-card__region">${regionSchedule.region}</h3>
                <ul class="domain-card__books">${booksMarkup}</ul>
            </article>
        `;
    }).join('');
}

/** Conecta el selector de días. */
function setupDomainSchedule() {
    const daySelector = document.getElementById('day-selector');
    if (!daySelector) {
        return;
    }

    renderDaySelector();

    daySelector.addEventListener('click', (event) => {
        const dayButton = event.target.closest('[data-day]');
        if (dayButton) {
            selectedDay = Number(dayButton.dataset.day);
            renderDomainsForDay();
        }
    });

    renderDomainsForDay();
}

/* ---------- Inicio ---------- */
setupDomainSchedule();
