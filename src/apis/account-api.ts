"use server"

import nadeoOAuthClient from "@/apis/clients/nadeo-oauth-client";

export async function fetchAccountIdFromDisplayName(displayNames: string[]): Promise<Map<string, string> | null> {
    var accountIds = displayNames.map(name => `displayName[]=${name}`).join("&");

    const response = await nadeoOAuthClient(`/api/display-names/account-ids?${accountIds}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }

    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }

    return map;
}

export async function fetchDisplayNameFromAccountId(accountId: string): Promise<string | null> {
    const response = await nadeoOAuthClient(`/api/display-names?accountId[]=${accountId}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }

    // The API returns a map of accountId to displayName, but since we're only querying for one accountId, we can just return the first value in the map.
    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }
    
    return map.values().next().value || null;
}