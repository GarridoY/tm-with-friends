import { fetchNadeoServices } from '@/services/auth-service';
import axios from 'axios';

interface JWT {
    jti: string,
    iss: string,
    iat: number,
    rat: number,
    exp: number,
    aud: string,
    usg: string,
    sid: string,
    sat: number,
    sub: string
    aun: string
    rtk: boolean,
    pce: boolean,
    ubiservices_uid: string
}

let accessToken = null as string | null;

const serverServiceAxiosInstance = axios.create({
	baseURL: "https://prod.trackmania.core.nadeo.online"
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

function getPayloadFromAccessToken(accessToken: string): string {
    return accessToken.split(".")[1];
}

function decodeJWT(payload: string): JWT {
    return JSON.parse(atob(payload));
}

export default serverServiceAxiosInstance;