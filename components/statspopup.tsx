import { useEffect } from "react"
import { sourcesToElement, statName } from "../lib";

interface props {
    onClose: Function,
    visible: boolean,
    statData: any,
    statName: statName,
}

export default function StatsPopUp({onClose, visible, statData, statName}: props) {
    var close = () => onClose();

    var keyupFunction = (e: KeyboardEvent) => {if(e.key == "Escape") close()};

    useEffect(() => {
        window.removeEventListener("keyup", keyupFunction);
        window.addEventListener("keyup", keyupFunction);
    }, [])

    return (
        <>
            {
                visible ?
                    <div style={{
                        zIndex: 100,
                        width: "100vw",
                        height: "100vh",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        display: "flex",
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            position: "absolute",
                            background: "black", opacity: 0.4,
                            width: "100vw",
                            height: "100vh" 
                        }} onClick={close}/>
                        <div style={{
                            display: "flex",
                            position: "absolute"
                        }}>
                            {sourcesToElement(statData, statName)}
                        </div>
                        <div style={{
                            position: "fixed",
                            top: "20px",
                            left: "20px",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "gray",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "30px",
                            userSelect: "none",
                            cursor: "pointer",
                        }} onClick={close}>
                            <span style={{}}>{"X"}</span>
                        </div>
                    </div> : null
            }
        </>
    )
}