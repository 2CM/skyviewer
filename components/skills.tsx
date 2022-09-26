import { useState } from "react";
import SkillLevel from "./skillLevel";

export default function Skills() {
    var [displayType, setDisplayType] = useState(1);

    var changeType = () => {
        setDisplayType(displayType+1);
    }

    return (
        <div>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="farming"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="mining"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="combat"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="foraging"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="fishing"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="enchanting"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="alchemy"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="taming"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="carpentry"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="runecrafting"/>
            <SkillLevel onChangeDisplayType={changeType} displayType={displayType} skillName="social"/>
        </div>
    )
}