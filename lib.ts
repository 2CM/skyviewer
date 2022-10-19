import nbt from "prismarine-nbt";
import React from "react";
import { promisify } from "util";
import { apiData } from "./pages/profile/[profileName]";
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
String.prototype.capitalize = function(split: boolean = true) {
    if(split) return this.split(" ").map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");

    return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

//compacts a number and adds suffixes like K, M, B
Number.prototype.compact = function() {
    var formatter = Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    return formatter.format(Number(this));
}

//maps values of an object
function mapObjectKeys<Type extends object>(obj: Type, callbackfn: (value: keyof Type, index: number, array: any[]) => string): Type {
    var newObj: Type | any = {};

    for(let i = 0; i < keys(obj).length; i++) {
        var name = keys(obj)[i];
        var newName = callbackfn(name, i, keys(obj))

        newObj[newName] = obj[name as keyof typeof obj];
    }

    return newObj
}

//maps values of an object
function mapObjectValues<Type extends object>(obj: Type, callbackfn: (value: Type[keyof Type], index: number, array: any[]) => Type[keyof Type]): Type {
    var newObj: Type | any = {};

    for(let i = 0; i < keys(obj).length; i++) {
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

export function tierStringToNumber(string: itemTier): number {
    var index = keys(mpTable).findIndex(tier => {return string == tier});

    return index == -1 ? 0 : index;
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

//converts item id (found in nbt) -> item
export async function itemIdToItem(id: string): Promise<item | undefined> {
    if(itemsIndex.size == 0) return undefined; //its not initiated

    var correctId = itemIdReplacements.get(id) || id;

    var location = itemsIndex.get(correctId); //index of id in items[]

    if(location == undefined) return undefined; //item id prob doesnt exist

    return items[location];
}

//initiates itemIdToItem system
export async function initItems(data: apiData) {
    if(itemsIndex.size != 0) { //guard so we dont do it again
        console.warn("items already inited");

        return;
    }

    console.log("initing items")

    if(data.itemsData === undefined) { //couldnt get the itemsData from the apiData
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

        if(newName == "ability_damage_percent") newName = "ability_damage";
    
        stats[newName as statName] = itemStats[name as keyof typeof itemStats];
    }

    return stats;
}

// *** MISC ***


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
    for(let i = 0; i < string.length; i++) {
        var currentStringChar = string[i];

        if(currentStringChar == colorChar) {
            primedForCode = true;
            continue;
        }

        if(primedForCode) {
            if(new Set(keys(colorCodeToHex)).has(currentStringChar as colorCode)) { //its a color
                color = currentStringChar as colorCode;
            } else { //its a modifer or something else that i dont want to deal with
                modifier = currentStringChar;
            }

            primedForCode = false;

            continue;
        }

        chars.push({char: currentStringChar, color: color, modifier: modifier});
    }

    //segments
    for(let i = 0; i < chars.length; i++) {
        var currentChar = chars[i];
        var lastChar: coloredStringToElementChar = i == 0 ? {char: "none", color: "none" as colorCode, modifier: "none"} : chars[i-1]

        if(
            currentChar.color == lastChar.color &&
            currentChar.modifier == lastChar.modifier
        ) {
            segments[segments.length-1].chars += currentChar.char;
        } else {
            segments.push(
                {color: currentChar.color, modifier: currentChar.modifier, chars: currentChar.char}
            )
        }
    }

    for(let i = 0; i < segments.length; i++) {
        var currentSegment = segments[i];

        var style: React.CSSProperties = {
            color: colorCodeToHex[currentSegment.color],
        }

        switch(currentSegment.modifier) {
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

        children.push(React.createElement(element, {style}, currentSegment.chars))
    }

    return React.createElement(parentElement, {}, children)
}


//converts stat sources to an element for stat sources popups
export function sourcesToElement(sources: any, statName: statName) {
    //elements from the sources of one specific stat
    function elementsFromSource(currentSources: any, numberFormatter: (num: number) => string, title?: string, titleNumberFormatter?: (num: number) => string): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] {
        if(keys(currentSources).length == 0) {
            return []
        }

        var elements: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];

        var sum = 0;

        for(let i in keys(currentSources)) {
            var categoryName: statSource = keys(currentSources)[i] as statSource;
            var category = currentSources[categoryName];
    
            var categoryChildren: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];
    
            var categorySum = 0;

            var lastSourceName: string = "inital value :)";
            var lastSource: number = -1;

            for(let j in keys(category)) {
                var sourceName = keys(category)[j] as string;
                var source: number = category[sourceName];
    
                var formattedName = sourceName + "";
    
                // var color: string = "unset";
                var hasRecomb: boolean = false;
    
                if(formattedName.startsWith("RECOMB")) {
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
                            hasRecomb ? React.createElement("img", {src: recombEmoji, style: {height: "1em", width: "auto"}}, null) : null,
                            coloredStringToElement(` ${formattedName}`),
                            React.createElement("span", {style: {color: "white"}}, `: ${numberFormatter(source)}`)
                        ]
                    )
                );
            }
    
            if(keys(category).length == 1 && lastSourceName == categoryName) {
                elements.push(
                    React.createElement("li", {className: statStyles.statsCategory}, [ //style: {color: colorCodeToHex[statCategoryColors[categoryName]]}
                        coloredStringToElement(`${
                            statCategoryNames[categoryName] === undefined ? categoryName : colorChar+statCategoryColors[categoryName]+statCategoryNames[categoryName]
                        }`),
                        React.createElement("span", {style: {color: "white"}}, `: ${numberFormatter(categorySum)}`)
                    ]),
                    React.createElement("br")
                )

                sum += categorySum;
    
                continue;
            }
    
            elements.push(
                React.createElement("li", {className: statStyles.statsCategory}, [
                    coloredStringToElement(`${
                        statCategoryNames[categoryName] === undefined ? categoryName : colorChar+statCategoryColors[categoryName]+statCategoryNames[categoryName]
                    }`),
                    React.createElement("span", {style: {color: "white"}}, `: ${numberFormatter(categorySum)}`)
                ]),
                React.createElement("ul", {className: statStyles.statValue}, categoryChildren),
                React.createElement("br")
            )

            sum += categorySum;
        }

        if(title) return [React.createElement("span", {}, title+ (titleNumberFormatter !== undefined ? titleNumberFormatter(sum) : numberFormatter(sum))), React.createElement("ul", {}, elements)];
    
        return elements;
    }

    var children: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] = [];

    var hasAdditiveBuff = !(sources[statName] === undefined || keys(sources[statName]).length === 0);
    var hasMultiplicativeBuff = sources["m_"+statName] !== undefined;

    if(hasAdditiveBuff)
        children.push(...elementsFromSource(sources[statName] || {}, num => statFormatter.format(num), hasMultiplicativeBuff ? "Additive: " : undefined));

    if(hasMultiplicativeBuff)
        children.push(...elementsFromSource(sources["m_"+statName] || {}, num => percentFormatter.format(num*100)+"%", hasAdditiveBuff ? "Multiplicative: " : undefined, num => multiplierFormatter.format(num+1)+"x"))

    if(!hasAdditiveBuff && !hasMultiplicativeBuff)
        children.push(React.createElement("h2", {style: {textAlign: "center", fontSize: "20px"}}, `This player has no ${statIdToStatName[statName] || "error"} :(`))

    return React.createElement("ul", {}, children);
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

