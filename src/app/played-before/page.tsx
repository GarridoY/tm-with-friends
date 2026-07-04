"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TrackmaniaRecordExtended } from "@/schemas/trackmania-records";
import { getGroup } from "@/util/localStorageUtil";
import { useGetAccountIdsFromDisplayNames } from "@/hooks/useAccounts";
import { useGetMapRecords } from "@/hooks/useMapRecords";
import { Label } from "@radix-ui/react-label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";

function getKeyByValue(map: Map<string, string>, value: string): string | undefined {
    for (let [key, val] of map.entries()) {
        if (val === value) {
            return key;
        }
    }
    return undefined;
}

export default function PlayedBefore() {
    const router = useRouter();

    const [players, setPlayers] = useState<string[]>([""]);
    const [mapId, setMapId] = useState<string>("");
    const [shouldSearch, setShouldSearch] = useState(false);

    useEffect(() => {
        const groupObj = getGroup();
        if (groupObj) {
            setPlayers(groupObj.members);
        }
    }, []);

    const { data: accountIds, isFetching: loadingAccountIds, isError: isAccountError, error: accountError } = useGetAccountIdsFromDisplayNames(players, shouldSearch);
    const { data: mapRecords, isFetching: loadingRecords, isError: isRecordsError, error: recordsError } = useGetMapRecords(
        Array.from(accountIds?.values() || []),
        mapId,
        shouldSearch && !!accountIds,
    );

    const loading = loadingAccountIds || loadingRecords;

    const mapRecordsData = mapRecords && accountIds
        ? mapRecords.map(record => {
            const displayName = getKeyByValue(accountIds, record.accountId) || "Unknown";
            return {...record, displayName} as TrackmaniaRecordExtended;
        })
        : null;

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        setShouldSearch(true);
    }

    const tryFeature = () => {
        setMapId('1642ef95-643a-44b8-ba94-8377aea6e5ba'); // https://trackmania.exchange/mapshow/178497
        setShouldSearch(false);
        if (players.length == 0) {
            setPlayers([
                'duedreng3n',
                'Wirtual'
            ])
        }
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
                    <Input type="text" name="mapId" placeholder="Map ID" value={mapId} onChange={(e) => {
                        setMapId(e.target.value);
                        setShouldSearch(false);
                    }} />

                    { players.map((player, index) => {
                        return (
                            <div className="flex flex-col items-start mt-4" key={index}>
                                <Label htmlFor={'id'+index} className="pb-2">Player {index + 1}</Label>
                                <Input type="text" name={'id'+index} placeholder="Display name" value={player} disabled />
                            </div>
                        )
                    })}

                    <Button type="button" className="w-fit mt-2" onClick={() => router.push('/group/management')}>Edit group</Button>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" onClick={submit} disabled={loading}>{loading ? 'Loading...' : 'Submit'}</Button>
                    </div>
                </div>

                {isAccountError ?
                <Alert variant="destructive" className="mt-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to fetch players</AlertTitle>
                    <AlertDescription>{accountError?.message}</AlertDescription>
                </Alert>
                : isRecordsError ?
                <Alert variant="destructive" className="mt-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load records</AlertTitle>
                    <AlertDescription>{recordsError?.message}</AlertDescription>
                </Alert>
                :
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

                    { loading && <><TableSkeletonCard /><TableSkeletonCard /><TableSkeletonCard /></>}

                    { !loading && shouldSearch && mapRecordsData !== null && <>
                        { mapRecordsData.length > 0 && mapRecordsData.sort(compareRecords).map((record, index) => {
                            return (
                                <TableRow key={record.mapRecordId}>
                                    <TableCell className="px-1">{index + 1}</TableCell>
                                    <TableCell>{record.displayName}</TableCell>
                                    <TableCell>{millisToTimestamp(record.recordScore.time)}</TableCell>
                                    <TableCell>{timestampToDate(record.timestamp)}</TableCell>
                                </TableRow>
                            )
                        })}

                        { mapRecordsData.length >= 0 && players.filter(player => !mapRecordsData.map(r => r.displayName).includes(player)).map((player, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="px-1">N/A</TableCell>
                                    <TableCell>{player}</TableCell>
                                    <TableCell>N/A</TableCell>
                                    <TableCell>N/A</TableCell>
                                </TableRow>
                            )
                        })}
                    </>}
                    </TableBody>
                </Table>
                }
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