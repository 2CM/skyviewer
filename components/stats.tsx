import { useState } from "react";
import { categorizedCompressedStats, categorizedFlippedStats, keys } from "../lib";
import StatsPopUp from "./statspopup";
import Stat from "./stat";
import styles from "../styles/stat.module.css";
import { statsList, statName, statIdToStatName, baseStatName } from "../sbconstants";

interface props {
    evaluatedList: statsList,
    categorizedCompressedStats: categorizedCompressedStats
	categorizedFlippedStats: categorizedFlippedStats
}

export default function Stats({evaluatedList, categorizedCompressedStats, categorizedFlippedStats}: props) {
    var [selectedStat, setSelectedStat] = useState<undefined | statName>(undefined);

    var statsArr: JSX.Element[] = keys(statIdToStatName).map(key => {
        return <Stat
            onClick={setSelectedStat}
            
            categorizedCompressedStats={categorizedCompressedStats}
            statName={key as baseStatName}
            value={evaluatedList[key] || 0}
        />
    });

    return (
        <>
            <StatsPopUp
                statName={selectedStat || "health"}
                statData={categorizedFlippedStats}
                visible={selectedStat !== undefined}
                evaluated={evaluatedList[selectedStat || "health"] || 0}
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
}