import { statIdToStatName, statName } from "../lib";
import Tippy from "@tippyjs/react"

interface props {
    statName: statName,
    value: number,
}

export default function Stat({statName, value}: props) {
    return (
        <div>{statIdToStatName[statName]} <b>{value.addCommas(0)}</b></div>
    )
}