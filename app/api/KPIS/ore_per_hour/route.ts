import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH ore_stats AS (
    SELECT 
        os.ore_counter_kg AS Total_ore,
        lag(os.ore_counter_kg, 6, os.ore_counter_kg) OVER (ORDER BY os.timestamp) AS hour_ago,
        (os.ore_counter_kg - lag(os.ore_counter_kg, 6, os.ore_counter_kg) OVER (ORDER BY os.timestamp)) AS ore_per_hour
    FROM ore_sensor os
    WHERE miner_id = {minerId: String}
    ORDER BY os.timestamp DESC
)
SELECT TOP 2 ore_per_hour
FROM ore_stats
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
