import React from "react";
import { useEffect } from "react"
import { categorizedFlippedStats, formattedStringToElement, keys, statFormatter, statType, formatStat, categorizedCompressedStats, values, statTags} from "../lib";
import { statName, statColors, statChars, statIdToStatName, colorCodeToHex, baseStatName, colorChar } from "../sbconstants";
import styles from "../styles/stat.module.css";
import Indent from "./indent";

type line = {key: string, value: number, depth: number};
function isLine(val: any): val is line {return val.key !== undefined && val.value !== undefined}

type tag = {value: string, depth: number}
function isTag(val: any): val is line {return val.value !== undefined}

let lines: (line | "break" | tag)[] = [];

function checkPushBreak() {
    if(lines[lines.length-1] != "break") lines.push("break");
}

function recur(obj: any, path: string[], tags: statTags): number {
    let groupSum = 0;

    for(let i in keys(obj)) {
        let key: string = keys(obj)[i] as string;
        let value: any | number = obj[key];

        //path with the current key attached to it
        let extendedPath = [...path, key];

        lines.push({key, value: 0, depth: path.length});
        
        let lineIndex = lines.length - 1;
        
        let contribution = 0;

        if(typeof value === "object") {
            //its another group

            contribution = recur(value, extendedPath, tags);
        } else if(typeof value == "number") {
            //its the end

            contribution = value;
        }
        
        //add either (the sum of the subgroups) or (the value)
        (lines[lineIndex] as line).value = contribution;
        
        groupSum += contribution;

        if(path.length == 0) checkPushBreak();
    }

    loop1: for(let i in tags) {
        let tag = tags[i];

        if(path.length == tags[i].path.length) {
            for(let j in tag.path) {
                if(!path[j].includes(tag.path[j])) continue loop1
            }

            console.log(path, tags[i])

            checkPushBreak();

            lines.push({depth: path.length, value: tags[i].value});
        }
    }

    checkPushBreak();

    return groupSum;
}

function statDataToElement(statData: categorizedFlippedStats, statName: baseStatName, compressedStatData: categorizedCompressedStats, tags: statTags) {
    let elements: JSX.Element[] = [];

    let statTypeElements: {
        [key in statType]: JSX.Element[]
    } = {
        flat: [],
        additive: [],
        multiplicative: [],
        cap: [],
        limit: []
    }
    
    //for each type of stat
    for(let i in keys(statData)) {
        let statType: statType = keys(statData)[i];

        let statTypeData = statData[statType];
        if(statTypeData === undefined || statTypeData[statName] === undefined) continue;

        //clear lines
        lines = [];

        //sets lines
        recur(statTypeData[statName], [], tags);


        for(let j in lines) {
            let line = lines[j]

            if(line === "break") {
                statTypeElements[statType].push(<br/>);

                continue;
            }

            let lineContent = 
                isLine(line) ?
                    <>{formattedStringToElement(`${line.key}: `)}{formatStat(line.value, statType)}</> :
                isTag(line) ?
                    <>{formattedStringToElement(line.value)}</> :
                ""
            
            statTypeElements[statType].push(
                <div style={{marginLeft: `${line.depth*36}px`}}>
                    {lineContent}
                </div>
            );
        }
    }

    //statTypeElements but only the ones that arent empty
    let onlyValuedStatTypes = values(statTypeElements).filter(type => type.length > 0)

    console.log(statTypeElements)

    if(onlyValuedStatTypes.length == 0) {
        return <h2 style={{ textAlign: "center", fontSize: "20px" }}>{`This player has no ${statIdToStatName[statName] || "error"} :(`}</h2>;
    }

    //just give the flat ones if theres only flat
    // if(statTypeElements.flat !== undefined && onlyValuedStatTypes.length == 1) {
    //     console.log("fef")
    
    //     return statTypeElements.flat;
    // }

    //if there arent any, give this

    for(let i in keys(statTypeElements)) {
        let statType = keys(statTypeElements)[i];

        //if there arent any values in statData[statType][statName], continue
        if(keys(statData[statType]?.[statName] || {}).length == 0) continue;

        //all sources of the current type summed (or multiplied) together
        let typeSum =
            //multiplicative
            statType == "multiplicative" ?
                values(compressedStatData[statType]?.[statName] || {}).reduce((prev, curr) => prev*curr, 1) :
            
            //there shouldnt be a double limit but if there is just go with the first one
            statType == "limit" ? 
                values(compressedStatData[statType]?.[statName] || {})[0] :

            //everything else
            values(compressedStatData[statType]?.[statName] || {}).reduce((prev, curr) => prev+curr, 0)


        elements.push(
            <>
                {/* label */}
                <span style={{color: colorCodeToHex[statColors[statName] || "f"], fontWeight: "bold"}}>{statType.capitalize()}: </span>
                {formatStat(typeSum, statType)}

                <br/>

                {/* the actual stats */}
                <Indent width={36}>
                    {statTypeElements[statType]}
                </Indent>
                
                <br/>
            </>
        );
    }


    return elements
}

interface props {
    onClose: Function,
    visible: boolean,
    statData: categorizedFlippedStats,
    compressedStatData: categorizedCompressedStats,
    tags: statTags
    statName: baseStatName,
    evaluated: number,
}

export default function StatsPopUp({onClose, visible, statData, compressedStatData, tags, statName, evaluated}: props) {
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
                                    <br/>
                                    <Indent width={36}>{statDataToElement(statData, statName, compressedStatData, tags)}</Indent>
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