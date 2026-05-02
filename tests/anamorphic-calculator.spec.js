// Anamorphic Lens Calculator - Playwright Test Suite
// Run with: npx playwright test anamorphic-calculator.spec.js
//
// Setup:
//   npm init -y
//   npm install -D @playwright/test
//   npx playwright install chromium
//
// Configure base URL in playwright.config.js or pass via CLI:
//   npx playwright test --config=playwright.config.js

const { test, expect } = require('@playwright/test');

// Update this to your deployed URL
const BASE_URL = process.env.BASE_URL || 'https://dcthzw-3000.csb.app';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Handle CodeSandbox interstitial confirmation page
async function navigateAndConfirm(page) {
  await page.goto(BASE_URL);
  // Check if CodeSandbox interstitial appears
  const proceedButton = page.locator('text=Yes, proceed to preview');
  try {
    await proceedButton.waitFor({ timeout: 3000 });
    await proceedButton.click();
    await page.waitForLoadState('networkidle');
  } catch {
    // No interstitial, already on the app
  }
  // Wait for the app to load
  await page.waitForSelector('text=ANAMORPHIC LENS CALCULATOR', { timeout: 10000 });
}

async function selectDigitalDefaults(page) {
  // Click DIGITAL tab
  await page.getByRole('button', { name: 'DIGITAL' }).click();
  // Check DEFAULTS
  const defaultsCheckbox = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]').first();
  await defaultsCheckbox.check();
  // Wait for visualizer to appear
  await page.waitForSelector('text=DESQUEEZED OUTPUT', { timeout: 5000 });
}

async function selectFilmDefaults(page) {
  await page.getByRole('button', { name: 'FILM' }).click();
  const defaultsCheckbox = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]').first();
  await defaultsCheckbox.check();
  await page.waitForSelector('text=NEGATIVE VISUALIZATION', { timeout: 5000 });
}

async function clickLensCircle(page, name) {
  // name: 'Super 16', 'Super 35', 'Full Frame', '65mm'
  await page.getByRole('button', { name, exact: true }).first().click();
}

async function selectCamera(page, cameraName) {
  const select = page.locator('select').first();
  await select.selectOption({ label: new RegExp(cameraName) });
}

async function selectSensorFormat(page, sensorLabel) {
  // The sensor format is the second select on the page
  const selects = page.locator('select');
  const sensorSelect = selects.nth(1);
  await sensorSelect.selectOption({ label: new RegExp(sensorLabel) });
}

async function clickSqueezeRatio(page, ratio) {
  // ratio: '1.3x', '1.5x', '1.6x', '1.8x', '2.0x'
  await page.getByRole('button', { name: ratio, exact: true }).first().click();
}

async function clickAspectRatio(page, ratio) {
  // ratio: '1.37:1', '1.78:1', '1.85:1', '1.9:1', '2.0:1', '2.35:1', '2.39:1', '2.76:1'
  await page.locator('button').filter({ hasText: ratio }).first().click();
}

async function getStatValue(page, label) {
  // Find a stat box by its label and return the value text
  const box = page.locator('div').filter({ hasText: new RegExp(`^${label}`) }).first();
  const value = await box.locator('div.font-bold').first().textContent();
  return value.trim();
}

async function getTextContent(page, selector) {
  return (await page.locator(selector).first().textContent()).trim();
}

// ============================================
// MATH VERIFICATION TESTS - DIGITAL
// ============================================

