import KpiDeepDive from "@/components/sections/KpiDeepDive/page";
import Maintenenance from "@/components/sections/Maintenance/page";
import MlEfficency from "@/components/sections/MlEfficency/page";
import Overview from "@/components/sections/Overview/page";

const Dashboard = () => {
  return (
    <main className="lg: max-w-440 mx-auto py-16 scroll-smooth">
      <div>
        <Overview></Overview>
      </div>
      <div className="py-6">
        <MlEfficency></MlEfficency>
      </div>
      <div>
        <KpiDeepDive></KpiDeepDive>
      </div>

      <div className="py-6">
        <Maintenenance></Maintenenance>
      </div>
    </main>
  );
};

export default Dashboard;
