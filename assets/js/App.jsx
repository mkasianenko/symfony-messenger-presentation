import React, {Component} from "react";
import ProductsTable from './ProductsTable';
import ProductsForm from './ProductsForm';
import HeaderAlert from './HeaderAlert';
import { grid } from 'bootstrap-css'

export default class App extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            'products': [],
            'productsLoading': true,
            'globalErrorMessage': null,
            'globalSuccessMessage': null
        };
        this.updateProducts = this.updateProducts.bind(this);
        this._renderProducts = this._renderProducts.bind(this);
        this._renderHeaderAlert = this._renderHeaderAlert.bind(this);
        this.setErrorAlert = this.setErrorAlert.bind(this);
        this.setSuccessAlert = this.setSuccessAlert.bind(this);
    }

    /**
     * @param {string|null} globalSuccessMessage
     */
    updateProducts(globalSuccessMessage=null)
    {
        const newState = {'productsLoading': true};
        if (globalSuccessMessage) {
            newState.globalSuccessMessage = globalSuccessMessage;
        }
        this.setState(newState);
        const self = this;
        this.props.apiClient.getProducts().then(
            products => self.setState({'products': products, 'productsLoading': false}),
            e => this.setErrorAlert(e)
        );
    }

    setErrorAlert(message)
    {
        this.setState({'globalErrorMessage': message});
    }

    setSuccessAlert(message)
    {
        this.setState({'globalSuccessMessage': message});
    }

    componentWillMount()
    {
        this.updateProducts();
    }

    _renderProducts()
    {
        if (this.state.productsLoading) {
            return <div className='t-a-center'>...Loading products...</div>
        }

        return <ProductsTable
            products={this.state.products}
            apiClient={this.props.apiClient}
            updateProducts={this.updateProducts}
            setErrorAlert={this.setErrorAlert}
            setSuccessAlert={this.setSuccessAlert}
        />
    }

    _renderHeaderAlert()
    {
        if (this.state.globalErrorMessage) {
            return <HeaderAlert
                message={this.state.globalErrorMessage}
                setAlert={this.setErrorAlert}
                alertClass='alert-danger'
            />
        }

        if (this.state.globalSuccessMessage) {
            return <HeaderAlert
                message={this.state.globalSuccessMessage}
                setAlert={this.setSuccessAlert}
                alertClass='alert-success'
            />
        }

        return '';
    }

    render() {
        return (
            <div className="container">
                {this._renderHeaderAlert()}
                <div className={"row"}>
                    <div className="col-md-6">
                        <h3 className="text-center">Products list</h3>
                        {this._renderProducts()}
                    </div>
                    <div className="col-md-6">
                        <h3 className="text-center">Products form</h3>
                        <div>
                            <ProductsForm
                                updateProducts={this.updateProducts}
                                setErrorAlert={this.setErrorAlert}
                                apiClient={this.props.apiClient}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
