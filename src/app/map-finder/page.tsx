"use client";

import { FindRandomMap } from "@/apis/mania-exchange-api";
import { Button } from "@/components/ui/button";
import { fetchDisplayNameFromAccountId } from "@/services/account-service";
import { fetchMap } from "@/services/map-service";
import { TrackmaniaMap } from "@/types/trackmania-map";
import { useState } from "react";
import Image from "next/image";
import SkeletonCard from "@/components/skeleton-card";
import Header from "@/components/header";

interface TrackmaniaMapExtended extends TrackmaniaMap {
	authorName: string
}

function translateTextStyling(text: string) {
    const controlCharacterRegex = /\$(w|n|o|i|t|s|g|z|\$)/g;
    const colorRegex = /\$(0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F){3}/g;
    return text.replaceAll(controlCharacterRegex, "").replaceAll(colorRegex, "");
}

export default function MapFinder() {
	const [mapData, setMapData] = useState<TrackmaniaMapExtended | undefined>();
	const [loading, setLoading] = useState<boolean>(false);

	async function findMap() {
		const maniaData = await FindRandomMap();
		const data = await fetchMap(maniaData.Results[0].OnlineMapId);
		if (!data) {
			setLoading(false);
			return;
		}

		let name = 'Unknown';
		const nameResponse = await fetchDisplayNameFromAccountId([data.author])
		if (nameResponse && nameResponse.has(data.author)) {
			name = nameResponse.get(data.author) as string;
		}
		
		const extra =  {...data, authorName: name}

		setLoading(false);
		return setMapData(extra);
	}

	return (
		<>
			<Header 
				header="Map finder" 
				label="Here you can find a random map from Trackmania Exchange." 
			/>

			<div className="flex flex-col lg:w-1/3">
				<Button type="button" className="w-fit mt-2" onClick={() => findMap()}>Find map</Button>

				<div className="mt-8 lg:w-[500px]">
					{mapData ? 
					<>
						<p>{translateTextStyling(mapData.name)}</p>
						<p>By {mapData.authorName}</p>
						<Image src={mapData.thumbnailUrl} width="0" height="0" sizes="100vw" className="w-full h-auto" alt="Thumbnail" />
					</>
					: (loading && <SkeletonCard />)}
				</div>
			</div>
		</>
	);
}