"use strict";
// @TODO also export as ForexDataClient
// @TODO update documentation but make sure the name change doesn't break existing integrations
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// @TODO typing almost everywhere
// @TODO handle the situation where the client isnt
// ...logged in but calls a method which expects a connection
var fetch = require("fetch");
var DEFAULT_SETTINGS = {
    restURL: 'https://forex.1forge.com/1.0.3/',
    socketURL: 'https://socket.forex.1forge.com:3000'
};
var ForgeDataClient = /** @class */ (function () {
    function ForgeDataClient(apiKey, settings) {
        var _this = this;
        this.handleLoginRequest = function () {
            _this.socket.emit('login', _this.apiKey);
        };
        this.handlePostLoginSuccess = function () {
            _this.onConnectionCallback();
        };
        this.handleMessage = function (message) {
            _this.onMessageCallback(message);
        };
        this.handleUpdate = function (symbol, data) {
            _this.onUpdateCallback(symbol, data);
        };
        this.handleDisconnect = function (symbol, data) {
            _this.onDisconnectCallback(symbol, data);
        };
        this.apiKey = apiKey;
        this.settings = settings || DEFAULT_SETTINGS;
    }
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.connect = function (onConnection) {
        this.onConnectionCallback = onConnection;
        this.initializeSocketClient();
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.onMessage = function (onMessage) {
        this.onConnectionCallback = onMessage;
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.onUpdate = function (onUpdate) {
        this.onUpdateCallback = onUpdate;
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.onDisconnect = function (onDisconnect) {
        this.onDisconnectCallback = onDisconnect;
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.subscribeTo = function (symbols) {
        var _this = this;
        symbols.forEach(function (symbol) {
            _this.subscribeTo(symbol);
        });
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.subscribeToAll = function () {
        this.socket.emit('subscribe_to_all');
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.unsubscribeFrom = function (symbols) {
        var _this = this;
        symbols.forEach(function (symbol) {
            _this.socket.emit('unsubscribe_from', symbol);
        });
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.unsubscribeFromAll = function () {
        this.socket.emit('unsubscribe_from_all');
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.disconnect = function () {
        this.socket.disconnect();
        return this;
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.getQuotes = function (symbols) {
        // @TODO typing
        return this.get("quotes?cache=false&pairs=" + symbols.join(','));
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.getSymbols = function () {
        return this.get('symbols?cache=false');
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.getMarketStatus = function () {
        return this.get('market_status?cache=false');
    };
    /**
     * @TODO docblock
     * @NOTE This is a proxy
     */
    ForgeDataClient.prototype.marketStatus = function () {
        return this.getMarketStatus();
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.getQuota = function () {
        return this.get('quota?cache=false');
    };
    /**
     * @TODO docblock
     * @NOTE this is a proxy
     */
    ForgeDataClient.prototype.quota = function () {
        return this.getQuota();
    };
    /**
     * @TODO docblock
     */
    ForgeDataClient.prototype.convert = function (from, to, quantity) {
        return this.get("convert?cache=false&from=" + from + "&to=" + to + "&quantity=" + quantity);
    };
    ForgeDataClient.prototype.initializeSocketClient = function () {
        var socketURL = this.settings.socketURL;
        this.socket = io.connect(socketURL);
        // Make login an enum
        this.socket.on('login', this.handleLoginRequest);
        this.socket.on('post_login_success', this.handlePostLoginSuccess);
        this.socket.on('message', this.handleMessage);
        this.socket.on('update', this.handleUpdate);
        this.socket.on('disconnect', this.handleDisconnect);
    };
    // @TODO typing
    ForgeDataClient.prototype.get = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("" + this.settings.restURL + uri + this.apiKey)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ForgeDataClient;
}());
