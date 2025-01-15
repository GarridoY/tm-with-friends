import MapLookup from "@/components/map-search";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Map - Trackmania with Friends"
};

export default function MapLookupPage() {
    return (
        <>
            <Suspense>
                <MapLookup />
            </Suspense>
        </>
    )
}
