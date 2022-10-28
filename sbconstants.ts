//file containing a bunch of raw data not found in api about skyblock

import { allStatsBoost } from "./lib";

//tier of an item
export type itemTier = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC" | "DIVINE" | "SPECIAL" | "VERY_SPECIAL";

//type of soulbound an item is
export type itemSoulboundType = "COOP" | "SOLO";

//item stats found in api
export interface itemStats {
    HEALTH?: number,
    DEFENSE?: number,
    TRUE_DEFENSE?: number,
    STRENGTH?: number,
    WALK_SPEED?: number,
    CRITICAL_CHANCE?: number,
    CRITICAL_DAMAGE?: number,
    INTELLIGENCE?: number,
    MINING_SPEED?: number,
    SEA_CREATURE_CHANCE?: number,
    MAGIC_FIND?: number,
    PET_LUCK?: number,
    ATTACK_SPEED?: number,
    ABILITY_DAMAGE?: number,
    FEROCITY?: number,
    MINING_FORTUNE?: number,
    FARMING_FORTUNE?: number,
    FORAGING_FORTUNE?: number,
    BREAKING_POWER?: number,
    PRISTINE?: number,
    COMBAT_WISDOM?: number,
    MINING_WISDOM?: number,
    FARMING_WISDOM?: number,
    FORAGING_WISDOM?: number,
    FISHING_WISDOM?: number,
    ENCHANTING_WISDOM?: number,
    ALCHEMY_WISDOM?: number,
    CARPENTRY_WISDOM?: number,
    RUNECRAFTING_WISDOM?: number,
    SOCIAL_WISDOM?: number,
    FISHING_SPEED?: number,
    HEALTH_REGEN?: number,
    VITALITY?: number,
    MENDING?: number,
}


/*

//CAN DO THESE ONES LATER

export type itemRequirementType = "DUNGEON_TIER" | "DUNGEON_SKILL" | "TROPHY_FISHING";
export type dungeonType = "CATACOMBS";
export type trophyFishingReward = "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";

export interface itemRequirement {
    type: itemRequirementType,
    dungeon_type?: dungeonType,
    tier?: number,
    level?: number,
    reward?: trophyFishingReward,
}

export interface itemUpgradeCost {
    type: "ITEM" | "ESSENCE",
    item_id?: string,
    essence_type?: string,
    amount: number,
}
*/

export type itemGemstoneSlotType = "JADE" | "AMBER" | "TOPAZ" | "SAPPHIRE" | "AMETHYST" | "JASPER" | "RUBY" | "MINING" | "COMBAT" | "DEFENSIVE" | "OFFENSIVE" | "UNIVERSAL";

export interface itemGemstoneSlotCost {
    type: string,
    item_id: string,
    amount: number
}

//gemstone slot of an item
export interface itemGemstoneSlot {
    slot_type: itemGemstoneSlotType,
    costs: itemGemstoneSlotCost[]
}

//info about an item, found in items api
export interface item {
    material: string,
    durability?: number,
    item_durability?: number,
    skin?: string,
    name: string,
    glowing?: boolean,
    category: string,
    tier?: itemTier,
    soulbound: itemSoulboundType,
    stats?: itemStats,
    npc_sell_price: number,
    requirements: any,
    can_have_attributes: boolean,
    salvageable_from_recipe: boolean,
    unstackable?: boolean,
    description?: string,
    museum?: boolean,
    gemstone_slots: itemGemstoneSlot[],
    dungeon_item?: boolean
    id: string,
}

//info found on the nbt data of an item
export interface nbtItem {
    id: number
    count: number,
    tag: {
        HideFlags: number,
        SkullOwner?: { //for items that are player heads
            Id: string,
            Properties: {
                textures: {Value: string}[]
            }
        }
        display: {
            Lore: string[],
            Name: string
        },
        ExtraAttributes: {
            modifier?: string, //reforge
            attributes?: {
                [key: string]: number
            },
            id: string,
            uuid?: string,
            timestamp: string,
            enchantments?: {
                [key: string]: number
            },
            hot_potato_count?: number,
            dungeon_item_level?: number, //dungeon stars
            gems?: { //gemstones
                [key: string]: itemGemstoneSlotType
            },
            rarity_upgrades?: number, //reomb
            talisman_enrichment?: statName, //enrichment
        }
    },
    Damage: number
}

//some item ids arent in the items api (for example, PARTY_HAT_CRAB_ANIMATED doesnt exist, the right one would be PARTY_HAT_CRAB)
export const itemIdReplacements = new Map<string, string>([
    ["PARTY_HAT_CRAB_ANIMATED", "PARTY_HAT_CRAB"]
]);


//color code
export type colorCode = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f";


//map from itemRarity to color code
export const rarityColors: {
    [tier in itemTier]: colorCode
} = {
    COMMON: "f",
    UNCOMMON: "a",
    RARE: "9",
    EPIC: "5",
    LEGENDARY: "6",
    MYTHIC: "d",
    DIVINE: "b",
    SPECIAL: "c",
    VERY_SPECIAL: "c",
}

//character used in minecraft to indicate color
export const colorChar = "§";

//map from color code to hex code
export const colorCodeToHex: {
    [key in colorCode]: string
} = {
    "0": "#000000",
    "1": "#0000AA",
    "2": "#00AA00",
    "3": "#00AAAA",
    "4": "#AA0000",
    "5": "#AA00AA",
    "6": "#FFAA00",
    "7": "#AAAAAA",
    "8": "#555555",
    "9": "#5555FF",
    "a": "#55FF55",
    "b": "#55FFFF",
    "c": "#FF5555",
    "d": "#FF55FF",
    "e": "#FFFF55",
    "f": "#FFFFFF",
}


//base profile (because not all profile types have the same data)
export interface baseProfile { //base profile. all profile types can be derived from this (dont use)
    profile_id: string,
    members: {
        [key: string]: profileMember
    },
    community_upgrades: object
    last_save: number,
    cute_name: string,
    selected: boolean,
}

//normal profile
export interface profile extends baseProfile { //normal profile
    banking: object
}

//specifically a bingo profile
export interface bingoProfile extends baseProfile { //bingo profile
    game_mode: "bingo"
}

//harp songs
export type harpSong = "hymn_joy" | "frere_jacques" | "amazing_grace" | "brahms" | "happy_birthday" | "greensleeves" | "jeopardy" | "minuet" | "joy_world" | "pure_imagination" | "vie_en_rose" | "fire_and_flames" | "pachelbel";

//slayer boss info
export interface slayerBoss {
    claimed_levels: {
        level_1?: boolean,
        level_2?: boolean,
        level_3?: boolean,
        level_4?: boolean,
        level_5?: boolean,
        level_6?: boolean,
        level_7?: boolean,
        level_8?: boolean,
        level_9?: boolean,
    }
    xp?: number,
    boss_kills_tier_0?: number,
    boss_kills_tier_1?: number,
    boss_kills_tier_2?: number,
    boss_kills_tier_3?: number,
}

export interface slayerBossT5 extends slayerBoss {
    claimed_levels: {
        level_1?: boolean,
        level_2?: boolean,
        level_3?: boolean,
        level_4?: boolean,
        level_5?: boolean,
        level_6?: boolean,
        level_7?: boolean,
        level_8?: boolean,
        level_9?: boolean,
        level_7_special?: boolean,
        level_8_special?: boolean,
        level_9_special?: boolean,
    }
    boss_kills_tier_4?: number,
}



//contents of something like (inv_contents, talisman_bag, api data that is an nbt thing)
export interface contents {
    type: 0,
    data: string
}

//an accessory power
export type accessoryPower =
    "lucky"| "pretty" | "protected" | "simple" | "warrior" | "commando" | "diciplined" | "inspired" | "ominous" | "prepared" | //default
    "scorching" | "healthy" | "slender" | "strong" | "bizzare" | "demonic" | "hurtful" | "pleasant" | "adept" | "bloody" | "forceful" | "mythical" | "shaded" | "sighted" | "silky" | "sweet";

//what is in a tuning slot
export interface tuningSlot {
    health: number,
    defense: number,
    walk_speed: number,
    strength: number,
    critical_damage: number,
    critical_chance: number,
    attack_speed: number,
    intelligence: number
}

//each effect
export type effectName = //missing ones that dont give you stats. ill add them later or something
    "speed" | "jump_boost" | "poison" | "water_breathing" | "fire_resistance" | "night_vision" | "strength" | "invisibility" | "regeneration" | "weakness" | "slowness" | "haste" | "rabbit" | "burning" | "knockback" | "venomous" | "stun" | "archery" | "adrenaline" | "critical" | "dodge" | "agility" | "wounded" | "experience" | "resistance" | "mana" | "blindness" | "true_defense" | "pet_luck" | "spelunker" |
    "spirit" | "magic_find" | "dungeon" | "king's_scent" | "wisp's_ice-flavored_water" | "coldfusion" | "mushed_glowy_tonic" | "jerry_candy" |
    "farming_xp_boost" | "mining_xp_boost" | "combat_xp_boost" | "foraging_xp_boost" | "fishing_xp_boost" | "enchanting_xp_boost" | "alchemy_xp_boost";


//what stats each effect gives
//...{} for minimizing different potion categories (brewable, non brewable, exp boosts)
export const effectStats: { 
    [key in effectName]: (level: number) => statsList;
} = {
    ...{ //brewable
        "speed": level => ({
            walk_speed: 5*level
        }),
        "jump_boost": level => ({}),
        "poison": level => ({}),
        "water_breathing": level => ({}),
        "fire_resistance": level => ({}),
        "night_vision": level => ({}),
        "strength": level => ({
            strength: [5, 12.5, 20, 30, 40, 50, 60, 75][level-1]
        }),
        "invisibility": level => ({}),
        "regeneration": level => ({
            health_regen: [5, 10, 15, 20, 25, 30, 40, 50, 60][level-1]
        }),
        "weakness": level => ({}),
        "slowness": level => ({
            walk_speed: -5*level
        }),
        "haste": level => ({
            mining_speed: 50*level //wiki was wrong :/
        }),
        "rabbit": level => ({
            walk_speed: 10*level
        }),
        "burning": level => ({}),
        "knockback": level => ({}),
        "venomous": level => ({
            walk_speed: -5*level
        }),
        "stun": level => ({}),
        "archery": level => ({}),
        "adrenaline": level => ({
            //health: [20, 40, 60, 80, 100, 150, 200, 300][level-1],
            walk_speed: 5*level
        }),
        "critical": level => ({
            critical_chance: 5*level+5,
            critical_damage: 10*level
        }),
        "dodge": level => ({}),
        "agility": level => ({
            walk_speed: 10*level
        }),
        "wounded": level => ({}),
        "experience": level => ({}),
        "resistance": level => ({
            defense: [5, 10, 15, 20, 30, 40, 50, 60][level-1]
        }),
        "mana": level => ({}),
        "blindness": level => ({}),
        "true_defense": level => ({
            true_defense: 5*level
        }),
        "pet_luck": level => ({
            pet_luck: 5*level
        }),
        "spelunker": level => ({
            mining_fortune: 5*level
        })
    },
    ...{ //non-brewable
        "spirit": level => ({
            walk_speed: 10*level,
            critical_damage: 10*level
        }),
        "magic_find": level => ({
            magic_find: [10, 25, 50, 75][level-1]
        }),
        "dungeon": level => ({}),
        "king's_scent": level => ({}),
        "wisp's_ice-flavored_water": level => ({
            vitality: 10, // to quote the wiki: "Gain +10% incoming healing" so i think this is correct
            true_defense: 25,
        }),
        "coldfusion": level => ({ // !!! only works with wisp equipped !!! i will add a thing for that
            strength: 75,
            critical_damage: 55,
        }),
        "mushed_glowy_tonic": level => ({
            fishing_speed: 30
        }),
        "jerry_candy": level => ({ //yes, its technically an effect
            health: 100,
            strength: 20,
            ferocity: 2,
            intelligence: 100,
            magic_find: 3
        })
    },
    ...{ //exp boosts
        "farming_xp_boost": level => ({
            farming_wisdom: [5, 10, 20][level-1],
        }),
        "mining_xp_boost": level => ({
            mining_wisdom: [5, 10, 20][level-1],
        }),
        "combat_xp_boost": level => ({
            combat_wisdom: [5, 10, 20][level-1],
        }),
        "foraging_xp_boost": level => ({
            foraging_wisdom: [5, 10, 20][level-1],
        }),
        "fishing_xp_boost": level => ({
            fishing_wisdom: [5, 10, 20][level-1],
        }),
        "enchanting_xp_boost": level => ({
            enchanting_wisdom: [5, 10, 20][level-1],
        }),
        "alchemy_xp_boost": level => ({
            alchemy_wisdom: [5, 10, 20][level-1],
        }),
    }
}

