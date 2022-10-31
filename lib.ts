import nbt from "prismarine-nbt";
import React from "react";
import { promisify } from "util";
import { apiData } from "./pages/profile/[profileName]";
import { accPowers, attributeStats, baseProfile, baseStats, cakeStats, colorCode, effectColors, effectName, effectStats, enchantStats, enrichmentStats, gemstone, gemstoneRarities, gemstoneSlots, gemstoneStats, gemstoneTier, harpNames, harpSong, harpStats, item, itemGemstoneSlotType, itemIdReplacements, itemTier, mpTable, nbtItem, petScores, profileMember, rarityColors, reforgeStats, skillCaps, skillColors, skillExtrapolation, skillLeveling, skillLevelStats, skillName, skillNameToApiName, skillType, slayerColors, slayerName, slayerStats, specialGemstoneSlots, statIdToStatName, statName, statsList, tuningValues, contents, itemStats, colorChar, colorCodeToHex, harpColors, pet, petStatInfo, petStats, petLeveling, petRarityOffset, specialPetData, statColors, petItemStats, petItemNames, defaultStatCaps, hotmLeveling } from "./sbconstants"; //so many ;-;
import statStyles from "./styles/stat.module.css";

var parseNbt = promisify(nbt.parse); //using it because i found it in the skycrypt github and it works

interface IObjectKeys {
    //(PROBABLY A TEMP SOLUTION, THIS DOESNT LOOK STABLE. SOME TYPESCRIPT GOD CAN CORRECT ME ON A BETTER WAY TO DO THIS)
    //this interface is extended from when theres an interface that you need to select a value using object[key] notation. if you dont use it, youll get a ts error


    [key: string]: any;
}

