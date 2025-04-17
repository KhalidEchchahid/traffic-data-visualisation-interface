import { DashboardLayout } from "@/components/old-components/dashboard-layout";
import { RiskPageClient } from "@/components/risk/risk-page-client";

export default function RiskPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Risk Reporting & Analysis
          </h1>
          <p className="text-muted-foreground">
            Monitor high-risk zones, analyze risk factors, and review incident
            history
          </p>
        </div>

        <RiskPageClient />
      </div>
    </DashboardLayout>
  );
}
