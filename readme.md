# Privat bank API merchant client
Allows to get balance and statements for given card


## Usage

```
const Merchant = require('privatbank-merchant');

merchant = new Merchant({
    id: '16164213',
    password: 'fasdfqwr234vzx1234asddfsdf',
    country: 'UA'
});

merchant.balance('5168443124455343')
    .then((balance) => console.log('Balance', balance));

merchant.statement('5512123466651234', '01.01.2017', '15.03.2017')
    .then((statements) => console.log('Statements', statements));
    ```
