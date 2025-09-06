/**
 * @jest-environment node
 */
const puppeteer = require('puppeteer');
const { exec } = require('child_process');

describe('Header Minimization E2E', () => {
  let browser;
  let page;
  let serverProcess;

  beforeAll(async () => {
    // Start http-server in the background
    serverProcess = exec('npx http-server -p 8080');
    // Wait for the server to start (increased timeout)
    await new Promise(resolve => setTimeout(resolve, 5000));

    browser = await puppeteer.launch();
    page = await browser.newPage();
  }, 10000); // Increased Jest timeout for beforeAll

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    // Kill the http-server process gracefully
    if (serverProcess && serverProcess.pid) {
      serverProcess.kill(); // Send SIGTERM
    }
  });

  test('header should minimize on scroll', async () => {
    await page.goto('http://localhost:8080/index.html');

    // Get the initial header height
    const initialHeaderHeight = await page.$eval('header', header => header.offsetHeight);
    console.log('Initial Header Height:', initialHeaderHeight);

    // Scroll down the page significantly
    await page.evaluate(() => {
      window.scrollBy(0, 500); // Increased scroll amount
    });

    // Wait for the scroll transition to complete and class to be applied
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased timeout

    // Check if the header has the minimized class
    const headerClasses = await page.$eval('header', header => Array.from(header.classList));
    expect(headerClasses).toContain('header-minimized');

    // Optionally, check if the height has actually reduced
    const minimizedHeaderHeight = await page.$eval('header', header => header.offsetHeight);
    console.log('Minimized Header Height:', minimizedHeaderHeight);
    expect(minimizedHeaderHeight).toBeLessThan(initialHeaderHeight);
  });
});