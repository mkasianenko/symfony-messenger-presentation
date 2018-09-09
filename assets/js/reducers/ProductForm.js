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
     * @param {String} submittingFormId
     * @return {{}}
     * @private
     */
    _createState(formProduct, formErrors, submittingFormId)
    {
        return {
            formProduct: formProduct,
            formErrors: formErrors,
            submittingFormId: submittingFormId
        };
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        const {formProduct, formErrors, submittingFormId} = state;

        switch (action.type) {
            case actionTypes.FORM_PRODUCT_SET:
                return this._createState(
                    {formId: action.formId, product: action.product},
                    formErrors,
                    submittingFormId
                );
            case actionTypes.FORM_ERRORS_SET:
                return this._createState(
                    formProduct,
                    {formId: action.formId, errors: action.errors},
                    submittingFormId
                );
            case actionTypes.FORM_SUBMITTING_SET:
                return this._createState(formProduct, formErrors, action.formId);
            default:
                break;
        }

        return this._createState(formProduct, formErrors, submittingFormId);
    }
};
