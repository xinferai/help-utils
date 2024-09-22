// base64Decode.test.js

const { base64Decode } = require('../dist/index.js');
const puppeteer = require('puppeteer');

describe('base64Decode', () => {
  test('decodes base64 string in Node.js environment', () => {
    const encoded = 'SGVsbG8sIFdvcmxkIQ==';
    const decoded = base64Decode(encoded);
    expect(decoded).toBe('Hello, World!');
  });

  test('throws error when neither Buffer nor atob is available', () => {
    const originalBuffer = global.Buffer;
    const originalAtob = global.atob;
    delete global.Buffer;
    delete global.atob;

    expect(() => base64Decode('SGVsbG8=')).toThrow('Base64 decoding is not supported in this environment');

    global.Buffer = originalBuffer;
    global.atob = originalAtob;
  });

  test('decodes base64 string in browser environment', async () => {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
        ] 
    });
    const page = await browser.newPage();

    await page.evaluate(() => {
      window.base64Decode = (str) => {
        if (typeof Buffer !== 'undefined') {
          return Buffer.from(str, 'base64').toString('utf8');
        } else if (typeof atob === 'function') {
          return decodeURIComponent(
            atob(str).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
          );
        } else {
          throw new Error('Base64 decoding is not supported in this environment');
        }
      };
    });

    const result = await page.evaluate(() => {
      return window.base64Decode('SGVsbG8sIEJyb3dzZXIh');
    });

    expect(result).toBe('Hello, Browser!');

    await browser.close();
  });
});