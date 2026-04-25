---
name: silence-detection
description: Adaptive silence detection using FFmpeg loudnorm and silencedetect
metadata:
  tags: silence, ffmpeg, loudnorm, silencedetect, trimming
---

## Overview

Silence detection is a two-step process using FFmpeg within Remotion projects.

## Step 1: Measure Audio Loudness

Use the `loudnorm` filter in JSON mode to get integrated loudness and noise floor:

```bash
npx remotion ffmpeg -i input.mp4 -af loudnorm=print_format=json -f null -
```

This yields two key metrics:
- Integrated loudness (overall perceived volume in dB)
- EBU R128 gating threshold (the noise floor level)

Extract the `input_thresh` value from the JSON output to use as the silence threshold.

## Step 2: Detect Silence Segments

Apply the `silencedetect` filter using the threshold from step 1:

```bash
npx remotion ffmpeg -i input.mp4 -af "silencedetect=noise=-40dB:duration=0.5" -f null - 2>&1
```

Parameters:
- `noise` - use the threshold value from step 1 (e.g., `-40dB`)
- `duration` - minimum silence duration; 0.5 seconds is recommended

## Interpreting Output

The filter generates timestamps:
- `silence_start: X.XX` - where silence begins
- `silence_end: X.XX` - where silence ends

**Leading silence**: consecutive silence segments starting at or near 0
**Trailing silence**: final silence segment that extends to (or near) the end of the file

## Applying to Remotion

Convert detected boundaries to frame counts and apply to `<Video>`:

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

const fps = 30;
const leadingSilenceSeconds = 1.2;  // from detection
const trailingSilenceSeconds = 0.8;
const totalDurationSeconds = 45.0;

<Video
  src={staticFile("clip.mp4")}
  trimBefore={leadingSilenceSeconds}
  trimAfter={totalDurationSeconds - trailingSilenceSeconds}
/>
```
