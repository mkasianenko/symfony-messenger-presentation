import React, {Component} from 'react';
import { grid } from 'bootstrap-css'
import uuid from 'uuid';

import ProductsTable from './ProductsTable';
import ProductsForm from './ProductsForm';
import HeaderAlert from './HeaderAlert';

import {productsUpdate, globalMessageSetError, productAdd} from '../actions/actions';

export default class App extends Component {

    constructor(props)
    {
        super(props);
        const {store} = this.props;

        const self = this;
        store.subscribe(() => self.setState(store.getState()));

        this._loadProducts = this._loadProducts.bind(this);
        this.productAddFormId = uuid.v4();
    }

    _loadProducts()
    {
        const {store, apiClient} = this.props;
        apiClient.getProducts().then(
            products => {
                if (products.errors) {
                    store.dispatch(globalMessageSetError('internal server error'));
                    return store.dispatch(productsUpdate([]))
                }

                store.dispatch(productsUpdate(products))
            },
            e => store.dispatch(globalMessageSetError(e))
        );
    }

    componentWillMount()
    {
        this._loadProducts();
    }

    render() {
        const {store, apiClient} = this.props;

        return (
            <div className="container-fluid">
                <HeaderAlert store={store} />
                <div className={"row"}>
                    <div className="col-md-8">
                        <h3 className="text-center">Products list</h3>
                        <ProductsTable store={store} apiClient={apiClient}/>
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-center">Products form</h3>
                        <div>
                            <ProductsForm
                                store={store}
                                apiClient={apiClient}
                                apiClientAction="addProduct"
                                productAction={productAdd}
                                submitText="submit"
                                afterSuccessSubmitCallback={null}
                                formId={this.productAddFormId}
                                view="full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
