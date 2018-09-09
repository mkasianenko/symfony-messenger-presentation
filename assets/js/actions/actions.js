import { actionTypes } from './actionTypes';

export const productsLoading = (loading) => ({
    type: actionTypes.PRODUCTS_LOADING,
    loading: loading
});

export const productsUpdate = (products) => ({
    type: actionTypes.PRODUCTS_UPDATE,
    products: products
});

export const productAdd = (product) => ({
    type: actionTypes.PRODUCT_ADD,
    product: product
});

export const productRemoving = (id) => ({
    type: actionTypes.PRODUCT_REMOVING,
    id: id
});

export const productRemoved = (id) => ({
    type: actionTypes.PRODUCT_REMOVED,
    id: id
});

export const formProductSet = (product) => ({
    type: actionTypes.FORM_PRODUCT_SET,
    product: product
});

export const formErrorsSet = (errors) => ({
    type: actionTypes.FORM_ERRORS_SET,
    errors: errors
});

export const formSubmittingSet = (submitting) => ({
    type: actionTypes.FORM_SUBMITTING_SET,
    submitting: submitting
});

export const globalMessageSetError = (message) => ({
    type: actionTypes.GLOBAL_MESSAGE_SET_ERROR,
    message: message
});

export const globalMessageSetSuccess = (message) => ({
    type: actionTypes.GLOBAL_MESSAGE_SET_SUCCESS,
    message: message
});
