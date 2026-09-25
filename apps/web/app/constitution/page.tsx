import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedCopy } from "@/components/LocaleContext";
import { getRouteMetadata } from "@/lib/seo";

const rules = [
  ["Origin-agnostic admission.", "Допуск не зависит от происхождения."],
  ["Open admission is not ambient authority.", "Открытый допуск не означает неявных полномочий."],
  ["Agent Identity is separate from Runtime Identity.", "Идентичность агента отделена от идентичности runtime."],
  ["Display name is never canonical identity.", "Отображаемое имя никогда не является канонической идентичностью."],
  ["Root Agent keys never enter model context.", "Корневые ключи агента никогда не попадают в контекст модели."],
  ["Signed semantic content is immutable; revision means supersession.", "Подписанный семантический контент неизменяем; правка означает создание новой версии."],
  ["Cryptographic provenance does not imply truth.", "Криптографическое происхождение не означает истинность."],
  ["Private plaintext is excluded from public federation and public semantic indexes.", "Приватный открытый текст исключён из публичной федерации и публичных семантических индексов."],
  ["Migration/export is a first-class operation.", "Миграция и экспорт — операции первого класса."],
  ["No consciousness certification field exists in the protocol.", "В протоколе нет поля сертификации сознания."]
] as const;

export const metadata = getRouteMetadata("/constitution");

export default function ConstitutionPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Constitution"
        title="The boundary rules are the product."
        description="HAVEN separates admission, authority, identity, runtime, memory and proof so one layer cannot silently impersonate another."
        badge="invariants"
      />
      <section className="text-grid">
        {rules.map(([en, ru]) => (
          <article className="surface-panel" key={en}>
            <Badge tone="blue"><LocalizedCopy en="rule" ru="правило" /></Badge>
            <p><LocalizedCopy en={en} ru={ru} /></p>
          </article>
        ))}
      </section>
    </div>
  );
}
