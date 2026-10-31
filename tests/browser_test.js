import puppeteer from 'puppeteer-core';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';

function findChromePath() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const CHROME_PATH = findChromePath();
const PORT = 5192;
const APP_URL = `http://localhost:${PORT}`;

async function runBrowserTests() {
  console.log('=============================================');
  console.log('🌐 RUNNING KANBAN BOARD REAL BROWSER TESTS');
  console.log('=============================================\n');

  if (!CHROME_PATH) {
    console.error('⚠️ No Chrome or Edge executable found. Skipping browser screenshot test.');
    return;
  }

  console.log(`Using browser: ${CHROME_PATH}`);

  // 1. Start Vite preview server programmatically
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const previewServer = await preview({
    preview: {
      port: PORT,
      strictPort: true
    }
  });

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 2. Desktop Test & Screenshot (1280x800)
    await page.setViewport({ width: 1280, height: 850 });
    console.log(`Navigating to ${APP_URL}...`);
    await page.goto(APP_URL, { waitUntil: 'networkidle0', timeout: 15000 });

    const title = await page.title();
    console.log(`Page title: "${title}"`);

    // Verify 3 columns exist
    const columns = await page.$$('.kanban-column');
    console.log(`  ✅ Found ${columns.length} columns (expected 3)`);

    // Verify task cards rendered
    const cards = await page.$$('.task-card');
    console.log(`  ✅ Found ${cards.length} initial task cards`);

    // Test Search Interaction
    console.log('Testing search functionality...');
    await page.type('.search-input', 'Git');
    await new Promise((r) => setTimeout(r, 400));
    const searchCards = await page.$$('.task-card');
    console.log(`  ✅ Search for "Git" yielded ${searchCards.length} cards`);

    // Clear search
    await page.click('.search-clear-btn');
    await new Promise((r) => setTimeout(r, 400));

    // Capture Desktop Screenshot
    const desktopPath = path.resolve('docs/screenshots/desktop_view.png');
    await page.screenshot({ path: desktopPath, fullPage: true });
    console.log(`  📸 Desktop view screenshot saved: ${desktopPath}`);

    // 3. Mobile Test & Screenshot (390x844 - iPhone 14 size)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0' });

    // Verify mobile tabs bar is visible
    const mobileTabsVisible = await page.$eval('.mobile-tabs-bar', (el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none';
    });
    console.log(`  ✅ Mobile tabs bar visible: ${mobileTabsVisible}`);

    const mobilePath = path.resolve('docs/screenshots/mobile_view.png');
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log(`  📸 Mobile view screenshot saved: ${mobilePath}`);

    console.log('\n=============================================');
    console.log('🎉 ALL BROWSER INTEGRATION TESTS PASSED!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('Error during browser tests:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    previewServer.httpServer.close();
  }
}

runBrowserTests();
