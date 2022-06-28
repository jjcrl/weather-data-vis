import React, { Component, useEffect, useState } from "react";
import { VictoryChart, VictoryBar } from "victory";
import { fecth24HForecast, fetchAirData, test } from "../api";

const PollenGauge = () => {
  const [airData, setAirData] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    fetchAirData().then((data) => {
      console.log(data);
      const pollen = data.map((d) => {
        return { x: d.Name, y: d.Value + 1 };
      });

      pollen.pop();

      pollen.shift();

      setAirData(pollen);

      setLoading(false);
    });
  }, []);

  if (loading) return <p>loading</p>;

  return (
    <VictoryChart domain={{ xy: [0] }}>
      <VictoryBar data={airData} horizontal />
    </VictoryChart>
  );
};

export default PollenGauge;
