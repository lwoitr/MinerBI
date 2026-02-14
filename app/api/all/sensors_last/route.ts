import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
    WITH last_cds AS (
    SELECT *
    FROM current_draw_sensor
    WHERE miner_id = {minerId: String}
    ORDER BY "timestamp" DESC
    LIMIT 1
),
last_rs AS (
    SELECT *
    FROM rotations_sensor
    WHERE miner_id = {minerId: String}
    ORDER BY "timestamp" DESC
    LIMIT 1
),
last_vs AS (
    SELECT *
    FROM vibration_sensor
    WHERE miner_id = {minerId: String}
    ORDER BY "timestamp" DESC
    LIMIT 1
),
last_ts AS (
    SELECT *
    FROM torque_sensor
    WHERE miner_id = {minerId: String}
    ORDER BY "timestamp" DESC
    LIMIT 1
),
last_mt AS (
    SELECT *
    FROM motor_temperature_sensor 
    WHERE miner_id = {minerId: String}
    ORDER BY "timestamp" DESC
    LIMIT 1
)

SELECT 
current_draw,
rotations,
torque,
motor_temperature,
vibration_level 


FROM last_cds cds
JOIN last_rs rs ON cds.miner_id = rs.miner_id
JOIN last_vs vs ON cds.miner_id = vs.miner_id
JOIN last_ts ts ON cds.miner_id = ts.miner_id
JOIN last_mt mt ON cds.miner_id = mt.miner_id

        
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
