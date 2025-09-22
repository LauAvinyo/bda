import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative">
        {/* Retro Background */}
        <div className="absolute inset-0 bg-gradient-warm rounded-none opacity-50"></div>
        
        <div className="relative text-center py-1 mb-4">
          <div className="mb-2">
            {/* <div className="terminal-window inline-block p-4 mb-8">
              <div className="font-pixel text-amber-400 text-lg mb-2">
                LOADING BIOSTATS
              </div>
              <div className="font-pixel text-amber-300 text-sm">
                ████████████ 100% COMPLETE ████████████
              </div>
            </div> */}
            
            {/* <h1 className="text-6xl font-display font-black mb-4 mt-4 gradient-text leading-tight tracking-widest">
              BIOSTATISTICS AND DATA ANALYSIS
            </h1> */}
            <h1 className="text-4xl font-display font-semibold retro-text-accent mb-2">
              Resources for BDA (BBI)
            </h1>
            <div className="flex justify-center items-center space-x-3 text-sm font-pixel text-amber-700 tracking-widest">
              <span>SYSTEM v25.1</span>
              <span>•</span>
              <span>@LAUAVINYO</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* About Section - Retro Terminal Style */}
      <div className="retro-card p-8">
        <div className="terminal-window p-6">
          <div className="mb-4">
            <span className="font-pixel text-amber-400">C:\BIOSTATS&gt; TYPE README.TXT</span>
          </div>
          
          <div className="space-y-4 font-mono text-amber-300 text-sm leading-relaxed">
            <div>
              <span className="text-amber-400">═══ BDA Calculator v25.1 ═══</span>
            </div>
            
            <div>
              <span className="text-orange-300">ABOUT:</span><br/>
              &nbsp;&nbsp;This BDA Calculator provides classic<br/>
              &nbsp;&nbsp;computational tools for statistical analysis.<br/>
              &nbsp;&nbsp;Features include interactive calculators, distribution<br/>
              &nbsp;&nbsp;plotting, and comprehensive test documentation. <br/>
              &nbsp;&nbsp; (that should not replace the notes in class!!).
            </div>
            
            <div>
              <span className="text-orange-300">FEATURES:</span><br/>
              &nbsp;&nbsp;• Hypothesis testing basics<br/>
              &nbsp;&nbsp;• Docs for tests (t-test, z-test)<br/>
              &nbsp;&nbsp;• Plotting distributions (normal, t, poisson, binomial, chi-square, f-distribution)<br/>
              &nbsp;&nbsp;• Hypothesis testing basics (t-test, z-test, chi-square test, f-test)<br/>
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
