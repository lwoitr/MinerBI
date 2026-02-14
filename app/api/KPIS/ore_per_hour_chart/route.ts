import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH ore_stats AS (
  SELECT TOP 100
    "timestamp",
    ore_counter_kg,
    lag(ore_counter_kg, 6, ore_counter_kg) OVER (ORDER BY "timestamp") AS hour_ago
  FROM ore_sensor
  WHERE miner_id = {minerId: String}
  ORDER BY "timestamp" DESC
  
)

SELECT TOP 24
  "timestamp",
  (ore_counter_kg - hour_ago) AS ore_per_hour
FROM ore_stats

    `,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();
  return Response.json(data);
}
