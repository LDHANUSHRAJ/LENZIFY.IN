import { fetchReportData } from "@/lib/db/reports_actions";
import ReportDashboardClient from "./ReportDashboardClient";

export default async function AdminReportsPage() {
  // Fetch real-time telemetry from the transaction vault
  const data = await fetchReportData();

  return (
    <ReportDashboardClient initialData={data} />
  );
}
