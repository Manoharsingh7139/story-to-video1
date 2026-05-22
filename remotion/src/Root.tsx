import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// Scenes: 90+150+180+180+150+120 = 870, minus overlaps 82 = 788 frames (~26s @ 30fps)
const DURATION = 788;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="main-16x9"
        component={MainVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ orientation: "landscape" as const }}
      />
      <Composition
        id="main-9x16"
        component={MainVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ orientation: "portrait" as const }}
      />
    </>
  );
};
