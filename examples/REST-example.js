/*
 * This library is provided without warranty under the MIT license
 * Created by Jacob Davis <jacob@1forge.com>
 */

const ForgeClient = require("../lib/ForgeClient").default;

let client = new ForgeClient('YOUR_API_KEY');

//Get quotes for specified pairs
client.getQuotes(['EURUSD', 'GBPJPY', 'AUDUSD']).then(response => {
    console.log(response);
});

//Get the symbols list
client.getSymbols().then(response => {
    console.log(response);
});

//Convert from one currency to another
client.convert('EUR', 'USD', 100).then(response => {
    console.log(response);
});

//Get the market status
client.marketStatus().then(response => {
    console.log(response);
});

//Get quota
client.quota().then(response => {
    console.log(response);
});