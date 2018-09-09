import { actionTypes } from '../actions/actionTypes';

export default class Products
{
    /**
     * @param {ApiClient} apiClient
     */
    constructor(apiClient)
    {
        this.reduce = this.reduce.bind(this);
        this._createState = this._createState.bind(this);
    }

    /**
     * @param {Object[]} products
     * @param {Boolean} productsLoading
     * @param {Boolean} removingProductId
     * @return {{}}
     * @private
     */
    _createState(products, productsLoading, removingProductId)
    {
        return {
            products: products,
            productsLoading: productsLoading,
            removingProductId: removingProductId
        };
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        const {products, productsLoading, removingProductId} = state;

        switch (action.type) {
            case actionTypes.PRODUCTS_LOADING:
                return this._createState(products, true, null);
            case actionTypes.PRODUCTS_UPDATE:
                return this._createState(action.products, false, null);
            case actionTypes.PRODUCT_ADD:
                return this._createState(
                    products.concat([Object.assign({}, action.product)]),
                    false,
                    null
                );
            case actionTypes.PRODUCT_EDIT:
                return this._createState(
                    products.map(product => action.product.id === product.id ? action.product: product),
                    false,
                    null
                );
            case actionTypes.PRODUCT_REMOVING:
                return this._createState(
                    products,
                    false,
                    action.id
                );
            case actionTypes.PRODUCT_REMOVED:
                return this._createState(
                    products.filter(product => action.id !== product.id),
                    false,
                    null
                );
            default:
                break;
        }

        return this._createState(products, productsLoading, removingProductId);
    }
};
