"use client";

import { fetchDisplayNameFromAccountId, fetchDisplayNameFromAccountIds } from "@/apis/account-api";
import { fetchMap } from "@/apis/map-api";
import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrackmaniaMap } from "@/types/trackmania-map";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, SyntheticEvent } from "react";
import Image from "next/image";
import { translateTextStyling } from "@/util/trackmaniaMapUtil";

interface TrackmaniaMapExtended extends TrackmaniaMap {
    authorName: string
}

export default function MapLookupPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const [mapId, setMapId] = useState(params.has('mapId') ? params.get('mapId') as string : '');
    const [mapData, setMapData] = useState<TrackmaniaMapExtended | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchData() {
        const map = await fetchMap(mapId);
        if (!map) {
            setLoading(false);
            return;
        }

        const authorName = await fetchDisplayNameFromAccountId(map.author)
        const extra =  {...map, authorName: authorName || "Unknown"} as TrackmaniaMapExtended;

        setLoading(false);
        return setMapData(extra);
    }

    function handleClick(event: SyntheticEvent) {
        event.preventDefault();
        setMapData(undefined);
        setLoading(true);
        fetchData();

        updateSearchParams();
    }

    const tryFeature = () => {
        setMapId('1642ef95-643a-44b8-ba94-8377aea6e5ba'); // https://trackmania.exchange/mapshow/178497
    }

    // Input in search params to allow sharing
    const updateSearchParams = () => {
        const params = new URLSearchParams(searchParams);
        params.set('mapId', mapId);
        router.push(`${pathname}?${params.toString()}`)
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
    )
}