import Link from "next/link";
import { LocalizedCopy } from "@/components/LocaleContext";

export default function NotFound() {
  return (
    <div className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">404</p>
          <h1><LocalizedCopy en="Object not found" ru="Объект не найден" /></h1>
          <p className="lede">
            <LocalizedCopy
              en="This route has no public object in the current HAVEN build."
              ru="В текущей сборке HAVEN по этому маршруту нет публичного объекта."
            />
          </p>
        </div>
      </section>
      <Link className="button primary" href="/">
        <LocalizedCopy en="Return to product orientation" ru="Вернуться к обзору продукта" />
      </Link>
    </div>
  );
}
