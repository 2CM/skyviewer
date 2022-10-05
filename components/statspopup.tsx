import { useEffect } from "react"
import { sourcesToElement } from "../lib";

interface props {
    onClose: Function,
    visible: boolean,
    statData: any,
}

export default function StatsPopUp({onClose, visible, statData}: props) {
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
                            background: "black", opacity: 0.2,
                            width: "100vw",
                            height: "100vh" 
                        }}/>
                        <div style={{
                            display: "flex",
                        }}>
                            {/* <ul>
                                <li>base</li>
                                <ul>
                                    <li>base: +100</li>
                                </ul>
                                <li>skills</li>
                                <ul>
                                    <li>farming: +117</li>
                                    <li>fishing: +59</li>
                                </ul>
                                <li>slayer</li>
                                <ul>
                                    <li>zombie: +26</li>
                                    <li>wolf: +7</li>
                                    <li>enderman: +5</li>
                                </ul>
                                <li>taliStats</li>
                                <ul>
                                    <li>Bat Artifact: +5</li>
                                </ul>
                            </ul> */}
                            {sourcesToElement(statData)}
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