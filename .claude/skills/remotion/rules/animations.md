---
name: animations
description: Fundamental animation skills for Remotion
metadata:
  tags: animation, interpolate, useCurrentFrame, easing
---

## Core Requirements

All animations MUST be driven by the `useCurrentFrame()` hook. Timing should be expressed in seconds, then multiplied by the fps value from `useVideoConfig()`.

**Prohibited Methods:**
- CSS transitions and animations will not render correctly in Remotion videos
- Tailwind animation class names are incompatible with the rendering system

## Basic Animation Pattern

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const MyComponent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <div style={{ opacity }}>Hello</div>;
};
```

## Spring Animations

Use `spring()` for physics-based animations:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 200,
  },
});
```

## Staggered Animations

For staggered entrance animations across multiple items:

```tsx
const items = ["A", "B", "C"];

{items.map((item, index) => {
  const delay = index * 5; // 5 frame stagger
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div key={item} style={{ opacity }}>{item}</div>;
})}
```
