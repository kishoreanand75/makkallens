"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "scale" | "left" | "right" | "clip";

/** Animates content in once when it scrolls into view. Visible without IntersectionObserver and under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  variant = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
  variant?: Variant;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setSeen(true)); // very old browsers: just show the content
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: variant === "clip" ? 0 : 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  return (
    <Tag
      ref={ref as never}
      data-v={variant === "up" ? undefined : variant}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ ["--d" as string]: `${delay}s`, ...style }}
    >
      {children}
    </Tag>
  );
}
