"use server"

import serverServiceAxiosInstance from "@/lib/serverServiceAxiosInstance";
import { TrackmaniaMap } from "../types/trackmania-map";

export async function fetchMap(mapId: string): Promise<TrackmaniaMap | null> {
    const response = await serverServiceAxiosInstance.get(`/maps/${mapId}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }
    
    const json = response.data as TrackmaniaMap & ErrorResponse;
    if (!json.mapId) { return null; }

    return json;
}