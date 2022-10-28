import { useState } from "react";
import { statsCategories, keys} from "../lib";
import StatsPopUp from "./statspopup";
import Stat from "./stat";
import styles from "../styles/stat.module.css";
import { statsList, statName, statIdToStatName } from "../sbconstants";

interface props {
    statValues: statsCategories,
    summedList: statsList,
    cappedList: statsList
    sources: any,
}

export default function Stats({summedList, cappedList, sources}: props) {
    var [selectedStat, setSelectedStat] = useState<undefined | statName>(undefined);

    var statsArr: JSX.Element[] = keys(statIdToStatName).map(key => {
        return <Stat onClick={setSelectedStat} sources={sources || {}} statName={key as statName} value={cappedList[key] || (summedList[key] || 0)}/>
    });

    return (
        <>
            <StatsPopUp
                statName={selectedStat || "health"}
                statData={sources}
                visible={selectedStat !== undefined}
                summed={summedList[selectedStat || "health"] || 0}
                capped={cappedList[selectedStat || "health"] || 0}
                onClose={() => {
                    console.log("closing")

                    setSelectedStat(undefined);
                }}
            />
            <div className={styles.stats}>
                {statsArr}
            </div>
        </>
    )

    return <></>
}