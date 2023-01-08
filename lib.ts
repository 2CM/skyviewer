import nbt from "prismarine-nbt";
import React from "react";
import { promisify } from "util";
import { apiData } from "./pages/profile/[profileName]";
import { accPowers, attributeStats, baseProfile, baseStats, cakeStats, colorCode, effectColors, effectName, effectStats, enchantStats, enrichmentStats, gemstone, gemstoneRarities, gemstoneSlots, gemstoneStats, gemstoneTier, harpNames, harpSong, harpStats, item, itemGemstoneSlotType, itemIdReplacements, itemTier, mpTable, nbtItem, petScores, profileMember, rarityColors, reforgeStats, skillCaps, skillColors, skillExtrapolation, skillLeveling, skillLevelStats, skillName, skillNameToApiName, skillType, slayerColors, slayerName, slayerStats, specialGemstoneSlots, statIdToStatName, statName, statsList, tuningValues, contents, itemStats, colorChar, colorCodeToHex, harpColors, pet, petStatInfo, petStats, petLeveling, petRarityOffset, specialPetData, statColors, petItemStats, petItemNames, defaultStatCaps, hotmLeveling, alwaysActivePets, petTier, petName, bestiaryInfo, bestiaryBosses, maxBestiaryLevels, bestiaryMobFamily, bestiaryLeveling, abicaseStats, skyblockLocation, fullSets, fullSetPiece, fullSetName, fullSetNames, ExtraAttributes, enchantName, reforgeName, attributeName, enchants, attributes, skyblockStartDate, irlMinutesPerYear, monthsPerYear, daysPerMonth, hoursPerDay, minutesPerHour, seasons, seasonVariants, baseStatName, statsSources, specificStatSources } from "./sbconstants"; //so many ;-;
import statStyles from "./styles/stat.module.css";

var parseNbt = promisify(nbt.parse); //using it because i found it in the skycrypt github and it works

interface IObjectKeys {
    //(PROBABLY A TEMP SOLUTION, THIS DOESNT LOOK STABLE. SOME TYPESCRIPT GOD CAN CORRECT ME ON A BETTER WAY TO DO THIS)
    //this interface is extended from when theres an interface that you need to select a value using object[key] notation. if you dont use it, youll get a ts error


    [key: string]: any;
}

//function that retuns undefined
//useful for cases where you need to call a function that might not exist
const UNDEFINEDFUNC = () => {return undefined};

//function that returns all the keys of an object BUT respects object key type
export function keys<Type extends object>(obj: Type): (keyof Type)[] {
    return Object.keys(obj) as (keyof Type)[];
}

export function values<Type extends object>(obj: Type): Type[keyof Type][] {
    return Object.values(obj) as Type[keyof Type][];
}

// *** CUSTOM PROTOTYPES ***
// custom prototypes are used for stuff like "this is a string".capitalize() because writing captialize("this is a string") is worse
declare global {
    interface String {
        capitalize(): string
    }
    interface Number {
        compact(): string,
    }
}

//capitalizes a string
String.prototype.capitalize = function (split: boolean = true) {
    if (split) return this.split(" ").map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");

    return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

//compacts a number and adds suffixes like K, M, B
Number.prototype.compact = function () {
    var formatter = Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    return formatter.format(Number(this));
}

//maps values of an object
export function mapObjectKeys<Type extends object>(obj: Type, callbackfn: (value: keyof Type, index: number, array: any[]) => string): Type {
    var newObj: Type | any = {};

    for (let i = 0; i < keys(obj).length; i++) {
        var name = keys(obj)[i];
        var newName = callbackfn(name, i, keys(obj))

        newObj[newName] = obj[name as keyof typeof obj];
    }

    return newObj
}

//maps values of an object
export function mapObjectValues<Type extends object>(obj: Type, callbackfn: (value: Type[keyof Type], index: number, array: any[]) => Type[keyof Type]): Type {
    var newObj: Type | any = {};

    for (let i = 0; i < keys(obj).length; i++) {
        var name = keys(obj)[i];
        var value = obj[name as keyof typeof obj];
        var newValue = callbackfn(value, i, keys(obj))

        newObj[name] = newValue;
    }

    return newObj
}

// *** ITEMS ***

export var items: item[] = [];
export var itemsIndex = new Map<string, number>(); //index that takes an item id -> index of items[]

//item type


export function tierStringToNumber(string: itemTier): number {
    var index = keys(mpTable).findIndex(tier => { return string == tier });

    return index == -1 ? 0 : index;
}

//converts item id (found in nbt) -> item
export async function itemIdToItem(id: string): Promise<item | undefined> {
    if (itemsIndex.size == 0) return undefined; //its not initiated

    var correctId = itemIdReplacements.get(id) || id;

    var location = itemsIndex.get(correctId); //index of id in items[]

    if (location == undefined) return undefined; //item id prob doesnt exist

    return items[location];
}

//initiates itemIdToItem system
export function initItems(data: apiData) {
    if (itemsIndex.size != 0) { //guard so we dont do it again
        console.warn("items already inited");

        return;
    }

    console.log("initing items");

    items = data.itemsData.items;

    //initiates the itemsIndex (Map<string, number>), used for going from item id -> index of items[]
    for (let i = 0; i < items.length; i++) {
        itemsIndex.set(items[i].id, i);
    }
}

export var fullSetsIndex = new Map<fullSetPiece, fullSetName>();

export function initFullSets() {
    if (fullSetsIndex.size != 0) { //guard so we dont do it again
        console.warn("full sets already inited");

        return;
    }

    console.log("initing sets");

    for(let i in keys(fullSets)) {
        let setName = keys(fullSets)[i]; //YOUNG_DRAGON
        let setPieces = fullSets[setName]; //["YOUNG_DRAGON_${'HELMET' | 'CHESTPLATE' | 'LEGGINGS' | 'BOOTS'}"];

        for(let j in setPieces) {
            let pieceName = setPieces[j]; //["YOUNG_DRAGON_HELMET"]

            fullSetsIndex.set(pieceName, setName); //fullSetIndex["YOUNG_DRAGON_BOOTS"] -> "YOUNG_DRAGON"; 
        }
    }
}

//converts item stats (all caps and sometimes named wrong) into a normal statsList
export function itemStatsToStatsList(itemStats: itemStats): statsList {
    var stats: statsList = {};

    for (let i = 0; i < keys(itemStats).length; i++) {
        var name = keys(itemStats)[i];
        var newName = name.toLowerCase();

        if (newName == "ability_damage_percent") newName = "ability_damage";

        stats[newName as statName] = itemStats[name as keyof typeof itemStats];
    }

    return stats;
}

export function isNbtItem(arg: any): arg is nbtItem {
    return arg.id !== undefined && arg.tag !== undefined;
}

export async function getItemRarity(item: nbtItem, baseItem?: item): Promise<number> {
    baseItem = baseItem || (await itemIdToItem(item.tag.ExtraAttributes.id));

    if(!baseItem) return 0;

    var baseRarity = tierStringToNumber(baseItem.tier || "COMMON");
    var recomb = item.tag.ExtraAttributes.rarity_upgrades || 0;
    var extraRarity = 0;

    if(item.tag.ExtraAttributes.id == "PULSE_RING") {
        var pulseRingCharge = item.tag.ExtraAttributes.thunder_charge || 0;

        extraRarity =
            pulseRingCharge >= 5000000 ? 3 :
            pulseRingCharge >= 1000000 ? 2 :
            pulseRingCharge >= 150000 ? 1 :
            0;
    }

    return baseRarity+recomb+extraRarity;
}

// *** MISC ***

//gives you a minecraft color code of a color
export function color(code: colorCode): `${typeof colorChar}${colorCode}` {
    return `${colorChar}${code}`;
}

//calculates pet level from a pet
export function petToLevel(pet: pet): number {
    var exp = pet.exp;

    var level = 1;

    for(let i = 0; i < 99 + (pet.type == "GOLDEN_DRAGON" ? 100 : 0); i++) {
        var rarityOffset: number = petRarityOffset[pet.tier] || 0;
        var toLevel: number = petLeveling[i+rarityOffset];

        if(toLevel === undefined) toLevel = 1886700


        if(exp >= toLevel) {
            // console.log(exp+" > "+toLevel)

            exp -= toLevel;

            level++;
        } else {
            // console.log({toLevel, exp})

            break;
        }
    }


    return level;
}


//main number formatter
export var mainFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1
});


//number formatter for stats
export var statFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    signDisplay: "always"
});

//number formatter for multipliers
export var multiplierFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 1,
    // signDisplay: "always"
});


//number formatter for percentages
export var percentFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    signDisplay: "always",
});

//number formatter for minutes
export var minuteFormatter = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2
});


//removes colors from a string
export function removeStringColors(string: string): string {
    return string.replaceAll(/§[0123456789abcdefklmnor]/g, "");
}

//parses the contents of a contents using prismarine-nbt
export async function parseContents(contents: contents): Promise<nbt.NBT> {
    var parsed = await parseNbt(Buffer.from(contents.data, "base64"));

    parsed = nbt.simplify(parsed);

    return parsed;
}

//url for discord emoji icon that is a recombobulator
export const recombEmoji = "https://cdn.discordapp.com/emojis/827593781879898142"; //from skyhelper discord bot

export function formattedStringToElement(string: string, element: keyof React.ReactHTML = "span", parentElement: keyof React.ReactHTML = "span") {
    //interfaces SPECIFICALLY for this function
    interface coloredStringToElementChar {
        char: string,
        color: colorCode,
        modifier: string,
    }

    interface coloredStringToElementSegment {
        chars: string,
        color: colorCode,
        modifier: string,
    }


    var children: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];
    
    if(string.startsWith("RECOMB")) {
        children.push(React.createElement("img", { src: recombEmoji, style: { height: "1em", width: "auto" } }, null));

        string = string.slice("RECOMB".length);
    }

    //color formatting
    
    var chars: coloredStringToElementChar[] = [];
    var segments: coloredStringToElementSegment[] = []

    var color: colorCode = "f";
    var modifier: string = "r";

    var primedForCode: boolean = false;

    //split up
    for (let i = 0; i < string.length; i++) {
        var currentStringChar = string[i];

        if (currentStringChar == colorChar) {
            primedForCode = true;
            continue;
        }

        if (primedForCode) {
            if (new Set(keys(colorCodeToHex)).has(currentStringChar as colorCode)) { //its a color
                color = currentStringChar as colorCode;
            } else { //its a modifer or something else that i dont want to deal with
                modifier = currentStringChar;
            }

            primedForCode = false;

            continue;
        }

        chars.push({ char: currentStringChar, color: color, modifier: modifier });
    }

    //segments
    for (let i = 0; i < chars.length; i++) {
        var currentChar = chars[i];
        var lastChar: coloredStringToElementChar = i == 0 ? { char: "none", color: "none" as colorCode, modifier: "none" } : chars[i - 1]

        if (
            currentChar.color == lastChar.color &&
            currentChar.modifier == lastChar.modifier
        ) {
            segments[segments.length - 1].chars += currentChar.char;
        } else {
            segments.push(
                { color: currentChar.color, modifier: currentChar.modifier, chars: currentChar.char }
            )
        }
    }

    for (let i = 0; i < segments.length; i++) {
        var currentSegment = segments[i];

        var style: React.CSSProperties = {
            color: colorCodeToHex[currentSegment.color],
        }

        switch (currentSegment.modifier) {
            case "k":
                //magic one. will maybe do later
                break;
            case "l":
                style.fontWeight = "bold";
                break;
            case "m":
                style.textDecoration = "line-through";
                break;
            case "n":
                style.textDecoration = "underline";
                break;
            case "o":
                style.fontStyle = "italic";
                break;
        }

        children.push(React.createElement(element, { style }, currentSegment.chars))
    }

    return React.createElement(parentElement, {}, children)
}


