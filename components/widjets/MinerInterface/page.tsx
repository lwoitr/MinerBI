"use client";

import { useMiner } from "@/app/context/MinerContext/MinerContext";
import { useEffect, useState } from "react";

export default function MinerInterface() {
  const { selectedId } = useMiner();

  const [model, setModel] = useState("");

  const [mt, setMt] = useState(1);
  const [vl, setVl] = useState(1);
  const [rot, setRot] = useState(1);
  const [Cdr, setCdr] = useState(1);
  const [Tor, setTor] = useState(1);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/miner_info?id=${selectedId}`)
      .then((r) => r.json())
      .then((data: { miner_model: string }[]) => {
        if (data.length > 0) {
          setModel(data[0].miner_model);
        }
      })
      .catch((err) => console.error(err));
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/all/sensors_last?id=${selectedId}`)
      .then((r) => r.json())
      .then(
        (
          data: {
            current_draw: number;
            rotations: number;
            torque: number;
            motor_temperature: number;
            vibration_level: number;
          }[],
        ) => {
          if (data.length > 0) {
            setCdr(data[0].current_draw);
            setMt(data[0].motor_temperature);
            setRot(data[0].rotations);
            setTor(data[0].torque);
            setVl(data[0].vibration_level);
          }
        },
      )
      .catch((err) => console.error(err));
  }, [selectedId]);

  const m_vid =
    model === "Model C"
      ? "/imgs/animated_miner1_1.mp4"
      : model === "Model B"
        ? "/imgs/3.mp4"
        : "/imgs/2.mp4";

  return (
    <div className="flex flex-col bg-[#BFBDC1] shadow-xl shadow-black max-w-xl h-110">
      <h3 className="text-lg text-[#BFBDC1] font-semibold bg-[#37323E] py-2 px-4 ">
        Miner Interface
      </h3>
      <div className="flex gap-4">
        <div className="pt-2 px-4 pb-10 h-100 shadow-2xl bg-[#100e12] min-w-90">
          <div className="border border-[#37323E] shadow-sm shadow-[#463d4e] ">
            <h3 className="text-sm text-[#BFBDC1] p-1 ">{model}</h3>
          </div>
          <video
            key={m_vid}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full shadow-sm shadow-[#463d4e] border border-[#37323E] "
          >
            <source src={m_vid} type="video/mp4" />
          </video>
        </div>

        <div className="flex-1 flex flex-col justify-start gap-4 pt-4 pr-12 ">
          <ul className="text-[#37323E] text-sm border-black border border-t-0 border-r-0 border-l-0">
            Motor temperature: <br /> {mt.toFixed(4)}
          </ul>
          <ul className="text-[#37323E] text-sm border-black border border-t-0 border-r-0 border-l-0">
            Vibration level: <br /> {vl.toFixed(4)}
          </ul>
          <ul className="text-[#37323E] text-sm border-black border border-t-0 border-r-0 border-l-0">
            Rotations: <br /> {rot.toFixed(4)}
          </ul>
          <ul className="text-[#37323E] text-sm border-black border border-t-0 border-r-0 border-l-0">
            Current draw: <br /> {Cdr.toFixed(4)}
          </ul>
          <ul className="text-[#37323E] text-sm border-black border border-t-0 border-r-0 border-l-0">
            Torque: <br /> {Tor.toFixed(4)}
          </ul>
        </div>
      </div>
    </div>
  );
}
