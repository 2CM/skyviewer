import { readFileSync } from "fs";
import nbt, { list } from "prismarine-nbt";
import { promisify } from "util";
import { apiData, dataContext, serverData } from "./pages/profile/[profileName]";

var parseNbt = promisify(nbt.parse)

interface IObjectKeys {
    //(PROBABLY A TEMP SOLUTION, THIS DOESNT LOOK STABLE. SOME TYPESCRIPT GOD CAN CORRECT ME ON A BETTER WAY TO DO THIS)
    //this interface is extended from when theres an interface that you need to select a value using object[key] notation. if you dont use it, youll get a ts error

    
    [key: string]: any;
}

// *** CUSTOM PROTOS ***

declare global {
    interface String {
        capitalize(): string
    }
    interface Number {
        compact(): string,
        addCommas(fixedLength?: number): string,
    }
}

String.prototype.capitalize = function() {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

Number.prototype.addCommas = function(fixedLength?: number) {
    var split: string[];

    if(fixedLength === undefined) {
        split = this.toString().split(".")
    } else {
        split = this.toFixed(fixedLength).split(".");
    }
    
    split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return split.join(".")
}

Number.prototype.compact = function() {
    /*
    var suffixes = ["","k","m","b","t"];
    var episilon = 0.0000000001; //yeah idk the log was inf repeating

    var logged = (Math.log(Number(this))/Math.log(10));
    var index = Math.floor(Number(logged)/3+episilon);

    return (Number(this)/Math.pow(10,Math.floor(Number(logged)))) + suffixes[index];
    */

    var formatter = Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    return formatter.format(Number(this));
}

// *** ITEMS MANAGER ***

export var items: item[] = [];
export var itemsIndex = new Map<string, number>();

//item type

export type itemTier = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC" | "DIVINE" | "SPECIAL" | "VERY_SPECIAL";

export type itemSoulBoundType = "COOP" | "SOLO";

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

export interface itemGemstoneSlot {
    type: itemGemstoneSlot
}

export interface item {
    material: string,
    durability?: number,
    item_durability?: number,
    skin?: string,
    name: string,
    glowing?: boolean,
    category: string,
    tier?: itemTier,
    soulbound: itemSoulBoundType,
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

export async function itemIdToItem(id: string): Promise<item | undefined> {
    if(itemsIndex.size == 0) return undefined;

    var location = itemsIndex.get(id);

    if(location == undefined) return undefined;

    return items[location];
}

export async function initItems(data: apiData) {
    if(itemsIndex.size != 0) {
        console.log("items already inited");

        return;
    }

    console.log("initing items")

    //items = await (await fetch("/api/getItems")).json() //hypixel api items

    if(data.itemsData === undefined) {
        throw new Error("eee")
    }

    items = data.itemsData.items;


    for (let i = 0; i < items.length; i++) {
        itemsIndex.set(items[i].id, i);
    }
}

export function itemStatsToStatsList(itemStats: itemStats): statsList {
    var stats: statsList = {};

    for (let i = 0; i < Object.keys(itemStats).length; i++) {
        var name = Object.keys(itemStats)[i];

        stats[name.toLowerCase() as keyof typeof stats] = itemStats[name as keyof typeof itemStats];
    }

    return stats;
}

// *** MISC ***

export async function parseContents(contents: contents) {
    var parsed = await parseNbt(Buffer.from(contents.data, "base64"));

    parsed = nbt.simplify(parsed);

    return parsed;

    //console.log(JSON.stringify(parsed));
}


// *** PROFILES ***

export function getMostRecentProfile(apiData: any): number {
    var highest = 0;
    var highestIndex = 0;

    for (let i = 0; i < apiData.profiles.length; i++) {
        var last_save = apiData.profiles[i].last_save

        if(last_save > highest) {
            highest = last_save;
            highestIndex = i;
        }
    }

    return highestIndex;
}

export interface membersList {
    [key: string]: profileMember
}

export interface baseProfile { //base profile. all profile types can be derived from this (dont use)
    profile_id: string,
    members: membersList,
    community_upgrades: object
    last_save: number,
    cute_name: string,
}

export interface profile extends baseProfile { //normal profile
    banking: object
}

export interface bingoProfile extends baseProfile { //bingo profile
    game_mode: "bingo"
}

export type harpSong = "hymn_joy" | "frere_jacques" | "amazing_grace" | "brahms" | "happy_birthday" | "greensleeves" | "jeopardy" | "minuet" | "joy_world" | "pure_imagination" | "vie_en_rose" | "fire_and_flames" | "pachelbel";

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

export interface contents {
    type: 0,
    data: string
}

export type accessoryPower = string;

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

export interface profileMember extends IObjectKeys { //all objects can be expanded upon; all any[] | any need more info
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
    pets: object[],
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

            efficient_miner?: number,
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
    active_effects: object[],
    paused_effects?: any[],
    disabled_potion_effects?: string[],
    temp_stat_buffs?: any[],
    
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
    inv_armor: object
    equipment_contents: object,
    inv_contents: object,
    ender_chest_contents?: object,
    backpack_contents?: object,
    personal_vault_contents: object,
    talisman_bag?: contents,
    potion_bag?: object,
    fishing_bag?: object,
    quiver?: object,
    candy_inventory_contents?: object,
}


// *** SKILLS ***

export interface skillExpInfo {
    level: number, //decimal
    index: number, //index
    toLevelUp: number, //skill exp to level up
    progress: number //skill exp you have since last level
}

export interface skillExpInfos {
    extrapolatedLevelInfo: skillExpInfo,
    levelInfo: skillExpInfo,
    skillExp: number,
}

export interface allSkillExpInfo {
    farming?: skillExpInfos,
    mining?: skillExpInfos,
    combat?: skillExpInfos,
    foraging?: skillExpInfos,
    fishing?: skillExpInfos,
    enchanting?: skillExpInfos,
    alchemy?: skillExpInfos,
    taming?: skillExpInfos,
    carpentry?: skillExpInfos,
    runecrafting?: skillExpInfos,
    social?: skillExpInfos,
}

export type skillType = "runecrafting" | "dungeoneering" | "social" | "experience";
export type skillName = "farming" | "mining" | "combat" | "foraging" | "fishing" | "enchanting" | "alchemy" | "taming" | "dungeoneering" | "carpentry" | "runecrafting" | "social"

export const skillLeveling = {
    experience: [0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425, 40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425, 111672425],
    runecrafting: [0, 50, 150, 275, 435, 635, 885, 1200, 1600, 2100, 2725, 3510, 4510, 5760, 7325, 9325, 11825, 14950, 18950, 23950, 30200, 38050, 47850, 60100, 75400, 94450],
    social: [0, 50, 150, 300, 550, 1050, 1800, 2800, 4050, 5550, 7550, 10050, 13050, 16800, 21300, 27300, 35300, 45300, 57800, 72800, 92800, 117800, 147800, 182800, 222800, 272800],
    dungeoneering: [0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640, 360559640, 453559640, 569809640],
}

export const skillExtrapolation = {
    experience60: 7000000,
    experience50: 4000000,
    runecrafting: 94450,
    social: 272800,
    dungeoneering: 569809640
}

export const skillNameToApiName = {
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

export function getSkillExtrapolation(skill: skillName) {
    if(skill == "dungeoneering") return skillExtrapolation.dungeoneering;
    if(skill == "runecrafting") return skillExtrapolation.runecrafting;
    if(skill == "social") return skillExtrapolation.social;

    var skillCap = skillCaps[skill];

    return skillCap == 60 ? skillExtrapolation.experience60 : skillExtrapolation.experience50;
}

export const skillCaps = {
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

export function getSkillType(skill: skillName): skillType {
    return skill == "dungeoneering" ? "dungeoneering" : 
        skill == "social" ? "social" : 
        skill == "runecrafting" ? "runecrafting" : 
        "experience";
}

export function skillExpToLevel(exp: number, skill: skillName, extrapolate: boolean = false): skillExpInfo {
    var lowerBoundIndex = -1;
    var skillType: skillType = getSkillType(skill);
    var skillCap = skillCaps[skill];

    for (let i = 0; i < skillCaps[skill]; i++) {
        if (skillLeveling[skillType][i] > exp) {
            //console.log(skillLeveling[skillType][i], exp)
            lowerBoundIndex = i - 1;

            break;
        }
    }

    if (lowerBoundIndex == -1) {
        var extraExp = exp-skillLeveling[skillType][skillCaps[skill]-1];


        if(extrapolate) {
            var expToLevelUp = getSkillExtrapolation(skill);
            var extraLevel = extraExp/expToLevelUp;

            return {
                level: skillCap+extraLevel,
                index: skillCaps[skill]+extraLevel,
                toLevelUp: expToLevelUp,
                progress: extraExp % expToLevelUp
            }
        }

        return {
            level: skillCap,
            index: skillCaps[skill],
            toLevelUp: 0,
            progress: extraExp
        }
    }

    var min = skillLeveling[skillType][lowerBoundIndex];
    var max = skillLeveling[skillType][lowerBoundIndex + 1];

    var level = lowerBoundIndex + ((exp - min) / (max - min));

    return {
        level,
        index: lowerBoundIndex,
        toLevelUp: max-min,
        progress: (level-Math.floor(level))*(max-min)
    }
}

export function calculateAllSkillExp(apiData: apiData, selectedProfile: number): allSkillExpInfo {
    if(apiData.profileData === undefined) {
        console.error("profileData is undefined");
        return {};
    } 

    var skills: allSkillExpInfo = {};

    for (let i = 0; i < Object.keys(skillCaps).length; i++) {
		var name = Object.keys(skillCaps)[i] as skillName;

		if(name == "dungeoneering") continue;

		var skillExp = apiData.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"][skillNameToApiName[name as keyof typeof skillNameToApiName] as keyof typeof apiData.profileData] as number;


		skills[name as keyof typeof skills] = {
			skillExp: skillExp,
			levelInfo: skillExpToLevel(skillExp, name),
			extrapolatedLevelInfo: skillExpToLevel(skillExp, name, true),
		};
	}

    return skills;
}

// *** STATS ***

export type statName = "health" | "defense" | "true_defense" | "strength" | "walk_speed" | "critical_chance" | "critical_damage" | "intelligence" | "mining_speed" | "sea_creature_chance" | "magic_find" | "pet_luck" | "attack_speed" | "ability_damage" | "ferocity" | "mining_fortune" | "farming_fortune" | "foraging_fortune" | "breaking_power" | "pristine" | "combat_wisdom" | "mining_wisdom" | "farming_wisdom" | "foraging_wisdom" | "fishing_wisdom" | "enchanting_wisdom" | "alchemy_wisdom" | "carpentry_wisdom" | "runecrafting_wisdom" | "social_wisdom" | "fishing_speed" | "health_regen" | "vitality" | "mending";

export interface statsList extends IObjectKeys {
    health?: number,
    defense?: number,
    true_defense?: number,
    strength?: number,
    walk_speed?: number,
    critical_chance?: number,
    critical_damage?: number,
    intelligence?: number,
    mining_speed?: number,
    sea_creature_chance?: number,
    magic_find?: number,
    pet_luck?: number,
    attack_speed?: number,
    ability_damage?: number,
    ferocity?: number,
    mining_fortune?: number,
    farming_fortune?: number,
    foraging_fortune?: number,
    breaking_power?: number,
    pristine?: number,
    combat_wisdom?: number,
    mining_wisdom?: number,
    farming_wisdom?: number,
    foraging_wisdom?: number,
    fishing_wisdom?: number,
    enchanting_wisdom?: number,
    alchemy_wisdom?: number,
    carpentry_wisdom?: number,
    runecrafting_wisdom?: number,
    social_wisdom?: number,
    fishing_speed?: number,
    health_regen?: number,
    vitality?: number,
    mending?: number,
}

export const statIdToStatName = {
    health: "health",
    defense: "defense",
    true_defense: "true defense",
    strength: "strength",
    walk_speed: "speed",
    critical_chance: "crit chance",
    critical_damage: "crit damage",
    intelligence: "intelligence",
    mining_speed: "mining speed",
    sea_creature_chance: "SCC",
    magic_find: "magic find",
    pet_luck: "pet luck",
    attack_speed: "attack speed",
    ability_damage: "ability damage",
    ferocity: "ferocity",
    mining_fortune: "mining fortune",
    farming_fortune: "farming fortune",
    foraging_fortune: "foraging fortune",
    breaking_power: "breaking power",
    pristine: "pristine",
    combat_wisdom: "combat wisdom",
    mining_wisdom: "mining wisdom",
    farming_wisdom: "farming wisdom",
    foraging_wisdom: "foraging wisdom",
    fishing_wisdom: "fishing wisdom",
    enchanting_wisdom: "enchanting wisdom",
    alchemy_wisdom: "alchemy wisdom",
    carpentry_wisdom: "carpentry wisdom",
    runecrafting_wisdom: "runecrafting wisdom",
    social_wisdom: "social wisdom",
    fishing_speed: "fishing speed",
    health_regen: "health regen",
    vitality: "vitality",
    mending: "mending",
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

export function mergeStatsLists(list1: statsList, list2: statsList): statsList {
    var newList: statsList = {};

    var list1Copy = Object.assign({}, list1);
    var list2Copy = Object.assign({}, list2);

    for (let i = 0; i < Object.keys(baseStats).length; i++) {
        var key = Object.keys(baseStats)[i];

        if(list1Copy[key] === undefined) list1Copy[key] = 0;
        if(list2Copy[key] === undefined) list2Copy[key] = 0;

        newList[key] = list1Copy[key]+list2Copy[key];
    }

    return newList;
}

export function addStatsLists(arr: statsList[]): statsList {
    if(arr.length < 2) throw new Error("needs more than 2 members")

    var added: statsList = arr[0];

    for (let i = 1; i < arr.length; i++) {
        added = mergeStatsLists(added, arr[i]);
    }

    return added;
}

export function multiplyStatsList(list: statsList, mult: number | statsList): statsList {
    var stats: any = {};

    for(let i = 0; i < Object.keys(list).length; i++) {
        var name = Object.keys(list)[i];

        if(typeof mult == "number") {
            stats[name as keyof typeof stats] = list[name as keyof typeof list]*mult;
        } else {
            var multiplier = mult[name as keyof typeof list];

            if(multiplier === undefined) multiplier = 1;

            stats[name as keyof typeof stats] = list[name as keyof typeof list]*multiplier;
        }
    }

    return stats;
}

export interface statsCategory {
    [key: string]: statsList
}

export interface statsCategories {
    [key: string]: statsCategory
}

export function sumStatsCategories(categories: statsCategories): statsList {
    var stats: statsList = {};

    var listsMerged = Object.assign({}, ...Object.values(categories));

    for(let i = 0; i < Object.keys(listsMerged).length; i++) {
        var name = Object.keys(listsMerged)[i];

        stats = mergeStatsLists(stats, listsMerged[name]);
    }

    return stats;
}

export function getStatSources(categories: statsCategories) {
    var sources: any = {};

    for(let i in Object.keys(categories)) {
        var categoryName = Object.keys(categories)[i];
        var category = categories[categoryName as keyof typeof categories];

        for(let j in Object.keys(category)) {
            var listName = Object.keys(category)[j];
            var list = category[listName as keyof typeof category];

            for(let k in Object.keys(list)) {
                var statName = Object.keys(list)[k];
                var stat = list[statName as keyof typeof list];

                if(!stat) continue;

                if(!sources[statName]) sources[statName] = {};
                if(!sources[statName][categoryName]) sources[statName][categoryName] = {};
                sources[statName][categoryName][listName] = stat;
            }
        }
    }

    return sources;
}


var skillLevelStats = {
    farming: function(level: number): statsList {
        return {
            health: 2*level+Math.max(level-14,0)+Math.max(level-19,0)+Math.max(level-25,0),
            farming_fortune: 4*level
        }
    },
    mining: function(level: number): statsList {
        return {
            defense: Math.max(level-14,0)+level,
            mining_fortune: 4*level,
        }
    },
    combat: function(level: number): statsList {
        return {
            critical_chance: 0.5*level,
        }
    },
    foraging: function(level: number): statsList {
        return {
            strength: 1*level+Math.max(level-14,0),
        }
    },
    fishing: function(level: number): statsList {
        return {
            health: 2*level+Math.max(level-14,0)+Math.max(level-19,0)+Math.max(level-25,0),
        }
    },
    enchanting: function(level: number): statsList {
        return {
            intelligence: 1*level+Math.max(level-14,0),
            ability_damage: 0.5*level,
        }
    },
    alchemy: function(level: number): statsList {
        return {
            intelligence: 1*level+Math.max(level-14,0),
        }
    },
    taming: function(level: number): statsList {
        return {
            pet_luck: 1*level
        }
    },
    carpentry: function(level: number): statsList {
        return {
            health: 1*level
        }
    }
}


export async function calculateSkillStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var stats: statsCategory = {};
    
    for (let i = 0; i < Object.keys(skillCaps).length; i++) {
        let name: skillName = Object.keys(skillCaps)[i] as skillName;

        if(skillLevelStats[name as keyof typeof skillLevelStats] === undefined) break;

        var levelInfo = skillExpToLevel(data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"][skillNameToApiName[name]], name)

        stats[name] = skillLevelStats[name as keyof typeof skillLevelStats](Math.floor(levelInfo.level))
    }

    return stats;
}

export const fairySoulStats = {
    health: [0, 3, 6, 10, 14, 19, 24, 30, 36, 43, 50, 58, 66, 75, 84, 94, 104, 115, 126, 138, 150, 163, 176, 190, 204, 219, 234, 250, 266, 283, 300, 318, 336, 355, 374, 394, 414, 435, 456, 478, 500, 523, 546, 569, 592, 615, 638, 661],
    defense: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    strength: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    speed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]
}

//yes i know they got revamped ill do that later
export async function calculateFairySoulStats(data: apiData, selectedProfile: number): Promise<statsList> {
    if(!data.profileData) return {}

    var exchanges = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].fairy_exchanges;

    if(exchanges === undefined) return {};


    return {
        health: fairySoulStats.health[exchanges],
        defense: fairySoulStats.defense[exchanges],
        strength: fairySoulStats.strength[exchanges],
        walk_speed: fairySoulStats.speed[exchanges],
    }
}

//NEEDS MORE TESTING; havent accounted for toggles and interface is probably wrong because i cant test around right now
export async function calculateHotmStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var mining_core = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].mining_core;

    var stats: statsCategory = {};

    if(mining_core.nodes.mining_speed) stats["Mining Speed 1"] = {mining_speed: 20*mining_core.nodes.mining_speed || 0};
    if(mining_core.nodes.mining_fortune) stats["Mining Fortune 1"] = {mining_fortune: 5*mining_core.nodes.mining_fortune || 0};

    if(mining_core.nodes.mining_speed_2) stats["Mining Speed 2"] = {mining_speed: 40*mining_core.nodes.mining_speed_2 || 0};
    if(mining_core.nodes.mining_fortune_2) stats["Mining Fortune 2"] = {mining_fortune: 5*mining_core.nodes.mining_fortune_2 || 0};

    if(mining_core.nodes.mining_madness) stats["Mining Madness"] = {mining_speed: 50, mining_fortune: 50};

    return stats;
}

export async function calculateEssenceStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var perks = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].perks;

    var stats: statsCategory = {};

    return {
        "Forbidden Health": {health: (perks.permanent_health || 0)*2},
        "Forbidden Defense": {defense: (perks.permanent_defense || 0)*1},
        "Forbidden Speed": {walk_speed: (perks.permanent_speed || 0)*1},
        "Forbidden Intelligence": {intelligence: (perks.permanent_intelligence || 0)*2},
        "Forbidden Strength": {strength: (perks.permanent_strength || 0)*1},
    }
}

