import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import "./components/fonts";
import { Orientation, COLORS } from "./components/tokens";
import { PersistentChrome } from "./components/PersistentChrome";
import { Scene1ColdOpen } from "./scenes/Scene1ColdOpen";
import { Scene2Kinetic } from "./scenes/Scene2Kinetic";
import { Scene3ThreeActs } from "./scenes/Scene3ThreeActs";
import { Scene4ThemeReel } from "./scenes/Scene4ThemeReel";
import { Scene5Promise } from "./scenes/Scene5Promise";
import { Scene6Lockup } from "./scenes/Scene6Lockup";

export const MainVideo: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <Scene1ColdOpen orientation={orientation} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene2Kinetic orientation={orientation} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 14 })} />

        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene3ThreeActs orientation={orientation} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />

        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4ThemeReel orientation={orientation} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 14 })} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene5Promise orientation={orientation} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene6Lockup orientation={orientation} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Persistent chrome overlays (eyelets, hairlines) */}
      <PersistentChrome orientation={orientation} />
    </AbsoluteFill>
  );
};