export function hotmExpToLevel(exp: number): number {
    var level = 0;

    for(let i = 0; i < hotmLeveling.length; i++) {
        if(exp >= hotmLeveling[i]) {
            level++;
        }
    }

    return level;
}

export function calculateBestiaryLevel(name: bestiaryMobFamily, kills: number): number {
    var isBoss = bestiaryBosses.includes(name);
    var familyLevel = 0;
    var cap = (maxBestiaryLevels[name] || 41);

    for(let i = 0; i < cap; i++) {
        let expRequired =
            bestiaryLeveling[isBoss ? "bosses" : "generic"][i] ||
            ((isBoss ? 300 : 100000) + (isBoss ? 100 : 100000) * (i - 12));

        if(kills >= expRequired) {
            // console.log({kills, expRequired});

            familyLevel++;
        } else {
            break;
        }
    }

    return familyLevel;
}

export function determineDaySuffix(day: number) {
    let toString = Math.floor(day).toString();
    let lastDigit = toString.at(-1);


    if(["11", "12", "13"].includes(toString)) return "th"; //exceptions

    if(lastDigit == "1") return "st";
    if(lastDigit == "2") return "nd";
    if(lastDigit == "3") return "rd";

    return "th"
}

var e = new Intl.NumberFormat("en-US", {minimumIntegerDigits: 2})

export function getSkyblockTime() {
    let sbTimestamp = ((new Date().getTime())-skyblockStartDate) || 0; //time in millis since skyblock started

    let year = sbTimestamp/(irlMinutesPerYear*60*1000); //timestamp is in millis, so convert it to minutes
    let month = (year % 1)*monthsPerYear; //for each of these, take the remainder of the previous calculation and multiply it by [current]Per[previous]
    let day = (month % 1)*daysPerMonth;
    let hour = (day % 1)*hoursPerDay;
    let minute = (hour % 1)*minutesPerHour;

    return {
        raw: { sbTimestamp, year, month, day, hour, minute },
        other: { isNight: (hour < 6 || hour > 19) },
        events: {
            spookyFest: {
                isActive: Math.floor(month) == 7 && day > 28
            }
        },
        formatted: `[HOUR]:[MINUTE][AMPM], [VARIANT] [SEASON] [DAY][SUFFIX], Year [YEAR]` //doing it this way because `${}` takes way too much space
            .replace("[HOUR]", ((Math.floor(hour) % 12) || 12) + "")
            .replace("[MINUTE]", (minuteFormatter.format(Math.floor(minute))) + "")
            .replace("[AMPM]", (hour > 12 ? "pm" : "am") + "")
            .replace("[VARIANT]", (seasonVariants[Math.floor(month) % 3]) + "") // "Early" | "Mid" | "Late"
            .replace("[SEASON]", (seasons[Math.floor(month / 3)]) + "") // "Spring" | "Summer" | "Autumn" | "Winter"
            .replace("[DAY]", (Math.floor(day) + 1) + "")
            .replace("[SUFFIX]", (determineDaySuffix(Math.floor(day) + 1)) + "") // "st" | "nd" | "rd" | "th"
            .replace("[YEAR]", (Math.floor(year) + 1) + "")
    }
}

//determines if the player is on a public island
export function isPlayerOnPublicIsland(calcId: string): boolean {
    return !([undefined, "dynamic", "dungeon", "instanced"].includes(calcTemp[calcId].status))
}

// *** PROFILES ***

//gets the most recently played profile of player
export function getMostRecentProfile(profiles: baseProfile[], playerUUID: string): number {
    for (let i = 0; i < profiles.length; i++) {
        if (profiles[i].selected === true) return i;
    }

    return -1;
}


// *** SKILLS ***

//info that is returned when converting from skillExp
export interface skillExpInfo {
    level: number, //decimal
    index: number, //index
    toLevelUp: number, //skill exp to level up
    progress: number //skill exp you have since last level
}

//all info required about a specific skill
export interface skillExpInfos {
    extrapolatedLevelInfo: skillExpInfo,
    levelInfo: skillExpInfo,
    skillExp: number,
}

//skill exp info about all skills
export type allSkillExpInfo = {
    [key in skillName]?: skillExpInfos
}


//gets the exp required to level up past 60 from skillExtrapolation map
export function getSkillExtrapolation(skill: skillName): number {
    if (skill == "dungeoneering") return skillExtrapolation.dungeoneering;
    if (skill == "runecrafting") return skillExtrapolation.runecrafting;
    if (skill == "social") return skillExtrapolation.social;

    var skillCap = skillCaps[skill];

    return skillCap == 60 ? skillExtrapolation.experience60 : skillExtrapolation.experience50;
}


//gets skill type of a skill
export function getSkillType(skill: skillName): skillType {
    return skill == "dungeoneering" ? "dungeoneering" :
        skill == "social" ? "social" :
            skill == "runecrafting" ? "runecrafting" :
                "experience";
}

