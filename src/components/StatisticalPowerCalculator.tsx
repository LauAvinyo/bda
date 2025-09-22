import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const StatisticalPowerCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'power' | 'sample-size'>('power');
  const [testType, setTestType] = useState('t-test');
  const [effectSize, setEffectSize] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(30);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [calculatedValue, setCalculatedValue] = useState(0);

  // Error function for normal distribution
  const erf = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  // Normal CDF
  const normalCDF = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  // Inverse normal CDF (approximation)
  const normalInverse = (p: number): number => {
    if (p <= 0 || p >= 1) return NaN;
    
    // Beasley-Springer-Moro algorithm approximation
    const c = [2.515517, 0.802853, 0.010328];
    const d = [1.432788, 0.189269, 0.001308];
    
    if (p > 0.5) {
      const t = Math.sqrt(-2 * Math.log(1 - p));
      return t - (c[0] + c[1] * t + c[2] * t * t) / (1 + d[0] * t + d[1] * t * t + d[2] * t * t * t);
    } else {
      const t = Math.sqrt(-2 * Math.log(p));
      return -(t - (c[0] + c[1] * t + c[2] * t * t) / (1 + d[0] * t + d[1] * t * t + d[2] * t * t * t));
    }
  };

  const calculatePower = (): number => {
    switch (testType) {
      case 't-test': {
        const criticalValue = normalInverse(1 - alpha / 2); // Two-tailed
        const noncentrality = effectSize * Math.sqrt(sampleSize);
        const beta = normalCDF(criticalValue - noncentrality) + normalCDF(-criticalValue - noncentrality);
        return 1 - beta;
      }
      case 'z-test': {
        const criticalValue = normalInverse(1 - alpha / 2);
        const noncentrality = effectSize * Math.sqrt(sampleSize);
        const beta = normalCDF(criticalValue - noncentrality) + normalCDF(-criticalValue - noncentrality);
        return 1 - beta;
      }
      case 'one-way-anova': {
        // Simplified power calculation for ANOVA
        const f = effectSize; // effect size as f
        const noncentrality = sampleSize * f * f;
        // Simplified approximation
        return 1 - Math.exp(-noncentrality / 2);
      }
      default:
        return 0;
    }
  };

  const calculateSampleSize = (): number => {
    switch (testType) {
      case 't-test':
      case 'z-test': {
        const zA = normalInverse(1 - alpha / 2);
        const zB = normalInverse(power);
        const n = Math.pow((zA + zB) / effectSize, 2);
        return Math.ceil(n);
      }
      case 'one-way-anova': {
        // Simplified sample size calculation for ANOVA
        const zA = normalInverse(1 - alpha);
        const zB = normalInverse(power);
        const n = Math.pow((zA + zB) / effectSize, 2);
        return Math.ceil(n);
      }
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (calculationType === 'power') {
      setCalculatedValue(calculatePower());
    } else {
      setCalculatedValue(calculateSampleSize());
    }
  }, [calculationType, testType, effectSize, sampleSize, alpha, power]);

  // Generate power curve data
  const generatePowerCurve = () => {
    const points = [];
    const effectSizes = [];
    
    for (let es = 0; es <= 2; es += 0.05) {
      effectSizes.push(es);
      
      let powerValue = 0;
      switch (testType) {
        case 't-test':
        case 'z-test': {
          const criticalValue = normalInverse(1 - alpha / 2);
          const noncentrality = es * Math.sqrt(sampleSize);
          const beta = normalCDF(criticalValue - noncentrality) + normalCDF(-criticalValue - noncentrality);
          powerValue = 1 - beta;
          break;
        }
        case 'one-way-anova': {
          const noncentrality = sampleSize * es * es;
          powerValue = 1 - Math.exp(-noncentrality / 2);
          break;
        }
      }
      
      points.push(powerValue);
    }
    
    return { effectSizes, powers: points };
  };

  const powerCurveData = generatePowerCurve();

  const chartData = {
    labels: powerCurveData.effectSizes.map(es => es.toFixed(2)),
    datasets: [
      {
        label: 'Statistical Power',
        data: powerCurveData.powers,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Current Effect Size',
        data: powerCurveData.effectSizes.map(es => es === effectSize ? calculatePower() : null),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Statistical Power vs Effect Size',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Effect Size',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Statistical Power',
        },
        min: 0,
        max: 1,
      },
    },
  };

  const getEffectSizeInterpretation = (es: number) => {
    if (es < 0.2) return 'Very Small';
    if (es < 0.5) return 'Small';
    if (es < 0.8) return 'Medium';
    return 'Large';
  };

  const testTypeOptions = [
    { value: 't-test', label: 'T-test' },
    { value: 'z-test', label: 'Z-test' },
    { value: 'one-way-anova', label: 'One-way ANOVA' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="retro-card p-6">
          <div className="terminal-window p-3 mb-4">
            <span className="font-pixel text-amber-400">POWER.COM RUNNING</span>
          </div>
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">POWER ANALYSIS SETTINGS</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculate
              </label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as 'power' | 'sample-size')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="power">Statistical Power</option>
                <option value="sample-size">Sample Size</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {testTypeOptions.map((test) => (
                  <option key={test.value} value={test.value}>
                    {test.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effect Size (Cohen's d)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="3"
                value={effectSize}
                onChange={(e) => setEffectSize(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {getEffectSizeInterpretation(effectSize)} effect
              </div>
            </div>

            {calculationType === 'power' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Size (per group)
                </label>
                <input
                  type="number"
                  min="1"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Power (1 - β)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.99"
                  value={power}
                  onChange={(e) => setPower(parseFloat(e.target.value) || 0.8)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Significance Level (α)
              </label>
              <select
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.01}>0.01</option>
                <option value={0.05}>0.05</option>
                <option value={0.10}>0.10</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="retro-card p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">RESULTS</h3>
          
          <div className="space-y-4">
            <div className="terminal-window p-4">
              <div className="text-sm font-pixel text-amber-400 mb-2">
                {calculationType === 'power' ? 'STATISTICAL POWER:' : 'REQUIRED SAMPLE SIZE:'}
              </div>
              <div className="text-3xl font-bold font-display text-amber-300">
                {calculationType === 'power' 
                  ? `${(calculatedValue * 100).toFixed(1)}%`
                  : `${Math.round(calculatedValue)}`
                }
              </div>
              <div className="text-sm font-mono text-amber-300">
                {calculationType === 'power' 
                  ? `Power = ${calculatedValue.toFixed(3)}`
                  : 'per group'
                }
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Effect Size:</span>
                <span className="font-semibold">{effectSize} ({getEffectSizeInterpretation(effectSize)})</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Alpha Level:</span>
                <span className="font-semibold">{alpha}</span>
              </div>
              
              {calculationType === 'power' ? (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sample Size:</span>
                  <span className="font-semibold">{sampleSize} per group</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600">Desired Power:</span>
                  <span className="font-semibold">{(power * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 rounded-md bg-gray-50">
              <div className="text-sm text-gray-600">
                <strong>Interpretation:</strong> {calculationType === 'power' 
                  ? `With ${sampleSize} subjects per group, you have a ${(calculatedValue * 100).toFixed(1)}% chance of detecting an effect of size ${effectSize} if it truly exists.`
                  : `You need ${Math.round(calculatedValue)} subjects per group to achieve ${(power * 100).toFixed(0)}% power for detecting an effect of size ${effectSize}.`
                }
              </div>
            </div>

            {/* Effect Size Guidelines */}
            <div className="mt-4 p-3 rounded-md bg-blue-50">
              <div className="text-sm text-blue-700">
                <strong>Cohen's d Guidelines:</strong>
                <div className="mt-1 text-xs">
                  • Small: 0.2 • Medium: 0.5 • Large: 0.8
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Power Curve Visualization */}
      <div className="chart-container">
        <div className="terminal-window p-3 mb-4">
          <span className="font-pixel text-amber-400">
            PLOTTING: POWER CURVE ANALYSIS
          </span>
        </div>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300">
          <p className="text-sm font-mono text-amber-800">
            Power curve shows statistical power vs effect size. Current settings marked in red
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticalPowerCalculator;
