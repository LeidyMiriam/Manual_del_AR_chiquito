/**
 * reactions.js
 * Datos de las reacciones elementales usados por el Laboratorio elemental.
 *
 * Cada reacción guarda su nombre en inglés (nameEn) y en español (nameEs).
 * En español también se muestra el nombre en inglés, porque la traducción
 * del juego puede variar y así es fácil buscarla en wikis y guías.
 */

/**
 * Tipos de reacción.
 * - label: nombre en singular (para el resultado del laboratorio).
 * - groupTitle: nombre en plural (para la enciclopedia).
 */
const REACTION_TYPES = {
    amplifying: {
        label: { en: 'Amplifying reaction', es: 'Reacción amplificadora' },
        groupTitle: { en: 'Amplifying reactions', es: 'Reacciones amplificadoras' },
        description: {
            en: 'They multiply the damage of the hit that triggers them. The order of the elements matters.',
            es: 'Multiplican el daño del golpe que las activa. El orden de los elementos importa.'
        }
    },
    transformative: {
        label: { en: 'Transformative reaction', es: 'Reacción transformativa' },
        groupTitle: { en: 'Transformative reactions', es: 'Reacciones transformativas' },
        description: {
            en: "They create their own damage or effect. They scale with the character's level and Elemental Mastery.",
            es: 'Generan un daño o efecto propio. Mejoran con el nivel del personaje y su Maestría Elemental.'
        }
    },
    dendro: {
        label: { en: 'Dendro reaction', es: 'Reacción Dendro' },
        groupTitle: { en: 'Dendro reactions', es: 'Reacciones Dendro' },
        description: {
            en: 'Reactions born from Dendro. Some of them have derived reactions.',
            es: 'Reacciones que nacen de Dendro. Algunas tienen reacciones derivadas.'
        }
    }
};

/**
 * Reacciones convencionales.
 * - elements: el primer elemento es la base y los demás son los elementos con los
 *   que reacciona. Ejemplo: ['anemo', 'pyro', 'hydro', ...] = Anemo + cualquiera de ellos.
 * - triggerMultipliers: solo en amplificadoras; multiplicador según el elemento que ACTIVA la reacción.
 * - derived: reacciones que pueden surgir a partir de esta.
 * - advancedIds: ids de ADVANCED_REACTIONS relacionadas (versiones Lunares o Estelares).
 */