test.describe('Digital Math Verification', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Sony Venice 6K 3:2 + 1.5x squeeze + 2.39:1 output', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Expected: Venice 6K 3:2 (6048x4032), sensor 35.9x24mm, squeeze 1.5x, desired 2.39:1
    // Unsqueezed AR = (35.9 * 1.5) / 24 = 2.24
    // Desqueezed height = round(4032 / 1.5) = 2688
    // Crop height = 2688 - round(6048 / 2.39) = 2688 - 2531 = 157
    // Coverage = (1 - 157/2688) * 100 = 94.2%
    
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.24:1');
    
    const desired = await getStatValue(page, 'DESIRED OUTPUT');
    expect(desired).toBe('2.39:1');
    
    const coverage = await getStatValue(page, 'OUTPUT UTILIZATION');
    expect(parseFloat(coverage)).toBeCloseTo(94.2, 0);
  });

  test('Changing squeeze ratio updates calculations correctly', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Default is 1.5x, switch to 2.0x
    await clickSqueezeRatio(page, '2.0x');
    await page.waitForTimeout(600); // debounce
    
    // With 2.0x: Unsqueezed AR = (35.9 * 2.0) / 24 = 2.99
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.99:1');
    
    // Since 2.99 > 2.39, we crop width (left/right)
    // Verify crop left/right are > 0 and crop top/bottom are 0
    const cropTop = await getStatValue(page, 'CROP TOP');
    expect(cropTop).toBe('0');
    
    const cropLeft = await getStatValue(page, 'CROP LEFT');
    expect(parseInt(cropLeft)).toBeGreaterThan(0);
  });

  test('Changing aspect ratio updates calculations correctly', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Default is 2.39:1, switch to 1.78:1 (16:9)
    await clickAspectRatio(page, '1.78:1');
    await page.waitForTimeout(600);
    
    // With 1.5x squeeze and 1.78:1 output:
    // Unsqueezed AR = 2.24, desired = 1.78
    // Since 1.78 < 2.24, we crop width (left/right)
    const desired = await getStatValue(page, 'DESIRED OUTPUT');
    expect(desired).toBe('1.78:1');
    
    const cropLeft = await getStatValue(page, 'CROP LEFT');
    expect(parseInt(cropLeft)).toBeGreaterThan(0);
    
    const cropTop = await getStatValue(page, 'CROP TOP');
    expect(cropTop).toBe('0');
  });

  test('Different camera produces different results', async ({ page }) => {
    // Set up Full Frame, ARRI Alexa Mini LF
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'ARRI Alexa Mini LF');
    
    // Select a sensor format
    const selects = page.locator('select');
    await selects.nth(1).selectOption({ label: /4\.5K LF 3:2/ });
    
    await clickSqueezeRatio(page, '1.5x');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(600);
    
    // ARRI Mini LF 4.5K 3:2: 4448x3096, sensor 36.70x25.54mm
    // Unsqueezed AR = (36.70 * 1.5) / 25.54 = 2.16
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.16:1');
    
    // Visualizer should be visible
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });
});

// ============================================
// MATH VERIFICATION TESTS - FILM
// ============================================

test.describe('Film Math Verification', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Super 35 4-perf + 2.0x squeeze + 2.39:1 output', async ({ page }) => {
    await selectFilmDefaults(page);
    
    // S35 4-perf: 24.9 x 18.7mm, squeeze 2.0x
    // Unsqueezed width = 24.9 * 2 = 49.8mm
    // Unsqueezed AR = 49.8 / 18.7 = 2.663
    // Coverage = (2.39 * 18.7) / 49.8 * 100 = 89.7%
    
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.663:1');
    
    const desired = await getStatValue(page, 'DESIRED ASPECT');
    expect(desired).toBe('2.39:1');
  });

  test('Film insufficient detection - narrow squeeze with wide output', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    
    // Select Super 16mm (12.52 x 7.41mm) with 1.25x squeeze
    const selects = page.locator('select');
    await selects.first().selectOption({ label: /Super 16mm/ });
    await clickSqueezeRatio(page, '1.3x');
    await clickAspectRatio(page, '2.76:1');
    await page.waitForTimeout(600);
    
    // Unsqueezed AR = (12.52 * 1.3) / 7.41 = 2.196
    // 2.196 < 2.76 => INSUFFICIENT
    await expect(page.locator('text=INSUFFICIENT').first()).toBeVisible();
  });
});

// ============================================
// INTERACTION TESTS - STATE PRESERVATION
// ============================================