//converts skill exp (data you get from api) to info about it (level (0-60), index (of exp arr), exp to level up, progress (0-1))
export function skillExpToLevel(exp: number, skill: skillName, extrapolate: boolean = false): skillExpInfo {
    var lowerBoundIndex = -1;
    var skillType: skillType = getSkillType(skill);
    var skillCap = skillCaps[skill];

    for (let i = 0; i < skillCaps[skill]; i++) {
        if (skillLeveling[skillType][i] > exp) { //its the first one you havent reached
            lowerBoundIndex = i - 1;

            break;
        }
    }

    if (lowerBoundIndex == -1) { //its still equal to the default value, meaning your skill is above the cap
        var extraExp = exp - skillLeveling[skillType][skillCaps[skill] - 1];

        if (extrapolate) {
            var expToLevelUp = getSkillExtrapolation(skill);
            var extraLevel = extraExp / expToLevelUp;

            return {
                level: skillCap + extraLevel,
                index: skillCaps[skill] + extraLevel,
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

    var min = skillLeveling[skillType][lowerBoundIndex]; //current level
    var max = skillLeveling[skillType][lowerBoundIndex + 1]; //next level

    var toLevelUp = max - min;

    var level = lowerBoundIndex + ((exp - min) / (max - min)); //level as a decimal. 26.5 = level 26 and half way to 27 
    var decimal = level - Math.floor(level);

    return {
        level, //level
        index: lowerBoundIndex, //index in skillLeveling (level)
        toLevelUp, //how much exp is needed to level up
        progress: decimal * toLevelUp
    }
}

//calculates all the data you need for skill exp stuff
export function calculateAllSkillExp(apiData: apiData, selectedProfile: number, playerUUID: string, calcId: string): allSkillExpInfo {
    var skills: allSkillExpInfo = {};

    for (let i = 0; i < keys(skillCaps).length; i++) {
        var name: skillName = keys(skillCaps)[i];

        var skillExp: number;

        if (name == "dungeoneering") {
            skillExp = apiData.profileData.profiles[selectedProfile].members[playerUUID].dungeons.dungeon_types.catacombs.experience || 0;
        } else {
            skillExp = apiData.profileData.profiles[selectedProfile].members[playerUUID][skillNameToApiName[name] as keyof profileMember] as number;
        }


        skills[name] = {
            skillExp: skillExp,
            levelInfo: skillExpToLevel(skillExp, name),
            extrapolatedLevelInfo: skillExpToLevel(skillExp, name, true),
        };
    }

    calcTemp[calcId].skills = skills;

    return skills;
}

// *** STATS ***

export const statTypes = [
    "flat",
    "additive",
    "multiplicative",
    "cap",
    "limit"
] as const;

export type statType = typeof statTypes[number];

export function getStatType(statName: statName): statType {
    return (
        statName.startsWith("a_") ? "additive" :
        statName.startsWith("m_") ? "multiplicative" :
        statName.startsWith("c_") ? "cap" :
        statName.startsWith("l_") ? "limit" :
        "flat"
    )
}

export function formatStat(num: number, type: statType) {
    return (
        type == "additive" ?
            percentFormatter.format(num*100) + "%" :

        type == "multiplicative" ?
            multiplierFormatter.format(num) + "x" :

        statFormatter.format(num)
    )
}


export const statEvals: {
    [key in statType]: (
        mostRecent: number,
        sources: Record<string, number>,
        statName: baseStatName,
        calcId: string,
    ) => void
} = {
    flat: (mostRecent, sources, statName, calcId) => {
        for(let i in values(sources)) {
            let value = values(sources)[i];

            mostRecent += value;
        }

        calcTemp[calcId].stats.evaluatedStats[statName] ||= {};
        (calcTemp[calcId].stats.evaluatedStats[statName] || {}).flat = mostRecent;
    },
    additive: (mostRecent, sources, statName, calcId) => {
        let summedMultiplier = 1;

        for(let i in values(sources)) {
            let value = values(sources)[i];

            summedMultiplier += value;
        }

        calcTemp[calcId].stats.evaluatedStats[statName] ||= {};
        (calcTemp[calcId].stats.evaluatedStats[statName] || {}).additive = mostRecent * summedMultiplier;
    },
    multiplicative: (mostRecent, sources, statName, calcId) => {
        for(let i in values(sources)) {
            let value = values(sources)[i];

            mostRecent *= value + 1;
        }

        calcTemp[calcId].stats.evaluatedStats[statName] ||= {};
        (calcTemp[calcId].stats.evaluatedStats[statName] || {}).multiplicative = mostRecent;
    },
    cap: (mostRecent, sources, statName, calcId) => {
        let summmedCap: number | undefined = undefined;

        for(let i in values(sources)) {
            let value = values(sources)[i];

            summmedCap = (summmedCap || 0) + value;
        }

        calcTemp[calcId].stats.evaluatedStats[statName] ||= {};
        (calcTemp[calcId].stats.evaluatedStats[statName] || {}).cap = summmedCap === undefined ?
            mostRecent :
            Math.min(mostRecent, summmedCap);
    },
    limit: (mostRecent, sources, statName, calcId) => {
        //set it to the first one because i dont think there are supposed to be multiple limit
        let limit: number | undefined = sources[keys(sources)[0]];

        if(keys(sources).length > 1) {
            console.warn("MORE THAN 1 LIMIT!!!");
        }

        calcTemp[calcId].stats.evaluatedStats[statName] ||= {};
        (calcTemp[calcId].stats.evaluatedStats[statName] || {}).limit = limit === undefined ?
            mostRecent :
            Math.min(mostRecent, limit);
    }
}

//chain of evaluated stats
export type evaluatedStats = {
    [key in baseStatName]?: {
        flat?: number,
        additive?: number,
        multiplicative?: number,
        cap?: number,
        limit?: number,
    }
}

//used for: stat source viewer (popup)
export type categorizedFlippedStats = {
    [key1 in statType]?: {
        [key2 in baseStatName]?: specificStatSources
    }
}

//used for: compacted stat source viewer (hover effect)
export type categorizedCompressedStats = {
    [key1 in statType]?: {
        [key2 in baseStatName]?: {
            [key3 in string]: number
        }
    }
}

export type statTags = {
    path: string[],
    value: any
}[]

//map of calculation id to stat info
export var calcTemp: {
    [key in string]: {
        stats: {
            stats: statsSources
            
            //used for: marking ender armor stats as 2x while on the end island
            tags: statTags,

            //used for: calculations
            flippedStats: {
                [key in statName]?: specificStatSources
            },

            //used for: calculations
            compressedStats: {
                [key1 in statName]?: {
                    [key2 in string]: number
                }
            },

            categorizedFlippedStats: categorizedFlippedStats,
            categorizedCompressedStats: categorizedCompressedStats,

            evaluatedStats: evaluatedStats
        },
        skills: allSkillExpInfo,
        status: skyblockLocation | undefined,
        time: ReturnType<typeof getSkyblockTime>,
        other: {
            hpbsDoubled?: boolean,
            abiphoneContacts?: number,
            fullSets?: fullSetName[],
            griffinStrengthLevel?: number,
            griffinRegenLevel?: number,
        }
    }        
} = {};

//util to replace typing out multiplicative of every stat for sources like (edrag superior perk, superior set bonus, renowned reforge, etc)
export function allStatsBoost(amount: number): statsList {
    return multiplyStatsList({
        a_health: 1,
        a_defense: 1,
        a_strength: 1,
        a_intelligence: 1,
        a_critical_chance: 1,
        a_critical_damage: 1,
        a_attack_speed: 1,
        a_ability_damage: 1,
        a_true_defense: 1,
        a_ferocity: 1,
        a_walk_speed: 1,
        a_magic_find: 1,
        a_pet_luck: 1,
        a_sea_creature_chance: 1,
    }, amount);
}

//same as allStatsBoost except for only combat stats
export function combatStatsBoost(amount: number): statsList {
    return multiplyStatsList({
        a_health: 1,
        a_defense: 1,
        a_strength: 1,
        a_critical_chance: 1,
        a_critical_damage: 1,
    }, amount);
}

//merges 2 stats lists
export function mergeStatsLists(list1: statsList, list2: statsList, fill: boolean = false): statsList {
    var newList: statsList = {};

    var list1Copy = Object.assign({}, list1);
    var list2Copy = Object.assign({}, list2);

    for (let i = 0; i < keys(baseStats).length; i++) {
        var key: statName = keys(baseStats)[i];

        var list1value = list1Copy[key] || 0;
        var list2value = list2Copy[key] || 0;

        if (fill == false && list1value + list2value == 0) continue;

        newList[key] = list1value + list2value;
    }

    return newList;
}

//merges 2 or more stats lists
export function addStatsLists(arr: statsList[], fill: boolean = false): statsList {
    if (arr.length < 2) {
        console.warn("needs more than 2 members");

        return {};
    }

    var added: statsList = arr[0];

    for (let i = 1; i < arr.length; i++) {
        added = mergeStatsLists(added, arr[i], fill);
    }

    return added;
}

//multiplies (statsList * statsList) or (statsList * number)
export function multiplyStatsList(list: statsList, mult: number | statsList): statsList {
    var stats: statsList = {};

    for (let i = 0; i < keys(list).length; i++) {
        var name = keys(list)[i];

        var statValue = list[name];

        if (statValue === undefined) {
            console.warn("multiplyStatsList: statValue === undefined");

            statValue = 0;
        }

        if (typeof mult == "number") {
            stats[name] = statValue * mult;
        } else if (typeof mult == "object") {
            var multiplier = mult[name];

            stats[name] = statValue * (multiplier || 1);
        }
    }

    return stats;
}

//a category of statsLists
export type statsCategory = {
    [key in string]: statsList
}

export function evaluateStats(calcId: string) {
    for(let j in statTypes) {
        let statType = statTypes[j];

        for(let k in keys(calcTemp[calcId].stats.categorizedCompressedStats[statType] || {})) {
            let statName = keys(calcTemp[calcId].stats.categorizedCompressedStats[statType] || {})[k];
            let sources = (calcTemp[calcId].stats.categorizedCompressedStats[statType] || {})[statName] || {};


            //output of last transformation (0 if first one)
            let mostRecent = values(calcTemp[calcId].stats.evaluatedStats[statName] || {}).at(-1) || 0;

            // console.log({statType, statName, sources, mostRecent})

            statEvals[statType](mostRecent, sources, statName, calcId);
        }
    }
}

export function flipStatsRecur(obj: statsSources | statsList, path: string[], calcId: string) {
    for(let i in keys(obj)) {
        let key: string = keys(obj)[i] as string;
        let value = obj[key as keyof typeof obj] || 0;

        // console.log({path, key, value, tags: calcTemp[calcId].stats.tags});
        
        // if(key == "TAG") {
        //     calcTemp[calcId].stats.tags.push({path, value});

        //     console.log("found tag")

        //     return;
        // }

        let newPath: string[] = [...path, key];
        
        if(typeof value === "number") { //weve reached a value
            let statName: statName = key as statName;
            let statType: statType = getStatType(statName);

            //remove all the 0 stats (except limits because zero limits actually do stuff)
            if(statType !== "limit" && value == 0) continue;

            let sourceChain = path.slice(0, -1);

            //recur through the path
            calcTemp[calcId].stats.flippedStats[statName] = calcTemp[calcId].stats.flippedStats[statName] || {};

            let cur = calcTemp[calcId].stats.flippedStats[statName] || {};

            // console.log("looping through ", sourceChain);

            for(let j in sourceChain) {
                cur[sourceChain[j]] = cur[sourceChain[j]] || {};

                // console.log(cur)

                let nextDepth = cur[sourceChain[j]];

                if(typeof nextDepth === "number") nextDepth = {};

                cur = nextDepth;
            }

            cur[path.at(-1) || 0] = value;

            //no object path recursion needed for the compressed one
            calcTemp[calcId].stats.compressedStats[statName] = calcTemp[calcId].stats.compressedStats[statName] || {};

            let preexistingVal: number | undefined = (calcTemp[calcId].stats.compressedStats[statName] || {})[path[0]];

            (calcTemp[calcId].stats.compressedStats[statName] || {})[path[0]] =
                statType == "multiplicative" ? //multiplicatives scale differently
                    (preexistingVal || 1) * (value + 1) :
                statType == "limit" ? //limits dont scale at all
                    value :
                (preexistingVal || 0) + value //everything else scales normally
        } else {
            flipStatsRecur(value, newPath, calcId)
        }
    }
}

export function seperateStatTypes(calcId: string) {
    for(let i in keys(calcTemp[calcId].stats.flippedStats)) {
        let key: statName = keys(calcTemp[calcId].stats.flippedStats)[i];

        let statType: statType = getStatType(key);

        let baseStatName: baseStatName = (statType == "flat" ? key : key.slice(2)) as baseStatName;

        //set the categorized flipped one
        calcTemp[calcId].stats.categorizedFlippedStats[statType] = calcTemp[calcId].stats.categorizedFlippedStats[statType] || {};
        (calcTemp[calcId].stats.categorizedFlippedStats[statType] || {})[baseStatName] = calcTemp[calcId].stats.flippedStats[key];

        //set the categorized compressed one
        calcTemp[calcId].stats.categorizedCompressedStats[statType] = calcTemp[calcId].stats.categorizedCompressedStats[statType] || {};
        (calcTemp[calcId].stats.categorizedCompressedStats[statType] || {})[baseStatName] = calcTemp[calcId].stats.compressedStats[key];
    }
}

export function processStats(calcId: string) {
    //flips the stats inside out. {potions: {speed: {walk_speed: 100}, spirit: {walk_speed: 50}}} -> {walk_speed: {potions: {speed: 100, spirit: 50}}}
    flipStatsRecur(calcTemp[calcId].stats.stats, [], calcId);

    //seperates all the stat types from the output of the last function. {a_health: ..., defense: ..., c_walk_speed} -> {flat: ..., additive: ..., cap: ...}
    seperateStatTypes(calcId);

    //evaluates them by chaining all the types. flat -> additive -> multiplicative -> cap -> limit
    evaluateStats(calcId);
}

// export type itemStatSource = "hpbs" | "baseStats" | "starStats" | "enrichments" | "gemstones";

export const itemStatSourceNames: {
    [key in string]: string
} = {
    hpbs: "Hot Potato Books",
    baseStats: "Base",
    starStats: "Stars",
    enrichments: "Enrichments",
};

export const itemStatSourceColors: {
    [key in string]: colorCode
} = {
    hpbs: "6",
    baseStats: "f",
    starStats: "6",
    enrichments: "b",
};

export type calculateItemStatsOther = {
    invObsidian?: number, //for obby chestplate
    gifts?: number, //for krampus helm
    farmingSkill?: number, //for lantern helmet
}

export async function calculateItemStats(item: nbtItem, baseItem: item, calcId: string, compact: boolean = false, other?: calculateItemStatsOther, isFullSet?: boolean): Promise<statsSources> {
    var stats: statsSources = {};

    //theres a lot of multiplier exceptions
    function multiplyGivenStats(amount: number) {
        for(let i in keys(stats)) {
            let statSourceName: string = keys(stats)[i];

            stats[statSourceName] = multiplyStatsList(stats[statSourceName] || {}, amount);
        }
    }

    // console.log(JSON.stringify(item));
    // console.log(JSON.stringify(baseItem));

    var formattedItemName = `${item.tag.ExtraAttributes.rarity_upgrades == 1 ? "RECOMB" : ""}${item.tag.display.Name}`;

    var foramattedNames: {
        [key in string]: string
    } = {};

    var rarity = await getItemRarity(item, baseItem);

    //base stats
    if (baseItem.stats) {
        stats.baseStats = itemStatsToStatsList(baseItem.stats || {});
    }

    //hpbs
    var hpbBuff = calcTemp[calcId].other.hpbsDoubled ? 2 : 1; //leg blaze pet hpb buff

    if (new Set(["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"]).has(baseItem.category)) { //its an armor piece
        stats.hpbs = {
            health: 4 * (item.tag.ExtraAttributes.hot_potato_count || 0) * hpbBuff,
            defense: 2 * (item.tag.ExtraAttributes.hot_potato_count || 0) * hpbBuff,
        }
    } else { //its probably some type of damager
        stats.hpbs = {
            strength: 2 * (item.tag.ExtraAttributes.hot_potato_count || 0) * hpbBuff,
        }
    }

    //reforge
    var reforge: reforgeName | undefined = item.tag.ExtraAttributes.modifier;

    if (reforge !== undefined && reforge !== "none" && baseItem.category !== "ACCESSORY") {
        foramattedNames.reforge = `${color("5")}${reforge.capitalize()}`;

        if (reforgeStats[reforge] !== undefined) {
            stats.reforge = reforgeStats[reforge](
                Math.min(rarity, 5), //dont want any undefineds
            );

            foramattedNames.reforgeBonus =`${reforge.capitalize()} Bonus`;

            //reforges that give bonuses
            if(reforge == "ancient") {
                stats.reforgeBonus = {critical_damage: Math.floor(calcTemp[calcId].skills.dungeoneering?.levelInfo.level || 0)};
            } else
            
            if(reforge == "withered") {
                stats.reforgeBonus = {strength: Math.floor(calcTemp[calcId].skills.dungeoneering?.levelInfo.level || 0)};
            } else

            if(reforge == "renowned") {
                stats.reforgeBonus = allStatsBoost(0.01);
            } else

            if(reforge == "perfect") {
                stats.reforgeBonus = {a_defense: 0.02};
            } else

            if(reforge == "suspicious") {
                stats.reforgeBonus = {damage: 15};
            }
        } else {
            console.warn(`${reforge} reforge on ${item.tag.display.Name} is not in reforgeStats`);
        }
    }

    //enchants
    var enchantsList = item.tag.ExtraAttributes.enchantments || {};

    for (let i in keys(enchantsList)) {
        let enchantName: enchantName = keys(enchantsList)[i];

        let enchantLevel: number = enchantsList[enchantName] || 0;

        if(enchantLevel == 0) {
            console.warn("enchant level 0!", {enchantName, id: item.tag.ExtraAttributes.id, enchs: item.tag.ExtraAttributes.enchantments});
            continue;
        }

        if (enchants.includes(enchantName)) {
            let recievedEnchantStats = (enchantStats[enchantName] || UNDEFINEDFUNC)(enchantLevel) || {}; //variable naming :)

            if(enchantName == "hecatomb") {
                recievedEnchantStats.health = Math.floor((calcTemp[calcId].skills.dungeoneering?.levelInfo.level || 0) / 10)*2.6
            }

            //old dragon enchantment buff
            if(item.tag.ExtraAttributes.id.startsWith("OLD_DRAGON") && isFullSet == true) {
                recievedEnchantStats = mergeStatsLists(recievedEnchantStats, {
                    [enchantName == "growth" ? "health" : ""]: 10*enchantLevel,
                    [enchantName == "protection" ? "defense" : ""]: 2*enchantLevel,
                    [enchantName == "sugar_rush" ? "walk_speed" : ""]: 1*enchantLevel,
                    [enchantName == "true_protection" ? "true_defense" : ""]: 3*enchantLevel,
                })
            }

            foramattedNames[enchantName] =
                `${color(statColors[keys(recievedEnchantStats)[0]] || "f")}${enchantName.replaceAll("_", " ").capitalize()} ${enchantLevel}`;

            stats[enchantName] = recievedEnchantStats;
        } else {
            console.warn(`couldnt find enchant ${enchantName}`)
        }
    }

    //attributes
    var attributesList = item.tag.ExtraAttributes.attributes || {};

    for (let i in keys(attributesList)) {
        let attributeName: attributeName = keys(attributesList)[i];

        let attributeLevel: number = attributesList[attributeName] || 0;

        if (attributes.includes(attributeName)) {
            let recievedAttributeStats = (attributeStats[attributeName] || UNDEFINEDFUNC)(attributeLevel) || {};

            foramattedNames[attributeName] = 
                `${color(statColors[keys(recievedAttributeStats)[0]] || "f")}${attributeName.replaceAll("_", " ").capitalize()} ${attributeLevel}`;

            stats[attributeName] = recievedAttributeStats;
        } else {
            console.warn(`couldnt find attribute ${attributeName}`);
        }
    }


    
    //format gemstones into something like [{gemstone: "RUBY", tier: "FINE"}, {gemstone: "AMETHYST", tier: "PERFECT"}];
    var gemstones: gemstoneSlots = {};
    var itemGems = item.tag.ExtraAttributes.gems;


    //im so sorry
    if (itemGems !== undefined) {
        for (let i in keys(itemGems)) { //for example: { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST', SAPPHIRE_0: 'FINE' }
            let key: string = keys(itemGems)[i] as string;
            let value: itemGemstoneSlotType | { uuid: string, quality: string } = itemGems[key];

            if (typeof value === "object") value = value["quality"]; //no idea why i have to use brackets but https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-never said so

            if (key == "unlocked_slots") continue;

            for (let j in specialGemstoneSlots) {
                if (key.includes(specialGemstoneSlots[j])) { //theres a pair of { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST' }
                    let entryType: "gemstone" | "tier" = key.includes("_gem") ? "gemstone" : "tier";
                    let gemstoneSlotName: itemGemstoneSlotType = (entryType == "gemstone" ? key.slice(0, -"_gem".length) : key) as itemGemstoneSlotType || "UNIVERSAL";


                    if (entryType == "gemstone") { //its the gemstone in the slot
                        if (gemstones[gemstoneSlotName] === undefined) gemstones[gemstoneSlotName] = {};

                        gemstones[gemstoneSlotName].gemstone = value.toLowerCase() as gemstone;
                    } else if (entryType == "tier") { //its the tier of it
                        if (gemstones[gemstoneSlotName] === undefined) gemstones[gemstoneSlotName] = {};

                        gemstones[gemstoneSlotName].tier = value.toLowerCase() as gemstoneTier;
                    }

                    break;
                } else {
                    gemstones[key] = { gemstone: key.slice(0, -"_0".length).toLowerCase() as gemstone, tier: value.toLowerCase() as gemstoneTier }

                    break;
                }
            }
        }
    }

    //take the formatted gemstones and get the stats of them
    for (let i in Object.values(gemstones)) {
        let gemInfo: { gemstone?: gemstone, tier?: gemstoneTier } = Object.values(gemstones)[i];

        if (gemInfo.gemstone === undefined) {
            console.warn("gemstone.gemstone was undefined");
            continue;
        }

        if (gemInfo.tier === undefined) {
            console.warn("gemstone.tier was undefined");
            continue;
        }

        let recievedStats = gemstoneStats[gemInfo.gemstone][gemInfo.tier](rarity); // :))))))))) variable naming

        //power artifact only gives half gemstone power
        if (baseItem.id == "POWER_ARTIFACT") recievedStats = multiplyStatsList(recievedStats, 0.5);

        //compacting makes gemstones merged into one
        if(compact) {
            stats.gemstones = mergeStatsLists(stats.gemstones || {}, recievedStats);
        } else {
            foramattedNames[`gem${i}`] =
                `${colorChar + rarityColors[gemstoneRarities[gemInfo.tier]]}${(gemInfo.tier as string).capitalize()} ${(gemInfo.gemstone as string).capitalize()} Gemstone`;

            stats[`gem${i}`] = recievedStats;
        }
    }

    //star stats
    // okay so, this area was completely undocumented on the wiki so i had to figure it out myself :)

    // basically, the item gains extra stats based on star count.
    // for example, a hype has 30 base ferocity but if its 5 starred it gets 33 ferocity. same with every dungeon item.
    // extra = base stat * 0.1 * (stars / 5)

    // hope i got it right :D
    var starCount = Math.min(item.tag.ExtraAttributes.dungeon_item_level || 0, 5) //because master stars dont do it;

    if (stats.baseStats) {
        stats.starStats = {};

        for (let i in keys(stats.baseStats)) {
            var statName = keys(stats.baseStats)[i];
            var statValue = stats.baseStats[statName] || 0;

            //it wont be but typescript will be mad without it
            if(typeof statValue === "object") continue;

            stats.starStats[statName] = statValue * 0.1 * (starCount / 5);
        }
    }

    //enrichments
    var itemEnrichment = item.tag.ExtraAttributes.talisman_enrichment;

    if (itemEnrichment !== undefined) {
        stats.enrichments = {};

        stats.enrichments[itemEnrichment] = enrichmentStats[itemEnrichment];
    }

    //exceptions here

    if(item.tag.ExtraAttributes.id == "NEW_YEAR_CAKE_BAG") {
        let cakeData: any = item.tag.ExtraAttributes.new_year_cake_bag_data;

        //the cake data is just an inventory/storage in base64
        let cakeDataB64 = Buffer.from(cakeData).toString("base64");


        //the structure of the cake data is {i: (nbtItem | {})[]} with {}s being empty

        //im sorry
        let contents = (
            (
                await parseContents({
                    type: 0,
                    data: cakeDataB64
                }) as any //parseContents returns nbt.NBT so we need to cast it to an any
            ).i || [] //adding the fallback just in case
        ) as (nbtItem | {})[] //gotta cast it
        
        contents = contents.filter(val => isNbtItem(val)) as nbtItem[]; //filter out {}
        
        if(!stats.baseStats) stats.baseStats = {};
        stats[`${color("c")}New Year Cake Bag Bonus`] = {health: contents.length}
    } else

    if(item.tag.ExtraAttributes.id == "PULSE_RING") {
        if(!stats.baseStats) stats.baseStats = {};

        stats[`${color("b")}Pulse Ring Bonus`] = {magic_find: 
            0.25*( //get extra pulse ring rarity by subtracting all rarity that isnt from thunder
                rarity -
                tierStringToNumber(baseItem.tier || "COMMON") -
                (item.tag.ExtraAttributes.rarity_upgrades || 0)
            )+0.25 //it starts at 0.25

            //guys its mx+b
            //ALGEBRA REFERENCE??!?!???
        }
    } else

    if(item.tag.ExtraAttributes.id == "BLOOD_GOD_CREST") {
        if(!stats.baseStats) stats.baseStats = {};
        
        stats[`${color("c")}Blood God Crest Bonus`] = {strength: Math.floor(Math.log10(item.tag.ExtraAttributes.blood_god_kills || 0)+1)}; //digits
    } else

    if(item.tag.ExtraAttributes.id.startsWith("SYNTHESIZER_V")) {
        let synthTier = +(item.tag.ExtraAttributes.id.at(-1) || "1")-1;

        if(synthTier >= 0) stats[`${color("c")}X`] = {health: (item.tag.ExtraAttributes.EXE || 0)};
        if(synthTier >= 1) stats[`${color("a")}Y`] = {defense: (item.tag.ExtraAttributes.WAI || 0)};
        if(synthTier >= 2) stats[`${color("b")}Z`] = {intelligence: (item.tag.ExtraAttributes.ZEE || 0)};
    } else

    if(item.tag.ExtraAttributes.id.startsWith("RAMPART")) {
        if(calcTemp[calcId].status == "crimson_isle") {
            stats[`${color("c")}Crimson Isle Buff`] = {
                health: 50,
                strength: 20,
                critical_damage: 15,
            };
        }
    } else

    if(["END_HELMET", "END_CHESTPLATE", "END_LEGGINGS", "END_BOOTS", "ENDER_NECKLACE", "ENDER_CLOAK", "ENDER_BELT", "ENDER_GLOVES"].includes(item.tag.ExtraAttributes.id)) {
        if(calcTemp[calcId].status == "combat_3") {
            //all end pieces get 2x stats on the end island (combat_3)

            //multiply all stat sources by 2
            multiplyGivenStats(2);

            calcTemp[calcId].stats.tags.push({path: [`Wearables`, item.tag.display.Name], value: `${color("7")}This piece's stats are currently doubled, as this profile is currently in the end.`})
        }
    } else

    if(item.tag.ExtraAttributes.id == "DRAGONFADE_CLOAK") {
        if(calcTemp[calcId].status == "combat_3") {
            //same stuff with end armor but 3x

            multiplyGivenStats(3);

            calcTemp[calcId].stats.tags.push({path: [`Wearables`, formattedItemName], value: `${color("7")}This piece's stats are currently tripled, as this profile is currently in the end.`})
        }
    } else

    if(item.tag.ExtraAttributes.id == "OBSIDIAN_CHESTPLATE") {
        stats[`${color("5")}Obsidian Chestplate Bonus`] = {walk_speed: Math.round((other?.invObsidian || 0)/20)};
    } else

    if(item.tag.ExtraAttributes.id == "KRAMPUS_HELMET") {
        let krampusHealth = Math.min(Math.floor((other?.gifts || 0)/50), 500);

        stats[`${color("c")}Krampus Helmet Gifts (${other?.gifts || 0})`] = {health: krampusHealth};
    } else 

    if(item.tag.ExtraAttributes.id == "ENCHANTED_JACK_O_LANTERN") {
        stats[`${color("a")}Lantern Helmet Bonus`] = {health: Math.floor(other?.farmingSkill || 0)*4, defense: Math.floor(other?.farmingSkill || 0)*2};
    } else
    
    if(["ZOMBIE_HEART", "CRYSTALLIZED_HEART", "REVIVED_HEART", "REAPER_MASK"].includes(item.tag.ExtraAttributes.id)) {
        stats[`${color("4")}${baseItem.name} Bonus`] = {a_mending: 1, a_vitality: 1};
    } else
    
    if(item.tag.ExtraAttributes.id == "VANQUISHED_MAGMA_NECKLACE") {
        stats[`${color("c")}Magma Cube Absorber`] = {health: Math.min(Math.floor((item.tag.ExtraAttributes.magma_cube_absorber || 0)/1000), 10)}
    } else

    if(item.tag.ExtraAttributes.id == "VANQUISHED_GHAST_CLOAK") {
        stats[`${color("c")}Ghast Blaster`] = {health: Math.min(Math.floor((item.tag.ExtraAttributes.ghast_blaster || 0)/1000), 10)}
    } else

    if(item.tag.ExtraAttributes.id == "VANQUISHED_BLAZE_BELT") {
        stats[`${color("c")}Blaze Consumer`] = {strength: Math.min(Math.floor((item.tag.ExtraAttributes.blaze_consumer || 0)/1000), 10)}
    } else

    if(item.tag.ExtraAttributes.id == "VANQUISHED_GLOWSTONE_GAUNTLET") {
        stats[`${color("c")}Glowing`] = {health: Math.min(Math.floor((item.tag.ExtraAttributes.glowing || 0)/1000), 10)}
    } else

    if(item.tag.ExtraAttributes.id == "SKELETOR_CHESTPLATE") {
        if(isFullSet == true) {
            let skeletorKills = item.tag.ExtraAttributes.skeletorKills || 0;

            stats[`${color("7")}Skeletor`] = {
                strength: Math.floor(Math.min(skeletorKills,500)/10),
                critical_damage: Math.floor(Math.min(skeletorKills,500)/10),
            }
        }
    } else

    if(item.tag.ExtraAttributes.id == "ARMOR_OF_YOG_CHESTPLATE") {
        if(isFullSet == true) {
            let yogsKilled = item.tag.ExtraAttributes.yogsKilled || 0;

            stats[`${color("6")}Absorb`] = {
                mining_speed: Math.min(Math.floor(yogsKilled/10),500),
            }
        }
    } else

    if(["FARMER_BOOTS", "RANCHERS_BOOTS"].includes(item.tag.ExtraAttributes.id)) {
        stats[`${color("a")}${baseItem.name.split(" ")[0]} Boots Bonus`] = {defense: Math.floor(other?.farmingSkill || 0)*2, walk_speed: Math.floor(other?.farmingSkill || 0)*4};
    
        if(item.tag.ExtraAttributes.id == "RANCHERS_BOOTS") {
            stats[`${color("f")}Farmer's Speed`] = {l_walk_speed: (item.tag.ExtraAttributes.ranchers_speed || 400)}
        }
    } else

    if(item.tag.ExtraAttributes.id == "LAVA_SHELL_NECKLACE") {
        stats["lava shell necklace"] = {l_mending: 0, l_vitality: 0}
    } else

    if(item.tag.ExtraAttributes.id == "NIGHT_CRYSTAL") {
        if(calcTemp[calcId].time.other.isNight == true) {
            stats.baseStats = {defense: 5, strength: 5}
        }
    } else
    
    if(item.tag.ExtraAttributes.id == "DAY_CRYSTAL") {
        if(calcTemp[calcId].time.other.isNight == false) {
            stats.baseStats = {defense: 5, strength: 5}
        }
    } else

    if(["MUSHROOM_HELMET", "MUSHROOM_CHESTPLATE", "MUSHROOM_LEGGINGS", "MUSHROOM_BOOTS"].includes(item.tag.ExtraAttributes.id)) {
        if(isFullSet == true && calcTemp[calcId].time.other.isNight == true) {
            multiplyGivenStats(2);
        }
    } else

    if(["BAT_PERSON_HELMET", "BAT_PERSON_CHESTPLATE", "BAT_PERSON_LEGGINGS", "BAT_PERSON_BOOTS"].includes(item.tag.ExtraAttributes.id)) {
        if(calcTemp[calcId].time.events.spookyFest.isActive == true) { //if spooky fest is happening
            //bat person gives 3x stats during spooky fest

            multiplyGivenStats(3);

            calcTemp[calcId].stats.tags.push({path: [`${color("f")}Wearables`, formattedItemName], value: `${color("7")}This piece's stats are currently tripled, as there is a spooky festival.`})
        } else if(calcTemp[calcId].time.other.isNight == true) { //if its night (else if because we dont want 6x stats during spooky fest)
            //it also gives 2x stats during night
            
            multiplyGivenStats(2);

            calcTemp[calcId].stats.tags.push({path: [`${color("f")}Wearables`, formattedItemName], value: `${color("7")}This piece's stats are currently doubled, as it's currently night.`})
        }
    } else

    if(item.tag.ExtraAttributes.id.startsWith("SNOW_SUIT")) {
        if(calcTemp[calcId].status == "winter") {
            //snow suit gives 2x stats on the jerry island

            multiplyGivenStats(2);

            calcTemp[calcId].stats.tags.push({path: [`${color("f")}Wearables`, formattedItemName], value: `${color("7")}This piece's stats are currently doubled, as this profile is currently on the jerry island`})
        }
    }

    // console.log(stats);

    //if we arent compacting, format all the names according to formattedNames
    if(!compact) {
        stats = mapObjectKeys(stats, key => 
            keys(itemStatSourceNames).includes(key) ? //if its part of the constant stat source replacements
                colorChar+itemStatSourceColors[key]+itemStatSourceNames[key] :
            keys(foramattedNames).includes(key) ?
                foramattedNames[key] :
            key
        )
    }

    return stats;
}


//calculates stats given from skill level ups
export async function calculateSkillStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var stats: statsCategory = {};

    for (let i = 0; i < keys(skillCaps).length; i++) { //for each skill
        let name: skillName = keys(skillCaps)[i] as skillName;

        if (name == "dungeoneering") continue;

        // var levelInfo = skillExpToLevel(data.profileData.profiles[selectedProfile].members[playerUUID][skillNameToApiName[name] as keyof profileMember] as number || 0, name)
        var levelInfo = calcTemp[calcId].skills[name]?.levelInfo || {
            level: 0
        }
        
        stats[colorChar + skillColors[name] + name.capitalize() + " " + Math.floor(levelInfo.level)] = skillLevelStats[name](Math.floor(levelInfo.level))
    }

    calcTemp[calcId].stats.stats[`${color("6")}Skills`] = stats;
}

export const fairySoulStats = {
    health: [0, 3, 6, 10, 14, 19, 24, 30, 36, 43, 50, 58, 66, 75, 84, 94, 104, 115, 126, 138, 150, 163, 176, 190, 204, 219, 234, 250, 266, 283, 300, 318, 336, 355, 374, 394, 414, 435, 456, 478, 500, 523, 546, 569, 592, 615, 638, 661],
    defense: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    strength: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    speed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]
}

//yes i know they got revamped ill do that later
export async function calculateFairySoulStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsList> {
    var exchanges = data.profileData.profiles[selectedProfile].members[playerUUID].fairy_exchanges;

    if (exchanges === undefined) return {};


    return {
        health: fairySoulStats.health[exchanges],
        defense: fairySoulStats.defense[exchanges],
        strength: fairySoulStats.strength[exchanges],
        walk_speed: fairySoulStats.speed[exchanges],
    }
}

//NEEDS MORE TESTING; havent accounted for toggles and interface is probably wrong because i cant test around right now
export async function calculateHotmStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var mining_core = data.profileData.profiles[selectedProfile].members[playerUUID].mining_core;

    var stats: statsCategory = {};

    if (mining_core.nodes.mining_speed) stats["Mining Speed 1"] = { mining_speed: 20 * mining_core.nodes.mining_speed || 0 };
    if (mining_core.nodes.mining_fortune) stats["Mining Fortune 1"] = { mining_fortune: 5 * mining_core.nodes.mining_fortune || 0 };

    if (mining_core.nodes.mining_speed_2) stats["Mining Speed 2"] = { mining_speed: 40 * mining_core.nodes.mining_speed_2 || 0 };
    if (mining_core.nodes.mining_fortune_2) stats["Mining Fortune 2"] = { mining_fortune: 5 * mining_core.nodes.mining_fortune_2 || 0 };

    if (mining_core.nodes.mining_madness) stats["Mining Madness"] = { mining_speed: 50, mining_fortune: 50 };

    if (mining_core.nodes.mining_experience) stats["Seasoned Mineman"] = { mining_wisdom: 5 + 0.1 * mining_core.nodes.mining_experience || 0 }

    calcTemp[calcId].stats.stats[`${color("5")}HoTM`] = stats;
}

