import axios from 'axios';
import { getPayloadFromAccessToken, decodeJWT } from '@/util/jwtUtil';

let accessToken = null as string | null;

const nadeoOAuthClient = axios.create({
	baseURL: "https://api.trackmania.com",
	headers: {
    	"User-Agent": "Trackmania with Friends / duedreng3n / https://github.com/GarridoY/tm-with-friends"
  	}
});

// Add a request interceptor
nadeoOAuthClient.interceptors.request.use(
	async function (config) {
		if (!accessToken) {
			const authResponse = await fetchNadeoOAuthAccessToken();
            if (!authResponse) {
                return config;
            }
			accessToken = authResponse.access_token;
			config.headers.Authorization = "Bearer " + accessToken;
			return config;
		}

		// Decode access token to retreive JWT information
		const payload = getPayloadFromAccessToken(accessToken);
		const jwt = decodeJWT(payload);

		// Fetch new access token if expired
		const expired = Date.now() > new Date(jwt.exp * 1000).getTime();
		if (expired) {
			// Access token is Base64 encoded on retrieval
			const authResponse = await fetchNadeoOAuthAccessToken();
            if (!authResponse) {
                return config;
            }
			accessToken = authResponse.access_token;
		}

		config.headers.Authorization = "Bearer " + accessToken;

		return config;
	},
	function (error) {
		console.error(error)
		// Handle the error
		return Promise.reject(error);
	}
);

interface OAuthResponse {
    token_type: string,
    expires_in: number,
    access_token: string
}

// Uses fetch instead of axois as the function is used to get the access token for the nadeo server client, which uses axios. 
// Using fetch here prevents circular dependencies between the two clients.
export async function fetchNadeoOAuthAccessToken(): Promise<OAuthResponse> {
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

export default nadeoOAuthClient;