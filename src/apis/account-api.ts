"use server"

import nadeoOAuthClient from "@/apis/clients/nadeo-oauth-client";

export async function fetchAccountIdsFromDisplayNames(displayNames: string[]): Promise<Map<string, string> | null> {
    const accountIds = displayNames.map(name => `displayName[]=${name}`).join("&");

    const response = await nadeoOAuthClient(`/api/display-names/account-ids?${accountIds}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch account IDs (${response.status})`); }

    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }

    return map;
}

export async function fetchDisplayNameFromAccountId(accountId: string): Promise<string | null> {
    const response = await nadeoOAuthClient(`/api/display-names?accountId[]=${accountId}`);

    if (response.status !== 200) { throw new Error(`Failed to fetch display name (${response.status})`); }

    // The API returns a map of accountId to displayName, but since we're only querying for one accountId, we can just return the first value in the map.
    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }
    
    return map.values().next().value || null;
}