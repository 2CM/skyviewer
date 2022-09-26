import SkillLevel from "../../components/skillLevel"
import { useRouter } from "next/router"
import Head from "next/head";
import { Context, createContext, useEffect, useState} from 'react'
import fs from "fs";
import { baseProfile, getMostRecentProfile, profile } from "../../lib";

interface dataContextInterface {
	data?: {
		apiData: {
			success: boolean,
			profiles: baseProfile[]
		},
		selectedProfile: number
	}
}

export var dataContext: Context<dataContextInterface> = createContext({});

export default function profileViewer() {
    var router = useRouter();
    var { profileName } = router.query;
	var [data, setData] = useState({});


	useEffect(() => {
		var doAsyncStuff = async () => {
			var apiDataRaw = await fetch("/api/getProfile");
			var apiData: dataContextInterface = await apiDataRaw.json();

			console.log(apiData)

			setData({data: {apiData: apiData, selectedProfile: 2}})
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
					<SkillLevel skillName="combat"/>
				</main>
			</main>
		</dataContext.Provider>
	)
}