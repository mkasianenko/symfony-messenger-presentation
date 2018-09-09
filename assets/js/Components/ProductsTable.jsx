import React, {Component} from 'react';
import { tables } from 'bootstrap-css'

import Product from './Product';

export default class ProductsTable extends Component {

    constructor(props)
    {
        super(props);
        this._renderProducts = this._renderProducts.bind(this);
    }

    _renderProducts()
    {
        const {store, apiClient} = this.props;
        const {products, productsLoading} = store.getState();

        if (productsLoading) {
            return <tr>
                <td></td>
                <td></td>
                <td>...Loading Products...</td>
                <td></td>
                <td></td>
            </tr>;
        }

        return products.map(
            (product, index) => {
                return <Product
                    key={index}
                    store={store}
                    product={product}
                    apiClient={apiClient}
                />
            }
        );
    }

    render() {
        const {store, apiClient} = this.props;
        const {products, productsLoading} = store.getState();

        return (
            <table className="table">
                <thead className="table-inverse">
                    <tr>
                        <th>Sku</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{this._renderProducts()}</tbody>
            </table>
        );
    }
};
