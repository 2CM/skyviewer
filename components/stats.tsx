import { statName, statsList } from "../lib";
import Stat from "./stat";

interface props {
    statValues: statsList
}

export default function Stats({statValues}: props) {
    var statsArr: JSX.Element[] = Object.keys(statValues).map(key => (<Stat statName={key as statName} value={statValues[key]}></Stat>));

    return (
        <div>
            {statsArr}
        </div>
    )
}