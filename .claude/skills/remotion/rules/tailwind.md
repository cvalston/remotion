---
name: tailwind
description: Using TailwindCSS in Remotion
metadata:
  tags: tailwind, css, styling
---

## Setup

Scaffold a new project with Tailwind support:

```bash
npx create-video@latest --yes --blank my-video
```

To add Tailwind to an existing Remotion project, follow the [official Tailwind installation guide](https://tailwindcss.com/docs/installation).

## Important Restrictions

**CSS transitions and animation classes are PROHIBITED** in Remotion. These include:

- `transition-*` classes
- `animate-*` classes
- `duration-*` classes (when used for animations)

These will not render correctly in exported videos. Instead, drive all animations through `useCurrentFrame()`.

## What You CAN Use

All static Tailwind utility classes work fine:

```tsx
<div className="flex items-center justify-center bg-black text-white text-4xl font-bold p-8 rounded-xl">
  Hello World
</div>
```

## Combining Tailwind with Remotion Animations

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

<div
  className="flex items-center justify-center text-white text-4xl"
  style={{ opacity }}  // animated value via inline style
>
  Hello World
</div>
```

Use Tailwind for static layout/styling and inline `style` props for animated values.
