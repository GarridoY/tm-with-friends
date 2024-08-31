"use client"

import { TrackmaniaRecord } from "@/types/trackmania-records";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";

interface Props {
    placement: number,
    record: TrackmaniaRecordExtended
}
interface TrackmaniaRecordExtended extends TrackmaniaRecord {
    displayName: string
}



export default function RecordView({record, placement}: Props) {
    return (
        <>
            
        </>
    )
}