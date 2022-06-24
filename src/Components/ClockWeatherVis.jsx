import React from "react";
import { useEffect, useState } from "react";

import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryLine,
  VictoryLabel,
  VictoryContainer,
} from "victory";

import { fecth24HForecast } from "../api";

const ClockWeatherVis = () => {
  const [hourly, setHourly] = useState();

  const [curr, setCurr] = useState();

  const [sunData, setSunData] = useState();

  // const [description, setDescrption] = useState();

  const [minMax, setMinMax] = useState();

  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(new Date().getTime() / 1000);

  useEffect(() => {
    fecth24HForecast().then((data) => {
      setHourly(data.hourlyForecast);
      setMinMax(findMinMaxTemp(data.hourlyForecast));
      // setDescrption(data.description);
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
    <>
      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor="#f8bb60" />
            <stop offset="50%" stopColor="#e95b37" />
            <stop offset="100%" stopColor="#c67477" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        polar
        scale={{ x: "time" }}
        startAngle={450}
        endAngle={90}
        domainPadding={{ y: 0 }}
        height={740}
        width={800}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryPolarAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fontSize: 25, opacity: "10%", padding: -10 },
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
              fill: "peachpuff",
              opacity: "20%",
            },
          }}
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
              strokeWidth: "2",
            },
          }}
        />
        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axisLabel: { fontSize: 35, padding: 33, opacity: "75%" },
            axis: {
              stroke: "black",
              strokeWidth: "0.1",
              strokeDasharray: 285,
            },
            tickLabels: { display: "none" },
          }}
          label={`${Math.ceil(curr.temp).toString()}°`}
          labelPlacement="horizontal"
        />

        <circle
          cx="400"
          cy="370"
          r="100"
          fill="white"
          stroke="black"
          strokeWidth={0.1}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={400}
          y={370}
          style={{ fontSize: 20, color: "white" }}
          text={[
            [
              `${new Date(time * 1000).toDateString().slice(4, 10)} : `,
              `${new Date(time * 1000).toTimeString().slice(0, 8)} `,
            ],
            `${curr.conditions}`,
          ]}
        />
      </VictoryChart>
    </>
  );
};

export default ClockWeatherVis;
