import { getSkillType, skillCaps, skillExpInfo, skillExpToLevel, skillLeveling } from "../lib";
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

export default function SkillLevel({skillName}: props) {
    var dataContextData = useContext(dataContext);

    if(!dataContextData.data) return <></>;

    var skillExp = dataContextData.data.apiData.profiles[dataContextData.data.selectedProfile].members["86a6f490bf424769a625a266aa89e8d0"].experience_skill_mining;

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

    const addCommasDecimals = 1;


    var changeDisplayType = () => {
        var currentDisplayType = displayType % displayTypes.length;

        setDisplayType(displayType+1);

        console.log(displayType, currentDisplayType)

        switch(currentDisplayType) {
            case 0: //progress
                setExpDisplay(`${Math.round(levelInfo.progress).compact()} / ${Math.round(levelInfo.toLevelUp).compact()}`);
                setExpDisplayPrecise(`${Math.round(levelInfo.progress).addCommas(addCommasDecimals)} / ${Math.round(levelInfo.toLevelUp).addCommas(addCommasDecimals)}`);

                setPercentage(levelInfo.level-Math.floor(levelInfo.level) || (isMaxLevel ? 1 : 0));
            break;
            case 1: //total
                setExpDisplay(skillExp.compact());
                setExpDisplayPrecise(skillExp.addCommas(addCommasDecimals));
            break;
            case 2: //extrapolated
                setExpDisplay(`${Math.round(extrapolatedLevelInfo.progress).compact()} / ${Math.round(extrapolatedLevelInfo.toLevelUp).compact()}`);
                setExpDisplayPrecise(`${Math.round(extrapolatedLevelInfo.progress).addCommas(addCommasDecimals)} / ${Math.round(extrapolatedLevelInfo.toLevelUp).addCommas(addCommasDecimals)}`);

                setPercentage(extrapolatedLevelInfo.level-Math.floor(extrapolatedLevelInfo.level))
            break;
        }

        console.log("changing display type")
    }

    var [expDisplay, setExpDisplay] = useState(`${Math.round(levelInfo.progress).compact()} / ${Math.round(levelInfo.toLevelUp).compact()}`);
    var [expDisplayPrecise, setExpDisplayPrecise] = useState(`${Math.round(levelInfo.progress).addCommas(addCommasDecimals)} / ${Math.round(levelInfo.toLevelUp).addCommas(addCommasDecimals)}`);


    var [percentage, setPercentage] = useState(levelInfo.level-Math.floor(levelInfo.level) || (isMaxLevel ? 1 : 0));


    var skillLevelRef = useRef<HTMLInputElement>(null);
    var imageContainerRef = useRef<HTMLInputElement>(null);
    var progressBarRef = useRef<HTMLInputElement>(null);

    var skillExpRef = useRef<HTMLInputElement>(null);
    var skillExpPreciseRef = useRef<HTMLInputElement>(null);

    

    return (
        <div ref={skillLevelRef} className={styles.skillLevel}>
            <div className={styles.infoContainer}>
                <div className={styles.name}>
                    {skillName.capitalize()} <b>{Math.floor(levelInfo.level)} <span className={utilStyles.grayed}>{isMaxLevel ? `(${Math.floor(extrapolatedLevelInfo.level)})` : ""} ({displayTypes[(displayType-1) % displayTypes.length].capitalize()})</span></b>
                </div>
                <div className={styles.skillBarContainer}>
                    <div className={styles.before}></div>
                    <div className={styles.skillBar}>
                        <div ref={progressBarRef} style={{width: `calc(${Math.floor(percentage*100)}% + ${22 * (percentage == 0 ? 0 : 1)}px)`}} className={`${styles.skillBarProgress} ${isMaxLevel ? styles.skillComplete : ""}`}></div>
                        <div className={styles.skillBarText} onClick={changeDisplayType}>
                            <div ref={skillExpRef} className={styles.skillBarExp}>{expDisplay} XP</div>
                            <div ref={skillExpPreciseRef} className={styles.skillBarExpPrecise}>{expDisplayPrecise} XP</div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={imageContainerRef} className={`${styles.imageContainer} ${isMaxLevel ? styles.skillComplete : ""}`}>
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