//effect modifier
export type effectModifier = "cola" | "juice" | "res" | "tutti_frutti" | "slayer_energy" | "tear_filled" | "dr_paper" | "caffeinated";

//modifer for an active effect
export interface active_effect_modifier {
    key: effectModifier,
    amp: number,
}

//info about an active effect
export interface active_effect {
    effect: effectName,
    level: number,
    modifiers: active_effect_modifier[],
    ticks_remaining: number,
    infinite: boolean,
}

//info about a cake buff
export interface cake_buff {
    stat: number,
    key: string,
    amount: number,
    expire_at: number
}

//a pet
export interface pet {
    uuid: string,
    type: petName,
    exp: number,
    active: boolean,
    tier: petTier,
    heldItem: petItem | null,
    candyUsed: number,
    skin: string | null,
    extra?: {
        blaze_kills?: number
    }
}

//contains all the data of a profile member from the api
export interface profileMember { //all objects can be expanded upon; all any[] | any need more info
    //misc important
    last_save: number,
    stats: object,

    //misc stats
    first_join: number,
    first_join_hub?: number
    last_death: number,
    death_count?: number,
    reaper_peppers_eaten?: number,
    favorite_arrow?: string, //needs expansion
    
    //fairy souls
    fishing_treasure_caught?: number,
    fairy_souls_collected: number,
    fairy_exchanges?: number,
    fairy_souls?: number,
    
    //money
    personal_bank_upgrade?: number,
    coin_purse?: number,

    //main progression
    objectives: object,
    achievement_spawnned_island_types?: string[],
    quests: object,
    tutorial: string[],
    crafted_generators?: string[],
    visited_zones?: string[],
    unlocked_coll_tiers?: string[],
    nether_island_player_data: object,
    visited_modes: string[],
    collection: object,
    
    //side quests
    harp_quest: {
        selected_song?: harpSong,
        selected_song_epoch?: number,
        claimed_talisman?: boolean,
        song_hymn_joy_best_completion?: number,
        song_hymn_joy_completions?: number,
        song_hymn_joy_perfect_completions?: number,
        song_frere_jacques_best_completion?: number,
        song_frere_jacques_completions?: number,
        song_frere_jacques_perfect_completions?: number,
        song_amazing_grace_best_completion?: number,
        song_amazing_grace_completions?: number,
        song_amazing_grace_perfect_completions?: number,
        song_brahms_best_completion?: number,
        song_brahms_completions?: number,
        song_brahms_perfect_completions?: number,
        song_happy_birthday_best_completion?: number,
        song_happy_birthday_completions?: number,
        song_happy_birthday_perfect_completions?: number,
        song_greensleeves_best_completion?: number,
        song_greensleeves_completions?: number,
        song_greensleeves_perfect_completions?: number,
        song_jeopardy_best_completion?: number,
        song_jeopardy_completions?: number,
        song_jeopardy_perfect_completions?: number,
        song_minuet_best_completion?: number,
        song_minuet_completions?: number,
        song_minuet_perfect_completions?: number,
        song_joy_world_best_completion?: number,
        song_joy_world_completions?: number,
        song_joy_world_perfect_completions?: number,
        song_pure_imagination_best_completion?: number,
        song_pure_imagination_completions?: number,
        song_pure_imagination_perfect_completions?: number,
        song_vie_en_rose_best_completion?: number,
        song_vie_en_rose_completions?: number,
        song_vie_en_rose_perfect_completions?: number,
        song_fire_and_flames_best_completion?: number,
        song_fire_and_flames_completions?: number,
        song_fire_and_flames_perfect_completions?: number,
        song_pachelbel_best_completion?: number,
        song_pachelbel_completions?: number,
        song_pachelbel_perfect_completions?: number,
    },
    trophy_fish: object,
    trapper_quest?: object,

    //pets
    pets: pet[],
    autopet: object,

    //slayer
    slayer_quest?: object,
    slayer_bosses: {
        zombie: slayerBossT5,
        spider: slayerBoss,
        wolf: slayerBoss,
        enderman: slayerBoss,
        blaze: slayerBoss,
    },

    //mining
    forge: object,
    mining_core: {
        nodes: {
            mining_speed?: number,

            mining_fortune?: number,
            titanium_insanium?: number,
            forge_time?: number,
            mining_speed_boost?: number,
            pickobulus?: number,

            daily_powder?: number,
            luck_of_the_cave?: number,
            crystallized?: number,

            mining_experience?: number,
            seasoned_mineman?: number,
            orbiter?: number,
            mining_madness?: number,
            front_loaded?: number,
            sky_mall?: number,
            precision_mining?: number,

            special_0?: number, //peak of the mountain
            goblin_killer?: number,
            star_powder?: number,

            mole?: number,
            professional?: number,
            fortunate?: number,
            lonesome_miner?: number,
            great_explorer?: number,
            vein_seeker?: number,
            maniac_miner?: number,

            powder_buff?: number,
            mining_speed_2?: number,
            mining_fortune_2?: number,
        },
        recieved_free_tier: boolean,
        tokens: number,
        tokens_spent: 15,
        powder_mithril: number,
        powder_mithril_total: number,
        experience: number,
        powder_spent_mithril: number,
        retroactive_tier2_token: boolean,
        selected_pickaxe_ability: string, //needs expansion
        crystals: {

        },
        greater_mines_last_access: number,
        biomes: {

        },
        powder_gemstone: number,
        powder_gemstone_total: number,
        last_reset: number,
        daily_ores_mined_day_mithril_ore: number,
        daily_ores_mines_mithril_ore: number,
        daily_ores_mined_day_gemstone: number,
        daily_ores_mined_gemstone: number,
        powder_spent_gemstone: number,
    },

    //misc
    dungeons: object,
    perks: { //essence shops
        permanent_health: number,
        permanent_defense: number,
        permanent_speed: number,
        permanent_intelligence: number,
        permanent_strength: number,
        forbidden_blessing: number,
        catacombs_boss_luck: number,
        catacombs_looting: number,
        catacombs_crit_damage: number,
        catacombs_intelligence: number,
        catacombs_strength: number,
        catacombs_defense: number,
        catacombs_health: number,
        revive_stone: number
    }
    jacob2: object,
    experimentation?: object,
    bestiary: object,
    soulflow?: number,
    
    //effects / buffs
    active_effects: active_effect[],
    paused_effects?: any[],
    disabled_potion_effects?: effectName[],
    temp_stat_buffs?: cake_buff[],
    
    //essence
    essence_undead?: number,
    essence_crimson?: number,
    essence_diamond?: number,
    essence_dragon?: number,
    essence_gold?: number,
    essence_ice?: number,
    essence_wither?: number,
    essence_spider?: number,
    
    //skills
    experience_skill_farming?: number,
    experience_skill_mining?: number,
    experience_skill_combat?: number,
    experience_skill_foraging?: number,
    experience_skill_fishing?: number,
    experience_skill_enchanting?: number,
    experience_skill_alchemy?: number,
    experience_skill_taming?: number,
    experience_skill_carpentry?: number,
    experience_skill_runecrafting?: number,
    experience_skill_social2?: number,
    
    //wardrobe
    wardrobe_contents: object,
    wardrobe_equipped_slot: number,
    
    //misc storage
    accessory_bag_storage: {
        tuning: {
            slot_0?: tuningSlot,
            highest_unlocked_slot: number,
        },
        selected_power?: accessoryPower,
        unlocked_powers: accessoryPower[],
        bag_upgrades_purchased: number,
    },
    sacks_counts: object,
    backpack_icons?: object,
    
    //storage / inventory
    inv_armor: contents,
    equippment_contents: contents, //they misspelled it in the api lol
    inv_contents: contents,
    ender_chest_contents?: object,
    backpack_contents?: object,
    personal_vault_contents: object,
    talisman_bag?: contents,
    potion_bag?: object,
    fishing_bag?: object,
    quiver?: object,
    candy_inventory_contents?: object,
}


export type skillType = "runecrafting" | "dungeoneering" | "social" | "experience";
export type skillName = "farming" | "mining" | "combat" | "foraging" | "fishing" | "enchanting" | "alchemy" | "taming" | "dungeoneering" | "carpentry" | "runecrafting" | "social"

//how much exp for each level
export const skillLeveling: {
    [key in skillType]: number[]
} = {
    experience: [0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425, 40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425, 111672425],
    runecrafting: [0, 50, 150, 275, 435, 635, 885, 1200, 1600, 2100, 2725, 3510, 4510, 5760, 7325, 9325, 11825, 14950, 18950, 23950, 30200, 38050, 47850, 60100, 75400, 94450],
    social: [0, 50, 150, 300, 550, 1050, 1800, 2800, 4050, 5550, 7550, 10050, 13050, 16800, 21300, 27300, 35300, 45300, 57800, 72800, 92800, 117800, 147800, 182800, 222800, 272800],
    dungeoneering: [0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640, 360559640, 453559640, 569809640],
}

//exp required to level up each type of skill past 60
export const skillExtrapolation = {
    experience60: 7000000,
    experience50: 4000000,
    runecrafting: 94450,
    social: 272800,
    dungeoneering: 569809640
}

//map of skill name to api name
export const skillNameToApiName: {
    [key in skillName]: string
} = {
    farming: "experience_skill_farming",
    mining: "experience_skill_mining",
    combat: "experience_skill_combat",
    foraging: "experience_skill_foraging",
    fishing: "experience_skill_fishing",
    enchanting: "experience_skill_enchanting",
    alchemy: "experience_skill_alchemy",
    taming: "experience_skill_taming",
    carpentry: "experience_skill_carpentry",
    runecrafting: "experience_skill_runecrafting",
    social: "experience_skill_social2",
    dungeoneering: "experience_skill_mining" //dungeoneering doesnt have an "experience_skill_dungeoneering". the dungeoneering skill isnt gonna be used in the skill section anyways so it doesnt matter. (adding to to avoid a ts error)
}


//caps of each skill
export const skillCaps: {
    [key in skillName]: number
} = {
    farming: 60,
    mining: 60,
    combat: 60,
    foraging: 50,
    fishing: 50,
    enchanting: 60,
    alchemy: 50,
    taming: 50,
    dungeoneering: 50,
    carpentry: 50,
    runecrafting: 25,
    social: 25
}


