import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface QuotaResponse {
  base_resp: {
    status_code: number;
    status_msg: string;
  };
  model_remains?: Array<{
    start_time: number;
    end_time: number;
    remains_time: number;
    current_interval_total_count: number;
    current_interval_usage_count: number;
    model_name: string;
  }>;
}

function getQuota(): Promise<QuotaResponse> {
  return new Promise((resolve, reject) => {
    let cookieHeader = '';
    try {
      const cookies = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'auth', 'minimax_cookies.json'), 'utf-8')
      );
      cookieHeader = cookies
        .map((c: any) => `${c.name}=${c.value}`)
        .join('; ');
    } catch (e) {
      reject(new Error('No cookies found. Run "npm run login" first.'));
      return;
    }
    
    console.log('📡 Calling Minimax API...');
    
    const req = https.get(
      'https://www.minimaxi.com/v1/api/openplatform/coding_plan/remains',
      {
        headers: {
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://platform.minimaxi.com/'
        }
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      }
    );
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function statusCommand() {
  try {
    const response = await getQuota();
    
    console.log('\n📊 Minimax Quota Status');
    console.log('='.repeat(50));
    
    if (response.base_resp.status_code !== 0) {
      console.log(`❌ Error: ${response.base_resp.status_msg}`);
      console.log('\nPlease run: npm run login');
      return;
    }
    
    if (response.model_remains && response.model_remains.length > 0) {
      const model = response.model_remains[0];
      const used = model.current_interval_usage_count;
      const total = model.current_interval_total_count;
      const percent = ((used / total) * 100).toFixed(1);
      
      console.log(`🤖 Model: ${model.model_name}`);
      console.log(`💰 Prompts: ${used} / ${total}`);
      console.log(`📈 Used: ${percent}%`);
      console.log(`📅 Period: ${new Date(model.start_time).toLocaleString()} - ${new Date(model.end_time).toLocaleString()}`);
    } else {
      console.log('⚠️  No quota data found');
    }
    
    console.log('='.repeat(50));
    console.log(`🕐 Last Updated: ${new Date().toLocaleString()}`);
    
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
    console.log('\nRun "npm run login" first to authenticate.');
  }
}

statusCommand();
