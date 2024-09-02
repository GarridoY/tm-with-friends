"use server"

import serverServiceAxiosInstance from "@/lib/serverServiceAxiosInstance";
import { TrackmaniaRecord } from "../types/trackmania-records";

export async function fetchMapRecords(accounts: string[], mapId: string): Promise<TrackmaniaRecord[] | null> {
    let accountIdList = "";
    for (let i = 0; i < accounts.length; i++) {
        accountIdList += accounts[i];
        if (i != (accounts.length - 1)) {
            accountIdList += ","
        }
    }

    const response = await serverServiceAxiosInstance.get(`/v2/mapRecords/?accountIdList=${accountIdList}&mapId=${mapId}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }
    
    const json = response.data as TrackmaniaRecord[] & ErrorResponse;
    if (!Array.isArray(json)) {
        return null;
    }

    return json;
}