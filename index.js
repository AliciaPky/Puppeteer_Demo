import puppeteer from 'puppeteer';
import fs from 'fs';

const inputValue = 'place'; //search value

// Run it non-headless
(async () => {
  const browser = await puppeteer.launch({
    headless: false,        
    defaultViewport: null,  // real window size
    slowMo: 50              // slows actions by 50ms
  });

  const page = await browser.newPage();

  // Open Website
  await page.goto('https://www.youtube.com/', {
    waitUntil: 'networkidle2'
  });
  console.log('Page opened');

  await page.waitForSelector('input[name="search_query"]', { visible: true }); // Wait for search box to be visible
  await page.click('input[name="search_query"]'); // Click search box

  await page.locator('input').fill(inputValue); //Input text in search box
  await page.keyboard.press('Enter'); // Click button from keyboard
  console.log('Search submitted');

// Extract Text
  await page.waitForSelector('#video-title', { visible: true });

  const firstVideoTitle = await page.evaluate(() => {
    const el = document.querySelector('#video-title');
    return el ? el.textContent.trim() : null;
  });

  console.log('First video title:', firstVideoTitle);
  
// Save to JSON file
    const data = {
    keyword: inputValue,
    firstVideoTitle,
    extractedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    'youtube_result.json',
    JSON.stringify(data, null, 2),
    'utf-8'
  );

  console.log('Saved to youtube_result.json');

//   Close browser
  await browser.close();
})();
