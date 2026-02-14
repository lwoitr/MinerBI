import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH 
parsed AS (
    SELECT 
        timestamp AS ts,
        state
    FROM machine_state
    WHERE miner_id = {minerId: String}
    ORDER BY ts
),
with_prev AS (
    SELECT 
        ts,
        state,
        lag(state) OVER (ORDER BY ts) AS prev_state
    FROM parsed
),
changes AS (
    SELECT 
        ts,
        state
    FROM with_prev
    WHERE prev_state != state OR prev_state IS NULL
),
on_starts AS (
    SELECT 
        ts AS start_time,
        lead(ts) OVER (ORDER BY ts) AS next_change
    FROM changes
    WHERE state = 'ON'
)
SELECT 
    toString(start_time)          AS start_ts,
    toString(next_change)         AS end_ts,
    round(toFloat64(dateDiff('second', start_time, next_change)) / 3600, 4) AS hours
FROM on_starts
WHERE next_change IS NOT NULL
  AND next_change > start_time
ORDER BY start_time DESC
LIMIT 30

`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
