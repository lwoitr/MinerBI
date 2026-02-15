import IDoK1 from "@/components/widjets/IDoK1/page";
import Heatmap from "../../widjets/Heatmap/page";

const KpiDeepDive = () => {
  return (
    <div>
      <div
        className="
      p-6 bg-[#6D6A75] shadow-[#6D6A75] shadow-md w-full"
      >
        <div className=" text-lg text-[#BFBDC1] font-semibold bg-[#37323E] py-2 px-4 ">
          Ore Production deep dive
        </div>
        <div className="flex justify-between bg-[#BFBDC1] items-center shadow-2xl shadow-[#100e12]">
          <div className="max-w-2xl h-full">
            <IDoK1></IDoK1>
          </div>
          <div className="w-full">
            <Heatmap></Heatmap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiDeepDive;
