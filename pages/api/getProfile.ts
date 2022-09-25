import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

//temp to replace reqesting to hypixel api while testing

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("got req")

    res.status(200).json(JSON.parse(readFileSync("testContent/skyblockprofile.json", "utf8")))
}