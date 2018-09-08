import React, {Component} from "react";
import { buttons } from 'bootstrap-css'

export default class Product extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            removing: false,
            product: this.props.product,
            view: this.props.view
        };
        this._deleteProduct = this._deleteProduct.bind(this);
    }

    _deleteProduct()
    {
        this.setState({removing: true});
        const self = this;
        this.props.apiClient.removeProduct(this.state.product.id)
            .then(
                res => {
                    if (res.success) {
                        return self.props.updateProducts(res.successMessage);
                    }

                    self.setState({removing: false});
                },
                e => {
                    self.setState({removing: false});
                    self.props.setErrorAlert(e);
                }
            )
        ;
    }

    render() {
        if ('tr' === this.state.view) {
            if (this.state.removing) {
                return <tr><td>...Removing...</td></tr>;
            }

            return <tr>
                <td>{this.state.product.sku}</td>
                <td>{this.state.product.name}</td>
                <td>{this.state.product.price}</td>
                <td>{this.state.product.description}</td>
                <td>
                    <button type="button" className="btn btn-danger" onClick={this._deleteProduct}>
                        Delete
                    </button>
                </td>
            </tr>;
        }

        if (this.state.removing) {
            return <div><p>...Removing...</p></div>;
        }

        return (
            <div>
                <p>{this.state.product.sku}</p>
                <p>{this.state.product.name}</p>
                <p>{this.state.product.price}</p>
                <p>{this.state.product.description}</p>
                <p>
                    <button type="button" className="btn btn-danger" onClick={this._deleteProduct}>
                        Delete
                    </button>
                </p>
            </div>
        );
    }
};
