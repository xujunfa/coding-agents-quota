import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function loginAndSave() {
  console.log('🌐 Opening browser...');
  console.log('Please login to Minimax.');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('⚠️  Page error:', msg.text());
    }
  });
  
  // Listen for page navigations
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      console.log('📍 Navigated to:', page.url());
    }
  });
  
  await page.goto('https://platform.minimaxi.com/user-center/payment/coding-plan');
  
  console.log('⏳ Waiting for login...');
  
  let attempts = 0;
  const maxAttempts = 120;
  
  while (attempts < maxAttempts) {
    await page.waitForTimeout(1000);
    attempts++;
    
    try {
      const url = page.url();
      
      // Check if logged in (not on login page)
      if (!url.includes('/login') && !url.includes('/user-center/login')) {
        console.log('✅ Detected page change, checking login status...');
        
        // Wait for page to stabilize
        await page.waitForTimeout(2000);
        
        const bodyText = await page.evaluate(() => document.body.innerText);
        
        // Check for quota page indicators
        if (bodyText.includes('已使用') || bodyText.includes('可用额度') || 
            bodyText.includes('Coding Plan') || bodyText.includes('prompts')) {
          console.log('✅ Logged in! Saving cookies...');
          
          // Wait for session cookie to be set
          await page.waitForTimeout(3000);
          
          // Save ALL cookies
          const cookies = await context.cookies();
          fs.writeFileSync(
            path.join(__dirname, '..', '..', 'auth', 'minimax_cookies.json'),
            JSON.stringify(cookies, null, 2)
          );
          
          console.log(`✅ Saved ${cookies.length} cookies`);
          
          // Show HERTZ-SESSION if exists
          const session = cookies.find(c => c.name.includes('SESSION'));
          if (session) {
            console.log(`✅ Found ${session.name} cookie`);
          } else {
            console.log('⚠️  No SESSION cookie found - make sure you are fully logged in');
          }
          
          await browser.close();
          console.log('\n✅ Done! Run "npm run status" to check quota.');
          return;
        }
      }
      
      if (attempts > 0 && attempts % 30 === 0) {
        console.log(`⏳ Still waiting... (${attempts}s)`);
      }
    } catch (e: any) {
      // Ignore errors during navigation
      if (e.message.includes('Execution context')) {
        continue;
      }
      console.log('⚠️  Error:', e.message);
    }
  }
  
  console.log('⚠️  Timeout! Please make sure you are logged in.');
  await browser.close();
}

loginAndSave().catch(console.error);
