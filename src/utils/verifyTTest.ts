/**
 * Verification script for t-test calculations
 * Run this to verify the t-test implementation is working correctly
 * 
 * To run: npx tsx src/utils/verifyTTest.ts
 */

import {
  tCDF,
  tInverseCDF,
  calculateTTestPValue,
  normalCDF,
  normalInverseCDF,
} from './tTestUtils';

// Helper function to check if values are close
function assertClose(actual: number, expected: number, tolerance: number, description: string): void {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`✓ PASS: ${description}`);
    console.log(`  Expected: ${expected.toFixed(6)}, Got: ${actual.toFixed(6)}, Diff: ${diff.toFixed(8)}`);
  } else {
    console.error(`✗ FAIL: ${description}`);
    console.error(`  Expected: ${expected.toFixed(6)}, Got: ${actual.toFixed(6)}, Diff: ${diff.toFixed(8)}`);
  }
}

console.log('\n=== T-TEST VERIFICATION ===\n');

console.log('--- Normal Distribution Tests ---');
assertClose(normalCDF(0), 0.5, 0.0001, 'Normal CDF at 0 should be 0.5');
assertClose(normalCDF(1.96), 0.975, 0.001, 'Normal CDF at 1.96 should be ~0.975');
assertClose(normalCDF(-1.96), 0.025, 0.001, 'Normal CDF at -1.96 should be ~0.025');
assertClose(normalInverseCDF(0.975), 1.96, 0.01, 'Normal inverse CDF at 0.975 should be ~1.96');

console.log('\n--- T-Distribution CDF Tests ---');
assertClose(tCDF(0, 10), 0.5, 0.0001, 'T CDF at t=0 (df=10) should be 0.5');
assertClose(tCDF(2.228, 10), 0.975, 0.01, 'T CDF at t=2.228 (df=10) should be ~0.975');
assertClose(tCDF(-2.228, 10), 0.025, 0.01, 'T CDF at t=-2.228 (df=10) should be ~0.025');

console.log('\n--- T-Distribution Inverse CDF (Critical Values) ---');
assertClose(tInverseCDF(0.975, 10), 2.228, 0.05, 'Critical value for p=0.975, df=10 should be ~2.228');
assertClose(tInverseCDF(0.995, 10), 3.169, 0.05, 'Critical value for p=0.995, df=10 should be ~3.169');
assertClose(tInverseCDF(0.975, 20), 2.086, 0.05, 'Critical value for p=0.975, df=20 should be ~2.086');

console.log('\n--- P-Value Calculations ---');
const pValue1 = calculateTTestPValue(2.5, 10, 'two-tailed');
assertClose(pValue1, 0.031, 0.005, 'P-value for t=2.5, df=10 (two-tailed) should be ~0.031');

const pValue2 = calculateTTestPValue(3.0, 10, 'two-tailed');
assertClose(pValue2, 0.013, 0.003, 'P-value for t=3.0, df=10 (two-tailed) should be ~0.013');

const pValue3 = calculateTTestPValue(2.228, 10, 'right-tailed');
assertClose(pValue3, 0.025, 0.005, 'P-value for t=2.228, df=10 (right-tailed) should be ~0.025');

const pValue4 = calculateTTestPValue(-2.228, 10, 'left-tailed');
assertClose(pValue4, 0.025, 0.005, 'P-value for t=-2.228, df=10 (left-tailed) should be ~0.025');

console.log('\n--- Real-World Examples ---');

console.log('\nExample 1: One-sample t-test');
console.log('Sample: mean=105, hypothesized mean=100, SD=10, n=25');
console.log('t = (105-100)/(10/√25) = 5/2 = 2.5, df=24');
const example1 = calculateTTestPValue(2.5, 24, 'two-tailed');
console.log(`P-value: ${example1.toFixed(6)}`);
console.log(`Decision at α=0.05: ${example1 < 0.05 ? 'REJECT null hypothesis' : 'FAIL TO REJECT null hypothesis'}`);

console.log('\nExample 2: Small t-value');
console.log('t = 0.5, df=10 (two-tailed)');
const example2 = calculateTTestPValue(0.5, 10, 'two-tailed');
console.log(`P-value: ${example2.toFixed(6)}`);
console.log(`Decision at α=0.05: ${example2 < 0.05 ? 'REJECT null hypothesis' : 'FAIL TO REJECT null hypothesis'}`);

console.log('\nExample 3: Testing critical values match p-values');
const df = 15;
const alpha = 0.05;
const criticalValue = tInverseCDF(1 - alpha/2, df);
const pValueAtCritical = calculateTTestPValue(criticalValue, df, 'two-tailed');
console.log(`For df=${df}, α=${alpha}:`);
console.log(`  Critical value: ±${criticalValue.toFixed(3)}`);
console.log(`  P-value at critical value: ${pValueAtCritical.toFixed(6)}`);
console.log(`  Should be close to α: ${Math.abs(pValueAtCritical - alpha) < 0.01 ? '✓' : '✗'}`);

console.log('\n--- Symmetry Tests ---');
const t1 = 2.5, df1 = 15;
const pPos = calculateTTestPValue(t1, df1, 'two-tailed');
const pNeg = calculateTTestPValue(-t1, df1, 'two-tailed');
assertClose(pPos, pNeg, 0.000001, 'P-values should be symmetric for ±t in two-tailed test');

console.log('\n=== VERIFICATION COMPLETE ===\n');

// Show some practical examples with interpretation
console.log('--- Practical Examples for Users ---\n');

interface TestScenario {
  description: string;
  t: number;
  df: number;
  tailType: 'two-tailed' | 'left-tailed' | 'right-tailed';
  alpha: number;
}

const scenarios: TestScenario[] = [
  {
    description: 'Testing if drug reduces blood pressure (right-tailed)',
    t: -2.5,
    df: 30,
    tailType: 'left-tailed',
    alpha: 0.05
  },
  {
    description: 'Testing if two groups have different means (two-tailed)',
    t: 3.2,
    df: 18,
    tailType: 'two-tailed',
    alpha: 0.05
  },
  {
    description: 'Testing if intervention improves scores (right-tailed)',
    t: 2.1,
    df: 25,
    tailType: 'right-tailed',
    alpha: 0.01
  }
];

scenarios.forEach((scenario, i) => {
  console.log(`\nScenario ${i + 1}: ${scenario.description}`);
  console.log(`  t-statistic: ${scenario.t}`);
  console.log(`  Degrees of freedom: ${scenario.df}`);
  console.log(`  Test type: ${scenario.tailType}`);
  console.log(`  Significance level (α): ${scenario.alpha}`);
  
  const pValue = calculateTTestPValue(scenario.t, scenario.df, scenario.tailType);
  
  let criticalValues = '';
  if (scenario.tailType === 'two-tailed') {
    const crit = tInverseCDF(1 - scenario.alpha/2, scenario.df);
    criticalValues = `±${crit.toFixed(3)}`;
  } else if (scenario.tailType === 'right-tailed') {
    const crit = tInverseCDF(1 - scenario.alpha, scenario.df);
    criticalValues = `> ${crit.toFixed(3)}`;
  } else {
    const crit = tInverseCDF(scenario.alpha, scenario.df);
    criticalValues = `< ${crit.toFixed(3)}`;
  }
  
  console.log(`  Critical value(s): ${criticalValues}`);
  console.log(`  P-value: ${pValue.toFixed(6)}`);
  console.log(`  Decision: ${pValue < scenario.alpha ? '✓ REJECT null hypothesis (significant)' : '✗ FAIL TO REJECT null hypothesis (not significant)'}`);
});

console.log('\n');

