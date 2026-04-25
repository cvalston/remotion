---
name: measuring-text
description: Measuring text dimensions, fitting text to containers, and checking overflow
metadata:
  tags: text, measuring, dimensions, overflow, fitting
---

## measureText()

Measure text dimensions before rendering:

```tsx
import { measureText } from "@remotion/layout-utils";

const measurement = measureText({
  text: "Hello World",
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: "bold",
});

console.log(measurement.width);  // width in pixels
console.log(measurement.height); // height in pixels
```

## Fitting Text to a Container

Use `fitText()` to find the maximum font size that fits within a container width:

```tsx
import { fitText } from "@remotion/layout-utils";

const { fontSize } = fitText({
  text: "Dynamic headline text",
  withinWidth: 800,
  fontFamily: "Inter",
  fontWeight: "bold",
});

<div style={{ fontSize, fontFamily: "Inter", fontWeight: "bold" }}>
  Dynamic headline text
</div>
```

## Checking Text Overflow

```tsx
import { measureText } from "@remotion/layout-utils";

const containerWidth = 600;
const { width } = measureText({ text, fontFamily, fontSize });
const isOverflowing = width > containerWidth;
```

## Installation

```bash
npx remotion add @remotion/layout-utils
```

## Important Note

Always ensure fonts are loaded before measuring text. Use `waitUntilDone()` from `@remotion/google-fonts` or the equivalent for local fonts.
