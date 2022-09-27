import { statIdToStatName, statName } from "../lib";

interface props {
    statName: statName,
    value: number,
}

export default function Stat({statName, value}: props) {
    return (
        <div>{statIdToStatName[statName]} <b>{value.addCommas()}</b></div>
    )
}