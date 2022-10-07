import { useEffect } from "react"
import { colorCodeToHex, sourcesToElement, statChars, statColors, statFormatter, statIdToStatName, statName } from "../lib";
import styles from "../styles/stat.module.css";

interface props {
    onClose: Function,
    visible: boolean,
    statData: any,
    statName: statName,
    summed: number,
}

export default function StatsPopUp({onClose, visible, statData, statName, summed}: props) {
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
                            <main className={styles.popupContainer} style={{outlineColor: colorCodeToHex[statColors[statName]]}}>
                                <div className={styles.nameContainer}>
                                    <h2 className={styles.popupName} style={{color: colorCodeToHex[statColors[statName]]}}>{statChars[statName]} {statIdToStatName[statName].capitalize()} <span style={{color: "white"}}>{statFormatter.format(summed)}</span></h2>
                                </div>
                                <main className={styles.popupContent}>
                                {sourcesToElement(statData, statName)}
                                </main>
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