"use client"

import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import { TrackmaniaMap } from "@/types/trackmania-map";
import { fetchMap } from "@/services/map-service";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import SkeletonCard from "./skeleton-card";
import { fetchDisplayNameFromAccountId } from "@/services/account-service";
import Header from "./header";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TrackmaniaMapExtended extends TrackmaniaMap {
    authorName: string
}

function translateTextStyling(text: string) {
    const controlCharacterRegex = /\$(w|n|o|i|t|s|g|z|\$)/g;
    const colorRegex = /\$(0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F){3}/g;
    return text.replaceAll(controlCharacterRegex, "").replaceAll(colorRegex, "");
}

export default function MapLookup() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const [mapId, setMapId] = useState(params.has('mapId') ? params.get('mapId') as string : '');
    const [mapData, setMapData] = useState<TrackmaniaMapExtended | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchData() {
        const data = await fetchMap(mapId);
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
            <div className="flex flex-row space-x-12">

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

                {mapData ? 
                <div>
                    <p>{translateTextStyling(mapData.name)}</p>
                    <p>By {mapData.authorName}</p>
                    <Image src={mapData.thumbnailUrl} width={500} height={250} alt="Thumbnail" />
                </div>
                : (loading && <SkeletonCard />)}
            </div>
        </>
    )
}