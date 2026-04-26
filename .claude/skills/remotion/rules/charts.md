---
name: charts
description: Chart and data visualization patterns for Remotion (bar, pie, line, stock charts)
metadata:
  tags: charts, data, visualization, bar, pie, line, d3, svg
---

## Key Principle

Disable third-party library animations and drive all motion through `useCurrentFrame()` for frame-accurate control.

## Bar Charts

Use `spring()` with staggered delays:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const data = [80, 45, 60, 90, 35];

const BarChart = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
      {data.map((value, i) => {
        const delay = i * 3;
        const height = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
          from: 0,
          to: value * 2,
        });

        return (
          <div
            key={i}
            style={{
              width: 40,
              height,
              backgroundColor: "#4a90e2",
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
};
```

## Pie Charts

Use `stroke-dashoffset` animation on SVG circles:

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const PieSlice = ({ percentage, color, delay }: {
  percentage: number;
  color: string;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const circumference = 2 * Math.PI * 45;

  const progress = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffset = circumference * (1 - (percentage / 100) * progress);

  return (
    <circle
      cx="50" cy="50" r="45"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeDasharray={circumference}
      strokeDashoffset={dashOffset}
      transform="rotate(-90 50 50)"
    />
  );
};
```

## Line Charts / Paths

Install `@remotion/paths`:

```bash
npx remotion add @remotion/paths
```

Animate path drawing with `evolvePath()`:

```tsx
import { evolvePath, scalePath } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";

const dataPoints = [10, 40, 25, 60, 45, 80, 55];
const width = 400;
const height = 200;

const pathData = dataPoints
  .map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (dataPoints.length - 1)) * width} ${height - (y / 100) * height}`)
  .join(" ");

const LineChart = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, pathData);

  return (
    <svg width={width} height={height}>
      <path
        d={pathData}
        stroke="white"
        strokeWidth={3}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
```

## Positioning Markers Along Paths

```tsx
import { getPointAtLength, getLength } from "@remotion/paths";

const totalLength = getLength(pathData);
const point = getPointAtLength(pathData, progress * totalLength);

<circle cx={point.x} cy={point.y} r={6} fill="yellow" />
```
