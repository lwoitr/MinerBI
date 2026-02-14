import { MinerProvider } from "./context/MinerContext/MinerContext";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <MinerProvider>
      <div>
        <Dashboard />
      </div>
    </MinerProvider>
  );
}
