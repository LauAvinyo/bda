import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative">
        {/* Retro Background */}
        <div className="absolute inset-0 bg-gradient-warm rounded-none opacity-50"></div>
        
        <div className="relative text-center py-20">
          <div className="mb-8">
            <div className="terminal-window inline-block mb-6 p-4">
              <div className="font-pixel text-amber-400 text-lg mb-2">
                LOADING BIOSTATS.EXE
              </div>
              <div className="font-pixel text-amber-300 text-sm">
                ████████████ 100% COMPLETE ████████████
              </div>
            </div>
            
            <h1 className="text-6xl font-display font-black mb-4 gradient-text leading-tight tracking-widest">
              BIOSTATS
            </h1>
            <h2 className="text-2xl font-display font-semibold retro-text-accent mb-2">
              RETRO STATISTICAL COMPUTING
            </h2>
            <div className="flex justify-center items-center space-x-3 text-sm font-pixel text-amber-700 tracking-widest">
              <span>SYSTEM v1.984</span>
              <span>•</span>
              <span>READY</span>
            </div>
          </div>
          
          <p className="text-lg text-amber-800 max-w-4xl mx-auto mb-12 leading-relaxed font-mono">
            Classic statistical analysis platform featuring{' '}
            <span className="text-orange-600 font-semibold bg-amber-100 px-1">retro calculators</span>, 
            interactive{' '}
            <span className="text-amber-700 font-semibold bg-orange-100 px-1">chart visualizations</span>, 
            and comprehensive{' '}
            <span className="text-amber-900 font-semibold bg-amber-50 px-1">test documentation</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/distributions" 
              className="btn-retro group relative"
            >
              <span className="relative z-10">LOAD CHARTS.EXE</span>
            </Link>
            <Link 
              to="/calculators" 
              className="btn-retro group relative"
            >
              <span className="relative z-10">RUN CALC.COM</span>
            </Link>
          </div>
          
          {/* Retro Stats Display */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'DISTRIBUTIONS', value: '6+' },
              { label: 'CALCULATORS', value: '2+' },
              { label: 'TESTS', value: '4+' },
              { label: 'ACCURACY', value: '99.9%' },
            ].map((stat, index) => (
              <div key={index} className="retro-card p-4 text-center">
                <div className="w-8 h-8 bg-gradient-retro mx-auto mb-2 flex items-center justify-center border-2 border-amber-800">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="text-2xl font-bold font-display text-amber-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-pixel text-amber-600 tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retro Program Icons */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'TESTS.EXE',
            subtitle: 'STATISTICAL DOCUMENTATION',
            description: 'Classic statistical test library with mathematical formulas, examples, and comprehensive documentation for biostatistics.',
            link: '/tests',
            features: ['T-Tests', 'ANOVA', 'Chi-Square', 'Regression']
          },
          {
            title: 'CHARTS.COM',
            subtitle: 'DISTRIBUTION PLOTTER',
            description: 'Interactive probability distribution viewer with real-time parameter controls and visual probability calculations.',
            link: '/distributions',
            features: ['Normal', 'T-Dist', 'Chi-Square', 'F-Dist']
          },
          {
            title: 'CALC.BAT',
            subtitle: 'P-VALUE CALCULATOR',
            description: 'High-precision statistical calculator suite with power analysis, sample size determination, and effect size computation.',
            link: '/calculators',
            features: ['P-Values', 'Power Analysis', 'Sample Size', 'Effect Size']
          }
        ].map((feature, index) => (
          <div key={index} className="retro-card p-8 group interactive">
            <div className="relative">
              {/* Retro Program Icon */}
              <div className="mb-6 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-retro flex items-center justify-center border-3 border-amber-800 mb-3">
                  <span className="text-2xl font-display text-white font-bold">
                    {feature.title.split('.')[0].charAt(0)}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-amber-900 mb-1 tracking-wider">
                  {feature.title}
                </h3>
                <div className="text-xs font-pixel text-orange-600 tracking-widest mb-4">
                  {feature.subtitle}
                </div>
                <p className="text-amber-800 leading-relaxed mb-6 font-mono text-sm">
                  {feature.description}
                </p>
                
                {/* Feature list */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {feature.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-orange-400 border border-orange-600"></div>
                      <span className="text-amber-700 font-mono text-xs">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action link */}
              <Link 
                to={feature.link} 
                className="group/link flex items-center justify-center space-x-2 btn-retro w-full text-xs"
              >
                <span>→ EXECUTE</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* About Section - Retro Terminal Style */}
      <div className="retro-card p-8">
        <div className="terminal-window p-6">
          <div className="mb-4">
            <span className="font-pixel text-amber-400">C:\BIOSTATS&gt; TYPE README.TXT</span>
          </div>
          
          <div className="space-y-4 font-mono text-amber-300 text-sm leading-relaxed">
            <div>
              <span className="text-amber-400">═══ BIOSTATS v1.984 - STATISTICAL COMPUTING SYSTEM ═══</span>
            </div>
            
            <div>
              <span className="text-orange-300">ABOUT:</span><br/>
              &nbsp;&nbsp;This retro-style biostatistics platform provides classic<br/>
              &nbsp;&nbsp;computational tools for statistical analysis and education.<br/>
              &nbsp;&nbsp;Features include interactive calculators, distribution<br/>
              &nbsp;&nbsp;plotting, and comprehensive test documentation.
            </div>
            
            <div>
              <span className="text-orange-300">TECHNOLOGY:</span><br/>
              &nbsp;&nbsp;• Built with React + TypeScript for reliability<br/>
              &nbsp;&nbsp;• Styled with Tailwind CSS v4 for nostalgic aesthetics<br/>
              &nbsp;&nbsp;• Mathematical rendering via KaTeX integration<br/>
              &nbsp;&nbsp;• Cross-platform compatibility guaranteed
            </div>
            
            <div>
              <span className="text-orange-300">FEATURES:</span><br/>
              &nbsp;&nbsp;* Interactive probability distribution visualizations<br/>
              &nbsp;&nbsp;* Comprehensive statistical test documentation<br/>
              &nbsp;&nbsp;* High-precision p-value and power calculators<br/>
              &nbsp;&nbsp;* Markdown and LaTeX mathematical notation support
            </div>
            
            <div className="pt-4 border-t border-amber-600 border-dashed">
              <span className="text-amber-400 font-pixel">
                ═══ END OF FILE - PRESS ANY KEY TO CONTINUE ═══
              </span>
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
