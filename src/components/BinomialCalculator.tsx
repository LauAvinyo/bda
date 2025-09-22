import React, { useState, useEffect } from 'react';

const BinomialCalculator: React.FC = () => {
  const [n, setN] = useState<number>(10); // number of trials
  const [p, setP] = useState<number>(0.5); // probability of success
  const [k, setK] = useState<number>(5); // number of successes
  const [calculationType, setCalculationType] = useState<string>('equal'); // equal, less_equal, greater_equal, between
  const [kUpper, setKUpper] = useState<number>(7); // for range calculations
  const [result, setResult] = useState<number>(0);

  // Binomial coefficient (n choose k)
  const binomialCoeff = (n: number, k: number): number => {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    // Use the more efficient formula: n! / (k! * (n-k)!)
    // But calculate it iteratively to avoid large factorials
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return result;
  };

  // Probability mass function: P(X = k)
  const pmf = (n: number, k: number, p: number): number => {
    if (k < 0 || k > n) return 0;
    return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  // Cumulative distribution function: P(X ≤ k)
  const cdf = (n: number, k: number, p: number): number => {
    let sum = 0;
    for (let i = 0; i <= Math.min(k, n); i++) {
      sum += pmf(n, i, p);
    }
    return sum;
  };

  // Calculate result based on calculation type
  const calculateResult = (): number => {
    switch (calculationType) {
      case 'equal': // P(X = k)
        return pmf(n, k, p);
      case 'less_equal': // P(X ≤ k) - like pbinom(k, n, p) in R
        return cdf(n, k, p);
      case 'greater_equal': // P(X ≥ k)
        return 1 - cdf(n, k - 1, p);
      case 'between': // P(k ≤ X ≤ kUpper)
        return cdf(n, kUpper, p) - cdf(n, k - 1, p);
      default:
        return 0;
    }
  };

  useEffect(() => {
    setResult(calculateResult());
  }, [n, p, k, kUpper, calculationType]);

  // Generate data for visualization
  const generatePlotData = () => {
    const data = [];
    for (let i = 0; i <= n; i++) {
      const probability = pmf(n, i, p);
      let isHighlighted = false;
      
      switch (calculationType) {
        case 'equal':
          isHighlighted = i === k;
          break;
        case 'less_equal':
          isHighlighted = i <= k;
          break;
        case 'greater_equal':
          isHighlighted = i >= k;
          break;
        case 'between':
          isHighlighted = i >= k && i <= kUpper;
          break;
      }
      
      data.push({ x: i, y: probability, highlighted: isHighlighted });
    }
    return data;
  };

  const plotData = generatePlotData();
  const maxY = Math.max(...plotData.map(d => d.y));

  // Get R equivalent command
  const getRCommand = (): string => {
    switch (calculationType) {
      case 'equal':
        return `dbinom(${k}, ${n}, ${p})`;
      case 'less_equal':
        return `pbinom(${k}, ${n}, ${p})`;
      case 'greater_equal':
        return `pbinom(${k-1}, ${n}, ${p}, lower.tail=FALSE)`;
      case 'between':
        return `pbinom(${kUpper}, ${n}, ${p}) - pbinom(${k-1}, ${n}, ${p})`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="retro-card p-6">
          <div className="terminal-window p-3 mb-4">
            <span className="font-pixel text-amber-400">BINOMIAL.EXE RUNNING</span>
          </div>
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">BINOMIAL CALCULATOR</h3>
          
          <div className="space-y-4">
            {/* Parameters */}
            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                NUMBER OF TRIALS (n)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>

            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                PROBABILITY OF SUCCESS (p)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={p}
                onChange={(e) => setP(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>

            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                CALCULATION TYPE
              </label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              >
                <option value="equal">P(X = k) - Exact probability</option>
                <option value="less_equal">P(X ≤ k) - Cumulative (pbinom)</option>
                <option value="greater_equal">P(X ≥ k) - Upper tail</option>
                <option value="between">P(k ≤ X ≤ k₂) - Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                NUMBER OF SUCCESSES (k)
              </label>
              <input
                type="number"
                min="0"
                max={n}
                value={k}
                onChange={(e) => setK(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>

            {calculationType === 'between' && (
              <div>
                <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                  UPPER BOUND (k₂)
                </label>
                <input
                  type="number"
                  min={k}
                  max={n}
                  value={kUpper}
                  onChange={(e) => setKUpper(parseInt(e.target.value) || k)}
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
                PROBABILITY:
              </div>
              <div className="text-3xl font-bold font-display text-amber-300">
                {result.toFixed(6)}
              </div>
              <div className="text-sm font-mono text-amber-300 mt-2">
                {(result * 100).toFixed(4)}%
              </div>
            </div>

            <div className="bg-amber-100 p-3 border-2 border-amber-300">
              <div className="text-sm font-pixel text-amber-800 mb-2">R EQUIVALENT:</div>
              <div className="font-mono text-xs text-amber-900 bg-amber-50 p-2 border border-amber-400">
                {getRCommand()}
              </div>
            </div>

            <div className="bg-amber-50 p-3 border border-amber-300">
              <div className="text-sm font-pixel text-amber-800 mb-2">PARAMETERS:</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>n = {n}</div>
                <div>p = {p}</div>
                <div>k = {k}</div>
                {calculationType === 'between' && <div>k₂ = {kUpper}</div>}
              </div>
            </div>

            <div className="bg-amber-50 p-3 border border-amber-300">
              <div className="text-sm font-pixel text-amber-800 mb-2">DISTRIBUTION INFO:</div>
              <div className="text-xs font-mono space-y-1">
                <div>Mean = np = {(n * p).toFixed(2)}</div>
                <div>Variance = np(1-p) = {(n * p * (1 - p)).toFixed(2)}</div>
                <div>Std Dev = √[np(1-p)] = {Math.sqrt(n * p * (1 - p)).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="chart-container">
        <div className="terminal-window p-3 mb-4">
          <span className="font-pixel text-amber-400">
            PLOTTING: BINOMIAL DISTRIBUTION (n={n}, p={p})
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
            
            {/* Bars */}
            {plotData.map((point, i) => {
              const barHeight = (point.y / maxY) * 250;
              const barWidth = Math.max(600 / (n + 1), 10);
              const x = 60 + (i / n) * 680;
              
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
                  {/* X-axis labels */}
                  <text
                    x={x}
                    y={325}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8B4513"
                    fontFamily="monospace"
                  >
                    {i}
                  </text>
                </g>
              );
            })}
            
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
              Number of Successes (k)
            </text>
            <text x="30" y="175" textAnchor="middle" fontSize="12" fill="#8B4513" fontFamily="monospace" transform="rotate(-90 30 175)">
              Probability
            </text>
          </svg>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300">
          <p className="text-sm font-mono text-amber-800">
            <span className="inline-block w-3 h-3 bg-orange-400 mr-2 border border-orange-600"></span>
            Highlighted bars show the probability region being calculated
          </p>
        </div>
      </div>
    </div>
  );
};

export default BinomialCalculator;
