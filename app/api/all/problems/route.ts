import { clickhouse } from "@/lib/clickhouse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const result = await clickhouse.query({
    query: `
    with last_row as (
    select *
    from miner_probabilities
    where miner_id = {minerId: String}
    order by start_time desc
    limit 1
        ),

        un AS(
        select 
            upper(arrayJoin(mapKeys(row_map))) as id,
            arrayJoin(mapValues(row_map)) as probability
        from (
            select map('s1', S1) as row_map
            from last_row
            union all
            select map('s2', S2) as row_map
            from last_row
            union all
            select map('s3', S3) as row_map
            from last_row
            union all
            select map('s4', S4) as row_map
            from last_row
            union all
            select map('s5', S5) as row_map
            from last_row
            union all
            select map('s6', S6) as row_map
            from last_row
            union all
            select map('s7', S7) as row_map
            from last_row
            union all
            select map('s8', S8) as row_map
            from last_row
            union all
            select map('s9', S9) as row_map
            from last_row
            union all
            select map('s10', S10) as row_map
            from last_row
            union all
            select map('s11', S11) as row_map
            from last_row
            union all
            select map('s12', S12) as row_map
            from last_row
            union all
            select map('s13', S13) as row_map
            from last_row
            union all
            select map('s14', S14) as row_map
            from last_row
            union all
            select map('s15', S15) as row_map
            from last_row
            union all
            select map('s16', S16) as row_map
            from last_row
            union all
            select map('s17', S17) as row_map
            from last_row
            union all
            select map('s18', S18) as row_map
            from last_row
            union all
            select map('d1', D1) as row_map
            from last_row
            union all
            select map('d2', D2) as row_map
            from last_row
            union all
            select map('d3', D3) as row_map
            from last_row
            union all
            select map('d4', D4) as row_map
            from last_row
            union all
            select map('d5', D5) as row_map
            from last_row
            union all
            select map('d6', D6) as row_map
            from last_row
            union all
            select map('d7', D7) as row_map
            from last_row
            union all
            select map('d8', D8) as row_map
            from last_row
            union all
            select map('d9', D9) as row_map
            from last_row
            union all
            select map('d10', D10) as row_map
            from last_row
            union all
            select map('d11', D11) as row_map
            from last_row
            union all
            select map('d12', D12) as row_map
            from last_row
            union all
            select map('d13', D13) as row_map
            from last_row
            union all
            select map('d14', D14) as row_map
            from last_row
            union all
            select map('m1', M1) as row_map
            from last_row
            union all
            select map('m2', M2) as row_map
            from last_row
            union all
            select map('m3', M3) as row_map
            from last_row
            union all
            select map('f1', F1) as row_map
            from last_row
            union all
            select map('f2', F2) as row_map
            from last_row
            union all
            select map('f3', F3) as row_map
            from last_row
            union all
            select map('f4', F4) as row_map
            from last_row
            union all
            select map('f5', F5) as row_map
            from last_row
            union all
            select map('f6', F6) as row_map
            from last_row
            union all
            select map('f7', F7) as row_map
            from last_row
        ))

        SELECT *
        FROM un

        JOIN p_problems pp ON pp.id = un.id
        ORDER BY probability DESC
            
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
