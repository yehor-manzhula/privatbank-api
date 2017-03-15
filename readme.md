Usage

merchant = new Merchant({
    id: '15123',
    password: 'fjxZgr760h1nPRVcfasdfsM6c6efeduX0v91t'
});

merchant.balance('6123422255112343').then((balance) => {
    console.log('balance', JSON.stringify(balance, null, '\t'));
});

merchant.statement('6123422255112343', '01.01.2017', '15.03.2017').then((statements) => {
    console.log('balance', JSON.stringify(statements, null, '\t'));
});