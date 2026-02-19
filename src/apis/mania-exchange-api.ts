"use server";

import manieExchangeServiceAxiosInstance from "@/lib/maniaExchangeServiceAxiosInstance";

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
	const response = await manieExchangeServiceAxiosInstance.get(`/maps?${params}`);
	return response.data as MapSearchResponse;
}