//calculates stats given from the wither essence shop
export async function calculateEssenceStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var perks = data.profileData.profiles[selectedProfile].members[playerUUID].perks;

    calcTemp[calcId].stats.stats[`${color("7")}Essence Shop`] = {
        [`${color("c")}Forbidden Health`]: { health: (perks.permanent_health || 0) * 2 },
        [`${color("a")}Forbidden Defense`]: { defense: (perks.permanent_defense || 0) * 1 },
        [`${color("f")}Forbidden Speed`]: { walk_speed: (perks.permanent_speed || 0) * 1 },
        [`${color("b")}Forbidden Intelligence`]: { intelligence: (perks.permanent_intelligence || 0) * 2 },
        [`${color("c")}Forbidden Strength`]: { strength: (perks.permanent_strength || 0) * 1 },
    };
}

//calculates stats given from reaper peppers
export async function calculatePepperStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var peppers = data.profileData.profiles[selectedProfile].members[playerUUID].reaper_peppers_eaten;

    if (peppers == undefined) return;

    calcTemp[calcId].stats.stats[`${color("c")}Peppers`] = {health: peppers};
}


//calculates stats given from the harp
export async function calculateHarpStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var harp_quest = data.profileData.profiles[selectedProfile].members[playerUUID].harp_quest;

    if (keys(harp_quest).length == 0) return;

    var stats: statsCategory = {};

    for (let i = 0; i < keys(harpStats).length; i++) { //for each harp song
        var name = keys(harpStats)[i];

        var perfectCompletions = harp_quest["song_" + name + "_perfect_completions" as keyof typeof harp_quest]; //how many perfect completions the player has


        if (typeof perfectCompletions != "number") continue;

        stats[colorChar+harpColors[name]+name.replaceAll("_", " ").capitalize()] = { intelligence: (perfectCompletions >= 1 ? 1 : 0) * harpStats[name] };
    }

    calcTemp[calcId].stats.stats[`${color("d")}Harp`] = stats;
}