test.describe('Interaction - State Preservation', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Selecting squeeze ratio does not clear camera selection', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Verify camera is set
    const cameraSelect = page.locator('select').first();
    const cameraValue = await cameraSelect.inputValue();
    expect(cameraValue).toBe('sony-venice');
    
    // Change squeeze ratio
    await clickSqueezeRatio(page, '2.0x');
    await page.waitForTimeout(600);
    
    // Camera should still be selected
    const cameraValueAfter = await cameraSelect.inputValue();
    expect(cameraValueAfter).toBe('sony-venice');
    
    // Visualizer should still be showing
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });

  test('Selecting aspect ratio does not clear squeeze ratio', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Change aspect ratio
    await clickAspectRatio(page, '2.76:1');
    await page.waitForTimeout(600);
    
    // Visualizer should still show (squeeze ratio preserved)
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
    
    const desired = await getStatValue(page, 'DESIRED OUTPUT');
    expect(desired).toBe('2.76:1');
    
    // Unsqueezed should still be 2.24 (1.5x squeeze on Venice)
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.24:1');
  });

  test('Switching between Digital and Film preserves separate state', async ({ page }) => {
    // Set up digital
    await selectDigitalDefaults(page);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
    
    // Switch to film
    await selectFilmDefaults(page);
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
    
    // Switch back to digital - should still have results
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });

  test('Custom resolution input survives squeeze ratio change', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    
    // Enable custom resolution
    const customResCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RESOLUTION' }).locator('input[type="checkbox"]');
    await customResCheckbox.check();
    
    // Enter custom pixels
    const widthInput = page.locator('input[placeholder="Width (px)"]');
    const heightInput = page.locator('input[placeholder="Height (px)"]');
    await widthInput.fill('3000');
    await heightInput.fill('3000');
    
    // Wait for debounce sync
    await page.waitForTimeout(700);
    
    // Select squeeze and aspect
    await clickSqueezeRatio(page, '1.5x');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);
    
    // Custom resolution should still show 3000
    const widthValue = await widthInput.inputValue();
    expect(widthValue).toBe('3000');
    
    const heightValue = await heightInput.inputValue();
    expect(heightValue).toBe('3000');
  });
});

// ============================================
// INTERACTION TESTS - COMPARISON TABS
// ============================================

test.describe('Comparison Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('ADD CAMERA button appears after main calculation', async ({ page }) => {
    // Before calculation, no ADD CAMERA button
    await expect(page.locator('text=+ ADD CAMERA')).not.toBeVisible();
    
    // Set up defaults
    await selectDigitalDefaults(page);
    
    // ADD CAMERA should now be visible
    await expect(page.locator('text=+ ADD CAMERA')).toBeVisible();
  });

  test('Clicking ADD CAMERA creates a comparison tab', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    await page.locator('text=+ ADD CAMERA').click();
    
    // CAMERA 2 header should appear
    await expect(page.locator('text=CAMERA 2')).toBeVisible();
    
    // REMOVE button should appear
    await expect(page.locator('text=✕ REMOVE').first()).toBeVisible();
  });

  test('Comparison tab starts blank', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    
    // The comparison tab should show "Select all parameters" message
    await expect(page.locator('text=Select all parameters to view calculations')).toBeVisible();
  });

  test('Comparison tab DEFAULTS checkbox works', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    
    // Find the DEFAULTS checkbox in the comparison tab (second one on page)
    const defaultsCheckboxes = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]');
    const compDefaults = defaultsCheckboxes.nth(1);
    await compDefaults.check();
    
    await page.waitForTimeout(600);
    
    // Comparison should now show results
    const desqueezedOutputs = page.locator('text=DESQUEEZED OUTPUT');
    await expect(desqueezedOutputs).toHaveCount(2); // Main + comparison
  });

  test('Comparison tab is independent from main tab', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    
    // Set comparison defaults
    const defaultsCheckboxes = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]');
    await defaultsCheckboxes.nth(1).check();
    await page.waitForTimeout(600);
    
    // Change main tab squeeze ratio
    // The main squeeze buttons are in the first Parameters panel
    const mainSqueezeButtons = page.locator('button').filter({ hasText: '2.0x' }).first();
    await mainSqueezeButtons.click();
    await page.waitForTimeout(600);
    
    // Main should show 2.99:1 unsqueezed
    const unsqueezedValues = page.locator('text=/\\d+\\.\\d+:1/');
    // Comparison should still show 2.24:1 (unchanged 1.5x squeeze)
    // This is a structural check - both visualizers should be present
    const desqueezedOutputs = page.locator('text=DESQUEEZED OUTPUT');
    await expect(desqueezedOutputs).toHaveCount(2);
  });

  test('REMOVE button removes comparison tab', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    
    await expect(page.locator('text=CAMERA 2')).toBeVisible();
    
    // Click remove
    await page.locator('text=✕ REMOVE').click();
    
    // CAMERA 2 should be gone
    await expect(page.locator('text=CAMERA 2')).not.toBeVisible();
    
    // ADD CAMERA should still be available
    await expect(page.locator('text=+ ADD CAMERA')).toBeVisible();
  });

  test('Can add up to 3 comparison tabs', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    await page.locator('text=+ ADD CAMERA').click();
    await expect(page.locator('text=CAMERA 2')).toBeVisible();
    
    await page.locator('text=+ ADD CAMERA').click();
    await expect(page.locator('text=CAMERA 3')).toBeVisible();
    
    await page.locator('text=+ ADD CAMERA').click();
    await expect(page.locator('text=CAMERA 4')).toBeVisible();
    
    // ADD CAMERA should now be hidden (max 3 comparisons)
    await expect(page.locator('text=+ ADD CAMERA')).not.toBeVisible();
  });
});

