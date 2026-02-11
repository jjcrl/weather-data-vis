const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Location access denied, falling back to Manchester');
        // Fallback to Manchester if user denies permission
        resolve({ lat: 53.4808, lon: -2.2426 });
      }
    );
  });
};









export const fetch24HForecast = async () => {

  try {
    const { lat, lon } = await getUserLocation();

    const query =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/today?unitGroup=metric&include=hours%2Ccurrent&key=${process.env.REACT_APP_VISUAL_CROSSING_KEY}&contentType=json`;

    const response = await fetch(query, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    const [forecast] = data.days;

    const hourlyForecast = forecast.hours;

    const description = forecast.description;

    const sunrise = forecast.sunriseEpoch;

    const sunset = forecast.sunsetEpoch;

    const currWeather = data.currentConditions;

    return { hourlyForecast, description, sunrise, sunset, currWeather };
  } catch (e) {
    console.log(e);
  }
};

export const fetchAirData = async () => {
  try {
    const query =
      "http://dataservice.accuweather.com/forecasts/v1/daily/1day/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&&metric=true&details=true";

    const response = await fetch(query);

    const data = await response.json();

    const [forecast] = data.DailyForecasts;

    const AirAndPollen = forecast.AirAndPollen;

    return AirAndPollen;
  } catch (e) {
    console.error(e);
  }
};

export const test = async () => {
  try {
    const res = await fetch(
      "https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=12.9889055&lng=77.574044",
      {
        method: "GET",
        headers: {
          "x-api-key":
            "493a41a001f30a8c09fe6c499bc250c8fc782e0257908245172de3fe84e93d7f",
          "Content-type": "application/json",
        },
      }
    );

    return res;
  } catch (e) {
    console.log(e);
  }
};
