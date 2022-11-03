import { useRouter } from "next/router"
import Head from "next/head";
import { Context, createContext, useEffect, useState} from 'react'
import { readFileSync } from "fs";
import { allSkillExpInfo, calculateAllSkillExp, calculateStats, getMostRecentProfile, initItems, sumStatsSources, getStatSources, statsCategories, keys, calcTemp } from "../../lib";
import Skills from "../../components/skills";
import Stats from "../../components/stats";
import { GetServerSideProps } from "next";
import { baseProfile, item } from "../../sbconstants";
import { randomBytes } from "crypto";


export interface dataContext {
	data?: {
		selectedProfile: number
	}
}

export interface serverData {
	computedData: {
		stats: statsCategories,
		skills: allSkillExpInfo
	}
}

export interface apiData {
	profileData?: {
		success: boolean,
		profiles: baseProfile[]
	},
	itemsData?: {
		success: boolean,
		lastUpdated: number,
		items: item[]
	}
}

interface serverSideProps {
	props: serverData
}


export var dataContext: Context<dataContext> = createContext({});

export default function profileViewer(props: serverData) {
    var router = useRouter();
    var { profileName } = router.query;

	var [data, setData] = useState<dataContext>({});
	
	
	useEffect(() => {
		var doAsyncStuff = async () => {
			setData({
				data: {
					selectedProfile: 3
				}
			});

			console.log(props)
		}

		doAsyncStuff();
	}, [])

	var sources = getStatSources(props.computedData.stats);
	var summed = sumStatsSources(sources);

	// console.log(sources)

    return (
		<dataContext.Provider value={data}>
			<Head>
				<title>{`${profileName}'s profile`}</title>
			</Head>
			<main>
				<main>
					{/* <Skills skills={props.computedData.skills}/> */}
					<Stats statValues={props.computedData.stats}
						summedList={summed.summed}
						cappedList={summed.capped}
						sources={sources}
					/>
				</main>
			</main>
		</dataContext.Provider>
	)
}


export const getServerSideProps: GetServerSideProps = async (context) => {
	console.log("-----------------------------------------------------------------------")

	var staticFileName =
		context.params?.profileName == "2CGI" ? "skyblockprofile.json" :
		context.params?.profileName == "breefing" ? "breefingprofile.json" :
		context.params?.profileName == "refraction" ? "refractionprofile.json" :
		"skyblockprofile.json"

	var playerUUID =
		context.params?.profileName == "2CGI" ? "86a6f490bf424769a625a266aa89e8d0" :
		context.params?.profileName == "breefing" ? "6d2564e80798417c877f799e9727e2bd" :
		"refraction" ? "28667672039044989b0019b14a2c34d6" :
		"86a6f490bf424769a625a266aa89e8d0";

	var apiData: apiData = {
		profileData: JSON.parse(readFileSync("testContent/"+staticFileName, "utf8")),
		itemsData: JSON.parse(readFileSync("testContent/items.json", "utf8")),
	}

	var returnValue: serverSideProps = {
		props: {
			computedData: {
				stats: {},
				skills: {},
			}
		}
	}

	if(!apiData.profileData) throw new Error("eeeeee")
	if(apiData.profileData.success === false) throw new Error("eefe")
	
	var selectedProfile = getMostRecentProfile(apiData.profileData.profiles, playerUUID);

	await initItems(apiData);

	
    var calcId = randomBytes(64).toString("base64");

    calcTemp[calcId] = {
        stats: {},
        skills: {},
        other: {

        },
    };

	calculateAllSkillExp(apiData, selectedProfile, playerUUID, calcId);
	await calculateStats(apiData, selectedProfile, playerUUID, calcId);

	returnValue.props.computedData.skills = calcTemp[calcId].skills;
	returnValue.props.computedData.stats = calcTemp[calcId].stats;

	delete calcTemp[calcId] //we dont need it anymore

	return returnValue;
}