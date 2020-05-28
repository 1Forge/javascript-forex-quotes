import { RestClient, RestClientSettings } from './RestClient';
import { SocketClient } from './SocketClient';

export interface ForgeClientSettings {
  rest: RestClientSettings;
}

export interface Quote {
  b: number;
  a: number;
  p: number;
  s: string;
  t: number;
}

export interface ConversionResult {
  value: number;
  text: string;
  timestamp: number;
}

export interface MarketStatus {
  market_is_open: boolean;
}

export enum Errors {
  SOCKET_NOT_CONNECTED = 'You must connect before trying to emit messages. Please see https://github.com/1Forge/javascript-forex-quotes for examples',
}

export type Callback = (...args: any[]) => void;
class ForgeClient {
  private restClient: RestClient;
  private socketClient: SocketClient;

  constructor(private apiKey: string, settings?: ForgeClientSettings, private temporary: boolean = true) {
    this.restClient = new RestClient(apiKey, settings && settings.rest);
    this.socketClient = new SocketClient(apiKey);
  }

  // SOCKET
  public connect() {
    this.socketClient.connect();
  }

  public subscribeTo(symbols: string[] | string) {
    this.socketClient.subscribeTo(symbols);
  }

  public subscribeToAll() {
    this.socketClient.subscribeToAll();
  }

  public unsubscribeFrom(symbols: string[] | string) {
    this.socketClient.unsubscribeFrom(symbols);
  }

  public unsubscribeFromAll(symbols: string[] | string) {
    this.socketClient.unsubscribeFromAll();
  }

  public onDisconnect(callback: Callback) {
    this.socketClient.onDisconnect(callback);
  }

  public onConnect(callback: Callback) {
    this.socketClient.onConnect(callback);
  }

  public onUpdate(callback: Callback) {
    this.socketClient.onUpdate(callback);
  }

  public onMessage(callback: Callback) {
    this.socketClient.onMessage(callback);
  }

  public disconnect() {
    this.socketClient.disconnect();
  }

  public async getQuotes(symbols: string[] | string): Promise<Quote[]> {
    try {
      return await this.restClient.getQuotes(symbols);
    } catch {
      return Promise.reject(new Error('No more than 952 pairs or 1904 curriencies!!')).catch(error => error);
    }
  }

  public async getSymbols(): Promise<string[]> {
    return await this.restClient.getSymbols();
  }

  public async getMarketStatus(): Promise<MarketStatus> {
    return await this.restClient.getMarketStatus();
  }

  public async convert(from: string, to: string, quantity: number): Promise<ConversionResult> {
    return await this.restClient.convert(from, to, quantity);
  }

  // TO BE DEPRECATED
  public async getQuota() {
    return this.restClient.getQuota();
  }

}

export default ForgeClient;
