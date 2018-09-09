import { actionTypes } from '../actions/actionTypes';

export default class ProductForm
{
    constructor(apiClient)
    {
        this.reduce = this.reduce.bind(this);
        this._createState = this._createState.bind(this);
    }

    /**
     * @param {Object} formProduct
     * @param {Object} formErrors
     * @param {Boolean} formSubmitting
     * @return {{}}
     * @private
     */
    _createState(formProduct, formErrors, formSubmitting)
    {
        return {
            formProduct: formProduct,
            formErrors: formErrors,
            formSubmitting: formSubmitting
        };
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        const {formProduct, formErrors, formSubmitting} = state;

        switch (action.type) {
            case actionTypes.FORM_PRODUCT_SET:
                return this._createState(action.product, {}, formSubmitting);
            case actionTypes.FORM_ERRORS_SET:
                return this._createState(formProduct, action.errors, false);
            case actionTypes.FORM_SUBMITTING_SET:
                return this._createState(formProduct, formErrors, action.submitting);
            default:
                break;
        }

        return this._createState(formProduct, formErrors, formSubmitting);
    }
};
