import { useRouter } from "next/router"
import Head from "next/head";
import { Context, createContext, useEffect, useState} from 'react'
import { readFileSync } from "fs";
import { allSkillExpInfo, calculateAllSkillExp, calculateStats, getMostRecentProfile, initItems, keys, calcTemp, initFullSets, getSkyblockTime, statType, evaluatedStats, categorizedCompressedStats, categorizedFlippedStats, mapObjectValues, statTags, processStats } from "../../lib";
import Skills from "../../components/skills";
import Stats from "../../components/stats";
import { GetServerSideProps } from "next";
import { baseProfile, baseStatName, item, skyblockLocation, statName, statsList, statsSources } from "../../sbconstants";
import { randomBytes } from "crypto";


export interface dataContext {
	data?: {
		selectedProfile: number
	}
}

export type apiError = {success: false};

export type profileData = {
	success: true,
	profiles: baseProfile[],
}

export type itemsData = {
	success: true,
	lastUpdated: number,
	items: item[],
}

export type hypixelGame = "SKYBLOCK" | "other game";

export type statusData = {
	success: true,
	uuid: string,
	session: {
		online: false
	} | {
		online: true,
		gameType: Exclude<hypixelGame, "SKYBLOCK">,
	} | {
		online: true,
		gameType: Extract<hypixelGame, "SKYBLOCK">,
		mode: skyblockLocation,
	}
}

export interface apiData {
	profileData: profileData,
	itemsData: itemsData,
	statusData?: statusData,
}

interface serverSideProps {
	props: serverData
}

export interface serverData {
	computedData: {
		stats: {
			stats: statsSources,
			tags: statTags,
			categorizedCompressedStats: categorizedCompressedStats,
			categorizedFlippedStats: categorizedFlippedStats,

			evaluatedStats: evaluatedStats,
		},

		skills: allSkillExpInfo
	},
}

export var dataContext: Context<dataContext> = createContext({});

export default function profileViewer(props: serverData) {
    var router = useRouter();
    var { profileName } = router.query;

	var [data, setData] = useState<dataContext>({});

	// console.log(props.computedData.stats, summed, sources)

	let evaluatedList: statsList = {};

	for(let i in keys(props.computedData.stats.evaluatedStats)) {
		let key = keys(props.computedData.stats.evaluatedStats)[i];
		let value = props.computedData.stats.evaluatedStats[key] || {};

		let lastTransform = keys(value).at(-1);

		if(lastTransform === undefined) continue;

		evaluatedList[key] = value[lastTransform] || 0
	}

	console.log(props)

	// console.log({evaluatedList, cfs: props.computedData.stats.categorizedFlippedStats, ccs: props.computedData.stats.categorizedCompressedStats})

    return (
		<dataContext.Provider value={data}>
			<Head>
				<title>{`${profileName}'s profile`}</title>
			</Head>
			<main>
				<main>
					{/* <Skills skills={props.computedData.skills}/> */}
					<Stats
						evaluatedList={evaluatedList}
						categorizedCompressedStats={props.computedData.stats.categorizedCompressedStats}
						categorizedFlippedStats={props.computedData.stats.categorizedFlippedStats}
					/>
				</main>
			</main>
		</dataContext.Provider>
	)
}


export const getServerSideProps: GetServerSideProps = async (context) => {
	console.log("-----------------------------------------------------------------------")

	const staticFileName =
		context.params?.profileName == "2CGI" ? "skyblockprofile.json" :
		context.params?.profileName == "breefing" ? "breefingprofile.json" :
		context.params?.profileName == "refraction" ? "refractionprofile.json" :
		"skyblockprofile.json";

	const playerUUID =
		context.params?.profileName == "2CGI" ? "86a6f490bf424769a625a266aa89e8d0" :
		context.params?.profileName == "breefing" ? "6d2564e80798417c877f799e9727e2bd" :
		context.params?.profileName == "refraction" ? "28667672039044989b0019b14a2c34d6" :
		"86a6f490bf424769a625a266aa89e8d0";

	
	const profileData = JSON.parse(readFileSync("testContent/"+staticFileName, "utf8")) as profileData | apiError;
	const itemsData = JSON.parse(readFileSync("testContent/items.json", "utf8")) as itemsData | apiError;
	const statusData = JSON.parse(readFileSync("testContent/status.json", "utf8")) as statusData | apiError;

	if(!profileData.success) throw new Error("profile data was invalid");
	if(!itemsData.success) throw new Error("items data was invalid");
	if(!statusData.success) console.warn("statusData was unsuccessful"); //its not critical. you just wont know the extra stats given from location buffs (like the extra stuff on rampart armor)

	var apiData: apiData = { profileData, itemsData };

	if(statusData.success) apiData.statusData = statusData;
	
	var selectedProfile = getMostRecentProfile(apiData.profileData.profiles, playerUUID);

	initItems(apiData);
	initFullSets();

	
    var calcId = randomBytes(64).toString("base64"); //generate a random uuid for the calculation

    calcTemp[calcId] = {
        stats: {
			stats: {},

			tags: [],
			flippedStats: {},
			compressedStats: {},
			categorizedFlippedStats: {},
			categorizedCompressedStats: {},

			evaluatedStats: {},
		},
        skills: {},
		status: apiData.statusData?.session.online && apiData.statusData?.session.gameType == "SKYBLOCK" ? apiData.statusData.session.mode : undefined,
		time: getSkyblockTime(),
        other: {

        },
    };

	console.log(calcTemp[calcId].time)

	calculateAllSkillExp(apiData, selectedProfile, playerUUID, calcId);
	await calculateStats(apiData, selectedProfile, playerUUID, calcId);

	processStats(calcId);

	var returnValue: serverSideProps = {
		props: {
			computedData: {
				stats: {
					stats:                      calcTemp[calcId].stats.stats,
					tags:                       calcTemp[calcId].stats.tags,
					evaluatedStats:             calcTemp[calcId].stats.evaluatedStats,
					categorizedFlippedStats:    calcTemp[calcId].stats.categorizedFlippedStats,
					categorizedCompressedStats: calcTemp[calcId].stats.categorizedCompressedStats,
				},
				skills: calcTemp[calcId].skills,
			},
		}
	}

	delete calcTemp[calcId] //we dont need it anymore

	return returnValue;
}