//function that returns all the keys of an object BUT respects object key type
export function keys<Type extends object>(obj: Type): (keyof Type)[] {
    return Object.keys(obj) as (keyof Type)[];
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
function mapObjectKeys<Type extends object>(obj: Type, callbackfn: (value: keyof Type, index: number, array: any[]) => string): Type {
    var newObj: Type | any = {};

    for (let i = 0; i < keys(obj).length; i++) {
        var name = keys(obj)[i];
        var newName = callbackfn(name, i, keys(obj))

        newObj[newName] = obj[name as keyof typeof obj];
    }

    return newObj
}

//maps values of an object
function mapObjectValues<Type extends object>(obj: Type, callbackfn: (value: Type[keyof Type], index: number, array: any[]) => Type[keyof Type]): Type {
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
export async function initItems(data: apiData) {
    if (itemsIndex.size != 0) { //guard so we dont do it again
        console.warn("items already inited");

        return;
    }

    console.log("initing items")

    if (data.itemsData === undefined) { //couldnt get the itemsData from the apiData
        throw new Error("eee")
    }

    items = data.itemsData.items;

    //initiates the itemsIndex (Map<string, number>), used for going from item id -> index of items[]
    for (let i = 0; i < items.length; i++) {
        itemsIndex.set(items[i].id, i);
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

// *** MISC ***

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

export function coloredStringToElement(string: string, element: keyof React.ReactHTML = "span", parentElement: keyof React.ReactHTML = "span") {
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


//converts stat sources to an element for stat sources popups
export function sourcesToElement(sources: any, statName: statName) {
    //elements from the sources of one specific stat
    function elementsFromSource(currentSources: any, numberFormatter: (num: number) => string, title?: string, titleNumberFormatter?: (num: number) => string): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] {
        if (keys(currentSources).length == 0) {
            return []
        }

        var elements: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];

        var sum = 0;

        for (let i in keys(currentSources)) {
            var categoryName: string = keys(currentSources)[i] as string;
            var category = currentSources[categoryName];

            var categoryChildren: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];

            var categorySum = 0;

            var lastSourceName: string = "inital value :)";
            var lastSource: number = -1;

            for (let j in keys(category)) {
                var sourceName = keys(category)[j] as string;
                var source: number = category[sourceName];

                var formattedName = sourceName + "";

                // var color: string = "unset";
                var hasRecomb: boolean = false;

                if (formattedName.startsWith("RECOMB")) {
                    hasRecomb = true;
                    formattedName = formattedName.slice("RECOMB".length);
                }

                // if(formattedName.startsWith(colorChar)) {
                //     color = colorCodeToHex[formattedName[1]];
                //     formattedName = formattedName.slice(2);
                // }

                lastSourceName = formattedName;
                lastSource = source;

                categorySum += source;

                categoryChildren.push(
                    React.createElement(
                        "li",
                        {
                            className: statStyles.statValue,
                            // style: {
                            //     color: color
                            // },
                        },
                        [
                            hasRecomb ? React.createElement("img", { src: recombEmoji, style: { height: "1em", width: "auto" } }, null) : null,
                            coloredStringToElement(` ${formattedName}`),
                            React.createElement("span", { style: { color: "white" } }, `: ${numberFormatter(source)}`)
                        ]
                    )
                );
            }

            if (keys(category).length == 1 && lastSourceName == "SAME") {
                elements.push(
                    React.createElement("li", { className: statStyles.statsCategory }, [ //style: {color: colorCodeToHex[statCategoryColors[categoryName]]}
                        coloredStringToElement(categoryName),
                        React.createElement("span", { style: { color: "white" } }, `: ${numberFormatter(categorySum)}`)
                    ]),
                    React.createElement("br")
                )
            } else {
                elements.push(
                    React.createElement("li", { className: statStyles.statsCategory }, [
                        coloredStringToElement(categoryName),
                        React.createElement("span", { style: { color: "white" } }, `: ${numberFormatter(categorySum)}`)
                    ]),
                    React.createElement("ul", { className: statStyles.statValue }, categoryChildren),
                    React.createElement("br")
                )
            }

            sum += categorySum;
        }

        if (title) return [React.createElement("span", {}, title + (titleNumberFormatter !== undefined ? titleNumberFormatter(sum) : numberFormatter(sum))), React.createElement("ul", {}, elements)];

        return elements;
    }

    var children: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];

    var hasAdditiveBuff = !(sources[statName] === undefined || keys(sources[statName]).length === 0);
    var hasMultiplicativeBuff = sources["m_" + statName] !== undefined;

    if (hasAdditiveBuff)
        children.push(...elementsFromSource(sources[statName] || {}, num => statFormatter.format(num), hasMultiplicativeBuff ? "Additive: " : undefined));

    if (hasMultiplicativeBuff)
        children.push(...elementsFromSource(sources["m_" + statName] || {}, num => percentFormatter.format(num * 100) + "%", hasAdditiveBuff ? "Multiplicative: " : undefined, num => multiplierFormatter.format(num + 1) + "x"))

    if (!hasAdditiveBuff && !hasMultiplicativeBuff)
        children.push(React.createElement("h2", { style: { textAlign: "center", fontSize: "20px" } }, `This player has no ${statIdToStatName[statName] || "error"} :(`))

    return React.createElement("ul", {}, children);
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
    [key in Exclude<skillName, "dungeoneering">]?: skillExpInfos
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
    if (apiData.profileData === undefined) {
        console.error("profileData is undefined");
        return {};
    }

    var skills: allSkillExpInfo = {};

    for (let i = 0; i < keys(skillCaps).length; i++) {
        var name: skillName = keys(skillCaps)[i];

        if (name == "dungeoneering") continue;

        var skillExp: number = apiData.profileData.profiles[selectedProfile].members[playerUUID][skillNameToApiName[name] as keyof profileMember] as number;


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

//map of calculation id to stat info
export var calcTemp: {
    [key in string]: {
        stats: statsCategories,
        skills: allSkillExpInfo,
        other: {

        }
    }        
} = {};

//util to replace typing out multiplicative of every stat for sources like (edrag superior perk, superior set bonus, renowned reforge, etc)
export function allStatsBoost(amount: number): statsList {
    return multiplyStatsList({
        m_health: 1,
        m_defense: 1,
        m_strength: 1,
        m_intelligence: 1,
        m_critical_chance: 1,
        m_critical_damage: 1,
        m_attack_speed: 1,
        m_ability_damage: 1,
        m_true_defense: 1,
        m_ferocity: 1,
        m_walk_speed: 1,
        m_magic_find: 1,
        m_pet_luck: 1,
        m_sea_creature_chance: 1,
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

//multiple statsCategory
export type statsCategories = {
    [key in string]: statsCategory
}

//sources of stats
export type statSources = {
    [key in statName]?: { [key: string]: { [key: string]: number } }
};

//sums up a statSources into a statsList
export function sumStatsSources(sources: statSources): {capped: statsList, summed: statsList} {
    var stats: statsList = {};
    var m_stats: statsList = {};


    //adds them up
    for (let i in keys(sources)) {
        let statName: statName = keys(sources)[i];
        let statValue = sources[statName] || {};

        for (let j in keys(statValue)) {
            let categoryName = keys(statValue)[j];
            let categoryValue = statValue[categoryName];

            for (let k in keys(categoryValue)) {
                let sourceName = keys(categoryValue)[k];
                let sourceValue = categoryValue[sourceName];

                stats[statName] = (stats[statName] || 0) + sourceValue;
            }
        }
    }

    //multiplies them
    for (let i in keys(stats)) {
        let statName: statName = keys(stats)[i];
        let statValue: number = stats[statName] || 0;

        if (statName.startsWith("m_")) {
            var originalStatName: statName = statName.slice(2) as statName;

            m_stats[originalStatName] = statValue + 1;
        }
    }

    var summed = multiplyStatsList(stats, m_stats);
    var capped: statsList = {};

    for(let i in keys(defaultStatCaps)) {
        let statName = keys(defaultStatCaps)[i];

        if(summed[statName]) {
            var extraCap = 
                statName == "walk_speed" ? summed.c_walk_speed :
                0;

            capped[statName] = Math.min(summed[statName] || 0, defaultStatCaps[statName] || 0)+(extraCap || 0);
        }
    }

    return {capped, summed};
}


export function getStatSources(categories: statsCategories): statSources {
    var sources: any = {};

    for (let i in keys(categories)) {
        let categoryName: string = keys(categories)[i];
        let category: statsCategory = categories[categoryName];

        for (let j in keys(category)) {
            let listName: string = keys(category)[j];
            let list: statsList = category[listName];

            for (let k in keys(list)) {
                let statName: statName = keys(list)[k];
                let stat: number = list[statName] || 0;

                if (stat == 0 || stat === undefined) continue;


                if (!sources[statName]) sources[statName] = {};

                if (!sources[statName][categoryName]) sources[statName][categoryName] = {};

                sources[statName][categoryName][listName] = stat;
            }
        }
    }

    //for calculating pers
    var summedRaw = sumStatsSources(sources);

    var summed: statsList = {...summedRaw.summed, ...summedRaw.capped};

    // console.log(summed)

    //calculate pers
    for(let i in keys(sources)) { //for each stat in sources
        let stat: statName = keys(sources)[i] as statName;
        if(!stat.startsWith("p_")) continue; //if its not a per stat, continue

        // console.log(stat)

        let name = stat.slice("p_".length);

        var perGiving: string | number = name.split("_per_")[1].split("_")[0];
        var perRecieving: string | number = name.split("_")[0];

        if(perGiving == "X") perGiving = summed[stat] || 0;
        if(perRecieving == "X") perRecieving = summed[stat] || 0;

        perGiving = Number(perGiving);
        perRecieving = Number(perRecieving);

        var [recievingStat, givingStat] = name.replace(/.+?_/, "").split(/_per_.+?_/) as statName[];

        // console.log({perGiving, perRecieving, recievingStat, givingStat})

        //because there arent any ways to get multiple of a type of per stat, ill just treat it as only one
        //depth into sources (yes im good at variable naming)
        var depth1Name = keys(sources[stat])[0];
        var depth2Name = keys(sources[stat][depth1Name])[0];

        var gained = perRecieving*((summed[givingStat] || 0)/perGiving);

        if(!sources[recievingStat])
            sources[recievingStat] = {};

        if(!sources[recievingStat][depth1Name])
            sources[recievingStat][depth1Name] = {};

        if(!sources[recievingStat][depth1Name][depth2Name])
            sources[recievingStat][depth1Name][depth2Name] = gained;

        //for cases where we have 
        // * p_X_STAT1_per_1_STAT2
        // * p_X_STAT3_per_1_STAT1
        summed[recievingStat] = (summed[recievingStat] || 0)+gained;
    }

    //fill in (excludes special stats (m_, s_, p_, a_, l_, d_))
    for (let i in keys(statIdToStatName)) {
        var statName = keys(statIdToStatName)[i];

        if (sources[statName] === undefined) sources[statName] = {};
    }

    // console.log(sources);

    return sources;
}


export type itemStatSource = "hpbs" | "baseStats" | "starStats" | "enrichments" | "gemstones";

export const itemStatSourceNames: {
    [key in itemStatSource]: string
} = {
    hpbs: "Hot Potato Books",
    baseStats: "Base",
    starStats: "Stars",
    enrichments: "Enrichments",
    gemstones: "Gemstones"
}

export const itemStatSourceColors: {
    [key in itemStatSource]: colorCode
} = {
    hpbs: "6",
    baseStats: "f",
    starStats: "6",
    enrichments: "b",
    gemstones: "d"
}

export function calculateItemStats(item: nbtItem, baseItem: item, compact: boolean = false): statsCategory {
    var stats: statsCategory = {};

    // console.log(JSON.stringify(item));
    // console.log(JSON.stringify(baseItem));

    /*
    sources
        base stats (Y)
        gems (Y)
        reforge (Y)
        hpbs (Y)
        enchants (Y)
        art of peace (N)
        attributes (N)
    */


    var rarityUpgrades = item.tag.ExtraAttributes.rarity_upgrades;

    var rarity = tierStringToNumber(baseItem.tier || "COMMON") + (rarityUpgrades || 0);

    //base stats
    if (baseItem.stats) {
        stats.baseStats = itemStatsToStatsList(baseItem.stats || {});
    }

    //hpbs
    if (new Set(["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"]).has(baseItem.category)) { //its an armor piece
        stats.hpbs = {
            health: 4 * (item.tag.ExtraAttributes.hot_potato_count || 0),
            defense: 2 * (item.tag.ExtraAttributes.hot_potato_count || 0),
        }
    } else if (baseItem.category != "ACCESSORY") { //its probably some type of damager
        stats.hpbs = {
            strength: 2 * (item.tag.ExtraAttributes.hot_potato_count || 0),
        }
    }

    //reforge
    var reforge: string | undefined = item.tag.ExtraAttributes.modifier;

    if (reforge !== undefined && reforge !== "none" && baseItem.category !== "ACCESSORY") {
        if (reforgeStats[reforge] !== undefined) {
            stats[compact ? "reforge" : `${colorChar}5${reforge.capitalize()}`] = reforgeStats[reforge](Math.min(rarity, 5));
        } else {
            console.warn(`${reforge} reforge on ${item.tag.display.Name} is not in reforgeStats`);
        }
    }

    //enchants
    var enchantsList = item.tag.ExtraAttributes.enchantments || {};


    for (let i in keys(enchantsList)) {
        var enchantName: keyof typeof enchantStats = keys(enchantsList)[i] as string;
        if (!enchantName) continue;

        var enchantLevel = enchantsList[enchantName];


        if (enchantStats[enchantName] !== undefined) {
            var recievedEnchantStats = enchantStats[enchantName](enchantLevel); //variable naming :)

            var sourceName: string = compact ? "enchants" : `${colorChar}${statColors[keys(recievedEnchantStats)[0]] || "f"}${enchantName.replaceAll("_", " ").capitalize()} ${enchantLevel}`

            stats[sourceName] = mergeStatsLists(stats[sourceName] || {}, recievedEnchantStats);
        } else {
            // console.warn(`couldnt find enchant ${enchantName}`)
        }
    }

    //attributes
    var attributesList = item.tag.ExtraAttributes.attributes || {};

    for (let i in keys(attributesList)) {
        var attributeName: keyof typeof attributeStats = keys(attributesList)[i] as string;
        var attributeLevel: number = attributesList[attributeName];

        if (attributeStats[attributeName]) {
            var recievedAttributeStats = attributeStats[attributeName](attributeLevel);

            var sourceName: string = compact ? "attributes" : `${colorChar}${statColors[keys(recievedAttributeStats)[0]] || "f"}${attributeName.replaceAll("_", " ").capitalize()} ${attributeLevel}`

            stats[sourceName] = mergeStatsLists(stats[sourceName] || {}, recievedAttributeStats);
        } else {
            // console.warn(`couldnt find attribute ${attributeName}`);
        }
    }


    var gemstones: gemstoneSlots = {};
    var itemGems = item.tag.ExtraAttributes.gems;

    if (itemGems !== undefined) {
        for (let i in keys(itemGems)) { //for example: { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST', SAPPHIRE_0: 'FINE' }
            var key: string = keys(itemGems)[i] as string;
            var value: itemGemstoneSlotType | { uuid: string, quality: string } = itemGems[key];

            if (typeof value === "object") value = value["quality"]; //no idea why i have to use brackets but https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-never said so

            if (key == "unlocked_slots") continue;

            for (let j in specialGemstoneSlots) {
                if (key.includes(specialGemstoneSlots[j])) { //theres a pair of { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST' }
                    var entryType: "gemstone" | "tier" = key.includes("_gem") ? "gemstone" : "tier";
                    var gemstoneSlotName: itemGemstoneSlotType = (entryType == "gemstone" ? key.slice(0, -"_gem".length) : key) as itemGemstoneSlotType || "UNIVERSAL";


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

    for (let i in Object.values(gemstones)) {
        var gemInfo: { gemstone?: gemstone, tier?: gemstoneTier } = Object.values(gemstones)[i];

        if (gemInfo.gemstone === undefined) {
            console.warn("gemstone.gemstone was undefined");
            continue;
        }

        if (gemInfo.tier === undefined) {
            console.warn("gemstone.tier was undefined");
            continue;
        }

        var recievedStats = gemstoneStats[gemInfo.gemstone][gemInfo.tier](rarity); // :))))))))) variable naming

        if (baseItem.id == "POWER_ARTIFACT") recievedStats = multiplyStatsList(recievedStats, 0.5);

        var sourceName = compact ? "gemstones" : `${colorChar + rarityColors[gemstoneRarities[gemInfo.tier]]}${(gemInfo.tier as string).capitalize()} ${(gemInfo.gemstone as string).capitalize()} Gemstone`;

        stats[sourceName] = mergeStatsLists(stats[sourceName] || {}, recievedStats);
    }

    //star stats
    // okay so, this area was completely undocumented on the wiki so i had to figure it out myself :)

    // basically, the item gains extra stats based on star count.
    // for example, a hype has 30 base ferocity but if its 5 starred it gets 33 ferocity. same with every dungeon item.
    // extra = base stat * 0.1 * (stars / 5)

    // hope i got it right :D
    var starCount = Math.min(item.tag.ExtraAttributes.dungeon_item_level || 0, 5) //because master stars dont do it;
    stats.starStats = {};

    if (stats.baseStats) {
        for (let i in keys(stats.baseStats)) {
            var statName = keys(stats.baseStats)[i];
            var statValue = stats.baseStats[statName] || 0;

            stats.starStats[statName] = statValue * 0.1 * (starCount / 5);
        }
    }

    //enrichments
    var itemEnrichment = item.tag.ExtraAttributes.talisman_enrichment;

    if (itemEnrichment !== undefined) {
        stats.enrichments = {};

        stats.enrichments[itemEnrichment] = enrichmentStats[itemEnrichment as keyof typeof enrichmentStats];
    }

    //exceptions here
    /*
    
    exceptions include
        enchants
            bit shop enchants
        armor
            bulwark sets
        abilities
            equipment
                vanq magma necklace
                    needs research
                vanq glowstone gauntlet
                    needs research
                synthesizers
                    needs research
                vanq ghast cloak
                    needs research
                vanq blaze belt
                    needs research
        pets
            blaze hpb doubler
            flying fish magma lord armor buff
        accs
            day/night tali
            beastmaster crest
            pulse ring

    */

    // console.log(stats);

    return stats;
}


//calculates stats given from skill level ups
export async function calculateSkillStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return

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

    calcTemp[calcId].stats[colorChar+"6"+"Skills"] = stats;
}

export const fairySoulStats = {
    health: [0, 3, 6, 10, 14, 19, 24, 30, 36, 43, 50, 58, 66, 75, 84, 94, 104, 115, 126, 138, 150, 163, 176, 190, 204, 219, 234, 250, 266, 283, 300, 318, 336, 355, 374, 394, 414, 435, 456, 478, 500, 523, 546, 569, 592, 615, 638, 661],
    defense: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    strength: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55],
    speed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]
}

//yes i know they got revamped ill do that later
export async function calculateFairySoulStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsList> {
    if (!data.profileData) return {}

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
    if (!data.profileData) return;

    var mining_core = data.profileData.profiles[selectedProfile].members[playerUUID].mining_core;

    var stats: statsCategory = {};

    if (mining_core.nodes.mining_speed) stats["Mining Speed 1"] = { mining_speed: 20 * mining_core.nodes.mining_speed || 0 };
    if (mining_core.nodes.mining_fortune) stats["Mining Fortune 1"] = { mining_fortune: 5 * mining_core.nodes.mining_fortune || 0 };

    if (mining_core.nodes.mining_speed_2) stats["Mining Speed 2"] = { mining_speed: 40 * mining_core.nodes.mining_speed_2 || 0 };
    if (mining_core.nodes.mining_fortune_2) stats["Mining Fortune 2"] = { mining_fortune: 5 * mining_core.nodes.mining_fortune_2 || 0 };

    if (mining_core.nodes.mining_madness) stats["Mining Madness"] = { mining_speed: 50, mining_fortune: 50 };

    if (mining_core.nodes.mining_experience) stats["Seasoned Mineman"] = { mining_wisdom: 5 + 0.1 * mining_core.nodes.mining_experience || 0 }

    calcTemp[calcId].stats[colorChar+"5"+"HoTM"] = stats;
}

//calculates stats given from the wither essence shop
export async function calculateEssenceStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

    var perks = data.profileData.profiles[selectedProfile].members[playerUUID].perks;

    calcTemp[calcId].stats[colorChar+"7"+"Essence Shop"] = {
        "Forbidden Health": { health: (perks.permanent_health || 0) * 2 },
        "Forbidden Defense": { defense: (perks.permanent_defense || 0) * 1 },
        "Forbidden Speed": { walk_speed: (perks.permanent_speed || 0) * 1 },
        "Forbidden Intelligence": { intelligence: (perks.permanent_intelligence || 0) * 2 },
        "Forbidden Strength": { strength: (perks.permanent_strength || 0) * 1 },
    };
}

//calculates stats given from reaper peppers
export async function calculatePepperStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

    var peppers = data.profileData.profiles[selectedProfile].members[playerUUID].reaper_peppers_eaten;

    if (peppers == undefined) return;

    calcTemp[calcId].stats[colorChar+"c"+"Peppers"] = {peppers: {health: peppers}};
}


//calculates stats given from the harp
export async function calculateHarpStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

    var harp_quest = data.profileData.profiles[selectedProfile].members[playerUUID].harp_quest;

    if (keys(harp_quest).length == 0) return;

    var stats: statsCategory = {};

    for (let i = 0; i < keys(harpStats).length; i++) { //for each harp song
        var name = keys(harpStats)[i];

        var perfectCompletions = harp_quest["song_" + name + "_perfect_completions" as keyof typeof harp_quest]; //how many perfect completions the player has


        if (typeof perfectCompletions != "number") continue;

        stats[colorChar+harpColors[name]+name.replaceAll("_", " ").capitalize()] = { intelligence: (perfectCompletions >= 1 ? 1 : 0) * harpStats[name] };
    }

    calcTemp[calcId].stats[colorChar+"d"+"Harp"] = stats;
}


//calculates stats given from slayers
export async function calculateSlayerStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return {}

    var slayer_bosses = data.profileData.profiles[selectedProfile].members[playerUUID].slayer_bosses;

    var stats: statsCategory = {};
    var combatWisdomBuff = 0;

    for (let i = 0; i < keys(slayerStats).length; i++) { //for each slayer boss
        var name: slayerName = keys(slayerStats)[i];
        var info = slayer_bosses[name];

        var boss = slayer_bosses[name];

        var rewardedStats: statsList = {};
        var highestClaimed: number = keys(boss.claimed_levels).length == 0 ? 0 : 1; //highest level claimed

        for (let j = 0; j < 9; j++) { //for each level of it
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

    calcTemp[calcId].stats[colorChar+"2"+"Slayer"] = stats;
}

export interface accStatsInterface {
    taliStats: statsCategory,
    enrichments: statsCategory,
    magicPower: statsCategory,
    tuning: statsCategory,
    gems: statsCategory,
}

//calculates stats given from accessories
export async function calculateAccStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

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

    var inv = await parseContents(inv_raw) as IObjectKeys;
    if (inv.i === undefined) return;

    var taliContents: nbtItem[] = inv.i.concat(taliBag.i);
    taliContents = taliContents.filter(value => keys(value).length);

    var mp = 0;

    for (let i = 0; i < taliContents.length; i++) {
        var tali: nbtItem = taliContents[i];
        var itemAttributes = tali.tag.ExtraAttributes;
        var itemId = itemAttributes.id;

        var itemInfo = await itemIdToItem(itemId);
        if (itemInfo === undefined) {
            console.warn(`cant find item ${itemId}`);
            continue;
        }

        if (itemInfo.category !== "ACCESSORY") continue;

        var rarityIndex = tierStringToNumber(itemInfo.tier || "COMMON");

        var rarityUpgrades: number | undefined = itemAttributes.rarity_upgrades;
        var rarity: number = rarityIndex + (rarityUpgrades === undefined ? 0 : rarityUpgrades == 1 ? 1 : 0);

        var formattedName = (rarityUpgrades === undefined ? "" : rarityUpgrades == 1 ? "RECOMB" : "") + colorChar + Object.values(rarityColors)[rarity] + removeStringColors(itemInfo.name);

        var itemStats = calculateItemStats(tali, itemInfo, true);

        if(keys(itemStats.baseStats || {}).length > 0) stats.taliStats[formattedName] = itemStats.baseStats || {};
        if(keys(itemStats.enrichments || {}).length > 0) stats.enrichments[formattedName] = itemStats.enrichments || {};
        if(keys(itemStats.gemstones || {}).length > 0) stats.gems[formattedName] = itemStats.gemstones || {};

        mp += mpTable[keys(mpTable)[rarity]];
    }

    if (accessory_bag_storage.selected_power === undefined) {
        console.warn("no selected power");
        return stats;
    }

    var statsMultiplier = 29.97 * Math.pow((Math.log(0.0019 * mp + 1)), 1.2);

    if (keys(accPowers).findIndex(key => { return key == accessory_bag_storage.selected_power }) == -1) {
        console.error("couldnt find selected power");
        return stats;
    }

    var selectedPowerStats = accPowers[accessory_bag_storage.selected_power];

    stats.magicPower.magicPower = multiplyStatsList(selectedPowerStats.per, statsMultiplier);
    if (selectedPowerStats.extra) {
        stats.magicPower.magicPower = mergeStatsLists(stats.magicPower.magicPower, selectedPowerStats.extra || {});
    }

    stats.tuning.tuning = multiplyStatsList((accessory_bag_storage.tuning.slot_0 ? accessory_bag_storage.tuning.slot_0 : {}) as statsList, tuningValues)

    console.log({ mp, statsMultiplier });

    calcTemp[calcId].stats[colorChar+"9"+"Accessory Stats"] = stats.taliStats;
    calcTemp[calcId].stats[colorChar+"b"+"Accessory Enrichments"] = stats.enrichments;
    calcTemp[calcId].stats[colorChar+"e"+"Accessory Tuning"] = {SAME: stats.tuning.tuning};
    calcTemp[calcId].stats[colorChar+"d"+"Accessory Gems"] = stats.gems;
    calcTemp[calcId].stats[colorChar+"b"+"Magic Power"] = {SAME: stats.magicPower.magicPower};
}



//calculates stats given from potions
export async function calculatePotionStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return {};

    var active_effects = data.profileData.profiles[selectedProfile].members[playerUUID].active_effects;
    var disabled_effects = data.profileData.profiles[selectedProfile].members[playerUUID].disabled_potion_effects || [];

    var stats: statsCategory = {};

    for (let i in active_effects) {
        var effect = active_effects[i];

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
            stats.dungeon.health_regen = effectStats.regeneration([1, 2, 3, 3, 3, 4, 4][effect.level]).health_regen;

            stats.dungeon.strength = effectStats.strength([3, 3, 3, 4, 4, 4, 5][effect.level]).strength

            stats.dungeon.critical_chance = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_chance;
            stats.dungeon.critical_damage = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_damage;

            stats.dungeon.walk_speed = effectStats.speed([1, 2, 2, 2, 2, 3, 3][effect.level]).walk_speed;

            stats.dungeon.defense = effectStats.resistance([1, 1, 2, 2, 3, 3, 4][effect.level]).defense;

            continue;
        }

        var effectStatsList = effectStats[effect.effect](effect.level); //variable naming ;-;

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

                    effectStatsList.health_regen = effectStatsList.health_regen || 0;
                    effectStatsList.health_regen *= 1.05;
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

    calcTemp[calcId].stats[colorChar+"5"+"Potions"] = stats;
}

export interface cakeStatNumberToStat {
    [key: string]: statName
}


//calculates stats given from century cakes
export async function calculateCakeStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return {};

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

    calcTemp[calcId].stats[colorChar+"d"+"Century Cakes"] = {SAME: stats};
}

//calculates stats given from armor
export async function calculateArmorStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

    var inv_armor_raw = data.profileData.profiles[selectedProfile].members[playerUUID].inv_armor;

    var stats: statsCategories = {};

    var armor = await parseContents(inv_armor_raw) as IObjectKeys;
    if (armor.i === undefined) return;

    var armorContents: nbtItem[] = armor.i;


    for (let i in armorContents) {
        var piece: nbtItem = armorContents[i];

        var baseItem = await itemIdToItem(piece.tag.ExtraAttributes.id);
        if (!baseItem) {
            console.warn("piece baseItem is undefined");
            continue;
        }

        var category = baseItem.category;

        stats[piece.tag.display.Name] = calculateItemStats(piece, baseItem);

        calcTemp[calcId].stats[piece.tag.display.Name] = mapObjectKeys(
            stats[piece.tag.display.Name],
            value => itemStatSourceNames[value as itemStatSource] ?(colorChar+itemStatSourceColors[value as itemStatSource]+itemStatSourceNames[value as itemStatSource]) : value
        );
    }
}

//calculates stats given from equipment
export async function calculateEquipmentStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

    var equippment_contents_raw = data.profileData.profiles[selectedProfile].members[playerUUID].equippment_contents;

    var stats: statsCategories = {};

    var equipment = await parseContents(equippment_contents_raw) as IObjectKeys;
    if (equipment.i === undefined) return;

    var equipmentContents: nbtItem[] = equipment.i;


    for (let i in equipmentContents) {
        var piece: nbtItem = equipmentContents[i];

        if (keys(piece).length == 0) continue;

        var baseItem = await itemIdToItem(piece.tag.ExtraAttributes.id);
        if (!baseItem) {
            console.warn("piece baseItem is undefined");
            continue;
        }

        var category = baseItem.category;

        stats[piece.tag.display.Name] = calculateItemStats(piece, baseItem);

        calcTemp[calcId].stats[piece.tag.display.Name] = mapObjectKeys(
            stats[piece.tag.display.Name],
            value => itemStatSourceNames[value as itemStatSource] ?(colorChar+itemStatSourceColors[value as itemStatSource]+itemStatSourceNames[value as itemStatSource]) : value
        );
    }
}