// *** PROFILES ***

//gets the most recently played profile of player
export function getMostRecentProfile(profiles: baseProfile[], playerUUID: string): number {
    for(let i = 0; i < profiles.length; i++) {
        if(profiles[i].selected === true) return i; 
    }

    return -1;
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
type effectName = //missing ones that dont give you stats. ill add them later or something
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
    effect: keyof typeof effectStats,
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
    type: string,
    exp: number,
    active: boolean,
    tier: itemTier,
    heldItem: string | null,
    candyUsed: number,
    skin: string | null
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

//gets the exp required to level up past 60 from skillExtrapolation map
export function getSkillExtrapolation(skill: skillName): number {
    if(skill == "dungeoneering") return skillExtrapolation.dungeoneering;
    if(skill == "runecrafting") return skillExtrapolation.runecrafting;
    if(skill == "social") return skillExtrapolation.social;

    var skillCap = skillCaps[skill];

    return skillCap == 60 ? skillExtrapolation.experience60 : skillExtrapolation.experience50;
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

    var min = skillLeveling[skillType][lowerBoundIndex]; //current level
    var max = skillLeveling[skillType][lowerBoundIndex + 1]; //next level

    var toLevelUp = max-min;

    var level = lowerBoundIndex + ((exp - min) / (max - min)); //level as a decimal. 26.5 = level 26 and half way to 27 
    var decimal = level - Math.floor(level);

    return {
        level, //level
        index: lowerBoundIndex, //index in skillLeveling (level)
        toLevelUp, //how much exp is needed to level up
        progress: decimal*toLevelUp
    }
}

//calculates all the data you need for skill exp stuff
export function calculateAllSkillExp(apiData: apiData, selectedProfile: number, playerUUID: string): allSkillExpInfo {
    if(apiData.profileData === undefined) {
        console.error("profileData is undefined");
        return {};
    } 

    var skills: allSkillExpInfo = {};

    for (let i = 0; i < keys(skillCaps).length; i++) {
		var name: skillName = keys(skillCaps)[i];

		if(name == "dungeoneering") continue;

		var skillExp: number = apiData.profileData.profiles[selectedProfile].members[playerUUID][skillNameToApiName[name] as keyof profileMember] as number;


		skills[name] = {
			skillExp: skillExp,
			levelInfo: skillExpToLevel(skillExp, name),
			extrapolatedLevelInfo: skillExpToLevel(skillExp, name, true),
		};
	}

    return skills;
}

// *** STATS ***

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
    "m_mending";

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

        if(fill == false && list1value+list2value == 0) continue;

        newList[key] = list1value+list2value;
    }

    return newList;
}

