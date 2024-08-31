"use server"

import { TrackmaniaRecord } from "../types/trackmania-records";

export async function fetchMapRecords(accounts: string[], mapId: string): Promise<TrackmaniaRecord[] | null> {
    let accountIdList = "";
    for (let i = 0; i < accounts.length; i++) {
        accountIdList += accounts[i];
        if (i != (accounts.length - 1)) {
            accountIdList += ","
        }
    }

    const data = await fetch(`https://prod.trackmania.core.nadeo.online/v2/mapRecords/?accountIdList=${accountIdList}&mapId=${mapId}`, {
        method: "GET",
        headers: {
            "Authorization": `nadeo_v1 t=${process.env.NADEO_SERVICES_ACCESS_TOKEN}`
        }
    });

    const json = await data.json() as TrackmaniaRecord[] & ErrorResponse;
    if (!Array.isArray(json)) {
        return null;
    }

    return json;
}