"use server"

import { z } from "zod";
import nadeoServerClient from "@/apis/clients/nadeo-server-client";
import { TrackmaniaRecordSchema } from "@/schemas/trackmania-records";

export async function fetchMapRecords(accounts: string[], mapId: string) {
    let accountIdList = accounts.join(",");
    
    const response = await nadeoServerClient.get(`/v2/mapRecords/?accountIdList=${accountIdList}&mapId=${mapId}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch map records (${response.status})`); }
    
    return z.array(TrackmaniaRecordSchema).parse(response.data);
}