// --- Prepare Elements --- //
const input = document.querySelector("input");
const button = document.querySelector("button");
const cityName = document.querySelector(".city-name");
const warning = document.querySelector(".warning");
const photo = document.querySelector(".photo");
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const humidity = document.querySelector(".humidity");
// <<<--->>> API Weather https://openweathermap.org/current API Geocoding https://openweathermap.org/api/geocoding-api <<<--->>> //
// --- Weather API URL w/o City latitude , longitude --- //
const WEATHER_API_LINK = "https://api.openweathermap.org/data/2.5/weather?";
const WEATHER_API_KEY = "&appid=fae8277a45a9a6c9a9f2662fa0b120cc";
const WEATHER_API_UNITS = "&units=metric";
// --- Geocoding API URL w/o city name  --- //
const GEO_API_LINK = "http://api.openweathermap.org/geo/1.0/direct?q=";
const GEO_API_KEY = "&appid=fae8277a45a9a6c9a9f2662fa0b120cc";
const GEO_API_LIMIT = "&limit=1";
// <<<--->>> Geocoding API <<<--->>> //
// --- Geocoding API change city name (from input) to geographical coordinates (latitude , longitude )   --- //
const cityGeoLoc = async () => {
	const city = input.value || "Augsburg"; // <-- default city
	const GEO_URL = GEO_API_LINK + city + GEO_API_LIMIT + GEO_API_KEY;
	const cityLon = await axios
		.get(GEO_URL)
		.then(res => {
			return res.data[0].lon;
		})
		.catch(() => (warning.textContent = "Bitte richtige Stadt eingeben"));
	const cityLat = await axios
		.get(GEO_URL)
		.then(res => {
			return res.data[0].lat;
		})
		.catch(() => (warning.textContent = "Bitte richtige Stadt eingeben"));
	return [cityLon, cityLat];
};
// <<<--->>> Weather API <<<--->>> //
// --- getWeather() get from Geocoding API latitude , longitude and put in to Weather API URL --- //
const getWeather = async () => {
	const loc = await cityGeoLoc();
	const cityLon = "&lon=" + loc[0];
	const cityLat = "lat=" + loc[1];
	const URL = WEATHER_API_LINK + cityLat + cityLon + WEATHER_API_KEY + WEATHER_API_UNITS;
	warning.textContent = "";
	input.value = "";
// --- Get data from Weather API and put in to App --- //	
	axios 
		.get(URL)
		.then(res => {
			const temp = res.data.main.temp;
			const hum = res.data.main.humidity;
			const city = res.data.name;
			const id = res.data.weather[0].id;
			cityName.textContent = city;
			temperature.textContent = Math.floor(temp) + "°C";
			humidity.textContent = hum + "%";

			if (id >= 200 && id <= 299) {
				weather.textContent = "Gewitter";
				photo.setAttribute("src", "./img/thunderstorm.png");
			} else if (id >= 300 && id <= 399) {
				weather.textContent = "Nieselregen";
				photo.setAttribute("src", "./img/drizzle.png");
			} else if (id >= 500 && id <= 599) {
				weather.textContent = "Regen";
				photo.setAttribute("src", "./img/rain.png");
			} else if (id >= 600 && id <= 699) {
				weather.textContent = "Schnee";
				photo.setAttribute("src", "./img/ice.png");
			} else if (id >= 700 && id <= 799) {
				weather.textContent = "Nebel";
				photo.setAttribute("src", "./img/fog.png");
			} else if (id === 800) {
				weather.textContent = "Klares Wetter";
				photo.setAttribute("src", "./img/sun.png");
			} else if (id >= 801 && id <= 899) {
				weather.textContent = "Wolken";
				photo.setAttribute("src", "./img/cloud.png");
			} else {
				photo.setAttribute("src", "./img/unknown.png");
			}
		})
		.catch(() => (warning.textContent = "Bitte richtige Stadt eingeben"));
};
// --- Start getWeather() with default city (first run)  --- //
getWeather();
// --- Start getWeather() by Enter on keyboard --- //
const enterCheck = e => {
	if (e.key === "Enter") {
		getWeather();
	}
};
// --- Lisener --- //
input.addEventListener("keyup", enterCheck);
button.addEventListener("click", getWeather);
