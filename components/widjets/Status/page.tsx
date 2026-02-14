"use client";

import { useState } from "react";
import MinerSelector from "../MinerSelector/page";
import StatusBox from "../StatusBox/page";

const Status = () => {
  const [desc, setDesc] = useState<string>("We don't know anything yet");

  return (
    <div className="flex flex-col bg-[#6D6A75] h-full ">
      <div className="flex justify-between bg-brand-500 items-center flex-1 px-6 overflow-hidden ">
        <StatusBox onDescChange={setDesc} />
        <div>
          <MinerSelector />
        </div>
      </div>
      <div className="bg-[#BFBDC1] px-6 py-1 text-[#37323E] text-sm">
        <h3>{desc}</h3>
      </div>
    </div>
  );
};

export default Status;
