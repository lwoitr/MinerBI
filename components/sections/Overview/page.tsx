import Cardrow from "@/components/widjets/Cardrow/page";
import LastaManalCheck from "@/components/widjets/LastManualCheck/page";
import Map from "@/components/widjets/Map/page";
import Status from "@/components/widjets/Status/page";

const Overview = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-18 grid-rows-3 gap-4">
        <div className="col-start-14 col-end-19 row-start-1 row-end-4   shadow-[#6D6A75] shadow-md">
          <Map></Map>
        </div>
        <div className="col-span-13 row-start-1 row-end-3 shadow-[#6D6A75] shadow-md">
          <Status></Status>
        </div>

        <div className=" col-span-13 row-span-1">
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