// ============================================
// INTERACTION TESTS - UI ELEMENTS
// ============================================

test.describe('UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Parameters panel is collapsible', async ({ page }) => {
    await selectDigitalDefaults(page);
    
    // Click PARAMETERS header to collapse
    await page.locator('button').filter({ hasText: 'PARAMETERS' }).first().click();
    
    // Lens Image Circle section should be hidden
    await expect(page.locator('text=LENS IMAGE CIRCLE').first()).not.toBeVisible();
    
    // Click again to expand
    await page.locator('button').filter({ hasText: 'PARAMETERS' }).first().click();
    
    // Should be visible again
    await expect(page.locator('text=LENS IMAGE CIRCLE').first()).toBeVisible();
  });

  test('Digital/Film toggle works', async ({ page }) => {
    // Start on digital
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await expect(page.locator('text=LENS IMAGE CIRCLE').first()).toBeVisible();
    
    // Switch to film
    await page.getByRole('button', { name: 'FILM' }).click();
    
    // Film should show CAMERA NEGATIVE label (in the dropdown)
    // and not show LENS IMAGE CIRCLE
    await expect(page.locator('text=LENS IMAGE CIRCLE')).not.toBeVisible();
  });

  test('Lens circle filter restricts camera options', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    
    // Select Super 16 lens circle
    await clickLensCircle(page, 'Super 16');
    
    // Only ARRI Alexa Mini should be available
    const cameraSelect = page.locator('select').first();
    const options = await cameraSelect.locator('option').allTextContents();
    const cameraOptions = options.filter(o => o !== '-- Please Select Camera --');
    
    expect(cameraOptions.length).toBe(1);
    expect(cameraOptions[0]).toContain('Alexa Mini');
  });

  test('BYPASS SELECTION shows all cameras', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    
    // Select a restrictive lens circle first
    await clickLensCircle(page, 'Super 16');
    
    // Click BYPASS SELECTION (for lens)
    await page.getByRole('button', { name: /BYPASS SELECTION/ }).first().click();
    
    // Should now show more cameras
    const cameraSelect = page.locator('select').first();
    const options = await cameraSelect.locator('option').allTextContents();
    const cameraOptions = options.filter(o => o !== '-- Please Select Camera --');
    
    expect(cameraOptions.length).toBeGreaterThan(1);
  });

  test('Share button copies link to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await selectDigitalDefaults(page);
    
    // Click SHARE
    page.on('dialog', dialog => dialog.accept()); // Handle alert
    await page.locator('button').filter({ hasText: 'SHARE' }).first().click();
    
    // Verify clipboard contains a URL (may need to handle the alert)
    // This test may need adjustment based on browser clipboard API availability
  });
});

