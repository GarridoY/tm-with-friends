import { fetchOAuthAccessToken } from '@/services/auth-service';
import axios from 'axios';

interface JWT {
	aud: string,
	jti: string,
	iat: number,
	nbf: number,
	exp: number,
	sub: string,
	scopes: string[]
}

let accessToken = null as string | null;

const oauthServiceAxiosInstance = axios.create({
	baseURL: "https://api.trackmania.com"
});

// Add a request interceptor
oauthServiceAxiosInstance.interceptors.request.use(
	async function (config) {
		if (!accessToken) {
			const authResponse = await fetchOAuthAccessToken();
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
			const authResponse = await fetchOAuthAccessToken();
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

function getPayloadFromAccessToken(accessToken: string): string {
    return accessToken.split(".")[1];
}

function decodeJWT(payload: string): JWT {
    return JSON.parse(atob(payload));
}

export default oauthServiceAxiosInstance;