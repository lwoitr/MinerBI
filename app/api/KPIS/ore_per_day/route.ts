import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH stats AS (SELECT 
MAX(os.miner_id),
MAX(os.ore_counter_kg) AS ore,
toDate(os."timestamp") AS dtime
FROM ore_sensor os 
WHERE miner_id = {minerId: String}
GROUP BY dtime
ORDER BY dtime DESC)

SELECT 
    dtime,
    ore,
    ore - lag(ore,1,ore) OVER (ORDER BY dtime) AS per_day
FROM stats
ORDER BY dtime DESC
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
