import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
   WITH stats AS (
    SELECT
        *,
        toDateTime("timestamp") AS dat
    FROM ore_sensor os
    LEFT JOIN miner_information mi ON mi.miner_id = os.miner_id
    LEFT JOIN site_locations si ON si.site_name = mi.miner_location
    WHERE mi.miner_id = {minerId: String}
    ORDER BY os."timestamp" DESC
    LIMIT 4000
)
SELECT
   max (estimated_ore_value * 1000 - ore_counter_kg) AS ore_rem,
    toDate(dat) AS dt
FROM stats
GROUP BY dt
ORDER BY dt DESC 

    `,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();
  return Response.json(data);
}
