import SkillLevel from "../../components/skillLevel"
import { useRouter } from "next/router"
import Head from "next/head";

export default function profileViewer() {
    var router = useRouter();
    var { profileName } = router.query;

    return (
		<>
			<Head>
				<title>{profileName}'s profile</title>
			</Head>
			<main>
				<main>
					<SkillLevel skillName="mining"/>
				</main>
			</main>
		</>
	)
}