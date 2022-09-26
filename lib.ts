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

// *** PROFILES ***

export function getMostRecentProfile(apiData: any): number {
    var highest = 0;
    var highestIndex = 0;

    for(let i=0;i<apiData.profiles.length;i++) {
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

export interface profileMember extends IObjectKeys { //all objects can be expanded upon; all any[] | any need more info
    //misc important
    last_save: number,
    stats: object,

    //misc stats
    first_join: number,
    first_join_hub: number
    last_death: number,
    death_count: number,
    
    //fairy souls
    fishing_treasure_caught: number,
    fairy_souls_collected: number,
    fairy_exchanges: number,
    fairy_souls: number,
    
    //money
    personal_bank_upgrade: number,
    coin_purse: number,

    //main progression
    objectives: object,
    achievement_spawnned_island_types: string[],
    quests: object,
    tutorial: string[],
    crafted_generators: string[],
    visited_zones: string[],
    unlocked_coll_tiers: string[],
    nether_island_player_data: object,
    visited_modes: string[],
    collection: object,
    
    //side quests
    harp_quest: object,
    trophy_fish: object,
    trapper_quest: object,

    //pets
    pets: object[],
    autopet: object,

    //slayer
    slayer_quest: object,
    slayer_bosses: object,

    //mining
    forge: object,
    mining_core: object,

    //misc
    dungeons: object,
    jacob2: object,
    experimentation: object,
    bestiary: object,
    soulflow: number,
    
    //effects / buffs
    perks: object,
    active_effects: object[],
    paused_effects: any[],
    disabled_potion_effects: string[],
    temp_stat_buffs: any[],
    
    //essence
    essence_undead: number,
    essence_crimson: number,
    essence_diamond: number,
    essence_dragon: number,
    essence_gold: number,
    essence_ice: number,
    essence_wither: number,
    essence_spider: number,
    
    //skills
    experience_skill_farming: number,
    experience_skill_mining: number,
    experience_skill_combat: number,
    experience_skill_foraging: number,
    experience_skill_fishing: number,
    experience_skill_enchanting: number,
    experience_skill_alchemy: number,
    experience_skill_taming: number,
    experience_skill_carpentry: number,
    experience_skill_runecrafting: number,
    experience_skill_social2: number,
    
    //wardrobe
    wardrobe_contents: object,
    wardrobe_equipped_slot: number,
    
    //misc storage
    accessory_bag_storage: object,
    sacks_counts: object,
    backpack_icons: object,
    
    //storage / inventory
    inv_armor: object
    equipment_contents: object,
    inv_contents: object,
    ender_chest_contents: object,
    backpack_contents: object,
    personal_vault_contents: object,
    talisman_bag: object,
    potion_bag: object,
    fishing_bag: object,
    quiver: object,
    candy_inventory_contents: object,
}


// *** SKILLS ***

export interface skillExpInfo {
    level: number, //decimal
    index: number, //index
    toLevelUp: number, //skill exp to level up
    progress: number //skill exp you have since last level
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

    for (let i = 0; i < skillLeveling[skillType].length; i++) {
        if (skillLeveling[skillType][i] > exp) {
            console.log(skillLeveling[skillType][i], exp)
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