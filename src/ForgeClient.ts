/*
 * This library is provided without warranty under the MIT license
 * Created by Jacob Davis <jacob@1forge.com>
 */

import * as io from 'socket.io-client';
import * as rm from 'typed-rest-client/RestClient';

export interface ForgeClientSettings {
  restURL: string;
  socketURL: string;
  socketPort: number;
}

export interface Quote {
  bid: number;
  ask: number;
  float: number;
  symbol: string;
  timestamp: number;
}

export interface ConversionResult {
  value: number;
  text: string;
  timestamp: number;
}

export interface MarketStatus {
  market_is_open: boolean;
}

export interface Quota {
  quota_used: number;
  quota_limit: number;
  quota_remaining: number;
  hours_until_reset: number;
}

export enum Errors {
  SOCKET_NOT_CONNECTED = 'You must connect before trying to emit messages. Please see https://github.com/1Forge/javascript-forex-quotes for examples',
}

export enum OutgoingEvents {
  LOGIN = 'login',
  SUBSCRIBE_TO = 'subscribe_to',
  UNSUBSCRIBE_FROM = 'unsubscribe_from',
  SUBSCRIBE_TO_ALL = 'subscribe_to_all',
  UNSUBSCRIBE_FROM_ALL = 'unsubscribe_from_all',
}

export enum IncomingEvents {
  MESSAGE = 'message',
  FORCE_CLOSE = 'force_close',
  LOGIN = 'login',
  POST_LOGIN_SUCCESS = 'post_login_success',
  UPDATE = 'update',
}

export enum IOEvents {
  DISCONNECT = 'disconnect',
  CONNECTION = 'connection',
}

export enum RESTEndpoints {
  QUOTES = 'quotes',
  CONVERT = 'convert',
  MARKET_STATUS = 'market_status',
  SYMBOLS = 'symbols',
  QUOTA = 'quota',
}

export type Callback = (...args: any[]) => void;

export enum DefaultSettings {
  restURL = 'https://forex.1forge.com/1.0.3/',
  socketPort = 3000,
  socketURL = 'https://socket.forex.1forge.com',
}

class ForgeClient {
  private apiKey: string;
  private settings: ForgeClientSettings;
  private socket?: SocketIOClient.Socket;
  private onConnectionCallback?: Callback;
  private onMessageCallback?: Callback;
  private onUpdateCallback?: Callback;
  private onDisconnectCallback?: Callback;
  private fetch: rm.RestClient;

  constructor(apiKey: string, settings?: ForgeClientSettings) {
    this.apiKey = apiKey;

    if (!settings) {
      this.settings = {
        restURL: DefaultSettings.restURL as string,
        socketPort: DefaultSettings.socketPort as number,
        socketURL: DefaultSettings.socketURL as string,
      };
    } else {
      this.settings = settings;
    }

    this.fetch = new rm.RestClient(this.settings.restURL);
  }

  public connect(onConnection?: Callback): ForgeClient {
    this.onConnectionCallback = onConnection;
    this.initializeSocketClient();

    return this;
  }

  public onMessage(onMessage: Callback): ForgeClient {
    this.onMessageCallback = onMessage;
    return this;
  }

  public onUpdate(onUpdate: Callback): ForgeClient {
    this.onUpdateCallback = onUpdate;
    return this;
  }

  public onDisconnect(onDisconnect: Callback): ForgeClient {
    this.onDisconnectCallback = onDisconnect;
    return this;
  }

  public subscribeTo(symbols: string[] | string): ForgeClient {
    this.throwErrorIfSocketDoesntExist();

    if (Array.isArray(symbols)) {
      symbols.forEach((symbol) => {
        return this.subscribeTo(symbol);
      });
    }

    this.socket!.emit(OutgoingEvents.SUBSCRIBE_TO, symbols);

    return this;
  }

  public subscribeToAll(): ForgeClient {
    this.throwErrorIfSocketDoesntExist();

    this.socket!.emit(OutgoingEvents.SUBSCRIBE_TO_ALL);

    return this;
  }

  public unsubscribeFrom(symbols: string[] | string): ForgeClient {
    this.throwErrorIfSocketDoesntExist();

    if (Array.isArray(symbols)) {
      symbols.forEach((symbol) => {
        return this.unsubscribeFrom(symbol);
      });
    }

    this.socket!.emit(OutgoingEvents.UNSUBSCRIBE_FROM, symbols);

    return this;
  }

  public unsubscribeFromAll(): ForgeClient {
    this.throwErrorIfSocketDoesntExist();

    this.socket!.emit(OutgoingEvents.UNSUBSCRIBE_FROM_ALL);

    return this;
  }

  public disconnect(): ForgeClient {
    if (this.socket)  {
      this.socket.disconnect();
      this.socket = undefined;
    }

    return this;
  }

  public getQuotes(symbols: string[] | string): Promise<Quote[]> {
    const pairs = Array.isArray(symbols) ? symbols.join(',') : symbols;
    return this.get<Quote[]>(RESTEndpoints.QUOTES, { pairs });
  }

  public getSymbols(): Promise<string[]> {
    return this.get<string[]>(RESTEndpoints.SYMBOLS);
  }

  public getMarketStatus(): Promise<MarketStatus> {
    return this.get<MarketStatus>(RESTEndpoints.MARKET_STATUS);
  }

  public marketStatus(): Promise<MarketStatus> {
    return this.getMarketStatus();
  }

  public getQuota(): Promise<Quota> {
    return this.get<Quota>(RESTEndpoints.QUOTA);
  }

  public quota(): Promise<Quota> {
    return this.getQuota();
  }

  public convert(from: string, to: string, quantity: number): Promise<ConversionResult> {
    return this.get(RESTEndpoints.CONVERT, { from, to, quantity });
  }

  private initializeSocketClient() {
    const { socketURL, socketPort } = this.settings;

    this.socket = io.connect(`${socketURL}:${socketPort}`);

    this.socket.on(IncomingEvents.LOGIN, this.handleLoginRequest);
    this.socket.on(IncomingEvents.POST_LOGIN_SUCCESS, this.handlePostLoginSuccess);
    this.socket.on(IncomingEvents.MESSAGE, this.handleMessage);
    this.socket.on(IncomingEvents.UPDATE, this.handleUpdate);
    this.socket.on(IOEvents.DISCONNECT, this.handleDisconnect);
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

    const response = await this.fetch.get<Type>(`${this.settings.restURL}${uri}${formattedParameters}`);
    return response.result as Type;
  }

  private handleLoginRequest = () => {
    this.throwErrorIfSocketDoesntExist();

    this.socket!.emit(OutgoingEvents.LOGIN, this.apiKey);
  }

  private handlePostLoginSuccess = () => {
    if (!this.onConnectionCallback) {
      return;
    }

    this.onConnectionCallback(this);
  }

  private handleMessage = (message: string) => {
    if (!this.onMessageCallback) {
      return;
    }

    this.onMessageCallback(message);
  }

  private handleUpdate = (data: Quote) => {
    if (!this.onUpdateCallback) {
      return;
    }

    this.onUpdateCallback(data.symbol, data);
  }

  private handleDisconnect = () => {
    if (!this.onDisconnectCallback) {
      return;
    }

    this.onDisconnectCallback();
  }

  private throwErrorIfSocketDoesntExist() {
    if (!this.socket) {
      throw new Error(Errors.SOCKET_NOT_CONNECTED);
    }
  }
}

export default ForgeClient;
