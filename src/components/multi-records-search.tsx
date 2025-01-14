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
    const [players, setPlayers] = useState([{ id: 1, name: '' }]);
    const [data, setData] = useState<Data>({ data: [], success: false});
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const accounts = players.map(player => player.name);
        const ids = await fetchAccountIdFromDisplayName(accounts);
        if (!ids) {
            setLoading(false);
            return;
        }

        const data = await fetchMapRecords(Array.from(ids.values()), mapId);
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

    const handleNameChange = (id: number, newName: string) => {
        setPlayers(players.map(player =>
            player.id === id ? { ...player, name: newName } : player
        ));
    }

    const supplyDisplayName = async (data: TrackmaniaRecord[]): Promise<TrackmaniaRecordExtended[]> => {
        return await Promise.all(data.map(async (v) => {
            const response = await fetchDisplayNameFromAccountId([v.accountId]);
            if (response && response.has(v.accountId)) {
                return {...v, displayName: response.get(v.accountId) as string};
            } else {
                return {...v, displayName: "Unknown"};
            }
        }));
    }

    const addPlayer = () => {
        setPlayers([...players, { id: players.length + 1, name: '' }])
    }

    const tryFeature = () => {
        setMapId('1642ef95-643a-44b8-ba94-8377aea6e5ba'); // https://trackmania.exchange/mapshow/178497
        setPlayers([ 
            { id: 1, name: 'duedreng3n' },
            { id: 2, name: 'Wirtual' }
        ])
    } 

    return (
        <>
            <Header 
                header="Have we played this?" 
                label="Check to see if you and your friends has played a specific map" 
            />

            <Button type="button" className="w-full mb-4" onClick={tryFeature}>Fill form with example data</Button>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="mapId">Map ID</Label>
                <Input type="text" name="mapId" placeholder="Map ID" value={mapId} onChange={(e) => setMapId(e.target.value)} />

                { players.map(player => {
                    return (
                        <div key={player.id}>
                            <Label htmlFor={'id'+player.id}>Player {player.id}</Label>
                            <Input type="text" name={'id'+player.id} placeholder="Display name" value={player.name} onChange={(e) => handleNameChange(player.id, e.target.value)} />
                        </div>
                    )
                })}

                <Button type="button" className="w-fit" onClick={addPlayer}>+ Add player</Button>

                <div className="pt-4">
                    <Button type="submit" className="w-full" onClick={handleClick}>{ loading ? 'Loading... ' : 'Submit'}</Button>
                </div>
            </div>

            <Separator className="my-4" />

            <Table className="table-auto overflow-hidden lg:text-sm text-xs">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-1">#</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Achieved on</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                { data.success ? data.data.sort(compareRecords).map((record, index) => {
                    return (
                        <TableRow key={record.mapRecordId}>
                            <TableCell className="px-1">{index + 1}</TableCell>
                            <TableCell>{record.displayName}</TableCell>
                            <TableCell>{millisToTimestamp(record.recordScore.time)}</TableCell>
                            <TableCell>{timestampToDate(record.timestamp)}</TableCell>
                        </TableRow>
                    )
                }) : (<><TableSkeletonCard /><TableSkeletonCard /><TableSkeletonCard /></>)}

                { data.success && players.filter(player => !data.data.map(record => record.displayName).includes(player.name)).map((player, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell className="px-1">N/A</TableCell>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                        </TableRow>
                    )  
                })}
                </TableBody>
            </Table>
        </>
    )
}

function TableSkeletonCard() {
    return (
        <TableRow>
            <TableCell className="px-1">
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
    const ms = millis % 1000;
    millis = (millis - ms) / 1000;
    const secs = millis % 60;
    millis = (millis - secs) / 60;
    const mins = millis % 60;
    const hrs = (millis - mins) / 60;

    return hrs.toString().padStart(2, '0') + ':' + 
        mins.toString().padStart(2, '0') + ':' + 
        secs.toString().padStart(2, '0') + '.' + 
        ms.toString().padStart(3, '0');
}

function timestampToDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString();
}