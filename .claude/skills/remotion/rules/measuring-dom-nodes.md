---
name: measuring-dom-nodes
description: Measuring DOM element dimensions in Remotion
metadata:
  tags: dom, measuring, dimensions, useRef, delayRender
---

## Overview

Measuring DOM element dimensions in Remotion requires using `delayRender()` and `continueRender()` to ensure measurements happen before rendering proceeds.

## Basic Pattern

```tsx
import { useEffect, useRef, useState } from "react";
import { continueRender, delayRender } from "remotion";

export const MeasuredComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [handle] = useState(() => delayRender("Measuring element"));

  useEffect(() => {
    if (!ref.current) return;

    const { width, height } = ref.current.getBoundingClientRect();
    setDimensions({ width, height });
    continueRender(handle);
  }, [handle]);

  return (
    <div ref={ref}>
      {dimensions ? (
        <p>Width: {dimensions.width}, Height: {dimensions.height}</p>
      ) : null}
    </div>
  );
};
```

## ResizeObserver for Dynamic Content

For content that may change size:

```tsx
import { useEffect, useRef, useState } from "react";

export const DynamicMeasure = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
};
```

## Important Notes

- Always use `delayRender()` when you need measurements before first render
- Measurements happen in the browser/Chromium environment during rendering
- Avoid measuring elements that aren't yet mounted
