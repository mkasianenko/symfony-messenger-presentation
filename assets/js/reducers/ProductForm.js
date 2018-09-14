import { actionTypes } from '../actions/actionTypes';

export default class ProductForm
{
    constructor()
    {
        this.reduce = this.reduce.bind(this);
        this._createState = this._createState.bind(this);
        this._createEmptyState = this._createEmptyState.bind(this);
    }

    /**
     * @param {String} id
     * @param {Boolean} submitting
     * @param {Object} fields
     * @param {Object} errors
     *
     * @return {{}}
     * @private
     */
    _createState(id, submitting, fields, errors)
    {
        return {
            'id': id,
            'submitting': submitting,
            'fields': fields,
            'errors': errors
        };
    }

    /**
     * @return {{}}
     * @private
     */
    _createEmptyState()
    {
        return this._createState(null, false, null, {});
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        const emptyState = this._createEmptyState();
        const defaultState = Object.assign(emptyState, state);
        const {submitting, fields, errors} = defaultState;
        const id = action.id;

        switch (action.type) {
            case actionTypes.FORM_SUBMITTING_SET:
                return this._createState(id, action.submitting, fields, errors);
            case actionTypes.FORM_FIELDS_SET:
                return this._createState(id, submitting, action.fields, errors);
            case actionTypes.FORM_ERRORS_SET:
                return this._createState(id, submitting, fields, action.errors);
            case actionTypes.FORM_STATE_SET:
                return this._createState(id, action.submitting, action.fields, action.errors);
            default:
                break;
        }

        return this._createEmptyState();
    }
};
