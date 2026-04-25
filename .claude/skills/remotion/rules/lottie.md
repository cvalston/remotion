---
name: lottie
description: Embedding Lottie animations in Remotion
metadata:
  tags: lottie, animation, after-effects
---

## Installation

```bash
npx remotion add @remotion/lottie # npm
bunx remotion add @remotion/lottie # bun
yarn remotion add @remotion/lottie # yarn
pnpm exec remotion add @remotion/lottie # pnpm
```

## Implementation

Wrap the loading process in `delayRender()` and `continueRender()`, and save animation data in state:

```tsx
import { Lottie } from "@remotion/lottie";
import {
  cancelRender,
  continueRender,
  delayRender,
  useEffect,
  useState,
} from "remotion";

export const LottieComponent = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("https://assets10.lottiefiles.com/packages/lf20_example.json")
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  if (!animationData) {
    return null;
  }

  return (
    <Lottie
      animationData={animationData}
      style={{ width: 400, height: 400 }}
    />
  );
};
```

## Local Lottie Files

Place `.json` files in the `public/` folder:

```tsx
import { staticFile } from "remotion";

const response = await fetch(staticFile("animation.json"));
const animationData = await response.json();
```

## Styling

```tsx
<Lottie
  animationData={animationData}
  style={{
    width: 500,
    height: 500,
    position: "absolute",
  }}
/>
```
