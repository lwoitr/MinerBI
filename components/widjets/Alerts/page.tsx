"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";

type Problem = {
  id: string;
  probability: number;
  desc: string;
  detailed_description: string;
};

export default function Alerts() {
  const { selectedId } = useMiner();
  const [stats, setStats] = useState<Problem[]>([]);

  useEffect(() => {
    if (!selectedId) {
      setStats([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/all/problems?id=${encodeURIComponent(selectedId)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Problem[];

        if (cancelled) return;

        const normalized = data
          .map((p) => ({
            ...p,
            probability:
              typeof p.probability === "number"
                ? p.probability
                : Number(p.probability || 0),
          }))
          .filter((p) => !Number.isNaN(p.probability));

        setStats(normalized);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        setStats([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const visible = stats.filter((p) => p.probability > 0.3);

  const bgFor = (prob: number) => {
    if (prob > 0.7) return "rgba(225, 44, 44, 0.5";
    if (prob >= 0.5) return "#DE9E3680";
    return "#DEB84180";
  };

  return (
    <div className="bg-[#BFBDC1] shadow-2xl shadow-black min-w-60 max-w-full h-110">
      <h3 className="mb-3 text-lg text-[#BFBDC1] font-semibold bg-[#37323E] py-2 px-6 ">
        Alerts
      </h3>

      {visible.length === 0 ? (
        <div className="text-black px-6 pt-2">No probplems detected.</div>
      ) : (
        <ul className="list-none m-4 shadow-2xl bg-gray-400/5">
          {visible.map((p) => (
            <li
              key={p.id}
              className="mb-2.5 p-2.5 border border-black"
              style={{ backgroundColor: bgFor(p.probability) }}
            >
              <div className="flex justify-between items-baseline gap-3">
                <div className="font-semibold text-[#37323E]">{p.id}</div>
                <div className="text-[13px] opacity-90 text-[#37323E]">
                  {(p.probability * 100).toFixed(1)}%
                </div>
              </div>

              <div className="mt-2 text-[#37323E] first-letter:uppercase">
                {p.desc}
              </div>

              {p.detailed_description && (
                <div className="mt-2 text-[13px]  text-[#37323E]">
                  {p.detailed_description}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
