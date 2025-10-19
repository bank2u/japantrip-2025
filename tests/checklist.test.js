// Mock TextEncoder and TextDecoder for JSDOM environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Helper function to set up the test environment
const setupTestEnvironment = (localStorageState = {}) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../checklist.html'), 'utf8');
  const checklistScript = fs.readFileSync(path.resolve(__dirname, '../src/js/checklist.js'), 'utf8');

  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost',
  });

  Object.defineProperty(dom.window, 'localStorage', {
    value: {
      getItem: jest.fn((key) => localStorageState[key] || null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  dom.window.eval(checklistScript);

  return { document: dom.window.document, window: dom.window };
};

describe('Checklist Functionality', () => {
  test('checkbox state should be saved to localStorage when checked', () => {
    const { document, window } = setupTestEnvironment();
    const checkbox = document.getElementById('passport');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change'));

    expect(window.localStorage.setItem).toHaveBeenCalledWith('passport', 'checked');
  });

  test('checkbox state should be removed from localStorage when unchecked', () => {
    const { document, window } = setupTestEnvironment({ passport: 'checked' });
    const checkbox = document.getElementById('passport');
    checkbox.checked = false;
    checkbox.dispatchEvent(new window.Event('change'));

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('passport');
  });

  test('checkbox should reflect saved state from localStorage on load', () => {
    const { document } = setupTestEnvironment({ passport: 'checked' });
    const checkbox = document.getElementById('passport');
    expect(checkbox.checked).toBe(true);
  });
});