"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function Efficiency() {
  const { selectedId } = useMiner();

  const [probTop, setProbTop] = useState(0.03);
  const [uptimePerc, setUptimePerc] = useState(3);
  const [curr, setCurr] = useState(3);
  const [max, setMax] = useState(3);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/KPIS/uptime_perc?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { uptime_percent: number }[]) => {
        setUptimePerc(data[0].uptime_percent ?? 0);
      });

    fetch(`/api/all/hs_prob_top?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { probability: number }[]) => {
        const raw = data[0].probability ?? 0;
        setProbTop(raw > 1 ? raw / 100 : raw);
      });

    fetch(`/api/KPIS/ore_per_hour?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { ore_per_hour: number }[]) => {
        setCurr(data[0].ore_per_hour ?? 0);
      });
    fetch(`/api/all/througput?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { mo: number }[]) => {
        setMax(data[0].mo ?? 0);
      });
  }, [selectedId]);

  const PALETTE = {
    bg: "#BFBDC1",
    gray: "#6D6A75",
    dark: "#37323E",
    gold1: "#DEB841",
    gold2: "#DE9E36",
  };

  const healthNum = useMemo(() => {
    const val = uptimePerc * (1 - probTop);

    if (!isFinite(val)) return 0;
    return Math.max(0, Math.min(100, Number(val)));
  }, [uptimePerc, probTop]);

  const effNum = useMemo(() => {
    if (!max || max === 0) return 0;
    const val = (curr * 100) / max;
    if (!isFinite(val)) return 0;
    return Math.max(0, Math.min(100, Number(val)));
  }, [curr, max]);

  const derivativesHealth = useMemo(() => {
    const dHdUptime = 1 - probTop;
    const dHdProb = -uptimePerc;
    return {
      dHdUptime,
      dHdProb,
    };
  }, [uptimePerc, probTop]);

  const derivativesEff = useMemo(() => {
    const dEdCurr = max === 0 ? 0 : 100 / max;
    const dEdMax = max === 0 ? 0 : (-curr * 100) / (max * max);
    return { dEdCurr, dEdMax };
  }, [curr, max]);

  const optionHealth = {
    tooltip: { show: true, formatter: "{a} <br/>{b} : {c}%" },
    series: [
      {
        name: "Health",
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,

        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.3, PALETTE.dark],
              [0.7, PALETTE.gold1],
              [1, PALETTE.gold2],
            ],
          },
        },

        pointer: {
          length: "60%",
          width: 6,
          itemStyle: {
            color: PALETTE.dark,
            shadowColor: PALETTE.dark,
            shadowBlur: 6,
          },
        },

        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          width: 18,
          itemStyle: {
            color: PALETTE.gray,
          },
        },

        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },

        title: {
          show: true,
          offsetCenter: [0, "80"],
          fontSize: 14,
          color: PALETTE.gray,
          fontWeight: 600,
        },

        detail: {
          valueAnimation: true,
          offsetCenter: [0, "50%"],
          formatter: "{value} %",
          fontSize: 24,
          fontWeight: 700,
          color: PALETTE.dark,
        },

        data: [
          {
            value: Number(healthNum.toFixed(2)),
            name: "Health score", // название для подсказки, но видимый label над стрелкой — title
          },
        ],
      },
    ],
  };

  const optionEff = {
    tooltip: { show: true, formatter: "{a} <br/>{b} : {c}%" },
    series: [
      {
        name: "Efficiency",
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,

        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.5, PALETTE.dark],
              [0.85, PALETTE.gold1],
              [1, PALETTE.gold2],
            ],
          },
        },

        pointer: {
          length: "60%",
          width: 6,
          itemStyle: {
            color: PALETTE.dark,
            shadowColor: PALETTE.dark,
            shadowBlur: 6,
          },
        },

        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          width: 18,
          itemStyle: {
            color: PALETTE.gray,
          },
        },

        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },

        title: {
          show: true,
          offsetCenter: [0, "80"],
          fontSize: 14,
          color: PALETTE.gray,
          fontWeight: 600,
        },

        detail: {
          valueAnimation: true,
          offsetCenter: [0, "50%"],
          formatter: "{value} %",
          fontSize: 24,
          fontWeight: 700,
          color: PALETTE.dark,
        },

        data: [
          {
            value: Number(effNum.toFixed(2)),
            name: "Efficiency",
          },
        ],
      },
    ],
  };

  const format = (v: number) => {
    if (!isFinite(v)) return "0.00";
    const sign = v > 0 ? "+" : "";
    return `${sign}${v.toFixed(2)}`;
  };

  return (
    <div
      className="flex flex-col shadow-2xl shadow-black min-w-100 max-w-full h-full"
      style={{ background: PALETTE.bg }}
    >
      <h3
        className="text-lg font-semibold py-2 px-4"
        style={{ background: PALETTE.dark, color: PALETTE.bg }}
      >
        System Health & Efficiency
      </h3>

      <div className="flex w-full h-full p-2 gap-2">
        {/* Health */}
        <div
          className="w-60 h-full  border"
          style={{
            borderColor: PALETTE.dark,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="h-60 ">
            <ReactECharts
              option={optionHealth}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* блок производных под gauge */}
          <div
            className="px-3 py-2 "
            style={{ background: PALETTE.dark, color: PALETTE.bg }}
          >
            <div className="text-xs mb-1" style={{ color: PALETTE.bg }}>
              <strong>Health details</strong>
            </div>
            <div className="flex justify-between text-[12px]">
              <div>
                Uptime:{" "}
                <span style={{ color: PALETTE.gold2 }}>
                  {uptimePerc.toFixed(2)}%
                </span>
              </div>
              <div>
                Prob top:{" "}
                <span style={{ color: PALETTE.gold1 }}>
                  {(probTop * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-1 text-[12px]">
              <div>
                d(Health)/dUptime ={" "}
                <span style={{ color: PALETTE.gold2 }}>
                  {format(derivativesHealth.dHdUptime)}
                </span>{" "}
                (change per 1% uptime)
              </div>
              <div>
                d(Health)/dProbTop ={" "}
                <span style={{ color: PALETTE.gold1 }}>
                  {format(derivativesHealth.dHdProb)}
                </span>{" "}
                (change per 1.0 probTop)
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div
          className="w-60 h-full border"
          style={{
            borderColor: PALETTE.dark,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className=" h-60">
            <ReactECharts
              option={optionEff}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div
            className="px-3 py-2 "
            style={{ background: PALETTE.dark, color: PALETTE.bg }}
          >
            <div className="text-xs mb-1" style={{ color: PALETTE.bg }}>
              <strong>Efficiency details</strong>
            </div>

            <div className="flex justify-between text-[12px]">
              <div>
                Current:{" "}
                <span style={{ color: PALETTE.gold2 }}>{curr.toFixed(2)}</span>
              </div>
              <div>
                Max:{" "}
                <span style={{ color: PALETTE.gold1 }}>{max.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-1 text-[12px]">
              <div>
                d(Eff)/dCurr ={" "}
                <span style={{ color: PALETTE.gold2 }}>
                  {format(derivativesEff.dEdCurr)}
                </span>{" "}
                <br /> (% per 1 unit curr)
              </div>
              <div>
                d(Eff)/dMax ={" "}
                <span style={{ color: PALETTE.gold1 }}>
                  {format(derivativesEff.dEdMax)}
                </span>{" "}
                <br /> (% per 1 unit max)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
