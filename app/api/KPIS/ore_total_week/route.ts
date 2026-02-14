import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH weekly_stats AS (SELECT 
    dateTrunc('week', toDateTime(os.timestamp)) AS weeks,
    MIN(os.ore_counter_kg) AS startt,
    MAX(os.ore_counter_kg) AS endd
FROM ore_sensor os
WHERE os.miner_id = {minerId: String}
GROUP BY weeks 
ORDER BY weeks DESC)

SELECT 
weeks,
(endd - startt) AS weekly_growth,
endd AS total

FROM weekly_stats

    `,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();
  return Response.json(data);
}
