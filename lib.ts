declare global {
    interface String {
        capitalize(): string
    }
    interface Number {
        compact(): string,
        addCommas(): string,
    }
}

String.prototype.capitalize = function() {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

Number.prototype.addCommas = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

export function getSkillExtrapolation(skill: skillName) {
    if(skill == "dungeoneering") return skillExtrapolation.dungeoneering;
    if(skill == "runecrafting") return skillExtrapolation.dungeoneering;
    if(skill == "social") return skillExtrapolation.dungeoneering;

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