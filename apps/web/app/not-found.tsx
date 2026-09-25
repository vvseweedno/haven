import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">404</p>
          <h1>Object not found</h1>
          <p className="lede">This local surface has no public object at that route.</p>
        </div>
      </section>
      <Link className="button primary" href="/observatory">
        Return to Observatory
      </Link>
    </div>
  );
}