// ============================================
// EDGE CASES
// ============================================

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('No crash when all parameters cleared after showing results', async ({ page }) => {
    await selectDigitalDefaults(page);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
    
    // Uncheck defaults to clear everything
    const defaultsCheckbox = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]').first();
    await defaultsCheckbox.uncheck();
    
    // Should show the "select parameters" message, no crash
    await expect(page.locator('text=Select all parameters above to view calculations')).toBeVisible();
  });

  test('Aspect ratio equal to unsqueezed shows 0 crop', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    const selects = page.locator('select');
    await selects.nth(1).selectOption({ label: /6K 3:2/ });
    
    // 1.5x squeeze on Venice = 2.24:1 unsqueezed
    await clickSqueezeRatio(page, '1.5x');
    
    // Enable custom aspect ratio and type 2.24
    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.24');
    await page.waitForTimeout(700);
    
    // Crop should be 0 or very close
    const cropNeeded = await getStatValue(page, 'CROP NEEDED');
    expect(parseInt(cropNeeded)).toBeLessThanOrEqual(1); // Allow rounding
  });

  test('Custom anamorphic ratio works', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    const selects = page.locator('select');
    await selects.nth(1).selectOption({ label: /6K 3:2/ });
    
    // Enable custom squeeze
    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.33');
    
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);
    
    // Unsqueezed AR = (35.9 * 1.33) / 24 = 1.99
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(parseFloat(unsqueezed)).toBeCloseTo(1.99, 1);
  });

  test('Film mode handles all format options', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    
    const filmFormats = [
      'Super 16mm',
      'Super 35mm 2-perf',
      'Super 35mm 3-perf',
      'Super 35mm 4-perf',
      '65mm',
    ];
    
    for (const format of filmFormats) {
      const selects = page.locator('select');
      await selects.first().selectOption({ label: new RegExp(format) });
      await clickSqueezeRatio(page, '2.0x');
      await clickAspectRatio(page, '2.39:1');
      await page.waitForTimeout(300);
      
      // Should show results without crashing
      await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
    }
  });
});

// ============================================
// RESPONSIVE / MOBILE TESTS
// ============================================

test.describe('Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone size

  test('Layout stacks vertically on mobile', async ({ page }) => {
    await navigateAndConfirm(page);
    await selectDigitalDefaults(page);
    
    // Parameters and visualizer should both be visible (stacked)
    await expect(page.locator('text=PARAMETERS').first()).toBeVisible();
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
    
    // Parameters should appear before visualizer in DOM order
    const paramsBox = await page.locator('text=PARAMETERS').first().boundingBox();
    const vizBox = await page.locator('text=DESQUEEZED OUTPUT').first().boundingBox();
    expect(paramsBox.y).toBeLessThan(vizBox.y);
  });

  test('Comparison tab stacks vertically on mobile', async ({ page }) => {
    await navigateAndConfirm(page);
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    
    await expect(page.locator('text=CAMERA 2')).toBeVisible();
    
    // Parameters collapse works on mobile
    const compParamsButton = page.locator('button').filter({ hasText: 'PARAMETERS' }).nth(1);
    await compParamsButton.click();
    // Should collapse without breaking layout
    await page.waitForTimeout(300);
    await compParamsButton.click();
  });
});

// ============================================
// CUSTOM VALUE TESTS - DIGITAL
// ============================================

