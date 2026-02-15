import Alerts from "@/components/widjets/Alerts/page";
import Efficency from "@/components/widjets/Efficency/page";
import MinerInterface from "@/components/widjets/MinerInterface/page";

const MlEfficency = () => {
  return (
    <div className="flex justify-between bg-[#6D6A75] gap-6 p-6 shadow-[#6D6A75] shadow-md">
      <div className="">
        <MinerInterface></MinerInterface>
      </div>
      <div className="w-full">
        <Alerts></Alerts>
      </div>
      <div className="w-120 ">
        <Efficency></Efficency>
      </div>
    </div>
  );
};

export default MlEfficency;
