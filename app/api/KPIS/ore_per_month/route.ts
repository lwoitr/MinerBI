import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH
    stats AS
    (
        SELECT
            toDate(timestamp) AS date,
            ore_counter_kg,
            lag(ore_counter_kg, 1, ore_counter_kg)
                OVER (ORDER BY timestamp ASC) AS prev_val,
            ore_counter_kg - prev_val AS ore_delta
        FROM ore_sensor
        WHERE miner_id = {minerId: String}
        ORDER BY timestamp ASC
    )
SELECT
    max(date) AS dt,
    toMonth(date) AS mon,
    sum(ore_delta) AS ore_sum
FROM stats
WHERE date BETWEEN
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
GROUP BY mon
ORDER BY dt ASC
LIMIT 11
;
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