const REACTIONS = [
    {
        id: 'vaporize',
        elements: ['hydro', 'pyro'],
        nameEn: 'Vaporize',
        nameEs: 'Vaporizado',
        type: 'amplifying',
        triggerMultipliers: { hydro: 2, pyro: 1.5 },
        description: {
            en: 'Water and fire cancel out in a cloud of steam, and the hit that causes it deals much more damage.',
            es: 'Agua y fuego se cancelan en una nube de vapor y el golpe que la provoca hace mucho más daño.'
        },
        tip: {
            en: "If your DPS's big hit is Hydro on an enemy affected by Pyro, you get the ×2 multiplier.",
            es: 'Si el golpe fuerte de tu DPS es Hydro sobre un enemigo con Pyro, obtienes el multiplicador ×2.'
        }
    },
    {
        id: 'melt',
        elements: ['pyro', 'cryo'],
        nameEn: 'Melt',
        nameEs: 'Derretido',
        type: 'amplifying',
        triggerMultipliers: { pyro: 2, cryo: 1.5 },
        description: {
            en: 'Fire melts ice and the hit that triggers the reaction multiplies its damage.',
            es: 'El fuego derrite el hielo y el golpe que activa la reacción multiplica su daño.'
        },
        tip: {
            en: 'Hitting an enemy affected by Cryo with Pyro gives ×2. It is the base of the National team with Chongyun.',
            es: 'Golpear con Pyro a un enemigo con Cryo da ×2. Es la base del equipo Nacional con Chongyun.'
        }
    },
    {
        id: 'overloaded',
        elements: ['pyro', 'electro'],
        nameEn: 'Overloaded',
        nameEs: 'Sobrecarga',
        type: 'transformative',
        description: {
            en: 'An AoE explosion that damages and knocks back enemies.',
            es: 'Una explosión de área que daña y empuja a los enemigos.'
        },
        tip: {
            en: 'Great for groups, annoying when enemies fly far away from your attacks.',
            es: 'Genial para grupos, molesta cuando los enemigos salen volando lejos de tus ataques.'
        }
    },
    {
        id: 'electro-charged',
        elements: ['hydro', 'electro'],
        nameEn: 'Electro-Charged',
        nameEs: 'Electrocargado',
        type: 'transformative',
        description: {
            en: 'Continuous Electro damage that also jumps to nearby wet enemies.',
            es: 'Daño Electro continuo que además salta a enemigos mojados cercanos.'
        },
        tip: {
            en: 'Works really well with characters who apply Hydro and Electro from off-field.',
            es: 'Funciona muy bien con personajes que aplican Hydro y Electro desde fuera del campo.'
        },
        advancedIds: ['lunar-charged']
    },
    {
        id: 'superconduct',
        elements: ['cryo', 'electro'],
        nameEn: 'Superconduct',
        nameEs: 'Superconductor',
        type: 'transformative',
        description: {
            en: "AoE Cryo damage that lowers enemies' Physical RES for a few seconds.",
            es: 'Daño Cryo en área que reduce la RES Física de los enemigos durante unos segundos.'
        },
        tip: {
            en: 'Use it before a physical damage DPS attacks (for example, claymore users without an element).',
            es: 'Úsalo antes de que ataque un DPS de daño físico (por ejemplo, con mandobles sin elemento).'
        },
        advancedIds: ['stellar-conduct']
    },
    {
        id: 'frozen',
        elements: ['hydro', 'cryo'],
        nameEn: 'Frozen',
        nameEs: 'Congelado',
        type: 'transformative',
        description: {
            en: "Enemies get trapped in ice and can't move. A heavy hit (claymore or Geo) breaks them with Shatter.",
            es: 'Los enemigos quedan atrapados en hielo y no pueden moverse. Un golpe contundente (mandoble o Geo) los rompe con Rompehielo.'
        },
        tip: {
            en: "Excellent for crowd control. It doesn't work on most big bosses.",
            es: 'Excelente para controlar enemigos. No funciona contra la mayoría de los jefes grandes.'
        }
    },
    {
        id: 'swirl',
        elements: ['anemo', 'pyro', 'hydro', 'electro', 'cryo'],
        nameEn: 'Swirl',
        nameEs: 'Torbellino',
        type: 'transformative',
        description: {
            en: 'Anemo spreads the other element to nearby enemies and usually groups them.',
            es: 'Anemo esparce el otro elemento a los enemigos cercanos y suele agruparlos.'
        },
        tip: {
            en: "Swirl only happens with Pyro, Hydro, Electro or Cryo. Anemo doesn't react with Geo or Dendro.",
            es: 'Torbellino solo ocurre con Pyro, Hydro, Electro o Cryo. Anemo no reacciona con Geo ni Dendro.'
        },
        advancedIds: ['stellar-swirl']
    },
    {
        id: 'crystallize',
        elements: ['geo', 'pyro', 'hydro', 'electro', 'cryo'],
        nameEn: 'Crystallize',
        nameEs: 'Cristalizado',
        type: 'transformative',
        description: {
            en: 'Geo creates a shard that gives you a shield of the other element when you pick it up.',
            es: 'Geo crea un fragmento que, al recogerlo, te da un escudo del otro elemento.'
        },
        tip: {
            en: "Pick up the shards: that extra shield saves you more often than you'd think.",
            es: 'Recoge los fragmentos: ese escudo extra te salva más veces de las que crees.'
        },
        advancedIds: ['lunar-crystallize']
    },
    {
        id: 'burning',
        elements: ['dendro', 'pyro'],
        nameEn: 'Burning',
        nameEs: 'Quemadura',
        type: 'dendro',
        description: {
            en: 'Continuous AoE Pyro damage for as long as the fire lasts.',
            es: 'Daño Pyro continuo en área mientras dure el fuego.'
        },
        tip: {
            en: 'Careful with grass: Pyro also burns the scenery (and sometimes you).',
            es: 'Cuidado con el pasto: Pyro también quema el escenario (y a veces te quema a ti).'
        }
    },
    {
        id: 'bloom',
        elements: ['dendro', 'hydro'],
        nameEn: 'Bloom',
        nameEs: 'Florecimiento',
        type: 'dendro',
        description: {
            en: 'Dendro cores appear and explode after a few seconds. Their damage depends on level and Elemental Mastery, not ATK.',
            es: 'Aparecen núcleos Dendro que explotan tras unos segundos. Su daño depende del nivel y de la Maestría Elemental, no del ATQ.'
        },
        tip: {
            en: 'The explosions can also hurt your character: bring someone who heals.',
            es: 'Las explosiones también pueden dañar a tu personaje: lleva a alguien que cure.'
        },
        derived: [
            {
                nameEn: 'Hyperbloom',
                nameEs: 'Hiperflorecimiento',
                text: { en: 'Electro on a core: fires projectiles that chase enemies.', es: 'Electro sobre un núcleo: dispara proyectiles que persiguen enemigos.' }
            },
            {
                nameEn: 'Burgeon',
                nameEs: 'Brote',
                text: { en: 'Pyro on a core: instant AoE explosion.', es: 'Pyro sobre un núcleo: explosión inmediata de área.' }
            }
        ],
        advancedIds: ['lunar-bloom']
    },
    {
        id: 'quicken',
        elements: ['dendro', 'electro'],
        nameEn: 'Quicken',
        nameEs: 'Aceleración',
        type: 'dendro',
        description: {
            en: 'The enemy enters a "Quicken" state, which sets up two very strong derived reactions.',
            es: 'El enemigo queda en estado "acelerado", lo que prepara dos reacciones derivadas muy fuertes.'
        },
        tip: {
            en: 'Keep hitting the Quickened enemy with Electro or Dendro to trigger the derived reactions.',
            es: 'Sigue golpeando con Electro o Dendro al enemigo acelerado para activar las derivadas.'
        },
        derived: [
            {
                nameEn: 'Aggravate',
                nameEs: 'Agravamiento',
                text: { en: 'An Electro hit on a Quickened enemy: more Electro damage.', es: 'Golpe Electro sobre un enemigo acelerado: más daño Electro.' }
            },
            {
                nameEn: 'Spread',
                nameEs: 'Propagación',
                text: { en: 'A Dendro hit on a Quickened enemy: more Dendro damage.', es: 'Golpe Dendro sobre un enemigo acelerado: más daño Dendro.' }
            }
        ]
    }
];

