export const fetch12HForecastData = async () => {
  try {
    const res = await fetch(
      "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&details=true&metric=true",
      {
        method: "GET",
      }
    );

    const data = await res.json();
    const filtered = data.map((d) => {
      let time = Number(d.DateTime.slice(11, 13));
      const temp = Math.ceil(d.Temperature.Value);
      const phrase = d.IconPhrase;

      if (time === 0) {
        time = 12;
        return { time, temp, phrase };
      } else if (time > 12) {
        time = time - 12;
        return { time, temp, phrase };
      } else {
        return { time, temp, phrase };
      }
    });
    return filtered;
  } catch (err) {
    return console.log(err);
  }
};

export const fetchLocData = async () => {
  try {
    const url =
      "http://dataservice.accuweather.com/locations/v1/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&details=true";

    const response = await fetch(url, { method: "GET" });

    return response.json();
  } catch (e) {
    return console.log(e);
  }
};

export const fetchDayForecastData = async () => {
  try {
    const res = await fetch(
      "http://dataservice.accuweather.com/forecasts/v1/daily/1day/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&&metric=true&details=true",
      {
        method: "GET",
      }
    );
    const data = await res.json();

    const forecast = data.DailyForecasts[0];

    const airqual = forecast.AirAndPollen[0].Value;

    const sun = forecast.Sun;

    const uv = forecast.AirAndPollen[5].Value;

    const pollen = forecast.AirAndPollen.reduce((prev, curr) => {
      return prev + curr.Value;
    }, 0);

    return { airqual, pollen, sun, uv };
  } catch (err) {
    return console.log(err);
  }
};

export const fetchCurrData = async () => {
  const url =
    "http://dataservice.accuweather.com/currentconditions/v1/329260?apikey=U3HWtAc8UPNC8DWENtKhAvbRReaKV1Uc&&metric=true&details=true";

  const res = await fetch(url, { method: "GET" });

  const [data] = await res.json();

  const temp = Math.ceil(data.Temperature.Metric.Value);

  const time = new Date(data.EpochTime * 1000).toTimeString().slice(0, 5);

  return { time, temp };
};
