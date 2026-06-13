const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  console.log('Navigating to test runner...');
  await page.goto('http://localhost:3000/tests/test-runner.html', { waitUntil: 'networkidle' });
  
  console.log('Waiting for summary...');
  await page.waitForTimeout(2000);
  
  try {
    const summary = await page.locator('#summary').textContent();
    console.log('SUMMARY: ' + summary);
    
    const fails = await page.locator('.test-result.fail').allTextContents();
    console.log('FAILS: ' + fails.join('\n'));
  } catch (err) {
    console.log('Could not find summary element.', err.message);
  }
  
  await browser.close();
})();
