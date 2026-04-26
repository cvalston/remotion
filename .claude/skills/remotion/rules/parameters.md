---
name: parameters
description: Make a video parametrizable by adding a Zod schema
metadata:
  tags: parameters, zod, schema, props, customization
---

## Installation

```bash
# npm
npm i zod
# bun
bun i zod
# yarn
yarn add zod
# pnpm
pnpm i zod
```

## Basic Setup

Define a Zod schema alongside your component, then pass it to the `Composition` component:

```tsx
import { z } from "zod";
import { Composition } from "remotion";

const mySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  backgroundColor: z.string(),
  durationInSeconds: z.number().min(1).max(60),
});

type Props = z.infer<typeof mySchema>;

export const MyVideo: React.FC<Props> = ({ title, subtitle, backgroundColor }) => {
  return (
    <div style={{ backgroundColor }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

// In Root.tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  schema={mySchema}
  defaultProps={{
    title: "Hello World",
    subtitle: "A Remotion video",
    backgroundColor: "#000000",
    durationInSeconds: 5,
  }}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

All schemas supported by Zod are supported by Remotion. The top-level must be `z.object()` since React component props are objects.

## Color Picker

Install `@remotion/zod-types` for visual color selection in the sidebar:

```bash
npx remotion add @remotion/zod-types
```

```tsx
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

const mySchema = z.object({
  title: z.string(),
  primaryColor: zColor(),
  backgroundColor: zColor(),
});
```

Once configured, users can edit colors visually in the Remotion Studio sidebar.

## Rendering with Parameters

Render with custom props via CLI:

```bash
npx remotion render MyVideo out/video.mp4 --props='{"title":"Custom Title","durationInSeconds":10}'
```
