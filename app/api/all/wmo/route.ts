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
)

SELECT sum(delta) AS value,
toDate(dt) AS day,
toMonth(dt) AS month
FROM filtered
WHERE dt BETWEEN
          (
              SELECT max(toDate(timestamp)) - INTERVAL 1 YEAR
              FROM ore_sensor
              WHERE miner_id = {minerId: String}
          )
      AND (
              SELECT max(toDate(timestamp))
              FROM ore_sensor
              WHERE miner_id = {minerId: String}
          )
GROUP BY day, month
ORDER BY day DESC
OFFSET 1

`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
