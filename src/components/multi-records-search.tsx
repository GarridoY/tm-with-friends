"use client"

import { SyntheticEvent, useState } from "react"
import { TrackmaniaRecord, TrackmaniaRecordExtended } from "@/types/trackmania-records";
import { fetchMapRecords } from "@/services/records-service";
import { fetchAccountIdFromDisplayName, fetchDisplayNameFromAccountId } from "@/services/account-service";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Header from "./header";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Data {
    data: TrackmaniaRecordExtended[],
    success: boolean
}
export default function MultiRecordsSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const playersInputFromNames = (names: string[]) => {
        let players: { id: number, name: string}[] = [];
        let counter = 1;
        for (const name of names) {    
            players = [...players, {id: counter, name: name}];
            counter += 1;
        }
        return players;
    }

    const [mapId, setMapId] = useState(params.has('mapId') ? params.get('mapId') as string : '');
    const [players, setPlayers] = useState(params.getAll('players[]').length > 0 ? 
        playersInputFromNames(params.getAll('players[]')) : 
        [{ id: 1, name: '' }]);
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
        
        updateSearchParams();
    }

    // Input in search params to allow sharing
    const updateSearchParams = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('players[]');
        for (const player of players) {
            if (!params.getAll('players[]').includes(player.name)) {
                params.append('players[]', player.name);
            }
        }
        params.set('mapId', mapId);
        router.push(`${pathname}?${params.toString()}`)
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

    const removePlayer = (playerId: number) => {
        setPlayers([...players.filter(player => player.id != playerId)])
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

            <Button type="button" className="w-fit mb-12" onClick={tryFeature}>Fill form with example data</Button>

            <div className="flex flex-col lg:flex-row lg:space-x-4">

                <div className="flex lg:w-1/3 flex-col">
                    

                    <Label htmlFor="mapId" className="pb-2">Map ID</Label>
                    <Input type="text" name="mapId" placeholder="Map ID" value={mapId} onChange={(e) => setMapId(e.target.value)} />

                    { players.map(player => {
                        return (
                            <div className="flex flex-row items-center" key={player.id}>
                                <div>
                                    <Label htmlFor={'id'+player.id} className="pb-2">Player {player.id}</Label>
                                    <Input type="text" name={'id'+player.id} placeholder="Display name" value={player.name} onChange={(e) => handleNameChange(player.id, e.target.value)} />
                                </div>
                                <Button type="button" className="ml-2 mt-6" onClick={() => removePlayer(player.id)}>%</Button>
                            </div>
                        )
                    })}

                    <Button type="button" className="w-fit mt-2" onClick={addPlayer}>+ Add player</Button>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" onClick={handleClick} disabled={players.length == 0}>{ loading ? 'Loading... ' : 'Submit'}</Button>
                    </div>
                </div>

                <Table className="table-auto mt-8 lg:mt-0 lg:text-sm text-xs">
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
            </div>
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