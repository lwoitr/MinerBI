"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function IDoK1() {
  const { selectedId } = useMiner();

  const [maxOre, setMaxOre] = useState<{ date: string; value: number } | null>(
    null,
  );
  const [minOre, setMinOre] = useState<{ date: string; value: number } | null>(
    null,
  );
  const [avgOre, setAvgOre] = useState(4);

  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/ore_per_month?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { dt: string; ore_sum: number }[]) => {
        const formatted = data.map((item) => ({
          time: item.dt,
          value: item.ore_sum,
        }));

        setChartData(formatted);
      })
      .catch(console.error);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/max_ore?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { date: string; delta: number }[]) => {
        if (!data.length) return;
        setMaxOre({ date: data[0].date, value: data[0].delta });
      });

    fetch(`/api/KPIS/min_ore?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { date: string; delta: number }[]) => {
        if (!data.length) return;
        setMinOre({ date: data[0].date, value: data[0].delta });
      });

    fetch(`/api/KPIS/avg_ore?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { avg: number }[]) => {
        if (!data.length) return;
        setAvgOre(data[0].avg);
      });
  }, [selectedId]);

  function calcTrend(values: number[]) {
    if (!values.length) return [];

    const n = values.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    values.forEach((y, i) => {
      sumX += i;
      sumY += y;
      sumXY += i * y;
      sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;

    return values.map((_, i) => slope * i + intercept);
  }

  const values = chartData.map((d) => d.value);
  const trendData = calcTrend(values);

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#BFBDC1",
      textStyle: { color: "#37323E" },
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#DEB841",
          color: "#100e12",
        },
        lineStyle: {
          color: "#37323E",
        },
      },
    },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.time),
      axisLabel: { rotate: 45, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      scale: true,

      axisLabel: { fontSize: 10, formatter: "{value}" },
      splitNumber: 3,
      splitLine: { lineStyle: { color: "#6D6A75" } },
    },

    series: [
      {
        data: values,
        type: "line",
        smooth: false,
        lineStyle: { width: 2, color: "#37323E" },
        showSymbol: false,
        color: "#37323E",
      },

      {
        data: trendData,
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#DE9E36",
          opacity: 0.6,
        },
        z: 10,
      },
    ],
    grid: { left: 65, right: 40, top: 30, bottom: 70 },
  };

  return (
    <div className="pl-2">
      <div className=" w-160 h-full bg-[#BFBDC1] border-[#37323E] border">
        <div className=" flex p-2 ">
          <div className="  h-full flex flex-col items-center   ">
            <div className="shadow-sm shadow-[#BFBDC1] ">
              <div className="border border-[#37323E] w-full">
                <div className="p-2 font-semibold text-sm text-[#37323E] bg-[#BFBDC1] ">
                  Ore mined per month this Year
                </div>
              </div>
              <div className="h-82 w-120 bg-[#BFBDC1] border border-[#37323E] border-t-0 ">
                <ReactECharts
                  option={option}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className=" bg-[#37323E] w-full text-[#100e12] text-sm shadow-sm shadow-[#BFBDC1]">
            <div className="p-2 px-4 ">
              <div className=" font-semibold text-[#BFBDC1]">Stats p/h..</div>
            </div>
            <div className="px-4">
              <div className="mb-2   text-[#BFBDC1] ">
                Max per hour:{" "}
                <div className="text-[#DE9E36]">{maxOre?.value.toFixed(4)}</div>
              </div>
              <div className="mb-2 text-[#BFBDC1] ">
                Min per hour:{" "}
                <div className="text-[#DE9E36]">{minOre?.value.toFixed(4)}</div>
              </div>
              <div className="mb-2 text-[#BFBDC1] ">
                Avg per hour:{" "}
                <div className="text-[#DE9E36]">{avgOre.toFixed(4)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
