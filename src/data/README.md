# Statistical Tests Data

This directory contains the content data for statistical tests displayed in the application.

## How to Edit Tests

### Editing Existing Tests

1. Open `statisticalTests.ts`
2. Find the test you want to edit (e.g., `'t-test'`, `'anova'`, etc.)
3. Modify the `title` or `content` fields
4. The `content` field supports **Markdown** and **LaTeX** math formulas

### Adding a New Test

To add a new statistical test:

1. Open `statisticalTests.ts`
2. Add a new entry to the `statisticalTests` object:

```typescript
'your-test-name': {
  title: 'Your Test Display Name',
  content: `
# Your Test Title

Your test description here...

## Example Section

**Formula:**
$$your\_latex\_formula = \\frac{numerator}{denominator}$$

More content...
  `
}
```

### Markdown & LaTeX Support

The content supports:
- **Headers**: `# ## ###`
- **Bold/Italic**: `**bold**` and `*italic*`
- **Lists**: `- item` or `1. item`
- **Tables**: Standard Markdown table syntax
- **LaTeX Math**: 
  - Inline: `$formula$`
  - Block: `$$formula$$`
  - Use `\\` for backslashes in LaTeX (e.g., `\\frac`, `\\sum`)

### Example LaTeX Formulas

```latex
$$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$$

$$F = \\frac{MSB}{MSW}$$

$$\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$$
```

## File Structure

- `statisticalTests.ts` - Main data file with all test content
- `README.md` - This help file

## After Making Changes

After editing the content:
1. Save the file
2. The changes will appear automatically in development mode
3. For production, rebuild the project with `npm run build`

## Tips

- Keep test names as simple keys (lowercase, use hyphens)
- Use descriptive titles for display
- Include sections like: Description, Formula, Assumptions, Examples
- Test your LaTeX formulas to ensure they render correctly
