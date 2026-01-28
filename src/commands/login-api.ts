import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function loginAndSave() {
  console.log('🌐 Opening browser...');
  console.log('Please login to Minimax.');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://platform.minimaxi.com/user-center/payment/coding-plan');
  
  console.log('⏳ Waiting for login...');
  
  // Wait for user to login and reach quota page
  for (let i = 0; i < 120; i++) {
    await page.waitForTimeout(1000);
    
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    // Check if logged in
    if (!url.includes('/login') && 
        (bodyText.includes('已使用') || bodyText.includes('可用额度'))) {
      console.log('✅ Logged in! Saving cookies...');
      await page.waitForTimeout(3000);  // Wait for session cookie
      
      // Save ALL cookies
      const cookies = await context.cookies();
      fs.writeFileSync(
        path.join('./auth', 'minimax_cookies.json'),
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
      
      break;
    }
    
    if (i > 0 && i % 30 === 0) {
      console.log(`⏳ Waiting... (${i}s)`);
    }
  }
  
  await browser.close();
  console.log('\n✅ Done! Run "node dist/index.js status minimax" to check quota.');
}

loginAndSave().catch(console.error);
