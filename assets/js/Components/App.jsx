import React, {Component} from 'react';
import { grid } from 'bootstrap-css'

import ProductsTable from './ProductsTable';
import ProductsForm from './ProductsForm';
import HeaderAlert from './HeaderAlert';

import {productsUpdate, globalMessageSetError} from '../actions/actions';

export default class App extends Component {

    constructor(props)
    {
        super(props);
        const {store} = this.props;
        this.state = store.getState();

        const self = this;
        this.props.store.subscribe(() => self.setState(store.getState()));

        this.updateProducts = this.updateProducts.bind(this);
    }

    updateProducts()
    {
        const {store, apiClient} = this.props;
        apiClient.getProducts().then(
            products => store.dispatch(productsUpdate(products)),
            e => store.dispatch(globalMessageSetError(e))
        );
    }

    componentWillMount()
    {
        this.updateProducts();
    }

    render() {
        return (
            <div className="container">
                <HeaderAlert store={this.props.store} />
                <div className={"row"}>
                    <div className="col-md-6">
                        <h3 className="text-center">Products list</h3>
                        <ProductsTable
                            store={this.props.store}
                            apiClient={this.props.apiClient}
                            updateProducts={this.updateProducts}
                        />
                    </div>
                    <div className="col-md-6">
                        <h3 className="text-center">Products form</h3>
                        <div>
                            <ProductsForm
                                store={this.props.store}
                                apiClient={this.props.apiClient}
                                updateProducts={this.updateProducts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
