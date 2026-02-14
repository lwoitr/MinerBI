import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
        SELECT state
        FROM machine_state ms 
        WHERE ms.miner_id = {minerId: String}
        ORDER BY ms."timestamp"  DESC 
        LIMIT 1
        `,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
