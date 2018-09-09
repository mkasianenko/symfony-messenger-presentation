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
     * @param {String} removingProductId
     * @param {String} editingProductId
     * @return {{}}
     * @private
     */
    _createState(products, productsLoading, removingProductId, editingProductId)
    {
        return {
            products: products,
            productsLoading: productsLoading,
            removingProductId: removingProductId,
            editingProductId: editingProductId
        };
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        const {products, productsLoading, removingProductId, editingProductId} = state;

        switch (action.type) {
            case actionTypes.PRODUCTS_LOADING:
                return this._createState(products, true, removingProductId, editingProductId);
            case actionTypes.PRODUCTS_UPDATE:
                return this._createState(action.products, false, removingProductId, editingProductId);
            case actionTypes.PRODUCT_ADD:
                return this._createState(
                    products.concat([Object.assign({}, action.product)]),
                    productsLoading,
                    removingProductId,
                    editingProductId
                );
            case actionTypes.PRODUCT_EDITING:
                return this._createState(
                    products,
                    productsLoading,
                    removingProductId,
                    action.id
                );
            case actionTypes.PRODUCT_UPDATED:
                return this._createState(
                    products.map(
                        product => action.product.id === product.id ? Object.assign({}, action.product): product
                    ),
                    productsLoading,
                    removingProductId,
                    null
                );
            case actionTypes.PRODUCT_REMOVING:
                return this._createState(
                    products,
                    productsLoading,
                    action.id,
                    editingProductId
                );
            case actionTypes.PRODUCT_REMOVED:
                return this._createState(
                    products.filter(product => action.id !== product.id),
                    productsLoading,
                    null,
                    editingProductId
                );
            default:
                break;
        }

        return this._createState(products, productsLoading, removingProductId, editingProductId);
    }
};
