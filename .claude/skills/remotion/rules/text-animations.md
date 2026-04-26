---
name: text-animations
description: Typography and text animation patterns for Remotion
metadata:
  tags: text, typography, typewriter, animation, highlight
---

## Typewriter Effect

Always use string slicing for typewriter effects. Never use per-character opacity.

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

const TypewriterText = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsPerSecond = 20;
  const charCount = Math.floor((frame / fps) * charsPerSecond);
  const displayedText = text.slice(0, charCount);

  return <span>{displayedText}</span>;
};
```

## Typewriter with Blinking Cursor

```tsx
const TypewriterWithCursor = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsPerSecond = 20;
  const charCount = Math.floor((frame / fps) * charsPerSecond);
  const displayedText = text.slice(0, charCount);
  const cursorVisible = Math.floor(frame / (fps / 2)) % 2 === 0;

  return (
    <span>
      {displayedText}
      {cursorVisible && <span style={{ opacity: 1 }}>|</span>}
    </span>
  );
};
```

## Word Highlighting

Animate a highlighter pen effect across words:

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const HighlightedWord = ({ word, startFrame, duration }: {
  word: string;
  startFrame: number;
  duration: number;
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: "40%",
          backgroundColor: "rgba(255, 235, 0, 0.6)",
          zIndex: -1,
        }}
      />
      {word}
    </span>
  );
};
```

## Word-by-Word Entrance

```tsx
const WordByWord = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const framesPerWord = fps / 4; // 4 words per second

  return (
    <div>
      {words.map((word, i) => {
        const wordFrame = i * framesPerWord;
        const opacity = interpolate(frame - wordFrame, [0, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span key={i} style={{ opacity, marginRight: "0.25em" }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
```
