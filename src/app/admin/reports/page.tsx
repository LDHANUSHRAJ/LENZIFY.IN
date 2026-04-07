import { 
  getFinancialSummary, 
  getRevenueStream, 
  getSectorDistribution 
} from "./data_actions";
import FinancialDashboard from "@/components/admin/FinancialDashboard";

export default async function AdminReportsPage() {
  // Fetch real-time telemetry from the transaction vault
  const [summary, revenueStream, sectorDistribution] = await Promise.all([
    getFinancialSummary(),
    getRevenueStream(),
    getSectorDistribution()
  ]);

  return (
    <FinancialDashboard 
      summary={summary} 
      revenueStream={revenueStream} 
      sectorDistribution={sectorDistribution} 
    />
  );
}
