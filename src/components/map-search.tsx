"use client"

import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import { TrackmaniaMap } from "@/types/trackmania-map";
import { fetchMap } from "@/services/map-service";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import SkeletonCard from "./skeleton-card";
import { fetchDisplayNameFromAccountId } from "@/services/account-service";
import Header from "./header";

interface TrackmaniaMapExtended extends TrackmaniaMap {
    authorName: string
}

function translateTextStyling(text: string) {
    const controlCharacterRegex = /\$(w|n|o|i|t|s|g|z|\$)/g;
    const colorRegex = /\$(0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F){3}/g;
    return text.replaceAll(controlCharacterRegex, "").replaceAll(colorRegex, "");
}

export default function MapLookup() {
    const [mapId, setMapId] = useState('');
    const [mapData, setMapData] = useState<TrackmaniaMapExtended | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchData() {
        const data = await fetchMap(mapId);
        if (!data) {
            setLoading(false);
            return;
        }

        const name = Object.values(await fetchDisplayNameFromAccountId([data.author]) as object)[0] as string;
        const extra =  {...data, authorName: name}

        setLoading(false);
        return setMapData(extra);
    }

    function handleClick(event: SyntheticEvent) {
        event.preventDefault();
        setMapData(undefined);
        setLoading(true);
        fetchData();
    }
    
    return (
        <>
            <Header 
                header="Map lookup" 
                label="View basic information about a specific map" 
            />
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="mapId">Map ID</Label>
                <div className="flex">
                    <Input type="text" id="mapId" placeholder="Map Id" value={mapId} onChange={(e) => setMapId(e.target.value)} />
                    <Button type="button" onClick={handleClick}>Submit</Button>
                </div>
            </div>

            <Separator className="my-4" />
            
            {mapData ? 
            <div>
                <p>{translateTextStyling(mapData.name)}</p>
                <p>By {mapData.authorName}</p>
                <Image src={mapData.thumbnailUrl} width={500} height={250} alt="Thumbnail" />
            </div>
            : (loading && <SkeletonCard />)}
        </>
    )
}