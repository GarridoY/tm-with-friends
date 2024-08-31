"use server"

import { TrackmaniaMap } from "../types/trackmania-map";

export async function fetchMap(mapId: string): Promise<TrackmaniaMap | null> {
    const data = await fetch(`https://prod.trackmania.core.nadeo.online/maps/${mapId}`, {
        method: "GET",
        headers: {
            "Authorization": `nadeo_v1 t=${process.env.NADEO_SERVICES_ACCESS_TOKEN}`
        }
    });

    if (!data.ok) { return null; }

    const json = await data.json() as TrackmaniaMap & ErrorResponse;
    if (!json.mapId) { return null; }

    return data.json();
}