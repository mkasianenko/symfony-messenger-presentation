import React, {Component} from 'react';
import { forms, buttons } from 'bootstrap-css'

import {
    formSubmittingSet,
    formProductSet,
    formErrorsSet,
    globalMessageSetSuccess,
    globalMessageSetError
} from '../actions/actions';

export default class ProductsForm extends Component {

    constructor(props)
    {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this._getErrors = this._getErrors.bind(this);
        this._hasError = this._hasError.bind(this);
        this._printInvalidFeedback = this._printInvalidFeedback.bind(this);
        this._getInputWrapperClassName = this._getInputWrapperClassName.bind(this);
        this._getInputDefaultValue = this._getInputDefaultValue.bind(this);

        this.formRef = React.createRef();
    }

    onSubmit(e)
    {
        e.preventDefault();
        const {store, apiClient, updateProducts} = this.props;
        const formData = new FormData(e.target);

        store.dispatch(formSubmittingSet(true));
        store.dispatch(formProductSet({
            'sku': formData.get('Product[sku]'),
            'price': formData.get('Product[price]'),
            'name': formData.get('Product[name]'),
            'description': formData.get('Product[description]'),
        }));

        apiClient.addProduct(formData).then(
            data => {
                store.dispatch(formSubmittingSet(false));
                if (data.success) {
                    this.formRef.reset();
                    store.dispatch(formProductSet(null));
                    if (data.successMessage) {
                        store.dispatch(globalMessageSetSuccess(data.successMessage));
                    }

                    return updateProducts();
                }

                if (data.errors) {
                    store.dispatch(formErrorsSet(data.errors));
                }
            },
            e => {
                store.dispatch(formSubmittingSet(false));
                store.dispatch(globalMessageSetError(e));
            }
        );
    }

    /**
     * @param {String} fieldName
     * @return {Array}
     * */
    _getErrors(fieldName)
    {
        const {store} = this.props;
        const {formErrors} = store.getState();
        if (formErrors[fieldName] && formErrors[fieldName].length > 0) {
            return formErrors[fieldName];
        }

        return [];
    }

    /**
     * @param {String} fieldName
     * @return {Boolean}
     * */
    _hasError(fieldName)
    {
        return this._getErrors(fieldName).length > 0;
    }

    /**
     * @param {String} fieldName
     * @return {String|Component}
     * @private
     */
    _printInvalidFeedback(fieldName)
    {
        const pwdErrors = this._getErrors(fieldName);
        if (pwdErrors.length > 0) {
            return <div className="form-control-feedback">
                {pwdErrors.map((e, index) => <p key={index}>{e}</p>)}
            </div>
        }

        return '';
    }

    /**
     * @param {string} fieldName
     * @return {string}
     * @private
     */
    _getInputWrapperClassName(fieldName)
    {
        return this._hasError(fieldName) ? 'col has-danger' : 'col'
    }

    /**
     * @param {String} fieldName
     * @return {mixed}
     * @private
     */
    _getInputDefaultValue(fieldName)
    {
        const {store} = this.props;
        const {formProduct} = store.getState();
        if (null === formProduct) {
            return null;
        }

        const fieldValue = formProduct[fieldName];

        return fieldValue ? fieldValue : null;
    }

    render()
    {
        const {store} = this.props;
        const {formSubmitting} = store.getState();

        if (formSubmitting) {
            return <div>...Submitting...</div>
        }

        return <form name="Product" onSubmit={this.onSubmit} ref={e => this.formRef = e}>
            <div className="form-group">
                <div className="form-row">
                    <div className={this._getInputWrapperClassName('sku')}>
                        <input
                            type="text"
                            required
                            name="Product[sku]"
                            placeholder="Sku"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('sku')}
                        />
                        {this._printInvalidFeedback('sku')}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="form-row">
                    <div className={this._getInputWrapperClassName('price')}>
                        <input
                            type="number"
                            step="0.01"
                            required
                            name="Product[price]"
                            placeholder="Price"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('price')}
                        />
                        {this._printInvalidFeedback('price')}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="form-row">
                    <div className={this._getInputWrapperClassName('name')}>
                        <input
                            type="text"
                            required
                            name="Product[name]"
                            placeholder="Name"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('name')}
                        />
                        {this._printInvalidFeedback('name')}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="form-row">
                    <div className={this._getInputWrapperClassName('description')}>
                        <textarea
                            name="Product[description]"
                            placeholder="input product description"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('description')}
                        />
                        {this._printInvalidFeedback('description')}
                    </div>
                </div>
            </div>
            <div className="form-group text-center">
                <input
                    type="submit"
                    value="Add product"
                    className="btn btn-success"
                />
            </div>
        </form>
    }
};
