"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type KPISparklineProps = {
  data: number[];
};

export default function KPISparkline({ data }: KPISparklineProps) {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <LineChart width={220} height={125} data={chartData} responsive>
      <Line dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
      <XAxis dataKey="index" fontSize={12} />
      <YAxis width={16} fontSize={12} />
      <CartesianGrid
        vertical={false}
        horizontal={true}
        stroke="#e5e7eb"
        strokeWidth={0.2}
        strokeDasharray="5 5"
      />
      <Tooltip />
    </LineChart>
  );
}
