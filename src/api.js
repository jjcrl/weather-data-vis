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