/**
 * Pares de elementos que NO reaccionan entre sí.
 * Se guardan ordenados alfabéticamente para compararlos fácilmente.
 */
const NON_REACTIVE_PAIRS = [
    ['anemo', 'geo'],
    ['anemo', 'dendro'],
    ['dendro', 'geo'],
    ['cryo', 'dendro']
];

/** Nombre del Viajero en su versión Cryo (aparece en las reacciones Estelares). */
const CRYO_TRAVELER = { en: 'Traveler (Cryo)', es: 'Viajero/a (Cryo)' };

/**
 * Reacciones avanzadas: no se activan solo combinando elementos.
 * Necesitan personajes concretos en el equipo.
 * Información revisada en la versión indicada en SITE_INFO.gameVersion.
 */
const ADVANCED_REACTIONS = [
    {
        id: 'lunar-charged',
        family: { en: 'Lunar', es: 'Lunar' },
        nameEn: 'Lunar-Charged',
        nameEs: 'Electrocargado lunar',
        elements: ['hydro', 'electro'],
        replaces: { en: 'Electro-Charged', es: 'Electrocargado' },
        enablers: ['Ineffa', 'Flins', 'Columbina'],
        description: {
            en: 'A version of Electro-Charged that appears when a compatible 5★ Moonsign character is on the team.',
            es: 'Versión de Electrocargado que aparece cuando un personaje Moonsign de 5★ compatible está en el equipo.'
        }
    },
    {
        id: 'lunar-bloom',
        family: { en: 'Lunar', es: 'Lunar' },
        nameEn: 'Lunar-Bloom',
        nameEs: 'Florecimiento lunar',
        elements: ['dendro', 'hydro'],
        replaces: { en: 'Bloom', es: 'Florecimiento' },
        enablers: ['Lauma', 'Nefer', 'Columbina'],
        description: {
            en: 'A version of Bloom tied to certain Nod-Krai characters.',
            es: 'Versión de Florecimiento ligada a ciertos personajes de Nod-Krai.'
        }
    },
    {
        id: 'lunar-crystallize',
        family: { en: 'Lunar', es: 'Lunar' },
        nameEn: 'Lunar-Crystallize',
        nameEs: 'Cristalizado lunar',
        elements: ['geo', 'hydro'],
        replaces: { en: 'Crystallize (Hydro)', es: 'Cristalizado (Hydro)' },
        enablers: ['Zibai', 'Columbina'],
        description: {
            en: 'A version of the Geo + Hydro crystallization that only specific characters can trigger.',
            es: 'Versión de la cristalización Geo + Hydro que solo activan personajes concretos.'
        }
    },
    {
        id: 'stellar-conduct',
        family: { en: 'Stellar', es: 'Estelar' },
        nameEn: 'Stellar-Conduct',
        nameEs: 'Superconductor estelar',
        elements: ['cryo', 'electro'],
        replaces: { en: 'Superconduct', es: 'Superconductor' },
        enablers: ['Odette', 'Sandrone', CRYO_TRAVELER, 'Mitya'],
        description: {
            en: 'A version of Superconduct that arrived with Snezhnaya. It can land critical hits.',
            es: 'Versión de Superconductor llegada con Snezhnaya. Puede asestar golpes críticos.'
        }
    },
    {
        id: 'stellar-swirl',
        family: { en: 'Stellar', es: 'Estelar' },
        nameEn: 'Stellar Swirl',
        nameEs: 'Torbellino estelar',
        elements: ['anemo', 'cryo'],
        replaces: { en: 'Swirl (Cryo)', es: 'Torbellino (Cryo)' },
        enablers: ['Odette', 'Sandrone', CRYO_TRAVELER],
        description: {
            en: 'A version of Cryo Swirl that creates a "Stellar Vortex" on the field.',
            es: 'Versión del Torbellino Cryo que genera un "vórtice estelar" en el campo.'
        }
    }
];