export type statName =
    "health" |
    "defense" |
    "true_defense" |
    "strength" |
    "walk_speed" |
    "critical_chance" |
    "critical_damage" |
    "intelligence" |
    "mining_speed" |
    "sea_creature_chance" |
    "magic_find" |
    "pet_luck" |
    "attack_speed" |
    "ability_damage" |
    "ferocity" |
    "mining_fortune" |
    "farming_fortune" |
    "foraging_fortune" |
    "breaking_power" |
    "pristine" |
    "combat_wisdom" |
    "mining_wisdom" |
    "farming_wisdom" |
    "foraging_wisdom" |
    "fishing_wisdom" |
    "enchanting_wisdom" |
    "alchemy_wisdom" |
    "carpentry_wisdom" |
    "runecrafting_wisdom" |
    "social_wisdom" |
    "fishing_speed" |
    "health_regen" |
    "vitality" |
    "mending" |

//multiplicative
    "m_health" |
    "m_defense" |
    "m_true_defense" |
    "m_strength" |
    "m_walk_speed" |
    "m_critical_chance" |
    "m_critical_damage" |
    "m_intelligence" |
    "m_mining_speed" |
    "m_sea_creature_chance" |
    "m_magic_find" |
    "m_pet_luck" |
    "m_attack_speed" |
    "m_ability_damage" |
    "m_ferocity" |
    "m_mining_fortune" |
    "m_farming_fortune" |
    "m_foraging_fortune" |
    "m_breaking_power" |
    "m_pristine" |
    "m_combat_wisdom" |
    "m_mining_wisdom" |
    "m_farming_wisdom" |
    "m_foraging_wisdom" |
    "m_fishing_wisdom" |
    "m_enchanting_wisdom" |
    "m_alchemy_wisdom" |
    "m_carpentry_wisdom" |
    "m_runecrafting_wisdom" |
    "m_social_wisdom" |
    "m_fishing_speed" |
    "m_health_regen" |
    "m_vitality" |
    "m_mending" |

    //special
    "s_damage" |
    "s_golden_damage" | //gdrag

    "s_yeti_sword_intelligence" | //baby yeti
    "s_yeti_sword_damage" | //baby yeti
    
    "s_blaze_armor_stats" | //blaze pet

    "s_aotd_damage" | //dragon pet
    "s_aotd_strength" | //dragon pet

    "s_fs_ts_c_buff" | //lion pet

    "s_ember_armor_stats" | //magma cube

    "s_shark_armor_buff" | //megalodon pet

    "s_pigman_sword_damage" | //pigman pet
    "s_pigman_sword_strength" | //pigman pet

    "s_ink_wand_damage" | //squid pet
    "s_ink_wand_strength" | //squid pet

    "s_undead_armor_defense" | //zombie pet


    "s_pet_stat_buff" | //bingo pet

    "s_no_speed" | //snail pet

    //y per x
    //per stats get applied after multiplication
    "p_X_strength_per_5_magic_find" | //gdrag
    
    "p_1_walk_speed_per_X_defense" | //amadillo
    "p_1_mining_speed_per_X_defense" | //armadilo

    "p_X_defense_per_20_health" | //blue whale
    "p_X_defense_per_25_health" | //blue whale
    "p_X_defense_per_30_health" | //blue whale

    "p_X_defense_per_100_walk_speed" | //elephant

    "p_X_health_per_10_defense" | //elephant

    "p_X_farming_fortune_per_1_strength" | //mooshroom cow pet

    //as
    "a_strength_as_defense" | //baby yeti

    //location buffs
    "l_all_crimson_isle" | //blaze pet
    "l_mining_fortune_crimson_isle" | //kuudra pet
    "l_combat_mining_island" | //mithril golem
    "l_walk_speed_park" |

    //mob damage buffs
    "d_end_mobs" | //edrag pet
    "d_slimes" | // magma cube
    "d_lvl_100" | //pigman pet
    "d_wither_mobs" | //wither skeleton
    "d_zombies" | //zombie pet

    //caps (addition)
    "c_walk_speed" //black cat

export const defaultSkillCaps: {
    [key in statName]?: number
} = {
    walk_speed: 400,
    critical_chance: 100,
}

export type statsList = {
    [key in statName]?: number;
};

export type statIdMap<Type> = {
    [key in statName]?: Type
}

export const statIdToStatName: statIdMap<string> = {
    health: "Health",
    defense: "Defense",
    walk_speed: "Speed",
    strength: "Strength",
    intelligence: "Intelligence",
    critical_chance: "Crit Chance",
    critical_damage: "Crit Damage",
    attack_speed: "Attack Speed",
    ability_damage: "Ability Damage",
    magic_find: "Magic Find",
    pet_luck: "Pet Luck",
    true_defense: "True Defense",
    sea_creature_chance: "SCC",
    ferocity: "Ferocity",
    mining_speed: "Mining Speed",
    mining_fortune: "Mining Fortune",
    farming_fortune: "Farming Fortune",
    foraging_fortune: "Foraging Fortune",
    breaking_power: "Breaking Power",
    pristine: "Pristine",
    fishing_speed: "Fishing Speed",
    health_regen: "Health Regen",
    vitality: "Vitality",
    mending: "Mending",
    combat_wisdom: "Combat Wisdom",
    mining_wisdom: "Mining Wisdom",
    farming_wisdom: "Farming Wisdom",
    foraging_wisdom: "Foraging Wisdom",
    fishing_wisdom: "Fishing Wisdom",
    enchanting_wisdom: "Enchanting Wisdom",
    alchemy_wisdom: "Alchemy Wisdom",
    carpentry_wisdom: "Carpentry Wisdom",
    runecrafting_wisdom: "Runecrafting Wisdom",
    social_wisdom: "Social Wisdom",
}

export const baseStats: statsList = {
    health: 100,
    defense: 0,
    true_defense: 0,
    strength: 0,
    walk_speed: 100,
    critical_chance: 30,
    critical_damage: 50,
    intelligence: 0,
    mining_speed: 0,
    sea_creature_chance: 20,
    magic_find: 0,
    pet_luck: 0,
    attack_speed: 0,
    ability_damage: 0,
    ferocity: 0,
    mining_fortune: 0,
    farming_fortune: 0,
    foraging_fortune: 0,
    breaking_power: 0,
    pristine: 0,
    combat_wisdom: 0,
    mining_wisdom: 0,
    farming_wisdom: 0,
    foraging_wisdom: 0,
    fishing_wisdom: 0,
    enchanting_wisdom: 0,
    alchemy_wisdom: 0,
    carpentry_wisdom: 0,
    runecrafting_wisdom: 0,
    social_wisdom: 0,
    fishing_speed: 0,
    health_regen: 100,
    vitality: 100,
    mending: 100,
}


export const statColors: statIdMap<colorCode> = {
    health: "c",
    defense: "a",
    walk_speed: "f",
    strength: "c",
    intelligence: "b",
    critical_chance: "9",
    critical_damage: "9",
    ability_damage: "c",
    magic_find: "b",
    pet_luck: "d",
    true_defense: "f",
    ferocity: "c",
    mining_speed: "6",
    mining_fortune: "6",
    farming_fortune: "6",
    foraging_fortune: "6",
    pristine: "5",
    fishing_speed: "b",
    health_regen: "c",
    vitality: "4",
    sea_creature_chance: "3",
    attack_speed: "e",
    breaking_power: "2",
    mending: "a",
    combat_wisdom: "3",
    mining_wisdom: "3",
    farming_wisdom: "3",
    foraging_wisdom: "3",
    fishing_wisdom: "3",
    enchanting_wisdom: "3",
    alchemy_wisdom: "3",
    carpentry_wisdom: "3",
    runecrafting_wisdom: "3",
    social_wisdom: "3",
}

export const statChars: statIdMap<string> = {
    health: "❤",
    defense: "❈",
    walk_speed: "✦",
    strength: "❁",
    intelligence: "✎",
    critical_chance: "☣",
    critical_damage: "☠",
    ability_damage: "๑",
    magic_find: "✯",
    pet_luck: "♣",
    true_defense: "❂",
    ferocity: "⫽",
    mining_speed: "⸕",
    mining_fortune: "☘",
    farming_fortune: "☘",
    foraging_fortune: "☘",
    pristine: "✧",
    fishing_speed: "☂",
    health_regen: "❣",
    vitality: "♨",
    sea_creature_chance: "α",
    attack_speed: "⚔",
    breaking_power: "Ⓟ",
    mending: "☄",
    combat_wisdom: "☯",
    mining_wisdom: "☯",
    farming_wisdom: "☯",
    foraging_wisdom: "☯",
    fishing_wisdom: "☯",
    enchanting_wisdom: "☯",
    alchemy_wisdom: "☯",
    carpentry_wisdom: "☯",
    runecrafting_wisdom: "☯",
    social_wisdom: "☯",
}

