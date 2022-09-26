import { getSkillType, profileMember, skillCaps, skillExpInfo, skillExpToLevel, skillLeveling, skillNameToApiName } from "../lib";
import type { skillName, skillType } from "../lib";
import { useContext, useRef, useState } from "react";
import { dataContext } from "../pages/profile/[profileName]";
import Image from "next/image";
import styles from "../styles/skillLevel.module.css";
import utilStyles from "../styles/utils.module.css";

//import type { dataContextInterface } from "../pages/profile/[profileName]"
interface props {
    //skillExp: number,
    skillName: skillName
}

interface expDisplay {
    display: string,
    displayPrecise: string,
    percentage: number
}

function getExpDisplay(displayType: number, levelInfo: skillExpInfo, extrapolatedLevelInfo: skillExpInfo, decimals: number, skillExp: number, isMaxLevel: boolean): expDisplay {
    var display: string;
    var displayPrecise: string;
    var percentage: number;

    switch(displayType) {
        default:
            display = "error"
            displayPrecise = "also error"
            percentage = 0;
        break;
        case 0: //progress
            display = `${Math.round(levelInfo.progress).compact()} / ${Math.round(levelInfo.toLevelUp).compact()}`;
            displayPrecise = `${Math.round(levelInfo.progress).addCommas(decimals)} / ${Math.round(levelInfo.toLevelUp).addCommas(decimals)}`;

            percentage = levelInfo.level-Math.floor(levelInfo.level) || (isMaxLevel ? 1 : 0);
        break;
        case 1: //total
            display = skillExp.compact();
            displayPrecise = skillExp.addCommas(decimals);

            percentage = 1;
        break;
        case 2: //extrapolated
            display = `${Math.round(extrapolatedLevelInfo.progress).compact()} / ${Math.round(extrapolatedLevelInfo.toLevelUp).compact()}`;
            displayPrecise = `${Math.round(extrapolatedLevelInfo.progress).addCommas(decimals)} / ${Math.round(extrapolatedLevelInfo.toLevelUp).addCommas(decimals)}`;

            percentage = extrapolatedLevelInfo.level-Math.floor(extrapolatedLevelInfo.level)
        break;
    }

    return {
        display: display,
        displayPrecise: displayPrecise,
        percentage: percentage
    }
}

export default function SkillLevel({skillName}: props) {
    var dataContextData = useContext(dataContext);

    if(!dataContextData.data) return <></>;

    var skillExp: number = dataContextData.data.apiData.profiles[dataContextData.data.selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"][skillNameToApiName[skillName]];

    var [displayType, setDisplayType] = useState(1);
    var displayTypes = ["progress", "total", "extrapolated"];

    var levelInfo = skillExpToLevel(skillExp, skillName);
    var extrapolatedLevelInfo: skillExpInfo;

    var isMaxLevel = levelInfo.toLevelUp == 0;
    
    if(isMaxLevel) {
        extrapolatedLevelInfo = skillExpToLevel(skillExp, skillName, true);
    } else {
        extrapolatedLevelInfo = levelInfo;
        displayTypes.pop();
    }

    const decimals = 1;


    var changeDisplayType = () => {
        var currentDisplayType = displayType % displayTypes.length;

        setDisplayType(displayType+1);

        console.log(displayType, currentDisplayType)

        var newDisplay = getExpDisplay(currentDisplayType, levelInfo, extrapolatedLevelInfo, decimals, skillExp, isMaxLevel);

        setExpDisplay(newDisplay.display);
        setExpDisplayPrecise(newDisplay.displayPrecise);
        setPercentage(newDisplay.percentage);

        console.log("changing display type")
    }

    var initialDisplay = getExpDisplay(0, levelInfo, extrapolatedLevelInfo, decimals, skillExp, isMaxLevel);

    var [expDisplay, setExpDisplay] = useState(initialDisplay.display);
    var [expDisplayPrecise, setExpDisplayPrecise] = useState(initialDisplay.displayPrecise);


    var [percentage, setPercentage] = useState(initialDisplay.percentage);


    return (
        <div className={styles.skillLevel}>
            <div className={styles.infoContainer}>
                <div className={styles.name}>
                    {skillName.capitalize()} <b>{Math.floor(levelInfo.level)} <span className={utilStyles.grayed}>{isMaxLevel ? `(${Math.floor(extrapolatedLevelInfo.level)})` : ""} ({displayTypes[(displayType-1) % displayTypes.length].capitalize()})</span></b>
                </div>
                <div className={styles.skillBarContainer}>
                    <div className={styles.before}></div>
                    <div className={styles.skillBar}>
                        <div style={{width: `calc(${Math.floor(percentage*100)}% + ${22 * (percentage == 0 ? 0 : 1)}px)`}} className={`${styles.skillBarProgress} ${isMaxLevel ? styles.skillComplete : ""}`}></div>
                        <div className={styles.skillBarText} onClick={changeDisplayType}>
                            <div className={styles.skillBarExp}>{expDisplay} XP</div>
                            <div className={styles.skillBarExpPrecise}>{expDisplayPrecise} XP</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.imageContainer} ${isMaxLevel ? styles.skillComplete : ""}`}>
                <Image src={""} className={styles.image}></Image>
            </div>
        </div>
    )
}

/*
<div ref={skillLevelRef} className={styles.skillLevel}>
            <div className={styles.imageContainer}>
                <Image src={""} className={styles.image}></Image>
            </div>
            <div className={styles.skillNameContainer}>
                <div ref={nameBarRef} className={styles.skillNameProgress}></div>
                <div className={styles.skillName}>
                    {skillName.capitalize()} <b>{levelInfo.level.toFixed(0)}</b>
                </div>
            </div>
            <div className={styles.skillBarContainer}>
                <div className={styles.name}>Mining <b>60</b></div>
                <div ref={progressBarRef} className={styles.skillBarProgress}></div>
                <div className={styles.skillBarText}>
                    <div className={styles.skillBarTextRatio}>{expDisplay}</div>
                    <div className={styles.skillBarTextTotal}>{expDisplayPrecise}</div>
                    </div>
                    </div>
                </div>
*/