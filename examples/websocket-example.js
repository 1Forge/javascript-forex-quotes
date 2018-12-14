/*
 * This library is provided without warranty under the MIT license
 * Created by Jacob Davis <jacob@1forge.com>
 */

const ForgeClient = require("../lib/ForgeClient").default;

let client = new ForgeClient('YOUR_API_KEY');

//Handle incoming price updates from the server
client.onUpdate((symbol, data) => {
    console.log(symbol, data);
});

//Handle non-price update messages
client.onMessage((message) => {
    console.log(message);
});

//Handle disconnection from the server
client.onDisconnect(() => {
    console.log("Disconnected from server");
});

//Connect to the server
client.connect(() => {
    //Subscribe to a single currency pair
    client.subscribeTo('EURUSD');

    //Subscribe to an array of currency pairs
    client.subscribeTo([
        'GBPJPY',
        'AUDCAD',
        'BTCUSD',
    ]);

    //Subscribe to all of currency pairs
    client.subscribeToAll();

    //Unsubcribe after 5 seconds and disconnect
    setTimeout(function() {
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
