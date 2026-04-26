---
name: fonts
description: Loading Google Fonts and local fonts in Remotion
metadata:
  tags: fonts, google-fonts, typography, loadFont
---

## Google Fonts

Install the package:

```bash
npx remotion add @remotion/google-fonts
```

Basic usage with automatic type safety and rendering block until font is ready:

```tsx
import { loadFont } from "@remotion/google-fonts/Lobster";

const { fontFamily } = loadFont();

export const MyComponent = () => {
  return <div style={{ fontFamily }}>Hello World</div>;
};
```

Loading specific weights and subsets:

```tsx
import { loadFont, waitUntilDone } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// Confirm font is loaded before rendering
await waitUntilDone();
```

## Local Fonts

Install the package:

```bash
npx remotion add @remotion/fonts
```

Font files should reside in the `public/` folder:

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await loadFont({
  family: "MyCustomFont",
  url: staticFile("fonts/MyCustomFont.woff2"),
});
```

Loading multiple weights of the same typeface (use same family name):

```tsx
await loadFont({
  family: "MyCustomFont",
  url: staticFile("fonts/MyCustomFont-Regular.woff2"),
  weight: "400",
  style: "normal",
});

await loadFont({
  family: "MyCustomFont",
  url: staticFile("fonts/MyCustomFont-Bold.woff2"),
  weight: "700",
  style: "normal",
});
```

## Best Practice

Load fonts at the component's top level or in an imported initialization file to ensure availability throughout your application.

```tsx
// fonts.ts - loaded once at top level
import { loadFont } from "@remotion/google-fonts/Inter";
export const { fontFamily } = loadFont();
```
