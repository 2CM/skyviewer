import { useEffect } from "react"
import { sourcesToElement, statFormatter} from "../lib";
import { statName, statColors, statChars, statIdToStatName, colorCodeToHex } from "../sbconstants";
import styles from "../styles/stat.module.css";

interface props {
    onClose: Function,
    visible: boolean,
    statData: any,
    statName: statName,
    summed: number,
    capped: number
}

export default function StatsPopUp({onClose, visible, statData, statName, summed, capped}: props) {
    var close = () => onClose();

    var keyupFunction = (e: KeyboardEvent) => {if(e.key == "Escape") close()};

    useEffect(() => {
        window.removeEventListener("keyup", keyupFunction);
        window.addEventListener("keyup", keyupFunction);


        if(visible) {
            document.body.style.overflowY = "scroll";
            document.body.style.position = "fixed";
        }

        return () => {
            document.body.style.overflowY = "unset";
            document.body.style.position = "unset";
        }
    })

    return (
        <>
            {
                visible ?
                    <div className={styles.popup}>
                        <div className={styles.popupBackground} onClick={close}/>
                        <div className={styles.popupBoxContainer}>
                            <main className={styles.popupContainer} style={{outlineColor: colorCodeToHex[statColors[statName] || "f"]}}>
                                <div className={styles.popupNameContainer}>
                                    <h2 className={styles.popupName} style={{color: colorCodeToHex[statColors[statName] || "f"]}}>{statChars[statName]} {statIdToStatName[statName]} <span style={{color: "white"}}>{statFormatter.format(capped === undefined ? summed : capped)}{capped !== undefined && capped != summed ? ` (${statFormatter.format(summed).slice(1 /* to remove the sign*/)})` : ""}</span></h2>
                                </div>
                                <main className={styles.popupContent}>
                                    {sourcesToElement(statData, statName)}
                                </main>
                                <div className={styles.popupFooter}>
                                    <a
                                        href={"https://hypixel-skyblock.fandom.com/wiki/"+statName.replaceAll("_", " ").capitalize().replaceAll(" ", "_")}
                                        target="_blank"
                                    >

                                        <div style={{textDecorationColor: "white"}}>More info / ways to gain</div>
                                        <div>
                                            <b style={{color: colorCodeToHex[statColors[statName] || "f"], textDecorationColor: colorCodeToHex[statColors[statName] || "f"]}}>{statChars[statName]} {statIdToStatName[statName]}</b>
                                        </div>
                                    </a>
                                </div>
                            </main>
                        </div>
                        <div className={styles.popupClose} onClick={close}>
                            <span style={{}}>{"X"}</span>
                        </div>
                    </div> : null
            }
        </>
    )
}