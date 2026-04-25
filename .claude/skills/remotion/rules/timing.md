---
name: timing
description: Timing with interpolate and Bézier easing, springs
metadata:
  tags: timing, interpolate, easing, spring, bezier
---

## Core: interpolate()

The `interpolate()` function drives motion over a specified frame range:

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

By default, values aren't constrained outside the input range. Always use `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` unless you specifically want extrapolation.

## Bézier Easing

Bézier curves use the same four parameters as CSS `cubic-bezier()`:

```tsx
import { interpolate, Easing, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// Crisp UI entrance
const x = interpolate(frame, [0, 30], [0, 100], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Editorial fade
const opacity = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.45, 0, 0.55, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Playful overshoot
const scale = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## Preset Easings

Named curves are available in five convexities (quad, cubic, sin, exp, circle) paired with directional modifiers:

- Use `Easing.out` for enter animations
- Use `Easing.in` for exit animations
- Use `Easing.inOut` for transitions

```tsx
// Ease out cubic - good for entrances
const y = interpolate(frame, [0, 30], [100, 0], {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## Spring Animations

Use `spring()` for physics-based, natural motion:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 200,
    stiffness: 100,
    mass: 1,
  },
  from: 0,
  to: 1,
});
```

## Composing Multiple Animations

Create a single normalized progress value (0 to 1) and derive each animated property from it:

```tsx
const { fps } = useVideoConfig();
const frame = useCurrentFrame();

const progress = interpolate(frame, [0, 2 * fps], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});

const opacity = progress;
const translateY = interpolate(progress, [0, 1], [40, 0]);
const scale = interpolate(progress, [0, 1], [0.9, 1]);
```

## Time in Seconds

Always express timing in seconds, then multiply by fps:

```tsx
const { fps } = useVideoConfig();
const twoSeconds = 2 * fps;
const halfSecond = 0.5 * fps;
```