/**
 * Busca la reacción que producen dos elementos (sin importar el orden).
 * @param {string} firstElementId - Id del primer elemento.
 * @param {string} secondElementId - Id del segundo elemento.
 * @returns {object|null} La reacción encontrada, o null si no reaccionan.
 */
function findReaction(firstElementId, secondElementId) {
    if (firstElementId === secondElementId) {
        return null;
    }

    const sortedPair = [firstElementId, secondElementId].sort();
    const isNonReactive = NON_REACTIVE_PAIRS.some((pair) =>
        pair[0] === sortedPair[0] && pair[1] === sortedPair[1]
    );
    if (isNonReactive) {
        return null;
    }

    // El primer elemento de cada reacción es la base; los demás reaccionan con ella
    const reaction = REACTIONS.find((candidate) => {
        const [baseElement, ...reactingElements] = candidate.elements;
        return (baseElement === firstElementId && reactingElements.includes(secondElementId))
            || (baseElement === secondElementId && reactingElements.includes(firstElementId));
    });

    return reaction || null;
}

/**
 * Busca una reacción avanzada (Lunar o Estelar) por su id.
 * @param {string} advancedId - Id de la reacción avanzada.
 * @returns {object|undefined} La reacción avanzada encontrada.
 */
function findAdvancedReactionById(advancedId) {
    return ADVANCED_REACTIONS.find((reaction) => reaction.id === advancedId);
}
