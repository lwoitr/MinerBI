import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
WITH hell AS (
    SELECT *,
           toDateTime(cds."timestamp") AS dt 
    FROM current_draw_sensor cds 
    WHERE cds.miner_id = {minerId: String}
),
hell2 AS (
    SELECT *,
           toHour(dt) AS hr,
           toDate(dt) AS dat
    FROM hell
)
SELECT hr, 
dat,
       avg(current_draw) AS hravg
FROM hell2
group BY hr, dat
ORDER BY dat DESC, hr DESC
LIMIT 24

`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
