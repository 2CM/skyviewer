import { useState } from "react";
import { allSkillExpInfo, skillCaps, skillName } from "../lib";
import SkillLevel from "./skillLevel";

interface props {
    skills: allSkillExpInfo
}

export default function Skills({skills}: props) {
    var [displayType, setDisplayType] = useState(1);

    var changeType = () => {
        setDisplayType(displayType+1);
    }

    var skillLevels: JSX.Element[] = Object.keys(skillCaps).map(name => {
        if(name == "dungeonnering") return <></>;

        var skillExpInfos = skills[name as keyof typeof skills];

        if(skillExpInfos === undefined) return <></>;

        return <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName={name as skillName} skillExpInfos={skillExpInfos}/>
    })

    return (
        <div>
            {skillLevels}
        </div>
    )
}