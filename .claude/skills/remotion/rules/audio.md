---
name: audio
description: Using audio and sound in Remotion - importing, trimming, volume, speed, pitch
metadata:
  tags: audio, Audio, sound, volume, trimming, playbackRate
---

## Installation

```bash
npx remotion add @remotion/media
```

## Basic Usage

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

<Audio src={staticFile("music.mp3")} />
```

## Trimming

Remove portions using `trimBefore` and `trimAfter` (measured in seconds):

```tsx
<Audio
  src={staticFile("music.mp3")}
  trimBefore={5}   // skip first 5 seconds
  trimAfter={30}   // stop at 30 seconds
/>
```

## Delay

Wrap audio in a `<Sequence>` to delay playback:

```tsx
import { Sequence } from "remotion";

<Sequence from={30}> {/* start at frame 30 */}
  <Audio src={staticFile("music.mp3")} />
</Sequence>
```

## Volume Control

Static volume (0-1):

```tsx
<Audio src={staticFile("music.mp3")} volume={0.5} />
```

Dynamic volume using frame-based callback (frame starts at 0 when audio begins):

```tsx
<Audio
  src={staticFile("music.mp3")}
  volume={(f) => interpolate(f, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })}
/>
```

## Muting

```tsx
<Audio src={staticFile("music.mp3")} muted={frame > 90} />
```

## Playback Speed

```tsx
<Audio src={staticFile("music.mp3")} playbackRate={2} /> {/* 2x speed */}
```

Note: Reverse playback is not supported.

## Looping

```tsx
<Audio
  src={staticFile("music.mp3")}
  loop
  loopVolumeCurveBehavior="repeat" // "repeat" resets count; "extend" continues
/>
```

## Pitch Adjustment

Use `toneFrequency` (0.01–2 range) to modify pitch independently of speed. This feature functions only during server-side rendering, not in Studio preview or Player:

```tsx
<Audio src={staticFile("music.mp3")} toneFrequency={1.2} />
```
