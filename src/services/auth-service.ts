interface NadeoServiceResponse {
    accessToken: string,
    refreshToken: string
}

export async function fetchNadeoServices(): Promise<NadeoServiceResponse> {
    const data = await fetch("https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${process.env.ENCODED_CREDENTIALS}`
        },
        body: JSON.stringify({ audience: "NadeoServices" })
    });
    return data.json();
}

interface OAuthResponse {
    token_type: string,
    expires_in: number,
    access_token: string
}

export async function fetchOAuthAccessToken(): Promise<OAuthResponse> {
    const CLIENT_ID = process.env.CLIENT_ID as string;
    const CLIENT_SECRET = process.env.CLIENT_SECRET as string;

    const requestBody = new URLSearchParams({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials'
    });

    const data = await fetch("https://api.trackmania.com/api/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody
    });
    return data.json();
}