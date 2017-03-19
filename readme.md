# Privat bank API node-js client

### API documentation you can find [here](https://api.privatbank.ua/)

At the moment available card balance and statements for given card

## Installation

```
npm install privatbank-api --save
```

## Usage

```
const Merchant = require('privatbank-api');

merchant = new Merchant({
    id: '16164213',
    password: 'fasdfqwr234vzx1234asddfsdf',
    country: 'UA'
});

merchant.balance('5512123466651234')
    .then((balance) => console.log('Balance', balance));

merchant.statement('5512123466651234', '01.01.2017', '15.03.2017')
    .then((statements) => console.log('Statements', statements));
```