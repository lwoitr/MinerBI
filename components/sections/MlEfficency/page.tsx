import Alerts from "@/components/widjets/Alerts/page";
import Efficency from "@/components/widjets/Efficency/page";
import MinerInterface from "@/components/widjets/MinerInterface/page";

const MlEfficency = () => {
  return (
    <div className="flex justify-between bg-[#6D6A75] gap-6 p-6 shadow-[#6D6A75] shadow-md">
      <div className="">
        <MinerInterface></MinerInterface>
      </div>
      <div className="min-w-60 max-w-full">
        <Alerts></Alerts>
      </div>
      <div className="min-w-110 max-w-full ">
        <Efficency></Efficency>
      </div>
    </div>
  );
};

export default MlEfficency;
