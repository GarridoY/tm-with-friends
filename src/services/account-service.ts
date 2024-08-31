"use server"

export async function fetchAccountIdFromDisplayName(displayNames: string[]): Promise<Map<string, string> | null> {
    let accountIds = "";
    for (let i = 0; i < displayNames.length; i++) {
        accountIds += "displayName[]="+displayNames[i];
        if (i != (displayNames.length - 1)) {
            accountIds += "&";
        }
    }

    const data = await fetch(`https://api.trackmania.com/api/display-names/account-ids?${accountIds}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.OAUTH_ACCESS_TOKEN}`
        }
    });
    if (!data.ok) { return null; }
    const json = await data.json();
    const map = new Map(json) as Map<string, string>;
    if (map.size == 0) {return null; }

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

    const data = await fetch(`https://api.trackmania.com/api/display-names?${displayNames}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.OAUTH_ACCESS_TOKEN}`
        }
    });
    if (!data.ok) { return null; }
    const json = await data.json();
    const map = new Map(json) as Map<string, string>;
    if (map.size == 0) {return null; }
    
    return map;
}