import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const PValueCalculator: React.FC = () => {
  const [testType, setTestType] = useState('t-test');
  const [testStatistic, setTestStatistic] = useState(2.5);
  const [degreesOfFreedom, setDegreesOfFreedom] = useState(10);
  const [tailType, setTailType] = useState<'two-tailed' | 'left-tailed' | 'right-tailed'>('two-tailed');
  const [pValue, setPValue] = useState(0);

  const testTypes = [
    { value: 't-test', label: 'T-test', needsDf: true },
    { value: 'z-test', label: 'Z-test (Normal)', needsDf: false },
    { value: 'chi-square', label: 'Chi-square test', needsDf: true },
    { value: 'f-test', label: 'F-test', needsDf: true },
  ];

  // Error function approximation for normal distribution
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

  // T-distribution CDF using more accurate approximation
  const tCDF = (t: number, df: number): number => {
    // For t-distribution, use the relationship with beta function
    // P(T ≤ t) = 0.5 + (t/√(t²+df)) * B(1/2, df/2) * hypergeometric_function
    
    if (df === 1) {
      // Cauchy distribution (t with df=1)
      return 0.5 + Math.atan(t) / Math.PI;
    }
    
    if (df === 2) {
      // Simplified formula for df=2
      return 0.5 + t / (2 * Math.sqrt(2 + t * t));
    }
    
    // For larger df, use better approximation
    if (df >= 30) {
      // For large df, t-distribution approaches standard normal
      return normalCDF(t);
    }
    
    // General case: use series approximation
    const x = t / Math.sqrt(df);
    const absX = Math.abs(x);
    
    // Wilson-Hilferty approximation for moderate df
    let p = 0;
    if (absX < 4) {
      // Series expansion
      p = normalCDF(x * Math.sqrt((df - 1) / df) * (1 + (x * x + 1) / (4 * df) + (5 * x * x * x * x + 16 * x * x + 3) / (96 * df * df)));
    } else {
      // For extreme values, use asymptotic approximation
      const z = Math.sqrt(df) * t / Math.sqrt(df + t * t);
      p = normalCDF(z);
    }
    
    return Math.max(0, Math.min(1, p));
  };

  // Improved incomplete beta function using continued fraction
  const incompleteBeta = (a: number, b: number, x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    
    // Use symmetry relation if needed
    if (x > a / (a + b)) {
      return 1 - incompleteBeta(b, a, 1 - x);
    }
    
    // Continued fraction method
    const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + 
                       a * Math.log(x) + b * Math.log(1 - x));
    
    if (x < (a + 1) / (a + b + 2)) {
      return bt * betaContinuedFraction(a, b, x) / a;
    } else {
      return 1 - bt * betaContinuedFraction(b, a, 1 - x) / b;
    }
  };

  // Beta continued fraction
  const betaContinuedFraction = (a: number, b: number, x: number): number => {
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    let h = d;
    
    for (let m = 1; m <= 100; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      h *= d * c;
      
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      
      if (Math.abs(del - 1) < 1e-7) break;
    }
    
    return h;
  };

  // Log gamma function (Stirling's approximation)
  const logGamma = (x: number): number => {
    if (x < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x);
    x -= 1;
    const coeffs = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    let result = coeffs[0];
    for (let i = 1; i < coeffs.length; i++) {
      result += coeffs[i] / (x + i);
    }
    const t = x + coeffs.length - 1.5;
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(result);
  };

  // Chi-square CDF approximation
  const chiSquareCDF = (x: number, df: number): number => {
    return incompleteGamma(df / 2, x / 2) / Math.exp(logGamma(df / 2));
  };

  // Incomplete gamma function approximation
  const incompleteGamma = (a: number, x: number): number => {
    let result = 0;
    let term = Math.pow(x, a) * Math.exp(-x);
    for (let i = 0; i < 100; i++) {
      result += term / (a + i);
      term *= x / (a + i + 1);
      if (Math.abs(term) < 1e-10) break;
    }
    return result;
  };

  const calculatePValue = (): number => {
    let cdf = 0;
    
    switch (testType) {
      case 'z-test':
        cdf = normalCDF(testStatistic);
        break;
      case 't-test':
        cdf = tCDF(testStatistic, degreesOfFreedom);
        break;
      case 'chi-square':
        if (testStatistic >= 0) {
          cdf = chiSquareCDF(testStatistic, degreesOfFreedom);
        }
        break;
      case 'f-test':
        // F-test is always right-tailed in this context
        // Simplified approximation
        cdf = 1 - Math.exp(-testStatistic);
        break;
      default:
        return 0;
    }

    switch (tailType) {
      case 'two-tailed':
        return testType === 'chi-square' || testType === 'f-test' 
          ? 2 * (1 - cdf) 
          : 2 * Math.min(cdf, 1 - cdf);
      case 'left-tailed':
        return cdf;
      case 'right-tailed':
        return 1 - cdf;
      default:
        return 0;
    }
  };

  useEffect(() => {
    setPValue(calculatePValue());
  }, [testType, testStatistic, degreesOfFreedom, tailType]);

  // Generate visualization data
  const generateVisualizationData = () => {
    const points = [];
    let xMin = -4, xMax = 4;
    
    if (testType === 'chi-square') {
      xMin = 0;
      xMax = Math.max(20, degreesOfFreedom * 3);
    } else if (testType === 'f-test') {
      xMin = 0;
      xMax = 5;
    }

    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 200) {
      let y = 0;
      
      switch (testType) {
        case 'z-test':
          y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
          break;
        case 't-test':
          const gamma1 = Math.exp(logGamma((degreesOfFreedom + 1) / 2));
          const gamma2 = Math.exp(logGamma(degreesOfFreedom / 2));
          y = (gamma1 / (Math.sqrt(degreesOfFreedom * Math.PI) * gamma2)) * 
              Math.pow(1 + (x * x) / degreesOfFreedom, -(degreesOfFreedom + 1) / 2);
          break;
        case 'chi-square':
          if (x > 0) {
            y = (1 / (Math.pow(2, degreesOfFreedom / 2) * Math.exp(logGamma(degreesOfFreedom / 2)))) * 
                Math.pow(x, degreesOfFreedom / 2 - 1) * Math.exp(-x / 2);
          }
          break;
        case 'f-test':
          if (x > 0) {
            y = Math.exp(-x); // Simplified
          }
          break;
      }
      
      points.push({ x, y });
    }
    
    return points;
  };

  const distributionData = generateVisualizationData();
  
  // Create datasets for p-value shaded areas
  const createShadedDatasets = () => {
    const datasets = [
      {
        label: 'Distribution',
        data: distributionData.map(p => p.y),
        borderColor: 'rgb(139, 69, 19)', // Retro brown
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      }
    ];

    // Add shaded areas for p-value visualization
    if (testType === 'z-test' || testType === 't-test') {
      if (tailType === 'two-tailed') {
        // Left tail
        const leftTailData = distributionData.map(p => 
          p.x <= -Math.abs(testStatistic) ? p.y : 0
        );
        datasets.push({
          label: 'P-value (Left Tail)',
          data: leftTailData,
          borderColor: 'rgb(255, 140, 0)', // Retro orange
          backgroundColor: 'rgba(255, 140, 0, 0.6)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        });

        // Right tail
        const rightTailData = distributionData.map(p => 
          p.x >= Math.abs(testStatistic) ? p.y : 0
        );
        datasets.push({
          label: 'P-value (Right Tail)',
          data: rightTailData,
          borderColor: 'rgb(255, 140, 0)', // Retro orange
          backgroundColor: 'rgba(255, 140, 0, 0.6)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        });
      } else if (tailType === 'right-tailed') {
        const rightTailData = distributionData.map(p => 
          p.x >= testStatistic ? p.y : 0
        );
        datasets.push({
          label: 'P-value',
          data: rightTailData,
          borderColor: 'rgb(255, 140, 0)', // Retro orange
          backgroundColor: 'rgba(255, 140, 0, 0.6)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        });
      } else if (tailType === 'left-tailed') {
        const leftTailData = distributionData.map(p => 
          p.x <= testStatistic ? p.y : 0
        );
        datasets.push({
          label: 'P-value',
          data: leftTailData,
          borderColor: 'rgb(255, 140, 0)', // Retro orange
          backgroundColor: 'rgba(255, 140, 0, 0.6)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        });
      }
    } else if (testType === 'chi-square' || testType === 'f-test') {
      // Right-tailed for chi-square and F-tests
      const rightTailData = distributionData.map(p => 
        p.x >= testStatistic ? p.y : 0
      );
      datasets.push({
        label: 'P-value',
        data: rightTailData,
        borderColor: 'rgb(255, 140, 0)', // Retro orange
        backgroundColor: 'rgba(255, 140, 0, 0.6)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      });
    }

    return datasets;
  };

  const chartData = {
    labels: distributionData.map(p => p.x.toFixed(2)),
    datasets: createShadedDatasets(),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(139, 69, 19)', // Retro brown
          font: {
            family: 'IBM Plex Mono',
            size: 12,
          },
          filter: (legendItem: any) => legendItem.text !== 'Distribution'
        }
      },
      title: {
        display: true,
        text: `${testType.toUpperCase()} Distribution - P-value = ${pValue.toFixed(6)}`,
        color: 'rgb(139, 69, 19)', // Retro brown
        font: {
          family: 'VT323',
          size: 16,
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Test Statistic',
          color: 'rgb(139, 69, 19)', // Retro brown
          font: {
            family: 'IBM Plex Mono',
            size: 12,
          }
        },
        ticks: {
          color: 'rgb(139, 69, 19)', // Retro brown
          font: {
            family: 'IBM Plex Mono',
            size: 10,
          }
        },
        grid: {
          color: 'rgba(139, 69, 19, 0.2)',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Probability Density',
          color: 'rgb(139, 69, 19)', // Retro brown
          font: {
            family: 'IBM Plex Mono',
            size: 12,
          }
        },
        ticks: {
          color: 'rgb(139, 69, 19)', // Retro brown
          font: {
            family: 'IBM Plex Mono',
            size: 10,
          }
        },
        grid: {
          color: 'rgba(139, 69, 19, 0.2)',
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 0,
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="retro-card p-6">
          <div className="terminal-window p-3 mb-4">
            <span className="font-pixel text-amber-400">P-VALUE.EXE RUNNING</span>
          </div>
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">CALCULATOR SETTINGS</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                TEST TYPE
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              >
                {testTypes.map((test) => (
                  <option key={test.value} value={test.value}>
                    {test.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-pixel text-amber-800 mb-2 tracking-wide">
                TEST STATISTIC
              </label>
              <input
                type="number"
                step="0.01"
                value={testStatistic}
                onChange={(e) => setTestStatistic(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border-2 border-amber-600 bg-amber-50 font-mono text-amber-900 focus:outline-none focus:bg-amber-100"
              />
            </div>

            {testTypes.find(t => t.value === testType)?.needsDf && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degrees of Freedom
                </label>
                <input
                  type="number"
                  min="1"
                  value={degreesOfFreedom}
                  onChange={(e) => setDegreesOfFreedom(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {(testType === 'z-test' || testType === 't-test') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
                <select
                  value={tailType}
                  onChange={(e) => setTailType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="two-tailed">Two-tailed</option>
                  <option value="left-tailed">Left-tailed</option>
                  <option value="right-tailed">Right-tailed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="retro-card p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">RESULTS</h3>
          
          <div className="space-y-4">
            <div className="terminal-window p-4">
              <div className="text-sm font-pixel text-amber-400 mb-2">P-VALUE OUTPUT:</div>
              <div className="text-3xl font-bold font-display text-amber-300">
                {pValue.toExponential(4)}
              </div>
              <div className="text-sm font-mono text-amber-300">
                {pValue.toFixed(6)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between bg-amber-100 p-2 border border-amber-300">
                <span className="font-pixel text-xs text-amber-800">TEST STATISTIC:</span>
                <span className="font-bold font-mono text-orange-600">{testStatistic}</span>
              </div>
              
              {testTypes.find(t => t.value === testType)?.needsDf && (
                <div className="flex justify-between bg-amber-100 p-2 border border-amber-300">
                  <span className="font-pixel text-xs text-amber-800">DEGREES OF FREEDOM:</span>
                  <span className="font-bold font-mono text-orange-600">{degreesOfFreedom}</span>
                </div>
              )}
              
              <div className="flex justify-between bg-amber-100 p-2 border border-amber-300">
                <span className="font-pixel text-xs text-amber-800">TEST TYPE:</span>
                <span className="font-bold font-mono text-orange-600 uppercase">{tailType.replace('-', ' ')}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border-2 border-dashed border-amber-600">
              <div className="text-sm font-mono text-amber-800">
                <strong className="font-pixel">INTERPRETATION:</strong> {pValue < 0.05 
                  ? "STATISTICALLY SIGNIFICANT (p < 0.05)" 
                  : "NOT STATISTICALLY SIGNIFICANT (p ≥ 0.05)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="chart-container">
        <div className="terminal-window p-3 mb-4">
          <span className="font-pixel text-amber-400">
            PLOTTING: {testType.toUpperCase()} DISTRIBUTION
          </span>
        </div>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300">
          <p className="text-sm font-mono text-amber-800">
            <span className="inline-block w-3 h-3 bg-orange-400 mr-2 border border-orange-600"></span>
            The shaded orange area represents the p-value ({pValue.toFixed(6)}) for your test statistic ({testStatistic})
          </p>
        </div>
      </div>
    </div>
  );
};

export default PValueCalculator;
