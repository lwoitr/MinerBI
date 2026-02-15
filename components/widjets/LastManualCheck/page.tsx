"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";

interface Log {
  log_id: number;
  miner_id: number;
  miner_name: string;
  timestamp: string;
  technician_name: string;
  action_type: string;
  problem_description: string;
  parts_replaced: string;
  shift: string;
  notes: string;
  status: string;
}

export default function LastaManalCheck() {
  const { selectedId } = useMiner();
  const [tableData, setTableData] = useState<Log | null>(null);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/logs_table?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: Log[]) => {
        setTableData(data[0]);
      });
  }, [selectedId]);

  if (!tableData)
    return (
      <div className="h-full w-full bg-[#6D6A75] px-6">No logs found.</div>
    );

  return (
    <div className="flex flex-col shadow-[#6D6A75] shadow-md">
      <div className="flex bg-[#6D6A75] gap-1 text-[#BFBDC1] px-6 py-2 font-medium">
        <h3>
          Last manual check performed:{" "}
          <em>
            at {tableData.timestamp} by {tableData.technician_name} — see all
            reports
          </em>
        </h3>
        <a href="#logs-table" className="underline text-[#BFBDC1] italic">
          here
        </a>
      </div>
      <div className="px-6 py-1 bg-[#BFBDC1] text-sm">
        <h3 className="text-[#37323E] italic">
          Notes: {tableData.notes || "No notes available."}
        </h3>
      </div>
    </div>
  );
}
