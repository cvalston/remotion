import "./index.css";
import React from "react";
import {Composition} from "remotion";
import {CrisisToConfidenceHero} from "./components/CrisisToConfidenceHero";
import {RandyLewisHero, randyLewisSchema, defaultProps as randyDefaultProps} from "./components/RandyLewisHero";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CrisisToConfidenceHero"
        component={CrisisToConfidenceHero}
        durationInFrames={30 * 45}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="RandyLewisHero"
        component={RandyLewisHero}
        durationInFrames={30 * 43} // ~43s: 6+6+8+(5×3)+8
        fps={30}
        width={1080}
        height={1920}
        schema={randyLewisSchema}
        defaultProps={randyDefaultProps}
      />
    </>
  );
};