export const reforgeStats: {
    [key: string]: (tier: number) => statsList
} = {
    ...{ //melee (sword and fishing rod)
        gentle: tier => ({
            strength: [3,5,7,10,15,20][tier],
            attack_speed: [8,10,15,20,25,30][tier],
        }),
        odd: tier => ({
            critical_chance: [12,15,15,20,25,30][tier],
            critical_damage: [10,15,15,22,30,40][tier],
            intelligence: [-5,-10,-18,-32,50,-75][tier],
        }),
        fast: tier => ({
            attack_speed: [10,20,30,40,50,60][tier],
        }),
        fair: tier => ({
            strength: [2,3,4,7,10,12][tier],
            critical_chance: [2,3,4,7,10,12][tier],
            critical_damage: [2,3,4,7,10,12][tier],
            intelligence: [2,3,4,7,10,12][tier],
            attack_speed: [2,3,4,7,10,12][tier],
        }),
        epic: tier => ({
            strength: [15,20,25,32,40,50][tier],
            critical_damage: [10,15,20,27,35,45][tier],
            attack_speed: [1,2,4,7,10,15][tier],
        }),
        sharp: tier => ({
            critical_chance: [10,12,14,17,20,25][tier],
            critical_damage: [20,30,40,55,75,90][tier],
        }),
        heroic: tier => ({
            strength: [15,20,25,32,40,50][tier],
            intelligence: [40,50,65,80,100,125][tier],
            attack_speed: [1,2,2,3,5,7][tier],
        }),
        spicy: tier => ({
            strength: [2,3,4,7,10,12][tier],
            critical_chance: 1,
            critical_damage: [25,35,45,60,80,100][tier],
            attack_speed: [1,2,4,7,10,15][tier],
        }),
        legendary: tier => ({
            strength: [3,7,12,18,25,32][tier],
            critical_chance: [5,7,9,12,15,28][tier],
            critical_damage: [5,10,15,22,28,36][tier],
            intelligence: [5,8,12,18,25,35][tier],
            attack_speed: [2,3,5,7,10,15][tier],
        }),


    },
    ...{ //sword
        dirty: tier => ({
            strength: [2,4,6,10,12,15][tier],
            attack_speed: [2,3,5,10,15,20][tier],
            ferocity: [2,3,6,9,12,15][tier],
        }),
        fabled: tier => ({
            strength: [30,35,40,50,60,75][tier],
            critical_damage: [15,20,25,32,40,50][tier],
        }),
        suspicious: tier => ({ // +15 weapon damage
            critical_chance: [1,2,3,5,7,10][tier],
            critical_damage: [30,40,50,65,85,110][tier],
        }),
        gilded: tier => ({
            strength: [0,0,0,0,75,90][tier],
        }),
        warped: tier => ({
            strength: tier >= 2 ? 165 : 0,
            intelligence: tier == 4 ? 65 : 0,
        }),
        withered: tier => ({
            strength: [60,75,90,110,135,170][tier] // +1 str per cata level
        }),
        bulky: tier => ({
            health: [4,6,9,12,15,20][tier],
            defense: [2,3,5,8,13,21][tier],
        }),
    },
    ...{ //fishing rod
        salty: tier => ({
            sea_creature_chance: [1,2,2,3,5,7][tier],
        }),
        treacherous: tier => ({
            sea_creature_chance: [1,2,2,3,5,7][tier],
            strength: 5*(tier+1),
        }),
        stiff: tier => ({
            sea_creature_chance: [1,2,2,3,5,7][tier],
            strength: 2*(tier+1),
        }),
        lucky: tier => ({
            sea_creature_chance: [1,2,2,3,5,7][tier],
            magic_find: tier+1,
        }),
        pichin: tier => ({ //could be pitchin' idk
            sea_creature_chance: [1,2,2,3,5,7][tier],
            fishing_speed: [1,2,4,6,8,10][tier],
        }),
    },
    ...{ //ranged weapon
        deadly: tier => ({
            critical_chance: [10,13,16,19,22,25][tier],
            critical_damage: [5,10,18,32,50,78][tier],
        }),
        fine: tier => ({
            strength: [3,7,12,18,25,33][tier],
            critical_chance: [5,7,9,12,15,18][tier],
            critical_damage: [2,4,7,10,15,20][tier],
        }),
        grand: tier => ({
            strength: [25,32,40,50,60,75][tier],
        }),
        hasty: tier => ({
            strength: [3,5,7,10,15,20][tier],
            critical_chance: [20,25,30,40,50,75][tier],
        }),
        neat: tier => ({
            critical_chance: [10,12,14,17,20,15][tier],
            critical_damage: [4,8,14,20,30,40][tier],
            intelligence: [3,6,10,15,20,25][tier],
        }),
        rapid: tier => ({
            strength: [2,3,4,7,10,15][tier],
            critical_damage: [35,45,55,65,75,90][tier],
        }),
        unreal: tier => ({
            strength: [3,7,12,18,25,34][tier],
            critical_chance: [8,9,10,11,13,15][tier],
            critical_damage: [5,10,18,30,50,70][tier],
        }),
        awkward: tier => ({
            critical_chance: [10,12,15,20,25,30][tier],
            critical_damage: [5,10,15,22,30,35][tier],
            intelligence: [-5,-10,-18,-32,-50,-72][tier],
        }),
        rich: tier => ({
            strength: [2,3,4,7,10,15][tier],
            critical_chance: [10,12,14,17,20,25][tier],
            critical_damage: [1,2,4,7,10,15][tier],
            intelligence: [20,25,30,40,50,60][tier],
        }),

        precise: tier => ({
            strength: [3,7,12,18,25,34][tier],
            critical_chance: [8,9,10,11,13,15][tier],
            critical_damage: [5,10,18,32,50,70][tier],
        }),
        spritual: tier => ({
            strength: [4,8,14,20,28,38][tier],
            critical_chance: [7,8,9,10,12,14][tier],
            critical_damage: [10,15,23,37,55,75][tier],
        }),
        headstrong: tier => ({
            strength: [2,5,10,16,23,33][tier],
            critical_chance: [10,11,12,13,15,17][tier],
            critical_damage: [4,8,16,18,42,60][tier],
        }),
    },
    ...{ //armor
        clean: tier => ({
            health: [5,7,10,15,20,25][tier],
            defense: [5,7,10,15,20,25][tier],
            critical_chance: 2*(tier+1),
        }),
        fierce: tier => ({
            strength: 2*(tier+1),
            critical_chance: [2,3,4,5,6,8][tier],
            critical_damage: [4,7,10,14,18,24][tier],
        }),
        heavy: tier => ({
            defense: [25,35,50,65,80,110][tier],
            walk_speed: -1,
            critical_damage: [-1,-2,-2,-3,-5,-7][tier],
        }),
        light: tier => ({
            health: [5,7,10,15,20,25][tier],
            defense: [1,2,3,4,5,6][tier],
            walk_speed: tier+1,
            critical_chance: Math.ceil(0.5*tier+0.5),
            critical_damage: (tier+1),
        }),
        mythic: tier => ({
            health: 2*(tier+1),
            defense: 2*(tier+1),
            strength: 2*(tier+1),
            walk_speed: 2,
            critical_chance: tier+1,
            intelligence: [20,25,30,40,50,60][tier],
        }),
        pure: tier => ({
            health: [2,3,4,6,8,10][tier],
            defense: [2,3,4,6,8,10][tier],
            strength: [2,3,4,6,8,10][tier],
            walk_speed: 1,
            critical_chance: 2*tier+1,
            critical_damage: [2,3,4,6,8,8][tier],
            attack_speed: tier || 1, //  s h o r t   h a n d   :)
            intelligence: [2,3,4,6,8,10][tier],
        }),
        smart: tier => ({
            health: [4,6,9,12,15,20][tier],
            defense: [4,6,9,12,15,20][tier],
            intelligence: 20*(tier+1),
        }),
        titanic: tier => ({
            health: [10,15,20,25,35,50][tier],
            defense: [10,15,20,25,35,50][tier],
        }),
        wise: tier => ({
            health: [6,8,10,12,15,20][tier],
            walk_speed: [1,1,1,2,2,3][tier],
            intelligence: [25,50,75,100,125,150][tier],
        }),

        perfect: tier => ({ //+2% def
            defense: [25,35,50,65,80,110][tier],
        }),
        necrotic: tier => ({
            intelligence: [30,60,90,120,150,200][tier],
        }),
        ancient: tier => ({ //+1 cd per cata level
            health: 7,
            defense: 7,
            strength: [4,8,12,18,25,35][tier],
            critical_chance: [3,5,7,9,12,15][tier],
            intelligence: [6,9,12,16,20,25][tier],
        }),
        spiked: tier => ({
            health: [2,3,4,6,8,10][tier],
            defense: [2,3,4,6,8,10][tier],
            strength: [3,4,6,8,10,12][tier],
            walk_speed: 1,
            critical_chance: 2*(tier+1),
            critical_damage: [3,4,6,8,10,12][tier],
            attack_speed: [1,1,2,3,4,5][tier],
            intelligence: [3,4,6,8,10,12][tier],
        }),
        renowned: tier => ({ //all stats increased by +1%
            health: tier+2,
            defense: tier+2,
            strength: [3,4,6,8,10,12][tier],
            walk_speed: 1,
            critical_chance: 2*(tier+1),
            critical_damage: [3,4,6,8,10,12][tier],
            attack_speed: [1,1,2,3,4,5][tier],
            intelligence: [3,4,6,8,10,12][tier],
        }),
        cubic: tier => ({ // -2% damage from nether mobs
            strength: [3,5,7,10,12,15][tier],
            health: [5,7,10,15,20,25][tier],
        }),
        hyper: tier => ({
            strength: [2,4,6,7,10,12][tier],
            attack_speed: tier+2,
            walk_speed: Math.ceil(0.5*tier+0.5),
        }),
        reinforced: tier => ({
            defense: [25,35,50,65,80,110][tier],
        }),
        loving: tier => ({
            health: [4,5,6,8,10,14][tier],
            defense: [4,5,6,7,10,14][tier],
            intelligence: 20*(tier+1),
            ability_damage: 5,
        }),
        ridiculous: tier => ({
            health: [10,15,20,25,35,50][tier],
            defense: [10,15,20,25,35,50][tier],
            critical_chance: tier+1,
        }),
        empowered: tier => ({
            health: [10,15,20,25,35,50][tier], //why are there so many of these
            defense: [10,15,20,25,35,50][tier],
        }),
        giant: tier => ({
            health: [50,60,80,120,180,240][tier],
        }),
        submerged: tier => ({
            critical_chance: 2*(tier+1),
            sea_creature_chance: 0.5+tier,
        }),
        jaded: tier => ({
            mining_speed: [5,12,20,30,45,60][tier],
            mining_fortune: 5*(tier+1),
        })
    },
    ...{ //tool (im really tired of doing these so ill do this one later)

    },
    ...{ //equipment (im so glad theres only 4 of these AAAAAAAAA)
        waxed: tier => ({
            health: [5,6,8,10,12,15][tier],
            critical_chance: tier+2,
        }),
        fortified: tier => ({
            defense: [12,14,17,20,25,30][tier],
        }),
        strengthened: tier => ({
            defense: [3,4,5,6,8,10][tier],
            strength: tier+2,
        }),
        glistening: tier => ({
            intelligence: tier+2,
            mining_fortune: [5,6,8,10,12,15][tier],
        }),
    }
}

export const enchantStats: {
    [key: string]: (level: number) => statsList
} = { //doing this without a 2nd monitor and youtube is impossible AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    ...{ //armor
        big_brain: level => ({
            intelligence: 5*level,
        }),
        growth: level => ({
            health: 15*level,
        }),
        protection: level => ({
            defense: [4,8,12,16,20,25,30][level-1],
        }),
        rejuvenate: level => ({
            health_regen: 2*level,
        }),
        true_protection: level => ({
            true_defense: 5,
        }),
        smarty_pants: level => ({
            intelligence: 5*level,
        }),
        sugar_rush: level => ({
            walk_speed: 2*level,
        }),
    },
}

