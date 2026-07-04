"use server"

import nadeoServerClient from "@/apis/clients/nadeo-server-client";
import { TrackmaniaMapSchema } from "@/schemas/trackmania-map";
import { MapSearchResponseSchema, MapSearchResult } from "@/schemas/mania-exchange";
import maniaExhangeClient from "./clients/mania-exchange-client";

export type { MapSearchResult } from "@/schemas/mania-exchange";

export async function fetchMap(mapId: string) {
    const response = await nadeoServerClient.get(`/maps/${mapId}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch map (${response.status})`); }
    
    return TrackmaniaMapSchema.parse(response.data);
}

export async function findRandomMap(): Promise<MapSearchResult> {
	let params = new URLSearchParams({
		"fields": "MapId,OnlineMapId,Uploader.Name,Name",
		"count": "1",
		"tag": "4",
		"random": "1"
	});
	const response = await maniaExhangeClient.get(`/maps?${params}`);
	const body = MapSearchResponseSchema.parse(response.data);
	return body.Results[0];
}