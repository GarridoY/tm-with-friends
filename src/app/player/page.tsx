import IdLookup from "@/components/id-lookup";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Player - Trackmania with Friends"
};

export default function PlayerLookup() {
    return (
        <>
            <IdLookup />
        </>
    )
}
