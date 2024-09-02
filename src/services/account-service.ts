"use server"

import oauthServiceAxiosInstance from "@/lib/oauthServiceAxiosInstance";

export async function fetchAccountIdFromDisplayName(displayNames: string[]): Promise<Map<string, string> | null> {
    let accountIds = "";
    for (let i = 0; i < displayNames.length; i++) {
        accountIds += "displayName[]="+displayNames[i];
        if (i != (displayNames.length - 1)) {
            accountIds += "&";
        }
    }

    const response = await oauthServiceAxiosInstance(`/api/display-names/account-ids?${accountIds}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }

    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }

    return map;
}

export async function fetchDisplayNameFromAccountId(accountIds: string[]): Promise<Map<string, string> | null> {
    let displayNames = "";
    for (let i = 0; i < accountIds.length; i++) {
        displayNames += "accountId[]="+accountIds[i];
        if (i != (accountIds.length - 1)) {
            displayNames += "&";
        }
    }

    const response = await oauthServiceAxiosInstance.get(`/api/display-names?${displayNames}`).catch(err => {
        console.error(err);
        return null;
    });
    if (!response || response.status !== 200) { return null; }

    const json = response.data;
    const map = new Map(Object.entries(json)) as Map<string, string>;
    if (map.size == 0) { return null; }
    
    return map;
}