export const gemstoneStats: {
    [key in gemstone]: {
        [key in gemstoneTier]: (tier: number) => statsList
    }
} = {
    ruby: { //ruby my beloved
        rough: tier => ({
            health: [1,2,3,4,5,7,7][tier]
        }),
        flawed: tier => ({
            health: [3,4,5,6,8,10,10][tier]
        }),
        fine: tier => ({
            health: [4,5,6,8,10,14,14][tier]
        }),
        flawless: tier => ({
            health: [5,7,10,14,18,22,22][tier]
        }),
        perfect: tier => ({
            health: [6,9,13,18,24,30,30][tier]
        }),
    },
    amethyst: {
        rough: tier => ({
            defense: tier+1
        }),
        flawed: tier => ({
            defense: [3,4,5,6,8,10,10][tier]
        }),
        fine: tier => ({
            defense: [4,5,6,8,10,14,14][tier]
        }),
        flawless: tier => ({
            defense: [5,7,10,14,18,22,22][tier]
        }),
        perfect: tier => ({
            defense: [6,9,13,18,24,30,30][tier]
        }),
    },
    jade: {
        rough: tier => ({
            mining_fortune: 2*(tier+1)
        }),
        flawed: tier => ({
            mining_fortune: [3,5,7,10,14,18,22][tier]
        }),
        fine: tier => ({
            mining_fortune: [5,7,10,15,20,25,30][tier]
        }),
        flawless: tier => ({
            mining_fortune: [7,10,15,20,27,35,44][tier]
        }),
        perfect: tier => ({
            mining_fortune: [10,14,20,30,40,50,30][tier]
        }),
    },
    sapphire: {
        rough: tier => ({
            intelligence: [2,3,4,5,6,7,7][tier]
        }),
        flawed: tier => ({
            intelligence: [5,5,6,7,8,10,10][tier]
        }),
        fine: tier => ({
            intelligence: [7,8,9,10,11,12,12][tier]
        }),
        flawless: tier => ({
            intelligence: [10,11,12,14,17,20,20][tier]
        }),
        perfect: tier => ({
            intelligence: [12,14,17,20,24,30,30][tier]
        }),
    },
    amber: {
        rough: tier => ({
            mining_speed: 4*(tier+1)
        }),
        flawed: tier => ({
            mining_speed: [6,10,14,18,24,30,36][tier]
        }),
        fine: tier => ({
            mining_speed: [10,14,20,28,36,45,54][tier]
        }),
        flawless: tier => ({
            mining_speed: [14,20,30,44,58,75,92][tier]
        }),
        perfect: tier => ({
            mining_speed: [20,28,40,60,80,100,120][tier]
        }),
    },
    topaz: {
        rough: tier => ({
            pristine: (tier <= 5) ? 0.4 : 0.5
        }),
        flawed: tier => ({
            pristine: (tier <= 5) ? 0.8 : 0.9
        }),
        fine: tier => ({
            pristine: (tier <= 5) ? 1.2 : 1.3
        }),
        flawless: tier => ({
            pristine: (tier <= 5) ? 1.6 : 1.8
        }),
        perfect: tier => ({
            pristine: (tier <= 5) ? 2.0 : 2.2
        }),
    },
    jasper: {
        rough: tier => ({
            strength: [1,1,1,2,3,4,4][tier]
        }),
        flawed: tier => ({
            strength: [2,2,3,4,4,5,5][tier]
        }),
        fine: tier => ({
            strength: [3,3,4,5,6,7,7][tier]
        }),
        flawless: tier => ({
            strength: [5,6,7,8,10,12,12][tier]
        }),
        perfect: tier => ({
            strength: [6,7,8,11,13,16,16][tier]
        }),
    },
    opal: { // divine rarity opal doesnt exist (at least on wiki) so i just assumed
        rough: tier => ({
            true_defense: [1,1,1,2,3,4,4][tier],
        }),
        flawed: tier => ({
            true_defense: [2,2,2,3,3,4,4][tier]
        }),
        fine: tier => ({
            true_defense: [3,3,3,4,4,5,5][tier]
        }),
        flawless: tier => ({
            true_defense: [4,4,5,6,8,9,9][tier]
        }),
        perfect: tier => ({
            true_defense: [5,6,7,9,11,13][tier]
        }),
    },
}

export const specialGemstoneSlots = ["COMBAT", "OFFENSIVE", "DEFENSIVE", "MINING", "UNIVERSAL"];

export interface gemstoneSlotContents {
    tier?: gemstoneTier,
    gemstone?: gemstone,
}

export interface gemstoneSlots {
    [key: string]: gemstoneSlotContents
}

export type gemstone = "ruby" | "amethyst" | "jade" | "sapphire" | "amber" | "topaz" | "jasper" | "opal";
export type gemstoneTier = "rough" | "flawed" | "fine" | "flawless" | "perfect";

export const gemstoneColors: {
    [key in gemstone]: colorCode
} = {
    ruby: "c",
    amethyst: "5",
    jade: "a",
    sapphire: "b",
    amber: "7",
    topaz: "e",
    jasper: "d",
    opal: "f",
}

export const gemstoneRarities: {
    [key in gemstoneTier]: itemTier
} = {
    rough: "COMMON",
    flawed: "UNCOMMON",
    fine: "RARE",
    flawless: "EPIC",
    perfect: "LEGENDARY"
}


export const attributeStats: {
    [key: string]: (level: number) => statsList
} = {
    attack_speed: level => ({
        attack_speed: level
    }),
    speed: level => ({
        walk_speed: 5*level
    }),
    life_regeneration: level => ({
        health_regen: 1.25*level
    }),
    mana_pool: level => ({
        intelligence: 20*level
    }),
    fishing_experience: level => ({
        fishing_wisdom: 0.5*level
    }),
    fishing_speed: level => ({
        fishing_speed: 3*level
    }),
    hunter: level => ({
        sea_creature_chance: 0.1*level
    }),
}


export const skillLevelStats: {
    [key in skillName]: (level: number) => statsList
} = {
    farming: level => ({
        health: 2*level+Math.max(level-14,0)+Math.max(level-19,0)+Math.max(level-25,0),
        farming_fortune: 4*level
    }),
    mining: level => ({
        defense: Math.max(level-14,0)+level,
        mining_fortune: 4*level,
    }),
    combat: level => ({
        critical_chance: 0.5*level,
    }),
    foraging: level => ({
        strength: 1*level+Math.max(level-14,0),
        foraging_fortune: 4*level,
    }),
    fishing: level => ({
        health: 2*level+Math.max(level-14,0)+Math.max(level-19,0)+Math.max(level-25,0),
    }),
    enchanting: level => ({
        intelligence: 1*level+Math.max(level-14,0),
        ability_damage: 0.5*level,
    }),
    alchemy: level => ({
        intelligence: 1*level+Math.max(level-14,0),
    }),
    taming: level => ({
        pet_luck: 1*level
    }),
    carpentry: level => ({
        health: 1*Math.min(level,49) //lvl 50 doesnt give health
    }),

    dungeoneering: level => ({
        health: 1*level
    }),
    
    social: level => ({}),
    runecrafting: level => ({}),
}

export const skillColors: {
    [key in Exclude<skillName, "dungeoneering">]: colorCode
} = { //from NEU pv
    farming: "e",
    mining: "7",
    combat: "c",
    foraging: "2",
    fishing: "b",
    enchanting: "a",
    alchemy: "9",
    taming: "d",
    carpentry: "4",
    runecrafting: "5",
    social: "2",
}


export const harpStats: {
    [key in harpSong]: number
} = {
    hymn_joy: 1,
    frere_jacques: 1,
    amazing_grace: 1,
    brahms: 2,
    happy_birthday: 2,
    greensleeves: 2,
    jeopardy: 3,
    minuet: 3,
    joy_world: 3,
    pure_imagination: 4,
    vie_en_rose: 4,
    fire_and_flames: 1,
    pachelbel: 1,
}

export const harpNames: {
    [key in harpSong]: string
} = {
    hymn_joy: "Hymn to the Joy",
    frere_jacques: "Frère Jacques",
    amazing_grace: "Amazing Grace",
    brahms: "Brahm's Lullaby",
    happy_birthday: "Happy Birthday to You",
    greensleeves: "Greensleeves",
    jeopardy: "Geothermy?",
    minuet: "Minuet",
    joy_world: "Joy to the World",
    pure_imagination: "Godly Imagination",
    vie_en_rose: "La Vie en Rose",
    fire_and_flames: "Through the Campfire",
    pachelbel: "Pachelbel",
}


export const harpColors: {
    [key in harpSong]: colorCode
} = {
    hymn_joy: "a",
    frere_jacques: "a",
    amazing_grace: "a",
    brahms: "c",
    happy_birthday: "c",
    greensleeves: "c",
    jeopardy: "5",
    minuet: "5",
    joy_world: "5",
    pure_imagination: "d",
    vie_en_rose: "d",
    fire_and_flames: "b",
    pachelbel: "b",
}


//each slayer name
export type slayerName = "zombie" | "spider" | "wolf" | "enderman" | "blaze";

//stats for each slayer level
export const slayerStats: {
    [key in slayerName]: statsList[]
} = {
    zombie: [
        {health: 2},
        {health: 2},
        {health: 3},
        {health: 3},
        {health: 4},
        {health: 4},
        {health: 5},
        {health: 5, health_regen: 50},
        {health: 6},
    ],
    spider: [
        {critical_damage: 1},
        {critical_damage: 1},
        {critical_damage: 1},
        {critical_damage: 1},
        {critical_damage: 2},
        {critical_damage: 2},
        {critical_damage: 1},
        {critical_damage: 3, alchemy_wisdom: 10},
        {critical_damage: 3},
    ],
    wolf: [
        {walk_speed: 1},
        {health: 2},
        {walk_speed: 1},
        {health: 2},
        {critical_damage: 1},
        {health: 3},
        {critical_damage: 2},
        {walk_speed: 1},
        {health: 5},
    ],
    enderman: [
        {health: 1},
        {intelligence: 2},
        {health: 2},
        {intelligence: 2},
        {health: 3},
        {intelligence: 5},
        {health: 4},
        {intelligence: 4}, //real intelligence doesnt match wiki. and because im not eman 7, i dont know this one.
        {health: 5},
    ],
    blaze: [
        {health: 3},
        {strength: 1},
        {health: 4},
        {true_defense: 1},
        {health: 5},
        {strength: 2},
        {health: 6},
        {true_defense: 2},
        {health: 7},
    ],
}

//colors for slayers
export const slayerColors: {[key in slayerName]: colorCode} = {
    zombie: "2",
    spider: "4",
    wolf: "7",
    enderman: "5",
    blaze: "6",
}


//map of enrichment -> stat given
export const enrichmentStats = {
    walk_speed: 1,
    intelligence: 2,
    critical_damage: 1,
    critical_chance: 1,
    strength: 1,
    defense: 1,
    health: 3,
    magic_find: 0.5,
    ferocity: 0.3,
    sea_creature_chance: 0.3,
    attack_speed: 0.5,
}

//map of rarity -> mp
export const mpTable: {
    [key in itemTier]: number
} = {
    COMMON: 3,
    UNCOMMON: 5,
    RARE: 8,
    EPIC: 12,
    LEGENDARY: 16,
    MYTHIC: 22,
    DIVINE: 0,
    SPECIAL: 3,
    VERY_SPECIAL: 5
}


