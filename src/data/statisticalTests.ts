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
Tests whether the mean of a single group differs from a desired or known value (usually 0, but it can be any value).

**Formula:**
$$t = \\frac{M - \\mu_0}{\\sigma_M}$$

Where:
- $M$ = sample mean
- $\\mu_0$ = hypothesized population mean
- $\\sigma_M$ = standard error of the mean (std of the population of the Means)

And, 
$$\\sigma_M = \\frac{\\sigma}{\\sqrt{n}}$$
The $\\sigma$ is the standard deviation of the population. And usually unkown.
In some cases, for instance, when we are using a binomial distribution, we can compute the $\\sigma$ for the null hypothesis.
And hence, in such cases we can compute the $\\sigma_M$ and use the normal distribution to compute the p-value.
However, in most cases, we don't know the $\\sigma$ of the population. 
Therefore, we use the sample standard deviation to compute the $\\sigma_M$ and use the t-distribution to compute the p-value.

### Two-sample t-test (Independent samples)
Tests whether the means of two independent groups differ significantly.

**Equal variances assumed:**
$$t = \\frac{M_1 - M_2}{\\sigma_{M_1 - M_2}$$

Where, $\\sigma_{M_1 - M_2}$ is the standard error of the difference between the means:
$$\\sigma_{M_1 - M_2} = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$$

Most, of the time, we do not know the $\\sigma$ of the populations.
Therefore, we use the average of the sample standard deviations to compute the $\\sigma_{M_1 - M_2}$ and use the t-distribution to compute the p-value.

Once we have the t-statistic, we can compute the p-value using the t-distribution.
We have to decide the degrees of freedom.
In the case of the two-sample t-test, the degrees of freedom is the sum of the degrees of freedom of the two samples minus 2 (because we are using 2 sample means).
$$df = n_1 + n_2 - 2$$

Finally, we select the value of the t-distribution that corresponds to the t-statistic and the degrees of freedom.
And we compute the p-value using a table or the t-distribution calculator.

Finally, we compare the p-value with the significance level to decide if we can or cannot reject the null hypothesis.

### Paired t-test
TBD


## Assumptions
1. **Normality**: Data should be approximately normally distributed
2. **Homogeneity of variance**: For two-sample tests, variances should be approximately equal
3. **Independence**: Observations should be independent
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
