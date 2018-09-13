import { actionTypes } from '../actions/actionTypes';
import ProductForm from "./ProductForm";

const productForm = new ProductForm();

export default class Forms
{
    constructor()
    {
        this.reduce = this.reduce.bind(this);
        this._createState = this._createState.bind(this);
    }

    /**
     * @param {[{}]} forms
     * @return {{forms: *}}
     * @private
     */
    _createState(forms)
    {
        return {'forms': forms};
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        /** {Object[]} */
        const {forms} = state;

        switch (action.type) {
            case actionTypes.FORM_SUBMITTING_SET:
            case actionTypes.FORM_FIELDS_SET:
            case actionTypes.FORM_ERRORS_SET:
            case actionTypes.FORM_STATE_SET:
                if (forms.find(form => action.id === form.id)) {
                    return this._createState(
                        forms.map(
                            form => action.id === form.id ? productForm.reduce(form, action): form
                        )
                    );
                }

                return this._createState(forms.concat([productForm.reduce({}, action)]));
            default:
                break;
        }

        return this._createState(forms);
    }
};