//calculates stats given from pet score
export async function calculatePetScoreStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string) {
    if (!data.profileData) return;

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

    calcTemp[calcId].stats[colorChar + "b"+"Pet Score (" + petScore + ")"] = {SAME: {magic_find: mf}};
}

//calculates stats given from current pet
export async function calculatePetStats(data: apiData, selectedProfile: number, playerUUID: string, specialData: specialPetData, calcId: string) {
    if (!data.profileData) return;

    var pets = data.profileData.profiles[selectedProfile].members[playerUUID].pets;

    var equippedPet: pet | undefined = undefined;

    var stats: statsCategory = {
        base: {}
    };

    for(let i = 0; i < pets.length; i++) {
        if(pets[i].active == true) {
            equippedPet = pets[i];
            
            break;
        }
    }

    if(equippedPet === undefined) {
        console.warn("no equipped pet");

        return;
    }

    equippedPet = {
        exp: 79200000, //from deathstreeks
        tier: "LEGENDARY",
        type: "BABY_YETI",
        active: true,
        heldItem: "MINOS_RELIC",
        candyUsed: 0,
        uuid: "",
        skin: "",
    }

    var recivedStats: petStatInfo = petStats[equippedPet.type];
    var petLevel = petToLevel(equippedPet);

    var baseStats = recivedStats.base(petLevel, equippedPet.tier);

    
    for(let j in keys(recivedStats.perks)) {
        var perk: string = keys(recivedStats.perks)[j] as string;

        var hasPerk: boolean = tierStringToNumber(equippedPet.tier) >= tierStringToNumber(recivedStats.perks[perk].tier);
        
        if(!hasPerk) continue;

        stats[perk] = recivedStats.perks[perk].stats(petLevel, equippedPet.tier, specialData)
    }

    if(equippedPet.heldItem) {
        var petItemName = petItemNames[equippedPet.heldItem];

        petItemName = petItemNames[equippedPet.heldItem];

        stats[petItemName] = {};

        if(equippedPet.heldItem == "MINOS_RELIC") {
            stats[petItemName] = multiplyStatsList(baseStats, 1/3);
        } else if(equippedPet.heldItem == "PET_ITEM_QUICK_CLAW") {
            stats[petItemName] = {mining_speed: petLevel, mining_fortune: petLevel};
        } else {
            var heldItemStats = petItemStats[equippedPet.heldItem] || {};

            for(let i in keys(heldItemStats)) {
                let name: statName = keys(heldItemStats)[i];

                if(name.startsWith("m_")) {
                    var realName: statName = name.slice("m_".length) as statName;

                    stats[petItemName][realName] = (baseStats[realName] || 0) * (heldItemStats[name] || 0);
                } else {
                    stats[petItemName][name] = (heldItemStats[name] || 0)
                }
            }
        }
    }

    // console.log(stats);

    stats.Base = baseStats;

    calcTemp[calcId].stats[colorChar+rarityColors[equippedPet.tier]+equippedPet.type.replaceAll("_", " ").capitalize()+colorChar+"f"+` (${petLevel})`] = stats;
}