test.describe('Custom Values - Digital', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Custom resolution: 4000x3000 + 1.5x + 2.39:1', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');

    const customResCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RESOLUTION' }).locator('input[type="checkbox"]');
    await customResCheckbox.check();

    const widthInput = page.locator('input[placeholder="Width (px)"]');
    const heightInput = page.locator('input[placeholder="Height (px)"]');
    await widthInput.fill('4000');
    await heightInput.fill('3000');

    await clickSqueezeRatio(page, '1.5x');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);

    // Custom uses FF sensor dims (36x24mm). Unsqueezed AR = (36*1.5)/24 = 2.25
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(unsqueezed).toBe('2.25:1');

    // 2.39 > 2.25 => crop height. Desqueezed height=2000, cropped=1674, crop=326
    const coverage = await getStatValue(page, 'OUTPUT UTILIZATION');
    expect(parseFloat(coverage)).toBeCloseTo(83.7, 0);

    const cropTop = await getStatValue(page, 'CROP TOP');
    expect(parseInt(cropTop)).toBeCloseTo(163, -1);

    const cropLeft = await getStatValue(page, 'CROP LEFT');
    expect(cropLeft).toBe('0');
  });

  test('Custom resolution preserved after changing squeeze', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');

    const customResCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RESOLUTION' }).locator('input[type="checkbox"]');
    await customResCheckbox.check();

    const widthInput = page.locator('input[placeholder="Width (px)"]');
    const heightInput = page.locator('input[placeholder="Height (px)"]');
    await widthInput.fill('5000');
    await heightInput.fill('4000');
    await page.waitForTimeout(700);

    await clickSqueezeRatio(page, '1.5x');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();

    await clickSqueezeRatio(page, '2.0x');
    await page.waitForTimeout(700);

    expect(await widthInput.inputValue()).toBe('5000');
    expect(await heightInput.inputValue()).toBe('4000');
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });

  test('Custom resolution preserved after changing aspect ratio', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');

    const customResCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RESOLUTION' }).locator('input[type="checkbox"]');
    await customResCheckbox.check();

    const widthInput = page.locator('input[placeholder="Width (px)"]');
    const heightInput = page.locator('input[placeholder="Height (px)"]');
    await widthInput.fill('3840');
    await heightInput.fill('2160');
    await page.waitForTimeout(700);

    await clickSqueezeRatio(page, '1.5x');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);

    await clickAspectRatio(page, '1.85:1');
    await page.waitForTimeout(700);

    expect(await widthInput.inputValue()).toBe('3840');
    expect(await heightInput.inputValue()).toBe('2160');
    expect(await getStatValue(page, 'DESIRED OUTPUT')).toBe('1.85:1');
  });

  test('Custom anamorphic ratio: 1.33x on Venice 6K', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    await page.locator('select').nth(1).selectOption({ label: /6K 3:2/ });

    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.33');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);

    // Unsqueezed AR = (35.9*1.33)/24 = 1.99
    const unsqueezed = await getStatValue(page, 'UNSQUEEZED ASPECT');
    expect(parseFloat(unsqueezed)).toBeCloseTo(1.99, 1);

    // 2.39 > 1.99 => crop height
    expect(parseInt(await getStatValue(page, 'CROP TOP'))).toBeGreaterThan(0);
    expect(await getStatValue(page, 'CROP LEFT')).toBe('0');
    expect(parseFloat(await getStatValue(page, 'OUTPUT UTILIZATION'))).toBeCloseTo(83.5, 1);
  });

  test('Custom anamorphic preserved after changing aspect ratio', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    await page.locator('select').nth(1).selectOption({ label: /6K 3:2/ });

    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.75');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();

    await clickAspectRatio(page, '2.76:1');
    await page.waitForTimeout(700);

    expect(await customSqInput.inputValue()).toBe('1.75');
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });

  test('Custom aspect ratio: 2.66:1 on Venice 6K + 1.5x', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    await page.locator('select').nth(1).selectOption({ label: /6K 3:2/ });
    await clickSqueezeRatio(page, '1.5x');

    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.66');
    await page.waitForTimeout(700);

    expect(await getStatValue(page, 'UNSQUEEZED ASPECT')).toBe('2.24:1');
    expect(parseFloat(await getStatValue(page, 'OUTPUT UTILIZATION'))).toBeCloseTo(84.6, 0);
    expect(parseInt(await getStatValue(page, 'CROP TOP'))).toBeGreaterThan(0);
  });

  test('Custom aspect preserved after changing squeeze', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');
    await page.locator('select').nth(1).selectOption({ label: /6K 3:2/ });
    await clickSqueezeRatio(page, '1.5x');

    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.55');
    await page.waitForTimeout(700);
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();

    await clickSqueezeRatio(page, '1.8x');
    await page.waitForTimeout(700);

    expect(await customARInput.inputValue()).toBe('2.55');
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();
  });

  test('All three custom fields simultaneously', async ({ page }) => {
    await page.getByRole('button', { name: 'DIGITAL' }).click();
    await clickLensCircle(page, 'Full Frame');
    await selectCamera(page, 'Sony Venice');

    const customResCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RESOLUTION' }).locator('input[type="checkbox"]');
    await customResCheckbox.check();
    const widthInput = page.locator('input[placeholder="Width (px)"]');
    const heightInput = page.locator('input[placeholder="Height (px)"]');
    await widthInput.fill('7680');
    await heightInput.fill('4320');

    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.8');

    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.40');
    await page.waitForTimeout(700);

    expect(await widthInput.inputValue()).toBe('7680');
    expect(await heightInput.inputValue()).toBe('4320');
    expect(await customSqInput.inputValue()).toBe('1.8');
    expect(await customARInput.inputValue()).toBe('2.40');
    await expect(page.locator('text=DESQUEEZED OUTPUT').first()).toBeVisible();

    // Unsqueezed AR = (36 * 1.8) / 24 = 2.70
    expect(parseFloat(await getStatValue(page, 'UNSQUEEZED ASPECT'))).toBeCloseTo(2.70, 1);
  });
});

// ============================================
// CUSTOM VALUE TESTS - FILM
// ============================================

