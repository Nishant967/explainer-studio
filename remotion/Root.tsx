import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition';
import { REMOTION } from '../src/config/constants';

// Import the generated script at render time
// Run: npm run generate -- --topic <id> --level <level> first
let script: import('../src/types').VideoScript | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  script = require('./script.json') as import('../src/types').VideoScript;
} catch {
  // script.json not yet generated — studio will still open
}

export const Root: React.FC = () => {
  const duration = script?.totalDurationInFrames ?? 300;

  return (
    <Composition
      id={REMOTION.COMPOSITION_ID}
      component={VideoComposition}
      durationInFrames={duration}
      fps={REMOTION.FPS}
      width={REMOTION.WIDTH}
      height={REMOTION.HEIGHT}
      defaultProps={{ script: script ?? undefined }}
    />
  );
};
