/**
 * materials.js
 * Datos numéricos de recursos y materiales usados por los planificadores:
 * resina, experiencia de personaje, Mora y calendario de dominios.
 * Valores del juego base; si una versión los cambia, solo hay que editarlos aquí.
 */

/** Configuración de la Resina original. */
const RESIN_CONFIG = {
    maxResin: 200,            // capacidad máxima de Resina original
    minutesPerResin: 8,       // se regenera 1 punto cada 8 minutos
    fragileResinValue: 60     // cada Resina frágil restaura 60 puntos
};

/** Actividades en las que se gasta resina y su costo. */
const RESIN_ACTIVITIES = [
    { id: 'domain', name: { en: 'Domains or Ley Line Blossoms', es: 'Dominios o flores de líneas ley' }, cost: 20 },
    { id: 'normal-boss', name: { en: 'Normal bosses', es: 'Jefes normales' }, cost: 40 },
    { id: 'weekly-boss', name: { en: 'Weekly bosses (discounted)', es: 'Jefes semanales (con descuento)' }, cost: 30 }
];

/**
 * EXP acumulada de personaje necesaria para llegar a cada nivel tope de ascensión.
 * Ejemplo: de nivel 1 a nivel 20 se necesitan 120 175 puntos de EXP.
 */
const CHARACTER_EXP_MILESTONES = [
    { level: 1, totalExp: 0 },
    { level: 20, totalExp: 120175 },
    { level: 40, totalExp: 698500 },
    { level: 50, totalExp: 1277600 },
    { level: 60, totalExp: 2131725 },
    { level: 70, totalExp: 3327650 },
    { level: 80, totalExp: 4939525 },
    { level: 90, totalExp: 8362650 }
];

/** Mora que cuesta cada fase de ascensión, según el nivel en el que se asciende. */
const ASCENSION_MORA_BY_LEVEL = {
    20: 20000,
    40: 40000,
    50: 60000,
    60: 80000,
    70: 100000,
    80: 120000
};

/** Datos de los libros de EXP. */
const EXP_BOOK = {
    name: { en: "Hero's Wit", es: 'Experiencia del héroe' },
    expPerBook: 20000,
    moraPerExpPoint: 0.2    // subir de nivel cuesta 1 Mora por cada 5 puntos de EXP
};

/** Días de la semana en cada idioma (posición 0 = domingo, como Date.getDay()). */
const WEEK_DAYS = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
};

/**
 * Libros de talento por región. Cada libro está disponible dos días a la semana
 * y el domingo están todos abiertos.
 * days: números de día según Date.getDay().
 */
const TALENT_BOOK_SCHEDULE = [
    {
        region: 'Mondstadt',
        books: [
            { nameEs: 'Libertad', nameEn: 'Freedom', days: [1, 4] },
            { nameEs: 'Resistencia', nameEn: 'Resistance', days: [2, 5] },
            { nameEs: 'Balada', nameEn: 'Ballad', days: [3, 6] }
        ]
    },
    {
        region: 'Liyue',
        books: [
            { nameEs: 'Prosperidad', nameEn: 'Prosperity', days: [1, 4] },
            { nameEs: 'Diligencia', nameEn: 'Diligence', days: [2, 5] },
            { nameEs: 'Oro', nameEn: 'Gold', days: [3, 6] }
        ]
    },
    {
        region: 'Inazuma',
        books: [
            { nameEs: 'Transitoriedad', nameEn: 'Transience', days: [1, 4] },
            { nameEs: 'Elegancia', nameEn: 'Elegance', days: [2, 5] },
            { nameEs: 'Luz', nameEn: 'Light', days: [3, 6] }
        ]
    },
    {
        region: 'Sumeru',
        books: [
            { nameEs: 'Amonestación', nameEn: 'Admonition', days: [1, 4] },
            { nameEs: 'Ingenio', nameEn: 'Ingenuity', days: [2, 5] },
            { nameEs: 'Praxis', nameEn: 'Praxis', days: [3, 6] }
        ]
    },
    {
        region: 'Fontaine',
        books: [
            { nameEs: 'Equidad', nameEn: 'Equity', days: [1, 4] },
            { nameEs: 'Justicia', nameEn: 'Justice', days: [2, 5] },
            { nameEs: 'Orden', nameEn: 'Order', days: [3, 6] }
        ]
    },
    {
        region: 'Natlan',
        books: [
            { nameEs: 'Contienda', nameEn: 'Contention', days: [1, 4] },
            { nameEs: 'Yesca', nameEn: 'Kindling', days: [2, 5] },
            { nameEs: 'Conflicto', nameEn: 'Conflict', days: [3, 6] }
        ]
    }
];
