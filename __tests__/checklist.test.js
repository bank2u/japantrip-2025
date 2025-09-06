// Mock TextEncoder and TextDecoder for JSDOM environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Checklist Functionality', () => {
  let document;
  let window;
  let scriptContent;

  // Helper function to create a JSDOM instance with localStorage mock
  const createJSDOM = (htmlContent) => {
    const dom = new JSDOM(htmlContent.replace(/<script>[\s\S]*?<\/script>/, ''), {
      runScripts: 'outside-only',
      url: 'http://localhost',
    });
    
    // Mock localStorage on the JSDOM window object directly
    Object.defineProperty(dom.window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    return dom;
  };

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../checklist.html'), 'utf8');

    // Extract script content before creating JSDOM instance
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch && scriptMatch[1]) {
      scriptContent = scriptMatch[1];
    } else {
      scriptContent = '';
    }

    const dom = createJSDOM(html);
    document = dom.window.document;
    window = dom.window;

    // Manually execute the script after localStorage is mocked
    if (scriptContent) {
      window.eval(scriptContent);
    }
  });

  test('checkbox state should be saved to localStorage when checked', () => {
    const checkbox = document.getElementById('passport');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change'));

    expect(window.localStorage.setItem).toHaveBeenCalledWith('passport', 'checked');
  });

  test('checkbox state should be removed from localStorage when unchecked', () => {
    const checkbox = document.getElementById('passport');
    // Simulate initial checked state
    window.localStorage.getItem.mockReturnValueOnce('checked');
    checkbox.checked = true; // Set to true to simulate initial state
    checkbox.dispatchEvent(new window.Event('change')); // Trigger change to uncheck
    checkbox.checked = false; // Manually uncheck for the test
    checkbox.dispatchEvent(new window.Event('change'));

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('passport');
  });

  test('checkbox should reflect saved state from localStorage on load', () => {
    // Simulate saved state before creating a new JSDOM instance
    const html = fs.readFileSync(path.resolve(__dirname, '../checklist.html'), 'utf8');
    const dom = createJSDOM(html);
    dom.window.localStorage.getItem.mockReturnValueOnce('checked');

    // Re-execute the script for the new JSDOM instance
    if (scriptContent) {
      dom.window.eval(scriptContent);
    }

    const checkbox = dom.window.document.getElementById('passport');
    expect(checkbox.checked).toBe(true);
  });
});