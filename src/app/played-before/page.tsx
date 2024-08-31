import MultiRecordsSearch from "@/components/multi-records-search";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Records - Trackmania with Friends"
};

export default function Search() {
    return (
        <>
            <MultiRecordsSearch />
        </>
    )
}