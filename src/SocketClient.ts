// tslint:disable-next-line
const WebSocket = require('ws');
import { Callback, Quote } from './ForgeClient';

const url = 'wss://sockets.1forge.com/socket';

export enum IncomingEvents {
  MESSAGE = 'message',
  FORCE_CLOSE = 'force_close',
  HEART = 'heart',
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
  DISCONNECT = 'close',
  CONNECTION = 'open',
}

export class SocketClient {
  private socket: any;
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
      return this;
    }

    this.emit(OutgoingEvents.SUBSCRIBE_TO, symbols);

    return this;
  }

  public subscribeToAll(): this {
    this.emit(OutgoingEvents.SUBSCRIBE_TO_ALL);

    return this;
  }

  public unsubscribeFrom(symbols: string[] | string): this {
    if (Array.isArray(symbols)) {
      symbols.forEach((symbol) => {
        return this.unsubscribeFrom(symbol);
      });
    }

    this.emit(OutgoingEvents.UNSUBSCRIBE_FROM, symbols);

    return this;
  }

  public unsubscribeFromAll(): this {
    this.emit(OutgoingEvents.UNSUBSCRIBE_FROM_ALL);

    return this;
  }

  public disconnect(): this {
    if (this.socket) {
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
    this.socket.on('close', this.handleDisconnect);
    this.socket.on('error', this.disconnect);
    this.socket.on('message', this.handleMessage);
    this.socket.on('open', this.handleOpen);
    console.log(this.socket);
  }

  private handleLoginRequest = () => {
    this.emit(OutgoingEvents.LOGIN, this.apiKey);
  }

  private handleOpen = () => {
    this.emit(OutgoingEvents.LOGIN, this.apiKey);
  }

  private handlePostLoginSuccess = () => {
    if (!this.onConnectionCallback) {
      return;
    }

    this.onConnectionCallback(this);
  }

  private handleMessage = (message: string) => {
    console.log(message);
    const action = message.split('|')[0];
    const body = message.split('|').slice(1).join('|');
    switch (action) {
      case IncomingEvents.LOGIN:
        this.handleLoginRequest();
        return;
      case IncomingEvents.POST_LOGIN_SUCCESS:
        this.handlePostLoginSuccess();
        return;
      case IncomingEvents.UPDATE:
        this.handleUpdate(JSON.parse(body));
        return;
      case IncomingEvents.FORCE_CLOSE:
        this.handleDisconnect();
        return;
      case IncomingEvents.HEART:
        this.handleHeart();
        return;
    }

    if (!this.onMessageCallback) {
      return;
    }

    this.onMessageCallback(body);
  }

  private handleUpdate = (data: Quote) => {
    if (!this.onUpdateCallback) {
      return;
    }

    this.onUpdateCallback(data.s, data);
  }

  private handleHeart = () => {
    this.emit('beat');
  }

  private handleDisconnect = () => {
    if (!this.onDisconnectCallback) {
      return;
    }

    this.onDisconnectCallback();
  }

  private emit = (action: string, message?: any) => {
    if (message == null) {
      this.socket.send(action);
    } else {
      this.socket.send(`${action}|${message}`);
    }
  }
}
