"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0d1210",
          color: "#f3f6f1",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          <section
            role="alert"
            aria-labelledby="global-error-title"
            style={{
              width: "min(680px, 100%)",
              border: "1px solid #344139",
              borderRadius: 18,
              padding: "clamp(28px, 5vw, 52px)",
              background: "#141a16",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#a4b2a8",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              HAVEN / recovery
            </p>
            <h1
              id="global-error-title"
              style={{
                margin: 0,
                maxWidth: "16ch",
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 1,
              }}
            >
              The application shell could not start.
            </h1>
            <p style={{ margin: "18px 0 0", color: "#b9c5bd", lineHeight: 1.7 }}>
              The page did not expose raw error details. Retry the shell or return
              to the HAVEN start page.
            </p>
            <p style={{ margin: "8px 0 0", color: "#8f9e95", lineHeight: 1.7 }}>
              Оболочку приложения не удалось запустить. Повторите попытку или
              вернитесь на главную HAVEN.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 24,
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  minHeight: 42,
                  border: "1px solid #d8ff3d",
                  borderRadius: 7,
                  padding: "10px 16px",
                  background: "#d8ff3d",
                  color: "#101413",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Try again / Повторить
              </button>
              <a
                href="/"
                style={{
                  minHeight: 42,
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #536459",
                  borderRadius: 7,
                  padding: "10px 16px",
                  color: "#f3f6f1",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                HAVEN home / Главная
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
