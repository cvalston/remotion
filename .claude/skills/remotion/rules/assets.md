---
name: assets
description: Importing images, videos, audio, and fonts into Remotion
metadata:
  tags: assets, staticFile, public, images, videos, audio, fonts
---

## File Storage

Place assets in the `public/` folder at your project root.

## Required Function: staticFile()

You must use the `staticFile()` function to reference any files stored in the public directory. This function returns an encoded URL that works correctly when deploying to subdirectories.

```tsx
import { staticFile } from "remotion";

// Images
<Img src={staticFile("logo.png")} />

// Videos
<Video src={staticFile("clip.mp4")} />

// Audio
<Audio src={staticFile("music.mp3")} />
```

## External Sources

Remote URLs can be referenced directly in components without `staticFile()`:

```tsx
<Img src="https://example.com/image.png" />
<Video src="https://example.com/video.mp4" />
```

Note: Remote assets must have CORS enabled.

## Component Reference

| Asset Type | Component | Package |
|------------|-----------|---------|
| Images | `<Img>` | `remotion` |
| Videos | `<Video>` | `@remotion/media` |
| Audio | `<Audio>` | `@remotion/media` |
| GIFs/APNG | `<AnimatedImage>` | `remotion` |
| Lottie | `<Lottie>` | `@remotion/lottie` |

## Fonts

Use `staticFile()` with a `FontFace` object for local fonts:

```tsx
import { staticFile } from "remotion";

const fontFace = new FontFace(
  "MyFont",
  `url(${staticFile("fonts/MyFont.woff2")})`,
);
await fontFace.load();
document.fonts.add(fontFace);
```

## Automatic Processing

Remotion components ensure assets are fully loaded before rendering begins, preventing flickering and blank frames during video export.