//calculates stats given from slayers
export async function calculateSlayerStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var slayer_bosses = data.profileData.profiles[selectedProfile].members[playerUUID].slayer_bosses;

    var stats: statsCategory = {};
    var combatWisdomBuff = 0;

    for (let i = 0; i < keys(slayerStats).length; i++) { //for each slayer boss
        var name: slayerName = keys(slayerStats)[i];
        var info = slayer_bosses[name];

        var boss = slayer_bosses[name];

        var rewardedStats: statsList = {};
        var highestClaimed: number = keys(boss.claimed_levels).length == 0 ? 0 : 1; //highest level claimed

        for (let j = 0; j < 10; j++) { //for each level of it
            var claimed = boss.claimed_levels["level_" + j as keyof typeof boss.claimed_levels] !== undefined || boss.claimed_levels["level_" + j + "_special" as keyof typeof boss.claimed_levels] !== undefined; //if you claimed the level reward
            if (!claimed) continue; //if you didnt, continue

            var levelStats: statsList = slayerStats[name][j - 1]; //stats of the claimed level

            rewardedStats = mergeStatsLists(rewardedStats, levelStats);
            highestClaimed = j;
        }

        stats[colorChar + slayerColors[name] + name.capitalize() + " " + highestClaimed] = rewardedStats;

        for (let j = 0; j < 4; j++) {
            if (info["boss_kills_tier_" + j as keyof typeof info] !== undefined) {
                combatWisdomBuff += j < 3 ? 1 : 2;
            }
        }
    }

    stats[colorChar + "3" + "Global Combat Wisdom Buff"] = { combat_wisdom: combatWisdomBuff };

    calcTemp[calcId].stats.stats[`${color("2")}Slayer`] = stats;
}

