"use server"

import nadeoServerClient from "@/apis/clients/nadeo-server-client";
import { TrackmaniaRecord } from "../types/trackmania-records";

export async function fetchMapRecords(accounts: string[], mapId: string): Promise<TrackmaniaRecord[] | null> {
    let accountIdList = accounts.join(",");
    
    const response = await nadeoServerClient.get(`/v2/mapRecords/?accountIdList=${accountIdList}&mapId=${mapId}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch map records (${response.status})`); }
    
    const json = response.data as TrackmaniaRecord[] & ErrorResponse;
    if (!Array.isArray(json)) {
        return null;
    }

    return json;
}