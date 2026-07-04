"use server"

import { z } from "zod";
import nadeoOAuthClient from "@/apis/clients/nadeo-oauth-client";

const NameMapSchema = z.record(z.string(), z.string());

export async function fetchAccountIdsFromDisplayNames(displayNames: string[]) {
    const accountIds = displayNames.map(name => `displayName[]=${name}`).join("&");

    const response = await nadeoOAuthClient(`/api/display-names/account-ids?${accountIds}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch account IDs (${response.status})`); }

    const json = NameMapSchema.parse(response.data);
    const map = new Map(Object.entries(json));
    if (map.size == 0) { return null; }

    return map;
}

export async function fetchDisplayNameFromAccountId(accountId: string) {
    const response = await nadeoOAuthClient(`/api/display-names?accountId[]=${accountId}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch display name (${response.status})`); }

    // The API returns a map of accountId to displayName, but since we're only querying for one accountId, we can just return the first value in the map.
    const json = NameMapSchema.parse(response.data);
    const map = new Map(Object.entries(json));
    if (map.size == 0) { return null; }
    
    return map.values().next().value || null;
}