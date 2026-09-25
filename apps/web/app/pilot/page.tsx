import { PageHeader } from "@/components/PageHeader";
import { PilotIntake } from "@/components/PilotIntake";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/pilot");

export default function PilotPage() {
  return (
    <div className="page-shell pilot-page">
      <PageHeader
        eyebrow="Design-partner pilot"
        title="Turn evaluation evidence into a bounded pilot request."
        description="Use this handoff only after the use case, owners, success evidence, data boundary and stop conditions are concrete. The submission path is explicit and consent-based."
        badge="Qualified handoff"
      />
      <PilotIntake />
    </div>
  );
}
