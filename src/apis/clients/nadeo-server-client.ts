import { getPayloadFromAccessToken, decodeJWT } from '@/util/jwtUtil';
import axios from 'axios';
import { env } from '@/env';
import { NadeoServiceResponseSchema } from '@/schemas/auth';

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
			const authResponse = await fetchNadeoServerTokens();
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
			// Access token is Base64 encoded on retrieval
			const authResponse = await fetchNadeoServerTokens();
			accessToken = authResponse.accessToken;
		}

		config.headers.Authorization = "nadeo_v1 t="+accessToken;

		return config;
	},
	function (error) {
		console.error(error)
		return Promise.reject(error);
	}
);

// Uses fetch instead of axois as the function is used to get the access token for the nadeo server client, which uses axios. 
// Using fetch here prevents circular dependencies between the two clients.
async function fetchNadeoServerTokens() {
    const response = await fetch("https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${env.ENCODED_CREDENTIALS}`
        },
        body: JSON.stringify({ audience: "NadeoServices" })
    });
    const data = await response.json();
    return NadeoServiceResponseSchema.parse(data);
}

export default nadeoServerClient;