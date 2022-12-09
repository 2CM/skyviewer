import { mainFormatter, statFormatter, removeStringColors, multiplierFormatter, percentFormatter, keys, categorizedCompressedStats, mapObjectValues, mapObjectKeys, values, statType, formatStat } from "../lib";
import Tippy from "@tippyjs/react/headless"
import styles from "../styles/stat.module.css";
import { motion, useSpring } from "framer-motion";
import { colorCodeToHex, statChars, statColors, statIdToStatName, baseStatName, defaultStatCaps, statName } from "../sbconstants";
import Indent from "./indent";

function getStatStageInfo(statName: statName, sourcesList: Record<string, number>, type: statType) {
    let icon = statChars[statName] || "?";
    let formattedStatName = statIdToStatName[statName] || "error";
    let statColor = colorCodeToHex[statColors[statName] || "f"];

    //header

    //"Flat" | "Additive" | "Multiplicative" | "" health
    let headerStatPrefix = (type == "limit" || type == "cap") ? "" : type.capitalize();
    
    //health "Bonuses" | "Buffs" | "Cap"
    let headerStatSuffix = 
        (type == "flat") ?
            "Bonuses" :

        (type == "additive" || type == "multiplicative") ?
            "Buffs" :

            "Cap"

    let header = (
        <div style={{color: statColor, fontWeight: "bold"}}>
            {icon} {headerStatPrefix} {formattedStatName} {headerStatSuffix} 
        </div>
    )

    //note about the current stage
    let note = (
        <div>
            {
                (type == "flat") ?
                    `All of these are summed together into a base amount.` :

                (type == "additive") ?
                    `These stat bonuses are added up and then converted into the (additive) multiplier.` :

                (type == "multiplicative") ?
                    `All of these are multiplied together for the final multiplier.` :

                    //only 2 left are cap and limit
                    defaultStatCaps["c_"+statName as statName] !== undefined ?
                        `There is a ${statIdToStatName[statName]?.toLowerCase()} limit in Skyblock! Some magic may let you change it!` :

                        `There is not a default ${statIdToStatName[statName]?.toLowerCase()} limit in Skyblock! However you managed to change it!`

            }
        </div>
    )

    //array of elements in the stat sources list
    let listElements = keys(sourcesList)
        .sort((a, b) => //sort them in process stats
            (sourcesList)[a] > (sourcesList)[b] ? -1 : 1
        )
        .map(key => 
            //+102❤ Storm's Helmet
            //20.1% Archimedes
            //1.15x Made of Lava

            <div>
                <span style={{color: statColor, fontWeight: "bold"}}>
                    {formatStat(sourcesList[key], type)}
                    {
                        //additive and multiplicative are the only ones that dont use icons

                        (type != "additive" && type != "multiplicative") ? icon : ""
                    }
                </span> {removeStringColors(key)}
            </div>
        )
        .slice(0,7) //cap the list at 7
        
    
    //accumulated list of stat sources
    let list = (
        //indent it
        <Indent>
            {
                keys(sourcesList).length > 0 ?
                    listElements :

                    //note in red saying "None" (very hard to tell)
                    <div style={{color: colorCodeToHex["c"], fontWeight: "bold"}}>None!</div>
            }
            {
                //gotta make sure we include that there are more
                keys(sourcesList).length > 7 ?
                    <div>And {keys(sourcesList).length - 7} more...</div> :

                    <></>
            }
        </Indent>
    )

    //sum

    //sum of the current stage
    let stageSum = values(sourcesList)
        .reduce((prev, curr) => prev+curr, 0)


    let sumPrefix =
        (type == "multiplicative") ?
            "Multiplier: " :

        (type == "cap" || type == "limit") ?
            "Value: " :

            //everything else
            "Adds up to: "
    
    
    let sumSuffix = `${(type != "additive" && type != "multiplicative") ? icon : ""}${(type == "flat") ? formattedStatName : ""}`

    let sum = <>
        {
            <div>
                {sumPrefix}
                <span style={{color: statColor, fontWeight: "bold"}}>
                    {formatStat(stageSum, type)} {sumSuffix}
                </span>
            </div>
        }
        {
            //additive has an extra field that displays the sum as a multiplier

            type == "additive" ?
                <div>
                    As multiplier: <span style={{color: statColor, fontWeight: "bold"}}>
                        {formatStat(stageSum+1, "multiplicative")}
                    </span>
                </div> :

                <></>
        }
        {
            //additive and multiplicative have notes about how they are applied

            type == "additive" ?
                <div style={{fontStyle: "italic"}}>Multiplied with flat!</div> :

            type == "multiplicative" ?
                <div style={{fontStyle: "italic"}}>Applied after additive!</div> :

            <></>
        }
    </>

    return (
        <>
            {header}
            {/* indent it */}
            <Indent>
                {note}
                {
                    (type == "limit" || type == "cap") ? 
                        //limit/cap one uses special formatting
                        <>
                            <br />
                            {sum}
                            <br/>
                            {
                                type == "limit" ?
                                    //limits dont need a list as there shouldnt be more than one of them
                                    <span>Overwritten by: {keys(sourcesList)[0]}</span> :

                                    <>
                                        <div>Flat Bonuses: </div>
                                        {list}
                                    </>
                            }
                        </> :

                        //default one
                        <>
                            {list}
                            <br/>
                            {sum}
                        </>
                }
            </Indent>
        </>
    )
}

