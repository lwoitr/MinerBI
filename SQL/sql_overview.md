### Это документ со всеми sql запросами каждого api route данной bi-системы.

Их рабочую реализацию можно найти в /app/api

Примечание:

В api для фильтрации используется miner_id = {minerId: String}, в этом документе все запросы будут для miner_id = '1'

Во многих запросах можно встретить toDateTime("timestamp"), это потому что изначально хранилище было в докер контейнере, где это поле во всех таблицах имело тип string.

##### Потребление электричества за 24ч:

    WITH stats AS (
    SELECT *,
        toDateTime(cds."timestamp") AS dt
    FROM current_draw_sensor cds
    WHERE cds.miner_id = '1'
    ),
    stats2 AS (
        SELECT *,
            toHour(dt) AS hr,
            toDate(dt) AS dat
        FROM stats
    )
    SELECT hr,
    dat,
        avg(current_draw) AS hravg
    FROM stats2
    group BY hr, dat
    ORDER BY dat DESC, hr DESC
    LIMIT 24

    -- RESULT --

    0	2026-02-01	9.749051979915519
    23	2026-01-31	9.528650811073888
    22	2026-01-31	8.669386681197581
    21	2026-01-31	7.525782686384853
    20	2026-01-31	6.455946178781546
    19	2026-01-31	6.758292655818539
    18	2026-01-31	6.529171110032277
    17	2026-01-31	6.552627334446952
    16	2026-01-31	6.02417138161707
    15	2026-01-31	7.869268737926672
    14	2026-01-31	7.087109415824108
    13	2026-01-31	8.938704192329
    12	2026-01-31	10.051308058704604
    11	2026-01-31	10.676761329213855
    10	2026-01-31	11.613682947394674
    9	2026-01-31	11.059188570695701
    8	2026-01-31	12.342730708106302
    7	2026-01-31	13.22198093863008
    6	2026-01-31	13.606863340462917
    5	2026-01-31	14.828717124426932
    4	2026-01-31	13.285946546195795
    3	2026-01-31	13.445318785925252
    2	2026-01-31	11.883497728470457
    1	2026-01-31	10.496786725790068

##### Руда в час, последние 24ч.

    WITH ore_stats AS (
    SELECT
        "timestamp",
        ore_counter_kg,
        toHour("timestamp") as hour,
        toDate("timestamp") as date,
        lag(ore_counter_kg, 6, ore_counter_kg)
            OVER (ORDER BY "timestamp") AS hour_ago
    FROM ore_sensor
    WHERE miner_id = {minerId: String}
    ),

    intime AS (
        SELECT
            "timestamp",
            (hour + 1) as hr,
            date,
            (ore_counter_kg - hour_ago) AS ore_per_hour
        FROM ore_stats
    ),

    total_stats as (SELECT *
    FROM (
        SELECT *,
            row_number() OVER (
                PARTITION BY date, hr
                ORDER BY "timestamp" ASC
            ) as rn
        FROM intime
    )
    WHERE rn = 1
    ORDER BY date DESC, hr DESC)

    select timestamp, ore_per_hour
    from total_stats
    LIMIT 24

    -- RESULT --
    timestamp               ore_per_hour
    2026-02-01 00:00:00	308.6505333231762
    2026-01-31 23:00:00	286.58976412564516
    2026-01-31 22:00:00	289.2622186806984
    2026-01-31 21:00:00	286.63010030053556
    2026-01-31 20:00:00	289.63821530528367
    2026-01-31 19:00:00	256.6293939645402
    2026-01-31 18:00:00	270.48188715428114
    2026-01-31 17:00:00	286.91421318007633
    2026-01-31 16:00:00	295.2754847193137
    2026-01-31 15:00:00	290.8651134548709
    2026-01-31 14:00:00	280.2894559549168
    2026-01-31 13:00:00	303.94510273775086
    2026-01-31 12:00:00	307.06216592062265
    2026-01-31 11:00:00	313.69708917010576
    2026-01-31 10:00:00	277.8644339358434
    2026-01-31 09:00:00	343.4541013799608
    2026-01-31 08:00:00	338.87692108843476
    2026-01-31 07:00:00	336.1420660917647
    2026-01-31 06:00:00	342.58310781186447
    2026-01-31 05:00:00	328.4846417522058
    2026-01-31 04:00:00	349.5385968014598
    2026-01-31 03:00:00	338.25459684757516
    2026-01-31 02:00:00	320.40012752311304
    2026-01-31 01:00:00	309.9414811958559

