import { getPayloadFromAccessToken, decodeJWT } from '@/util/jwtUtil';
import axios from 'axios';

let accessToken = null as string | null;

const nadeoServerClient = axios.create({
	baseURL: "https://prod.trackmania.core.nadeo.online",
	headers: {
    	"User-Agent": "Trackmania with Friends / duedreng3n / https://github.com/GarridoY/tm-with-friends"
  	}
});

// Add a request interceptor
nadeoServerClient.interceptors.request.use(
	async function (config) {
		if (!accessToken) {
			console.log("empty token, fetching new token")
			const authResponse = await fetchNadeoServerTokens();
			// TODO What should happen here?
			if (!authResponse) {
				return config;
			}
			accessToken = authResponse.accessToken;
			config.headers.Authorization = "nadeo_v1 t="+accessToken;
			return config;
		}

		// Decode access token to retreive JWT information
		const payload = getPayloadFromAccessToken(accessToken);
		const jwt = decodeJWT(payload);

		// Fetch new access token if expired
		const expired = Date.now() > new Date(jwt.exp * 1000).getTime();
		if (expired) {
			console.log("expired token, fetching new token")
			// Access token is Base64 encoded on retrieval
			const authResponse = await fetchNadeoServerTokens();
			if (!authResponse) {
				return config;
			}
			accessToken = authResponse.accessToken;
		}

		config.headers.Authorization = "nadeo_v1 t="+accessToken;

		return config;
	},
	function (error) {
		console.error(error)
		// Handle the error
		return Promise.reject(error);
	}
);

interface NadeoServiceResponse {
    accessToken: string,
    refreshToken: string
}

// Uses fetch instead of axois as the function is used to get the access token for the nadeo server client, which uses axios. 
// Using fetch here prevents circular dependencies between the two clients.
async function fetchNadeoServerTokens(): Promise<NadeoServiceResponse> {
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

export default nadeoServerClient;