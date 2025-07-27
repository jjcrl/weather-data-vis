import React from 'react';
import { VictoryLabel } from 'victory';

const CHART_CONFIG = {
  CENTER_X: 400,
  CENTER_Y: 370,
  RADIUS: 105,
};

const STYLES = {
  FONT_FAMILY: "GT Maru Trial",
};

const ClockDisplay = ({ time, curr, minMax }) => {
  return (
    <>
      <circle
        cx={CHART_CONFIG.CENTER_X}
        cy={CHART_CONFIG.CENTER_Y}
        r={CHART_CONFIG.RADIUS}
        fill="black"
        stroke="#c67477"
        strokeWidth={0}
      />
      <circle
        cx={CHART_CONFIG.CENTER_X}
        cy={CHART_CONFIG.CENTER_Y}
        r={CHART_CONFIG.RADIUS}
        fill="url(#pattern2)"
        stroke="#c67477"
        strokeWidth={0.3}
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={CHART_CONFIG.CENTER_X}
        y={CHART_CONFIG.CENTER_Y + 1}
        style={{
          fontSize: 50,
          fill: "whitesmoke",
          fontFamily: STYLES.FONT_FAMILY,
          opacity: "75%",
          fontWeight: 600,
        }}
        text={[
          `${new Date(time * 1000).toLocaleTimeString(undefined, {
            hour12: false,
            hour: "numeric",
            minute: "numeric",
          })} `,
        ]}
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={CHART_CONFIG.CENTER_X}
        y={CHART_CONFIG.CENTER_Y + 45}
        style={{
          opacity: "50%",
          fontSize: 15,
          fill: "#cfcbd9",
          fontFamily: STYLES.FONT_FAMILY,
        }}
        text={[
          `${new Date(time * 1000).toLocaleDateString(undefined, {
            weekday: "long",
          })}`,
        ]}
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={CHART_CONFIG.CENTER_X + 2}
        y={CHART_CONFIG.CENTER_Y + 68}
        style={{
          opacity: "30%",
          fontSize: 14,
          fill: "#cfcbd9",
          fontFamily: STYLES.FONT_FAMILY,
        }}
        text={[
          `${new Date(time * 1000).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
          })}`,
        ]}
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={CHART_CONFIG.CENTER_X + 55}
        y={CHART_CONFIG.CENTER_Y - 40}
        style={{
          fontSize: 16,
          fill: "#cfcbd9",
          opacity: "50%",
          fontFamily: STYLES.FONT_FAMILY,
        }}
        text={curr.conditions}
        transform="skewX(-10)"
      />

      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={CHART_CONFIG.CENTER_X + 3}
        y={CHART_CONFIG.CENTER_Y - 70}
        style={{
          fontSize: 15,
          fill: "#cfcbd9",
          opacity: "30%",
          fontFamily: STYLES.FONT_FAMILY,
        }}
        text={`H:${minMax.max}° L:${minMax.min}°`}
      />
    </>
  );
};

export default ClockDisplay;