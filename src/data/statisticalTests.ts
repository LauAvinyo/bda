// Statistical Tests Data
// This file contains all the content for statistical tests
// Edit this file to add new tests or modify existing content

export interface StatisticalTest {
  title: string;
  content: string;
}

export interface StatisticalTestsData {
  [key: string]: StatisticalTest;
}

export const statisticalTests: StatisticalTestsData = {
    'Hypothesis Testing': {
        title: 'Hypothesis Testing',
        content: `
# Hypothesis Testing
The logic behind hypothesis testing is to test a hypothesis about a population parameter by looking up how porbable is the parameter under the Null hypothesis.

For example, we want to test if I am able to predict if a student will pass the exam by looking at the number of hours they studied.

The Null hypothesis is that I am not able to predict if a student will pass the exam by looking at the number of hours they studied.
The Alternative hypothesis is that I am able to predict if a student will pass the exam by looking at the number of hours they studied.

Then, we collect a sample of students and we calculate the number of hours they studied.
And I do a binary prediction of whether they will pass the exam or not.

Let's say I have 24 students in my sample, and I predict correctly the outcome of 18 students.

We then calculate the probablitly of getting 18 or more correct predictions by chance.
This is the p-value.

If the p-value is really high, it is probably just by chance, and can't reject the null hypothesis. (Not enough evidence to reject the null hypothesis!)
However, if the p-value is really low, it is probably not just by chance, and we reject the null hypothesis and accept the alternative hypothesis.

Usually in science we use a threshold of $$alpha$$ (significance level) of 0.05 or 0.01 to reject the null hypothesis.
But this value can vary depending on the field of study.

In this particular case, the p-value is 0.0033, which is less than 0.05, so we reject the null hypothesis and accept the alternative hypothesis.


## The Steps of Hypothesis Testing

1. State the null and alternative hypotheses. 
2. Choose the significance level (alpha).
3. Determine the p-value.
4. Compare the p-value with the significance level. Note, that we compare with the significance level to decide if we can or cannot reject the null hypothesis. But you should always state the p-value in your report, and look at it!!
    
`
      },
  't-test': {
    title: 'Student\'s t-test',
    content: `
# Student's t-test

The t-test is a statistical hypothesis test used to determine if there is a significant difference between the means of two groups.

## Types of t-tests

### One-sample t-test
Tests whether the mean of a single group differs from a known value (usually 0).

**Formula:**
$$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$$

Where:
- $\\bar{x}$ = sample mean
- $\\mu_0$ = hypothesized population mean

    But in some cases we use a threshold of 0.01 or 0.001.

    But in some cases we use a threshold of 0.01 or 0.001.

    But in some cases we use a threshold of 0.01 or 0.001.
- $s$ = sample standard deviation
- $n$ = sample size

### Two-sample t-test (Independent samples)
Tests whether the means of two independent groups differ significantly.

**Equal variances assumed:**
$$t = \\frac{\\bar{x_1} - \\bar{x_2}}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}$$

Where $s_p$ is the pooled standard deviation:
$$s_p = \\sqrt{\\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}}$$

### Paired t-test
Tests whether the mean difference between paired observations is significantly different from zero.

$$t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}$$

Where:
- $\\bar{d}$ = mean of the differences
- $s_d$ = standard deviation of the differences

## Assumptions
1. **Normality**: Data should be approximately normally distributed
2. **Independence**: Observations should be independent
3. **Homogeneity of variance**: For two-sample tests, variances should be approximately equal

## Example
A researcher wants to test if a new drug reduces blood pressure. They measure blood pressure before and after treatment for 20 patients:

- Null hypothesis ($H_0$): $\\mu_d = 0$ (no difference)
- Alternative hypothesis ($H_1$): $\\mu_d \\neq 0$ (there is a difference)

If the calculated t-statistic exceeds the critical value, we reject the null hypothesis.
    `
  },
  'anova': {
    title: 'Analysis of Variance (ANOVA)',
    content: `Not yet available!`
  },
  'chi-square': {
    title: 'Chi-square Test',
    content: `Not yet available!`
  },
  'regression': {
    title: 'Linear Regression',
    content: `Not yet available!`
  }
};
