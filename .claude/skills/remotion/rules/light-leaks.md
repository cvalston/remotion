---
name: light-leaks
description: Light leak overlay effects using @remotion/light-leaks
metadata:
  tags: light-leaks, overlay, effects, cinematic
---

## Installation

```bash
npx remotion add @remotion/light-leaks
```

## Basic Usage

```tsx
import { LightLeak } from "@remotion/light-leaks";

<LightLeak type="top-left" />
```

## Available Types

- `"top-left"`
- `"top-right"`
- `"bottom-left"`
- `"bottom-right"`
- `"center"`

## Customization

```tsx
<LightLeak
  type="top-right"
  style={{ opacity: 0.6 }}
/>
```

## Using with TransitionSeries as Overlay

Light leaks work well as overlays at scene cut points:

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={overlay(<LightLeak type="top-left" />)}
    timing={linearTiming({ durationInFrames: 0 })}
  />
  <TransitionSeries.Sequence durationInFrames={90}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Note: Overlays do not affect the total composition duration.
