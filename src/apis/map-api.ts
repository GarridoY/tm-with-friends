"use server"

import nadeoServerClient from "@/apis/clients/nadeo-server-client";
import { TrackmaniaMap } from "../types/trackmania-map";
import maniaExhangeClient from "./clients/mania-exchange-client";

export async function fetchMap(mapId: string): Promise<TrackmaniaMap | null> {
    const response = await nadeoServerClient.get(`/maps/${mapId}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }
    
    const json = response.data as TrackmaniaMap & ErrorResponse;
    if (!json.mapId) { return null; }

    return json;
}

interface MapSearchResponse {
	More: boolean;
	Results: MapSearchResult[];
}

export interface MapSearchResult {
	OnlineMapId: string;
	MapId: number;
	Uploader: MapUploader;
	Name: string;
}

interface MapUploader {
	Name: string;
}

export async function FindRandomMap(): Promise<MapSearchResponse> {
	let params = new URLSearchParams({
		"fields": "MapId,OnlineMapId,Uploader.Name,Name",
		"count": "1",
		"tag": "4",
		"random": "1"
	});
	const response = await maniaExhangeClient.get(`/maps?${params}`);
	return response.data as MapSearchResponse;
}