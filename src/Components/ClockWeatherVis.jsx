import React, { Component } from "react";
import { useEffect, useState } from "react";

import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryLine,
  VictoryLabel,
} from "victory";

import { fecth24HForecast } from "../api";

const ClockWeatherVis = () => {
  const [hourly, setHourly] = useState();

  const [curr, setCurr] = useState();

  const [sunData, setSunData] = useState();

  const [description, setDescrption] = useState();

  const [minMax, setMinMax] = useState();

  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(new Date().getTime() / 1000);

  useEffect(() => {
    fecth24HForecast().then((data) => {
      setHourly(data.hourlyForecast);
      setMinMax(findMinMaxTemp(data.hourlyForecast));
      setDescrption(data.description);
      setCurr(data.currWeather);
      setSunData(findSunPhases(data.sunrise, data.sunset));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setTime(new Date().getTime() / 1000);
  }

  const findMinMaxTemp = (arrOfObjs) => {
    const temps = arrOfObjs.map((d) => {
      return d.temp;
    });
    const sorted = temps.sort((a, b) => a - b);
    let [min] = sorted;
    min = Math.floor(min);
    const max = Math.ceil(sorted[sorted.length - 1]);
    return { min, max };
  };

  const findSunPhases = (a, b) => {
    const diff = b - a;
    const hours = Math.floor(diff / 3600);
    const step = Math.floor(diff / hours);
    const data = [{ x: a, y: 1 }];
    for (let i = 0; i < hours - 2; i++) {
      data.push({
        x: Math.floor(data[i].x + step),
        y: i <= 7 ? data[i].y + 1 : data[i].y - 1,
      });
    }
    data.push({ x: b, y: data[data.length - 1].y - 1 });
    return data;
  };

  if (loading) return <p>loader</p>;

  return (
    <div className="App">
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor="red" />
            <stop offset="50%" stopColor="orange" />
            <stop offset="100%" stopColor="gold" />
          </linearGradient>
        </defs>
      </svg>

      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="myGradient2">
            <stop offset="0%" stop-color="#3182ce" />
            <stop offset="14.29%" stop-color="#348fc5" />
            <stop offset="28.57%" stop-color="#389ac2" />
            <stop offset="42.86%" stop-color="#3ca5c1" />
            <stop offset="57.14%" stop-color="#41b0c2" />
            <stop offset="71.43%" stop-color="#45bbc3" />
            <stop offset="100%" stop-color="#4fd1c5" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        polar
        scale={{ x: "time" }}
        startAngle={450}
        endAngle={90}
        domainPadding={{ y: 5 }}
      >
        <VictoryPolarAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fontSize: 7, padding: 5 },
          }}
          labelPlacement="perpendicular"
          tickValues={hourly.map((h) => h.datetimeEpoch)}
          tickFormat={(t) => {
            let test = new Date(t * 1000).toLocaleTimeString().slice(0, 2);
            if (test === "00") {
              test = "24";
            }
            return test[0] === "0" ? test.slice(-1) : test;
          }}
        />

        <VictoryLine
          interpolation="basis"
          domain={{
            y: [-10, 30],
            x: [sunData[0].x, sunData[sunData.length - 1].x],
          }}
          data={sunData}
          style={{
            data: {
              stroke: "none",
              fill: "grey",
              opacity: "15%",
            },
          }}
          animate={{ duration: 3000, easing: "cubic" }}
        />

        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axis: {
              stroke: "black",
              strokeWidth: "1.5",
            },
            tickLabels: { display: "none" },
          }}
          label={Math.ceil(curr.temp) + "°"}
        />

        <circle
          cx="225"
          cy="150"
          r="30"
          fill="white"
          stroke="black"
          strokeWidth={0.5}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={226}
          y={151}
          style={{ fontSize: 7, color: "white" }}
          text={[
            [
              `${new Date(time * 1000).toDateString().slice(4, 10)} : `,
              `${new Date(time * 1000).toTimeString().slice(0, 8)} `,
            ],
            `${curr.conditions}`,
          ]}
        />

        <VictoryArea
          domain={{
            y: [minMax.min, minMax.max],
            x: [
              hourly[0].datetimeEpoch,
              hourly[hourly.length - 1].datetimeEpoch,
            ],
          }}
          data={hourly}
          x={"datetimeEpoch"}
          y={"temp"}
          interpolation={"basis"}
          labelPlacement="horizontal"
          style={{
            data: {
              fill: "none",
              stroke: "url(#myGradient)",
              strokeWidth: "0.3",
            },
            labels: {
              fontSize: 5,
              padding: -13,
              opacity: "50%",
            },
          }}
          animate={{ duration: 3000, easing: "cubic" }}
        />
      </VictoryChart>
    </div>
  );
};

export default ClockWeatherVis;
