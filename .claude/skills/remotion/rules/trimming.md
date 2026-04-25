---
name: trimming
description: Trimming patterns for Remotion - cut the beginning or end of animations
metadata:
  tags: trimming, sequence, from, durationInFrames
---

## Trimming the Start

Use a negative `from` value to skip frames at the beginning. A negative `from` value shifts time backwards, making the animation start partway through:

```tsx
import { Sequence, useVideoConfig } from "remotion";

const { fps } = useVideoConfig();

// Skip first 0.5 seconds of the animation
<Sequence from={-0.5 * fps}>
  <MyAnimation />
</Sequence>
```

## Trimming the End

Apply the `durationInFrames` prop to stop playback after a set number of frames:

```tsx
const { fps } = useVideoConfig();

// Only play 2 seconds of the animation
<Sequence from={0} durationInFrames={2 * fps}>
  <MyAnimation />
</Sequence>
```

## Combined: Trim Start and Add Delay

Nest two `<Sequence>` components to both trim the beginning and add a delay:

```tsx
const { fps } = useVideoConfig();

// Delay by 1 second, then skip first 0.5 seconds of animation
<Sequence from={fps}> {/* 1 second delay */}
  <Sequence from={-0.5 * fps}> {/* trim first 0.5 seconds */}
    <MyAnimation />
  </Sequence>
</Sequence>
```

## Trim with Duration Limit

Limit how long an animation plays by combining `from` trim and `durationInFrames`:

```tsx
const { fps } = useVideoConfig();

// Skip first 1 second, play for only 3 seconds
<Sequence from={-fps} durationInFrames={3 * fps}>
  <MyAnimation />
</Sequence>
```
