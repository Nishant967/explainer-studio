import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import type { VideoScript, SceneType } from '../../src/types';
import { TitleScene }   from '../scenes/TitleScene';
import { HookScene }    from '../scenes/HookScene';
import { StepScene }    from '../scenes/StepScene';
import { SummaryScene } from '../scenes/SummaryScene';
import { TeaserScene }  from '../scenes/TeaserScene';
import type { SceneProps } from '../scenes/types';
import type React_t from 'react';

type SceneComponent = React_t.FC<SceneProps>;

const SCENE_COMPONENTS: Partial<Record<SceneType, SceneComponent>> = {
  title:    TitleScene,
  hook:     HookScene,
  summary:  SummaryScene,
  teaser:   TeaserScene,
};

interface Props { script?: VideoScript; }

export const VideoComposition: React.FC<Props> = ({ script }) => {
  if (!script) {
    return (
      <AbsoluteFill style={{ background:'#08080e', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <p style={{ color:'#ffffff40', fontFamily:'sans-serif', fontSize:24 }}>
          No script loaded. Generate one from the UI first.
        </p>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background:'#08080e' }}>
      <Series>
        {script.scenes.map((scene, i) => {
          const Scene: SceneComponent = SCENE_COMPONENTS[scene.type] ?? StepScene;
          return (
            <Series.Sequence key={i} durationInFrames={scene.durationInFrames}>
              <Scene scene={scene} topicTitle={script.topicTitle} category={script.category} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
