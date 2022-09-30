import { statIdToStatName, statName, statsList, statsLists, sumStatsLists } from "../lib";
import Stat from "./stat";

interface props {
    statValues: statsLists
}

export default function Stats({statValues}: props) {
    var summedList = sumStatsLists(statValues);

    var statsArr: JSX.Element[] = Object.keys(statIdToStatName).map(key => (<Stat statName={key as statName} value={summedList[key] || 0}></Stat>));

    return (
        <div>
            {statsArr}
        </div>
    )
}