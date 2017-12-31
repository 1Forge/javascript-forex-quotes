# forex-quotes

forex-quotes is a Javascript Library for fetching realtime forex quotes

# Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
    - [List of Symbols available](#get-the-list-of-available-symbols)
    - [Get quotes for specific symbols](#get-quotes-for-specified-symbols)
    - [Convert from one currency to another](#convert-from-one-currency-to-another)
- [Support / Contact](#support-and-contact)
- [License / Terms](#license-and-terms)

## Requirements
* An API key which you can obtain for free at http://1forge.com/forex-data-api

## Installation
npm install forex-quotes

## Usage

### Instantiate the client
```typescript
//You can get an API key for free at 1forge.com
let client = new ForexDataClient('YOUR_API_KEY');
```

### Get the list of available symbols:

```typescript
let client = new ForexDataClient('YOUR_API_KEY');

/*
    Returns an array of symbols, eg: ['EURUSD', 'GBPJPY']
*/
client.getSymbols().then(response => {
    console.log(response);
});
```
### Get quotes for specified symbols:
```typescript
let client = new ForexDataClient('YOUR_API_KEY');

/*
Returns an array of quotes, eg:
[ 
    { symbol: 'AUDUSD', timestamp: 1499461058, price: 0.76044 },
    { symbol: 'EURUSD', timestamp: 1499461058, price: 1.14008 },
    { symbol: 'GBPJPY', timestamp: 1499461058, price: 146.787339 } 
]
*/
client.getQuotes(['EURUSD', 'GBPJPY', 'AUDUSD']).then(response => {
    console.log(response);
});
```

### Convert from one currency to another:
```typescript
let client = new ForexDataClient('YOUR_API_KEY');

/*
{ 
    value: 114.008,
    text: '100 EUR is worth 114.008 USD',
    timestamp: 1499554707 
}
*/
client.convert('EUR', 'USD', 100).then(response => {
    console.log(response);
});
```


### Check if the market is open:
```typescript

let client = new ForexDataClient('YOUR_API_KEY');

/*
Returns:
{ 
    market_is_open: true 
}
*/

client.marketStatus().then(response => {
    console.log(response);
});
```

### Check your usage / quota limit:
```typescript

let client = new ForexDataClient('YOUR_API_KEY');

/*
{   
    quota_used: 102530,
    quota_limit: 'unlimited',
    quota_remaining: 'unlimited',
    hours_until_reset: 6 
}
*/

client.quota().then(response => {
    console.log(response);
})
```


## Support and Contact
Please contact me at contact@1forge.com if you have any questions or requests.

## License and Terms
This library is provided without warranty under the MIT license.
