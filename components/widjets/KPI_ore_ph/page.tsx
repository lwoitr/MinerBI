"use client";
import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function KPI_ore_ph() {
  const { selectedId } = useMiner();

  const [currentValue, setCurrentValue] = useState<string | number>("—");
  const [prevValue, setPrevValue] = useState<string | number>("—");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/ore_per_hour?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { ore_per_hour: number }[]) => {
        const currRaw = data[0]?.ore_per_hour;
        const prevRaw = data[1]?.ore_per_hour;

        const curr = currRaw != null ? currRaw : "—";
        const prev = prevRaw != null ? prevRaw : "—";

        setCurrentValue(curr);
        setPrevValue(prev);
      });
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/ore_per_hour_chart?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { ore_per_hour: number | null }[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setChartData([]);
          return;
        }

        const reversed = data.slice().reverse();

        const formatted = reversed.map((item, index) => ({
          time:
            index === reversed.length - 1
              ? "now"
              : `${reversed.length - 1 - index} h ago`,

          value:
            item.ore_per_hour != null && !isNaN(item.ore_per_hour)
              ? Number(item.ore_per_hour)
              : 0,
        }));

        setChartData(formatted);
      });
  }, [selectedId]);

  let arrow = null;
  let percentage = "";
  if (
    currentValue !== "—" &&
    prevValue !== "—" &&
    !isNaN(Number(currentValue)) &&
    !isNaN(Number(prevValue)) &&
    Number(prevValue) !== 0
  ) {
    const diff = Number(currentValue) - Number(prevValue);
    const perc = (diff / Number(prevValue)) * 100;
    percentage = `${Math.abs(perc).toFixed(2)}%`;
    arrow = perc > 0 ? "▲" : perc < 0 ? "▼" : "—";
  }

  const arrowColor =
    arrow === "▲"
      ? "text-green-500"
      : arrow === "▼"
        ? "text-red-500"
        : "text-gray-400";

  const latestDisplay =
    currentValue === "—" ? "—" : Number(currentValue).toFixed(1);
  const prevDisplay = prevValue === "—" ? "—" : Number(prevValue).toFixed(1);

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
      axisLabel: { fontSize: 10, formatter: "{value} kg" },
      splitNumber: 3,
      splitLine: { lineStyle: { color: "#6D6A75" } },
    },
    series: [
      {
        data: chartData.map((d) => d.value.toFixed(2)),
        type: "line",
        smooth: false,
        lineStyle: { width: 2, color: "#37323E" },
        showSymbol: false,
        color: "#37323E",
      },
    ],
    grid: { left: 55, right: 25, top: 10, bottom: 30 },
  };

  return (
    <div className="bg-[#BFBDC1] max-w-full min-w-70">
      <div className="bg-[#2c2731] py-4 pb-10">
        <div className="text-2xl px-6 text-[#BFBDC1]">Ore per/h:</div>

        <div className="flex items-baseline text-[#DEB841]">
          <div className="text-4xl pl-6 pb-1 pr-1 pt-1 font-bold">
            {latestDisplay}
          </div>
          <div className="text-xl">kg</div>
        </div>

        <div className="flex items-baseline text-[#BFBDC1]">
          <div className="text-2xl pl-6 flex items-baseline">{prevDisplay}</div>
          <div className="pl-1">kg</div>
          <div className="pl-1">(last hour)</div>

          {arrow && (
            <span className={`pl-2 ${arrowColor}`}>
              {arrow} {percentage}
            </span>
          )}
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
