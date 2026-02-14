"use client";
import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function KPI_operating_time() {
  const { selectedId } = useMiner();

  const [latest, setLatest] = useState<number | string>("—");
  const [prev, setPrev] = useState<number | string>("—");
  const [chartData, setChartData] = useState<{ name: string; hours: number }[]>(
    [],
  );

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/operating_time?id=${selectedId}`)
      .then((r) => r.json())
      .then(
        (
          data: {
            start_ts: string;
            end_ts: string;
            hours: number;
          }[],
        ) => {
          if (!Array.isArray(data) || data.length === 0) {
            setLatest("—");
            setPrev("—");
            setChartData([]);
            return;
          }

          const latestRun = data[0];
          const prevRun = data.length > 1 ? data[1] : null;

          setLatest(latestRun?.hours ?? "—");
          setPrev(prevRun?.hours ?? "—");

          const reversed = data.slice().reverse();

          const formatted = reversed.map((item, index) => ({
            name: `${index + 1}`,
            hours: Number(item.hours.toFixed(2)),
          }));

          setChartData(formatted);
        },
      );
  }, [selectedId]);

  const latestDisplay = latest !== "—" ? Number(latest).toFixed(2) : latest;
  const prevDisplay = prev !== "—" ? Number(prev).toFixed(2) : prev;

  let arrow = null;
  let percentage = "";

  if (
    latest !== "—" &&
    prev !== "—" &&
    !isNaN(Number(latest)) &&
    !isNaN(Number(prev)) &&
    Number(prev) !== 0
  ) {
    const diff = Number(latest) - Number(prev);
    const perc = (diff / Number(prev)) * 100;

    percentage = `${Math.abs(perc).toFixed(2)}%`;
    arrow = perc > 0 ? "▲" : perc < 0 ? "▼" : "—";
  }

  const arrowColor =
    arrow === "▲"
      ? "text-green-500"
      : arrow === "▼"
        ? "text-red-500"
        : "text-gray-400";

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
      data: chartData.map((d) => d.name),
      axisLabel: { rotate: 45, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 10, formatter: "{value} h" },
      splitNumber: 3,
      splitLine: { lineStyle: { color: "#6D6A75" } },
    },
    series: [
      {
        data: chartData.map((d) => d.hours),
        type: "bar",
        barWidth: 8,
        itemStyle: {
          color: "#37323E",
        },
      },
    ],
    grid: { left: 45, right: 25, top: 10, bottom: 20 },
  };

  return (
    <div className="bg-[#BFBDC1]  max-w-full min-w-70">
      <div className="bg-[#2c2731] py-4 pb-10">
        <div className="text-2xl px-6 text-[#BFBDC1]">Operating Time:</div>

        <div className="flex items-baseline text-[#DEB841]">
          <div className="text-4xl pl-6 pb-1 pr-1 pt-1 font-bold">
            {latestDisplay}
          </div>
          <div className="text-xl">h</div>
        </div>

        <div className="flex items-baseline text-[#BFBDC1]">
          <div className="text-2xl pl-6 flex items-baseline">{prevDisplay}</div>
          <div className="pl-1">h</div>
          <div className="pl-1">(last run)</div>

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
