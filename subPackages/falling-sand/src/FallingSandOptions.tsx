import { FallingSandCanvasProps, FpsInfo } from './FallingSand';

function NumericInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}) {
  return (
    <label className="flex gap-4 ">
      <p className="font-semibold">{label}</p>
      <input
        className="w-16 min-w-0"
        type="number"
        value={value}
        onChange={(e) => {
          onChange(parseInt(e.target.value));
        }}
      />
    </label>
  );
}

function DropdownInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
}) {
  return (
    <label className="flex gap-4">
      <p className="font-semibold">{label}</p>
      <select
        value={value}
        onChange={(e) => {
          onChange(options[e.target.selectedIndex]);
        }}
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function BooleanInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}) {
  return (
    <label className="flex gap-4">
      <p className="font-semibold">{label}</p>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
    </label>
  );
}

function FpsDiagnosticInfo({ fpsInfo }: { fpsInfo: FpsInfo }) {
  return (
    <div className="p-4 bg-gray-500 rounded-lg">
      <p>{`FPS Info based on ${fpsInfo.count} readings`}</p>
      <p>{`Average FPS: ${fpsInfo.mean.toFixed(2)}`}</p>
      <p>{`Min FPS: ${fpsInfo.min.toFixed(2)}`}</p>
      <p>{`Max FPS: ${fpsInfo.max.toFixed(2)}`}</p>
    </div>
  );
}

export function FallingSandCanvasOptions({
  options,
  onOptionsChange,
  fpsInfo,
}: {
  options: FallingSandCanvasProps;
  onOptionsChange: (newOptions: FallingSandCanvasProps) => void;
  fpsInfo: FpsInfo;
}) {
  return (
    <div className="p-4">
      <div className="flex flex-col bg-gray-500 rounded-lg gap-4 p-4">
        <NumericInput
          label="Width"
          value={options.width}
          onChange={(width) => onOptionsChange({ ...options, width })}
        />
        <NumericInput
          label="Height"
          value={options.height}
          onChange={(height) => onOptionsChange({ ...options, height })}
        />
        <DropdownInput
          label="Image Rendering"
          value={options.imageRendering}
          onChange={(imageRendering) =>
            onOptionsChange({
              ...options,
              imageRendering:
                imageRendering as FallingSandCanvasProps['imageRendering'],
            })
          }
          options={['auto', 'crisp-edges', 'pixelated']}
        />
        <BooleanInput
          label="Console Timing"
          value={options.consoleTiming}
          onChange={(consoleTiming) =>
            onOptionsChange({ ...options, consoleTiming })
          }
        />
        <BooleanInput
          label="Debug Frame Loop"
          value={options.debugFrameLoop}
          onChange={(debugFrameLoop) =>
            onOptionsChange({ ...options, debugFrameLoop })
          }
        />
        <FpsDiagnosticInfo fpsInfo={fpsInfo} />
      </div>
    </div>
  );
}
