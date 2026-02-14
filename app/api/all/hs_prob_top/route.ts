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
            select map('s1', s1) as row_map
            from last_row
            union all
            select map('s2', s2) as row_map
            from last_row
            union all
            select map('s3', s3) as row_map
            from last_row
            union all
            select map('s4', s4) as row_map
            from last_row
            union all
            select map('s5', s5) as row_map
            from last_row
            union all
            select map('s6', s6) as row_map
            from last_row
            union all
            select map('s7', s7) as row_map
            from last_row
            union all
            select map('s8', s8) as row_map
            from last_row
            union all
            select map('s9', s9) as row_map
            from last_row
            union all
            select map('s10', s10) as row_map
            from last_row
            union all
            select map('s11', s11) as row_map
            from last_row
            union all
            select map('s12', s12) as row_map
            from last_row
            union all
            select map('s13', s13) as row_map
            from last_row
            union all
            select map('s14', s14) as row_map
            from last_row
            union all
            select map('s15', s15) as row_map
            from last_row
            union all
            select map('s16', s16) as row_map
            from last_row
            union all
            select map('s17', s17) as row_map
            from last_row
            union all
            select map('s18', s18) as row_map
            from last_row
            union all
            select map('d1', d1) as row_map
            from last_row
            union all
            select map('d2', d2) as row_map
            from last_row
            union all
            select map('d3', d3) as row_map
            from last_row
            union all
            select map('d4', d4) as row_map
            from last_row
            union all
            select map('d5', d5) as row_map
            from last_row
            union all
            select map('d6', d6) as row_map
            from last_row
            union all
            select map('d7', d7) as row_map
            from last_row
            union all
            select map('d8', d8) as row_map
            from last_row
            union all
            select map('d9', d9) as row_map
            from last_row
            union all
            select map('d10', d10) as row_map
            from last_row
            union all
            select map('d11', d11) as row_map
            from last_row
            union all
            select map('d12', d12) as row_map
            from last_row
            union all
            select map('d13', d13) as row_map
            from last_row
            union all
            select map('d14', d14) as row_map
            from last_row
            union all
            select map('m1', m1) as row_map
            from last_row
            union all
            select map('m2', m2) as row_map
            from last_row
            union all
            select map('m3', m3) as row_map
            from last_row
            union all
            select map('f1', f1) as row_map
            from last_row
            union all
            select map('f2', f2) as row_map
            from last_row
            union all
            select map('f3', f3) as row_map
            from last_row
            union all
            select map('f4', f4) as row_map
            from last_row
            union all
            select map('f5', f5) as row_map
            from last_row
            union all
            select map('f6', f6) as row_map
            from last_row
            union all
            select map('f7', f7) as row_map
            from last_row
        ))

        SELECT probability 
        FROM un

        JOIN p_problems pp ON pp.id = un.id
        ORDER BY probability DESC
        LIMIT 1
            
`,
    query_params: { minerId: id },
    format: "JSONEachRow",
  });

  const data = await result.json();

  return Response.json(data);
}
