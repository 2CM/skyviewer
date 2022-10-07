import { colorCodeToHex, mainFormatter, statChars, statColors, statFormatter, statIdToStatName, statName, statCategoryColors, statCategoryNames } from "../lib";
import Tippy from "@tippyjs/react/headless"
import styles from "../styles/stat.module.css";
import { motion, useSpring } from "framer-motion";

interface props {
    statName: statName,
    value: number,
    sources: any,
    onClick: Function,
}

export default function Stat({statName, value, sources, onClick}: props) {
    const springConfig = { duration: 200 };
    const opacity = useSpring(0, springConfig);

    function onMount() {
        opacity.set(1);
    }

    function onHide({ unmount }: any) {
        const cleanup = opacity.onChange((value) => {
            if (value <= 0) {
                cleanup();
                unmount();
            }
        });

        opacity.set(0);
    }

    return (
        <Tippy
            placement="right"
            animation={true}
            onMount={onMount}
            onHide={onHide}
            delay={10}
            render={attrs => {
                var base = sources.base?.base || 0;

                var additionals: any = {};
                var additionalsSum: number = 0;

                for(let i in Object.keys(sources)) {
                    var name = Object.keys(sources)[i];

                    if(name == "base") continue;

                    additionals[name] = (Object.values(sources[name]) as number[]).reduce((prev: number, curr: number) => prev+curr, 0);

                    additionalsSum += additionals[name];
                }

                return <motion.div className={styles.tippyBox} tabIndex={-1} style={{opacity} as any} {...attrs}>
                    {`
                    Base ${statIdToStatName[statName]}: ${base}
                    LINEBREAK
                    Additional ${statIdToStatName[statName]}: ${mainFormatter.format(additionalsSum)}
                    ${
                        Object.keys(additionals).map(additionalName => {
                            return `- ${statCategoryNames[additionalName]}: ${statFormatter.format(additionals[additionalName])}`
                        }).join("\n")
                    }
                    `
                    .split("\n").map(line => {
                        if(line.includes("LINEBREAK")) return <br/>
                        return <div>{line}</div>
                    })}
                    <br/>
                    <span style={{textDecoration: "underline"}}>Click for more info!</span>
                </motion.div>;
            }
        }>
            <div
                onClick={() => {onClick(statName)}}
                style={{color: colorCodeToHex[statColors[statName || "health"] || "0"]}}
                className={styles.stat}
            >
                <b>
                    {statChars[statName] || "?"} <span className={styles.statName}>{statIdToStatName[statName]}</span> <span style={{color: "white"}}>{mainFormatter.format(value)}</span>
                </b>
            </div>
        </Tippy>
    )
}