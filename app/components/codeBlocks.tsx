"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { highlight } from "sugar-high";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

export function Code({ children, className, ...props }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMermaid = className === "language-mermaid";
  const [codeHTML, setCodeHTML] = React.useState("");

  useEffect(() => {
    if (isMermaid && ref.current) {
      const renderDiagram = async () => {
        if (ref.current) {
          ref.current.innerHTML = "";
        }
        try {
          const { svg } = await mermaid.render(
            `mermaid-${Math.random().toString(36).substr(2, 9)}`,
            children
          );
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          if (ref.current) {
            ref.current.innerHTML = "Failed to render diagram";
          }
        }
      };
      renderDiagram();
    } else {
      // Apply syntax highlighting for non-mermaid code
      setCodeHTML(highlight(children));
    }
  }, [children, isMermaid]);

  if (isMermaid) {
    return <div ref={ref} className="mermaid-wrapper" />;
  }

  return (
    <code
      className={className}
      {...props}
      dangerouslySetInnerHTML={{ __html: codeHTML }}
    />
  );
}
