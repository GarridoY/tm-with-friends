"use client"

import { SyntheticEvent, useState } from "react"
import { TrackmaniaRecord, TrackmaniaRecordExtended } from "@/types/trackmania-records";
import { fetchMapRecords } from "@/services/records-service";
import { fetchAccountIdFromDisplayName, fetchDisplayNameFromAccountId } from "@/services/account-service";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Header from "./header";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

interface Data {
    data: TrackmaniaRecordExtended[],
    success: boolean
}
export default function MultiRecordsSearch() {
    const [mapId, setMapId] = useState('');
    const [id1, setId1] = useState('');
    const [id2, setId2] = useState('');
    const [id3, setId3] = useState('');
    const [data, setData] = useState<Data>({ data: [], success: false});
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const accounts = [id1, id2, id3];
        const ids = await fetchAccountIdFromDisplayName(accounts);
        if (!ids) {
            setLoading(false);
            return;
        }

        const data = await fetchMapRecords(
            Object.values(ids), 
            mapId
        );
        if (!data) {
            setLoading(false);
            return;
        }

        const extra = await supplyDisplayName(data);
        const response = {data: extra, success: true}
        setLoading(false);
        return setData(response);
    }

    const handleClick = (event: SyntheticEvent) => {
        event.preventDefault();
        
        setLoading(true);
        setData({ data: [], success: false});

        fetchData();
    }

    async function supplyDisplayName(data: TrackmaniaRecord[]) {
        return await Promise.all(data.map(async (v) => {
            const response = await fetchDisplayNameFromAccountId([v.accountId]) as object;
            const name = Object.values(response)[0] as string;
            return {...v, displayName: name};
        }));
    }

    return (
        <>
            <Header 
                header="Have we played this?" 
                label="Check to see if you and your friends has played a specific map" 
            />

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="mapId">Map ID</Label>
                <Input type="text" name="mapId" placeholder="Map ID" value={mapId} onChange={(e) => setMapId(e.target.value)} />

                <Label htmlFor="id1">Player 1</Label>
                <Input type="text" name="id1" placeholder="Display name" value={id1} onChange={(e) => setId1(e.target.value)} />

                <Label htmlFor="id2">Player 2</Label>
                <Input type="text" name="id2" placeholder="Display name" value={id2} onChange={(e) => setId2(e.target.value)} />

                <Label htmlFor="id3">Player 3</Label>
                <Input type="text" name="id3" placeholder="Display name" value={id3} onChange={(e) => setId3(e.target.value)} />

                <Button type="submit" onClick={handleClick}>Submit</Button>
            </div>

            <Separator className="my-4" />

            <Table className="table-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Achieved on</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                { data.data.length > 0 ? data.data.sort(compareRecords).map((record, index) => {
                    return (
                        <TableRow key={record.mapRecordId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{record.displayName}</TableCell>
                            <TableCell>{millisToTimestamp(record.recordScore.time)}</TableCell>
                            <TableCell>{timestampToDate(record.timestamp)}</TableCell>
                        </TableRow>
                    )
                }) : (loading && <><TableSkeletonCard /><TableSkeletonCard /><TableSkeletonCard /></>)}
                    
                </TableBody>
            </Table>
        </>
    )
}

function TableSkeletonCard() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
        </TableRow>
    )
}

function compareRecords(recordA: TrackmaniaRecordExtended, recordB: TrackmaniaRecordExtended) {
    if (recordA.recordScore.time > recordB.recordScore.time) 
        return 1; 
    else if (recordB.recordScore.time > recordA.recordScore.time) 
        return -1; 
    else 
        return 0;
}

function millisToTimestamp(millis: number): string {
    var ms = millis % 1000;
    millis = (millis - ms) / 1000;
    var secs = millis % 60;
    millis = (millis - secs) / 60;
    var mins = millis % 60;
    var hrs = (millis - mins) / 60;

    return hrs.toString().padStart(2, '0') + ':' + 
        mins.toString().padStart(2, '0') + ':' + 
        secs.toString().padStart(2, '0') + '.' + 
        ms.toString().padStart(3, '0');
}

function timestampToDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
}