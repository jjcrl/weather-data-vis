import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryGroup,
  VictoryLine,
  VictoryPortal,
  VictoryLabel,
  VictoryTooltip,
  VictoryScatter,
  VictoryContainer,
  VictoryStack,
  VictoryPie,
  VictoryAxis,
  VictoryBar,
} from "victory";

import { fecth24HForecast } from "./api";

const test = new Date();

function App() {
  const [hourly, setHourly] = useState();

  const [curr, setCurr] = useState();

  const [sunData, setSunData] = useState();

  const [description, setDescrption] = useState();

  const [minMax, setMinMax] = useState();

  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(test.getTime() / 1000);

  useEffect(() => {
    fecth24HForecast().then((data) => {
      setHourly(data.hourlyForecast);
      setMinMax(findMinMaxTemp(data.hourlyForecast));
      setDescrption(data.description);
      setCurr(data.currWeather);
      setSunData(func(data.sunrise, data.sunset));
      setLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   setInterval(() => {
  //     updateClock();
  //   }, 60000);
  // }, []);

  const updateClock = () => {
    setTime(test.getTime() / 1000);
  };

  const findMinMaxTemp = (arrOfObjs) => {
    const temps = arrOfObjs.map((d) => {
      return d.temp;
    });
    //sort them hight to low
    const sorted = temps.sort((a, b) => a - b);
    //grab min and round down
    let [min] = sorted;
    min = Math.floor(min);
    //grab max and round up
    const max = Math.ceil(sorted[sorted.length - 1]);
    //return as obj
    return { min, max };
  };

  const func = (a, b) => {
    let diff = b - a;
    diff = diff / 5;
    const data = [{ x: a, y: 10 }];
    for (let i = 0; i < 4; i++) {
      data.push({
        x: data[i].x + diff,
        y: data[i].y < 30 && i < 3 ? data[i].y + 10 : data[i].y - 10,
      });
    }
    data.push({ x: b, y: 10 });
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
            axis: { stroke: "white", strokeWidth: "0.2" },
            tickLabels: { fontSize: 7, padding: -2.5 },
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
        <VictoryScatter
          domain={{
            y: [2, 8],
            x: [
              hourly[0].datetimeEpoch,
              hourly[hourly.length - 1].datetimeEpoch,
            ],
          }}
          data={sunData}
          interpolation="catmullRom"
          style={{ data: { fill: "grey", stroke: "none" } }}
        />
        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axis: {
              stroke: "black",
              strokeWidth: "1.5",
            },
            tickLabels: {
              display: "none",
            },
          }}
        />
        <circle
          cx="225"
          cy="150"
          r="30"
          fill="white"
          stroke="none"
          strokeWidth={0.5}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={225}
          y={140}
          style={{ fontSize: 10, color: "white" }}
          text={`${new Date(time * 1000).toDateString().slice(0, 10)}`}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={225}
          y={150}
          style={{ fontSize: 8, color: "white" }}
          text={`   ${new Date(time * 1000).toTimeString().slice(0, 5)}  ~ ${
            curr.temp
          }°`}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={225}
          y={160}
          style={{ fontSize: 5, color: "white" }}
          text={`${description}`}
        />
        <VictoryArea
          domain={{
            y: [-15, minMax.max + 5],
            x: [
              hourly[0].datetimeEpoch,
              hourly[hourly.length - 1].datetimeEpoch,
            ],
          }}
          data={hourly}
          // labels={hourly.map((h) => h.temp)}
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
        />
      </VictoryChart>
    </div>
  );
}

export default App;
