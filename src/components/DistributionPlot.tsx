import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
// Statistical calculations are implemented inline

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DistributionPlotProps {
  distribution: string;
  parameters: Record<string, number>;
}

const DistributionPlot: React.FC<DistributionPlotProps> = ({ distribution, parameters }) => {
  const generateNormalData = (mean: number, sd: number) => {
    const points = [];
    const xMin = mean - 4 * sd;
    const xMax = mean + 4 * sd;
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 200) {
      const y = (1 / (sd * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
      points.push({ x, y });
    }
    return points;
  };

  const generateTData = (df: number) => {
    const points = [];
    const xMin = -4;
    const xMax = 4;
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 200) {
      // Approximation of t-distribution PDF
      const gamma1 = Math.exp(logGamma((df + 1) / 2));
      const gamma2 = Math.exp(logGamma(df / 2));
      const y = (gamma1 / (Math.sqrt(df * Math.PI) * gamma2)) * 
                Math.pow(1 + (x * x) / df, -(df + 1) / 2);
      points.push({ x, y });
    }
    return points;
  };

  const generateChiSquareData = (df: number) => {
    const points = [];
    const xMax = Math.max(20, df * 3);
    for (let x = 0.1; x <= xMax; x += xMax / 200) {
      // Approximation of chi-square PDF
      const y = (1 / (Math.pow(2, df / 2) * Math.exp(logGamma(df / 2)))) * 
                Math.pow(x, df / 2 - 1) * Math.exp(-x / 2);
      points.push({ x, y });
    }
    return points;
  };

  const generateFData = (df1: number, df2: number) => {
    const points = [];
    const xMax = 5;
    for (let x = 0.1; x <= xMax; x += xMax / 200) {
      // Approximation of F-distribution PDF
      const beta = Math.exp(logGamma((df1 + df2) / 2) - logGamma(df1 / 2) - logGamma(df2 / 2));
      const y = beta * Math.pow(df1 / df2, df1 / 2) * Math.pow(x, df1 / 2 - 1) * 
                Math.pow(1 + (df1 / df2) * x, -(df1 + df2) / 2);
      points.push({ x, y });
    }
    return points;
  };

  const generateBinomialData = (n: number, p: number) => {
    const points = [];
    for (let k = 0; k <= n; k++) {
      const y = binomialPMF(n, k, p);
      points.push({ x: k, y });
    }
    return points;
  };

  const generatePoissonData = (lambda: number) => {
    const points = [];
    const maxK = Math.max(20, lambda * 3);
    for (let k = 0; k <= maxK; k++) {
      const y = poissonPMF(k, lambda);
      points.push({ x: k, y });
    }
    return points;
  };

  // Helper functions
  const logGamma = (x: number): number => {
    // Stirling's approximation for log(Gamma(x))
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

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const binomialCoefficient = (n: number, k: number): number => {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    return factorial(n) / (factorial(k) * factorial(n - k));
  };

  const binomialPMF = (n: number, k: number, p: number): number => {
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  const poissonPMF = (k: number, lambda: number): number => {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  };

  const generateData = () => {
    switch (distribution) {
      case 'normal':
        return generateNormalData(parameters.mean || 0, parameters.sd || 1);
      case 't':
        return generateTData(parameters.df || 5);
      case 'chisquare':
        return generateChiSquareData(parameters.df || 3);
      case 'f':
        return generateFData(parameters.df1 || 5, parameters.df2 || 10);
      case 'binomial':
        return generateBinomialData(parameters.n || 20, parameters.p || 0.5);
      case 'poisson':
        return generatePoissonData(parameters.lambda || 3);
      default:
        return [];
    }
  };

  const data = generateData();
  const isDiscrete = distribution === 'binomial' || distribution === 'poisson';

  const chartData = {
    labels: data.map(point => point.x.toFixed(2)),
    datasets: [
      {
        label: 'Probability Density/Mass',
        data: data.map(point => point.y),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: isDiscrete ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.1)',
        fill: !isDiscrete,
        tension: 0.4,
        pointRadius: isDiscrete ? 4 : 0,
        pointHoverRadius: isDiscrete ? 6 : 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${distribution.charAt(0).toUpperCase() + distribution.slice(1)} Distribution`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = isDiscrete ? 'P(X = ' : 'f(';
            const value = isDiscrete ? 
              Math.round(parseFloat(context.label)) : 
              parseFloat(context.label);
            return `${label}${value}) = ${context.parsed.y.toFixed(4)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Value',
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: isDiscrete ? 'Probability Mass' : 'Probability Density',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const ChartComponent = isDiscrete ? Bar : Line;

  return (
    <div style={{ height: '400px' }}>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};

export default DistributionPlot;
