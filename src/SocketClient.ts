import * as WebSocket from 'ws';
import { Callback, Quote } from './ForgeClient';

const url = 'wss://api.1forge.com/socket';

export enum IncomingEvents {
  MESSAGE = 'message',
  FORCE_CLOSE = 'force_close',
  LOGIN = 'login',
  POST_LOGIN_SUCCESS = 'post_login_success',
  UPDATE = 'update',
}

export enum OutgoingEvents {
  LOGIN = 'login',
  SUBSCRIBE_TO = 'subscribe_to',
  UNSUBSCRIBE_FROM = 'unsubscribe_from',
  SUBSCRIBE_TO_ALL = 'subscribe_to_all',
  UNSUBSCRIBE_FROM_ALL = 'unsubscribe_from_all',
}

export enum IOEvents {
  DISCONNECT = 'disconnect',
  CONNECTION = 'connection',
}

export class SocketClient {
  private socket?: WebSocket;
  private onConnectionCallback?: Callback;
  private onMessageCallback?: Callback;
  private onUpdateCallback?: Callback;
  private onDisconnectCallback?: Callback;

  constructor(private apiKey: string) {
  }

  public onMessage(onMessage: Callback): this {
    this.onMessageCallback = onMessage;
    return this;
  }

  public onUpdate(onUpdate: Callback): this {
    this.onUpdateCallback = onUpdate;
    return this;
  }

  public onConnect(onConnect: Callback): this {
    this.onConnectionCallback = onConnect;
    return this;
  }

  public onDisconnect(onDisconnect: Callback): this {
    this.onDisconnectCallback = onDisconnect;
    return this;
  }

  public subscribeTo(symbols: string[] | string): this {
    if (Array.isArray(symbols)) {
      symbols.forEach((symbol) => {
        return this.subscribeTo(symbol);
      });
    }

    this.socket!.emit(OutgoingEvents.SUBSCRIBE_TO, symbols);

    return this;
  }

  public subscribeToAll(): this {
    this.socket!.emit(OutgoingEvents.SUBSCRIBE_TO_ALL);

    return this;
  }

  public unsubscribeFrom(symbols: string[] | string): this {
    if (Array.isArray(symbols)) {
      symbols.forEach((symbol) => {
        return this.unsubscribeFrom(symbol);
      });
    }

    this.socket!.emit(OutgoingEvents.UNSUBSCRIBE_FROM, symbols);

    return this;
  }

  public unsubscribeFromAll(): this {
    this.socket!.emit(OutgoingEvents.UNSUBSCRIBE_FROM_ALL);

    return this;
  }

  public disconnect(): this {
    if (this.socket)  {
      this.socket.close();
      this.socket = undefined;
    }

    return this;
  }

  public connect() {
    this.initializeSocketClient();
  }

  private initializeSocketClient() {
    this.socket = new WebSocket(url);

    this.socket.on(IncomingEvents.LOGIN, this.handleLoginRequest);
    this.socket.on(IncomingEvents.POST_LOGIN_SUCCESS, this.handlePostLoginSuccess);
    this.socket.on(IncomingEvents.MESSAGE, this.handleMessage);
    this.socket.on(IncomingEvents.UPDATE, this.handleUpdate);
    this.socket.on(IOEvents.DISCONNECT, this.handleDisconnect);
  }

  private handleLoginRequest = () => {
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
}
