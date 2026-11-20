/**
 * elements.js
 * Datos de los siete elementos de Teyvat.
 * Se comparten entre el fichero de personajes y el laboratorio elemental.
 * Los nombres de los elementos son iguales en inglés y en español.
 */

/**
 * Lista de elementos.
 * - id: identificador usado en el resto de datos y en las clases CSS (element--<id>).
 * - name: nombre que se muestra.
 * - icon: ruta del ícono, relativa a la raíz del sitio.
 */
const ELEMENTS = [
    { id: 'anemo', name: 'Anemo', icon: 'assets/icons/elements/anemo.svg' },
    { id: 'geo', name: 'Geo', icon: 'assets/icons/elements/geo.svg' },
    { id: 'electro', name: 'Electro', icon: 'assets/icons/elements/electro.svg' },
    { id: 'dendro', name: 'Dendro', icon: 'assets/icons/elements/dendro.svg' },
    { id: 'hydro', name: 'Hydro', icon: 'assets/icons/elements/hydro.svg' },
    { id: 'pyro', name: 'Pyro', icon: 'assets/icons/elements/pyro.svg' },
    { id: 'cryo', name: 'Cryo', icon: 'assets/icons/elements/cryo.svg' }
];

/**
 * Busca un elemento por su id.
 * @param {string} elementId - Id del elemento (por ejemplo, 'pyro').
 * @returns {object|undefined} El elemento encontrado.
 */
function findElementById(elementId) {
    return ELEMENTS.find((element) => element.id === elementId);
}
