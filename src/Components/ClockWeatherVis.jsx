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
  // const [light, setlight] = useState(["#5e4d5d", "#cfcbd9"]);
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
    let timerID = setInterval(() => tick(), 1000);

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

      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <linearGradient id="myGradient2">
            <stop offset="0%" stopColor="#050505" />
            <stop offset="25%" stopColor="#343336" />
            <stop offset="50%" stopColor="#646268" />
            <stop offset="75%" stopColor="#98959f" />
            <stop offset="100%" stopColor="#cfcbd9" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        polar
        scale={{ x: "time" }}
        startAngle={450}
        endAngle={90}
        height={740}
        width={800}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryPolarAxis
          style={{
            axis: { stroke: "whitesmoke", strokeWidth: 0, opacity: "20%" },
            tickLabels: {
              fontSize: 25,
              opacity: "50%",
              padding: -20,
              fill: "#5e4d5d",
            },
          }}
          labelPlacement="perpendicular"
          tickValues={hourly.map((h) => h.datetimeEpoch)}
          tickFormat={(t) => {
            let time = new Date(t * 1000).toLocaleTimeString().slice(0, 2);
            if (time === "00") {
              time = "24";
            }
            return time[0] === "0" ? time.slice(-1) : time;
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
              opacity: "10%",
            },
          }}
        />

        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axisLabel: {
              fontSize: 40,
              padding: 30,
              opacity: "85%",
              fill: "#cfcbd9",
            },
            axis: {
              stroke: "peachpuff",
              strokeWidth: 1.5,
              strokeDasharray: 270,
              opacity: "20%",
            },
            tickLabels: { display: "none" },
          }}
          label={`${Math.ceil(curr.temp).toString()}°`}
          labelPlacement="vertical"
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
          interpolation="basis"
          labelPlacement="horizontal"
          style={{
            data: {
              fill: "none",
              stroke: "url(#myGradient)",
              strokeWidth: "12",
            },
          }}
        />

        <circle
          cx="400"
          cy="370"
          r="105"
          fill="#090909"
          stroke="#c67477"
          strokeWidth={0.1}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={401}
          y={353}
          style={{ fontSize: 24, fill: "#cfcbd9" }}
          lineHeight={1.3}
          text={[
            `${new Date(time * 1000).toLocaleTimeString(undefined, {
              hour12: true,
              hour: "numeric",
              minute: "numeric",
            })} `,
            `${new Date(time * 1000).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}`,
          ]}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={473}
          y={401}
          style={{ fontSize: 18, fill: "#cfcbd9", opacity: "70%" }}
          text={curr.conditions}
          transform="skewX(-10)"
        />
      </VictoryChart>
    </>
  );
};

export default ClockWeatherVis;
