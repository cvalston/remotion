---
name: compositions
description: Defining compositions, stills, folders, default props and dynamic metadata
metadata:
  tags: composition, still, folder, defaultProps, calculateMetadata
---

## Defining a Composition

Compositions are placed in `src/Root.tsx` and define renderable videos:

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: "Hello" }}
      />
    </>
  );
};
```

## Stills

Create single-frame images without requiring duration or fps:

```tsx
import { Still } from "remotion";

<Still
  id="Thumbnail"
  component={ThumbnailComponent}
  width={1280}
  height={720}
  defaultProps={{ title: "My Video" }}
/>
```

## Default Props

Use `type` declarations rather than `interface` to ensure `defaultProps` type safety:

```tsx
type Props = {
  text: string;
  color: string;
};

export const MyVideo: React.FC<Props> = ({ text, color }) => {
  // ...
};
```

## Folder Organization

Use the `<Folder>` component to organize compositions in the sidebar:

```tsx
import { Folder } from "remotion";

<Folder name="shorts">
  <Composition id="Short1" ... />
  <Composition id="Short2" ... />
</Folder>
```

Folder names are limited to letters, numbers, and hyphens.

## Dynamic Metadata

The `calculateMetadata` function enables dynamic configuration before rendering:

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";

type Props = { videoSrc: string };

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const data = await fetch("https://api.example.com/data", {
    signal: abortSignal,
  }).then((r) => r.json());

  return {
    durationInFrames: data.duration * 30,
    props: {
      ...props,
      fetchedData: data,
    },
  };
};

<Composition
  id="Dynamic"
  component={MyVideo}
  durationInFrames={1} // placeholder
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateMetadata}
/>
```

## Nested Compositions

Embed compositions within others using `<Sequence>` with width and height:

```tsx
<Sequence width={640} height={360}>
  <MyNestedComposition />
</Sequence>
```