export interface accStatsInterface {
    taliStats: statsCategory,
    enrichments: statsCategory,
    magicPower: statsList,
    tuning: statsCategory,
    gems: statsCategory,
}

//calculates stats given from accessories
export async function calculateAccStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var talisman_bag_raw = data.profileData.profiles[selectedProfile].members[playerUUID].talisman_bag;
    var inv_raw = data.profileData.profiles[selectedProfile].members[playerUUID].inv_contents
    var accessory_bag_storage = data.profileData.profiles[selectedProfile].members[playerUUID].accessory_bag_storage;

    if (!talisman_bag_raw) return;

    var stats: accStatsInterface = {
        taliStats: {},
        enrichments: {},
        magicPower: {},
        tuning: {},
        gems: {},
    };

    var taliBag = await parseContents(talisman_bag_raw) as IObjectKeys;
    if (taliBag.i === undefined) return;

    var taliContents: nbtItem[] = taliBag.i;
    taliContents = taliContents.filter(value => keys(value).length);

    var mp = 0;
    var abicaseFound = false;

    for (let i = 0; i < taliContents.length; i++) {
        var tali: nbtItem = taliContents[i];
        var itemAttributes = tali.tag.ExtraAttributes;
        var itemId = itemAttributes.id;

        var itemInfo = await itemIdToItem(itemId);
        if (itemInfo === undefined) {
            console.warn(`cant find item ${itemId}`);
            continue;
        }

        // console.log({[itemAttributes.id]: keys(itemAttributes).map(key => {
        //     return !["timestamp", "rarity_upgrades", "id", "uuid", "originTag", "modifier", "talisman_enrichment"].includes(key) ? 
        //     key+": "+(typeof itemAttributes[key] == "object" ? JSON.stringify(itemAttributes[key]) : itemAttributes[key]) : "";
        // }).filter(val => val != "")})

        if (itemInfo.category !== "ACCESSORY") continue;

        var rarityUpgrades: number = itemAttributes.rarity_upgrades || 0;
        var rarity: number = await getItemRarity(tali, itemInfo);

        var formattedName = (rarityUpgrades === undefined ? "" : rarityUpgrades == 1 ? "RECOMB" : "") + colorChar + Object.values(rarityColors)[rarity] + removeStringColors(itemInfo.name);

        var itemStats = await calculateItemStats(tali, itemInfo, calcId, true);

        if(keys(itemStats.baseStats || {}).length > 0) stats.taliStats[formattedName] = itemStats.baseStats || {};
        if(keys(itemStats.enrichments || {}).length > 0) stats.enrichments[formattedName] = itemStats.enrichments || {};
        if(keys(itemStats.gemstones || {}).length > 0) stats.gems[formattedName] = itemStats.gemstones || {};

        let mpGiven = mpTable[keys(mpTable)[rarity]];

        if(itemInfo.id == "HEGEMONY_ARTIFACT") mpGiven *= 2; //it gives double mp

        mp += mpGiven;

        if(itemId == "ABICASE" && abicaseFound == false && itemAttributes.model) {
            mp += Math.floor((calcTemp[calcId].other.abiphoneContacts || 0)/2);

            stats.taliStats[formattedName] = mergeStatsLists(stats.taliStats[formattedName], abicaseStats[itemAttributes.model] || {})

            abicaseFound = true;
        }
    }

    var selectedPower = accessory_bag_storage.selected_power

    if (accessory_bag_storage.selected_power === undefined) console.warn("no selected power");

    if (keys(accPowers).findIndex(key => {return key == accessory_bag_storage.selected_power}) == -1) {
        console.warn("couldnt find selected power", accessory_bag_storage.selected_power);

        selectedPower = undefined;
    }

    var statsMultiplier = 29.97 * Math.pow((Math.log(0.0019 * mp + 1)), 1.2); //i am maths enjoyer :)))

    if(selectedPower) {
        var selectedPowerStats = accPowers[selectedPower];

        stats.magicPower = multiplyStatsList(selectedPowerStats.per, statsMultiplier);

        if (selectedPowerStats.extra) {
            stats.magicPower = mergeStatsLists(stats.magicPower, selectedPowerStats.extra || {});
        }
    }

    stats.tuning.tuning = multiplyStatsList((accessory_bag_storage.tuning.slot_0 ? accessory_bag_storage.tuning.slot_0 : {}) as statsList, tuningValues)

    console.log({ mp, statsMultiplier });

    let finalObj: statsSources = {};

    finalObj[`${color("b")}Magic Power (${mp})`] = stats.magicPower;
    finalObj[`${color("9")}Accessory Stats`] = stats.taliStats;
    finalObj[`${color("b")}Accessory Enrichments`] = stats.enrichments;
    finalObj[`${color("e")}Accessory Tuning`] = stats.tuning.tuning;
    finalObj[`${color("d")}Accessory Gems`] = stats.gems;

    calcTemp[calcId].stats.stats[`${color("d")}Accessories`] = finalObj;
}



//calculates stats given from potions
export async function calculatePotionStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var active_effects = data.profileData.profiles[selectedProfile].members[playerUUID].active_effects;
    var disabled_effects = data.profileData.profiles[selectedProfile].members[playerUUID].disabled_potion_effects || [];

    var stats: statsCategory = {};

    var effects = [...active_effects];

    function replaceEffect(effect: effectName, level: number) {
        let preExistingIndex = effects.findIndex(effectInfo => effectInfo.effect == effect);
        let effectLevel: number;

        if(preExistingIndex == -1) {
            preExistingIndex = effects.length; //so it can be pushed to the end

            effectLevel = 0;
        } else {
            effectLevel = effects[preExistingIndex].level || 0;
        }

        if(effectLevel < level+1) {
            effects[preExistingIndex] = {effect, level, modifiers: [], ticks_remaining: 200, infinite: false}
        }
    }

    if(calcTemp[calcId].other.fullSets?.includes("MINER_OUTFIT")) {
        replaceEffect("haste", 2);
    }

    if(calcTemp[calcId].other.griffinRegenLevel !== undefined) {
        replaceEffect("regeneration", calcTemp[calcId].other.griffinRegenLevel || 0);
    }

    if(calcTemp[calcId].other.griffinStrengthLevel !== undefined) {
        replaceEffect("strength", calcTemp[calcId].other.griffinStrengthLevel || 0);
    }

    // console.log(effects)

    for (let i in effects) {
        var effect = effects[i];

        // console.log(effect);

        if (typeof effectStats[effect.effect] !== "function") {
            console.warn(`${effect.effect} is not a function`);
            continue;
        }

        if (new Set(disabled_effects).has(effect.effect)) {
            console.warn(`${effect.effect} has been disabled`);
            continue;
        }

        if (effect.effect == "coldfusion" && false) { //coldfusion only works when a wisp is equipped. this is the gaurd for it. ill make it work when i do pet stuffs
            continue;
        }

        if (effect.effect == "dungeon") {
            stats.dungeon.health_regeneration = effectStats.regeneration([1, 2, 3, 3, 3, 4, 4][effect.level]).health_regeneration;

            stats.dungeon.strength = effectStats.strength([3, 3, 3, 4, 4, 4, 5][effect.level]).strength

            stats.dungeon.critical_chance = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_chance;
            stats.dungeon.critical_damage = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_damage;

            stats.dungeon.walk_speed = effectStats.speed([1, 2, 2, 2, 2, 3, 3][effect.level]).walk_speed;

            stats.dungeon.defense = effectStats.resistance([1, 1, 2, 2, 3, 3, 4][effect.level]).defense;

            continue;
        }

        var effectStatsList = mapObjectValues(effectStats[effect.effect](effect.level), value => value || 0); //variable naming ;-;

        for (let j in effect.modifiers) {
            var modifier = effect.modifiers[j];

            switch (modifier.key) { //because there are some modifers that increase stat on effect by a percentage
                case "caffeinated":
                    effectStatsList.walk_speed = effectStatsList.walk_speed || 0;
                    effectStatsList.walk_speed += [5, 8, 12][modifier.amp];
                    break
                case "cola":
                    effectStatsList.strength = effectStatsList.strength || 0;
                    effectStatsList.strength *= 1.05;
                    break;
                case "juice":
                    effectStatsList.health = effectStatsList.health || 0;
                    effectStatsList.health *= 1.05;

                    effectStatsList.health_regeneration = effectStatsList.health_regeneration || 0;
                    effectStatsList.health_regeneration *= 1.05;
                    break;
                case "dr_paper":
                    effectStatsList.health = effectStatsList.health || 0;
                    effectStatsList.health += 75;
                    break;
                case "slayer_energy":
                    effectStatsList.magic_find = effectStatsList.magic_find || 0;
                    effectStatsList.magic_find += 10;
                    break;
                case "tear_filled":
                    effectStatsList.combat_wisdom = effectStatsList.combat_wisdom || 0;
                    effectStatsList.combat_wisdom += 10;
                    //apparently, it also gives "+10❤ per second" but skyblock doesnt say i got any from it so i wont add it
                    break;
                case "res":
                    effectStatsList.defense = effectStatsList.defense || 0;
                    effectStatsList.defense *= 1.1;
                    break;
            }
        }

        stats[`${colorChar+effectColors[effect.effect]+effect.effect.replaceAll("_", " ").capitalize()} ${effect.level}`] = effectStatsList;
    }

    calcTemp[calcId].stats.stats[`${color("5")}Potions`] = stats;
}

export interface cakeStatNumberToStat {
    [key: string]: statName
}


//calculates stats given from century cakes
export async function calculateCakeStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var temp_stat_buffs = data.profileData.profiles[selectedProfile].members[playerUUID].temp_stat_buffs;

    if (!temp_stat_buffs) return {};

    var stats: statsList = {};

    for (let i in temp_stat_buffs) {
        var statBuff = temp_stat_buffs[i];
        var cakeStat = statBuff.key.slice("cake_".length) as statName;

        if (cakeStats[cakeStat] !== undefined) {
            stats[cakeStat] = cakeStats[cakeStat];
        }
    }

    calcTemp[calcId].stats.stats[`${color("d")}Century Cakes`] = stats;
}

