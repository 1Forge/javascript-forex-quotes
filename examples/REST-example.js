const ForexDataClient = require("../src/ForexDataClient");

let client = new ForexDataClient('YOUR_API_KEY');

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