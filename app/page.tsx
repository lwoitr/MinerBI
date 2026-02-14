import { MinerProvider } from "./context/MinerContext/MinerContext";
import Dashboard from "./dashboard/page";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <MinerProvider>
      <div>
        <Dashboard />
      </div>
    </MinerProvider>
  );
}
