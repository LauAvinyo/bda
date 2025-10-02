/**
 * Tests for t-test utility functions
 * 
 * These tests verify the accuracy of t-distribution calculations against known values
 * from standard statistical tables and R/Python implementations.
 */

import {
  tCDF,
  tInverseCDF,
  calculateTTestPValue,
  normalCDF,
  normalInverseCDF,
} from './tTestUtils';

describe('Normal Distribution Functions', () => {
  test('normalCDF at key values', () => {
    // P(Z ≤ 0) = 0.5
    expect(normalCDF(0)).toBeCloseTo(0.5, 4);
    
    // P(Z ≤ 1.96) ≈ 0.975 (two-tailed α = 0.05)
    expect(normalCDF(1.96)).toBeCloseTo(0.975, 3);
    
    // P(Z ≤ -1.96) ≈ 0.025
    expect(normalCDF(-1.96)).toBeCloseTo(0.025, 3);
    
    // P(Z ≤ 2.576) ≈ 0.995 (two-tailed α = 0.01)
    expect(normalCDF(2.576)).toBeCloseTo(0.995, 3);
  });

  test('normalInverseCDF at key values', () => {
    // Φ^(-1)(0.5) = 0
    expect(normalInverseCDF(0.5)).toBeCloseTo(0, 4);
    
    // Φ^(-1)(0.975) ≈ 1.96
    expect(normalInverseCDF(0.975)).toBeCloseTo(1.96, 2);
    
    // Φ^(-1)(0.025) ≈ -1.96
    expect(normalInverseCDF(0.025)).toBeCloseTo(-1.96, 2);
    
    // Φ^(-1)(0.995) ≈ 2.576
    expect(normalInverseCDF(0.995)).toBeCloseTo(2.576, 2);
  });
});

describe('T-Distribution CDF', () => {
  test('tCDF with df=1 (Cauchy distribution)', () => {
    // For df=1, median is 0
    expect(tCDF(0, 1)).toBeCloseTo(0.5, 4);
    
    // t(0.75, df=1) = 1 gives CDF ≈ 0.75
    expect(tCDF(1, 1)).toBeCloseTo(0.75, 2);
  });

  test('tCDF with df=10', () => {
    // P(T ≤ 0) = 0.5
    expect(tCDF(0, 10)).toBeCloseTo(0.5, 4);
    
    // P(T ≤ 2.228) ≈ 0.975 (critical value for α = 0.05, two-tailed)
    expect(tCDF(2.228, 10)).toBeCloseTo(0.975, 2);
    
    // P(T ≤ -2.228) ≈ 0.025
    expect(tCDF(-2.228, 10)).toBeCloseTo(0.025, 2);
  });

  test('tCDF with large df approaches normal', () => {
    const df = 100;
    const testValue = 1.96;
    
    // For large df, t-distribution should be very close to normal
    const tResult = tCDF(testValue, df);
    const normalResult = normalCDF(testValue);
    
    expect(Math.abs(tResult - normalResult)).toBeLessThan(0.01);
  });
});

describe('T-Distribution Inverse CDF (Critical Values)', () => {
  test('tInverseCDF for df=10, two-tailed α=0.05', () => {
    // For α=0.05 two-tailed, critical value is at p=0.975
    // Should be approximately 2.228
    const criticalValue = tInverseCDF(0.975, 10);
    expect(criticalValue).toBeCloseTo(2.228, 1);
  });

  test('tInverseCDF for df=10, two-tailed α=0.01', () => {
    // For α=0.01 two-tailed, critical value is at p=0.995
    // Should be approximately 3.169
    const criticalValue = tInverseCDF(0.995, 10);
    expect(criticalValue).toBeCloseTo(3.169, 1);
  });

  test('tInverseCDF for df=20', () => {
    // For df=20, α=0.05 two-tailed, critical value ≈ 2.086
    const criticalValue = tInverseCDF(0.975, 20);
    expect(criticalValue).toBeCloseTo(2.086, 1);
  });

  test('tInverseCDF symmetry', () => {
    const df = 15;
    const upperCritical = tInverseCDF(0.975, df);
    const lowerCritical = tInverseCDF(0.025, df);
    
    // Should be symmetric around 0
    expect(upperCritical).toBeCloseTo(-lowerCritical, 2);
  });
});

