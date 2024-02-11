import { useState } from 'react';

import {
  defaultOptions,
  FallingSandCanvas,
  FallingSandCanvasProps,
  FpsInfo,
} from './FallingSand';
import { FallingSandCanvasOptions } from './FallingSandOptions';

export function DemoApp() {
  const [options, setOptions] =
    useState<FallingSandCanvasProps>(defaultOptions);
  const [fpsInfo, setFpsInfo] = useState<FpsInfo>({
    count: 0,
    fps: 0,
    mean: 0,
    max: 0,
    min: 0,
  });

  const handleOptionsChange = (newOptions: FallingSandCanvasProps) => {
    setOptions(newOptions);
  };

  return (
    <>
      <FallingSandCanvas {...options} onFpsChange={setFpsInfo} />
      <FallingSandCanvasOptions
        options={options}
        onOptionsChange={handleOptionsChange}
        fpsInfo={fpsInfo}
      />
    </>
  );
}
