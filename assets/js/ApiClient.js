const ENDPOINT_USERS = 'users';
const ENDPOINT_USER = 'users/{id}';

class ApiClient {

    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
    }

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

        return fetch(this._makeApiUrl(endpoint), options);
    }

    /** @return {Promise} */
    getUsers()
    {
        return this._sendRequest(ENDPOINT_USERS, 'GET').then(
            response => response.json()
        ).catch(e => console.warn(e));
    }

    /**
     * @param {FormData} formData
     * @return {Promise}
     */
    addUser(formData)
    {
        return this._sendRequest(ENDPOINT_USERS, 'POST', formData).then(response => {
            if (response.status >= 400) {
                return Promise.reject('add user error');
            }

            return response;
        })
            .then(response => response.json())
        ;
    }

    removeUser(id)
    {
        return this._sendRequest(
            ENDPOINT_USER.replace('{id}', id),
            'DELETE'
        ).then(response => {
            if (response.status >= 400) {
                return Promise.reject('remove user error');
            }

            return true;
        });
    }
}

export default ApiClient;