---
name: ffmpeg
description: Using FFmpeg and FFprobe in Remotion projects
metadata:
  tags: ffmpeg, ffprobe, trimming, video processing
---

## FFmpeg Availability

FFmpeg and FFprobe do not need to be installed separately. They are available via:

```bash
npx remotion ffmpeg [args]
npx remotion ffprobe [args]
```

## Video Trimming Options

### Method 1 (Recommended): Use Remotion's Video Component

Use the `trimBefore` and `trimAfter` properties on the `<Video>` component. This approach avoids re-encoding and allows flexible adjustments without destructive changes:

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

<Video
  src={staticFile("clip.mp4")}
  trimBefore={5}    // skip first 5 seconds
  trimAfter={30}    // stop at 30 seconds
/>
```

### Method 2: FFmpeg Command Line

Execute FFmpeg when you need a standalone trimmed file. Re-encoding is necessary to prevent frozen frames at the video's beginning:

```bash
# Trim from 5s to 30s
npx remotion ffmpeg -i input.mp4 -ss 5 -to 30 -c:v libx264 -c:a aac output.mp4
```

## Getting Video Duration

```bash
npx remotion ffprobe -v quiet -show_entries format=duration -of csv=p=0 video.mp4
```

## Getting Video Dimensions

```bash
npx remotion ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4
```

## Converting Audio

```bash
npx remotion ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3
```
