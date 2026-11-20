/**
 * characters.js
 * Fichas de personajes gratuitos, de cuatro estrellas y de cinco estrellas
 * del banner permanente. Son los personajes que una cuenta nueva tiene más
 * probabilidades de tener, por eso el fichero se enfoca en ellos.
 *
 * Campos de cada personaje:
 * - id: identificador único (también es el nombre de su imagen).
 * - name: nombre (texto simple, o { en, es } si cambia según el idioma).
 * - element: id de un elemento de ELEMENTS (data/elements.js).
 * - weapon: clave de WEAPON_TYPES.
 * - rarity: 4 o 5 estrellas.
 * - origin: clave de CHARACTER_ORIGINS (filtro "¿Cómo se consigue?").
 * - roles: lista de claves de CHARACTER_ROLES.
 * - obtain, summary, tip: textos { en, es }.
 */

/** Roles de equipo con su nombre visible. */
const CHARACTER_ROLES = {
    'dps': { en: 'Main DPS', es: 'DPS principal' },
    'sub-dps': { en: 'Sub-DPS', es: 'Sub-DPS' },
    'support': { en: 'Support', es: 'Support' },
    'healer': { en: 'Healer', es: 'Healer' },
    'shielder': { en: 'Shielder', es: 'Shielder' }
};

/** Formas de conseguir a un personaje. */
const CHARACTER_ORIGINS = {
    'gratis': { en: 'Free', es: 'Gratis' },
    'cuatro-estrellas': { en: '4★ from wishes', es: '4★ de deseos' },
    'permanente': { en: 'Standard 5★', es: '5★ permanente' }
};

/** Tipos de arma. */
const WEAPON_TYPES = {
    sword: { en: 'Sword', es: 'Espada' },
    claymore: { en: 'Claymore', es: 'Mandoble' },
    polearm: { en: 'Polearm', es: 'Lanza' },
    bow: { en: 'Bow', es: 'Arco' },
    catalyst: { en: 'Catalyst', es: 'Catalizador' }
};

/* Textos de "cómo conseguirlo" que comparten varios personajes */
const OBTAIN_PROLOGUE = { en: 'Joins you during the Prologue.', es: 'Se une a ti durante el Prólogo.' };
const OBTAIN_STANDARD_FOUR_STAR = { en: 'Wishes (standard and event banners, as a 4★).', es: 'Deseos (banner permanente y de evento como 4★).' };
const OBTAIN_EVENT_FOUR_STAR = { en: 'Wishes (event banners, as a 4★).', es: 'Deseos (banner de evento como 4★).' };
const OBTAIN_STANDARD_FIVE_STAR = { en: 'Standard banner (Acquaint Fates) or by losing a 50/50.', es: 'Banner permanente (Destinos del encuentro) o al perder un 50/50.' };