export const accPowers: {
    [key in accessoryPower]: {
        per: statsList,
        extra?: statsList,
    }
} = {
    //default powers
    lucky: {
        per: {
            health: 3.35,
            defense: 1.2,
            strength: 4.8,
            critical_chance: 4.35,
            critical_damage: 4.8,
        }
    },
    pretty: {
        per: {
            health: 1.65,
            defense: 1.2,
            walk_speed: 0.65,
            strength: 4.8,
            intelligence: 10.8,
            critical_chance: 0.475,
            critical_damage: 1.2,
        }
    },
    protected: {
        per: {
            health: 11.75,
            defense: 10.8,
            strength: 2.4,
            critical_chance: 0.475,
            critical_damage: 1.2,
        }
    },
    simple: {
        per: {
            health: 5.02,
            defense: 3.6,
            walk_speed: 1.2,
            strength: 3.6,
            intelligence: 5.4,
            critical_chance: 1.45,
            critical_damage: 3.6,
        }
    },
    warrior: {
        per: {
            health: 3.35,
            defense: 1.2,
            strength: 8.4,
            critical_chance: 2.4,
            critical_damage: 6,
        }
    },
    commando: {
        per: {
            health: 5.2,
            defense: 2.2,
            strength: 8.4,
            critical_chance: 0.475,
            critical_damage: 8.4,
        }
    },
    diciplined: {
        per: {
            health: 5.02,
            defense: 2.4,
            strength: 7.2,
            critical_chance: 1.45,
            critical_damage: 7.2,
        }
    },
    inspired: {
        per: {
            health: 1.65,
            defense: 1.2,
            strength: 4.8,
            intelligence: 16.2,
            critical_chance: 0.95,
            critical_damage: 3.6,
        }
    },
    ominous: {
        per: {
            health: 5.02,
            walk_speed: 0.95,
            strength: 3.6,
            intelligence: 6.1,
            critical_chance: 1.45,
            critical_damage: 3.6,
            attack_speed: 0.9,
        }
    },
    prepared: {
        per: {
            health: 12.4,
            defense: 11.3,
            strength: 1.95,
            critical_chance: 0.4,
            critical_damage: 0.95
        }
    },

    //power stones
    scorching: {
        per: {
            strength: 8.4,
            critical_damage: 9.6,
            attack_speed: 1.8,
        },
        extra: {
            ferocity: 7
        }
    },
    healthy: {
        per: {
            health: 33.6,
        },
        extra: {
            health: 200
        }
    },
    slender: {
        per: {
            health: 8.4,
            defense: 6,
            walk_speed: 0.6,
            strength: 6,
            intelligence: 7.2,
            critical_damage: 6,
            attack_speed: 1.1, 
        },
        extra: {
            defense: 100,
            strength: 50,
        }
    },
    strong: {
        per: {
            strength: 12,
            critical_damage: 12,
        },
        extra: {
            strength: 25,
            critical_damage: 25,
        }
    },
    bizzare: {
        per: {
            strength: -2.4,
            intelligence: 43.2,
            critical_damage: -2.4,
        },
        extra: {
            ability_damage: 5,
        }
    },
    demonic: {
        per: {
            strength: 5.5,
            intelligence: 27.725,
        },
        extra: {
            critical_damage: 50,
        }
    },
    hurtful: {
        per: {
            strength: 4.8,
            critical_damage: 19.2,
        },
        extra: {
            attack_speed: 15,
        }
    },
    pleasant: {
        per: {
            health: 13.45,
            defense: 14.4,
        },
    },
    adept: {
        per: {
            health: 16.8,
            defense: 9.6,
            intelligence: 3.6,
        },
        extra: {
            health: 100,
            defense: 50,
        }
    },
    bloody: {
        per: {
            strength: 10.8,
            intelligence: 3.6,
            critical_damage: 10.8,
        },
        extra: {
            attack_speed: 10,
        }
    },
    forceful: {
        per: {
            health: 1.7,
            strength: 18,
            critical_damage: 4.8,
        },
        extra: {
            ferocity: 4,
        }
    },
    mythical: {
        per: {
            health: 5.7,
            defense: 4.05,
            walk_speed: 0.95,
            strength: 4.05,
            intelligence: 6.1,
            critical_chance: 1.65,
            critical_damage: 4.05,
        },
        extra: {
            health: 150,
            strength: 40,
        }
    },
    shaded: {
        per: {
            walk_speed: 0.6,
            strength: 4.8,
            critical_damage: 18,
        },
        extra: {
            attack_speed: 3,
            ferocity: 3,
        }
    },
    sighted: {
        per: {
            intelligence: 36,
        },
        extra: {
            ability_damage: 3,
        }
    },
    silky: {
        per: {
            walk_speed: 0.6,
            critical_damage: 22.8,
        },
        extra: {
            attack_speed: 5,
        }
    },
    sweet: {
        per: {
            health: 15.1,
            defense: 10.8,
            walk_speed: 1.2,
        },
        extra: {
            walk_speed: 5,
        }
    },
}

export const tuningValues: statsList = {
    health: 5,
    defense: 1,
    walk_speed: 1.5,
    strength: 1,
    critical_damage: 1,
    critical_chance: 0.2,
    attack_speed: 0.2,
    intelligence: 2,
}


export const effectColors: {[key in effectName]: colorCode} = {
    ...{ //brewable
        "speed": "9",
        "jump_boost": "b",
        "poison": "2",
        "water_breathing": "9",
        "fire_resistance": "c",
        "night_vision": "5",
        "strength": "4",
        "invisibility": "8",
        "regeneration": "4",
        "weakness": "7",
        "slowness": "7",
        "haste": "e",
        "rabbit": "a",
        "burning": "6",
        "knockback": "4",
        "venomous": "5",
        "adrenaline": "c",
        "critical": "4",
        "dodge": "9",
        "agility": "5",
        "wounded": "4",
        "experience": "9",
        "resistance": "a",
        "mana": "9",
        "blindness": "f",
        "true_defense": "f",
        "pet_luck": "b",
        "spelunker": "b", // this one too? isnt mining fortune supposed to be orange?
        "stun": "8",
        "archery": "b"
    },
    ...{ //unbrewable
        "spirit": "b",
        "magic_find": "b",
        "dungeon": "7",
        "king's_scent": "2",
        "wisp's_ice-flavoted_water": "b",
        "coldfusion": "b",
        "mushed_glowy_tonic": "2",
        "wisp's_ice-flavored_water": "9",

        "jerry_candy": "a"
    },
    ...{ //exp boosts
        "farming_xp_boost": "a",
        "mining_xp_boost": "a",
        "combat_xp_boost": "a",
        "foraging_xp_boost": "a",
        "fishing_xp_boost": "a",
        "enchanting_xp_boost": "a",
        "alchemy_xp_boost": "a",
    },
}

export const cakeStats: statIdMap<number> = {
    walk_speed: 10,
    strength: 2,
    defense: 3,
    farming_fortune: 5,
    ferocity: 2,
    health: 10,
    pet_luck: 1,
    mining_fortune: 5,
    sea_creature_chance: 1,
    magic_find: 1,
    intelligence: 5,
    foraging_fortune: 5
}


//array of pet score you need to get more magic find
export const petScores = [
    10,
    25,
    50,
    75,
    100,
    130,
    175,
    225,
    275,
    325,
]

//possible tiers of pets
export type petTier = Exclude<itemTier, "DIVINE" | "SPECIAL" | "VERY_SPECIAL">;

//pets
export type petName = 
    "ROCK" |
    "BAT" |
    "MITHRIL_GOLEM" |
    "WITHER_SKELETON" |
    "SILVERFISH" |
    "ENDERMITE" |
    "BEE" |
    "CHICKEN" |
    "PIG" |
    "RABBIT" |
    "ELEPHANT" |
    "BLUE_WHALE" |
    "DOLPHIN" |
    "FLYING_FISH" |
    "BABY_YETI" |
    "MEGALODON" |
    "SQUID" |
    "JELLYFISH" |
    "SHEEP" |
    "PARROT" |
    "MONKEY" |
    "GIRAFFE" |
    "LION" |
    "OCELOT" |
    "BLACK_CAT" |
    "BLAZE" |
    "ENDER_DRAGON" |
    "ENDERMAN" |
    "GHOUL" |
    "GOLEM" |
    "GRIFFIN" |
    "HORSE" |
    "HOUND" |
    "JERRY" |
    "MAGMA_CUBE" |
    "PHOENIX" |
    "PIGMAN" |
    "SKELETON" |
    "SKELETON_HORSE" |
    "SNOWMAN" |
    "SPIDER" |
    "SPIRIT" |
    "TARANTULA" |
    "TURTLE" |
    "TIGER" |
    "ZOMBIE" |
    "WOLF" |
    "GUARDIAN" |
    "GRANDMA_WOLF" |
    "ARMADILLO" |
    "BAL" |
    "GOLDEN_DRAGON" |
    "RAT" |
    "SCATHA" |
    "AMMONITE" |
    "SNAIL" |
    "MOOSHROOM_COW" |
    "KUUDRA" |
    "DROPLET_WISP" |
    "BINGO";

//pet exp types
export type petExpType = "mining" | "farming" | "combat" | "fishing" | "foraging" | "enchanting" | "alchemy" | "all" | "gabagool";

//exp types of every pet
export const petTypes: {
    [key in petName]: petExpType
} = {
    ROCK: "mining",
    BAT: "mining",
    MITHRIL_GOLEM: "mining",
    WITHER_SKELETON: "mining",
    SILVERFISH: "mining",
    ENDERMITE: "mining",
    BEE: "farming",
    CHICKEN: "farming",
    PIG: "farming",
    RABBIT: "farming",
    ELEPHANT: "farming",
    BLUE_WHALE: "fishing",
    DOLPHIN: "fishing",
    FLYING_FISH: "fishing",
    BABY_YETI: "fishing",
    MEGALODON: "fishing",
    SQUID: "fishing",
    JELLYFISH: "alchemy",
    SHEEP: "alchemy",
    PARROT: "alchemy",
    MONKEY: "foraging",
    GIRAFFE: "foraging",
    LION: "foraging",
    OCELOT: "foraging",
    BLACK_CAT: "combat",
    BLAZE: "combat",
    ENDER_DRAGON: "combat",
    ENDERMAN: "combat",
    GHOUL: "combat",
    GOLEM: "combat",
    GRIFFIN: "combat",
    HORSE: "combat",
    HOUND: "combat",
    JERRY: "combat",
    MAGMA_CUBE: "combat",
    PHOENIX: "combat",
    PIGMAN: "combat",
    SKELETON: "combat",
    SKELETON_HORSE: "combat",
    SNOWMAN: "combat",
    SPIDER: "combat",
    SPIRIT: "combat",
    TARANTULA: "combat",
    TURTLE: "combat",
    TIGER: "combat",
    ZOMBIE: "combat",
    WOLF: "combat",
    GUARDIAN: "enchanting",
    GRANDMA_WOLF: "combat",
    ARMADILLO: "mining",
    BAL: "combat",
    GOLDEN_DRAGON: "combat",
    RAT: "combat",
    SCATHA: "mining",
    AMMONITE: "fishing",
    SNAIL: "mining",
    MOOSHROOM_COW: "farming",
    KUUDRA: "combat",
    DROPLET_WISP: "gabagool",
    BINGO: "all"
}

//special data for pet stats (gold collection for gdrag, stuff like that)
export interface specialPetData {
    goldCollection: number,
    bankCoins: number,
    skills: {
        [key in skillName]?: number
    },
    hotm: number
}

//info about stats of a pet
export type petStatInfo = {
    base: (level: number, tier: petTier) => statsList,
    perks: {
        [key: string]: {
            tier: petTier
            stats: (level: number, tier: petTier, specialData: specialPetData) => statsList
        }
    }
}

