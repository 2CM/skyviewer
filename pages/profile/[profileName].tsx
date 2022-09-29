import { useRouter } from "next/router"
import Head from "next/head";
import { Context, createContext, useEffect, useState} from 'react'
import { readFileSync } from "fs";
import { allSkillExpInfo, baseProfile, calculateAllSkillExp, calculateStats, getMostRecentProfile, initItems, item, statsList } from "../../lib";
import Skills from "../../components/skills";
import Stats from "../../components/stats";


export interface dataContext {
	data?: {
		selectedProfile: number
	}
}

export interface serverData {
	computedData: {
		stats: statsList,
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
					selectedProfile: 2
				}
			});
		}

		doAsyncStuff();
	}, [])

    return (
		<dataContext.Provider value={data}>
			<Head>
				<title>{`${profileName}'s profile`}</title>
			</Head>
			<main>
				<main>
					<Skills skills={props.computedData.skills}/>
					<Stats statValues={props.computedData.stats}/>
				</main>
			</main>
		</dataContext.Provider>
	)
}


export async function getServerSideProps(): Promise<serverSideProps> {
	var apiData: apiData = {
		profileData: JSON.parse(readFileSync("testContent/skyblockprofile.json", "utf8")),
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
	
	var selectedProfile = 2;

	await initItems(apiData);

	returnValue.props.computedData.skills = calculateAllSkillExp(apiData, selectedProfile);
	returnValue.props.computedData.stats = await calculateStats(apiData, selectedProfile);

	return returnValue;
}