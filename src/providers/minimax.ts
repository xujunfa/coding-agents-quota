import { Provider, QuotaStatus } from './base.js';
import { chromium } from 'playwright';

export default class MinimaxProvider extends Provider {
  name = 'minimax';
  private statusUrl = 'https://platform.minimaxi.com/user-center/payment/coding-plan';
  
  constructor() {
    super('minimax');
  }
  
  async login(): Promise<void> {
    console.log('🌐 Opening browser...');
    console.log('Please login to Minimax.');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(this.statusUrl);
    
    console.log('⏳ Waiting for login...');
    
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(1000);
      
      const url = page.url();
      const bodyText = await page.evaluate(() => document.body.innerText);
      
      if (!url.includes('/login') && 
          (bodyText.includes('已使用') || bodyText.includes('可用额度') || 
           bodyText.includes('Coding Plan') || bodyText.includes('prompts'))) {
        console.log('✅ Logged in! Extracting quota info...');
        break;
      }
      
      if (i > 0 && i % 30 === 0) {
        console.log(`⏳ Waiting... (${i}s)`);
      }
    }
    
    const quotaInfo = await this.extractQuota(page);
    
    console.log('\n📊 Quota Status:');
    console.log(`   已使用: ${quotaInfo.used}`);
    console.log(`   可用额度: ${quotaInfo.remaining}`);
    console.log(`   总额度: ${quotaInfo.total}`);
    console.log(`   刷新时间: ${quotaInfo.refreshTime}`);
    console.log('\n✅ Done!');
    
    await browser.close();
  }
  
  async getStatus(): Promise<QuotaStatus> {
    console.log('🌐 Opening browser to check quota...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(this.statusUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    const quotaInfo = await this.extractQuota(page);
    
    await browser.close();
    
    return {
      provider: 'minimax',
      used: quotaInfo.used || '未找到',
      total: quotaInfo.total || '未找到',
      remaining: quotaInfo.remaining || '未找到',
      lastUpdated: new Date().toISOString()
    };
  }
  
  private async extractQuota(page: any): Promise<{ used?: string; total?: string; remaining?: string; refreshTime?: string }> {
    const result: { used?: string; total?: string; remaining?: string; refreshTime?: string } = {};
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    // Extract "已使用 XX%"
    const usedMatch = bodyText.match(/(\d+)%\s*已使用/);
    if (usedMatch) {
      result.used = usedMatch[1] + '%';
    }
    
    // Extract "可用额度：XX prompts / XX 小时"
    const remainingMatch = bodyText.match(/可用额度[：:]\s*([\d.]+)\s*prompts?\s*\/\s*([\d.]+)\s*小时/);
    if (remainingMatch) {
      result.remaining = `${remainingMatch[1]} prompts / ${remainingMatch[2]} 小时`;
    }
    
    // Extract total from remaining (if not found, calculate from used)
    if (remainingMatch) {
      result.total = `${parseFloat(remainingMatch[1]) / (parseFloat(result.used || '0') / 100)} prompts`;
    }
    
    // Extract refresh time
    const refreshMatch = bodyText.match(/(\d+\s*小时?\s*\d+\s*分?钟?后?重置)/);
    if (refreshMatch) {
      result.refreshTime = refreshMatch[1];
    }
    
    return result;
  }
}
