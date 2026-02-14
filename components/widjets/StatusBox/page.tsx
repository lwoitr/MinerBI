"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";
import { Pickaxe, X, Wrench, HelpCircle } from "lucide-react";

type Props = {
  onDescChange?: (desc: string) => void;
};

export default function StatusBox({ onDescChange }: Props) {
  const { selectedId } = useMiner();
  const [status, setStatus] = useState<string>("-");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (status !== "ON") return;

    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/status?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { state: string }[]) => {
        const newStatus = data[0]?.state ?? "-";
        setStatus(newStatus);
      });
  }, [selectedId]);

  let text = "Unknown";
  let IconComponent = HelpCircle;
  let bg = "#BFBDC1";
  let desc = "We don't know anything yet";

  if (status === "ON") {
    text = `Working${".".repeat(dots)}`;
    IconComponent = Pickaxe;
    bg = "#DEB841";
    desc = "All systems are working fine.";
  } else if (status === "OFF") {
    text = "Stopped";
    IconComponent = X;
    bg = "#BFBDC1";
    desc = "Something went wrong...";
  } else if (status === "MAINTENANCE") {
    text = "Maintenance";
    IconComponent = Wrench;
    bg = "#BFBDC1";
    desc = "Object is under maintenance";
  }

  useEffect(() => {
    if (onDescChange) onDescChange(desc);
  }, [desc, onDescChange]);

  return (
    <div
      className="flex items-center gap-4  px-6 py-4 text-3xl font-semibold text-[#37323E] transition-colors duration-300 shadow-2xl shadow-[#37323E] "
      style={{ backgroundColor: bg }}
    >
      <span className={status === "ON" ? "min-w-40" : ""}>{text}</span>
      <IconComponent className={`h-7 w-7 `} />
    </div>
  );
}
