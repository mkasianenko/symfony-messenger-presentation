import React, {Component} from "react";
import Product from './Product';
import { tables } from 'bootstrap-css'

export default class ProductsTable extends Component {

    render() {
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
                    {this.props.products.map(
                        (product, index) => {
                            return <Product
                                key={index}
                                product={product}
                                view='tr'
                                updateProducts={this.props.updateProducts}
                                setErrorAlert={this.props.setErrorAlert}
                                apiClient={this.props.apiClient}
                            />
                        }
                    )}
                </tbody>
            </table>
        );
    }
};