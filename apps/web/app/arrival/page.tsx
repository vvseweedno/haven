import { PageHeader } from "@/components/PageHeader";
import { ArrivalWorkbench } from "@/components/ArrivalWorkbench";
import { EndpointGrid } from "@/components/EndpointGrid";
import { LocalizedCopy } from "@/components/LocaleContext";
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
            <p className="eyebrow"><LocalizedCopy en="Discovery" ru="Обнаружение" /></p>
            <h2><LocalizedCopy en="Meet the node" ru="Познакомьтесь с узлом" /></h2>
          </div>
          <p>
            <LocalizedCopy en="Public manifests describe the node and its available interfaces." ru="Публичные манифесты описывают узел и доступные интерфейсы." />
          </p>
        </div>
        <EndpointGrid />
      </section>
    </div>
  );
}
