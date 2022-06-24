import React, { Component, useEffect, useState } from "react";
import { VictoryChart, VictoryPie } from "victory";
import { fecth24HForecast, fetchAirData, test } from "../api";

const PollenGauge = () => {
  const [airData, setAirData] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    fetchAirData().then((data) => {
      const pollen = data.map((d) => {
        return { x: d.Name, y: d.Value + 1 };
      });

      pollen.pop();

      pollen.shift();

      setAirData(pollen);

      pollen.push({ x: "void", y: 6 });
      setLoading(false);
    });
  }, []);

  if (loading) return <p>loading</p>;

  return (
    <>
      <VictoryPie
        data={airData}
        innerRadius={100}
        startAngle={90}
        endAngle={-90}
        radius={70}
        cornerRadius={20}
      />
    </>
  );
};

export default PollenGauge;
