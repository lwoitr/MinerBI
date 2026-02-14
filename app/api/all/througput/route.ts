import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
SELECT mi.max_throughput *1.15 AS mo
FROM miner_information mi
WHERE miner_id = {minerId: String}

`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
