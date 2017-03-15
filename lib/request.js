const transport = {
    http: require('http'),
    https: require('https')
};

function parseUrl(url = '') {
    url = url.toLowerCase();

    const [, protocol, hostname, path] = url.match(/(^http(?:s)?)?:\/\/(.*?)([/\\?]{1,}.*)/);

    return {
        protocol,
        hostname,
        path
    };
}

function methodFor(method) {

    return (url, data, opts) => {
        return new Promise((resolve, reject) => {
            const {protocol, hostname, path} = parseUrl(url);

            const request = transport[protocol].request({
                hostname,
                path,
                method
            }, (response) => {
                if (response.statusCode >= 400) {
                    return reject(response);
                }

                response.setEncoding('utf8');

                let data = '';
                response.on('data', chunk => data += chunk);

                response.on('end', () => resolve({
                    data,
                    headers: response.headers,
                    statusCode: response.statusCode
                }));
            });

            request.on('error', e => reject(e));

            request.write(data);
            request.end();
        });
    };

}

module.exports = ['GET', 'POST'].reduce((result, method) => {
    result[method.toLowerCase()] = methodFor(method);

    return result;
}, {});
