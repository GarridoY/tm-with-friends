"use client"

import { fetchAccountIdFromDisplayName } from "@/services/account-service";
import { useState } from "react"

export default function IdLookup() {
    const [id, setId] = useState<string | undefined>();

    async function submit(formData: FormData) {
        const displayName = formData.get("name") as string;
        const data = await fetchAccountIdFromDisplayName([displayName]);
        if (!data) {
            return;
        }
        setId(data.get(displayName))
    }

    return (
        <>
            <form action={submit}>
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            </form>

            <h1>Data</h1>
            {id && 
            <div>
                <p>ID: {id}</p>
            </div>
            }
        </>
    )
}