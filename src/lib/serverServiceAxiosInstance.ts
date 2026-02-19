import { fetchNadeoServices } from '@/services/auth-service';
import axios from 'axios';
import { getPayloadFromAccessToken, decodeJWT } from './jwtUtil';

let accessToken = null as string | null;

const serverServiceAxiosInstance = axios.create({
	baseURL: "https://prod.trackmania.core.nadeo.online",
	headers: {
    	"User-Agent": "Trackmania with Friends / duedreng3n / https://github.com/GarridoY/tm-with-friends"
  	}
});

// Add a request interceptor
serverServiceAxiosInstance.interceptors.request.use(
	async function (config) {
		if (!accessToken) {
			console.log("empty token, fetching new token")
			const authResponse = await fetchNadeoServices();
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
			const authResponse = await fetchNadeoServices();
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

export default serverServiceAxiosInstance;