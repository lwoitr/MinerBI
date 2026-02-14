import KPI_ore_ph from "../KPI_ore_ph/page";
import KPI_ore_t_w from "../KPI_ore_t_w/page";
import KPI_operating_time from "@/components/widjets/KPI_operating_time/page";
import KPI_electricity_cons from "../KPI_electricity_cons/page";
import KPI_ore_remaining from "../KPI_ore_remaining/page";

const Cardrow = () => {
  return (
    <div className="flex px-6 gap-6  items-center bg-[#6D6A75] h-full overflow-hidden justify-between shadow-[#6D6A75] shadow-md w-full py-6">
      <div className="shadow-xl shadow-[#100e12] w-full overflow-hidden z-1 ">
        <KPI_ore_ph></KPI_ore_ph>
      </div>
      <div className="shadow-xl shadow-[#100e12] w-full overflow-hidden z-1">
        <KPI_ore_t_w></KPI_ore_t_w>
      </div>
      <div className="shadow-xl shadow-[#100e12] w-full overflow-hidden z-1">
        <KPI_operating_time></KPI_operating_time>
      </div>
      <div className="shadow-xl shadow-[#100e12] w-full overflow-hidden z-1">
        <KPI_electricity_cons></KPI_electricity_cons>
      </div>
      <div className="shadow-xl shadow-[#100e12] w-full overflow-hidden z-1">
        <KPI_ore_remaining></KPI_ore_remaining>
      </div>
    </div>
  );
};
export default Cardrow;