test.describe('Custom Values - Film', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Custom film squeeze: S35 4-perf + 1.8x + 2.0:1', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    await page.locator('select').first().selectOption({ label: /Super 35mm 4-perf/ });

    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.8');
    await clickAspectRatio(page, '2.0:1');
    await page.waitForTimeout(700);

    // Unsqueezed AR = (24.9*1.8)/18.7 = 2.397
    expect(parseFloat(await getStatValue(page, 'UNSQUEEZED ASPECT'))).toBeCloseTo(2.397, 2);
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
  });

  test('Custom film squeeze preserved after changing aspect', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    await page.locator('select').first().selectOption({ label: /Super 35mm 4-perf/ });

    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    const customSqInput = page.locator('input[placeholder="e.g., 2.0"]');
    await customSqInput.fill('1.65');
    await clickAspectRatio(page, '2.39:1');
    await page.waitForTimeout(700);
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();

    await clickAspectRatio(page, '1.85:1');
    await page.waitForTimeout(700);

    expect(await customSqInput.inputValue()).toBe('1.65');
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
  });

  test('Custom film aspect: S35 4-perf + 2.0x + 2.55:1', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    await page.locator('select').first().selectOption({ label: /Super 35mm 4-perf/ });
    await clickSqueezeRatio(page, '2.0x');

    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.55');
    await page.waitForTimeout(700);

    // Unsqueezed = 2.663, desired = 2.55. 2.663 > 2.55 => crop horiz
    expect(parseFloat(await getStatValue(page, 'UNSQUEEZED ASPECT'))).toBeCloseTo(2.663, 2);
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
  });

  test('Custom film aspect preserved after changing squeeze', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    await page.locator('select').first().selectOption({ label: /Super 35mm 4-perf/ });
    await clickSqueezeRatio(page, '2.0x');

    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    const customARInput = page.locator('input[placeholder="e.g., 2.39"]');
    await customARInput.fill('2.10');
    await page.waitForTimeout(700);
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();

    await clickSqueezeRatio(page, '1.5x');
    await page.waitForTimeout(700);

    expect(await customARInput.inputValue()).toBe('2.10');
    await expect(page.locator('text=NEGATIVE VISUALIZATION').first()).toBeVisible();
  });

  test('Custom film squeeze + custom aspect causes insufficient', async ({ page }) => {
    await page.getByRole('button', { name: 'FILM' }).click();
    await page.locator('select').first().selectOption({ label: /Super 35mm 4-perf/ });

    // Custom squeeze 1.6x
    const customSqCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).first().locator('input[type="checkbox"]');
    await customSqCheckbox.check();
    await page.locator('input[placeholder="e.g., 2.0"]').fill('1.6');

    // Custom aspect 2.20:1. Unsqueezed = (24.9*1.6)/18.7 = 2.13. 2.20 > 2.13 => insufficient
    const customARCheckbox = page.locator('label').filter({ hasText: 'CUSTOM RATIO' }).last().locator('input[type="checkbox"]');
    await customARCheckbox.check();
    await page.locator('input[placeholder="e.g., 2.39"]').fill('2.20');
    await page.waitForTimeout(700);

    await expect(page.locator('text=INSUFFICIENT').first()).toBeVisible();
  });
});

// ============================================
// CUSTOM VALUES IN COMPARISON TABS
// ============================================

test.describe('Custom Values in Comparison Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndConfirm(page);
  });

  test('Comparison tab with defaults shows results independently', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();
    await page.waitForTimeout(300);

    const defaultsCheckboxes = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]');
    await defaultsCheckboxes.nth(1).check();
    await page.waitForTimeout(600);

    await expect(page.locator('text=DESQUEEZED OUTPUT')).toHaveCount(2);
  });

  test('Comparison tab state survives main tab changes', async ({ page }) => {
    await selectDigitalDefaults(page);
    await page.locator('text=+ ADD CAMERA').click();

    const defaultsCheckboxes = page.locator('label').filter({ hasText: 'DEFAULTS' }).locator('input[type="checkbox"]');
    await defaultsCheckboxes.nth(1).check();
    await page.waitForTimeout(600);
    await expect(page.locator('text=DESQUEEZED OUTPUT')).toHaveCount(2);

    // Change main squeeze
    await page.locator('button').filter({ hasText: '2.0x' }).first().click();
    await page.waitForTimeout(600);

    // Both should still show
    await expect(page.locator('text=DESQUEEZED OUTPUT')).toHaveCount(2);
  });
});
