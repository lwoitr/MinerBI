"use client";
import { useEffect, useState } from "react";

export function ServerReady({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      let ok = false;
      while (!ok) {
        try {
          const res = await fetch("/api/health");
          ok = res.ok;
        } catch {
          ok = false;
        }
        if (!ok) await new Promise((r) => setTimeout(r, 1000));
      }
      setReady(true);
    };
    check();
  }, []);

  if (!ready)
    return (
      <>
        <div className="bg-[#6D6A75] w-screen text-3xl h-screen flex items-center justify-center ">
          <div className="p-6">Загрузка DWH, это может занять минуту...</div>

          <div className="w-6 h-6 p-6 border-3 border-gray-300 border-t-[#DEB841] rounded-full animate-spin"></div>
        </div>
      </>
    );
  return <>{children}</>;
}