const CHARACTERS = [
    /* ---------- Personajes gratuitos ---------- */
    {
        id: 'viajero',
        name: { en: 'Traveler (Dendro)', es: 'Viajero/a (Dendro)' },
        element: 'dendro',
        weapon: 'sword',
        rarity: 5,
        origin: 'gratis',
        roles: ['sub-dps', 'support'],
        obtain: {
            en: "That's you. Literally. Changes element at the Statues of The Seven.",
            es: 'Eres tú. Literalmente. Cambia de elemento en las Estatuas de los Siete.'
        },
        summary: {
            en: 'Shown here in the Dendro version: their Burst applies Dendro from off-field.',
            es: 'Aquí lo mostramos en su versión Dendro: su definitiva aplica Dendro desde fuera del campo.'
        },
        tip: {
            en: 'Unlocking the Dendro version (in Sumeru) is the cheapest way to start with Bloom.',
            es: 'Desbloquear su versión Dendro (en Sumeru) es la forma más barata de empezar con Florecimiento.'
        }
    },
    {
        id: 'amber',
        name: 'Amber',
        element: 'pyro',
        weapon: 'bow',
        rarity: 4,
        origin: 'gratis',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_PROLOGUE,
        summary: {
            en: 'The first friend the game gives you. Her doll, Baron Bunny, taunts enemies and explodes.',
            es: 'La primera amiga que te regala el juego. Su muñeco, el Barón Conejo, atrae enemigos y explota.'
        },
        tip: {
            en: "There are stronger Pyro characters, but her passive lowers gliding stamina. Don't abandon her completely.",
            es: 'Hay Pyro más fuertes, pero su pasiva reduce la estamina al planear. No la abandones del todo.'
        }
    },
    {
        id: 'kaeya',
        name: 'Kaeya',
        element: 'cryo',
        weapon: 'sword',
        rarity: 4,
        origin: 'gratis',
        roles: ['dps', 'sub-dps'],
        obtain: OBTAIN_PROLOGUE,
        summary: {
            en: 'A Favonius knight with ice to spare. His Burst leaves icicles spinning around him.',
            es: 'Caballero de Favonius con hielo de sobra. Su definitiva deja carámbanos girando a su alrededor.'
        },
        tip: {
            en: 'With a Hydro character on the team, he freezes enemies effortlessly.',
            es: 'Con un personaje Hydro en el equipo congela enemigos sin esfuerzo.'
        }
    },
    {
        id: 'lisa',
        name: 'Lisa',
        element: 'electro',
        weapon: 'catalyst',
        rarity: 4,
        origin: 'gratis',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_PROLOGUE,
        summary: {
            en: "Mondstadt's most relaxed librarian. Her Burst fires lightning on its own.",
            es: 'La bibliotecaria más relajada de Mondstadt. Su definitiva lanza descargas automáticas.'
        },
        tip: {
            en: 'Enemies hit by her Burst lose defense, so the whole team benefits.',
            es: 'Los enemigos golpeados por su definitiva pierden defensa, así que todo el equipo sale ganando.'
        }
    },
    {
        id: 'barbara',
        name: 'Barbara',
        element: 'hydro',
        weapon: 'catalyst',
        rarity: 4,
        origin: 'gratis',
        roles: ['healer'],
        obtain: {
            en: 'Free through a permanent event after progressing in the Prologue (check your event log).',
            es: 'Gratis mediante un evento permanente tras avanzar en el Prólogo (revisa tu registro de eventos).'
        },
        summary: {
            en: "Mondstadt's idol and full-time healer. She heals while she attacks.",
            es: 'Idol de Mondstadt y curandera de tiempo completo. Cura mientras ataca.'
        },
        tip: {
            en: 'She applies Hydro little by little: perfect for your first Bloom team and for not dying while you learn.',
            es: 'Aplica Hydro poco a poco: perfecta para tu primer equipo de Florecimiento y para no morir mientras aprendes.'
        }
    },
    {
        id: 'xiangling',
        name: 'Xiangling',
        element: 'pyro',
        weapon: 'polearm',
        rarity: 4,
        origin: 'gratis',
        roles: ['sub-dps'],
        obtain: {
            en: 'Free by clearing floor 3 of the Spiral Abyss.',
            es: 'Gratis al superar el piso 3 del Abismo de la Espiral.'
        },
        summary: {
            en: 'A chef with a fire bear (Guoba) and a ring of flames that keeps spinning even when you switch characters.',
            es: 'Chef con un oso de fuego (Guoba) y un remolino de llamas que gira aunque cambies de personaje.'
        },
        tip: {
            en: 'She needs Energy Recharge to use her Burst often. With Bennett by her side, she shines.',
            es: 'Necesita Recarga de Energía para usar su definitiva seguido. Con Bennett al lado, brilla.'
        }
    },
    {
        id: 'collei',
        name: 'Collei',
        element: 'dendro',
        weapon: 'bow',
        rarity: 4,
        origin: 'gratis',
        roles: ['sub-dps'],
        obtain: {
            en: 'Free by clearing floor 4 of the Spiral Abyss.',
            es: 'Gratis al superar el piso 4 del Abismo de la Espiral.'
        },
        summary: {
            en: 'A Sumeru forest ranger. Her boomerang and her Burst apply Dendro from off-field.',
            es: 'Guardabosques de Sumeru. Su bumerán y su definitiva aplican Dendro desde fuera del campo.'
        },
        tip: {
            en: "She's the gateway to Dendro reactions: pair her with Hydro or Electro.",
            es: 'Es la puerta de entrada a las reacciones Dendro: combínala con Hydro o Electro.'
        }
    },
    {
        id: 'noelle',
        name: 'Noelle',
        element: 'geo',
        weapon: 'claymore',
        rarity: 4,
        origin: 'gratis',
        roles: ['dps', 'shielder', 'healer'],
        obtain: {
            en: "Guaranteed in your first 10 wishes on the Beginners' Wish.",
            es: 'Garantizada en tus primeros 10 deseos del Deseo de principiante.'
        },
        summary: {
            en: 'The Knights of Favonius maid: shields, healing and scary claymore hits.',
            es: 'La sirvienta de los Caballeros de Favonius: escudo, curación y golpes de mandoble que dan miedo.'
        },
        tip: {
            en: 'Yes, Noelle can do it. Let her work, please. Her damage scales with her DEF.',
            es: 'Sí, Noelle puede hacerlo. Déjala trabajar, por favor. Su daño crece con su DEF.'
        }
    },

    /* ---------- Cuatro estrellas de deseos ---------- */
    {
        id: 'bennett',
        name: 'Bennett',
        element: 'pyro',
        weapon: 'sword',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['support', 'healer'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'The unluckiest guy in Teyvat and one of the best supports. His Burst heals and boosts ATK.',
            es: 'El chico con peor suerte de Teyvat y uno de los mejores supports. Su definitiva cura y sube el ATQ.'
        },
        tip: {
            en: "The extra ATK depends on Bennett's base ATK and his weapon: give him a weapon with high base ATK.",
            es: 'El ATQ extra que da depende del ATQ base de Bennett y su arma: dale un arma con buen ATQ base.'
        }
    },
    {
        id: 'xingqiu',
        name: 'Xingqiu',
        element: 'hydro',
        weapon: 'sword',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'An avid reader. His Burst fires rain swords that attack along with your active character.',
            es: 'Lector empedernido. Su definitiva lanza espadas de lluvia que atacan junto a tu personaje activo.'
        },
        tip: {
            en: "While his swords are active, he also reduces the damage you take. Xiangling's perfect partner.",
            es: 'Mientras tiene espadas activas también reduce el daño que recibes. Pareja ideal de Xiangling.'
        }
    },
    {
        id: 'chongyun',
        name: 'Chongyun',
        element: 'cryo',
        weapon: 'claymore',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['dps', 'sub-dps', 'support'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: "An exorcist who can't handle spicy food. His field turns sword, claymore and polearm attacks into Cryo.",
            es: 'Exorcista que no soporta la comida picante. Su campo convierte en Cryo los ataques de espadas, mandobles y lanzas.'
        },
        tip: {
            en: "In the National team he brings Cryo for Melt. He's also a really fun on-field DPS.",
            es: 'En el Nacional aporta Cryo para Derretido. También es un DPS en campo muy divertido.'
        }
    },
    {
        id: 'fischl',
        name: 'Fischl',
        element: 'electro',
        weapon: 'bow',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['sub-dps'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'The Prinzessin der Verurteilung (according to her). Her raven Oz attacks on his own for quite a while.',
            es: 'Princesa del Juicio Final (según ella). Su cuervo Oz ataca solo durante un buen rato.'
        },
        tip: {
            en: 'Summon Oz and switch characters: Oz keeps working while you do something else.',
            es: 'Invoca a Oz y cambia de personaje: Oz sigue trabajando mientras tú haces otra cosa.'
        }
    },
    {
        id: 'sucrose',
        name: 'Sucrose',
        element: 'anemo',
        weapon: 'catalyst',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['support'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'A shy alchemist who groups enemies and shares Elemental Mastery with the team.',
            es: 'Alquimista tímida que agrupa enemigos y reparte Maestría Elemental al equipo.'
        },
        tip: {
            en: "Grouping enemies is already half the fight. In reaction teams she's pure gold.",
            es: 'Agrupar enemigos ya es media pelea ganada. En equipos de reacciones es oro puro.'
        }
    },
    {
        id: 'beidou',
        name: 'Beidou',
        element: 'electro',
        weapon: 'claymore',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['sub-dps'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'Captain of the Crux fleet. Her Burst fires lightning that bounces between enemies.',
            es: 'Capitana de la flota Crux. Su definitiva lanza rayos que rebotan entre enemigos.'
        },
        tip: {
            en: 'She shines when lots of enemies are grouped together. Against a single boss she loses strength.',
            es: 'Brilla cuando hay muchos enemigos juntos. Contra un solo jefe pierde fuerza.'
        }
    },
    {
        id: 'diona',
        name: 'Diona',
        element: 'cryo',
        weapon: 'bow',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['shielder', 'healer'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'A bartender who hates wine. Her Skill gives a shield and her Burst creates a healing field.',
            es: 'Bartender que odia el vino. Su habilidad da escudo y su definitiva crea un campo que cura.'
        },
        tip: {
            en: 'Hold her Skill for a bigger shield.',
            es: 'Mantén presionada su habilidad para un escudo más grande.'
        }
    },
    {
        id: 'kuki-shinobu',
        name: 'Kuki Shinobu',
        element: 'electro',
        weapon: 'sword',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['healer', 'sub-dps'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: 'An Inazuma ninja. Her ring heals and applies Electro from off-field.',
            es: 'Ninja de Inazuma. Su anillo cura y aplica Electro desde fuera del campo.'
        },
        tip: {
            en: 'Ideal for Hyperbloom. Her Skill costs a bit of her HP, but she recovers it on her own.',
            es: 'Ideal para Hiperflorecimiento. Su habilidad gasta un poco de su vida, pero se recupera sola.'
        }
    },
    {
        id: 'layla',
        name: 'Layla',
        element: 'cryo',
        weapon: 'sword',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['shielder'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: 'A student who is always sleepy. Her shield is sturdy and fires Cryo stars.',
            es: 'Estudiante que siempre tiene sueño. Su escudo es resistente y dispara estrellas Cryo.'
        },
        tip: {
            en: "A great 4★ shielder if you still don't have anyone protecting you.",
            es: 'Gran escudera de 4★ si todavía no tienes a nadie que te proteja.'
        }
    },
    {
        id: 'ningguang',
        name: 'Ningguang',
        element: 'geo',
        weapon: 'catalyst',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['dps'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: "Liyue's Tianquan. Charged attacks with gems, a jade wall and a rain of stones.",
            es: 'La Tianquan de Liyue. Ataques cargados con gemas, un muro de jade y lluvia de piedras.'
        },
        tip: {
            en: 'Her passive shows ore veins on the minimap: bring her when you go mining.',
            es: 'Su pasiva muestra vetas de mineral en el minimapa: llévala cuando salgas a minar.'
        }
    },
    {
        id: 'gorou',
        name: 'Gorou',
        element: 'geo',
        weapon: 'bow',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['support'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: "Watatsumi's general. Boosts DEF and Geo damage when the team has several Geo characters.",
            es: 'General de Watatsumi. Aumenta la DEF y el daño Geo cuando el equipo tiene varios Geo.'
        },
        tip: {
            en: "Noelle's best friend. His passive shows Inazuma specialties on the minimap.",
            es: 'El mejor amigo de Noelle. Su pasiva muestra especialidades de Inazuma en el minimapa.'
        }
    },
    {
        id: 'yaoyao',
        name: 'Yaoyao',
        element: 'dendro',
        weapon: 'polearm',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['healer', 'sub-dps'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: 'A little disciple with a jade rabbit that throws radishes that heal and apply Dendro.',
            es: 'Pequeña discípula con un conejo de jade que lanza rábanos que curan y aplican Dendro.'
        },
        tip: {
            en: 'Off-field healing, ideal for Bloom teams.',
            es: 'Curación desde fuera del campo, ideal para equipos de Florecimiento.'
        }
    },
    {
        id: 'kirara',
        name: 'Kirara',
        element: 'dendro',
        weapon: 'sword',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['shielder'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: 'A youkai cat courier. She hops into a box and protects you with a shield.',
            es: 'Gata yōkai repartidora. Se mete en una caja y te protege con un escudo.'
        },
        tip: {
            en: 'A strong, easy-to-use shield. Plus, she moves super fast while exploring.',
            es: 'Escudo fuerte y fácil de usar. Además se mueve rapidísimo al explorar.'
        }
    },
    {
        id: 'thoma',
        name: 'Thoma',
        element: 'pyro',
        weapon: 'polearm',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['shielder', 'support'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: "The Kamisato clan's housekeeper. His Pyro shield gets stronger every time he attacks.",
            es: 'Mayordomo del clan Kamisato. Su escudo Pyro se refuerza cada vez que ataca.'
        },
        tip: {
            en: "A good defensive replacement for Bennett in teams that don't depend on his ATK bonus.",
            es: 'Buen reemplazo defensivo de Bennett en equipos que no dependen de su bono de ATQ.'
        }
    },
    {
        id: 'razor',
        name: 'Razor',
        element: 'electro',
        weapon: 'claymore',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['dps'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'A boy raised by wolves. He hits hard and fast with his claymore.',
            es: 'Chico criado por lobos. Golpea fuerte y rápido con su mandoble.'
        },
        tip: {
            en: 'A simple on-field DPS: his Burst powers up his normal attacks.',
            es: 'Un DPS en campo sencillo: su definitiva potencia sus ataques normales.'
        }
    },
    {
        id: 'faruzan',
        name: 'Faruzan',
        element: 'anemo',
        weapon: 'bow',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['support'],
        obtain: OBTAIN_EVENT_FOUR_STAR,
        summary: {
            en: 'A researcher who is older than she looks. She hugely boosts Anemo damage.',
            es: 'Investigadora con más años de los que aparenta. Potencia muchísimo el daño Anemo.'
        },
        tip: {
            en: 'Meant for teams with an Anemo DPS; outside of them she contributes much less.',
            es: 'Pensada para equipos con DPS Anemo; fuera de ellos aporta mucho menos.'
        }
    },
    {
        id: 'rosaria',
        name: 'Rosaria',
        element: 'cryo',
        weapon: 'polearm',
        rarity: 4,
        origin: 'cuatro-estrellas',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_STANDARD_FOUR_STAR,
        summary: {
            en: 'A nun with very little patience. Her Burst attacks with Cryo from off-field.',
            es: 'Monja con muy poca paciencia. Su definitiva ataca con Cryo desde fuera del campo.'
        },
        tip: {
            en: 'Her passive shares part of her CRIT Rate with the team.',
            es: 'Su pasiva comparte parte de su Probabilidad de Crítico con el equipo.'
        }
    },

    /* ---------- Cinco estrellas del banner permanente ---------- */
    {
        id: 'jean',
        name: 'Jean',
        element: 'anemo',
        weapon: 'sword',
        rarity: 5,
        origin: 'permanente',
        roles: ['healer', 'support'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'Acting Grand Master of Favonius. She heals the whole team and her Skill sends enemies flying.',
            es: 'Gran Maestra Interina de Favonius. Cura a todo el equipo y su habilidad lanza enemigos por los aires.'
        },
        tip: {
            en: "If you got her by losing a 50/50, don't cry too much: she's a great healer.",
            es: 'Si te salió al perder un 50/50, no llores tanto: es una gran sanadora.'
        }
    },
    {
        id: 'diluc',
        name: 'Diluc',
        element: 'pyro',
        weapon: 'claymore',
        rarity: 5,
        origin: 'permanente',
        roles: ['dps'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'Owner of the Dawn Winery. Very heavy Pyro claymore combos.',
            es: 'Dueño del Viñedo del Amanecer. Combos de mandoble Pyro muy contundentes.'
        },
        tip: {
            en: 'Pair him with Hydro or Cryo to take advantage of Vaporize and Melt.',
            es: 'Combínalo con Hydro o Cryo para aprovechar Vaporizado y Derretido.'
        }
    },
    {
        id: 'qiqi',
        name: 'Qiqi',
        element: 'cryo',
        weapon: 'sword',
        rarity: 5,
        origin: 'permanente',
        roles: ['healer'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'An adorable zombie with a terrible memory. She heals with every attack while her Skill is active.',
            es: 'Zombi adorable con muy mala memoria. Cura con cada ataque mientras su habilidad está activa.'
        },
        tip: {
            en: 'Her passive shows Liyue specialties on the minimap. Useful for gathering.',
            es: 'Su pasiva muestra especialidades de Liyue en el minimapa. Útil para recolectar.'
        }
    },
    {
        id: 'mona',
        name: 'Mona',
        element: 'hydro',
        weapon: 'catalyst',
        rarity: 5,
        origin: 'permanente',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'An astrologist who is always broke. Her Burst applies a big damage bonus.',
            es: 'Astróloga siempre en bancarrota. Su definitiva aplica un gran bono de daño.'
        },
        tip: {
            en: 'Instead of sprinting, she glides through water: super fast for exploring.',
            es: 'En lugar de correr, se desliza por el agua: rapidísima para explorar.'
        }
    },
    {
        id: 'keqing',
        name: 'Keqing',
        element: 'electro',
        weapon: 'sword',
        rarity: 5,
        origin: 'permanente',
        roles: ['dps'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: "Liyue's Yuheng. Teleports, fast slashes and tons of style.",
            es: 'La Yuheng de Liyue. Teletransporte, cortes rápidos y muchísimo estilo.'
        },
        tip: {
            en: 'She shines in Quicken teams, alongside Dendro characters.',
            es: 'Brilla en equipos de Aceleración, junto a personajes Dendro.'
        }
    },
    {
        id: 'tighnari',
        name: 'Tighnari',
        element: 'dendro',
        weapon: 'bow',
        rarity: 5,
        origin: 'permanente',
        roles: ['dps'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'Head forest ranger of Avidya. Very fast Dendro charged shots.',
            es: 'Guardabosques jefe de Avidya. Disparos cargados Dendro muy rápidos.'
        },
        tip: {
            en: 'His passive marks Sumeru specialties on the minimap.',
            es: 'Su pasiva marca especialidades de Sumeru en el minimapa.'
        }
    },
    {
        id: 'dehya',
        name: 'Dehya',
        element: 'pyro',
        weapon: 'claymore',
        rarity: 5,
        origin: 'permanente',
        roles: ['sub-dps', 'support'],
        obtain: OBTAIN_STANDARD_FIVE_STAR,
        summary: {
            en: 'An Eremite mercenary. She takes part of the damage dealt to your team.',
            es: 'Mercenaria de los Eremitas. Recibe parte del daño que le hacen a tu equipo.'
        },
        tip: {
            en: "She's not the strongest on the banner, but she makes your fragile characters suffer less.",
            es: 'No es la más fuerte del banner, pero hace que tus personajes frágiles sufran menos.'
        }
    }
];

/**
 * Busca un personaje por su id.
 * @param {string} characterId - Id del personaje.
 * @returns {object|undefined} El personaje encontrado.
 */
function findCharacterById(characterId) {
    return CHARACTERS.find((character) => character.id === characterId);
}
