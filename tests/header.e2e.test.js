/**
 * @jest-environment node
 */
const puppeteer = require('puppeteer');
const { exec } = require('child_process');

const SERVER_PORT = 8080;
const SERVER_START_TIMEOUT = 5000;
const SCROLL_TRANSITION_TIMEOUT = 1000;
const SCROLL_AMOUNT = 500;

describe('Header Minimization E2E', () => {
  let browser;
  let page;
  let serverProcess;

  beforeAll(async () => {
    serverProcess = exec(`npx http-server -p ${SERVER_PORT}`);
    await new Promise(resolve => setTimeout(resolve, SERVER_START_TIMEOUT));

    browser = await puppeteer.launch();
    page = await browser.newPage();
  }, 10000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    if (serverProcess && serverProcess.pid) {
      serverProcess.kill();
    }
  });

  test('header should minimize on scroll', async () => {
    await page.goto(`http://localhost:${SERVER_PORT}/index.html`);
    await page.addScriptTag({ path: 'src/js/load_components.js' });
    await page.waitForFunction(() => document.querySelector('header'));

    const initialHeaderHeight = await page.$eval('header', header => header.offsetHeight);

    await page.evaluate((scrollAmount) => {
      window.scrollBy(0, scrollAmount);
    }, SCROLL_AMOUNT);

    await new Promise(resolve => setTimeout(resolve, SCROLL_TRANSITION_TIMEOUT));

    const headerClasses = await page.$eval('header', header => Array.from(header.classList));
    expect(headerClasses).toContain('header-minimized');

    const minimizedHeaderHeight = await page.$eval('header', header => header.offsetHeight);
    expect(minimizedHeaderHeight).toBeLessThan(initialHeaderHeight);
  }, 30000);
});