export async function calculatePepperStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var peppers = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].reaper_peppers_eaten;

    if(peppers == undefined) return {};

    return {
        "Reaper Peppers": {health: peppers}
    }
}

export const harpStats = {
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

export async function calculateHarpStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var harp_quest = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].harp_quest;

    if(Object.keys(harp_quest).length == 0) return {};

    var stats: statsCategory = {};

    for (let i = 0; i < Object.keys(harpStats).length; i++) {
        var name = Object.keys(harpStats)[i];

        var perfectCompletions = harp_quest["song_"+name+"_perfect_completions" as keyof typeof harp_quest];


        if(typeof perfectCompletions != "number") continue;

        stats[name] = {intelligence: (perfectCompletions >= 1 ? 1 : 0) * harpStats[name as keyof typeof harpStats]};
    }

    return stats;
}

export const slayerStats = {
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
        {intelligence: 1},
        {health: 2},
        {intelligence: 2},
        {health: 3},
        {intelligence: 3},
        {health: 4},
        {intelligence: 4},
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

export async function calculateSlayerStats(data: apiData, selectedProfile: number): Promise<statsCategory> {
    if(!data.profileData) return {}

    var slayer_bosses = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].slayer_bosses;

    var stats: statsCategory = {};

    for (let i = 0; i < Object.keys(slayerStats).length; i++) {
        var name = Object.keys(slayerStats)[i];

        for(let j=0;j<9;j++) {
            var boss = slayer_bosses[name as keyof typeof slayer_bosses];

            var claimed = boss.claimed_levels["level_"+j as keyof typeof boss.claimed_levels] === undefined ? false : true;
            if(!claimed) continue;

            var levelStats = slayerStats[name as keyof typeof slayerStats][j];

            for(let k=0;k<Object.keys(levelStats).length;k++) {
                var statName: statName = Object.keys(levelStats)[k] as statName;

                if(!stats[name]) stats[name] = {};
                if(!stats[name][statName]) stats[name][statName] = 0;

                stats[name][statName as string] += levelStats[statName as keyof typeof levelStats];
            }
        }
    }

    return stats;
}

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

