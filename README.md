# BioStats v1.984 - Retro Computing SPA

A nostalgic retro-style Single Page Application (SPA) for biostatistics education and research, featuring a warm beige color scheme and classic computer aesthetics.

## Features

- **TESTS**: Comprehensive statistical test documentation with LaTeX formulas in retro terminal styling
- **CHARTS.COM**: Interactive probability distribution plots with classic computing interface
- **CALC**: P-value and power calculators with authentic retro design elements
- **Terminal-Style UI**: Nostalgic computing experience with pixel art elements and vintage fonts
- **Retro Aesthetic**: Warm beige/cream color palette reminiscent of classic computers

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom retro theme
- **Fonts**: VT323, IBM Plex Mono, Share Tech Mono for authentic retro feel
- **Charts**: Chart.js with react-chartjs-2 in retro styling
- **Math Rendering**: KaTeX for LaTeX expressions with vintage presentation
- **Markdown**: react-markdown with math plugin support
- **Statistical Calculations**: simple-statistics library
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/username/biostats-spa.git
cd biostats-spa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push to the main branch and the application will be automatically built and deployed.

You can also deploy manually using:
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout component
│   ├── DistributionPlot.tsx
│   ├── DistributionControls.tsx
│   ├── PValueCalculator.tsx
│   └── StatisticalPowerCalculator.tsx
├── pages/              # Main application pages
│   ├── HomePage.tsx
│   ├── StatisticalTestsPage.tsx
│   ├── DistributionsPage.tsx
│   └── CalculatorsPage.tsx
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Retro Computing Features

### TESTS - Statistical Documentation
- Student's t-test library with retro formatting
- ANOVA documentation in terminal style
- Chi-square tests with pixel art elements
- Linear regression with classic UI
- Mathematical formulas in nostalgic presentation

### CHARTS.COM - Distribution Plotter
- Normal distribution with vintage controls
- t-distribution with retro parameter sliders
- Chi-square distribution in classic styling
- F-distribution with amber/beige color scheme
- Binomial and Poisson with pixel art indicators

### CALC - Statistical Calculators
- P-value calculator with terminal output styling
- Statistical power analysis in retro format
- Sample size determination with classic interface
- Effect size interpretation with vintage aesthetics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and TypeScript for robust development
- Tailwind CSS v4 for modern, responsive styling
- Chart.js for beautiful, interactive visualizations
- KaTeX for high-quality mathematical typesetting
- Simple-statistics for accurate statistical calculations