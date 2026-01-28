export interface QuotaStatus {
  provider: string;
  used: string;
  total: string;
  remaining: string;
  lastUpdated: string;
}

export abstract class Provider {
  abstract name: string;
  abstract login(): Promise<void>;
  abstract getStatus(): Promise<QuotaStatus>;
  
  protected cookiesPath: string;
  
  constructor(name: string) {
    this.cookiesPath = `./cookies/${name}.json`;
  }
}
