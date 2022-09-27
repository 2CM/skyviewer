import { useContext } from "react";
import { calculateStats, statName } from "../lib";
import { dataContext } from "../pages/profile/[profileName]";
import Stat from "./stat";

export default function Stats() {
    var dataContextData = useContext(dataContext);

    if(!dataContextData.apiData || !dataContextData.data) return <></>; //will have better error handling in the future

    var statValues = calculateStats(dataContextData);
    
    var statsArr: JSX.Element[] = Object.keys(statValues).map(key => (<Stat statName={key as statName} value={statValues[key] || 0}></Stat>));



    return (
        <div>
            {statsArr}
        </div>
    )
}