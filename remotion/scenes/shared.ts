import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

/** A spring that starts at 0 and settles at 1 with a given delay in frames */
export function useEntrance(delayFrames = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delayFrames, fps, config: { damping: 14, mass: 0.8 } });
}

/** Fade-in over `frames` frames starting at `delay` */
export function useFade(frames = 20, delay = 0) {
  const frame = useCurrentFrame();
  const start = Math.max(0, frame - delay);
  return Math.min(1, start / frames);
}
