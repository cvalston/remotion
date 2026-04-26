---
name: calculate-metadata
description: Dynamically set composition duration, dimensions, and props
metadata:
  tags: calculateMetadata, duration, dimensions, dynamic, props
---

## Overview

The `calculateMetadata` function dynamically configures composition settings. It runs once before rendering begins and can override placeholder values set in `<Composition>`.

## Basic Usage

```tsx
import { CalculateMetadataFunction } from "remotion";

type Props = { videoSrc: string };

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  return {
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    props: {
      ...props,
    },
  };
};
```

All returned fields are optional.

## Video Duration

Fetch video duration and convert to frames:

```tsx
import { getVideoDuration } from "@remotion/media-utils";

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const duration = await getVideoDuration(props.videoSrc);
  const fps = 30;

  return {
    durationInFrames: Math.ceil(duration * fps),
    fps,
  };
};
```

## Video Dimensions

Match composition dimensions to source video:

```tsx
import { getVideoMetadata } from "@remotion/media-utils";

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const { width, height, durationInSeconds } = await getVideoMetadata(props.videoSrc);

  return {
    width,
    height,
    durationInFrames: Math.ceil(durationInSeconds * 30),
  };
};
```

## Fetching Remote Data

```tsx
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const data = await fetch("https://api.example.com/video-config", {
    signal: abortSignal,
  }).then((r) => r.json());

  return {
    durationInFrames: data.duration * 30,
    props: {
      ...props,
      title: data.title,
      scenes: data.scenes,
    },
  };
};
```

The `abortSignal` handles cleanup when props change in Studio, preventing orphaned requests.

## Wiring Up

```tsx
<Composition
  id="DynamicVideo"
  component={MyVideo}
  durationInFrames={1}   // placeholder value
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateMetadata}
/>
```
