# javascript-forex-quotes

javascript-forex-quotes is a Javascript Library for fetching realtime forex quotes.

<a href="#">![1Forge Data](https://1forge.com/images/1forge.gif)</a>

# Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Support / Contact](#support-and-contact)
- [License / Terms](#license-and-terms)

## Requirements
* A 1Forge API key which you can obtain at http://1forge.com/forex-data-api

## Installation
```npm install forex-quotes --save```

## Usage

### Importing the client

```javascript

// With require
const ForgeClient = require("forex-quotes").default;

// With es6 or TypeScript
import ForgeClient from 'forex-quotes';

```

### Using WebSocket

```javascript

let client = new ForgeClient('YOUR_API_KEY');

// Handle incoming price updates from the server
client.onUpdate((symbol, data) => {
    console.log(symbol, data);
});

// Handle non-price update messages
client.onMessage((message) => {
    console.log(message);
});

// Handle disconnection from the server
client.onDisconnect(() => {
    console.log("Disconnected from server");
});

// Handle successful connection
client.onConnect(() => {

    // Subscribe to a single currency pair
    client.subscribeTo('EURUSD');

    // Subscribe to an array of currency pairs
    client.subscribeTo([
        'GBPJPY',
        'AUDCAD',
        'EURCHF',
    ]);

    // Subscribe to all currency pairs
    client.subscribeToAll();

    // Unsubscribe from a single currency pair
    client.unsubscribeFrom('EURUSD');

    // Unsubscribe from an array of currency pairs
    client.unsubscribeFrom([
        'GBPJPY',
        'AUDCAD',
        'EURCHF'
    ]);

    // Unsubscribe from all currency pairs
    client.unsubscribeFromAll();

    // Disconnect from the server
    client.disconnect();
});

client.connect();
```

### Using RESTful API
```javascript

// You can get an API key at 1forge.com
let client = new ForgeClient('YOUR_API_KEY');

// Get the list of available symbols
client.getSymbols().then(response => {
    console.log(response);
});

// Get quotes for specified symbols:
client.getQuotes(['EURUSD', 'GBPJPY', 'AUDUSD']).then(response => {
    console.log(response);
});

// Convert from one currency to another:
client.convert('EUR', 'USD', 100).then(response => {
    console.log(response);
});

// Check if the market is open:
client.getMarketStatus().then(response => {
    console.log(response);
});

// Check your usage / quota limit:
client.getQuota().then(response => {
    console.log(response);
});

```
## Contributing
Thank you for considering contributing! Any issues, bug fixes, suggestions, improvements or help in any other way is always appreciated.  Please feel free to open an issue or create a pull request.

## Support and Contact
Please contact me at contact@1forge.com if you have any questions or requests.

## License and Terms
This library is provided without warranty under the MIT license.
