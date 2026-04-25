---
name: audio-visualization
description: Visualizing audio with spectrum bars, waveforms, and bass-reactive effects
metadata:
  tags: audio, visualization, spectrum, waveform, bass
---

## Installation

```bash
npx remotion add @remotion/media-utils
```

## Spectrum Bars

Use `visualizeAudio()` to extract frequency data:

```tsx
import { visualizeAudio } from "@remotion/media-utils";
import { Audio, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { useRef } from "react";

export const SpectrumBars = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioRef = useRef<HTMLAudioElement>(null);

  const visualization = visualizeAudio({
    audioData: audioRef,
    frame,
    fps,
    numberOfSamples: 64,  // must be a power of 2 (32-1024)
    smoothingTimeConstant: 0.8,
  });

  return (
    <>
      <Audio ref={audioRef} src={staticFile("music.mp3")} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
        {visualization.map((v, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: v * 200,
              backgroundColor: "white",
            }}
          />
        ))}
      </div>
    </>
  );
};
```

Values range 0-1; left of array = bass, right = highs.

## Waveform

Combine `visualizeAudioWaveform()` with `createSmoothSvgPath()`:

```tsx
import { visualizeAudioWaveform, createSmoothSvgPath } from "@remotion/media-utils";

const waveform = visualizeAudioWaveform({
  audioData: audioRef,
  frame,
  fps,
  numberOfSamples: 256,
  windowInSeconds: 1 / fps,
});

const path = createSmoothSvgPath({ points: waveform.map((v, i) => ({
  x: (i / waveform.length) * width,
  y: height / 2 + v * height / 2,
})) });

<svg width={width} height={height}>
  <path d={path} stroke="white" strokeWidth={2} fill="none" />
</svg>
```

## Bass-Reactive Effects

Extract low-frequency portions for animations:

```tsx
const visualization = visualizeAudio({
  audioData: audioRef,
  frame,
  fps,
  numberOfSamples: 32,
});

// First ~25% of samples are bass frequencies
const bassData = visualization.slice(0, Math.floor(visualization.length * 0.25));
const bassIntensity = bassData.reduce((a, b) => a + b, 0) / bassData.length;

const scale = 1 + bassIntensity * 0.3;
```

## Important Notes

- When sharing audio data across child components, pass the `frame` value from the parent rather than calling `useCurrentFrame()` in each child — this prevents visualization discontinuities in sequenced layouts.
- Low frequencies naturally dominate visual output. Apply logarithmic scaling (converting to decibels) for better visual balance across the frequency spectrum.
