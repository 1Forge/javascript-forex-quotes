const fetch = require("node-fetch");

class ForexDataClient
{
    constructor(api_key)
    {
        this.api_key = api_key;
        this.base_uri = 'https://forex.1forge.com/1.0.3/';
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