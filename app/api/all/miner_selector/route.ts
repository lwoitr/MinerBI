import { clickhouse } from "@/lib/clickhouse";

export async function GET() {
  const result = await clickhouse.query({
    query: `
      SELECT 
        mi.miner_id,
        mi.miner_model,
        mi.miner_name,
        mi.miner_type 
      FROM miner_information mi 
    `,
    format: "JSONEachRow",
  });

  const data = await result.json();
  return Response.json(data);
}
