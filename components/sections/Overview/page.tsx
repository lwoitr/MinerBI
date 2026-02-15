import Cardrow from "@/components/widjets/Cardrow/page";
import LastaManalCheck from "@/components/widjets/LastManualCheck/page";
import Map from "@/components/widjets/Map/page";
import Status from "@/components/widjets/Status/page";

const Overview = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-9 grid-rows-3 gap-4">
        <div className="col-start-7 col-end-10 row-span-3  shadow-[#6D6A75] shadow-md h-59">
          <Map></Map>
        </div>
        <div className="col-span-6 row-start-1 row-span-2 shadow-[#6D6A75] shadow-md">
          <Status></Status>
        </div>

        <div className=" col-span-6 row-span-1">
          <LastaManalCheck></LastaManalCheck>
        </div>
      </div>
      <div className=" flex pt-4 ">
        <Cardrow></Cardrow>
      </div>
    </div>
  );
};

export default Overview;
