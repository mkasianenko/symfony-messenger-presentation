const ENDPOINT_PRODUCTS = 'products';
const ENDPOINT_PRODUCT = 'products/{id}';

export default class ApiClient {

    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
    }

    /**
     * @param {Response} response
     * @return {Response}
     * @private
     */
    _filterErrorResponse(response)
    {
        if (response.status >= 400) {
            return Promise.reject('internal server error');
        }

        return response;
    }

    /**
     * @param {Response} response
     * @return {Response}
     * @private
     */
    _filterNonJsonResponse(response)
    {
        if (false === response.headers.has('content-type')) {
            return Promise.reject('unknown response content-type');
        }

        if (-1 === response.headers.get('content-type').indexOf('json')) {
            return Promise.reject('response is not json');
        }

        return response;
    }

    /**
     * @param {string} endpoint
     * @return {string}
     * @private
     */
    _makeApiUrl(endpoint)
    {
        return `${this.baseUrl}/${endpoint}?XDEBUG_SESSION_START=PHPSTORM`;
    }

    /**
     * @param {String} endpoint
     * @param {String} method
     * @param {FormData|null} body
     * @return {Promise}
     * @private
     */
    _sendRequest(endpoint, method, body)
    {
        let self = this;
        const options = {method: method};
        if (body) {
            options.body = body;
        }

        return fetch(this._makeApiUrl(endpoint), options)
            .then(response => this._filterErrorResponse(response))
        ;
    }

    /** @return {Promise} */
    getProducts()
    {
        return this._sendRequest(ENDPOINT_PRODUCTS, 'GET')
            .then(response => this._filterNonJsonResponse(response))
            .then(response => response.json())
        ;
    }

    /**
     * @param {FormData} formData
     * @return {Promise}
     */
    addProduct(formData)
    {
        return this._sendRequest(ENDPOINT_PRODUCTS, 'POST', formData)
            .then(response => this._filterNonJsonResponse(response))
            .then(response => response.json())
        ;
    }

    /**
     * @param {string} id
     * @return {Promise}
     */
    removeProduct(id)
    {
        return this._sendRequest(ENDPOINT_PRODUCT.replace('{id}', id), 'DELETE')
            .then(response => this._filterNonJsonResponse(response))
            .then(response => response.json())
        ;
    }

    /**
     * @param {string} id
     * @return {Promise}
     */
    getProduct(id)
    {
        return this._sendRequest(ENDPOINT_PRODUCT.replace('{id}', id), 'GET')
            .then(response => this._filterNonJsonResponse(response))
            .then(response => response.json())
        ;
    }
};
