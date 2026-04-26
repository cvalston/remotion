---
name: transitions
description: Scene transition patterns for Remotion
metadata:
  tags: transitions, TransitionSeries, fade, slide, wipe, flip
---

## Installation

```bash
npx remotion add @remotion/transitions
```

## `<TransitionSeries>` Component

Use `<TransitionSeries>` instead of `<Series>` when you want visual transitions between scenes:

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={90}>
    <Scene2 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={springTiming({ config: { damping: 200 } })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene3 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

## Available Transitions

- `fade()` - crossfade
- `slide({ direction: "from-left" | "from-right" | "from-top" | "from-bottom" })`
- `wipe({ direction: "from-left" | "from-right" | "from-top" | "from-bottom" })`
- `flip({ direction: "from-left" | "from-right" | "from-top" | "from-bottom" })`
- `clockWipe({ direction: "from-top-left" | ... })`

## Timing Options

```tsx
// Linear timing
linearTiming({ durationInFrames: 15 })

// Spring timing (duration depends on spring config)
springTiming({
  config: { damping: 200, stiffness: 100, mass: 1 },
  durationRestThreshold: 0.001,
})
```

## Duration Mechanics

Transitions overlap adjacent scenes, so the total composition length is shorter than the sum of all sequence durations. Calculate total duration:

```tsx
import { springTiming } from "@remotion/transitions";

const timing = springTiming({ config: { damping: 200 } });
const transitionDuration = timing.getDurationInFrames({ fps: 30 });
```

## Overlays

Overlays render effects over cut points without affecting the timeline duration. Note: an overlay cannot be adjacent to a transition or another overlay.

```tsx
<TransitionSeries.Transition
  presentation={overlay()}
  timing={linearTiming({ durationInFrames: 0 })}
/>
```
