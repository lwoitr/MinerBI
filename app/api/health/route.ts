import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await clickhouse.query({
      query: "SELECT 1",
      format: "JSONEachRow",
    });

    await result.json();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("ClickHouse not ready:", err);
    return new Response(JSON.stringify({ ok: false }), { status: 503 });
  }
}
