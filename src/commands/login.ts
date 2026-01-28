import { Provider, QuotaStatus } from '../providers/base.js';
import MinimaxProvider from '../providers/minimax.js';

export async function loginCommand(providerName?: string) {
  console.log('🔐 Login command');
  
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
  
  await provider.login();
  console.log(`✅ Login successful for ${providerName}`);
}
