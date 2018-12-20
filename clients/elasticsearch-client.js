const path = require('path');
const AWS = require('aws-sdk');

const endpoint = new AWS.Endpoint('https://search-sponsoredproducts-wluln73skn3xskkbf63rugk5vm.us-east-1.es.amazonaws.com');
const httpClient = new AWS.HttpClient();
const credentials = new AWS.SharedIniFileCredentials();
//const credentials = new AWS.EnvironmentCredentials('AWS');


function sendRequest({ httpMethod, requestPath, payload }) {
    const request = new AWS.HttpRequest(endpoint, 'us-east-1');

    request.method = httpMethod;
    //request.path = path.join(request.path, requestPath);
    request.body = JSON.stringify(payload);
    request.headers['Content-Type'] = 'application/json';
    request.path = '/contents/content/_search';
    request.headers['Host'] = 'search-sponsoredproducts-wluln73skn3xskkbf63rugk5vm.us-east-1.es.amazonaws.com';

    const signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    return new Promise((resolve, reject) => {
        httpClient.handleRequest(request, null,
            response => {
                const { statusCode, statusMessage, headers } = response;
                let body = '';
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    const data = {
                        statusCode,
                        statusMessage,
                        headers
                    };
                    if (body) {
                        data.body = JSON.parse(body);
                        //data.body = body;
                    }
                    resolve(data);
                });
            },
            err => {
                reject(err);
            });
    });
}

module.exports = sendRequest;