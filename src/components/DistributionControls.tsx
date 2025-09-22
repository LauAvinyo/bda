import React from 'react';

interface Parameter {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

interface Distribution {
  name: string;
  parameters: Parameter[];
  description: string;
  formula: string;
}

interface DistributionControlsProps {
  distribution: Distribution;
  parameters: Record<string, number>;
  onParameterChange: (paramName: string, value: number) => void;
}

const DistributionControls: React.FC<DistributionControlsProps> = ({
  distribution,
  parameters,
  onParameterChange,
}) => {
  return (
    <div className="retro-card p-4">
      <h3 className="font-display font-semibold mb-3 text-amber-900 tracking-wider">PARAMETERS</h3>
      <div className="space-y-4">
        {distribution.parameters.map((param) => (
          <div key={param.name}>
            <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
              {param.label}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={parameters[param.name] || param.default}
                onChange={(e) => onParameterChange(param.name, parseFloat(e.target.value))}
                className="w-full h-3 bg-amber-200 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FFBF00 0%, #FFBF00 ${((parameters[param.name] || param.default) - param.min) / (param.max - param.min) * 100}%, #DEB887 ${((parameters[param.name] || param.default) - param.min) / (param.max - param.min) * 100}%, #DEB887 100%)`
                }}
              />
              <div className="flex justify-between text-xs font-pixel text-amber-600">
                <span>{param.min}</span>
                <span className="font-bold text-orange-600 bg-amber-100 px-1">
                  {(parameters[param.name] || param.default).toFixed(2)}
                </span>
                <span>{param.max}</span>
              </div>
              <input
                type="number"
                min={param.min}
                max={param.max}
                step={param.step}
                value={parameters[param.name] || param.default}
                onChange={(e) => onParameterChange(param.name, parseFloat(e.target.value))}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionControls;
