import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', label: 'HOME' },
    { name: 'Statistical Tests', href: '/docs', label: 'DOCS' },
    { name: 'Distributions', href: '/distributions', label: 'CHARTS' },
    { name: 'Calculators', href: '/calculators', label: 'CALC' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative">
      {/* Retro Computer Header */}
      <nav className="retro-card border-b-0 rounded-none sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-4 sm:py-0">
            {/* Retro Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* <div className="w-14 h-14 bg-gradient-retro flex items-center justify-center border-2 border-solid" 
                     style={{borderColor: 'var(--color-text)'}}>
                  <span className="text-2xl font-display font-bold text-white">Σ</span>
                </div> */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-400"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-400"></div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-display font-bold gradient-text tracking-wider">
                  BDA Calculator
                </h1>
                <div className="text-xs font-pixel text-amber-600 tracking-widest">
                  Resources for BDA (BBI)
                </div>
              </div>
            </Link>
            
          {/* Retro Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative px-2 sm:px-3 py-2 transition-all duration-200 border-2 ${
                  isActive(item.href)
                    ? 'bg-amber-400 border-amber-600 text-amber-900'
                    : 'bg-transparent border-amber-700 text-amber-700 hover:bg-amber-100 hover:text-amber-800'
                }`}
                style={{borderStyle: 'solid'}}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-pixel text-xs sm:text-sm tracking-wider">
                    {item.label}
                  </span>
                </div>
                  
                  {/* Retro active indicator */}
                  {isActive(item.href) && (
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-500"></div>
                  )}
                  {isActive(item.href) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Retro border pattern */}
        <div className="h-2 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 relative">
          <div className="absolute inset-0 bg-repeat-x" 
               style={{
                 backgroundImage: `repeating-linear-gradient(90deg, 
                   var(--color-retro-amber) 0px, 
                   var(--color-retro-amber) 4px, 
                   var(--color-retro-orange) 4px, 
                   var(--color-retro-orange) 8px)`
               }}>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Retro Footer */}
      <footer className="relative mt-20">
        <div className="h-2 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 relative">
          <div className="absolute inset-0 bg-repeat-x" 
               style={{
                 backgroundImage: `repeating-linear-gradient(90deg, 
                   var(--color-retro-amber) 0px, 
                   var(--color-retro-amber) 4px, 
                   var(--color-retro-orange) 4px, 
                   var(--color-retro-orange) 8px)`
               }}>
          </div>
        </div>
        <div className="retro-card border-t-0 rounded-none">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
              {/* Left section */}
              <div>
                <h3 className="font-display text-lg font-bold gradient-text-alt mb-2 tracking-wider">
                  BDA 
                </h3>
                <p className="text-amber-700 text-sm font-pixel">
                  Calculator v25.1
                </p>
              </div>
              
              {/* Center section */}
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="w-3 h-3 bg-amber-400 animate-pulse" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                  <div className="w-3 h-3 bg-orange-400" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-3 h-3 bg-amber-600 animate-pulse" style={{animationDelay: '1s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                </div>
                <div className="terminal-window text-xs inline-block px-4 py-2">
                  <span className="cursor-blink">SYSTEM READY</span>
                </div>
              </div>
              
              {/* Right section */}
              <div className="text-center md:text-right">
                <p className="text-amber-700 text-sm mb-1 font-pixel">
                  Built with Love by @LAUAVINYO
                </p>
                <p className="text-amber-600 text-xs font-pixel">
                  Powered by GitHub Pages
                </p>
              </div>
            </div>
            
            {/* Bottom border with retro pattern */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-amber-600">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <p className="text-amber-600 text-xs font-pixel">
                  © 2025 BDA Calculator. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