//merges 2 or more stats lists
export function addStatsLists(arr: statsList[], fill: boolean = false): statsList {
    if(arr.length < 2) {
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

    for(let i = 0; i < keys(list).length; i++) {
        var name = keys(list)[i];

        var statValue = list[name];

        if(statValue === undefined) {
            console.warn("multiplyStatsList: statValue === undefined");

            statValue = 0;
        }

        if(typeof mult == "number") {
            stats[name] = statValue*mult;
        } else if(typeof mult == "object") {
            var multiplier = mult[name];

            stats[name] = statValue*(multiplier || 1);
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
    [key in statName]?: {[key: string]: {[key: string]: number}}
};

//sums up a statSources into a statsList
export function sumStatsSources(sources: statSources): statsList {
    var stats: statsList = {};
    var m_stats: statsList = {};


    //adds them up
    for(let i in keys(sources)) {
        let statName: statName = keys(sources)[i];
        let statValue = sources[statName] || {};

        for(let j in keys(statValue)) {
            let categoryName = keys(statValue)[j];
            let categoryValue = statValue[categoryName];

            for(let k in keys(categoryValue)) {
                let sourceName = keys(categoryValue)[k];
                let sourceValue = categoryValue[sourceName];
                
                stats[statName] = (stats[statName] || 0) + sourceValue;
            }
        }
    }

    //multiplies them
    for(let i in keys(stats)) {
        let statName: statName = keys(stats)[i];
        let statValue: number = stats[statName] || 0;

        if(statName.startsWith("m_")) {
            var originalStatName: statName = statName.slice(2) as statName;

            m_stats[originalStatName] = statValue+1;
        }
    }

    return multiplyStatsList(stats, m_stats);
}


export function getStatSources(categories: statsCategories): statSources {
    var sources: any = {};

    // var correctedMultipliers: statsList = {}; //to add +1 to every multiplier so a 5% (0.05) multiplier would be a 1.05 multiplier 

    for(let i in keys(categories)) {
        var categoryName: string = keys(categories)[i];
        var category: statsCategory = categories[categoryName];

        for(let j in keys(category)) {
            var listName: string = keys(category)[j];
            var list: statsList = category[listName];

            for(let k in keys(list)) {
                var statName: statName = keys(list)[k];
                var stat: number = list[statName] || 0;

                if(stat == 0 || stat === undefined) continue;

                
                if(!sources[statName]) sources[statName] = {};

                if(!sources[statName][categoryName]) sources[statName][categoryName] = {};

                sources[statName][categoryName][listName] = stat;
            }
        }
    }

    for(let i in keys(statIdToStatName)) {
        var statName = keys(statIdToStatName)[i];

        if(sources[statName] === undefined) sources[statName] = {};
    }

    // console.log(sources);

    return sources;
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

export type itemStatSource = "hpbs" | "reforge" | "baseStats" | "starStats" | "enrichments" | "gemstones";

export const itemStatSourceNames: {
    [key in itemStatSource]: string
} = {
    hpbs: "Hot Potato Books",
    reforge: "Reforge",
    baseStats: "Base Value",
    starStats: "Stars",
    enrichments: "Enrichments",
    gemstones: "Gemstones"
}

export const itemStatSourceColors: {
    [key in itemStatSource]: colorCode
} = {
    hpbs: "6",
    reforge: "5",
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
   if(baseItem.stats) {
        stats.baseStats = itemStatsToStatsList(baseItem.stats || {});
    }

    //hpbs
    if(new Set(["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"]).has(baseItem.category)) { //its an armor piece
        stats.hpbs = {
            health: 4*(item.tag.ExtraAttributes.hot_potato_count || 0),
            defense: 2*(item.tag.ExtraAttributes.hot_potato_count || 0),
        }
    } else if(baseItem.category != "ACCESSORY") { //its probably some type of damager
        stats.hpbs = {
            strength: 2*(item.tag.ExtraAttributes.hot_potato_count || 0),
        }
    }
    
    //reforge
    var reforge: string | undefined = item.tag.ExtraAttributes.modifier;

    if(reforge !== undefined && reforge !== "none" && baseItem.category !== "ACCESSORY") {
        if(reforgeStats[reforge] !== undefined) {
            stats[compact ? "reforge" : `${colorChar}5${reforge.capitalize()}`] = reforgeStats[reforge](Math.min(rarity, 5));
        } else {
            console.warn(`${reforge} reforge on ${item.tag.display.Name} is not in reforgeStats`);
        }
    }

    //enchants
    var enchantsList = item.tag.ExtraAttributes.enchantments || {};

    
    for(let i in keys(enchantsList)) {
        var enchantName: keyof typeof enchantStats = keys(enchantsList)[i] as string;
        if(!enchantName) continue;

        var enchantLevel = enchantsList[enchantName];


        if(enchantStats[enchantName] !== undefined) {
            var recievedEnchantStats = enchantStats[enchantName](enchantLevel); //variable naming :)

            var sourceName: string = compact ? "enchants" : `${colorChar}b${enchantName.replaceAll("_", " ").capitalize()} ${enchantLevel}`

            stats[sourceName] = mergeStatsLists(stats[sourceName] || {}, recievedEnchantStats);
        } else {
            // console.warn(`couldnt find enchant ${enchantName}`)
        }
    }

    //attributes
    var attributesList = item.tag.ExtraAttributes.attributes || {};

    for(let i in keys(attributesList)) {
        var attributeName: keyof typeof attributeStats = keys(attributesList)[i] as string;
        var attributeLevel: number = attributesList[attributeName];

        if(attributeStats[attributeName]) {
            var recievedAttributeStats = attributeStats[attributeName](attributeLevel);

            var sourceName: string = compact ? "attributes" : `${colorChar}b${attributeName.replaceAll("_", " ").capitalize()} ${attributeLevel}`

            stats[sourceName] = mergeStatsLists(stats[sourceName] || {}, recievedAttributeStats);
        } else {
            // console.warn(`couldnt find attribute ${attributeName}`);
        }
    }

    
    var gemstones: gemstoneSlots = {};
    var itemGems = item.tag.ExtraAttributes.gems;

    if(itemGems !== undefined) {
        for(let i in keys(itemGems)) { //for example: { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST', SAPPHIRE_0: 'FINE' }
            var key: string = keys(itemGems)[i] as string;
            var value: itemGemstoneSlotType | {uuid: string, quality: string} = itemGems[key];

            if(typeof value === "object") value = value["quality"]; //no idea why i have to use brackets but https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-never said so

            if(key == "unlocked_slots") continue;

            for(let j in specialGemstoneSlots) {
                if(key.includes(specialGemstoneSlots[j])) { //theres a pair of { COMBAT_0: 'FINE', COMBAT_0_gem: 'AMETHYST' }
                    var entryType: "gemstone" | "tier" = key.includes("_gem") ? "gemstone" : "tier";
                    var gemstoneSlotName: itemGemstoneSlotType = (entryType == "gemstone" ? key.slice(0, -"_gem".length) : key) as itemGemstoneSlotType || "UNIVERSAL";

                    
                    if(entryType == "gemstone") { //its the gemstone in the slot
                        if(gemstones[gemstoneSlotName] === undefined) gemstones[gemstoneSlotName] = {};

                        gemstones[gemstoneSlotName].gemstone = value.toLowerCase() as gemstone;
                    } else if(entryType == "tier") { //its the tier of it
                        if(gemstones[gemstoneSlotName] === undefined) gemstones[gemstoneSlotName] = {};
    
                        gemstones[gemstoneSlotName].tier = value.toLowerCase() as gemstoneTier;
                    }

                    break;
                } else {
                    gemstones[key] = {gemstone: key.slice(0, -"_0".length).toLowerCase() as gemstone, tier: value.toLowerCase() as gemstoneTier}

                    break;
                }
            }
        }
    }
    
    for(let i in Object.values(gemstones)) {
        var gemInfo: {gemstone?: gemstone, tier?: gemstoneTier} = Object.values(gemstones)[i];
        
        if(gemInfo.gemstone === undefined) {
            console.warn("gemstone.gemstone was undefined");
            continue;
        }

        if(gemInfo.tier === undefined) {
            console.warn("gemstone.tier was undefined");
            continue;
        }

        var recievedStats = gemstoneStats[gemInfo.gemstone][gemInfo.tier](rarity); // :))))))))) variable naming

        if(baseItem.id == "POWER_ARTIFACT") recievedStats = multiplyStatsList(recievedStats, 0.5);

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
    
    if(stats.baseStats) {
        for(let i in keys(stats.baseStats)) {
            var statName = keys(stats.baseStats)[i];
            var statValue = stats.baseStats[statName] || 0;
            
            stats.starStats[statName] = statValue * 0.1 * (starCount / 5);
        }
    }

    //enrichments
    var itemEnrichment = item.tag.ExtraAttributes.talisman_enrichment;

    if(itemEnrichment !== undefined) {
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

    */

    // console.log(stats);

    return stats;
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

//calculates stats given from skill level ups
export async function calculateSkillStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var stats: statsCategory = {};
    
    for (let i = 0; i < keys(skillCaps).length; i++) { //for each skill
        let name: skillName = keys(skillCaps)[i] as skillName;

        if(name == "dungeoneering") continue;
        if(skillLevelStats[name as keyof typeof skillLevelStats] === undefined) continue;

        var levelInfo = skillExpToLevel(data.profileData.profiles[selectedProfile].members[playerUUID][skillNameToApiName[name] as keyof profileMember] as number || 0, name)

        stats[colorChar+skillColors[name]+name.capitalize()+" "+Math.floor(levelInfo.level)] = skillLevelStats[name](Math.floor(levelInfo.level))
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
export async function calculateFairySoulStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsList> {
    if(!data.profileData) return {}

    var exchanges = data.profileData.profiles[selectedProfile].members[playerUUID].fairy_exchanges;

    if(exchanges === undefined) return {};


    return {
        health: fairySoulStats.health[exchanges],
        defense: fairySoulStats.defense[exchanges],
        strength: fairySoulStats.strength[exchanges],
        walk_speed: fairySoulStats.speed[exchanges],
    }
}

//NEEDS MORE TESTING; havent accounted for toggles and interface is probably wrong because i cant test around right now
export async function calculateHotmStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var mining_core = data.profileData.profiles[selectedProfile].members[playerUUID].mining_core;

    var stats: statsCategory = {};

    if(mining_core.nodes.mining_speed) stats["Mining Speed 1"] = {mining_speed: 20*mining_core.nodes.mining_speed || 0};
    if(mining_core.nodes.mining_fortune) stats["Mining Fortune 1"] = {mining_fortune: 5*mining_core.nodes.mining_fortune || 0};

    if(mining_core.nodes.mining_speed_2) stats["Mining Speed 2"] = {mining_speed: 40*mining_core.nodes.mining_speed_2 || 0};
    if(mining_core.nodes.mining_fortune_2) stats["Mining Fortune 2"] = {mining_fortune: 5*mining_core.nodes.mining_fortune_2 || 0};

    if(mining_core.nodes.mining_madness) stats["Mining Madness"] = {mining_speed: 50, mining_fortune: 50};

    if(mining_core.nodes.mining_experience) stats["Seasoned Mineman"] = {mining_wisdom: 5+0.1*mining_core.nodes.mining_experience || 0}

    return stats;
}

//calculates stats given from the wither essence shop
export async function calculateEssenceStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var perks = data.profileData.profiles[selectedProfile].members[playerUUID].perks;

    return {
        "Forbidden Health": {health: (perks.permanent_health || 0)*2},
        "Forbidden Defense": {defense: (perks.permanent_defense || 0)*1},
        "Forbidden Speed": {walk_speed: (perks.permanent_speed || 0)*1},
        "Forbidden Intelligence": {intelligence: (perks.permanent_intelligence || 0)*2},
        "Forbidden Strength": {strength: (perks.permanent_strength || 0)*1},
    }
}

//calculates stats given from reaper peppers
export async function calculatePepperStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var peppers = data.profileData.profiles[selectedProfile].members[playerUUID].reaper_peppers_eaten;

    if(peppers == undefined) return {};

    return {
        peppers: {health: peppers}
    }
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

//calculates stats given from the harp
export async function calculateHarpStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var harp_quest = data.profileData.profiles[selectedProfile].members[playerUUID].harp_quest;

    if(keys(harp_quest).length == 0) return {};

    var stats: statsCategory = {};

    for (let i = 0; i < keys(harpStats).length; i++) { //for each harp song
        var name = keys(harpStats)[i];

        var perfectCompletions = harp_quest["song_"+name+"_perfect_completions" as keyof typeof harp_quest]; //how many perfect completions the player has


        if(typeof perfectCompletions != "number") continue;

        stats[name] = {intelligence: (perfectCompletions >= 1 ? 1 : 0) * harpStats[name]};
    }

    return stats;
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

//calculates stats given from slayers
export async function calculateSlayerStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {}

    var slayer_bosses = data.profileData.profiles[selectedProfile].members[playerUUID].slayer_bosses;

    var stats: statsCategory = {};
    var combatWisdomBuff = 0;

    for (let i = 0; i < keys(slayerStats).length; i++) { //for each slayer boss
        var name: slayerName = keys(slayerStats)[i];
        var info = slayer_bosses[name];

        var boss = slayer_bosses[name];

        var rewardedStats: statsList = {};
        var highestClaimed: number = keys(boss.claimed_levels).length == 0 ? 0 : 1; //highest level claimed

        for(let j = 0; j < 9; j++) { //for each level of it
            var claimed = boss.claimed_levels["level_"+j as keyof typeof boss.claimed_levels] !== undefined || boss.claimed_levels["level_"+j+"_special" as keyof typeof boss.claimed_levels] !== undefined; //if you claimed the level reward
            if(!claimed) continue; //if you didnt, continue

            var levelStats: statsList = slayerStats[name][j-1]; //stats of the claimed level

            rewardedStats = mergeStatsLists(rewardedStats, levelStats);
            highestClaimed = j;
        }

        stats[colorChar+slayerColors[name]+name.capitalize()+" "+highestClaimed] = rewardedStats;
        
        for(let j = 0; j < 4; j++) {
            if(info["boss_kills_tier_"+j as keyof typeof info] !== undefined) {
                combatWisdomBuff += j < 3 ? 1 : 2;
            }
        }
    }

    stats[colorChar+"3"+"Global Combat Wisdom Buff"] = {combat_wisdom: combatWisdomBuff}

    return stats;
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

export interface accStatsInterface {
    taliStats: statsCategory,
    enrichments: statsCategory,
    magicPower: statsCategory,
    tuning: statsCategory,
    gems: statsCategory,
}

//calculates stats given from accessories
export async function calculateAccStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<accStatsInterface | undefined> {
    if(!data.profileData) return;

    var talisman_bag_raw = data.profileData.profiles[selectedProfile].members[playerUUID].talisman_bag;
    var inv_raw = data.profileData.profiles[selectedProfile].members[playerUUID].inv_contents
    var accessory_bag_storage = data.profileData.profiles[selectedProfile].members[playerUUID].accessory_bag_storage;

    if(!talisman_bag_raw) return;

    var stats: accStatsInterface = {
        taliStats: {},
        enrichments: {},
        magicPower: {},
        tuning: {},
        gems: {},
    };

    var taliBag = await parseContents(talisman_bag_raw) as IObjectKeys;
    if(taliBag.i === undefined) return;

    var inv = await parseContents(inv_raw) as IObjectKeys;
    if(inv.i === undefined) return;

    var taliContents: nbtItem[] = inv.i.concat(taliBag.i);
    taliContents = taliContents.filter(value => keys(value).length);

    var mp = 0;
    
    for (let i = 0; i < taliContents.length; i++) {
        var tali: nbtItem = taliContents[i];
        var itemAttributes = tali.tag.ExtraAttributes;
        var itemId = itemAttributes.id;

        var itemInfo = await itemIdToItem(itemId);
        if(itemInfo === undefined) {
            console.warn(`cant find item ${itemId}`);
            continue;
        }

        if(itemInfo.category !== "ACCESSORY") continue;

        var rarityIndex = tierStringToNumber(itemInfo.tier || "COMMON");

        var rarityUpgrades: number | undefined = itemAttributes.rarity_upgrades;
        var rarity: number = rarityIndex + (rarityUpgrades === undefined ? 0 : rarityUpgrades == 1 ? 1 : 0);

        var formattedName = (rarityUpgrades === undefined ? "" : rarityUpgrades == 1 ? "RECOMB" : "") + colorChar + Object.values(rarityColors)[rarity] + removeStringColors(itemInfo.name);

        var itemStats = calculateItemStats(tali, itemInfo, true)

        stats.taliStats[formattedName] = itemStats.baseStats || {};
        stats.enrichments[formattedName] = itemStats.enrichments || {};
        stats.gems[formattedName] = itemStats.gemstones || {};

        mp += mpTable[keys(mpTable)[rarity]];
    }

    if(accessory_bag_storage.selected_power === undefined) {
        console.warn("no selected power");
        return stats;
    }

    var statsMultiplier = 29.97 * Math.pow((Math.log(0.0019 * mp + 1)), 1.2);

    if(keys(accPowers).findIndex(key => {return key == accessory_bag_storage.selected_power}) == -1) {
        console.error("couldnt find selected power");
        return stats;
    }
    
    var selectedPowerStats = accPowers[accessory_bag_storage.selected_power];

    stats.magicPower.magicPower = multiplyStatsList(selectedPowerStats.per, statsMultiplier);
    if(selectedPowerStats.extra) {
        stats.magicPower.magicPower = mergeStatsLists(stats.magicPower.magicPower, selectedPowerStats.extra || {});
    }

    stats.tuning.tuning = multiplyStatsList((accessory_bag_storage.tuning.slot_0 ? accessory_bag_storage.tuning.slot_0 : {}) as statsList, tuningValues)

    console.log({mp, statsMultiplier});

    return stats;
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


//calculates stats given from potions
export async function calculatePotionStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {};

    var active_effects = data.profileData.profiles[selectedProfile].members[playerUUID].active_effects;
    var disabled_effects = data.profileData.profiles[selectedProfile].members[playerUUID].disabled_potion_effects || [];

    var stats: statsCategory = {};

    for(let i in active_effects) {
        var effect = active_effects[i];

        if(typeof effectStats[effect.effect] !== "function") {
            console.warn(`${effect.effect} is not a function`);
            continue;
        }

        if(new Set(disabled_effects).has(effect.effect)) {
            console.warn(`${effect.effect} has been disabled`);
            continue;
        }

        if(effect.effect == "coldfusion" && false) { //coldfusion only works when a wisp is equipped. this is the gaurd for it. ill make it work when i do pet stuffs
            continue;
        }

        if(effect.effect == "dungeon") {
            stats.dungeon.health_regen = effectStats.regeneration([1, 2, 3, 3, 3, 4, 4][effect.level]).health_regen;

            stats.dungeon.strength = effectStats.strength([3, 3, 3, 4, 4, 4, 5][effect.level]).strength

            stats.dungeon.critical_chance = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_chance;
            stats.dungeon.critical_damage = effectStats.critical([1, 1, 2, 2, 3, 3, 3][effect.level]).critical_damage;

            stats.dungeon.walk_speed = effectStats.speed([1, 2, 2, 2, 2, 3, 3][effect.level]).walk_speed;

            stats.dungeon.defense = effectStats.resistance([1, 1, 2, 2, 3, 3, 4][effect.level]).defense;

            continue;
        }

        var effectStatsList = effectStats[effect.effect](effect.level); //variable naming ;-;

        for(let j in effect.modifiers) {
            var modifier = effect.modifiers[j];

            switch(modifier.key) { //because there are some modifers that increase stat on effect by a percentage
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

        stats[`${effect.effect} ${effect.level}`] = effectStatsList;
    }

    return stats;
}

export interface cakeStatNumberToStat {
    [key: string]: statName
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

//calculates stats given from century cakes
export async function calculateCakeStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {};

    var temp_stat_buffs = data.profileData.profiles[selectedProfile].members[playerUUID].temp_stat_buffs;

    if(!temp_stat_buffs) return {};

    var stats: statsList = {};

    for(let i in temp_stat_buffs) {
        var statBuff = temp_stat_buffs[i];
        var cakeStat = statBuff.key.slice("cake_".length) as statName;

        if(cakeStats[cakeStat] !== undefined) {
            stats[cakeStat] = cakeStats[cakeStat];
        }
    }

    return {cake: stats}
}

//calculates stats given from armor
export async function calculateArmorStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategories> {
    if(!data.profileData) return {};

    var inv_armor_raw = data.profileData.profiles[selectedProfile].members[playerUUID].inv_armor;

    var stats: statsCategories = {};

    var armor = await parseContents(inv_armor_raw) as IObjectKeys;
    if(armor.i === undefined) return {};

    var armorContents: nbtItem[] = armor.i;


    for(let i in armorContents) {
        var piece: nbtItem = armorContents[i];

        var baseItem = await itemIdToItem(piece.tag.ExtraAttributes.id);
        if(!baseItem) {
            console.warn("piece baseItem is undefined");
            continue;
        }

        var category = baseItem.category;

        stats[piece.tag.display.Name] = calculateItemStats(piece, baseItem);
    }

    return stats;
}

//calculates stats given from equipment
export async function calculateEquipmentStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategories> {
    if(!data.profileData) return {};

    var equippment_contents_raw = data.profileData.profiles[selectedProfile].members[playerUUID].equippment_contents;

    var stats: statsCategories = {};

    var equipment = await parseContents(equippment_contents_raw) as IObjectKeys;
    if(equipment.i === undefined) return {};

    var equipmentContents: nbtItem[] = equipment.i;


    for(let i in equipmentContents) {
        var piece: nbtItem = equipmentContents[i];

        if(keys(piece).length == 0) continue;

        var baseItem = await itemIdToItem(piece.tag.ExtraAttributes.id);
        if(!baseItem) {
            console.warn("piece baseItem is undefined");
            continue;
        }

        var category = baseItem.category;

        stats[piece.tag.display.Name] = calculateItemStats(piece, baseItem);
    }

    return stats;
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

//calculates stats given from pet score
export async function calculatePetScoreStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategory> {
    if(!data.profileData) return {};

    var pets = data.profileData.profiles[selectedProfile].members[playerUUID].pets;

    var petScore = 0;
    var uniquePets = new Map<string, number>();
    var mf = 0; //magic find

    for(let i in pets) {
        var pet = pets[i];

        var rarity: number = tierStringToNumber(pet.tier)+1;
        var lastRarity: number = uniquePets.get(pet.type) || 0; //if the pet is already in the map, its rarity. if not, 0

        uniquePets.set(pet.type, Math.max(lastRarity, rarity))
    }

    petScore = [...uniquePets.values()].reduce((prev, curr) => prev+curr, 0);

    for(let i in petScores) {
        let num = petScores[i];

        if(petScore < num) break;

        mf++;
    }

    var stats: statsCategory = {};

    stats[colorChar+"bPet Score ("+petScore+")"] = {magic_find: mf};

    return stats;
}

//calculates stats given from current pet
export async function calculatePetStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategories> {
    return {};
}

export const statCategoryNames = {
    base: "Base",
    skills: "Skills",
    hotm: "HoTM",
    essence: "Essence Shop",
    peppers: "Reaper Peppers",
    harp: "Harp",
    slayer: "Slayer",
    taliStats: "Accessory Stats",
    gems: "Accessory Gems",
    magicPower: "Magic Power",
    tuning: "Tuning",
    enrichments: "Enrichments",
    potions: "Effects",
    cake: "Cake",
}

export type statSource = keyof typeof statCategoryNames;

export const statCategoryColors: {[key in statSource]: colorCode} = {
    base: "f",
    skills: "6",
    hotm: "5",
    essence: "7",
    peppers: "c",
    harp: "d",
    slayer: "2",
    taliStats: "9",
    gems: "d",
    magicPower: "b",
    tuning: "e",
    enrichments: "b",
    potions: "5",
    cake: "d",
}

export async function calculateStats(data: apiData, selectedProfile: number, playerUUID: string): Promise<statsCategories> {
    // return {base: {base: baseStats}, gamer: {yes: {m_health: 1.05}}};

    var returnValue: statsCategories = {
        base: {base: baseStats},
        skills: await calculateSkillStats(data, selectedProfile, playerUUID),
        hotm: await calculateHotmStats(data, selectedProfile, playerUUID),
        essence: await calculateEssenceStats(data, selectedProfile, playerUUID),
        peppers: await calculatePepperStats(data, selectedProfile, playerUUID),
        harp: mapObjectKeys(
            await calculateHarpStats(data, selectedProfile, playerUUID), value => colorChar+(harpColors[value as harpSong] || "f")+(harpNames[value as harpSong] || value)
        ),
        slayer: await calculateSlayerStats(data, selectedProfile, playerUUID),
        ...await calculateAccStats(data, selectedProfile, playerUUID),
        potions: mapObjectKeys(
            await calculatePotionStats(data, selectedProfile, playerUUID), value => colorChar+(effectColors[value.slice(0,-2) as effectName] || value)+value.replaceAll("_", " ").capitalize()
        ),
        cake: mapObjectKeys(
            await calculateCakeStats(data, selectedProfile, playerUUID), value => value
            ),
        ...(mapObjectValues(await calculateArmorStats(data, selectedProfile, playerUUID), value => mapObjectKeys(value, value => (itemStatSourceNames[value as itemStatSource] || value) === undefined ? value : colorChar+(itemStatSourceColors[value as itemStatSource] || "f")+(itemStatSourceNames[value as itemStatSource] || value)))),
        ...(mapObjectValues(await calculateEquipmentStats(data, selectedProfile, playerUUID), value => mapObjectKeys(value, value => (itemStatSourceNames[value as itemStatSource] || value) === undefined ? value : colorChar+(itemStatSourceColors[value as itemStatSource] || "f")+(itemStatSourceNames[value as itemStatSource] || value)))),
        ...await calculatePetStats(data, selectedProfile, playerUUID)
    }
    
    var petScore = await calculatePetScoreStats(data, selectedProfile, playerUUID);
    returnValue[keys(petScore)[0] || "error"] = petScore;

    return returnValue;


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
    */
}