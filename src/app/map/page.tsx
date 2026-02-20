"use client";

import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrackmaniaMap } from "@/types/trackmania-map";
import { useState, SyntheticEvent } from "react";
import Image from "next/image";
import { translateTextStyling } from "@/util/trackmaniaMapUtil";
import { useGetMap } from "@/hooks/useMaps";
import { useGetDisplayNamesFromAccountIds } from "@/hooks/useAccounts";

interface TrackmaniaMapExtended extends TrackmaniaMap {
    authorName: string
}

export default function MapLookupPage() {
    const [mapId, setMapId] = useState<string>("");
    const { data: map, isLoading: isMapLoading, refetch: fetchMap } = useGetMap(mapId, false);
    const { data: displayName, isLoading: isDisplayNameLoading } = useGetDisplayNamesFromAccountIds(map ? map.author : "", !!map);

    const mapWithAuthorName = map && displayName ? {...map, authorName: displayName} as TrackmaniaMapExtended : null;

    async function handleClick(event: SyntheticEvent) {
        event.preventDefault();

        await fetchMap();
    }

    const tryFeature = () => {
        setMapId('1642ef95-643a-44b8-ba94-8377aea6e5ba'); // https://trackmania.exchange/mapshow/178497
    }
    
    return (
        <>
            <div className="flex flex-col lg:flex-row lg:space-x-4">

                <div className="flex lg:w-1/3 flex-col">
                    <Header 
                        header="Map lookup" 
                        label="View basic information about a specific map" 
                    />

                    <Button type="button" className="w-fit mb-12" onClick={tryFeature}>Fill form with example data</Button>
                    
                    <div className="flex flex-col">
                        <Label htmlFor="mapId" className="pb-2">Map ID</Label>
                        <Input type="text" id="mapId" placeholder="Map ID" value={mapId} onChange={(e) => setMapId(e.target.value)} />

                        <div className="pt-4">
                            <Button type="button" className="w-full" onClick={handleClick}>Submit</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 lg:w-[500px]">
                    {mapWithAuthorName ? 
                    <>
                        <p>{translateTextStyling(mapWithAuthorName.name)}</p>
                        <p>By {mapWithAuthorName.authorName}</p>
                        <Image src={mapWithAuthorName.thumbnailUrl} width="0" height="0" sizes="100vw" className="w-full h-auto" alt="Thumbnail" />
                    </>
                    : (isMapLoading || isDisplayNameLoading ? <SkeletonCard /> : null)}
                </div>
            </div>
        </>
    )
}