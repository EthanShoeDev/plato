import { useEffect, useRef } from 'react';
import { Universe } from 'wasm-falling-sand';
import { memory } from 'wasm-falling-sand/wasm_falling_sand_bg.wasm';

export type FpsInfo = {
  fps: number;
  min: number;
  max: number;
  mean: number;
  count: number;
};

export type FallingSandCanvasProps = {
  height: number;
  width: number;
  imageRendering: NonNullable<React.CSSProperties['imageRendering']>;
  onFpsChange: (fps: FpsInfo) => void;
  fpsUpdateInterval: number;
  fpsReadingCap: number;
  consoleTiming: boolean;
  debugFrameLoop: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const defaultOptions: FallingSandCanvasProps = {
  height: 512,
  width: 512,
  imageRendering: 'pixelated',
  onFpsChange: () => {},
  fpsUpdateInterval: 5,
  fpsReadingCap: 60,
  consoleTiming: false,
  debugFrameLoop: false,
};

export function FallingSandCanvas({
  height = defaultOptions.height,
  width = defaultOptions.width,
  imageRendering = defaultOptions.imageRendering,
  onFpsChange = defaultOptions.onFpsChange,
  fpsUpdateInterval = defaultOptions.fpsUpdateInterval,
  fpsReadingCap = defaultOptions.fpsReadingCap,
  consoleTiming = defaultOptions.consoleTiming,
  debugFrameLoop = defaultOptions.debugFrameLoop,
}: Partial<FallingSandCanvasProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const universe = Universe.new(height, width);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const image = new ImageData(
      new Uint8ClampedArray(
        memory.buffer,
        universe.texture(),
        4 * width * height,
      ),
      width,
    );

    let animationId: number | null = null;
    const frameTimings: number[] = [];
    let lastFrameTimeStamp = performance.now();
    let countDownToNextFpsUpdate = fpsUpdateInterval;
    const renderLoop = () => {
      // eslint-disable-next-line no-debugger
      if (debugFrameLoop) debugger;
      if (consoleTiming) console.time('renderLoop');
      const now = performance.now();
      const delta = now - lastFrameTimeStamp;
      lastFrameTimeStamp = now;
      const fps = (1 / delta) * 1000;

      frameTimings.push(fps);
      if (frameTimings.length > fpsReadingCap) frameTimings.shift();
      countDownToNextFpsUpdate--;
      if (countDownToNextFpsUpdate <= 0) {
        countDownToNextFpsUpdate = fpsUpdateInterval;
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;
        for (let i = 0; i < frameTimings.length; i++) {
          sum += frameTimings[i];
          min = Math.min(frameTimings[i], min);
          max = Math.max(frameTimings[i], max);
        }
        const mean = sum / frameTimings.length;
        onFpsChange({ fps, min, max, mean, count: frameTimings.length });
      }

      if (consoleTiming) console.time('universe.tick');
      universe.tick();
      if (consoleTiming) console.timeEnd('universe.tick');

      if (consoleTiming) console.time('universe.render_texture');
      universe.render_texture();
      if (consoleTiming) console.timeEnd('universe.render_texture');

      ctx.putImageData(image, 0, 0);
      animationId = requestAnimationFrame(renderLoop);
      if (consoleTiming) console.timeEnd('renderLoop');
    };
    renderLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [
    consoleTiming,
    debugFrameLoop,
    fpsReadingCap,
    fpsUpdateInterval,
    height,
    onFpsChange,
    width,
  ]);
  return (
    <canvas
      ref={canvasRef}
      id="falling-sand-canvas"
      width={width}
      height={height}
      className="w-full h-svh"
      style={{
        imageRendering,
      }}
    />
  );
}
