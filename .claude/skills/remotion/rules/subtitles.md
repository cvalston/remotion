---
name: subtitles
description: Captions and subtitles in Remotion using @remotion/captions
metadata:
  tags: subtitles, captions, transcription, srt
---

## Caption Type

All captions must be processed using JSON format with the `Caption` type from `@remotion/captions`:

```ts
import { Caption } from "@remotion/captions";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

## Installation

```bash
npx remotion add @remotion/captions
```

## Three Main Workflows

### 1. Generating Captions

Transcribe video and audio files using a speech-to-text service (e.g., Whisper, AssemblyAI, Deepgram), then convert output to the `Caption[]` format.

### 2. Displaying Captions

Render captions synchronized with Remotion's timeline:

```tsx
import { Caption } from "@remotion/captions";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  captions: Caption[];
};

export const Subtitles: React.FC<Props> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const activeCaption = captions.find(
    (c) => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs,
  );

  if (!activeCaption) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 48,
        color: "white",
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        padding: "0 120px",
      }}
    >
      {activeCaption.text}
    </div>
  );
};
```

### 3. Importing from SRT

Convert `.srt` caption files into `Caption[]` format:

```ts
import { parseSrt } from "@remotion/captions";
import * as fs from "fs";

const srtContent = fs.readFileSync("subtitles.srt", "utf-8");
const captions: Caption[] = parseSrt({ input: srtContent });
```
