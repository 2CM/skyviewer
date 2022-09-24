import { getSkillType, skillCaps, skillExpToLevel, skillLeveling } from "../lib";
import type { skillName, skillType } from "../lib";
import { useContext, useRef, useState } from "react";
import { dataContext } from "../pages/_app";
import Image from "next/image";
import styles from "../styles/skillLevel.module.css";
import utilStyles from "../styles/utils.module.css";


interface props {
    //skillExp: number,
    skillName: skillName
}

export default function SkillLevel({skillName}: props) {
    var skillExp = useContext(dataContext).mining;
    
    var levelInfo = skillExpToLevel(skillExp, skillName);
    var extrapolatedLevelInfo = skillExpToLevel(skillExp, skillName, true);


    var [expDisplay, setExpDisplay] = useState(`${Math.round(levelInfo.progress).compact()}/${Math.round(levelInfo.toLevelUp).compact()}`);
    var [expDisplayPrecise, setExpDisplayPrecise] = useState(`${Math.round(levelInfo.progress).addCommas()}/${Math.round(levelInfo.toLevelUp).addCommas()}`);

    //var totalDisplay = `${skillExp.compact()}`;
    //var totalDisplayPrecise = `${skillExp.addCommas()}`


    var [percentage, setPercentage] = useState(levelInfo.level-Math.floor(levelInfo.level) || (levelInfo.level == 60 ? 1 : 0));
    var complete = levelInfo.level >= 60;


    var skillLevelRef = useRef<HTMLInputElement>(null);
    var imageContainerRef = useRef<HTMLInputElement>(null);
    var progressBarRef = useRef<HTMLInputElement>(null);

    var skillExpRef = useRef<HTMLInputElement>(null);
    var skillExpPreciseRef = useRef<HTMLInputElement>(null);

    /*
    if(progressBarRef.current && skillLevelRef.current) {
        var widthInPx = skillLevelRef.current.clientWidth * percentage

        progressBarRef.current.style.width = `${widthInPx-(22*percentage==0?0:1)}px`;

        if(complete) progressBarRef.current.style.width = `${skillLevelRef.current.clientWidth}px`;
    }
    */

    var [displayType, setDisplayType] = useState(1);
    const displayTypes = ["progress", "total", "extrapolated"];

    var changeDisplayType = () => {
        var currentDisplayType = displayType % displayTypes.length;

        setDisplayType(displayType+1);

        console.log(displayType, currentDisplayType)

        switch(currentDisplayType) {
            case 0: //progress
                setExpDisplay(`${Math.round(levelInfo.progress).compact()}/${Math.round(levelInfo.toLevelUp).compact()}`);
                setExpDisplayPrecise(`${Math.round(levelInfo.progress).addCommas()}/${Math.round(levelInfo.toLevelUp).addCommas()}`);

                setPercentage(levelInfo.level-Math.floor(levelInfo.level) || (levelInfo.level == 60 ? 1 : 0));
            break;
            case 1: //total
                setExpDisplay(skillExp.compact());
                setExpDisplayPrecise(skillExp.addCommas());
            break;
            case 2: //extrapolated
                setExpDisplay(`${Math.round(extrapolatedLevelInfo.progress).compact()}/${Math.round(extrapolatedLevelInfo.toLevelUp).compact()}`);
                setExpDisplayPrecise(`${Math.round(extrapolatedLevelInfo.progress).addCommas()}/${Math.round(extrapolatedLevelInfo.toLevelUp).addCommas()}`);

                setPercentage(extrapolatedLevelInfo.level-Math.floor(extrapolatedLevelInfo.level))
            break;
        }

        console.log("changing display type")
    }

    return (
        <div ref={skillLevelRef} className={styles.skillLevel}>
            <div className={styles.infoContainer}>
                <div className={styles.name}>
                    {skillName.capitalize()} <b>{Math.floor(levelInfo.level)} <span className={utilStyles.grayed}>({Math.floor(extrapolatedLevelInfo.level)}) ({displayTypes[(displayType-1) % displayTypes.length].capitalize()})</span></b>
                </div>
                <div className={styles.skillBarContainer}>
                    <div className={styles.before}></div>
                    <div className={styles.skillBar}>
                        <div ref={progressBarRef} style={{width: `calc(${Math.floor(percentage*100)}% + ${22 * (percentage == 0 ? 0 : 1)}px)`}} className={`${styles.skillBarProgress} ${complete ? styles.skillComplete : ""}`}></div>
                        <div className={styles.skillBarText} onClick={changeDisplayType}>
                            <div ref={skillExpRef} className={styles.skillBarExp}>{expDisplay} XP</div>
                            <div ref={skillExpPreciseRef} className={styles.skillBarExpPrecise}>{expDisplayPrecise} XP</div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={imageContainerRef} className={`${styles.imageContainer} ${complete ? styles.skillComplete : ""}`}>
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