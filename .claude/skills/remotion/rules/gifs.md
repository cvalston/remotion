---
name: gifs
description: Displaying GIFs and animated images synchronized with Remotion's timeline
metadata:
  tags: gif, AnimatedImage, animated, apng, webp
---

## `<AnimatedImage>` Component

The `<AnimatedImage>` component supports GIF, APNG, AVIF, or WebP formats synchronized with Remotion's timeline:

```tsx
import { AnimatedImage, staticFile } from "remotion";

<AnimatedImage
  src={staticFile("animation.gif")}
  width={400}
  height={300}
/>
```

## Remote Source

```tsx
<AnimatedImage
  src="https://example.com/animation.gif"
  width={400}
  height={300}
/>
```

## Sizing Control

The `fit` prop controls sizing behavior:

```tsx
<AnimatedImage
  src={staticFile("animation.gif")}
  width={400}
  height={300}
  fit="cover"   // "fill" | "contain" | "cover"
/>
```

## Playback Management

```tsx
<AnimatedImage
  src={staticFile("animation.gif")}
  width={400}
  height={300}
  playbackRate={2}           // 2x speed
  loopBehavior="loop"        // "loop" | "pause-after-finish" | "clear-after-finish"
/>
```

## Duration Calculation

Get GIF duration to synchronize with composition length:

```tsx
import { getGifDurationInSeconds } from "@remotion/gif";
import { staticFile } from "remotion";

const durationInSeconds = await getGifDurationInSeconds(staticFile("animation.gif"));
const durationInFrames = Math.ceil(durationInSeconds * fps);
```

## Fallback Option

For browsers lacking `<AnimatedImage>` support, the `<Gif>` component from `@remotion/gif` offers similar functionality (GIF only):

```bash
npx remotion add @remotion/gif
```

```tsx
import { Gif } from "@remotion/gif";
import { staticFile } from "remotion";

<Gif src={staticFile("animation.gif")} width={400} height={300} fit="contain" />
```