interface props {
    statName: baseStatName,
    value: number,
    // sources: any,
    categorizedCompressedStats: categorizedCompressedStats
    onClick: Function,
}

export default function Stat({statName, value, categorizedCompressedStats, onClick}: props) {
    const springConfig = { duration: 200 };
    const opacity = useSpring(0, springConfig);

    function onMount() {
        opacity.set(1);
    }

    function onHide({ unmount }: any) {
        const cleanup = opacity.onChange((value) => {
            if (value <= 0) {
                cleanup();
                unmount();
            }
        });

        opacity.set(0);
    }

    let flat = categorizedCompressedStats.flat ? 
        getStatStageInfo(statName, categorizedCompressedStats?.flat[statName] || {}, "flat")

    : undefined;

    let additive = categorizedCompressedStats.additive && categorizedCompressedStats.additive[statName] ? 
        getStatStageInfo(statName, categorizedCompressedStats?.additive[statName] || {}, "additive")

    : undefined;

    let multiplicative = categorizedCompressedStats.multiplicative && categorizedCompressedStats.multiplicative[statName] ? 
        getStatStageInfo(statName, categorizedCompressedStats?.multiplicative[statName] || {}, "multiplicative")
    : undefined;

    let limitAndCap = categorizedCompressedStats.limit && categorizedCompressedStats.limit[statName] ? 
        getStatStageInfo(statName, categorizedCompressedStats?.limit[statName] || {}, "limit") :

        categorizedCompressedStats.cap && categorizedCompressedStats.cap[statName] ? 
            getStatStageInfo(statName, categorizedCompressedStats?.cap[statName] || {}, "cap")
    : undefined;
    
    let stages = [flat, additive, multiplicative, limitAndCap].filter(ele => ele !== undefined) as JSX.Element[];
    let seperatedStages: JSX.Element[] = [];

    //seperate them by <br/>s
    for(let i = 0; i < stages.length; i++) {
        seperatedStages.push(stages[i]);

        if(i != stages.length-1) seperatedStages.push(<br/>);
    }

    return (
        <Tippy
            placement="right"
            animation={true}
            onMount={onMount}
            onHide={onHide}
            delay={10}
            render={attrs => (
                <motion.div className={styles.tippyBox} tabIndex={-1} style={{opacity} as any} {...attrs}>
                    {seperatedStages}
                    
                    <br/>
                    <span style={{textDecoration: "underline", fontWeight: "bold"}}>Click for more info!</span>
                </motion.div>
            )}
        >
            <div
                onClick={() => {onClick(statName)}}
                className={styles.stat}
                style={{
                    color: colorCodeToHex[statColors[statName || "health"] || "0"],
                    fontWeight: "bold",
                }}
            >
                {statChars[statName] || "?"} <span className={styles.statName}>{statIdToStatName[statName] || "error"}</span> <span style={{color: "white"}}>{mainFormatter.format(value)}</span>
            </div>
        </Tippy>
    )
}