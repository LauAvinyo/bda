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
    content: `
# Analysis of Variance (ANOVA)

ANOVA is used to test whether there are statistically significant differences between the means of three or more groups.

## One-way ANOVA

Tests whether the means of several groups are equal.

**Null hypothesis:** $H_0: \\mu_1 = \\mu_2 = ... = \\mu_k$

**F-statistic:**
$$F = \\frac{\\text{Between-group variability}}{\\text{Within-group variability}} = \\frac{MSB}{MSW}$$

Where:
$$MSB = \\frac{SSB}{k-1}, \\quad MSW = \\frac{SSW}{N-k}$$

**Sum of Squares:**
- Between groups: $SSB = \\sum_{i=1}^k n_i(\\bar{x_i} - \\bar{x})^2$
- Within groups: $SSW = \\sum_{i=1}^k \\sum_{j=1}^{n_i} (x_{ij} - \\bar{x_i})^2$
- Total: $SST = SSB + SSW$

## Two-way ANOVA

Examines the influence of two categorical independent variables on one continuous dependent variable.

**Model:**
$$Y_{ijk} = \\mu + \\alpha_i + \\beta_j + (\\alpha\\beta)_{ij} + \\epsilon_{ijk}$$

Where:
- $\\alpha_i$ = effect of factor A
- $\\beta_j$ = effect of factor B
- $(\\alpha\\beta)_{ij}$ = interaction effect
- $\\epsilon_{ijk}$ = random error

## Assumptions
1. **Independence**: Observations are independent
2. **Normality**: Residuals are normally distributed
3. **Homogeneity of variance**: Equal variances across groups
4. **Additivity**: No interaction effects (for one-way ANOVA)

## Post-hoc Tests
When ANOVA is significant, post-hoc tests help identify which specific groups differ:
- **Tukey's HSD**: Controls family-wise error rate
- **Bonferroni**: Conservative correction for multiple comparisons
- **Scheffé**: Most conservative, good for complex comparisons
    `
  },
  'chi-square': {
    title: 'Chi-square Test',
    content: `
# Chi-square Test

The chi-square test is used to test relationships between categorical variables.

## Goodness of Fit Test

Tests whether observed frequencies differ from expected frequencies.

**Formula:**
$$\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$$

Where:
- $O_i$ = observed frequency for category $i$
- $E_i$ = expected frequency for category $i$
- $k$ = number of categories

**Degrees of freedom:** $df = k - 1$

## Test of Independence

Tests whether two categorical variables are independent.

**For a contingency table:**
$$\\chi^2 = \\sum_{i=1}^r \\sum_{j=1}^c \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}$$

**Expected frequency:**
$$E_{ij} = \\frac{(\\text{Row total}_i)(\\text{Column total}_j)}{\\text{Grand total}}$$

**Degrees of freedom:** $df = (r-1)(c-1)$

## Test of Homogeneity

Tests whether different populations have the same distribution of a categorical variable.

Same formula as test of independence, but interpretation differs.

## Assumptions
1. **Independence**: Observations must be independent
2. **Sample size**: Expected frequency in each cell should be ≥ 5
3. **Categorical data**: Variables must be categorical
4. **Random sampling**: Data should come from random samples

## Example
Testing whether the distribution of blood types differs between two populations:

| Blood Type | Population A | Population B | Total |
|------------|--------------|--------------|-------|
| O          | 45           | 55           | 100   |
| A          | 40           | 30           | 70    |
| B          | 10           | 15           | 25    |
| AB         | 5            | 0            | 5     |
| **Total**  | **100**      | **100**      | **200** |

Calculate expected frequencies and apply the chi-square formula to test independence.
    `
  },
  'regression': {
    title: 'Linear Regression',
    content: `
# Linear Regression

Linear regression models the relationship between a dependent variable and one or more independent variables.

## Simple Linear Regression

Models the relationship between two variables using a straight line.

**Model:**
$$Y = \\beta_0 + \\beta_1 X + \\epsilon$$

Where:
- $Y$ = dependent variable
- $X$ = independent variable
- $\\beta_0$ = y-intercept
- $\\beta_1$ = slope
- $\\epsilon$ = error term

## Parameter Estimation (Least Squares)

**Slope:**
$$\\hat{\\beta_1} = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^n (x_i - \\bar{x})^2} = \\frac{\\text{Cov}(X,Y)}{\\text{Var}(X)}$$

**Intercept:**
$$\\hat{\\beta_0} = \\bar{y} - \\hat{\\beta_1}\\bar{x}$$

## Multiple Linear Regression

**Model:**
$$Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + ... + \\beta_p X_p + \\epsilon$$

**Matrix form:**
$$\\mathbf{Y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\epsilon}$$

**Parameter estimates:**
$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{Y}$$

## Model Evaluation

### R-squared (Coefficient of Determination)
$$R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} = \\frac{SS_{reg}}{SS_{tot}}$$

Where:
- $SS_{res} = \\sum (y_i - \\hat{y_i})^2$ (residual sum of squares)
- $SS_{tot} = \\sum (y_i - \\bar{y})^2$ (total sum of squares)
- $SS_{reg} = \\sum (\\hat{y_i} - \\bar{y})^2$ (regression sum of squares)

### Adjusted R-squared
$$R^2_{adj} = 1 - \\frac{(1-R^2)(n-1)}{n-p-1}$$

## Assumptions
1. **Linearity**: Relationship between X and Y is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of residuals
4. **Normality**: Residuals are normally distributed
5. **No multicollinearity**: Independent variables are not highly correlated

## Hypothesis Testing

**For slope coefficient:**
- $H_0: \\beta_1 = 0$ (no linear relationship)
- $H_1: \\beta_1 \\neq 0$ (linear relationship exists)

**Test statistic:**
$$t = \\frac{\\hat{\\beta_1}}{SE(\\hat{\\beta_1})}$$

Where $SE(\\hat{\\beta_1}) = \\sqrt{\\frac{MSE}{\\sum(x_i - \\bar{x})^2}}$
    `
  }
};
