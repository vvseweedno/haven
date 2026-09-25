import { BrandMark } from "@/components/BrandMark";
import { LocalizedCopy } from "@/components/LocaleContext";

export default function Loading() {
  return (
    <div className="page-shell route-loading-shell">
      <section
        className="route-loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <BrandMark className="route-loading-mark" />
        <div>
          <p className="eyebrow">
            <LocalizedCopy en="Loading route" ru="Загрузка раздела" />
          </p>
          <p className="route-loading-title">
            <LocalizedCopy
              en="Preparing the next HAVEN surface…"
              ru="Подготавливаем следующий раздел HAVEN…"
            />
          </p>
        </div>
      </section>
    </div>
  );
}
