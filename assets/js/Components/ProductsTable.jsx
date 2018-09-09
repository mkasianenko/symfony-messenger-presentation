import React, {Component} from 'react';
import { tables } from 'bootstrap-css'

import Product from './Product';

export default class ProductsTable extends Component {

    render() {
        const {store, apiClient, updateProducts} = this.props;
        const {products} = store.getState();

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
                <tbody>
                    {products.map(
                        (product, index) => {
                            return <Product
                                key={index}
                                view='tr'
                                store={store}
                                product={product}
                                apiClient={apiClient}
                                updateProducts={updateProducts}
                            />
                        }
                    )}
                </tbody>
            </table>
        );
    }
};
