import MapLookup from "@/components/map-search";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Map - Trackmania with Friends"
};

export default function MapLookupPage() {
    return (
        <>
            <MapLookup />
        </>
    )
}
