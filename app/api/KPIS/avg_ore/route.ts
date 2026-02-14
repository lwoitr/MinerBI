import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH stats AS (
    SELECT 
        toDateTime(os."timestamp") AS dt, 
        (os.ore_counter_kg - lag(os.ore_counter_kg, 1, 0) OVER (ORDER BY os."timestamp" ASC)) AS delta
    FROM ore_sensor os
    WHERE miner_id = {minerId: String}
),
filtered AS (
    SELECT *
    FROM stats
    WHERE delta BETWEEN 1 AND 200
),
hours_fixed AS (
    SELECT *,
        
        CASE 
            WHEN toHour(dt) + 3 = 25 THEN 1
            WHEN toHour(dt) + 3 = 26 THEN 2
            ELSE toHour(dt) + 3
        END AS fixed_hour,
        
        toDate(dt + INTERVAL 3 HOUR) AS fixed_date
    FROM filtered
),

final_stats AS (SELECT 
    fixed_date AS date,
    fixed_hour,
    sum(delta) AS total_delta
FROM hours_fixed
GROUP BY fixed_date, fixed_hour
ORDER BY fixed_date, fixed_hour)


SELECT median(total_delta) as avg
FROM final_stats 


`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
