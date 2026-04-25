---
name: videos
description: Embedding videos in Remotion - trimming, volume, speed, looping, pitch
metadata:
  tags: video, Video, trimming, volume, playbackRate, loop
---

## Installation

```bash
npx remotion add @remotion/media
```

## Basic Usage

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

<Video src={staticFile("clip.mp4")} style={{ width: "100%", height: "100%" }} />
```

## Trimming

Use `trimBefore` and `trimAfter` to remove portions of the video. Values are in seconds:

```tsx
<Video
  src={staticFile("clip.mp4")}
  trimBefore={5}   // skip first 5 seconds
  trimAfter={30}   // stop at 30 seconds
/>
```

## Delay

Wrap in a `<Sequence>` to control when playback begins:

```tsx
import { Sequence } from "remotion";

<Sequence from={60}> {/* start at frame 60 */}
  <Video src={staticFile("clip.mp4")} />
</Sequence>
```

## Styling

```tsx
<Video
  src={staticFile("clip.mp4")}
  style={{
    width: 1920,
    height: 1080,
    objectFit: "cover",
  }}
/>
```

## Volume Control

```tsx
// Static
<Video src={staticFile("clip.mp4")} volume={0.5} />

// Muted
<Video src={staticFile("clip.mp4")} muted />

// Dynamic
<Video
  src={staticFile("clip.mp4")}
  volume={(f) => interpolate(f, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })}
/>
```

## Playback Speed

```tsx
<Video src={staticFile("clip.mp4")} playbackRate={2} /> {/* 2x speed */}
```

Note: Reverse playback is not supported.

## Looping

```tsx
<Video
  src={staticFile("clip.mp4")}
  loop
  loopVolumeCurveBehavior="repeat"
/>
```

## Pitch Shifting

Use `toneFrequency` (0.01–2 range) to adjust pitch without affecting speed. Works only during server-side rendering:

```tsx
<Video src={staticFile("clip.mp4")} toneFrequency={0.8} />
```
