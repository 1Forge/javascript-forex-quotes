const ForexDataClient = require("../src/ForexDataClient");

let client = new ForexDataClient('YOUR_API_KEY');

//Connect to the server
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


client.onUpdate((symbol, data) => {
    //What to do when we get an update from the server
    console.log(symbol, data);
});

