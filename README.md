# javascript-forex-quotes

javascript-forex-quotes is a Javascript Library for fetching realtime forex quotes.  See the examples for REST and WebSocket implementation in the /examples folder

# Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
    - [List of Symbols available](#get-the-list-of-available-symbols)
    - [Get quotes for specific symbols](#get-quotes-for-specified-symbols)
    - [Convert from one currency to another](#convert-from-one-currency-to-another)
    - [Stream quote updates (WebSocket)](#stream-quote-updates)
- [Support / Contact](#support-and-contact)
- [License / Terms](#license-and-terms)

## Requirements
* An API key which you can obtain for free at http://1forge.com/forex-data-api

## Installation
```npm install forex-quotes```

## Usage

### Instantiate the client
```javascript
//You can get an API key for free at 1forge.com
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');
```

### Get the list of available symbols:

```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');

client.getSymbols().then(response => {
    console.log(response);
});
```
### Get quotes for specified symbols:
```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');

client.getQuotes(['EURUSD', 'GBPJPY', 'AUDUSD']).then(response => {
    console.log(response);
});
```

### Convert from one currency to another:
```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');


client.convert('EUR', 'USD', 100).then(response => {
    console.log(response);
});
```


### Stream quote updates
WebSocket quote streaming is only available on paid plans.
```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');

client.connect((client) =>
{
    //Subscribe to a single currency pair
    client.subscribeTo('EURUSD');

    //Subscribe to an array of currency pairs
    client.subscribeTo([
        'GBPJPY',
        'AUDCAD',
        'EURCHF',
    ]);

    //Subscribe to all of currency pairs
    client.subscribeToAll();

    //Unsubcribe after 5 seconds and disconnect
    setTimeout(function()
    {
        //Unsubscribe to a single currency pair
        client.unsubscribeFrom('EURUSD');

        //Unsubscribe to an array of currency pairs
        client.unsubscribeFrom([
            'GBPJPY',
            'AUDCAD',
            'EURCHF'
        ]);

        //Unsubscribe from all currency pairs
        client.unsubscribeFromAll();

        //Disconnect from the server
        client.disconnect();

    }, 5000);
});

```
Handle the incoming data from the server

```javascript
client.onUpdate((symbol, data) => {
    //What to do when we get an update from the server
    console.log(symbol, data);
});
```


### Check if the market is open:
```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');


client.marketStatus().then(response => {
    console.log(response);
});
```

### Check your usage / quota limit:
```javascript
const ForexDataClient = require("forex-quotes");
let client = new ForexDataClient('YOUR_API_KEY');

client.quota().then(response => {
    console.log(response);
})
```


## Support and Contact
Please contact me at contact@1forge.com if you have any questions or requests.

## License and Terms
This library is provided without warranty under the MIT license.
