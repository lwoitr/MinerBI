import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH base AS (
    SELECT
        miner_id,
        toDateTime(timestamp) AS ts,
        state,
        lead(toDateTime(timestamp), 1)
            OVER (PARTITION BY miner_id ORDER BY timestamp) AS next_ts
    FROM machine_state
    WHERE miner_id = {minerId: String}
),

durations AS (
    SELECT
        miner_id,
        state,
        dateDiff('second', ts, next_ts) AS dur
    FROM base
    WHERE next_ts IS NOT NULL
      AND next_ts > ts
),

on_time AS (
    SELECT SUM(dur) AS on_seconds
    FROM durations
    WHERE state = 'ON'
),

total_time AS (
    SELECT SUM(dur) AS total_seconds
    FROM durations
)

SELECT
    round(on_seconds * 100.0 / total_seconds, 2) AS uptime_percent
FROM on_time
CROSS JOIN total_time;

`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
