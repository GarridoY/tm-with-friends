import { fetchOAuthAccessToken } from '@/services/auth-service';
import axios from 'axios';
import { getPayloadFromAccessToken, decodeJWT } from './jwtUtil';

let accessToken = null as string | null;

const oauthServiceAxiosInstance = axios.create({
	baseURL: "https://api.trackmania.com",
	headers: {
    	"User-Agent": "Trackmania with Friends / duedreng3n / https://github.com/GarridoY/tm-with-friends"
  	}
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

export default oauthServiceAxiosInstance;