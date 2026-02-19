import axios from 'axios';

const manieExchangeServiceAxiosInstance = axios.create({
	baseURL: "https://trackmania.exchange/api",
	headers: {
    	"User-Agent": "Trackmania with Friends / duedreng3n / https://github.com/GarridoY/tm-with-friends"
  	}
});

// Add a request interceptor
manieExchangeServiceAxiosInstance.interceptors.request.use(
	async function (config) {
		console.log(`${config.method?.toUpperCase()} ${config.url}`)
		return config;
	},
	function (error) {
		console.error(error)
		// Handle the error
		return Promise.reject(error);
	}
);

export default manieExchangeServiceAxiosInstance;