"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

type ApiDataItem = {
  value: number;
  day: string;
  month: number;
};

export default function Heatmap() {
  const { selectedId } = useMiner();
  const [chartData, setChartData] = useState<[number, number, number][]>([]);

  const [visualMapMin, setVisualMapMin] = useState(0);
  const [visualMapMax, setVisualMapMax] = useState(1);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/wmo?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { [key: string]: ApiDataItem }) => {
        const points: [number, number, number][] = [];

        Object.values(data).forEach((item) => {
          const date = new Date(item.day);
          const day = date.getDate();
          const month = date.getMonth();
          points.push([day - 1, month, item.value]);
        });

        setChartData(points);

        if (points.length > 0) {
          const values = points.map((p) => p[2]);
          setVisualMapMin(Math.min(...values));
          setVisualMapMax(Math.max(...values));
        }
      });
  }, [selectedId]);

  const option = {
    tooltip: {
      position: "top",
      formatter: (params: { value: [number, number, number] }) =>
        `Value: ${params.value[2]}<br>Month: ${params.value[1] + 1}<br>Day: ${params.value[0]}`,
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 31 }, (_, i) => i + 1),
      name: "Day",
    },
    yAxis: {
      type: "category",
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      name: "Month",
    },
    visualMap: {
      min: visualMapMin,
      max: visualMapMax,

      calculable: true,
      orient: "horizontal",
      left: "center",
      top: "-6",
      color: ["#37323E", "#6D6A75", "#DEB841", "#DE9E36"],
    },
    series: [
      {
        name: "Heatmap",
        type: "heatmap",
        data: chartData,
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    grid: {
      left: 60,
      right: 60,
      top: 60,
      bottom: 10,
      containLabel: true,
    },
  };

  return (
    <div className="h-100 w-full bg-[#BFBDC1] p-2 ">
      <div className="border border-black h-full w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