describe('P-value Calculations', () => {
  test('Two-tailed t-test p-values', () => {
    // t = 2.5, df = 10
    // P-value should be approximately 0.031
    const pValue1 = calculateTTestPValue(2.5, 10, 'two-tailed');
    expect(pValue1).toBeCloseTo(0.031, 2);
    
    // t = 3.0, df = 10
    // P-value should be approximately 0.013
    const pValue2 = calculateTTestPValue(3.0, 10, 'two-tailed');
    expect(pValue2).toBeCloseTo(0.013, 2);
    
    // Small t value should give large p-value
    const pValue3 = calculateTTestPValue(0.5, 10, 'two-tailed');
    expect(pValue3).toBeGreaterThan(0.5);
  });

  test('One-tailed t-test p-values (right-tailed)', () => {
    // t = 2.228, df = 10 (critical value for α=0.05)
    // Right-tailed p-value should be approximately 0.025
    const pValue = calculateTTestPValue(2.228, 10, 'right-tailed');
    expect(pValue).toBeCloseTo(0.025, 2);
  });

  test('One-tailed t-test p-values (left-tailed)', () => {
    // t = -2.228, df = 10 (critical value for α=0.05)
    // Left-tailed p-value should be approximately 0.025
    const pValue = calculateTTestPValue(-2.228, 10, 'left-tailed');
    expect(pValue).toBeCloseTo(0.025, 2);
  });

  test('P-value at critical values', () => {
    const df = 20;
    const alpha = 0.05;
    
    // Get critical value for two-tailed test
    const criticalValue = tInverseCDF(1 - alpha / 2, df);
    
    // P-value at critical value should equal alpha
    const pValue = calculateTTestPValue(criticalValue, df, 'two-tailed');
    expect(pValue).toBeCloseTo(alpha, 2);
  });

  test('Negative t-values give same p-value as positive (two-tailed)', () => {
    const df = 15;
    const t = 2.5;
    
    const pValuePos = calculateTTestPValue(t, df, 'two-tailed');
    const pValueNeg = calculateTTestPValue(-t, df, 'two-tailed');
    
    expect(pValuePos).toBeCloseTo(pValueNeg, 6);
  });
});

describe('Edge Cases', () => {
  test('Very large test statistic gives very small p-value', () => {
    const pValue = calculateTTestPValue(10, 10, 'two-tailed');
    expect(pValue).toBeLessThan(0.001);
  });

  test('Zero test statistic gives p-value of 1 (two-tailed)', () => {
    const pValue = calculateTTestPValue(0, 10, 'two-tailed');
    expect(pValue).toBeCloseTo(1, 4);
  });

  test('Zero test statistic gives p-value of 0.5 (one-tailed)', () => {
    const pValueRight = calculateTTestPValue(0, 10, 'right-tailed');
    const pValueLeft = calculateTTestPValue(0, 10, 'left-tailed');
    
    expect(pValueRight).toBeCloseTo(0.5, 4);
    expect(pValueLeft).toBeCloseTo(0.5, 4);
  });
});

describe('Real-world Examples', () => {
  test('Example 1: Testing if mean differs from 0', () => {
    // Sample: mean = 5, SE = 2, n = 11 (df = 10)
    // t = 5/2 = 2.5
    // Should reject null at α = 0.05
    const t = 2.5;
    const df = 10;
    const pValue = calculateTTestPValue(t, df, 'two-tailed');
    
    expect(pValue).toBeLessThan(0.05);
    expect(pValue).toBeGreaterThan(0.01);
  });

  test('Example 2: One-sample t-test', () => {
    // Testing if mean = 100
    // Sample mean = 105, SD = 10, n = 25
    // SE = 10/√25 = 2
    // t = (105-100)/2 = 2.5, df = 24
    const t = 2.5;
    const df = 24;
    const pValue = calculateTTestPValue(t, df, 'two-tailed');
    
    // Should be significant at α = 0.05
    expect(pValue).toBeLessThan(0.05);
  });

  test('Example 3: Small effect, large sample', () => {
    // Large sample (n = 101, df = 100) approaches normal distribution
    const t = 1.96; // Critical value for normal at α = 0.05
    const df = 100;
    const pValue = calculateTTestPValue(t, df, 'two-tailed');
    
    // Should be very close to 0.05
    expect(pValue).toBeCloseTo(0.05, 1);
  });
});

