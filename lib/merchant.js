const crypto = require('crypto');
const parser = require('xml2json');
const request = require('./request');

module.exports = class {

    constructor({id = null, password = null, country = null}) {
        Object.assign(this, {
            id,
            password,
            country
        });
    }

    _signature(data) {
        const hash = crypto.createHash('md5');
        hash.update(data + this.password);

        const signature = crypto.createHash('sha1');
        signature.update(hash.digest('hex'));
        return signature.digest('hex');
    }

    balance(card) {
        const data = `<oper>cmt</oper>
                <wait>90</wait>
                <test>0</test>
                <payment id="">
                    <prop name="cardnum" value="${card}" />
                    <prop name="country" value="${this.country}" />
                </payment>`;

        const requestData = `<?xml version="1.0" encoding="UTF-8"?>
            <request version="1.0">
                <merchant>
                    <id>${this.id}</id>
                    <signature>${this._signature(data)}</signature>
                </merchant>
                <data>
                    ${data}
                </data>
            </request>`;

        return request.post('https://api.privatbank.ua/p24api/balance', requestData)
            .then((response) => parser.toJson(response.data));
    }

    statement(card, startDate, endDate) {
        const data = `<oper>cmt</oper>
                <wait>90</wait>
                <test>0</test>
                <payment id="">
                    <prop name="sd" value="${startDate}"/>
                    <prop name="ed" value="${endDate}"/>
                    <prop name="cardnum" value="${card}"/>
                    <prop name="country" value="${this.country}" />
                </payment>`;

        const requestData = `<?xml version="1.0" encoding="UTF-8"?>
            <request version="1.0">
                <merchant>
                    <id>${this.id}</id>
                    <signature>${this._signature(data)}</signature>
                </merchant>
                <data>
                    ${data}
                </data>
            </request>`;

        return request.post('https://api.privatbank.ua/p24api/rest_fiz', requestData)
            .then((response) => parser.toJson(response.data));
    }
};
