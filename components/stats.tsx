import { useState } from "react";
import { statIdToStatName, statName, statsList, statsCategory, statsCategories, sumStatsCategories, getStatSources } from "../lib";
import StatsPopUp from "./statspopup";
import Stat from "./stat";

interface props {
    statValues: statsCategories
}

export default function Stats({statValues}: props) {
    var summedList = sumStatsCategories(statValues);
    var sources = getStatSources(statValues);

    var [selectedStat, setSelectedStat] = useState<undefined | statName>(undefined);
    
    console.log(statValues)
    console.log(sources)

    var statsArr: JSX.Element[] = Object.keys(statIdToStatName).map(key => {
        return <Stat onClick={setSelectedStat} sources={sources[key] || {}} statName={key as statName} value={summedList[key] || 0}/>
    });

    //console.log(selectedStat)

    return (
        <>
            <StatsPopUp statName={selectedStat || "health"} statData={sources[selectedStat as keyof typeof statValues]} visible={selectedStat !== undefined} onClose={() => {
                console.log("closing")

                setSelectedStat(undefined);
            }}/>
            <div style={{width: "200px", borderRight: "1px solid red"}}>
                {statsArr}
            </div>
        </>
    )

    return <></>
}