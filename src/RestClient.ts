import * as rm from 'typed-rest-client/RestClient';
import { ConversionResult, MarketStatus, Quote } from './ForgeClient';

export interface RestClientSettings {
  url: string;
}

export enum RESTEndpoints {
  QUOTES = 'quotes',
  CONVERT = 'convert',
  MARKET_STATUS = 'market_status',
  SYMBOLS = 'symbols',
  QUOTA = 'quota',
}

export interface Quota {
  quota_used: number;
  quota_limit: number;
  quota_remaining: number;
  hours_until_reset: number;
}

const defaultRestClientSettings: RestClientSettings = {
  url: 'https://forex.1forge.com/1.0.3/',
};

export class RestClient {
  private fetch: rm.RestClient;

  constructor(private apiKey: string, private settings?: RestClientSettings) {
    if (!settings) {
      this.settings = defaultRestClientSettings;
    }

    this.fetch = new rm.RestClient(this.settings!.url);
  }

  public async getQuotes(symbols: string[] | string): Promise<Quote[]> {
    const pairs = Array.isArray(symbols) ? symbols.join(',') : symbols;
    return this.get<Quote[]>(RESTEndpoints.QUOTES, { pairs });
  }

  public async getSymbols(): Promise<string[]> {
    return this.get<string[]>(RESTEndpoints.SYMBOLS);
  }

  public async getMarketStatus(): Promise<MarketStatus> {
    return this.get<MarketStatus>(RESTEndpoints.MARKET_STATUS);
  }

  public async getQuota(): Promise<Quota> {
    return this.get<Quota>(RESTEndpoints.QUOTA);
  }

  public convert(from: string, to: string, quantity: number): Promise<ConversionResult> {
    return this.get(RESTEndpoints.CONVERT, { from, to, quantity });
  }

  private objectToGetParameters(object: { [index: string]: string }): string {
    let parameters = '';

    Object.keys(object).forEach((key, i) => {
      const value: string = object[key];
      const prefix = i === 0 ? '?' : '&';
      parameters += `${prefix}${key}=${value}`;
    });

    return parameters;
  }

  private async get<Type>(uri: string, parameters?: {}): Promise<Type> {
    const formattedParameters = this.objectToGetParameters({
      ...parameters,
      api_key: this.apiKey,
    });

    const response = await this.fetch.get<Type>(`${this.settings!.url}${uri}${formattedParameters}`);
    return response.result as Type;
  }
}