export const mpTable = {
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

export interface accPower {
    per: statsList,
    extra?: statsList,
}

export interface accPowers {
    [key: string]: accPower
}

export const accPowers: accPowers  = {
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
            critcial_damage: 1.2,
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
            cricial_damage: 3.6,
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
            attack_damage: 15,
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


// export async function calculateAccStats(data: apiData, selectedProfile: number): Promise<statsList> {
//     if(!data.profileData) return {};

//     var talisman_bag_raw = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].talisman_bag;
//     var accessory_bag_storage = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].accessory_bag_storage;

//     if(!talisman_bag_raw) return {health: 1};


//     var stats = {};

//     var taliBag = await parseContents(talisman_bag_raw) as IObjectKeys;
//     if(taliBag.i === undefined) return {health: 2};

//     var taliContents: IObjectKeys[] = taliBag.i;
//     taliContents = taliContents.filter(value => Object.keys(value).length !== 0);

//     var mp = 0;

//     for (let i = 0; i < taliContents.length; i++) {
//         var tali = taliContents[i];
//         var itemAttributes = tali.tag.ExtraAttributes;
//         var itemId = itemAttributes.id;

//         var itemInfo = await itemIdToItem(itemId);
//         if(itemInfo === undefined) {
//             console.warn(`cant find item ${itemId}`);
//             continue;
//         }

//         var itemStatsList: statsList = {};

//         var itemStats = itemInfo.stats;
//         itemStatsList = itemStatsToStatsList(itemStats || {});

//         var itemEnrichment = tali.tag.ExtraAttributes.talisman_enrichment;

//         if(itemEnrichment !== undefined) {
//             var itemEnrichmentStats: statsList = {};

//             itemEnrichmentStats[itemEnrichment] = enrichmentStats[itemEnrichment as keyof typeof enrichmentStats];

//             itemStatsList = mergeStatsLists(itemStatsList, itemEnrichmentStats)
//         }

//         stats = mergeStatsLists(stats, itemStatsList);

        
//         var rarityIndex = Object.keys(mpTable).findIndex(name => {return itemInfo?.tier == name});
//         if(rarityIndex == -1) rarityIndex = 0;

//         // !!! i dont have any recombed accs so i cant test this one !!!
//         var rarityUpgrades = itemAttributes.rarity_upgrades;
//         var rarity = rarityIndex + (rarityUpgrades === undefined ? 0 : rarityUpgrades == 1 ? 1 : 0);


//         mp += mpTable[Object.keys(mpTable)[rarity] as keyof typeof mpTable];
//     }

//     if(accessory_bag_storage.selected_power === undefined) {
//         console.warn("no selected power");
//         return stats;
//     }

//     var maxwellStats: statsList = {};

//     var statsMultiplier = 29.97 * Math.pow((Math.log(0.0019 * mp + 1)), 1.2);

//     if(Object.keys(accPowers).findIndex(key => {return key == accessory_bag_storage.selected_power}) == -1) {
//         console.error("couldnt find selected power");
//         return stats;
//     }

//     var selectedPowerStats = accPowers[accessory_bag_storage.selected_power as keyof typeof accPowers];

//     if(selectedPowerStats.extra) {
//         maxwellStats = mergeStatsLists(maxwellStats, selectedPowerStats.extra);
//     }

//     maxwellStats = mergeStatsLists(maxwellStats, multiplyStatsList(selectedPowerStats.per, statsMultiplier));

//     console.log(`mp: ${mp}, multiplier: ${statsMultiplier}`);

//     return addStatsLists([
//         stats,
//         maxwellStats,
//         multiplyStatsList((accessory_bag_storage.tuning.slot_0 ? accessory_bag_storage.tuning.slot_0 : {}) as statsList, tuningValues)
//     ]);
// }

export interface accStatsInterface {
    taliStats: statsCategory,
    enrichments: statsCategory,
    magicPower: statsCategory,
    tuning: statsCategory
}

export async function calculateAccStats(data: apiData, selectedProfile: number): Promise<accStatsInterface | undefined> {
    if(!data.profileData) return;

    var talisman_bag_raw = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].talisman_bag;
    var accessory_bag_storage = data.profileData.profiles[selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].accessory_bag_storage;

    if(!talisman_bag_raw) return;

    var stats: accStatsInterface = {
        taliStats: {},
        enrichments: {},
        magicPower: {},
        tuning: {},
    };

    var taliBag = await parseContents(talisman_bag_raw) as IObjectKeys;
    if(taliBag.i === undefined) return;

    var taliContents: IObjectKeys[] = taliBag.i;
    taliContents = taliContents.filter(value => Object.keys(value).length !== 0);

    var mp = 0;

    for (let i = 0; i < taliContents.length; i++) {
        var tali = taliContents[i];
        var itemAttributes = tali.tag.ExtraAttributes;
        var itemId = itemAttributes.id;

        var itemInfo = await itemIdToItem(itemId);
        if(itemInfo === undefined) {
            console.warn(`cant find item ${itemId}`);
            continue;
        }

        stats.taliStats[itemInfo.name] = itemStatsToStatsList(itemInfo.stats || {});

        var itemEnrichment = tali.tag.ExtraAttributes.talisman_enrichment;

        if(itemEnrichment !== undefined) {
            stats.enrichments[itemInfo.name] = {};
            stats.enrichments[itemInfo.name][itemEnrichment] = enrichmentStats[itemEnrichment as keyof typeof enrichmentStats];
        }
        
        var rarityIndex = Object.keys(mpTable).findIndex(name => {return itemInfo?.tier == name});
        if(rarityIndex == -1) rarityIndex = 0;

        // !!! i dont have any recombed accs so i cant test this one !!!
        var rarityUpgrades = itemAttributes.rarity_upgrades;
        var rarity = rarityIndex + (rarityUpgrades === undefined ? 0 : rarityUpgrades == 1 ? 1 : 0);


        mp += mpTable[Object.keys(mpTable)[rarity] as keyof typeof mpTable];
    }

    if(accessory_bag_storage.selected_power === undefined) {
        console.warn("no selected power");
        return stats;
    }

    var statsMultiplier = 29.97 * Math.pow((Math.log(0.0019 * mp + 1)), 1.2);

    if(Object.keys(accPowers).findIndex(key => {return key == accessory_bag_storage.selected_power}) == -1) {
        console.error("couldnt find selected power");
        return stats;
    }
    
    var selectedPowerStats = accPowers[accessory_bag_storage.selected_power as keyof typeof accPowers];

    stats.magicPower.magicPower = multiplyStatsList(selectedPowerStats.per, statsMultiplier);
    if(selectedPowerStats.extra) {
        stats.magicPower.magicPower = mergeStatsLists(stats.magicPower.magicPower, selectedPowerStats.extra || {});
    }

    stats.tuning.tuning = multiplyStatsList((accessory_bag_storage.tuning.slot_0 ? accessory_bag_storage.tuning.slot_0 : {}) as statsList, tuningValues)

    console.log(`mp: ${mp}, multiplier: ${statsMultiplier}`);

    return stats;
}


export async function calculateStats(data: apiData, selectedProfile: number): Promise<statsCategories> {
    // return {...await calculateAccStats(data, selectedProfile)};

    return {
        base: {base: baseStats},
        skills: await calculateSkillStats(data, selectedProfile),
        hotm: await calculateHotmStats(data, selectedProfile),
        essence: await calculateEssenceStats(data, selectedProfile),
        peppers: await calculatePepperStats(data, selectedProfile),
        harp: await calculateHarpStats(data, selectedProfile),
        slayer: await calculateSlayerStats(data, selectedProfile),
        ...await calculateAccStats(data, selectedProfile),
    } 



    /*
    return addStatsLists([
        baseStats,
        await calculateSkillStats(data, selectedProfile),
        await calculateFairySoulStats(data, selectedProfile),
        await calculateHotmStats(data, selectedProfile),
        await calculateEssenceStats(data, selectedProfile),
        await calculatePepperStats(data, selectedProfile),
        await calculateHarpStats(data, selectedProfile),
        await calculateSlayerStats(data, selectedProfile),
        await calculateAccStats(data, selectedProfile),
    ]) 
    */

    /*
    sources
        base stats

        holdable
            armor
            equipment

        accessories
            accessory power
            enrichments
            accessory stats
            tuning points

        milestone stats
            skill stats
            bestiary milestone
            slayers
            harp intelligence

        temp effects
            cake souls
            potions
            booster cookie

        pets
            pet stats
            pet items
            pet score
            
        pickable
            wither esssence shop
            hotm
            
        misc  
            peppers
            fairy souls
    */
}