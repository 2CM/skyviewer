import { statIdToStatName, statName, statsList, statsCategory, statsCategories, sumStatsCategories, getStatSources } from "../lib";
import Stat from "./stat";

interface props {
    statValues: statsCategories
}

export default function Stats({statValues}: props) {
    var summedList = sumStatsCategories(statValues);
    var sources = getStatSources(statValues);
    
    console.log(statValues)
    console.log(sources)

    var statsArr: JSX.Element[] = Object.keys(statIdToStatName).map(key => {
        return <Stat sources={sources[key] || {}} statName={key as statName} value={summedList[key] || 0}/>
    });

    return (
        <div style={{width: "200px", borderRight: "1px solid red"}}>
            {statsArr}
        </div>
    )

    return <></>
}