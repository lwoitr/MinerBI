import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH ore_stats AS (
    SELECT
        "timestamp",
        ore_counter_kg,
        toHour("timestamp") as hour,
        toDate("timestamp") as date,
        lag(ore_counter_kg, 6, ore_counter_kg) 
            OVER (ORDER BY "timestamp") AS hour_ago
    FROM ore_sensor
    WHERE miner_id = {minerId: String}
),

intime AS ( 
    SELECT
        "timestamp",
        (hour + 1) as hr,
        date,
        (ore_counter_kg - hour_ago) AS ore_per_hour
    FROM ore_stats
),

total_stats as (SELECT *
FROM (
    SELECT *,
        row_number() OVER (
            PARTITION BY date, hr 
            ORDER BY "timestamp" ASC
        ) as rn
    FROM intime
)
WHERE rn = 1
ORDER BY date DESC, hr DESC)

select timestamp, ore_per_hour
from total_stats
LIMIT 1
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