//calculates stats given from armor and equipment
export async function calculateArmorStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var inv_armor_raw = data.profileData.profiles[selectedProfile].members[playerUUID].inv_armor;
    var equippment_contents_raw = data.profileData.profiles[selectedProfile].members[playerUUID].equippment_contents;

    var stats: any = {};

    var armor = await parseContents(inv_armor_raw) as any;
    if (armor.i === undefined) return;

    var equipment = await parseContents(equippment_contents_raw) as any;
    if (equipment.i === undefined) return;
    
    var armorContents: (nbtItem | {})[] = [...armor.i, ...equipment.i];
    
    var foundSetPieces = new Set<fullSetPiece>();
    var foundSetNames = new Set<fullSetName>();

    // armorContents = [
    //     {
    //         id: 300,
    //         Count: 1,
    //         tag: {
    //             display: {
    //                 Name: "epic",
    //             },
    //             ExtraAttributes: {
    //                 id: "MINER_OUTFIT_HELMET",
    //                 enchantments: {
    //                     growth: 4
    //                 }
    //             }
    //         },
    //         Damage: 3,
    //     },
    //     {
    //         id: 300,
    //         Count: 1,
    //         tag: {
    //             display: {
    //                 Name: "epicf",
    //             },
    //             ExtraAttributes: {
    //                 id: "MINER_OUTFIT_CHESTPLATE",
    //             }
    //         },
    //         Damage: 3,
    //     },
    //     {
    //         id: 300,
    //         Count: 1,
    //         tag: {
    //             display: {
    //                 Name: "epicff",
    //             },
    //             ExtraAttributes: {
    //                 id: "MINER_OUTFIT_LEGGINGS",
    //             }
    //         },
    //         Damage: 3,
    //     },
    //     {
    //         id: 300,
    //         Count: 1,
    //         tag: {
    //             display: {
    //                 Name: "epicfff",
    //             },
    //             ExtraAttributes: {
    //                 id: "MINER_OUTFIT_BOOTS",
    //                 ranchers_speed: 100
    //             }
    //         },
    //         Damage: 3,
    //     },
    // ]


    //find full sets so calculateItemStats can use it
    for(let i in armorContents) {
        var piece: nbtItem | {} = armorContents[i];

        if(!isNbtItem(piece)) continue;

        var pieceFullSetName = fullSetsIndex.get(piece.tag.ExtraAttributes.id as fullSetPiece);

        if(pieceFullSetName !== undefined) {
            foundSetNames.add(pieceFullSetName);
            foundSetPieces.add(piece.tag.ExtraAttributes.id as fullSetPiece);
        }
    }

    // console.log({foundSetNames, foundSetPieces});

    var verifiedFullSets = new Set(foundSetNames);

    //check which full sets we actually have
    for(let i in [...foundSetNames]) {
        let foundSetName = [...foundSetNames][i];

        for(let j in fullSets[foundSetName]) {
            let setPieceName = fullSets[foundSetName][j];

            if(!foundSetPieces.has(setPieceName)) {
                verifiedFullSets.delete(foundSetName);
            }
        }
    }

    calcTemp[calcId].other.fullSets = [...verifiedFullSets]

    // console.log(verifiedFullSets);

    let finalObj: statsSources = {};

    for (let i in armorContents) {
        var piece: nbtItem | {} = armorContents[i];

        if(!isNbtItem(piece)) continue;

        var baseItem = await itemIdToItem(piece.tag.ExtraAttributes.id);
        if (!baseItem) {
            console.warn("piece baseItem is undefined");
            continue;
        }

        var category = baseItem.category;

        let formattedItemName = `${piece.tag.ExtraAttributes.rarity_upgrades == 1 ? "RECOMB" : ""}${piece.tag.display.Name}`

        //other stuff that shouldnt be calculated in calculateItemStats()
        let other: calculateItemStatsOther = {};

        //put in if statement to avoid unnecessary computation
        if(piece.tag.ExtraAttributes.id == "OBSIDIAN_CHESTPLATE") {
            let inv_contents = await parseContents(data.profileData.profiles[selectedProfile].members[playerUUID].inv_contents) as any;

            // inv_contents = {
            //     i: [
            //         {id: 49, Count: 20},
            //         {id: 49, Count: 20},
            //         {id: 49, Count: 39},
            //     ]
            // }

            if(inv_contents.i !== undefined) {
                let obsidianCount = 0;

                // console.log(inv_contents)

                for(let j in inv_contents.i) {
                    let inv_slot: nbtItem = inv_contents.i[j];
                    
                    if(inv_slot.id == 49) { //obsidian
                        obsidianCount += inv_slot.Count;
                    }
                }

                other.invObsidian = obsidianCount;
            }
        }

        other.gifts = data.profileData.profiles[selectedProfile].members[playerUUID].stats.gifts_given || 0;
        other.farmingSkill = calcTemp[calcId].skills.farming?.levelInfo.level || 0

        //find what full set this piece contributes to, if any
        let fullSetContribution: fullSetName | undefined;
        let pieceFullSetName = fullSetsIndex.get(piece.tag.ExtraAttributes.id as fullSetPiece);

        if(pieceFullSetName !== undefined && verifiedFullSets.has(pieceFullSetName)) {
            fullSetContribution = pieceFullSetName;
        }

        stats[formattedItemName] = await calculateItemStats(piece, baseItem, calcId, false, other, fullSetContribution !== undefined);

        finalObj[formattedItemName] = stats[formattedItemName];
    }

    // console.log(verifiedFullSets);

    //full set bonuses
    for(let i in [...verifiedFullSets]) {
        let fullSetName = [...verifiedFullSets][i];

        var formattedName = fullSetNames[fullSetName] || fullSetName;

        //full set bonuses go here
        if(fullSetName == "YOUNG_DRAGON") {
            finalObj[formattedName] = {c_walk_speed: 100, walk_speed: 70}
        } else
        
        if(fullSetName == "MASTIFF") {
            finalObj[formattedName] = {p_X_health_per_1_critical_damage: 50, s_critical_hit_multiplier: 0.5}
        } else

        if(fullSetName == "FAIRY") {
            finalObj[formattedName] = {
                health: data.profileData.profiles[selectedProfile].members[playerUUID].fairy_souls_collected
            }
        } else 

        if(fullSetName == "FARM_SUIT") {
            if(calcTemp[calcId].status == "farming_1") {
                finalObj[formattedName] = {walk_speed: 20};
            }
        } else

        if(fullSetName == "FARM_ARMOR") {
            if(calcTemp[calcId].status == "farming_1") {
                finalObj[formattedName] = {walk_speed: 25};
            }
        } else

        if(fullSetName == "ANGLER") {
            finalObj[formattedName] = {health: 10*Math.floor((calcTemp[calcId].skills.fishing?.levelInfo.level || 1)/10)};
        } else 

        if(fullSetName == "LAPIS_ARMOR") {
            finalObj[formattedName] = {health: 60};
        } else 

        if(fullSetName == "EMERALD_ARMOR") {
            let emeraldCollection = data.profileData.profiles[selectedProfile].members[playerUUID].collection.EMERALD || 0;

            finalObj[formattedName] = {
                health: Math.min(Math.floor(emeraldCollection/3000), 350),
                defense: Math.min(Math.floor(emeraldCollection/3000), 350),
            };
        } else 

        if(fullSetName == "SPEEDSTER") {
            calcTemp[calcId].stats.stats[formattedName] = {walk_speed: 20};
        } else 

        if(fullSetName == "GLACITE") {
            finalObj[formattedName] = {mining_speed: 2*Math.floor(calcTemp[calcId].skills.mining?.levelInfo.level || 1)};
        } else 

        if(fullSetName == "SUPERIOR_DRAGON") {
            finalObj[formattedName] = {
                s_aotd_ability_bonus: 0.5,
                ...allStatsBoost(0.05)
            };
        } else 

        if(fullSetName == "HOLY_DRAGON") {
            finalObj[formattedName] = {health_regeneration: 200};
        } else

        if(fullSetName == "HEAVY" || fullSetName == "SUPER_HEAVY") {
            finalObj[formattedName] = {p_X_walk_speed_per_50_defense: 1};
        } else

        if(fullSetName == "VANQUISHED") {
            finalObj[formattedName] = {s_damage_reduction: -0.1};
        } else

        if(fullSetName == "GOBLIN") {
            finalObj[formattedName] = {l_intelligence: 0, p_X_mining_speed_per_15_intelligence: 1};
        }
    }

    calcTemp[calcId].stats.stats[`${color("f")}Wearables`] = finalObj;
}

//calculates stats given from pet score
export async function calculatePetScoreStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var pets = data.profileData.profiles[selectedProfile].members[playerUUID].pets;

    var petScore = 0;
    var uniquePets = new Map<string, number>();
    var mf = 0; //magic find

    for (let i in pets) {
        var pet = pets[i];

        var rarity: number = tierStringToNumber(pet.tier) + 1;
        var lastRarity: number = uniquePets.get(pet.type) || 0; //if the pet is already in the map, its rarity. if not, 0

        uniquePets.set(pet.type, Math.max(lastRarity, rarity))
    }

    petScore = [...uniquePets.values()].reduce((prev, curr) => prev + curr, 0);

    for (let i in petScores) {
        let num = petScores[i];

        if (petScore < num) break;

        mf++;
    }

    var stats: statsCategory = {};

    calcTemp[calcId].stats.stats[colorChar + "b"+"Pet Score (" + petScore + ")"] = {magic_find: mf};
}

//WORK

