---
name: sequencing
description: Sequencing patterns for Remotion - delay, trim, limit duration of items
metadata:
  tags: sequence, series, timing, delay, duration
---

## `<Sequence>` Component

The `<Sequence>` component delays when elements appear. Inside a `<Sequence>`, `useCurrentFrame()` returns the local frame (starting from 0) rather than the absolute timeline position.

```tsx
import { Sequence } from "remotion";

// Delay by 1 second (at 30fps)
<Sequence from={30} durationInFrames={60} premountFor={30}>
  <MyComponent />
</Sequence>
```

Key props:
- `from` - starting frame (use negative to trim the beginning)
- `durationInFrames` - how long this sequence plays
- `premountFor` - frames to premount before the sequence starts (always set this to load components before playback)
- `layout="none"` - prevents wrapping in an absolute fill element

## `<Series>` Component

For sequential, non-overlapping elements, `<Series>` automatically manages timing:

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={60}>
    <Scene1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={90}>
    <Scene2 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={45}>
    <Scene3 />
  </Series.Sequence>
</Series>
```

Each sequence plays after the previous one completes.

## Overlapping Items

Create overlaps using negative offset values in `<Series>`:

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <Scene1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={90} offset={-10}>
    <Scene2 /> {/* starts 10 frames before Scene1 ends */}
  </Series.Sequence>
</Series>
```

## Nested Sequences

Combine sequences for complex timing:

```tsx
<Sequence from={30}> {/* delay 1 second */}
  <Sequence from={-15}> {/* trim first 0.5 seconds */}
    <MyAnimation />
  </Sequence>
</Sequence>
```

## Layout Control

Use `layout="none"` when you don't want the sequence to create a positioned wrapper:

```tsx
<Sequence from={0} durationInFrames={60} layout="none">
  <span>Inline content</span>
</Sequence>
```
