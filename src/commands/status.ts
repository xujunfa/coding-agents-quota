import { Provider, QuotaStatus } from '../providers/base.js';
import MinimaxProvider from '../providers/minimax.js';

export async function statusCommand(providerName?: string) {
  console.log('📊 Status command');
  
  if (!providerName) {
    console.log('Available providers: minimax');
    return;
  }
  
  let provider: Provider;
  
  switch (providerName.toLowerCase()) {
    case 'minimax':
      provider = new MinimaxProvider();
      break;
    default:
      console.log(`❌ Unknown provider: ${providerName}`);
      return;
  }
  
  const status = await provider.getStatus();
  
  console.log('\n📊 Quota Status:');
  console.log(`   Provider: ${status.provider}`);
  console.log(`   Used: ${status.used}`);
  console.log(`   Total: ${status.total}`);
  console.log(`   Remaining: ${status.remaining}`);
  console.log(`   Last Updated: ${status.lastUpdated}`);
}