//perks and stats of every pet
export const petStats: {
    [key in petName]: petStatInfo
} = { //ordered from fandom wiki
    "BAT": {
        base: (level, tier) => ({
            intelligence: 1*level,
            walk_speed: 0.05*level,
            [tier == "MYTHIC" ? "sea_creature_chance" : ""]: tier == "MYTHIC" ? 0.05 : 0
        }),
        perks: {

        }
    },
    "ENDERMAN": {
        base: (level, tier) => ({
            critical_damage: 0.75*level,
        }),
        perks: {

        }
    },
    "ENDERMITE": {
        base: (level, tier) => ({
            intelligence: 1.5*level,
            pet_luck: 0.1*level,
        }),
        perks: {

        }
    },
    "FLYING_FISH": {
        base: (level, tier) => ({
            strength: 0.4*level,
            defense: 0.4*level,
        }),
        perks: {
            "Quick Reel": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    fishing_speed: 0.4*level
                })
            }
        }
    },
    "JERRY": {
        base: (level, tier) => ({
            intelligence: -1*level
        }),
        perks: {

        }
    },
    "GOLDEN_DRAGON": {
        base: (level, tier) => ({
            strength: (25 + 0.25*(level-100))*(level < 100 ? 0 : 1),
            magic_find: (15 + 0.05*(level-100))*(level < 100 ? 0 : 1),
            attack_speed: (25 + 0.25*(level-100))*(level < 100 ? 0 : 1),
        }),
        perks: {
            "Gold's Power": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    s_golden_damage: (50 + 0.5*(level-100))*(level < 100 ? 0 : 1),
                })
            },
            "Shining Scales": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    strength: (Math.ceil(Math.log10(special.goldCollection))*10)*(level < 100 ? 0 : 1),
                    magic_find: (Math.ceil(Math.log10(special.goldCollection))*2)*(level < 100 ? 0 : 1),
                })
            },
            "Dragon's Greed": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({ //wiki desc on this perk has a percent after strength but i asked in lobbies and 2 people said it was additive
                    p_X_strength_per_5_magic_find: (0.5)*(level < 100 ? 0 : 1) //very good solution i know
                })
            },
            "Legendary Treasure": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    s_damage: Math.floor(special.bankCoins/1000000)*(0.125 + 0.00125*(level-100))*(level < 100 ? 0 : 1),
                })
            },
        }
    },
    "AMMONITE": {
        base: (level, tier) => ({
            sea_creature_chance: 0.5*level
        }),
        perks: {
            "Heart of the Sea": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    sea_creature_chance: 0.01*level*special.hotm
                })
            },
            "Gift of the Ammonite": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    fishing_speed: 0.005*level*((special.skills.mining || 0)+(special.skills.fishing || 0)),
                    walk_speed: 0.02*level*((special.skills.mining || 0)+(special.skills.fishing || 0)),
                    defense: 0.02*level*((special.skills.mining || 0)+(special.skills.fishing || 0)),
                })
            },
        }
    },
    "ARMADILLO": {
        base: (level, tier) => ({
            defense: 2*level
        }),
        perks: {
            "Mobile Tank": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    p_1_walk_speed_per_X_defense: 100-0.5*level,
                    p_1_mining_speed_per_X_defense: 100-0.5*level,
                })
            },
        }
    },
    "BABY_YETI": {
        base: (level, tier) => ({
            strength: 0.4*level,
            intelligence: 0.75*level,
        }),
        perks: {
            "Ice Shields": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    a_strength_as_defense: 0.75*level
                })
            },
            "Yeti Fury": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    s_yeti_sword_damage: 1*level,
                    s_yeti_sword_intelligence: 1*level,
                })
            },
        }
    },
    "BAL": {
        base: (level, tier) => ({
            strength: 0.25*level,
            ferocity: 0.1*level,
        }),
        perks: {

        }
    },
    "BEE": {
        base: (level, tier) => ({
            strength: 5+0.25*level,
            intelligence: 0.5*level,
            walk_speed: 0.1*level,
        }),
        perks: {
            
        }
    },
    "BLACK_CAT": {
        base: (level, tier) => ({
            intelligence: 1*level,
            walk_speed: 0.25*level,
        }),
        perks: {
            "Hunter": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    c_walk_speed: 1*level,
                    walk_speed: 1*level
                })
            },
            "Omen": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    pet_luck: 0.15*level
                })
            },
            "Supernatural": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    magic_find: 0.15*level
                })
            }
        }
    },
    "BLAZE": {
        base: (level, tier) => ({
            intelligence: 1*level,
            defense: 0.3*level,
        }),
        perks: {
            "Nether Embodiment": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    l_all_crimson_isle: 0.1*level
                })
            },
            "Bling Armor": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    s_blaze_armor_stats: 0.4*level
                })
            },
            //Fusion-Style Potato is calculated in calculateItemStats()
        }
    },
    "BLUE_WHALE": {
        base: (level, tier) => ({
            health: 2*level
        }),
        perks: {
            "Bulk": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    [tier == "RARE" ? "p_X_defense_per_30_health" : ""]: 0.01*level,
                    [tier == "EPIC" ? "p_X_defense_per_25_health" : ""]: 0.01*level,
                    [tier == "LEGENDARY" ? "p_X_defense_per_20_health" : ""]: 0.01*level,
                })
            },
            "Archimedes": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    m_health: 0.002*level
                })
            },
        }
    },
    "CHICKEN": {
        base: (level, tier) => ({
            health: 2*level,
        }),
        perks: {

        }
    },
    "DOLPHIN": {
        base: (level, tier) => ({
            intelligence: 1*level,
            sea_creature_chance: 0.05*level
        }),
        perks: {
            "Echolocation": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    sea_creature_chance: (tier == "RARE" ? 0.07 : 0.1)*level
                })
            },
        }
    },
    "ELEPHANT": {
        base: (level, tier) => ({
            health: 1*level,
            intelligence: 0.75*level
        }),
        perks: {
            "Stomp": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    p_X_defense_per_100_walk_speed: (tier == "EPIC" || tier == "LEGENDARY" ? 0.2: 0.15) * level
                })
            },
            "Walking Fortress": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    p_X_health_per_10_defense: 0.01*level
                })
            },
            "Trunk Efficiency": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    farming_fortune: 1.8*level
                })
            },
        }
    },
    "ENDER_DRAGON": {
        base: (level, tier) => ({
            strength: 0.5*level,
            critical_damage: 0.5*level,
            critical_chance: 0.1*level,
        }),
        perks: {
            "End Strike": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    d_end_mobs: 2*level
                })
            },
            "One with the Dragons": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    s_aotd_damage: 0.5*level,
                    s_aotd_strength: 0.3*level
                })
            },
            "Superior": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => allStatsBoost(0.1*level)
            },
        }
    },
    "GHOUL": {
        base: (level, tier) => ({
            health: 1*level,
            critical_chance: 0.05*level,
        }),
        perks: {

        }
    },
    "GIRAFFE": {
        base: (level, tier) => ({
            ferocity: 0.05*level,
            health: 1*level,
            intelligence: 0.75*level,
        }),
        perks: {
            "Amplified Healing": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    vitality: 0.25*level
                })
            }
        }
    },
    "GOLEM": {
        base: (level, tier) => ({
            health: 1.5*level,
            strength: 0.5*level,
        }),
        perks: {

        }
    },
    "GRANDMA_WOLF": {
        base: (level, tier) => ({
            strength: 0.25*level,
            health: 1*level,
        }),
        perks: {

        }
    },
    "GRIFFIN": {
        base: (level, tier) => ({
            strength: 0.25*level,
            critical_damage: 0.5*level,
            intelligence: 0.1*level,
            magic_find: 0.1*level,
            critical_chance: 0.1*level,
        }),
        perks: {
            "King of Kings": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({ //it only works when above 85% health but i think its fine
                    m_strength: 1+0.14*level
                })
            }
        }
    },
    "GUARDIAN": {
        base: (level, tier) => ({
            intelligence: 1*level,
            defense: 0.5*level,
        }),
        perks: {
            "Enchanting Wisdom Boost": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    enchanting_wisdom: 0.25
                })
            }
        }
    },
    "HORSE": {
        base: (level, tier) => ({
            intelligence: 0.5*level,
            walk_speed: 0.2*level,
        }),
        perks: {
            "Enchanting Wisdom Boost": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    enchanting_wisdom: 0.25
                })
            }
        }
    },
    "HOUND": {
        base: (level, tier) => ({
            strength: 0.4*level,
            ferocity: 0.05*level,
            attack_speed: 0.15*level,
        }),
        perks: {
            "Fury Claws": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    attack_speed: 0.1*level
                })
            }
        }
    },
    "JELLYFISH": {
        base: (level, tier) => ({
            health: 2*level,
            health_regen: 1*level,
        }),
        perks: {

        }
    },
    "KUUDRA": {
        base: (level, tier) => ({
            strength: 0.4*level,
            health: 4*level,
        }),
        perks: {
            "Kuudra Fortune": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    mining_fortune: 0.5*level
                })
            }
        }
    },
    "LION": {
        base: (level, tier) => ({
            ferocity: 0.05*level,
            walk_speed: 0.25*level,
            strength: 0.5*level,
        }),
        perks: {
            "Primal Force": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    s_damage: 0.2*level,
                    strength: 0.2*level,
                })
            },
            "First Pounce": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    s_fs_ts_c_buff: 1*level
                })
            },
        }
    },
    "MAGMA_CUBE": {
        base: (level, tier) => ({
            strength: 0.5*level,
            critical_damage: 0.5*level,
            critical_chance: 0.1*level,
        }),
        perks: {
            "Salt Blade": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    d_slimes: (tier == "RARE" ? 0.2 : 0.25)*level,
                })
            },
            "Hot Ember": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    s_ember_armor_stats: 0.5*level
                })
            },
        }
    },
    "MEGALODON": {
        base: (level, tier) => ({
            strength: 0.5*level,
            magic_find:  0.1*level,
            ferocity: 0.05*level,
        }),
        perks: {
            "Enhanced Scales": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    s_shark_armor_buff: 0.2*level
                })
            },
        }
    },
    "MITHRIL_GOLEM": {
        base: (level, tier) => ({
            true_defense: 0.5*level,
        }),
        perks: {
            "Danger Adverse": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    l_combat_mining_island: 0.2*level,
                })
            },
        }
    },
    "MONKEY": {
        base: (level, tier) => ({
            walk_speed: 0.2*level,
            intelligence: 0.5*level,
        }),
        perks: {
            "Treeborn": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    foraging_fortune: (tier == "COMMON" ? 0.4 : tier == "UNCOMMON" || tier == "RARE" ? 0.5 : 0.6)*level,
                })
            },
            "Vine Swing": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    l_walk_speed_park: (tier == "RARE" ? 0.75 : 1)*level,
                })
            },
        }
    },
    "MOOSHROOM_COW": {
        base: (level, tier) => ({
            health: 1*level,
            farming_fortune: 10+1*level,
        }),
        perks: {
            "Farming Strength": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    p_X_farming_fortune_per_1_strength: 40-0.2*level
                })
            },
        }
    },
    "OCELOT": {
        base: (level, tier) => ({
            walk_speed: 0.5*level,
            ferocity: 0.1*level,
        }),
        perks: {
            "Foraging Wisdom Boost": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    farming_wisdom: (tier == "COMMON" ? 0.2 : tier == "UNCOMMON" || tier == "RARE" ? 0.25 : 0.3)*level
                })
            },
        }
    },
    "PARROT": {
        base: (level, tier) => ({
            intelligence: 1*level,
            critical_damage: 0.1*level
        }),
        perks: {

        }
    },
    "PHOENIX": {
        base: (level, tier) => ({
            strength: 0.6*level,
            intelligence: 50+1*level,
        }),
        perks: {

        }
    },
    "PIG": {
        base: (level, tier) => ({
            walk_speed: 0.2*level,
        }),
        perks: {

        }
    },
    "PIGMAN": {
        base: (level, tier) => ({
            strength: 0.5*level,
            ferocity: 0.05*level,
            defense: 0.5*level,
        }),
        perks: {
            "Pork Master": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    s_pigman_sword_damage: 0.4*level,
                    s_pigman_sword_strength: 0.25*level,
                })
            },
            "Giant Slayer": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    d_lvl_100: 0.25*level
                })
            },
        }
    },
    "RABBIT": {
        base: (level, tier) => ({
            health: 1*level,
            walk_speed: 0.2*level,
        }),
        perks: {
            "Farming Wisdom Buff": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    farming_wisdom: (tier == "RARE" ? 0.25 : 0.3)*level,
                })
            },
            "Giant Slayer": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    d_lvl_100: 0.25*level
                })
            },
        }
    },
    "RAT": {
        base: (level, tier) => ({
            strength: 0.5*level,
            critical_damage: 0.1*level,
            health: 1*level
        }),
        perks: {

        }
    },
    "ROCK": {
        base: (level, tier) => ({
            true_defense: 0.1*level,
            defense: 2*level
        }),
        perks: {

        }
    },
    "SCATHA": {
        base: (level, tier) => ({
            mining_speed: 1*level,
            defense: 1*level,
        }),
        perks: {
            "Grounded": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    mining_fortune: (tier == "RARE" ? 1 : 1.25)*level,
                })
            },
        }
    },
    "SHEEP": {
        base: (level, tier) => ({
            intelligence: 1*level,
            ability_damage: 0.2*level,
        }),
        perks: {

        }
    },
    "SILVERFISH": {
        base: (level, tier) => ({
            health: 0.2*level,
            defense: 1*level,
        }),
        perks: {
            "True Defense Boost": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    true_defense: (tier == "COMMON" ? 0.05 : tier == "UNCOMMON" || tier == "RARE" ? 0.1 : 0.15)*level
                })
            },
            "Mining Wisdom Boost": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    mining_wisdom: (tier == "RARE" ? 0.25 : 0.3)*level
                })
            },
        }
    },
    "SKELETON": {
        base: (level, tier) => ({
            critical_chance: 0.15*level,
            critical_damage: 0.3*level,
        }),
        perks: {

        }
    },
    "SKELETON_HORSE": {
        base: (level, tier) => ({
            intelligence: 1*level,
            walk_speed: 0.5*level
        }),
        perks: {
            "True Defense Boost": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    true_defense: (tier == "COMMON" ? 0.05 : tier == "UNCOMMON" || tier == "RARE" ? 0.1 : 0.15)*level
                })
            },
            "Mining Wisdom Boost": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    mining_wisdom: (tier == "RARE" ? 0.25 : 0.3)*level
                })
            },
        }
    },
    "SNAIL": {
        base: (level, tier) => ({
            intelligence: 1*level
        }),
        perks: {
            "Slow Moving": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    s_no_speed: 1,
                })
            },
        }
    },
    "SNOWMAN": {
        base: (level, tier) => ({
            strength: 0.25*level,
            critical_damage: 0.2*level,
            s_damage: 0.25*level,
        }),
        perks: {

        }
    },
    "SPIDER": {
        base: (level, tier) => ({
            strength: 0.1*level,
            critical_chance: 0.1*level,
        }),
        perks: {

        }
    },
    "SPIRIT": {
        base: (level, tier) => ({
            walk_speed: 0.3*level,
            intelligence: 1*level,
        }),
        perks: {

        }
    },
    "SQUID": {
        base: (level, tier) => ({
            health: 0.5*level,
            intelligence: 0.5*level,
        }),
        perks: {
            "Ink Specialty": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    s_ink_wand_damage: (tier == "RARE" ? 0.3 : 0.4)*level,
                    s_ink_wand_strength: (tier == "RARE" ? 0.1 : 0.2)*level,
                })
            },
            "Fishing Wisdom Boost": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    fishing_wisdom: 0.3*level,
                })
            },
        }
    },
    "TARANTULA": {
        base: (level, tier) => ({
            strength: 0.1*level,
            critical_chance: 0.1*level,
            critical_damage: 0.3*level,
        }),
        perks: {

        }
    },
    "TIGER": {
        base: (level, tier) => ({
            strength: 0.15*level,
            ferocity: 0.25*level,
            critical_chance: 0.05*level,
            critical_damage: 0.5*level,
        }),
        perks: {
            "Merciless Swipe": {
                tier: "COMMON",
                stats: (level, tier, special) => ({
                    ferocity: (tier == "COMMON" ? 0.1 : tier == "UNCOMMON" || tier == "RARE" ? 0.2 : 0.3)*level
                })
            },
        }
    },
    "TURTLE": {
        base: (level, tier) => ({
            health: 0.5*level,
            defense: 1*level
        }),
        perks: {
            "Turtle Tactics": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    m_defense: 3+0.27*level
                })
            },
        }
    },
    "DROPLET_WISP": { //oh boy
        base: (level, tier) => ({
            [tier !== "UNCOMMON" ? "true_defense" : ""]: (tier == "RARE" ? 0.15 : tier == "EPIC" ? 0.3 : 0.35)*level,
            health: (tier == "UNCOMMON" ? 1 : tier == "RARE" ? 2.5 : tier == "EPIC" ? 4 : 6)*level,
            [tier !== "UNCOMMON" ? "intelligence" : ""]: (tier == "RARE" ? 0.5 : tier == "EPIC" ? 1.25 : 2.5)*level,
        }),
        perks: {

        }
    },
    "WITHER_SKELETON": {
        base: (level, tier) => ({
            strength: 0.25*level,
            critical_damage: 0.25*level,
            defense: 0.25*level,
            critical_chance: 0.05*level,
            intelligence: 0.25*level,
        }),
        perks: {
            "Wither Blood": {
                tier: "EPIC",
                stats: (level, tier, special) => ({
                    d_wither_mobs: 0.25*level,
                })
            },
        }
    },
    "WOLF": {
        base: (level, tier) => ({
            true_defense: 0.1*level,
            critical_damage: 0.2*level,
            health: 0.5*level,
            walk_speed: 0.2*level,
        }),
        perks: {
            "Combat Wisdom Boost": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    combat_wisdom: 0.3*level,
                })
            },
        }
    },
    "ZOMBIE": {
        base: (level, tier) => ({
            health: 1*level,
            critical_damage: 0.3*level,
        }),
        perks: {
            "Rotten Blade": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    d_zombies: 0.25*level,
                })
            },
            "Living Dead": {
                tier: "LEGENDARY",
                stats: (level, tier, special) => ({
                    s_undead_armor_defense: 0.2*level,
                })
            },
        }
    },
    "BINGO": {
        base: (level, tier) => ({
            strength: 0.25*level,
            health: 1*level,
        }),
        perks: {
            "Chimera": {
                tier: "RARE",
                stats: (level, tier, special) => ({
                    s_pet_stat_buff: 0.1+0.003*level
                })
            },
        }
    },
}

