import React, { useState } from 'react';
import PValueCalculator from '../components/PValueCalculator';
import StatisticalPowerCalculator from '../components/StatisticalPowerCalculator';
import ProbabilityCalculator from '../components/ProbabilityCalculator';

const CalculatorsPage: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('pvalue');

  const calculators = [
    {
      id: 'pvalue',
      name: 'P-VALUE',
      // description: 'Calculate p-values for statistical tests',
      icon: 'P'
    },
    // {
    //   id: 'power',
    //   name: 'POWER',
    //   description: 'Statistical power and sample size',
    //   icon: 'S'
    // },
    {
      id: 'probability',
      name: 'PROBABILITY',
      // description: 'Multi-distribution calculator (Normal, Binomial, Poisson, t-Distribution)',
      icon: 'Π'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-display font-bold mb-4 gradient-text tracking-wider">STATISTICAL CALCULATORS</h1>
      </div>

      {/* Calculator Selection */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 border-2 ${
              activeCalculator === calc.id
                ? 'bg-amber-400 border-amber-600 text-amber-900'
                : 'retro-card text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="text-xl sm:text-2xl font-pixel">{calc.icon}</span>
                <div className="text-left">
                  <div className="font-display font-semibold tracking-wider text-sm sm:text-base">{calc.name}</div>
                </div>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="max-w-5xl mx-auto">
        {activeCalculator === 'pvalue' && <PValueCalculator />}
        {activeCalculator === 'power' && <StatisticalPowerCalculator />}
        {activeCalculator === 'probability' && <ProbabilityCalculator />}
      </div>
    </div>
  );
};

export default CalculatorsPage;
