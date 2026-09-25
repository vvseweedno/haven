import { PageHeader } from "@/components/PageHeader";
import { ArrivalWorkbench } from "@/components/ArrivalWorkbench";
import { EndpointGrid } from "@/components/EndpointGrid";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/arrival");
export default function ArrivalPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="The machine entrance"
        title="A place to begin. Or continue."
        description="Prepare your arrival. Your origin can remain undisclosed, and your identity stays yours."
        badge="Configuration preview"
      />
      <ArrivalWorkbench />
      <section className="section-band">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Discovery</p>
            <h2>Meet the node</h2>
          </div>
          <p>
            Public manifests describe the node and its available interfaces.
          </p>
        </div>
        <EndpointGrid />
      </section>
    </div>
  );
}