//these pets give perks even when not active
export const alwaysActivePets: petName[] = [
    "GRANDMA_WOLF",
    "SPIRIT",
    "PARROT",
    "BINGO",
    "KUUDRA",
]

export type petItem = 
    "PET_ITEM_ALL_SKILLS_BOOST_COMMON" |
    "ALL_SKILLS_SUPER_BOOST" |

    "PET_ITEM_FARMING_SKILL_BOOST_COMMON" |
    "PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON" |
    "PET_ITEM_FARMING_SKILL_BOOST_RARE" |
    "PET_ITEM_FARMING_SKILL_BOOST_EPIC" |
    
    "PET_ITEM_MINING_SKILL_BOOST_COMMON" |
    "PET_ITEM_MINING_SKILL_BOOST_RARE" |

    "PET_ITEM_COMBAT_SKILL_BOOST_COMMON" |
    "PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON" |
    "PET_ITEM_COMBAT_SKILL_BOOST_RARE" |
    "PET_ITEM_COMBAT_SKILL_BOOST_EPIC" |

    "PET_ITEM_FORAGING_SKILL_BOOST_COMMON" |
    "PET_ITEM_FORAGING_SKILL_BOOST_EPIC" |

    "PET_ITEM_FISHING_SKILL_BOOST_COMMON" |
    "PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON" |
    "PET_ITEM_FISHING_SKILL_BOOST_RARE" |
    "PET_ITEM_FISHING_SKILL_BOOST_EPIC" |

    "PET_ITEM_EXP_SHARE" |

    "PET_ITEM_BIG_TEETH_COMMON" |
    "BIGGER_TEETH" |

    "PET_ITEM_SHARPENED_CLAWS_UNCOMMON" |
    "SERRATED_CLAWS" |

    "PET_ITEM_IRON_CLAWS_COMMON" |
    "GOLD_CLAWS" |

    "PET_ITEM_HARDENED_SCALES_UNCOMMON" |
    "REINFORCED_SCALES" |

    "PET_ITEM_TEXTBOOK" |
    "PET_ITEM_LUCKY_CLOVER" |
    "PET_ITEM_SADDLE" |
    "PET_ITEM_BUBBLEGUM" |

    "PET_ITEM_TIER_BOOST" |
    "PET_ITEM_VAMPIRE_FANG" |
    "PET_ITEM_TOY_JERRY" | //apparently thats what its called
    "PET_ITEM_SPOOKY_CUPCAKE" |

    "DWARF_TURTLE_SHELMET" |
    "CROCHET_TIGER_PLUSHIE" |
    "ANTIQUE_REMEDIES" |
    "MINOS_RELIC" |
    "WASHED_UP_SOUVENIR" |

    "REAPER_GEM" |

    "PET_ITEM_FLYING_PIG" |

    "PET_ITEM_QUICK_CLAW";

export const petItemStats: {
    [key in petItem]?: statsList
} = {
    "PET_ITEM_BIG_TEETH_COMMON": {critical_chance: 5},
    "BIGGER_TEETH": {critical_chance: 10},
    "PET_ITEM_SHARPENED_CLAWS_UNCOMMON": {critical_damage: 15},
    "SERRATED_CLAWS": {critical_damage: 25},
    "PET_ITEM_IRON_CLAWS_COMMON": {critical_damage: 40, critical_chance: 40},
    "GOLD_CLAWS": {critical_damage: 50, critical_chance: 50},
    "PET_ITEM_HARDENED_SCALES_UNCOMMON": {defense: 25},
    "REINFORCED_SCALES": {defense: 40},
    "PET_ITEM_TEXTBOOK": {m_intelligence: 1},
    "PET_ITEM_LUCKY_CLOVER": {magic_find: 7},
    "PET_ITEM_SPOOKY_CUPCAKE": {strength: 30, walk_speed: 20},
    "CROCHET_TIGER_PLUSHIE": {attack_speed: 35},
    "ANTIQUE_REMEDIES": {strength: 0.8},
    //ill account for minos relic in the function to avoid typing every stat
    "WASHED_UP_SOUVENIR": {sea_creature_chance: 5},
    //same with quick claw
}

//higher tiers of pets are harder to level
export const petRarityOffset: {
    [key in petTier]: number
} = {
    COMMON: 0,
    UNCOMMON: 6,
    RARE: 11,
    EPIC: 16,
    LEGENDARY: 20,
    MYTHIC: 20
}

export const petLeveling = [
    100,
    110,
    120,
    130,
    145,
    160,
    175,
    190,
    210,
    230,
    250,
    275,
    300,
    330,
    360,
    400,
    440,
    490,
    540,
    600,
    660,
    730,
    800,
    880,
    960,
    1050,
    1150,
    1260,
    1380,
    1510,
    1650,
    1800,
    1960,
    2130,
    2310,
    2500,
    2700,
    2920,
    3160,
    3420,
    3700,
    4000,
    4350,
    4750,
    5200,
    5700,
    6300,
    7000,
    7800,
    8700,
    9700,
    10800,
    12000,
    13300,
    14700,
    16200,
    17800,
    19500,
    21300,
    23200,
    25200,
    27400,
    29800,
    32400,
    35200,
    38200,
    41400,
    44800,
    48400,
    52200,
    56200,
    60400,
    64800,
    69400,
    74200,
    79200,
    84700,
    90700,
    97200,
    104200,
    111700,
    119700,
    128200,
    137200,
    146700,
    156700,
    167700,
    179700,
    192700,
    206700,
    221700,
    237700,
    254700,
    272700,
    291700,
    311700,
    333700,
    357700,
    383700,
    411700,
    441700,
    476700,
    516700,
    561700,
    611700,
    666700,
    726700,
    791700,
    861700,
    936700,
    1016700,
    1101700,
    1191700,
    1286700,
    1386700,
    1496700,
    1616700,
    1746700,
    1886700,
    
    //for gdrag / future lvl > 100 pets
    0, //when it reaches lvl 100 it hatches into lvl 101, so its instant
    5555, //why hypixel why
]