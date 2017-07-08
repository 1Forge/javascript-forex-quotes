import * as WebRequest from 'web-request'

export class ForexDataClient
{
    private api_key:string;
    private base_uri:string = 'https://forex.1forge.com/1.0.2/';

    constructor(api_key:string)
    {
        this.api_key = api_key;
    }

    fetch(api_call:string)
    {
        return WebRequest.json<any>(this.base_uri + api_call + '&api_key=' + this.api_key);
    }

    getQuotes(pairs:Array<string>)
    {
        return this.fetch('quotes?cache=false&pairs=' + pairs.toString());
    }

    getSymbols()
    {
        return this.fetch('symbols?cache=false');
    }

    convert(from:string, to:string, quantity:number)
    {
        return this.fetch('convert?cache=false&from=' + from + '&to=' + to + '&quantity=' + quantity);
    }

    marketStatus()
    {
        return this.fetch('market_status?cache=false');
    }

    quota()
    {
        return this.fetch('quota?cache=false');
    }
}

export default ForexDataClient;