"use server";

import manieExchangeServiceAxiosInstance from "@/lib/maniaExchangeServiceAxiosInstance";

interface MapSearchResponse {
	More: boolean;
	Results: MapSearchResult[];
}

interface MapSearchResult {
	OnlineMapId: string;
	MapId: number;
}

export async function FindRandomMap(): Promise<MapSearchResponse> {
	let params = new URLSearchParams({
		"fields": "MapId,OnlineMapId",
		"count": "1",
		"tag": "4",
		"random": "1"
	});
	const response = await manieExchangeServiceAxiosInstance.get(`/maps?${params}`);
	return response.data;
}