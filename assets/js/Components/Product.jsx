import React, {Component} from 'react';
import { buttons } from 'bootstrap-css'

import ProductsForm from './ProductsForm';

import {
    productRemoving,
    productRemoved,
    globalMessageSetSuccess,
    globalMessageSetError,
    productEditing,
    productUpdated, formProductSet
} from '../actions/actions';

export default class Product extends Component {

    constructor(props)
    {
        super(props);
        this._deleteProduct = this._deleteProduct.bind(this);
        this._startEdit = this._startEdit.bind(this);
        this._stopEdit = this._stopEdit.bind(this);
    }

    _deleteProduct()
    {
        const {store, apiClient, product} = this.props;
        store.dispatch(productRemoving(product.id));

        apiClient.removeProduct(product.id)
            .then(
                res => {
                    if (res.success) {
                        if (res.successMessage) {
                            store.dispatch(globalMessageSetSuccess(res.successMessage));
                        }

                        return store.dispatch(productRemoved(product.id));
                    }
                },
                e => {
                    store.dispatch(productRemoving(null));
                    store.dispatch(globalMessageSetError(e));
                }
            )
        ;
    }

    _startEdit()
    {
        const {store, product} = this.props;
        store.dispatch(productEditing(product.id));
        store.dispatch(formProductSet(product.id, Object.assign({}, product)));
    }

    _stopEdit()
    {
        this.props.store.dispatch(productEditing(null));
    }

    render() {
        const {store, product, apiClient} = this.props;
        const {removingProductId, editingProductId} = store.getState();

        if (product.id === removingProductId) {
            return <tr><td colSpan="5" className="text-center">...Removing...</td></tr>;
        }

        if (product.id === editingProductId) {
            return <tr>
                <td colSpan="4">
                    <ProductsForm
                        store={store}
                        apiClient={apiClient}
                        apiClientAction="editProduct"
                        productAction={productUpdated}
                        submitText="submit"
                        formId={product.id}
                        view="td"
                    />
                </td>
                <td>
                    <button className="btn btn-sm btn-secondary" onClick={this._stopEdit}>Cancel</button>
                </td>
            </tr>;
        }

        return <tr>
            <td>{product.sku}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.description}</td>
            <td>
                <button
                    type="button"
                    className="btn btn-info btn-sm"
                    onClick={this._startEdit}
                >Edit</button>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={this._deleteProduct}
                >Delete</button>
            </td>
        </tr>;
    }
};