//calculates stats given from current pet
export async function calculatePetStats(data: apiData, selectedProfile: number, playerUUID: string, specialData: specialPetData, calcId: string) {
    var pets = data.profileData.profiles[selectedProfile].members[playerUUID].pets;

    var equippedPet: pet | undefined = pets.find(pet => pet.active == true);

    if(equippedPet === undefined) return;

    //seperating them because each background pet is only mentioned once but the equipped pet is mentioned a lot
    var backgroundPetStats: any = {}; //for all pets (background pets)
    var stats: statsCategory = {}; //for only the equipped pet

    equippedPet = { //for testing
        exp: 5038804, //from deathstreeks
        tier: "LEGENDARY",
        type: "GRIFFIN",
        active: true,
        heldItem: null,
        candyUsed: 0,
        uuid: "",
        skin: "",
    }

    var petInfo: petStatInfo | undefined = petStats[equippedPet.type]; //info about the pet

    if(!petInfo) {
        console.log(`couldnt find pet ${equippedPet}`);

        return;
    }

    var petLevel: number = petToLevel(equippedPet); //level of the pet

    
    if(equippedPet.type == "BLAZE" && equippedPet.tier == "LEGENDARY") { //hpb double exception
        calcTemp[calcId].other.hpbsDoubled = true;
    } else if(equippedPet.type == "GRIFFIN") { //griffin gives potion effects
        switch(equippedPet.tier) {
            case "UNCOMMON":
                calcTemp[calcId].other.griffinRegenLevel = 5;
                calcTemp[calcId].other.griffinStrengthLevel = 7;
            break;
            case "RARE":
                calcTemp[calcId].other.griffinRegenLevel = 6;
                calcTemp[calcId].other.griffinStrengthLevel = 7;
            break;
            case "EPIC":
                calcTemp[calcId].other.griffinRegenLevel = 6;
                calcTemp[calcId].other.griffinStrengthLevel = 8;
            break;
            case "LEGENDARY":
                calcTemp[calcId].other.griffinRegenLevel = 7;
                calcTemp[calcId].other.griffinStrengthLevel = 8;
            break;
        }
    }

    var baseStats = petInfo.base(petLevel, equippedPet.tier); //base stats of the pet

    // BABY_YETI, 100, LEGENDARY -> (gray)[Lvl 100] (gold)Baby Yeti
    function formatPet(name: string, tier: petTier, level: number): string {
        return `${colorChar}7[Lvl ${level}] ${color(rarityColors[tier])+name.replaceAll("_", " ").capitalize()}`;
    }

    //gets the stats of a pet's perks (ammonite is the first thing that came up)
    function perksToStats(perks: typeof petStats.AMMONITE.perks, tier: petTier, level: number): statsCategory {
        var perkStats: statsCategory = {};

        for(let i in keys(perks)) {
            var perkName: string = keys(perks)[i] as string;
            var hasPerk: boolean = tierStringToNumber(tier) >= tierStringToNumber(perks[perkName].tier);

            if(!hasPerk) continue;

            var recievedStats = perks[perkName].stats(level, tier, specialData);

            perkStats[`${color(rarityColors[perks[perkName].tier])}${perkName}`] = recievedStats; //color is the required rarity of the pet to get the perk

            if(perkName == "Chimera") { //(from bingo pet) gives a stat boost on equipped pet so it needs an exception
                stats[`${color(rarityColors[perks[perkName].tier])}Bingo Chimera`] = multiplyStatsList(baseStats, recievedStats.s_pet_stat_buff || 0); //color is the bingo pet rarity
            }
        }

        return perkStats
    }

    //equipped pet
    stats = perksToStats(petInfo.perks, equippedPet.tier, petLevel);


    //[kuudra, bingo, parrot, grandma wolf, spirit]
    for(let i in alwaysActivePets) {
        let petName = alwaysActivePets[i];
        let pet: pet | undefined = pets.find(pet => pet.type == petName);

        if(pet === undefined) continue;

        let level = petToLevel(pet);

        var recievedStats = perksToStats(petStats[pet.type].perks, pet.tier, level);

        backgroundPetStats[formatPet(petName, pet.tier, level)] = recievedStats;
    }

    if(equippedPet.heldItem) {
        var petItemName = petItemNames[equippedPet.heldItem];

        petItemName = petItemNames[equippedPet.heldItem];

        stats[petItemName] = {};

        if(equippedPet.heldItem == "MINOS_RELIC") { //i dont want to type m_[statName] in petItemStats
            stats[petItemName] = multiplyStatsList(baseStats, 1/3);
        } else if(equippedPet.heldItem == "PET_ITEM_QUICK_CLAW") { //changes based on level
            stats[petItemName] = {mining_speed: petLevel, mining_fortune: petLevel};
        } else { //its a normal pet item
            var heldItemStats = petItemStats[equippedPet.heldItem] || {};

            //WORK

            // //loop so we can treat m_ stats correctly
            // for(let i in keys(heldItemStats)) {
            //     let name: statName = keys(heldItemStats)[i];

            //     if(name.startsWith("m_")) {
            //         var realName: statName = name.slice("m_".length) as statName;

            //         stats[petItemName][realName] = (baseStats[realName] || 0) * (heldItemStats[name] || 0);
            //     } else {
            //         stats[petItemName][name] = (heldItemStats[name] || 0)
            //     }
            // }
        }
    }

    stats.Base = baseStats;

    var mergedStats: any = {...backgroundPetStats, [formatPet(equippedPet.type, equippedPet.tier, petLevel)]: stats};

    calcTemp[calcId].stats = {...calcTemp[calcId].stats, ...mergedStats}; //because mergedStats is a statCategories
}

//calculates stats given from bestiary milestones
export async function calculateBestiaryStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var bestiary = data.profileData.profiles[selectedProfile].members[playerUUID].bestiary;

    var tiersUnlocked = 0;

    for(let i in keys(bestiaryInfo)) {
        var name: bestiaryMobFamily = keys(bestiaryInfo)[i];
        var kills = bestiary[`kills_family_${name}`] || 0;
        var familyLevel = calculateBestiaryLevel(name, kills);;

        // console.log({name, kills, familyLevel});

        tiersUnlocked += familyLevel;
    }

    // console.log(tiers);

    var milestones = Math.floor(tiersUnlocked/10); //you gain a milestone for every 10 tiers unlocked
    var health = milestones*2; //you gain 2 health per milestone

    calcTemp[calcId].stats.stats[`${color("c")}Bestiary Milestone (${milestones})`] = {health: health};
}

export async function calculateAbiphoneStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    var abiphone = data.profileData.profiles[selectedProfile].members[playerUUID].nether_island_player_data?.abiphone;

    if(!abiphone) return;

    calcTemp[calcId].other.abiphoneContacts = abiphone.active_contacts?.length || 0; //for calculateAccStats abicase mp buffs

    calcTemp[calcId].stats.stats[`${color("5")}9F™ Operator Chip`] = {health: abiphone.operator_chip?.repaired_index !== undefined ? (abiphone.operator_chip.repaired_index+1)*2 : 0};
}

export async function calculateMayorStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    let currentMayor = data.electionData?.mayor;

    if(!currentMayor) return;

    let stringifiedPerks = currentMayor.perks.map(perk => perk.name);

    let mayorPerks: statsSources = {};

    console.log(currentMayor)


    //diana -> "Lucky!" -> +15 Pet Luck
    //marinia -> "Fishing Exp Buff" -> +50 fishing exp on public islands
    //marinia -> "Luck Of The Sea 2.0" -> +15 SCC

    //jerry -> "Statspocalypse" -> 10% all stats (NEEDS CONFIRMATION)

    //jerry -> "Perkpocalypse" -> mayor cycle mechanics
    //foxy -> "Extra Event" -> extra spooky fest
    //cole -> "Mining Fiesta" -> +75 mining wisdom on public islands

    
    //diana
        if(stringifiedPerks.includes("Lucky!")) {
            mayorPerks[`${color(statColors.pet_luck || "f")}Lucky!`] = {pet_luck: 15};
        }

    //marina
        if(stringifiedPerks.includes("Luck of the Sea 2.0")) {
            mayorPerks[`${color(statColors.sea_creature_chance || "f")}Luck of the Sea 2.0`] = {sea_creature_chance: 15};
        }

        if(stringifiedPerks.includes("Fishing XP Buff")) {
            if(isPlayerOnPublicIsland(calcId)) {
                mayorPerks[`${color(statColors.fishing_wisdom || "f")}Fishing XP Buff`] = {fishing_wisdom: 50};
            }
        }

    calcTemp[calcId].stats.stats[`${color("b")}Current Mayor (${currentMayor.name})`] = mayorPerks;
}

export async function calculateStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    calcTemp[calcId].stats.stats["Base Value"] = baseStats;

    calcTemp[calcId].stats.stats["Base Caps"] = defaultStatCaps;

    var specialPetData: specialPetData = {
        goldCollection: data.profileData.profiles[selectedProfile].members[playerUUID].collection.GOLD_INGOT || 0,
        bankCoins: data.profileData.profiles[selectedProfile].banking?.balance || 0,
        skills: {
            fishing: Math.floor(calcTemp[calcId].skills.fishing?.levelInfo.level || 0),
            mining: Math.floor(calcTemp[calcId].skills.mining?.levelInfo.level || 0),
        },
        hotm: hotmExpToLevel(data.profileData.profiles[selectedProfile].members[playerUUID].mining_core.experience || 0),
        location: calcTemp[calcId].status,
        isNight: calcTemp[calcId].time.other.isNight
    };

    await calculatePetStats(data, selectedProfile, playerUUID, specialPetData, calcId);
    await calculateAbiphoneStats(data, selectedProfile, playerUUID, calcId);
    await calculateSkillStats(data, selectedProfile, playerUUID, calcId);
    await calculateHotmStats(data, selectedProfile, playerUUID, calcId);
    await calculateEssenceStats(data, selectedProfile, playerUUID, calcId);
    await calculatePepperStats(data, selectedProfile, playerUUID, calcId);
    await calculateHarpStats(data, selectedProfile, playerUUID, calcId);
    await calculateSlayerStats(data, selectedProfile, playerUUID, calcId);
    await calculateAccStats(data, selectedProfile, playerUUID, calcId);
    await calculateArmorStats(data, selectedProfile, playerUUID, calcId);
    await calculatePotionStats(data, selectedProfile, playerUUID, calcId);
    await calculateCakeStats(data, selectedProfile, playerUUID, calcId);
    await calculatePetScoreStats(data, selectedProfile, playerUUID, calcId);
    await calculateBestiaryStats(data, selectedProfile, playerUUID, calcId);
    await calculateMayorStats(data, selectedProfile, playerUUID, calcId);

    //catacombs level stats (not worth creating a function for)
    calcTemp[calcId].stats.stats[`${color("c")}Dungeoneering Level`] = skillLevelStats.dungeoneering(Math.floor(calcTemp[calcId].skills.dungeoneering?.levelInfo.level || 0))

    // calcTemp[calcId].stats.stats.testing = {
    //     addi: {
    //         a_health: 0.2
    //     },
    //     multi: {
    //         yes: {m_mining_fortune: 1},
    //         yeah: {m_mining_fortune: 2}
    //     },
    //     cap: {
    //         walk_speed: 1000,
    //         c_walk_speed: 10,
    //         health: 1000000,
    //         c_health: 100,
    //     },
    //     limit: {
    //         l_health: 75
    //     }
    // }

    // calcTemp[calcId].stats.stats = {
    //     "ender helmet": {
    //         "enchantments": {
    //             "growth 5": {
    //                 health: 20,
    //             },
    //             "protection 5": {
    //                 defense: 30
    //             },
    //         },
    //         "titanic reforge": {
    //             health: 50,
    //             defense: 20,
    //         },
    //         "TAG": {
    //             "a": 2
    //         }
    //     },
    //     "[lvl 80] blue whale": {
    //         "base stats": {
    //             health: 80
    //         },
    //         "perk": {
    //             a_health: 0.5,
    //         },
    //         "per perk": {
    //             // p_X_health_per_15_defense: 15
    //         }
    //     },
    //     "hotm": {
    //         "perk name i forgor": {
    //             m_health: 0.1,
    //             m_critical_chance: 0.1,
    //             m_critical_damage: 0.1,
    //             m_intelligence: 0.1
    //         }
    //     },
    //     "default stat caps": {
    //         c_walk_speed: 400,
    //         c_critical_chance: 100
    //     },
    //     "potions": {
    //         walk_speed: 350
    //     },
    //     "[lvl 71] black cat": {
    //         "base": {
    //             walk_speed: 71,
    //         },
    //         "bc perk name": {
    //             c_walk_speed: 50
    //         }
    //     },
    //     "rancher's boots": {
    //         "ability": {
    //             l_walk_speed: 270
    //         }
    //     }
    // }

    /*

    (Y) == done
    (M) == needs testing / work

    sources
        base stats (Y)

        holdable
            armor (M)
            equipment (M)

        accessories (M)
            accessory power (Y)
            enrichments (Y)
            accessory stats (Y)
            tuning points (Y)

        milestone stats
            skill stats (Y)
            bestiary milestone (Y)
            slayers (Y)
            harp intelligence (Y)

        temp effects
            cake souls (Y)
            potions (M)
            booster cookie

        pets
            pet stats (Y)
            pet items (Y)
            pet score (Y)
            
        pickable
            wither esssence shop (Y)
            hotm (M)
            
        misc 
            peppers (Y)
            community shop upgrades
            abiphone (Y)
    */
}