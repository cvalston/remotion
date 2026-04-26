---
name: transparent-videos
description: Rendering out a video with transparency
metadata:
  tags: transparency, alpha, webm, prores
---

## Overview

Remotion supports rendering videos with an alpha channel (transparency). This is useful for overlays, lower thirds, and motion graphics that need to composite over other footage.

## Supported Formats

- **WebM (VP8/VP9)** - web-friendly, widely supported
- **ProRes 4444** - high quality, used in professional video workflows

## Rendering with Transparency

Render to WebM with alpha channel:

```bash
npx remotion render MyComposition out/overlay.webm --codec=vp8
```

For ProRes with alpha:

```bash
npx remotion render MyComposition out/overlay.mov --codec=prores --prores-profile=4444
```

## Composition Setup

Ensure your composition has a transparent background by NOT setting a background color:

```tsx
import { AbsoluteFill } from "remotion";

export const MyOverlay = () => {
  return (
    <AbsoluteFill>
      {/* No background color = transparent */}
      <div style={{ color: "white", fontSize: 48 }}>
        Lower Third Text
      </div>
    </AbsoluteFill>
  );
};
```

Avoid setting `backgroundColor` on the root element unless you want an opaque background.

## Checking Transparency in Studio

The Remotion Studio shows a checkerboard pattern for transparent areas, confirming the alpha channel is working correctly.