##### Кол-во оставшейся для добычи руды.

    WITH stats AS (
        SELECT
            *,
            toDateTime("timestamp") AS dat
        FROM ore_sensor os
        LEFT JOIN miner_information mi ON mi.miner_id = os.miner_id
        LEFT JOIN site_locations si ON si.site_name = mi.miner_location
        WHERE mi.miner_id = '1'
        ORDER BY os."timestamp" DESC
        LIMIT 4000
    )
    SELECT
    max (estimated_ore_value * 1000 - ore_counter_kg) AS ore_rem,
        toDate(dat) AS dt
    FROM stats
    GROUP BY dt
    ORDER BY dt DESC

    -- RESULT --
    ore_rem                 dt
    9918125.552582566	2026-02-01
    9925477.023394987	2026-01-31
    9932701.221778143	2026-01-30
    9940100.048137493	2026-01-29
    9947460.919919055	2026-01-28
    9954866.36249049	2026-01-27
    9962112.526204564	2026-01-26
    ...

##### Руда в неделю:

    WITH weekly_stats AS (SELECT
        dateTrunc('week', toDateTime(os.timestamp)) AS weeks,
        MIN(os.ore_counter_kg) AS startt,
        MAX(os.ore_counter_kg) AS endd
    FROM ore_sensor os
    WHERE os.miner_id = 1
    GROUP BY weeks
    ORDER BY weeks DESC)

    SELECT
    weeks,
    (endd - startt) AS weekly_growth,
    endd AS total

    FROM weekly_stats

    -- RESULT --
    weeks           weekly_growth           total
    2026-01-26	43986.97362199705	2929794.447417434
    2026-01-19	52038.37993862713	2885753.228334748
    2026-01-12	51751.34512634948	2833664.193052812
    2026-01-05	51962.19690801669	2781859.336153602
    2025-12-29	51542.860343940556	2729844.0110493563
    2025-12-22	51639.61926187854	2678247.0687573045
    ...

##### Время работы (ч) без остановки, последние 30 запусков:

    WITH
        parsed AS (
        SELECT
            timestamp AS ts,
            state
        FROM machine_state
        WHERE miner_id = '1'
        ORDER BY ts
    ),
    with_prev AS (
        SELECT
            ts,
            state,
            lag(state) OVER (ORDER BY ts) AS prev_state
        FROM parsed
    ),
    changes AS (
        SELECT
            ts,
            state
        FROM with_prev
        WHERE prev_state != state OR prev_state IS NULL
    ),
    on_starts AS (
        SELECT
            ts AS start_time,
            lead(ts) OVER (ORDER BY ts) AS next_change
        FROM changes
        WHERE state = 'ON'
    )
    SELECT
        toString(start_time) AS start_ts,
        toString(next_change) AS end_ts,
        round(toFloat64(dateDiff('second', start_time, next_change))
        / 3600, 4) AS hours
    FROM on_starts
    WHERE next_change IS NOT NULL
    AND next_change > start_time
    ORDER BY start_time DESC
    LIMIT 30

    -- RESULT --
    start_ts                end_ts                  hours
    2026-01-30 16:20:00	2026-01-31 10:00:00	17.6667
    2026-01-30 14:30:00	2026-01-30 16:20:00	1.8333
    2026-01-30 02:00:00	2026-01-30 14:30:00	12.5
    2026-01-29 16:20:00	2026-01-30 02:00:00	9.6667
    ...

