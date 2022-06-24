export const fecth24HForecast = async () => {
  const query =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/manchester/today?unitGroup=metric&include=hours%2Ccurrent&key=EST45QEHPPZ7PDCXEKLA642C4&contentType=json";

  const response = await fetch(query);

  const data = await response.json();

  const [forecast] = data.days;

  const hourlyForecast = forecast.hours;

  const description = forecast.description;

  const sunrise = forecast.sunriseEpoch;

  const sunset = forecast.sunsetEpoch;

  const currWeather = data.currentConditions;

  return { hourlyForecast, description, sunrise, sunset, currWeather };
};

export const fetchAirData = async () => {
  const query =
    "http://dataservice.accuweather.com/forecasts/v1/daily/1day/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&&metric=true&details=true";

  const response = await fetch(query);

  const data = await response.json();

  const [forecast] = data.DailyForecasts;

  const AirAndPollen = forecast.AirAndPollen;

  return AirAndPollen;
};

// export const test = async () => {
//   const url =
//     "https://api-metoffice.apiconnect.ibmcloud.com/v0/forecasts/point/daily?latitude=4.79625196&longitude=18.5002329";

//   const data = await fetch(url, {
//     headers: {
//       "X-IBM-Client-Id": "376b6467b2d0de2332137cbb351f6f0b",
//       "X-IBM-Client-Secret": "e4482f6f6fcea3d7dedaa4c679ccf49a",
//       accept: "application/json",
//     },
//   });

//   const hello = await data.json();

//   console.log(hello);
// };
