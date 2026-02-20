"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import SkeletonCard from "@/components/skeleton-card";
import Header from "@/components/header";
import Link from "next/link";
import { MapSearchResult } from "@/apis/map-api";
import { translateTextStyling } from "@/util/trackmaniaMapUtil";
import { useGetRandomMap } from "@/hooks/useMaps";

export default function MapFinder() {
	const { data: map, isLoading: loading, refetch: findRandomMap } = useGetRandomMap(false);
	const [foundMaps, setFoundMaps] = useState<MapSearchResult[]>([]);

	async function findMap() {
		if (map) {
			setFoundMaps(prev => [...prev, map]);
		}

		await findRandomMap();
	}

	return (
		<>
			<Header 
				header="Map finder" 
				label="Here you can find a random map from Trackmania Exchange." 
			/>

			<div className="flex flex-col">

				<Button type="button" className="w-fit mt-2" onClick={() => findMap()} disabled={loading}>Find a random RPG map{loading ? "..." : ""}</Button>

				{map && (
				<>
					<hr className="mt-4"/>

					<div className="flex flex-row gap-12 mt-4">
						<div className="lg:w-1/2">
							{map ? 
							<>
								<Link href={`https://trackmania.exchange/mapshow/${map.MapId}`}>{translateTextStyling(map.Name)} - {map.OnlineMapId}</Link>
								<p>By {map.Uploader.Name}</p>
								<Image src={`https://trackmania.exchange/mapthumb/${map.MapId}`} width="0" height="0" sizes="100vw" className="w-full h-auto" alt="Thumbnail" />
							</>
							: (loading && <SkeletonCard />)}
						</div>

						<div className="lg:w-1/2">
							<p>Previous map: {foundMaps.length > 0 ? translateTextStyling(foundMaps[foundMaps.length - 1].Name) : "None"}</p>
							{foundMaps.length > 0 && (
								<p className="text-sm">Found maps: {foundMaps.length}</p>
							)}
						</div>
					</div>
				</>
				)}
			</div>
		</>
	);
}