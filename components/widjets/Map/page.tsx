"use client";
import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useRef, useState } from "react";

interface MinerLocation {
  miner_id: number;
  x_coord: number;
  y_coord: number;
}

export default function MinersMap() {
  const { selectedId } = useMiner();
  const [locations, setLocations] = useState<MinerLocation[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/all/location")
      .then((r) => (r.ok ? r.json() : []))
      .then(setLocations)
      .catch(() => setLocations([]));
  }, []);

  if (locations.length === 0) {
    return <div className="bg-[#37323E] p-6 text-[#BFBDC1]">no data</div>;
  }

  const xs = locations.map((l) => l.x_coord);
  const ys = locations.map((l) => l.y_coord);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  let rangeX = maxX - minX;
  let rangeY = maxY - minY;

  if (rangeX === 0) rangeX = 1;
  if (rangeY === 0) rangeY = 1;

  const logicalSize = 500;
  const padding = 40;
  const maxRange = Math.max(rangeX, rangeY);
  const scale = (logicalSize - padding * 2) / maxRange;
  const centerLogical = logicalSize / 2;
  const zoomLevel = selectedId ? 1.6 : 1;

  const selectedMiner = selectedId
    ? locations.find((m) => m.miner_id === Number(selectedId))
    : null;

  const leftMost = padding + (logicalSize - rangeX * scale) / 2;
  const rightMost = leftMost + rangeX * scale;
  const topMost = padding + (logicalSize - rangeY * scale) / 2;
  const bottomMost = topMost + rangeY * scale;
  const markerPad = 32;

  const toSvg = (x: number, y: number) => {
    const posX =
      padding + (x - minX) * scale + (logicalSize - rangeX * scale) / 2;
    const posY =
      padding + (maxY - y) * scale + (logicalSize - rangeY * scale) / 2;
    return [posX, posY];
  };

  const clamp = (v: number, a: number, b: number) =>
    Math.min(Math.max(v, a), b);

  let translateX = 0;
  let translateY = 0;
  let selectedPosX = 0;
  let selectedPosY = 0;

  if (selectedMiner) {
    const [px, py] = toSvg(selectedMiner.x_coord, selectedMiner.y_coord);
    selectedPosX = px;
    selectedPosY = py;

    const desiredTx = centerLogical - selectedPosX;
    const minTx = centerLogical - rightMost + markerPad;
    const maxTx = centerLogical - leftMost - markerPad;
    translateX = clamp(desiredTx, minTx, maxTx);

    const desiredTy = centerLogical - selectedPosY;
    const minTy = centerLogical - bottomMost + markerPad;
    const maxTy = centerLogical - topMost - markerPad;
    translateY = clamp(desiredTy, minTy, maxTy);
  }

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const displayX = selectedMiner ? selectedMiner.x_coord : midX;
  const displayY = selectedMiner ? selectedMiner.y_coord : midY;

  return (
    <div
      ref={wrapperRef}
      className="relative bg-[#100e12] overflow-hidden border border-[#BFBDC1] h-full w-full"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, #37323E 0px, #37323E 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(0deg, #37323E 0px, #37323E 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative h-full" style={{ zIndex: 1 }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${logicalSize} ${logicalSize}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "hidden", display: "block" }}
        >
          <g
            className="transition-transform duration-700 ease-in-out"
            transform={`translate(${translateX},${translateY}) translate(${centerLogical},${centerLogical}) scale(${zoomLevel}) translate(${-centerLogical},${-centerLogical})`}
          >
            {locations
              .filter((m) => Number(selectedId) !== m.miner_id)
              .map((m) => {
                const [posX, posY] = toSvg(m.x_coord, m.y_coord);

                return (
                  <g key={m.miner_id}>
                    <rect
                      x={posX - 7}
                      y={posY - 7}
                      width={14}
                      height={14}
                      rx={3}
                      fill="#37323E"
                      stroke="#6D6A75"
                      strokeWidth={2}
                    />
                    <text
                      x={posX}
                      y={posY + 20}
                      fontSize={10}
                      textAnchor="middle"
                      fill="#9ca3af"
                    >
                      {m.miner_id}
                    </text>
                  </g>
                );
              })}

            {selectedMiner && (
              <g>
                <circle
                  cx={selectedPosX}
                  cy={selectedPosY}
                  r={28}
                  fill="#f59e0b"
                  opacity={0.2}
                />
                <rect
                  x={selectedPosX - 9}
                  y={selectedPosY - 9}
                  width={18}
                  height={18}
                  rx={4}
                  fill="#DEB841"
                  stroke="#DE9E36"
                  strokeWidth={3}
                />
                <text
                  x={selectedPosX}
                  y={selectedPosY + 26}
                  fontSize={12}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontWeight="bold"
                >
                  {selectedMiner.miner_id}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      <div className="bg-[#BFBDC1] z-900 px-6  absolute bottom-0 left-0 right-0">
        <div className="text-xs text-[#37323E]">
          Coords: {displayX.toFixed(2)}, {displayY.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
