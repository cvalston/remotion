---
name: voiceover
description: Adding AI-generated voiceover to Remotion compositions using ElevenLabs TTS
metadata:
  tags: voiceover, tts, elevenlabs, ai, audio
---

## Prerequisites

You'll need an ElevenLabs API key set as the `ELEVENLABS_API_KEY` environment variable.

```bash
# .env
ELEVENLABS_API_KEY=your_api_key_here
```

## Step 1: Generate Audio Files

Create a script that calls the ElevenLabs API for each scene and saves MP3 files to `public/`:

```ts
// scripts/generate-voiceover.ts
import * as fs from "fs";

const scenes = [
  { id: "scene1", text: "Welcome to our product demo." },
  { id: "scene2", text: "Let's explore the key features." },
  { id: "scene3", text: "Thank you for watching." },
];

for (const scene of scenes) {
  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: scene.text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(`public/voiceover-${scene.id}.mp3`, buffer);
  console.log(`Generated: voiceover-${scene.id}.mp3`);
}
```

## Step 2: Calculate Duration Dynamically

Use the `calculateMetadata` function to measure audio file lengths and set composition duration:

```tsx
import { CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

type Scene = { id: string; text: string };
type Props = { scenes: Scene[] };

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const fps = 30;

  const sceneDurations = await Promise.all(
    props.scenes.map(async (scene) => {
      const duration = await getAudioDurationInSeconds(
        staticFile(`voiceover-${scene.id}.mp3`)
      );
      return Math.ceil(duration * fps);
    })
  );

  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  return {
    durationInFrames: totalDuration,
    fps,
    props: {
      ...props,
      sceneDurations,
    },
  };
};
```

## Step 3: Use in Composition

```tsx
import { Audio, Sequence, staticFile } from "remotion";

type Props = {
  scenes: Scene[];
  sceneDurations: number[];
};

export const VoiceoverVideo: React.FC<Props> = ({ scenes, sceneDurations }) => {
  let currentFrame = 0;

  return (
    <>
      {scenes.map((scene, i) => {
        const from = currentFrame;
        currentFrame += sceneDurations[i];

        return (
          <Sequence key={scene.id} from={from} durationInFrames={sceneDurations[i]}>
            <Audio src={staticFile(`voiceover-${scene.id}.mp3`)} />
            <SceneComponent text={scene.text} />
          </Sequence>
        );
      })}
    </>
  );
};
```

## Notes

- If using `<TransitionSeries>`, account for transition overlaps when calculating total duration.
- The computed `sceneDurations` are passed into the component via a `voiceover` prop.
- Other TTS services can be substituted for ElevenLabs.
