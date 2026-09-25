import type { SVGProps } from "react";

export function BrandMark({
  className = "",
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`brand-mark ${className}`.trim()}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      <path className="brand-mark-plane brand-mark-plane-a" d="M4 25V8.5L9.5 5v16.7L4 25Z" />
      <path className="brand-mark-plane brand-mark-plane-b" d="M12 22V11.4L17.5 8v10.6L12 22Z" />
      <path className="brand-mark-plane brand-mark-plane-c" d="M20 18.8V6.3L27 2v12.5l-7 4.3Z" />
      <path className="brand-mark-link" d="M6.3 25.8 24.9 14.4" />
      <circle className="brand-mark-signal" cx="25.2" cy="14.2" r="2.1" />
    </svg>
  );
}
