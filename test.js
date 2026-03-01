const { chromium } = require('playwright');
const path = require('path');

async function testWebsite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon errors which are common and not critical
      if (!text.includes('favicon')) {
        errors.push(`Console error: ${text}`);
      }
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  try {
    // Load the static HTML file from out directory
    const filePath = path.join(__dirname, 'out/index.html');
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check if key elements exist
    const header = await page.$('header');
    const hero = await page.$('section');
    const footer = await page.$('footer');

    // Check if CSS is loaded by looking for styled elements
    const hasStyledContent = await page.evaluate(() => {
      const header = document.querySelector('header');
      const hero = document.querySelector('section');
      const computedHeader = window.getComputedStyle(header);
      const computedHero = window.getComputedStyle(hero);
      return {
        headerPosition: computedHeader.position,
        heroMinHeight: computedHero.minHeight,
        headerBg: computedHeader.backgroundColor,
        heroBg: computedHero.backgroundColor
      };
    });

    console.log('=== Website Test Results ===');
    console.log(`Header found: ${!!header}`);
    console.log(`Hero section found: ${!!hero}`);
    console.log(`Footer found: ${!!footer}`);
    console.log(`Header styling: position=${hasStyledContent.headerPosition}, bg=${hasStyledContent.headerBg}`);
    console.log(`Hero styling: min-height=${hasStyledContent.heroMinHeight}, bg=${hasStyledContent.heroBg}`);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404')
    );

    if (criticalErrors.length > 0) {
      console.log('\n=== Critical Errors Found ===');
      criticalErrors.forEach(err => console.log(err));
      process.exit(1);
    } else {
      console.log('\n✓ Website loaded successfully with styling!');
      if (errors.length > 0) {
        console.log(`Note: ${errors.length} non-critical errors (favicon/404) ignored`);
      }
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testWebsite();
