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

export default function LogsTable() {
  const { selectedId } = useMiner();
  const [tableData, setTableData] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/logs_table?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: Log[]) => {
        setTableData(data);
        setCurrentPage(1);
      });
  }, [selectedId]);

  if (!tableData.length) return <div>no data</div>;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const colors = {
    bgHeader: "#37323E",
    textHeader: "#BFBDC1",
    bgRow: "#BFBDC1",
    textRow: "#37323E",
    accent2: "#A09FA8",
  };

  return (
    <div id="logs-table" className="p-6 overflow-x-auto ">
      <table className="w-full border border-[#37323E] text-sm shadow-2xl shadow-black">
        <thead
          style={{ backgroundColor: colors.bgHeader, color: colors.textHeader }}
        >
          <tr>
            <th className="py-2 px-3 text-left">ID</th>
            <th className="py-2 px-3 text-left">Miner</th>
            <th className="py-2 px-3 text-left">Дата</th>
            <th className="py-2 px-3 text-left">Техник</th>
            <th className="py-2 px-3 text-left">Тип</th>
            <th className="py-2 px-3 text-left">Проблема</th>
            <th className="py-2 px-3 text-center">Статус</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((log, i) => (
            <tr
              key={log.log_id}
              style={{
                backgroundColor: i % 2 === 0 ? colors.bgRow : colors.accent2,
                color: colors.textRow,
              }}
              className="border-t border-[#37323E] h-12"
            >
              <td className="px-3 text-left">{log.log_id}</td>
              <td className="px-3 text-left">{log.miner_name}</td>
              <td className="px-3 text-left">{log.timestamp}</td>
              <td className="px-3 text-left">{log.technician_name}</td>
              <td className="px-3 text-left">{log.action_type}</td>
              <td className="px-3 text-left">{log.problem_description}</td>
              <td className="px-3 text-left font-semibold">{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          prev
        </button>

        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          next
        </button>
      </div>
    </div>
  );
}