export async function calculateStats(data: apiData, selectedProfile: number, playerUUID: string, calcId: string): Promise<statsCategories> {
    calcTemp[calcId].stats["Base Stats"] = {SAME: baseStats};

    if(!data.profileData) return calcTemp[calcId].stats;

    var specialPetData: specialPetData = {
        goldCollection: data.profileData.profiles[selectedProfile].members[playerUUID].collection.GOLD_INGOT || 0,
        bankCoins: data.profileData.profiles[selectedProfile].banking?.balance || 0,
        skills: {
            fishing: Math.floor(calcTemp[calcId].skills.fishing?.levelInfo.level || 0),
            mining: Math.floor(calcTemp[calcId].skills.mining?.levelInfo.level || 0),
        },
        hotm: hotmExpToLevel(data.profileData.profiles[selectedProfile].members[playerUUID].mining_core.experience || 0)
    };

    await calculatePetStats(data, selectedProfile, playerUUID, specialPetData, calcId);
    await calculateSkillStats(data, selectedProfile, playerUUID, calcId);
    await calculateHotmStats(data, selectedProfile, playerUUID, calcId);
    await calculateEssenceStats(data, selectedProfile, playerUUID, calcId);
    await calculatePepperStats(data, selectedProfile, playerUUID, calcId);
    await calculateHarpStats(data, selectedProfile, playerUUID, calcId)
    await calculateSlayerStats(data, selectedProfile, playerUUID, calcId);
    await calculateAccStats(data, selectedProfile, playerUUID, calcId);
    await calculatePotionStats(data, selectedProfile, playerUUID, calcId);
    await calculateCakeStats(data, selectedProfile, playerUUID, calcId);
    await calculateArmorStats(data, selectedProfile, playerUUID, calcId);
    await calculateEquipmentStats(data, selectedProfile, playerUUID, calcId);
    await calculatePetScoreStats(data, selectedProfile, playerUUID, calcId);

    return calcTemp[calcId].stats


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
            bestiary milestone
            slayers (Y)
            harp intelligence (Y)

        temp effects
            cake souls (Y)
            potions (M)
            booster cookie

        pets
            pet stats
            pet items
            pet score (Y)
            
        pickable
            wither esssence shop (Y)
            hotm (M)
            
        misc 
            peppers (Y)
            fairy souls
            community shop upgrades
    */
}