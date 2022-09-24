import Link from "next/link"
import React from "react"

export default function Home() {
	return (
		<>
			<div>homepage :)</div>
			<Link href={"profile/2CGI"}>profile viewer</Link>
		</>
	)
}