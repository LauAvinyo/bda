/**
 * Utility functions for t-test calculations
 * Extracted for testing purposes
 */

// Error function approximation for normal distribution
export const erf = (x: number): number => {
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
export const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

// Log gamma function (Stirling's approximation)
export const logGamma = (x: number): number => {
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

// Incomplete beta function using continued fraction
export const incompleteBeta = (a: number, b: number, x: number): number => {
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

// T-distribution CDF
export const tCDF = (t: number, df: number): number => {
  if (df === 1) {
    // Cauchy distribution (t with df=1)
    return 0.5 + Math.atan(t) / Math.PI;
  }
  
  if (df === 2) {
    // Simplified formula for df=2
    return 0.5 + t / (2 * Math.sqrt(2 + t * t));
  }
  
  // For larger df, use better approximation
  if (df >= 100) {
    // For large df, t-distribution approaches standard normal
    return normalCDF(t);
  }
  
  // General case: Use incomplete beta function approach
  // P(T ≤ t) = 0.5 + 0.5 * sign(t) * I_x(df/2, 1/2)
  // where x = df / (df + t²) and I is the regularized incomplete beta function
  
  const x = df / (df + t * t);
  const sign = t >= 0 ? 1 : -1;
  const betaVal = incompleteBeta(df / 2, 0.5, x);
  
  return 0.5 + 0.5 * sign * (1 - betaVal);
};

// T-distribution PDF
export const tPDF = (t: number, df: number): number => {
  const gamma1 = Math.exp(logGamma((df + 1) / 2));
  const gamma2 = Math.exp(logGamma(df / 2));
  return (gamma1 / (Math.sqrt(df * Math.PI) * gamma2)) * 
         Math.pow(1 + (t * t) / df, -(df + 1) / 2);
};

// Normal inverse CDF (quantile function)
export const normalInverseCDF = (p: number): number => {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  
  // Rational approximation for the inverse of the CDF
  const a = [
    -3.969683028665376e+01, 2.209460984245205e+02,
    -2.759285104469687e+02, 1.383577518672690e+02,
    -3.066479806614716e+01, 2.506628277459239e+00
  ];
  const b = [
    -5.447609879822406e+01, 1.615858368580409e+02,
    -1.556989798598866e+02, 6.680131188771972e+01,
    -1.328068155288572e+01
  ];
  const c = [
    -7.784894002430292e-03, -3.223964580411365e-01,
    -2.400758277161838e+00, -2.549732539343734e+00,
    4.374664141464968e+00, 2.938163982698783e+00
  ];
  const d = [
    7.784695709041462e-03, 3.224671290700398e-01,
    2.445134137142996e+00, 3.754408661907416e+00
  ];
  
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  
  let q, r, x;
  
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
         ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  
  return x;
};

// Inverse t-distribution CDF to find critical values
export const tInverseCDF = (p: number, df: number): number => {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  
  if (df === 1) {
    // Cauchy distribution
    return Math.tan(Math.PI * (p - 0.5));
  }
  
  if (df === 2) {
    // Analytical formula for df=2
    const val = 2 * (p - 0.5);
    return val / Math.sqrt(Math.max(0.0001, 1 - val * val));
  }
  
  if (df >= 100) {
    // Use normal approximation for large df
    return normalInverseCDF(p);
  }
  
  // Newton-Raphson method for general case
  let t = normalInverseCDF(p); // Initial guess using normal distribution
  
  for (let i = 0; i < 10; i++) {
    const cdf = tCDF(t, df);
    const pdf = tPDF(t, df);
    
    if (Math.abs(cdf - p) < 1e-8 || pdf < 1e-10) break;
    
    t = t - (cdf - p) / pdf;
  }
  
  return t;
};

/**
 * Calculate p-value for t-test
 */
export const calculateTTestPValue = (
  testStatistic: number, 
  df: number, 
  tailType: 'two-tailed' | 'left-tailed' | 'right-tailed'
): number => {
  const cdf = tCDF(testStatistic, df);
  
  switch (tailType) {
    case 'two-tailed':
      return 2 * Math.min(cdf, 1 - cdf);
    case 'left-tailed':
      return cdf;
    case 'right-tailed':
      return 1 - cdf;
    default:
      return 0;
  }
};

