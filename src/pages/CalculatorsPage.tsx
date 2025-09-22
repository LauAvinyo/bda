import React, { useState } from 'react';
import PValueCalculator from '../components/PValueCalculator';
import StatisticalPowerCalculator from '../components/StatisticalPowerCalculator';

const CalculatorsPage: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('pvalue');

  const calculators = [
    {
      id: 'pvalue',
      name: 'P-VALUE.EXE',
      description: 'Calculate p-values for statistical tests',
      icon: 'P'
    },
    {
      id: 'power',
      name: 'POWER.COM',
      description: 'Statistical power and sample size',
      icon: 'S'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="terminal-window inline-block mb-6 p-4">
          <span className="font-pixel text-amber-400">LOADING CALC.BAT</span>
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 gradient-text tracking-wider">STATISTICAL CALCULATORS</h1>
        <p className="text-lg text-amber-800 max-w-3xl mx-auto font-mono">
          Interactive computational tools for statistical analysis
        </p>
      </div>

      {/* Calculator Selection */}
      <div className="flex justify-center space-x-4 mb-8">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`flex items-center space-x-3 px-6 py-4 transition-all duration-200 border-2 ${
              activeCalculator === calc.id
                ? 'bg-amber-400 border-amber-600 text-amber-900'
                : 'retro-card text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="text-2xl font-pixel">{calc.icon}</span>
            <div className="text-left">
              <div className="font-display font-semibold tracking-wider">{calc.name}</div>
              <div className="text-xs font-pixel opacity-80">{calc.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="max-w-5xl mx-auto">
        {activeCalculator === 'pvalue' && <PValueCalculator />}
        {activeCalculator === 'power' && <StatisticalPowerCalculator />}
      </div>
    </div>
  );
};

export default CalculatorsPage;
