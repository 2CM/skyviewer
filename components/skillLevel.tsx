import { skillExpInfo, skillExpInfos} from "../lib";
import type { skillName } from "../lib";
import Image from "next/image";
import styles from "../styles/skillLevel.module.css";
import utilStyles from "../styles/utils.module.css";

interface props {
    skillExpInfos: skillExpInfos,
    skillName: skillName,
    onChangeDisplayType: () => void,
    displayType: number,
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

export default function SkillLevel({skillExpInfos, skillName, onChangeDisplayType, displayType}: props) {
    var displayTypes = ["progress", "total", "extrapolated"];

    var isMaxLevel = skillExpInfos.levelInfo.toLevelUp == 0;

    var displayInfo = getExpDisplay(
        (displayType-1) % displayTypes.length,
        skillExpInfos.levelInfo,
        skillExpInfos.extrapolatedLevelInfo,
        1,
        skillExpInfos.skillExp,
        isMaxLevel
    );

    return (
        <div className={styles.skillLevel}>
            <div className={styles.infoContainer}>
                <div className={styles.name}>
                    {skillName.capitalize()} <b>{Math.floor(skillExpInfos.levelInfo.level)} <span className={utilStyles.grayed}>{isMaxLevel ? `(${Math.floor(skillExpInfos.extrapolatedLevelInfo.level)})` : ""} ({displayTypes[(displayType-1) % displayTypes.length].capitalize()})</span></b>
                </div>
                <div className={styles.skillBarContainer}>
                    <div className={styles.before}></div>
                    <div className={styles.skillBar}>
                        <div style={{width: `calc(${Math.floor(displayInfo.percentage*100)}% + ${22 * (displayInfo.percentage == 0 ? 0 : 1)}px)`}} className={`${styles.skillBarProgress} ${isMaxLevel ? styles.skillComplete : ""}`}></div>
                        <div className={styles.skillBarText} onClick={onChangeDisplayType}>
                            <div className={styles.skillBarExp}>{displayInfo.display} XP</div>
                            <div className={styles.skillBarExpPrecise}>{displayInfo.displayPrecise} XP</div>
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