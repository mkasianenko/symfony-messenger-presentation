import { actionTypes } from '../actions/actionTypes';

export default class GlobalMessages
{
    constructor()
    {
        this.reduce = this.reduce.bind(this);
        this._createState = this._createState.bind(this);
    }

    /**
     * @param {String|null} errorMessage
     * @param {String|null} successMessage
     * @return {Object}
     * @private
     */
    _createState(errorMessage, successMessage)
    {
        return {
            globalErrorMessage: errorMessage,
            globalSuccessMessage: successMessage
        }
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @return {Object}
     */
    reduce(state = {}, action)
    {
        switch (action.type) {
            case actionTypes.GLOBAL_MESSAGE_SET_ERROR:
                return this._createState(action.message, null);
            case actionTypes.GLOBAL_MESSAGE_SET_SUCCESS:
                return this._createState(null, action.message);
            default:
                break;
        }

        const {globalErrorMessage, globalSuccessMessage} = state;

        return this._createState(globalErrorMessage, globalSuccessMessage);
    }
};
