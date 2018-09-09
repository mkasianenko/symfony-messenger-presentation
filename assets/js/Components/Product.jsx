import React, {Component} from 'react';
import { buttons } from 'bootstrap-css'

import {
    productRemoving,
    globalMessageSetSuccess,
    globalMessageSetError
} from '../actions/actions';

export default class Product extends Component {

    constructor(props)
    {
        super(props);
        this._deleteProduct = this._deleteProduct.bind(this);
    }

    _deleteProduct()
    {
        const {store, apiClient, updateProducts, product} = this.props;
        store.dispatch(productRemoving(product.id));

        apiClient.removeProduct(product.id)
            .then(
                res => {
                    if (res.success) {
                        if (res.successMessage) {
                            store.dispatch(globalMessageSetSuccess(res.successMessage));
                        }

                        return updateProducts();
                    }
                },
                e => {
                    store.dispatch(productRemoving(null));
                    store.dispatch(globalMessageSetError(e));
                }
            )
        ;
    }

    render() {
        const {store, product, view} = this.props;
        const {removingProductId} = store.getState();

        if ('tr' === view) {
            if (product.id === removingProductId) {
                return <tr>
                    <td></td>
                    <td></td>
                    <td>...Removing...</td>
                    <td></td>
                    <td></td>
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
                        className="btn btn-danger"
                        onClick={this._deleteProduct}
                    >Delete</button>
                </td>
            </tr>;
        }

        throw new Error('view ' + view + ' not supported');
    }
};
