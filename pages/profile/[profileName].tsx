import SkillLevel from "../../components/skillLevel"
import { useRouter } from "next/router"
import Head from "next/head";
import { Context, createContext, useEffect, useState} from 'react'
import fs from "fs";
import { baseProfile, getMostRecentProfile, profile } from "../../lib";
import Skills from "../../components/skills";


interface dataContextInterface {
	apiData?: {
		success: boolean,
		profiles: baseProfile[]
	}
	data?: {
		selectedProfile: number
	}
}

export var dataContext: Context<dataContextInterface> = createContext({});

export default function profileViewer() {
    var router = useRouter();
    var { profileName } = router.query;
	var [data, setData] = useState<dataContextInterface>({});


	useEffect(() => {
		var doAsyncStuff = async () => {
			var apiDataRaw = await fetch("/api/getProfile");
			var apiData = await apiDataRaw.json();

			console.log(apiData)

			setData({
				apiData: apiData,
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
				<title>{profileName}'s profile</title>
			</Head>
			<main>
				<main>
					{/* <SkillLevel skillName="combat"/>
					<SkillLevel skillName="mining"/>
					<SkillLevel skillName="enchanting"/>
					<SkillLevel skillName="foraging"/> */}
					<Skills/>
				</main>
			</main>
		</dataContext.Provider>
	)
}