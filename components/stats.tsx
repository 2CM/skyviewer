import { useState } from "react";
import { categorizedCompressedStats, categorizedFlippedStats, keys, statTags } from "../lib";
import StatsPopUp from "./statspopup";
import Stat from "./stat";
import styles from "../styles/stat.module.css";
import { statsList, statName, statIdToStatName, baseStatName } from "../sbconstants";

interface props {
    evaluatedList: statsList,
    categorizedCompressedStats: categorizedCompressedStats,
	categorizedFlippedStats: categorizedFlippedStats,
    tags: statTags
}

export default function Stats({evaluatedList, categorizedCompressedStats, categorizedFlippedStats, tags}: props) {
    var [selectedStat, setSelectedStat] = useState<undefined | baseStatName>(undefined);

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
                compressedStatData={categorizedCompressedStats}
                visible={selectedStat !== undefined}
                evaluated={evaluatedList[selectedStat || "health"] || 0}
                tags={tags}
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