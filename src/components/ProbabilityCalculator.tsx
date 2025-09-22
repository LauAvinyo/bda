import React, { useState, useEffect } from 'react';

type DistributionType = 'binomial' | 'normal' | 'poisson';
type CalculationType = 'density' | 'cumulative_lower' | 'cumulative_upper' | 'between';

interface DistributionParams {
  binomial: { n: number; p: number };
  normal: { mean: number; sd: number };
  poisson: { lambda: number };
}

const ProbabilityCalculator: React.FC = () => {
  const [distribution, setDistribution] = useState<DistributionType>('binomial');
  const [calculationType, setCalculationType] = useState<CalculationType>('cumulative_lower');
  const [value, setValue] = useState<number>(5);
  const [upperValue, setUpperValue] = useState<number>(7);
  const [result, setResult] = useState<number>(0);
  
  // Distribution parameters
  const [params, setParams] = useState<DistributionParams>({
    binomial: { n: 10, p: 0.5 },
    normal: { mean: 0, sd: 1 },
    poisson: { lambda: 2 }
  });

  // Error function for normal distribution
  const erf = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  // Binomial coefficient
  const binomialCoeff = (n: number, k: number): number => {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return result;
  };

  // Distribution functions
  const distributions = {
    binomial: {
      pmf: (k: number): number => {
        const { n, p } = params.binomial;
        if (k < 0 || k > n || !Number.isInteger(k)) return 0;
        return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
      },
      cdf: (k: number): number => {
        const { n } = params.binomial;
        let sum = 0;
        for (let i = 0; i <= Math.min(Math.floor(k), n); i++) {
          sum += distributions.binomial.pmf(i);
        }
        return sum;
      }
    },
    normal: {
      pdf: (x: number): number => {
        const { mean, sd } = params.normal;
        return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
      },
      cdf: (x: number): number => {
        const { mean, sd } = params.normal;
        return 0.5 * (1 + erf((x - mean) / (sd * Math.sqrt(2))));
      }
    },
    poisson: {
      pmf: (k: number): number => {
        const { lambda } = params.poisson;
        if (k < 0 || !Number.isInteger(k)) return 0;
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / distributions.poisson.factorial(k);
      },
      cdf: (k: number): number => {
        let sum = 0;
        for (let i = 0; i <= Math.floor(k); i++) {
          sum += distributions.poisson.pmf(i);
        }
        return sum;
      },
      factorial: (n: number): number => {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      }
    }
  };

  // Fix Poisson factorial reference
  distributions.poisson.pmf = (k: number): number => {
    const { lambda } = params.poisson;
    if (k < 0 || !Number.isInteger(k)) return 0;
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / distributions.poisson.factorial(k);
  };

  const calculateResult = (): number => {
    switch (distribution) {
      case 'binomial':
        switch (calculationType) {
          case 'density':
            return distributions.binomial.pmf(value);
          case 'cumulative_lower':
            return distributions.binomial.cdf(value);
          case 'cumulative_upper':
            return 1 - distributions.binomial.cdf(value - 1);
          case 'between':
            return distributions.binomial.cdf(upperValue) - distributions.binomial.cdf(value - 1);
        }
        break;
      case 'normal':
        switch (calculationType) {
          case 'density':
            return distributions.normal.pdf(value);
          case 'cumulative_lower':
            return distributions.normal.cdf(value);
          case 'cumulative_upper':
            return 1 - distributions.normal.cdf(value);
          case 'between':
            return distributions.normal.cdf(upperValue) - distributions.normal.cdf(value);
        }
        break;
      case 'poisson':
        switch (calculationType) {
          case 'density':
            return distributions.poisson.pmf(value);
          case 'cumulative_lower':
            return distributions.poisson.cdf(value);
          case 'cumulative_upper':
            return 1 - distributions.poisson.cdf(value - 1);
          case 'between':
            return distributions.poisson.cdf(upperValue) - distributions.poisson.cdf(value - 1);
        }
        break;
    }
    return 0;
  };

  useEffect(() => {
    setResult(calculateResult());
  }, [distribution, calculationType, value, upperValue, params]);

  // Generate plot data
  const generatePlotData = () => {
    const data = [];
    let xMin, xMax, isDiscrete;
    
    if (distribution === 'binomial') {
      xMin = 0;
      xMax = params.binomial.n;
      isDiscrete = true;
    } else if (distribution === 'normal') {
      const { mean, sd } = params.normal;
      xMin = mean - 4 * sd;
      xMax = mean + 4 * sd;
      isDiscrete = false;
    } else { // poisson
      xMin = 0;
      xMax = Math.max(20, params.poisson.lambda * 3);
      isDiscrete = true;
    }

    if (isDiscrete) {
      for (let i = xMin; i <= xMax; i++) {
        let y, highlighted = false;
        
        if (distribution === 'binomial') {
          y = distributions.binomial.pmf(i);
        } else {
          y = distributions.poisson.pmf(i);
        }
        
        switch (calculationType) {
          case 'density':
            highlighted = i === value;
            break;
          case 'cumulative_lower':
            highlighted = i <= value;
            break;
          case 'cumulative_upper':
            highlighted = i >= value;
            break;
          case 'between':
            highlighted = i >= value && i <= upperValue;
            break;
        }
        
        data.push({ x: i, y, highlighted });
      }
    } else {
      // Normal distribution - continuous
      const steps = 200;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = distributions.normal.pdf(x);
        
        let highlighted = false;
        switch (calculationType) {
          case 'density':
            highlighted = Math.abs(x - value) < (xMax - xMin) / 100;
            break;
          case 'cumulative_lower':
            highlighted = x <= value;
            break;
          case 'cumulative_upper':
            highlighted = x >= value;
            break;
          case 'between':
            highlighted = x >= value && x <= upperValue;
            break;
        }
        
        data.push({ x, y, highlighted });
      }
    }
    
    return { data, isDiscrete, xMin, xMax };
  };

  const plotInfo = generatePlotData();
  const maxY = Math.max(...plotInfo.data.map(d => d.y));

  // Get R command
  const getRCommand = (): string => {
    const { mean, sd } = params.normal;
    const { n, p } = params.binomial;
    const { lambda } = params.poisson;
    
    switch (distribution) {
      case 'binomial':
        switch (calculationType) {
          case 'density':
            return `dbinom(${value}, ${n}, ${p})`;
          case 'cumulative_lower':
            return `pbinom(${value}, ${n}, ${p})`;
          case 'cumulative_upper':
            return `pbinom(${value-1}, ${n}, ${p}, lower.tail=FALSE)`;
          case 'between':
            return `pbinom(${upperValue}, ${n}, ${p}) - pbinom(${value-1}, ${n}, ${p})`;
        }
        break;
      case 'normal':
        switch (calculationType) {
          case 'density':
            return `dnorm(${value}, ${mean}, ${sd})`;
          case 'cumulative_lower':
            return `pnorm(${value}, ${mean}, ${sd})`;
          case 'cumulative_upper':
            return `pnorm(${value}, ${mean}, ${sd}, lower.tail=FALSE)`;
          case 'between':
            return `pnorm(${upperValue}, ${mean}, ${sd}) - pnorm(${value}, ${mean}, ${sd})`;
        }
        break;
      case 'poisson':
        switch (calculationType) {
          case 'density':
            return `dpois(${value}, ${lambda})`;
          case 'cumulative_lower':
            return `ppois(${value}, ${lambda})`;
          case 'cumulative_upper':
            return `ppois(${value-1}, ${lambda}, lower.tail=FALSE)`;
          case 'between':
            return `ppois(${upperValue}, ${lambda}) - ppois(${value-1}, ${lambda})`;
        }
        break;
    }
    return '';
  };

  const getCalculationLabel = (): string => {
    const isDiscreteVar = distribution === 'binomial' || distribution === 'poisson';
    switch (calculationType) {
      case 'density':
        return isDiscreteVar ? `P(X = ${value})` : `f(${value})`;
      case 'cumulative_lower':
        return `P(X ≤ ${value})`;
      case 'cumulative_upper':
        return `P(X ≥ ${value})`;
      case 'between':
        return `P(${value} ≤ X ≤ ${upperValue})`;
    }
  };

  const updateParam = (key: string, newValue: number) => {
    setParams(prev => ({
      ...prev,
      [distribution]: {
        ...prev[distribution],
        [key]: newValue
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="retro-card p-6">
          <div className="terminal-window p-3 mb-4">
            <span className="font-pixel text-amber-400">PROBABILITY.EXE RUNNING</span>
          </div>
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">DISTRIBUTION CALCULATOR</h3>
          
          <div className="space-y-4">
            {/* Distribution Selection */}
            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                DISTRIBUTION TYPE
              </label>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value as DistributionType)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              >
                <option value="binomial">Binomial</option>
                <option value="normal">Normal</option>
                <option value="poisson">Poisson</option>
              </select>
            </div>

            {/* Parameters based on distribution */}
            {distribution === 'binomial' && (
              <>
                <div>
                  <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                    TRIALS (n)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={params.binomial.n}
                    onChange={(e) => updateParam('n', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                    PROBABILITY (p)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.binomial.p}
                    onChange={(e) => updateParam('p', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                  />
                </div>
              </>
            )}

            {distribution === 'normal' && (
              <>
                <div>
                  <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                    MEAN (μ)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={params.normal.mean}
                    onChange={(e) => updateParam('mean', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                    STANDARD DEVIATION (σ)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.1"
                    value={params.normal.sd}
                    onChange={(e) => updateParam('sd', parseFloat(e.target.value) || 0.01)}
                    className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                  />
                </div>
              </>
            )}

            {distribution === 'poisson' && (
              <div>
                <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                  RATE (λ)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={params.poisson.lambda}
                  onChange={(e) => updateParam('lambda', parseFloat(e.target.value) || 0.01)}
                  className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                />
              </div>
            )}

            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                CALCULATION TYPE
              </label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              >
                <option value="density">
                  {distribution === 'normal' ? 'Density f(x)' : 'Probability P(X = k)'}
                </option>
                <option value="cumulative_lower">P(X ≤ k) - Lower tail</option>
                <option value="cumulative_upper">P(X ≥ k) - Upper tail</option>
                <option value="between">P(k₁ ≤ X ≤ k₂) - Between</option>
              </select>
            </div>

            {/* Value inputs */}
            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                VALUE {calculationType === 'between' ? '(Lower)' : ''}
              </label>
              <input
                type="number"
                step={distribution === 'normal' ? '0.1' : '1'}
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>

            {calculationType === 'between' && (
              <div>
                <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                  UPPER VALUE
                </label>
                <input
                  type="number"
                  step={distribution === 'normal' ? '0.1' : '1'}
                  value={upperValue}
                  onChange={(e) => setUpperValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="retro-card p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">RESULTS</h3>
          
          <div className="space-y-4">
            <div className="terminal-window p-4">
              <div className="text-sm font-pixel text-amber-400 mb-2">
                {getCalculationLabel()}:
              </div>
              <div className="text-3xl font-bold font-display text-amber-300">
                {result.toFixed(6)}
              </div>
              {calculationType !== 'density' && (
                <div className="text-sm font-mono text-amber-300 mt-2">
                  {(result * 100).toFixed(4)}%
                </div>
              )}
            </div>

            <div className="bg-amber-100 p-3 border-2 border-amber-300">
              <div className="text-sm font-pixel text-amber-800 mb-2">R EQUIVALENT:</div>
              <div className="font-mono text-xs text-amber-900 bg-amber-50 p-2 border border-amber-400">
                {getRCommand()}
              </div>
            </div>

            <div className="bg-amber-50 p-3 border border-amber-300">
              <div className="text-sm font-pixel text-amber-800 mb-2">PARAMETERS:</div>
              <div className="text-xs font-mono space-y-1">
                {distribution === 'binomial' && (
                  <>
                    <div>n = {params.binomial.n}</div>
                    <div>p = {params.binomial.p}</div>
                    <div>Mean = np = {(params.binomial.n * params.binomial.p).toFixed(2)}</div>
                    <div>Var = np(1-p) = {(params.binomial.n * params.binomial.p * (1 - params.binomial.p)).toFixed(2)}</div>
                  </>
                )}
                {distribution === 'normal' && (
                  <>
                    <div>μ = {params.normal.mean}</div>
                    <div>σ = {params.normal.sd}</div>
                    <div>Variance = σ² = {(params.normal.sd ** 2).toFixed(2)}</div>
                  </>
                )}
                {distribution === 'poisson' && (
                  <>
                    <div>λ = {params.poisson.lambda}</div>
                    <div>Mean = λ = {params.poisson.lambda}</div>
                    <div>Variance = λ = {params.poisson.lambda}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="chart-container">
        <div className="terminal-window p-3 mb-4">
          <span className="font-pixel text-amber-400">
            PLOTTING: {distribution.toUpperCase()} DISTRIBUTION
          </span>
        </div>
        
        <div className="bg-amber-50 p-4 border-2 border-amber-600" style={{ height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 350">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
              <line
                key={i}
                x1="60"
                y1={50 + frac * 250}
                x2="740"
                y2={50 + frac * 250}
                stroke="#DEB887"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Plot based on distribution type */}
            {plotInfo.isDiscrete ? (
              // Bar chart for discrete distributions
              plotInfo.data.map((point, i) => {
                const barHeight = (point.y / maxY) * 250;
                const barWidth = Math.max(600 / plotInfo.data.length, 8);
                const x = 60 + (i / (plotInfo.data.length - 1)) * 680;
                
                return (
                  <g key={i}>
                    <rect
                      x={x - barWidth/2}
                      y={300 - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={point.highlighted ? "#FF8C00" : "#CD853F"}
                      stroke="#8B4513"
                      strokeWidth="1"
                    />
                    {i % Math.max(1, Math.floor(plotInfo.data.length / 10)) === 0 && (
                      <text
                        x={x}
                        y={325}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#8B4513"
                        fontFamily="monospace"
                      >
                        {point.x}
                      </text>
                    )}
                  </g>
                );
              })
            ) : (
              // Line chart for continuous distributions
              <>
                <polyline
                  points={plotInfo.data.map((point, i) => {
                    const x = 60 + (i / (plotInfo.data.length - 1)) * 680;
                    const y = 300 - (point.y / maxY) * 250;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="2"
                />
                {/* Highlighted area */}
                {calculationType !== 'density' && (
                  <polyline
                    points={[
                      ...plotInfo.data.filter(p => p.highlighted).map((point) => {
                        const originalIndex = plotInfo.data.indexOf(point);
                        const x = 60 + (originalIndex / (plotInfo.data.length - 1)) * 680;
                        const y = 300 - (point.y / maxY) * 250;
                        return `${x},${y}`;
                      }),
                      // Close the area
                      ...[...plotInfo.data.filter(p => p.highlighted)].reverse().map((point) => {
                        const originalIndex = plotInfo.data.indexOf(point);
                        const x = 60 + (originalIndex / (plotInfo.data.length - 1)) * 680;
                        return `${x},300`;
                      })
                    ].join(' ')}
                    fill="rgba(255, 140, 0, 0.6)"
                    stroke="none"
                  />
                )}
              </>
            )}
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
              <text
                key={i}
                x="50"
                y={305 - frac * 250}
                textAnchor="end"
                fontSize="10"
                fill="#8B4513"
                fontFamily="monospace"
              >
                {(frac * maxY).toFixed(3)}
              </text>
            ))}
            
            {/* Axes */}
            <line x1="60" y1="300" x2="740" y2="300" stroke="#8B4513" strokeWidth="2"/>
            <line x1="60" y1="50" x2="60" y2="300" stroke="#8B4513" strokeWidth="2"/>
            
            {/* Labels */}
            <text x="400" y="345" textAnchor="middle" fontSize="12" fill="#8B4513" fontFamily="monospace">
              {distribution === 'normal' ? 'Value (x)' : 'Number of Events (k)'}
            </text>
            <text x="30" y="175" textAnchor="middle" fontSize="12" fill="#8B4513" fontFamily="monospace" transform="rotate(-90 30 175)">
              {distribution === 'normal' ? 'Density' : 'Probability'}
            </text>
          </svg>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300">
          <p className="text-sm font-mono text-amber-800">
            <span className="inline-block w-3 h-3 bg-orange-400 mr-2 border border-orange-600"></span>
            {plotInfo.isDiscrete ? 'Highlighted bars' : 'Highlighted area'} shows the probability region being calculated
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityCalculator;
