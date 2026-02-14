"use client";
import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function KPI_ore_remaining() {
  const { selectedId } = useMiner();

  const [latest, setLatest] = useState<number | string>("—");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/ore_remaining?id=${selectedId}`)
      .then((r) => {
        if (!r.ok) {
          console.error("API error:", r.status);
          return [];
        }
        return r.json();
      })
      .then((data: { ore_rem: number; dt2: string }[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setLatest("—");
          setChartData([]);
          return;
        }

        const latestValue = data[0]?.ore_rem ?? "—";
        setLatest(latestValue);

        const reversed = data.slice().reverse();

        const formatted = reversed.map((item, index) => ({
          time:
            index === reversed.length - 1
              ? "now"
              : `${reversed.length - 1 - index} d ago`,
          value: item.ore_rem,
        }));

        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLatest("—");
        setChartData([]);
      });
  }, [selectedId]);

  const latestInMillions =
    latest !== "—"
      ? (Number(latest) / 1000000).toFixed(3).replace(/\.?0+$/, "")
      : "—";

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
      axisLabel: {
        fontSize: 10,
        formatter: (value: number) => `${(value / 1000000).toFixed(1)} T`,
      },
      splitNumber: 2,
      splitLine: { lineStyle: { color: "#6D6A75" } },
    },
    series: [
      {
        data: chartData.map((d) => d.value.toFixed(2)),
        type: "line",
        smooth: true,
        lineStyle: { width: 2, color: "#37323E" },
        showSymbol: false,
        color: "#37323E",
      },
    ],
    grid: { left: 45, right: 25, top: 10, bottom: 30 },
  };

  return (
    <div className="bg-[#BFBDC1] max-w-full min-w-70">
      <div className="bg-[#2c2731] py-4 pb-18">
        <div className="text-2xl px-6 text-[#BFBDC1]">Remaining Ore:</div>

        <div className="flex items-baseline text-[#DEB841]">
          <div className="text-4xl pl-6 pb-1 pr-1 pt-1 font-bold">
            {latestInMillions}
          </div>
          <div className="text-xl">T</div>
        </div>
      </div>

      <div className="pb-3 pt-4 h-44 w-full">
        {chartData.length > 0 ? (
          <ReactECharts
            option={option}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            no data to show
          </div>
        )}
      </div>
    </div>
  );
}
