import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
     SELECT sl.x_coord, sl.y_coord 
FROM miner_information mi 
JOIN site_locations sl  ON mi.miner_location = sl.site_name 
WHERE miner_id = {minerId: String}
    
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
