const crypto = require('crypto');
const assert = require('assert');

const parser = require('xml2json');
const moment = require('moment');

const request = require('./request');

const DATE_FORMAT = 'DD.MM.YYYY';

const DATE_RANGE = {
    today: () => moment().format(DATE_FORMAT),
    monthAgo: () => moment().subtract(1, 'month').format(DATE_FORMAT)
};

function isRequired(field) {
    return assert(false, `'${field}' is required`);
}

module.exports = class {

    constructor(opts) {
        const {
            id = isRequired('merchantId'),
            password = isRequired('password'),
            country = 'UA'
        } = opts;

        Object.assign(this, opts);
    }

    _signature(data) {
        const hash = crypto.createHash('md5');
        hash.update(`${data}${this.password}`);

        const signature = crypto.createHash('sha1');
        signature.update(hash.digest('hex'));

        return signature.digest('hex');
    }

    _request(url, data) {
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

        return request.post(url, requestData)
            .then((response) => parser.toJson(response.data));
    }

    balance(card) {
        const data = `<oper>cmt</oper>
            <wait>90</wait>
            <test>0</test>
            <payment id="">
                <prop name="cardnum" value="${card}" />
                <prop name="country" value="${this.country}" />
            </payment>`;

        return this._request('https://api.privatbank.ua/p24api/balance', data);
    }

    statement(card, startDate = DATE_RANGE.monthAgo(), endDate = DATE_RANGE.today()) {
        const data = `<oper>cmt</oper>
            <wait>90</wait>
            <test>0</test>
            <payment id="">
                <prop name="sd" value="${startDate}"/>
                <prop name="ed" value="${endDate}"/>
                <prop name="cardnum" value="${card}"/>
                <prop name="country" value="${this.country}" />
            </payment>`;

        return this._request('https://api.privatbank.ua/p24api/rest_fiz', data);
    }
};
