"use client";
import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function KPI_ore_t_w() {
  const { selectedId } = useMiner();

  const [currentTotal, setCurrentTotal] = useState<string | number>("—");
  const [thisWeek, setThisWeek] = useState<string | number>("—");
  const [prevWeek, setPrevWeek] = useState<string | number>("—");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/KPIS/ore_total_week?id=${selectedId}`)
      .then((r) => r.json())
      .then(
        (data: { weeks: string; weekly_growth: number; total: number }[]) => {
          const latest = data[0];
          const previous = data.length > 1 ? data[1] : null;

          setCurrentTotal(latest.total != null ? latest.total : "—");
          setThisWeek(
            latest.weekly_growth != null ? latest.weekly_growth : "—",
          );

          if (previous) {
            setPrevWeek(
              previous.weekly_growth != null ? previous.weekly_growth : "—",
            );
          } else {
            setPrevWeek("—");
          }

          const reversed = data.slice().reverse();

          const formatted = reversed.map((item, index) => ({
            time:
              index === reversed.length - 1
                ? "this week"
                : `${reversed.length - 1 - index} w ago`,
            value: item.weekly_growth / 1000,
          }));

          setChartData(formatted);
        },
      );
  }, [selectedId]);

  const currentTotalDisplay =
    currentTotal !== "—" ? (Number(currentTotal) / 1000).toFixed(1) : "—";

  const thisWeekDisplay =
    thisWeek !== "—" ? (Number(thisWeek) / 1000).toFixed(1) : "—";

  const prevWeekDisplay =
    prevWeek !== "—" ? (Number(prevWeek) / 1000).toFixed(1) : "—";

  let arrow = null;
  let percentage = "";
  if (
    thisWeek !== "—" &&
    prevWeek !== "—" &&
    !isNaN(Number(thisWeek)) &&
    !isNaN(Number(prevWeek)) &&
    Number(prevWeek) !== 0
  ) {
    const diff = Number(thisWeek) - Number(prevWeek);
    const perc = (diff / Number(prevWeek)) * 100;
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
      data: chartData.map((d) => d.time),
      axisLabel: { rotate: 45, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 10, formatter: "{value} T" },
      splitNumber: 3,
      splitLine: { lineStyle: { color: "#6D6A75" } },
    },
    series: [
      {
        data: chartData.map((d) => d.value),
        type: "line",
        smooth: false,
        lineStyle: { width: 2, color: "#37323E" },
        showSymbol: false,
        color: "#37323E",
      },
    ],
    grid: { left: 45, right: 25, top: 10, bottom: 30 },
  };

  return (
    <div className="bg-[#BFBDC1] max-w-full min-w-70">
      <div className="bg-[#2c2731] py-4 ">
        <div className="text-2xl px-6 text-[#BFBDC1]">Total Ore:</div>
        <div className="flex items-baseline text-[#DEB841]">
          <div className="text-4xl pl-6 pb-1 pr-1 pt-1 font-bold">
            {currentTotalDisplay}
          </div>
          <div className="text-xl">T</div>
        </div>
        <div className="flex items-baseline text-[#BFBDC1]">
          <div className="text-md pl-6 flex items-baseline">
            +{thisWeekDisplay}
          </div>
          <div className="pl-1 text-md">T</div>
          <div className="pl-1 text-md">(this week)</div>
          <div className="text-xs">
            {arrow && (
              <span className={`pl-2 ${arrowColor}`}>
                {arrow} {percentage}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline text-[#6D6A75]">
          <div className="text-xs/2 pl-6 flex items-baseline">
            +{prevWeekDisplay}
          </div>
          <div className="pl-1 ">T</div>
          <div className="pl-1">(last week)</div>
        </div>
      </div>

      <div className="pb-3 pt-4 h-40 w-full">
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
