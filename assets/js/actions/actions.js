import { actionTypes } from './actionTypes';

/**
 * @param {Boolean} loading
 * @return {{type: string, loading: Boolean}}
 */
export const productsLoading = (loading) => ({
    type: actionTypes.PRODUCTS_LOADING,
    loading: loading
});

/**
 * @param {Object[]} products
 * @return {{type: string, products: Object[]}}
 */
export const productsUpdate = (products) => ({
    type: actionTypes.PRODUCTS_UPDATE,
    products: products
});

/**
 * @param {Object} product
 * @return {{type: string, product: Object}}
 */
export const productAdd = (product) => ({
    type: actionTypes.PRODUCT_ADD,
    product: product
});

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productEditing = (id) => ({
    type: actionTypes.PRODUCT_EDITING,
    id: id
});

/**
 * @param {Object} product
 * @return {{type: string, product: Object}}
 */
export const productUpdated = (product) => ({
    type: actionTypes.PRODUCT_UPDATED,
    product: product
});

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productRemoving = (id) => ({
    type: actionTypes.PRODUCT_REMOVING,
    id: id
});

/**
 * @param {string} id
 * @return {{type: string, id: string}}
 */
export const productRemoved = (id) => ({
    type: actionTypes.PRODUCT_REMOVED,
    id: id
});

/**
 * @param {string} formId
 * @param {Object} product
 * @return {{type: string, formId: string, product: Object}}
 */
export const formProductSet = (formId, product) => ({
    type: actionTypes.FORM_PRODUCT_SET,
    formId: formId,
    product: product
});

/**
 * @param {string} formId
 * @param {Object[]} errors
 * @return {{type: string, formId: string, errors: Object[]}}
 */
export const formErrorsSet = (formId, errors) => ({
    type: actionTypes.FORM_ERRORS_SET,
    formId: formId,
    errors: errors
});

/**
 * @param {string} formId
 * @return {{type: string, formId: string}}
 */
export const formSubmittingSet = (formId) => ({
    type: actionTypes.FORM_SUBMITTING_SET,
    formId: formId
});

/**
 * @param {string} message
 * @return {{type: string, message: string}}
 */
export const globalMessageSetError = (message) => ({
    type: actionTypes.GLOBAL_MESSAGE_SET_ERROR,
    message: message
});

/**
 * @param {string} message
 * @return {{type: string, message: string}}
 */
export const globalMessageSetSuccess = (message) => ({
    type: actionTypes.GLOBAL_MESSAGE_SET_SUCCESS,
    message: message
});
