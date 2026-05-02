# Anamorphic Calculator Test Suite

Automated Playwright tests covering math verification and interaction testing.

## Setup

```bash
cd tests
npm init -y
npm install -D @playwright/test
npx playwright install chromium webkit
```

## Running Tests

```bash
# Run all tests against your deployed site
BASE_URL=https://your-site.netlify.app npx playwright test --config=playwright.config.js

# Run just desktop Chrome
npx playwright test --project="Desktop Chrome"

# Run just mobile
npx playwright test --project="Mobile Safari"

# Run a specific test file
npx playwright test anamorphic-calculator.spec.js

# Run with visible browser (headed mode)
npx playwright test --headed

# Run a specific test by name
npx playwright test -g "Sony Venice 6K"
```

## Test Coverage

### Math Verification - Digital
- Sony Venice 6K defaults (1.5x, 2.39:1) → verifies unsqueezed AR, coverage
- Squeeze ratio change → verifies recalculation, crop direction
- Aspect ratio change → verifies crop switches from height to width
- Different camera (ARRI Mini LF) → verifies different sensor math

### Math Verification - Film
- Super 35 4-perf defaults (2.0x, 2.39:1) → verifies unsqueezed AR
- Insufficient image detection (Super 16 + 1.3x + 2.76:1)

### Interaction - State Preservation
- Squeeze change doesn't clear camera
- Aspect ratio change doesn't clear squeeze
- Digital/Film toggle preserves separate state
- Custom resolution survives squeeze ratio change

### Interaction - Comparison Tabs
- ADD CAMERA button appears after main calculation
- Comparison tab starts blank
- DEFAULTS checkbox works and shows checked state
- Comparison is independent from main tab
- REMOVE button works
- Max 3 comparisons enforced

### UI Elements
- Parameters panel collapse/expand
- Digital/Film toggle
- Lens circle camera filtering
- Bypass selection
- Share button

### Edge Cases
- Clear all parameters after results (no crash)
- Matching unsqueezed = desired (0 crop)
- Custom anamorphic ratio
- All film formats produce results

### Mobile
- Vertical stack layout
- Comparison tabs stack on mobile
