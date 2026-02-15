import { ServerReady } from "@/components/ServerReady/page";
import { MinerProvider } from "./context/MinerContext/MinerContext";
import Dashboard from "./dashboard/page";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <ServerReady>
      <MinerProvider>
        <div className="p-6">
          <Dashboard />
        </div>
      </MinerProvider>
    </ServerReady>
  );
}