##### процент рабочего времени (отношение простоя к работе установки):

    WITH base AS (
        SELECT
            miner_id,
            toDateTime(timestamp) AS ts,
            state,
            lead(toDateTime(timestamp), 1)
                OVER (PARTITION BY miner_id ORDER BY timestamp) AS next_ts
        FROM machine_state
        WHERE miner_id = 1
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

    -- RESULT --
    uptime_perc
    98.99

##### Руда в день:

    WITH stats AS (SELECT
    MAX(os.miner_id),
    MAX(os.ore_counter_kg) AS ore,
    toDate(os."timestamp") AS dtime
    FROM ore_sensor os
    WHERE miner_id = {minerId: String}
    GROUP BY dtime
    ORDER BY dtime DESC)

    SELECT
        dtime,
        round(ore - lag(ore,1,ore) OVER (ORDER BY dtime), 2) AS per_day
    FROM stats
    ORDER BY dtime DESC

    -- RESULT --

    2026-02-01	48.23
    2026-01-31	7344.73
    2026-01-30	7240.23
    2026-01-29	7391.80
    2026-01-28	7310.35
    ...

##### Руда в месяц:

    WITH
        stats AS
        (
            SELECT
                toDate(timestamp) AS date,
                ore_counter_kg,
                lag(ore_counter_kg, 1, ore_counter_kg)
                    OVER (ORDER BY timestamp ASC) AS prev_val,
                ore_counter_kg - prev_val AS ore_delta
            FROM ore_sensor
            WHERE miner_id = '1'
            ORDER BY timestamp ASC
        )
    SELECT
        max(date) AS dt,
        toMonth(date) AS mon,
        sum(ore_delta) AS ore_sum
    FROM stats
    WHERE date BETWEEN
            (
                SELECT max(toDate(timestamp)) - INTERVAL 1 YEAR
                FROM ore_sensor
                WHERE miner_id = '1'
            )
        AND (
                SELECT max(toDate(timestamp))
                FROM ore_sensor
                WHERE miner_id = '1'
            )
    GROUP BY mon
    ORDER BY dt ASC
    LIMIT 11

    -- RESULT --
    dt              mon     ore_sum
    ...
    2025-09-30	9	221719.26109618996
    2025-10-31	10	229139.5400752381
    2025-11-30	11	221635.30271589058
    2025-12-31	12	228563.9100416815
    2026-01-31	1	229369.2130156355

##### Average, MIN and MAX добвыаемой руды в час:

    WITH stats AS (
        SELECT
            toDateTime(os."timestamp") AS dt,
            (os.ore_counter_kg - lag(os.ore_counter_kg, 1, 0)
            OVER (ORDER BY os."timestamp" ASC)) AS delta
        FROM ore_sensor os
        WHERE miner_id = '1'
    ),
    filtered AS (
        SELECT *
        FROM stats
        WHERE delta BETWEEN 1 AND 200
    ),
    hours_fixed AS (
        SELECT *,

            CASE
                WHEN toHour(dt) + 3 = 25 THEN 1
                WHEN toHour(dt) + 3 = 26 THEN 2
                ELSE toHour(dt) + 3
            END AS fixed_hour,

            toDate(dt + INTERVAL 3 HOUR) AS fixed_date
        FROM filtered
    ),

    final_stats AS (SELECT
        fixed_date AS date,
        fixed_hour,
        sum(delta) AS total_delta
    FROM hours_fixed
    GROUP BY fixed_date, fixed_hour
    ORDER BY fixed_date, fixed_hour)

    -- AVG --
    SELECT median(total_delta) as avg
    FROM final_stats

    -- RESULT --
    avg
    308.3017504

    -- MAX --
    SELECT total_delta AS delta, date
    FROM final_stats
    WHERE total_delta = (SELECT max(total_delta) FROM final_stats)

    -- RESULT --
    delta                   date
    373.60830589034595	2025-03-13

    -- MIN --
    SELECT total_delta as delta, date
    FROM final_stats
    WHERE total_delta = (SELECT min(total_delta) FROM final_stats)

    -- RESULT --
    delta                   date
    48.23891712585464       2026-02-01
