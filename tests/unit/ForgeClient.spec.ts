import ForgeClient, { Errors, OutgoingEvents } from '../../src/ForgeClient';

const EMITS_THE_CORRECT_EVENT_AND_PAYLOAD = 'emits the correct event and payload';
const SENDS_EXPECTED_GET_REQUEST = 'sends the expected GET request';
const SETS_THE_PROPER_CALLBACK = 'sets the proper callback';
const CALLS_THE_PROPER_CALLBACK = 'calls the proper callback';
const RETURNS_IF_NO_CALLBACK_SET = 'returns if no callback is set';
const THROWS_ERROR_IF_NO_SOCKET = 'throws an error if the socket is undefined';

const API_KEY = 'EXAMPLE_API_KEY';
const SYMBOL = 'BTCUSD';
const SYMBOLS = [
  'BTCUSD',
  'EURUSD',
  'AUDJPY',
  'ETHUSD',
];

// tslint:disable:no-big-function
describe('ForgeClient', () => {
  let client: ForgeClient;

  describe('constructor', () => {
    it('allows the consumer to specify all settings', () => {
      const socketPort = 1234;
      const socketURL = 'http://something.com';
      const restURL = 'https://something-else.com';

      const settings = {
        restURL,
        socketPort,
        socketURL,
      };

      client = new ForgeClient(API_KEY, settings);

      expect((client as any).settings).toEqual(settings);
    });
  });

  describe('tests with default settings', () => {
    beforeEach(() => {
      client = new ForgeClient(API_KEY);
      (client as any).socket = {
        disconnect: jest.fn(),
        emit: jest.fn(),
      };
    });

    afterEach(() => {
      client.disconnect();
    });

    describe('outgoing events', () => {
      describe('subscribeTo', () => {
        it(EMITS_THE_CORRECT_EVENT_AND_PAYLOAD, (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.subscribeTo(SYMBOL);
          expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.SUBSCRIBE_TO, SYMBOL);
          done();
        });

        it(THROWS_ERROR_IF_NO_SOCKET, () => {
          expect(() => {
            client.disconnect();
            (client as any).subscribeTo(SYMBOL);
          }).toThrow(Errors.SOCKET_NOT_CONNECTED);
        });

        it('if an array is given, loops through all and calls subscribeTo', (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.subscribeTo(SYMBOLS);
          SYMBOLS.forEach((symbol) => {
            expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.SUBSCRIBE_TO, symbol);
            done();
          });
        });
      });

      describe('subscribeToAll', () => {
        it(EMITS_THE_CORRECT_EVENT_AND_PAYLOAD, (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.subscribeToAll();
          expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.SUBSCRIBE_TO_ALL);
          done();
        });

        it(THROWS_ERROR_IF_NO_SOCKET, () => {
          expect(() => {
            client.disconnect();
            (client as any).subscribeToAll(SYMBOL);
          }).toThrow(Errors.SOCKET_NOT_CONNECTED);
        });
      });

      describe('unsubscribeFrom', () => {
        it(EMITS_THE_CORRECT_EVENT_AND_PAYLOAD, (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.unsubscribeFrom(SYMBOL);
          expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.UNSUBSCRIBE_FROM, SYMBOL);
          done();
        });

        it('if an array is given, loops through all and calls subscribeTo', (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.unsubscribeFrom(SYMBOLS);
          SYMBOLS.forEach((symbol) => {
            expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.UNSUBSCRIBE_FROM, symbol);
            done();
          });
        });

        it(THROWS_ERROR_IF_NO_SOCKET, () => {
          expect(() => {
            client.disconnect();
            (client as any).unsubscribeFrom(SYMBOL);
          }).toThrow(Errors.SOCKET_NOT_CONNECTED);
        });
      });

      describe('unsubscribeFromAll', () => {
        it(EMITS_THE_CORRECT_EVENT_AND_PAYLOAD, (done) => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          client.unsubscribeFromAll();
          expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.UNSUBSCRIBE_FROM_ALL);
          done();
        });

        it(THROWS_ERROR_IF_NO_SOCKET, () => {
          expect(() => {
            client.disconnect();
            (client as any).unsubscribeFromAll();
          }).toThrow(Errors.SOCKET_NOT_CONNECTED);
        });
      });
    });

    describe('socket callback setters', () => {
      describe('connect', () => {
        it(SETS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.connect(callback);
          expect((client as any).onConnectionCallback).toBe(callback);
        });

        it('calls initializeSocketClient', () => {
          const initializeSocketClientSpy = spyOn((client as any), 'initializeSocketClient');
          client.connect();
          expect(initializeSocketClientSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('onMessage', () => {
        it(SETS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onMessage(callback);
          expect((client as any).onMessageCallback).toBe(callback);
        });
      });

      describe('onUpdate', () => {
        it(SETS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onUpdate(callback);
          expect((client as any).onUpdateCallback).toBe(callback);
        });
      });

      describe('onDisconnect', () => {
        it(SETS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onDisconnect(callback);
          expect((client as any).onDisconnectCallback).toBe(callback);
        });
      });
    });

    describe('socket callback handlers', () => {
      describe('handleLoginRequest', () => {
        it('emits a login message', () => {
          const emitSpy = spyOn((client as any).socket, 'emit');
          (client as any).handleLoginRequest();
          expect(emitSpy).toHaveBeenCalledWith(OutgoingEvents.LOGIN, API_KEY);
        });

        it(THROWS_ERROR_IF_NO_SOCKET, () => {
          expect(() => {
            client.disconnect();
            (client as any).handleLoginRequest();
          }).toThrow(Errors.SOCKET_NOT_CONNECTED);
        });
      });

      describe('handleMessage', () => {
        const message = 'this is a test message';

        it(CALLS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onMessage(callback);
          (client as any).handleMessage(message);
          expect(callback).toHaveBeenCalledTimes(1);
          expect(callback).toHaveBeenCalledWith(message);
        });

        it(RETURNS_IF_NO_CALLBACK_SET, () => {
          expect(() => {
            (client as any).handleMessage(message);
          }).not.toThrow();
        });
      });

      describe('handlePostLoginSuccess', () => {

        it(CALLS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.connect(callback);
          (client as any).handlePostLoginSuccess();
          expect(callback).toHaveBeenCalledTimes(1);
        });

        it(RETURNS_IF_NO_CALLBACK_SET, () => {
          expect(() => {
            (client as any).handlePostLoginSuccess();
          }).not.toThrow();
        });
      });

      describe('handleUpdate', () => {
        const message = {
          ask: 2,
          bid: 1,
          price: 1.5,
          symbol: 'EURUSD',
        };

        it(CALLS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onUpdate(callback);
          (client as any).handleUpdate(message);
          expect(callback).toHaveBeenCalledTimes(1);
          expect(callback).toHaveBeenCalledWith(message.symbol, message);
        });

        it(RETURNS_IF_NO_CALLBACK_SET, () => {
          expect(() => {
            (client as any).handleUpdate(message)
          }).not.toThrow();
        });
      });

      describe('handleDisconenct', () => {
        it(CALLS_THE_PROPER_CALLBACK, () => {
          const callback = jest.fn();
          client.onDisconnect(callback);
          (client as any).handleDisconnect();
          expect(callback).toHaveBeenCalledTimes(1);
        });

        it(RETURNS_IF_NO_CALLBACK_SET, () => {
          expect(() => {
            (client as any).handleDisconnect();
          }).not.toThrow();
        });
      });
    });

    describe('REST methods', () => {
      let fetchSpy: jasmine.Spy;

      beforeEach(() => {
        fetchSpy = spyOn((client as any).fetch, 'get');
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      describe('getQuotes', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.getQuotes('EURUSD');
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/quotes?pairs=EURUSD&api_key=${API_KEY}`,
          );
        });

        it('properly joins symbols if an array is passed in', () => {
          client.getQuotes(['EURUSD', 'USDBTC']);
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/quotes?pairs=EURUSD,USDBTC&api_key=${API_KEY}`,
          );
        });
      });

      describe('getSymbols', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.getSymbols();
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/symbols?api_key=${API_KEY}`,
          );
        });
      });

      describe('getMarketStatus', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.getMarketStatus();
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/market_status?api_key=${API_KEY}`,
          );
        });
      });

      describe('marketStatus', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.marketStatus();
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/market_status?api_key=${API_KEY}`,
          );
        });
      });

      describe('getQuota', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.getQuota();
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/quota?api_key=${API_KEY}`,
          );
        });
      });

      describe('quota', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          client.quota();
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/quota?api_key=${API_KEY}`,
          );
        });
      });

      describe('convert', () => {
        it(SENDS_EXPECTED_GET_REQUEST, () => {
          const from = 'EUR';
          const to = 'BTC';
          const quantity = 123;

          client.convert(from, to, quantity);

          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy)
          .toHaveBeenCalledWith(
            `https://forex.1forge.com/1.0.3/convert?from=${from}&to=${to}&quantity=${quantity}&api_key=${API_KEY}`,
          );
        });
      });
    });

    describe('disconnect', () => {
      it('disconnects the socket and returns this', () => {
        const disconnectSpy = spyOn((client as any).socket, 'disconnect');
        expect(client.disconnect()).toBe(client);
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
      });

      it('does not throw if there is no socket', () => {
        (client as any).socket = undefined;
        expect(() => {
          client.disconnect();
        }).not.toThrow();
      });
    });
  });
});
