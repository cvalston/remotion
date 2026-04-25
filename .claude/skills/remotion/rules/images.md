---
name: images
description: Embedding images in Remotion using the Img component
metadata:
  tags: images, Img, staticFile, getImageDimensions
---

## IMPORTANT: Always Use `<Img>` from Remotion

You MUST use the `<Img>` component from remotion. Alternatives like native HTML `<img>` elements, Next.js `<Image>`, or CSS `background-image` are explicitly prohibited because the `<Img>` component ensures images are fully loaded before rendering, preventing flickering and blank frames during video export.

## Local Images

Place images in `public/` and reference with `staticFile()`:

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} />
```

## Remote Images

Remote images can use direct URLs without `staticFile()`, provided they have CORS enabled:

```tsx
<Img src="https://example.com/image.png" />
```

## Styling

```tsx
<Img
  src={staticFile("hero.jpg")}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
```

## Dynamic Image Paths

```tsx
const images = ["frame001.jpg", "frame002.jpg", "frame003.jpg"];
const index = Math.floor((frame / fps) * images.length);

<Img src={staticFile(images[index])} />
```

## Image Dimensions

Retrieve image dimensions programmatically to calculate aspect ratios or set composition dimensions:

```tsx
import { getImageDimensions } from "remotion";

const { width, height } = await getImageDimensions(staticFile("photo.jpg"));
const aspectRatio = width / height;
```

## Animated GIFs

For animated GIFs, use `<AnimatedImage>` (see gifs.md).
