/*
 * This library is provided without warranty under the MIT license
 * Created by Jacob Davis <jacob@1forge.com>
 */

const fetch = require("node-fetch");
const io = require('socket.io-client');

class ForexDataClient
{
    constructor(api_key)
    {
        this.api_key = api_key;
        this.base_uri = 'https://forex.1forge.com/1.0.3/';
    }

    login()
    {
        this.socket.emit('login', this.api_key);
    }

    initializeSocketClient()
    {
        this.socket = io.connect('https://socket.forex.1forge.com:3000');

        this.socket.on('login', () =>
        {
            this.login();
        });

        this.socket.on('post_login_success', () =>
        {
            if (this.post_login)
            {
                this.post_login(this);
            }
        });
    }

    unsubscribeFromAll()
    {
        if (!this.socket.connected)
        {
            return console.log("You must be logged in before unsubscribing from symbols");
        }

        this.socket.emit('unsubscribe_from_all');
    }

    unsubscribeFrom(symbol)
    {
        if (!this.socket.connected)
        {
            return console.log("You must be logged in before unsubscribing from symbols");
        }

        if (Array.isArray(symbol))
        {

            symbol.forEach((symbol) =>
            {
                this.unsubscribeFrom(symbol);
            });

            return;
        }

        this.socket.emit('unsubscribe_from', symbol);
    }

    subscribeTo(symbol)
    {
        if (!this.socket.connected)
        {
            return console.log("You must be logged in before subscribing to symbols");
        }

        if (Array.isArray(symbol))
        {
            symbol.forEach((symbol) =>
            {
                this.subscribeTo(symbol);
            });

            return;
        }

        this.socket.emit('subscribe_to', symbol);
    }

    subscribeToAll()
    {
        if (!this.socket.connected)
        {
            return console.log("You must be logged in before subscribing to symbols");
        }

        this.socket.emit('subscribe_to_all');
    }

    connect(login_function)
    {
        this.initializeSocketClient();
        this.post_login = login_function;
    }

    disconnect()
    {
        this.socket.disconnect()
    }

    onMessage(message_function)
    {
        this.socket.on('message', function(data)
        {
            message_function(data);
        });
    }

    onDisconnect(disconnect_function)
    {
        this.socket.on('disconnect', function()
        {
            disconnect_function();
        });
    }

    onUpdate(update_function)
    {
        this.socket.on('update', function(data)
        {
            update_function(data.symbol, data);
        });
    }

    get(api_call)
    {
        return fetch(this.base_uri + api_call + '&api_key=' + this.api_key)
            .then(function(response) {
                return response.json()
            }).then(function(json) {
                return json;
            }).catch(function(ex) {
                throw new Error(ex);
            })
    }

    getQuotes(pairs)
    {
        return this.get('quotes?cache=false&pairs=' + pairs.join(","));
    }

    getSymbols()
    {
        return this.get('symbols?cache=false');
    }

    convert(from, to, quantity)
    {
        return this.get('convert?cache=false&from=' + from + '&to=' + to + '&quantity=' + quantity);
    }

    marketStatus()
    {
        return this.get('market_status?cache=false');
    }

    quota()
    {
        return this.get('quota?cache=false');
    }
}

module.exports = ForexDataClient;
