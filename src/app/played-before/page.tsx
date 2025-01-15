import MultiRecordsSearch from "@/components/multi-records-search";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Records - Trackmania with Friends"
};

export default function Search() {
    return (
        <>
            <Suspense>
                <MultiRecordsSearch />
            </Suspense>
        </>
    )
}