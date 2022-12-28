import React from "react";
import { useEffect } from "react"
import { categorizedFlippedStats, statSourceToElement, keys, statFormatter, statType, formatStat} from "../lib";
import { statName, statColors, statChars, statIdToStatName, colorCodeToHex, baseStatName } from "../sbconstants";
import styles from "../styles/stat.module.css";

type line = {key: string, value: number, depth: number, isContainer: boolean};

let lines: (line | "break")[] = [];

function checkPushBreak() {
    if(lines[lines.length-1] != "break") lines.push("break");
}

function recur(obj: any, path: string[]): number {
    let groupSum = 0;

    for(let i in keys(obj)) {
        let key: string = keys(obj)[i] as string;
        let value: any | number = obj[key];

        //path with the current key attached to it
        let extendedPath = [...path, key];

        lines.push({key, value: 0, depth: path.length, isContainer: false});
        
        let lineIndex = lines.length - 1;
        
        
        let contribution = 0;

        if(typeof value === "object") {
            //its another group

            (lines[lineIndex] as line).isContainer = true;

            contribution = recur(value, extendedPath);
        } else if(typeof value == "number") {
            //its the end

            contribution = value;
        }
        
        //add either (the sum of the subgroups) or (the value)
        (lines[lineIndex] as line).value = contribution;
        
        groupSum += contribution;

        if(path.length == 0) checkPushBreak();
    }

    checkPushBreak();

    return groupSum;
}

function statDataToElement(statData: categorizedFlippedStats, statName: baseStatName) {
    let elements: React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] = [];

    for(let i in keys(statData)) {
        let statType = keys(statData)[i];

        let statTypeData = statData[statType];
        if(statTypeData === undefined || statTypeData[statName] === undefined) continue;

        console.log(statType)

        lines = [];

        recur(statTypeData[statName], []);

        // let lines = JSON.stringify(statTypeData[statName], null, "^")
        //     .replaceAll(/["{},]/g, "")
        //     .split("\n")
        //     .slice(1, -1)

        console.log(lines)

        for(let j in lines) {
            // let indentsCount = lines[j].split("").filter(char => char == "^").length - 1; // - 1 because each type adds an indent
            // let indentsRemoved = lines[j].slice(indentsCount + 1)

            // if(indentsRemoved == "") {
            //     elements.push(<br/> as typeof elements[number]

            //     continue;
            // }

            if(lines[j] === "break") {
                elements.push(<br/> as typeof elements[number]);

                continue;
            }

            // lines[j] = lines[j] as line;

            //i hate it too but typescript still thought it was a line | "break"
            let sourceName = (lines[j] as line).key;
            let sourceValue = (lines[j] as line).value;
            let depth = (lines[j] as line).depth;
            let isContainer = (lines[j] as line).isContainer;

            // let isContainer = Number(sourceValue) === NaN || Number(sourceValue) === 0;

            elements.push(
                <div style={{marginLeft: `${(depth + 1)*36}px`}}>
                    {statSourceToElement(sourceName + ":")} {formatStat(sourceValue, statType)}
                </div> as typeof elements[number]
            );
        }
    }

    if(elements.length == 0) {
        elements.push(<h2 style={{ textAlign: "center", fontSize: "20px" }}>{`This player has no ${statIdToStatName[statName] || "error"} :(`}</h2> as typeof elements[number])
    }

    elements.unshift(<br/> as typeof elements[number]);

    return elements
}

interface props {
    onClose: Function,
    visible: boolean,
    statData: categorizedFlippedStats,
    statName: baseStatName,
    evaluated: number,
}

export default function StatsPopUp({onClose, visible, statData, statName, evaluated}: props) {
    var close = () => onClose();

    // console.log(statData)

    var keyupFunction = (e: KeyboardEvent) => {if(e.key == "Escape") close()};

    useEffect(() => {
        window.removeEventListener("keyup", keyupFunction);
        window.addEventListener("keyup", keyupFunction);


        if(visible) {
            document.body.style.overflowY = "scroll";
            document.body.style.position = "fixed";
        }

        return () => {
            document.body.style.overflowY = "unset";
            document.body.style.position = "unset";
        }
    })

    return (
        <>
            {
                visible ?
                    <div className={styles.popup}>
                        <div className={styles.popupBackground} onClick={close}/>
                        <div className={styles.popupBoxContainer}>
                            <main className={styles.popupContainer} style={{outlineColor: colorCodeToHex[statColors[statName] || "f"]}}>
                                <div className={styles.popupNameContainer}>
                                    <h2 className={styles.popupName} style={{color: colorCodeToHex[statColors[statName] || "f"]}}>{statChars[statName]} {statIdToStatName[statName]} <span style={{color: "white"}}>{statFormatter.format(evaluated)}</span></h2>
                                </div>
                                <main className={styles.popupContent}>
                                    {statDataToElement(statData, statName)}
                                </main>
                                <div className={styles.popupFooter}>
                                    <a
                                        href={"https://hypixel-skyblock.fandom.com/wiki/"+statName.replaceAll("_", " ").capitalize().replaceAll(" ", "_")}
                                        target="_blank"
                                    >

                                        <div style={{textDecorationColor: "white"}}>More info / ways to gain</div>
                                        <div>
                                            <b style={{color: colorCodeToHex[statColors[statName] || "f"], textDecorationColor: colorCodeToHex[statColors[statName] || "f"]}}>{statChars[statName]} {statIdToStatName[statName]}</b>
                                        </div>
                                    </a>
                                </div>
                            </main>
                        </div>
                        <div className={styles.popupClose} onClick={close}>
                            <span style={{}}>{"X"}</span>
                        </div>
                    </div> : null
            }
        </>
    )
}