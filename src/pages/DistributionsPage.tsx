import React, { useState, useEffect } from 'react';
import DistributionPlot from '../components/DistributionPlot';
import DistributionControls from '../components/DistributionControls';

const DistributionsPage: React.FC = () => {
  const [selectedDistribution, setSelectedDistribution] = useState('normal');
  const [parameters, setParameters] = useState<Record<string, number>>({
    mean: 0,
    sd: 1
  });

  const distributions = {
    normal: {
      name: 'Normal Distribution',
      parameters: [
        { name: 'mean', label: 'Mean (μ)', min: -10, max: 10, step: 0.1, default: 0 },
        { name: 'sd', label: 'Standard Deviation (σ)', min: 0.1, max: 5, step: 0.1, default: 1 }
      ],
      description: 'The normal distribution is a continuous probability distribution that is symmetric around its mean.',
      formula: 'f(x) = (1/σ√(2π)) * e^(-(x-μ)²/(2σ²))'
    },
    t: {
      name: 't-Distribution',
      parameters: [
        { name: 'df', label: 'Degrees of Freedom', min: 1, max: 30, step: 1, default: 5 }
      ],
      description: 'The t-distribution is used in hypothesis testing when the sample size is small.',
      formula: 'f(t) = Γ((ν+1)/2) / (√(νπ) * Γ(ν/2)) * (1 + t²/ν)^(-(ν+1)/2)'
    },
    chisquare: {
      name: 'Chi-square Distribution',
      parameters: [
        { name: 'df', label: 'Degrees of Freedom', min: 1, max: 20, step: 1, default: 3 }
      ],
      description: 'The chi-square distribution is used in chi-square tests and confidence intervals.',
      formula: 'f(x) = (1/(2^(k/2) * Γ(k/2))) * x^(k/2-1) * e^(-x/2)'
    },
    f: {
      name: 'F-Distribution',
      parameters: [
        { name: 'df1', label: 'Numerator DF', min: 1, max: 20, step: 1, default: 5 },
        { name: 'df2', label: 'Denominator DF', min: 1, max: 20, step: 1, default: 10 }
      ],
      description: 'The F-distribution is used in ANOVA and regression analysis.',
      formula: 'f(x) = (Γ((d₁+d₂)/2) / (Γ(d₁/2)*Γ(d₂/2))) * (d₁/d₂)^(d₁/2) * x^(d₁/2-1) * (1+(d₁/d₂)*x)^(-(d₁+d₂)/2)'
    },
    binomial: {
      name: 'Binomial Distribution',
      parameters: [
        { name: 'n', label: 'Number of Trials', min: 1, max: 50, step: 1, default: 20 },
        { name: 'p', label: 'Probability of Success', min: 0.01, max: 0.99, step: 0.01, default: 0.5 }
      ],
      description: 'The binomial distribution models the number of successes in a fixed number of independent trials.',
      formula: 'P(X = k) = C(n,k) * p^k * (1-p)^(n-k)'
    },
    poisson: {
      name: 'Poisson Distribution',
      parameters: [
        { name: 'lambda', label: 'Rate Parameter (λ)', min: 0.1, max: 10, step: 0.1, default: 3 }
      ],
      description: 'The Poisson distribution models the number of events occurring in a fixed interval.',
      formula: 'P(X = k) = (λ^k * e^(-λ)) / k!'
    }
  };

  useEffect(() => {
    const dist = distributions[selectedDistribution as keyof typeof distributions];
    const newParams: Record<string, number> = {};
    dist.parameters.forEach(param => {
      newParams[param.name] = param.default;
    });
    setParameters(newParams);
  }, [selectedDistribution]);

  const handleParameterChange = (paramName: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const currentDistribution = distributions[selectedDistribution as keyof typeof distributions];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-display font-bold mb-4 gradient-text tracking-wider">PROBABILITY DISTRIBUTIONS</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="retro-card p-4">
            <h3 className="font-display font-semibold mb-3 text-amber-900 tracking-wider">SELECT DISTRIBUTION</h3>
            <div className="space-y-2">
              {Object.entries(distributions).map(([key, dist]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDistribution(key)}
                  className={`w-full text-left p-3 transition-all duration-200 border-2 font-pixel text-xs ${
                    selectedDistribution === key
                      ? 'bg-amber-400 border-amber-600 text-amber-900'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {selectedDistribution === key && <span className="mr-2">→</span>}
                  {dist.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Controls */}
          <DistributionControls
            distribution={currentDistribution}
            parameters={parameters}
            onParameterChange={handleParameterChange}
          />
        </div>

        {/* Plot and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Distribution Plot */}
          <div className="chart-container">
            <div className="terminal-window p-3 mb-4">
              <span className="font-pixel text-amber-400">
                PLOTTING: {currentDistribution.name.toUpperCase()}
              </span>
            </div>
            <DistributionPlot
              distribution={selectedDistribution}
              parameters={parameters}
            />
          </div>

          {/* Distribution Information */}
          <div className="retro-card p-6">
            <h3 className="text-xl font-display font-semibold mb-4 text-amber-900 tracking-wider">DISTRIBUTION INFO</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-pixel text-orange-600 mb-2 tracking-wide">DESCRIPTION</h4>
                <p className="text-amber-700 font-mono text-sm">{currentDistribution.description}</p>
              </div>
              
              <div>
                <h4 className="font-pixel text-orange-600 mb-2 tracking-wide">FORMULA</h4>
                <div className="terminal-window p-3 font-mono text-sm">
                  <span className="text-amber-300">{currentDistribution.formula}</span>
                </div>
              </div>

              <div>
                <h4 className="font-pixel text-orange-600 mb-2 tracking-wide">CURRENT PARAMETERS</h4>
                <div className="grid grid-cols-2 gap-4">
                  {currentDistribution.parameters.map(param => (
                    <div key={param.name} className="bg-amber-100 p-3 border-2 border-amber-300">
                      <div className="font-pixel text-xs text-amber-700">{param.label}</div>
                      <div className="text-lg font-bold font-display text-orange-600">
                        {parameters[param.name]?.toFixed(2) || param.default}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionsPage;
