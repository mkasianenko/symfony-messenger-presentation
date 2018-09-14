import { actionTypes } from './actionTypes';

/*********************************************
 ******************* PRODUCT_ACTIONS *******
 ******************************************/

/**
 * @param {Object} objA
 * @param {Object} objB
 * @return {Object}
 */
const mixTwo = (objA, objB) => (Object.assign({}, objA, objB));

/**
 * @param {string} type
 * @return {{type: string}}
 */
const typeFactory = type => ({'type': type});

/**
 * @param {string} type
 * @param {Object} actionParams
 * @return {Object}
 */
const withType = (type, actionParams) => mixTwo(actionParams, typeFactory(type));

/**
 * @param {string} type
 * @param {string} id
 * @return {Object}
 */
const withTypeAndId = (type, id) => withType(type, {'id': id});

/**
 * @param {string} type
 * @param {Object} product
 * @return {Object}
 */
const withTypeAndProduct = (type, product) => withType(type, {'product': product});

/**
 * @param {Boolean} loading
 * @return {{type: string, loading: Boolean}}
 */
export const productsLoading = (loading) => withType(actionTypes.PRODUCTS_LOADING, {'loading': loading});

/**
 * @param {Object[]} products
 * @return {{type: string, products: Object[]}}
 */
export const productsUpdate = (products) => withType(actionTypes.PRODUCTS_UPDATE, {'products': products});

/**
 * @param {Object} product
 * @return {{type: string, product: Object}}
 */
export const productAdd = (product) => withTypeAndProduct(actionTypes.PRODUCT_ADD, product);

/**
 * @param {Object} product
 * @return {{type: string, product: Object}}
 */
export const productUpdated = (product) => withTypeAndProduct(actionTypes.PRODUCT_UPDATED, product);

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productEditing = (id) => withTypeAndId(actionTypes.PRODUCT_EDITING, id);

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productRemoving = (id) => withTypeAndId(actionTypes.PRODUCT_REMOVING, id);

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productRemoved = (id) => withTypeAndId(actionTypes.PRODUCT_REMOVED, id);

/******************************************
 ******************* FORM_ACTIONS ********
 ***************************************/

/**
 * @param {string} id
 * @param {Object} fields
 * @return {{type: string, id: string, fields: Object}}
 */
export const formFieldsSet = (id, fields) => mixTwo(
    withTypeAndId(actionTypes.FORM_FIELDS_SET, id),
    {'fields': fields}
);

/**
 * @param {string} id
 * @param {[{}]} errors
 * @return {{type: string, formId: string, errors: [{}]}}
 */
export const formErrorsSet = (id, errors) => mixTwo(
    withTypeAndId(actionTypes.FORM_ERRORS_SET, id),
    {'errors': errors}
);

/**
 * @param {string} id
 * @param {Boolean} submitting
 * @return {{type: string, formId: string}}
 */
export const formSubmittingSet = (id, submitting) => mixTwo(
    withTypeAndId(actionTypes.FORM_SUBMITTING_SET, id),
    {'submitting': submitting}
);

/**
 * @param {string} id
 * @param {Boolean} submitting
 * @param {Object} fields
 * @param {[{}]} errors
 * @return {{type: string, formId: string}}
 */
export const formStateSet = (id, submitting, fields, errors) => mixTwo(
    withTypeAndId(actionTypes.FORM_STATE_SET, id),
    {
        'fields': fields,
        'errors': errors,
        'submitting': submitting
    }
);

/***************************************************
 ******************* GLOBAL_MESSAGES_ACTIONS ******
 ************************************************/

/**
 * @param {string} type
 * @param {string} message
 * @return {Object}
 */
const withTypeAndMessage = (type, message) => withType(type, {'message': message});

/**
 * @param {string} message
 * @return {{type: string, message: string}}
 */
export const globalMessageSetError = (message) =>withTypeAndMessage(actionTypes.GLOBAL_MESSAGE_SET_ERROR, message);

/**
 * @param {string} message
 * @return {{type: string, message: string}}
 */
export const globalMessageSetSuccess = (message) => withTypeAndMessage(actionTypes.GLOBAL_MESSAGE_SET_SUCCESS, message);
