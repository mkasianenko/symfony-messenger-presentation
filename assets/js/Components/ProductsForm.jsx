import React, {Component} from 'react';
import { forms, buttons } from 'bootstrap-css';

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
        this._getInputWrapperErrorClass = this._getInputWrapperErrorClass.bind(this);
        this._getInputDefaultValue = this._getInputDefaultValue.bind(this);
        this._resetInputs = this._resetInputs.bind(this);
        this._attemptLoadProduct = this._attemptLoadProduct.bind(this);

        this.skuInputRef = React.createRef();
        this.priceInputRef = React.createRef();
        this.nameInputRef = React.createRef();
        this.descriptionInputRef = React.createRef();
    }

    onSubmit(e)
    {
        e.preventDefault();
        const {store, apiClient, apiClientAction, formId} = this.props;
        const formData = new URLSearchParams(new FormData(e.target));

        store.dispatch(formSubmittingSet(formId));
        store.dispatch(formProductSet(formId, {
            'sku': formData.get('Product[sku]'),
            'price': formData.get('Product[price]'),
            'name': formData.get('Product[name]'),
            'description': formData.get('Product[description]'),
        }));

        apiClient[apiClientAction](formData, formId).then(
            data => {
                store.dispatch(formSubmittingSet(null));
                if (data.success) {
                    this._resetInputs();
                    store.dispatch(formProductSet(formId, null));
                    store.dispatch(formErrorsSet(formId, {}));
                    if (data.successMessage) {
                        store.dispatch(globalMessageSetSuccess(data.successMessage));
                    }

                    if (data.id) {
                        return this._attemptLoadProduct(data.id);
                    }
                }

                if (data.errors) {
                    store.dispatch(formErrorsSet(formId, data.errors));
                }
            },
            e => {
                store.dispatch(formSubmittingSet(null));
                store.dispatch(globalMessageSetError(e));
            }
        );
    }

    /**
     * @param {string} id
     * @param {number} timeoutSeconds
     * @param {number} attempts
     * @param {number} increment
     * @private
     */
    _attemptLoadProduct(id, timeoutSeconds = 1, attempts = 5, increment = 5)
    {
        const {store, apiClient, productAction} = this.props;
        let attemptNum = 0;
        let finished = false;
        let timeout = timeoutSeconds;

        const loader = () => {
            attemptNum++;
            timeout = attemptNum > 1 ? timeout + increment : timeout;
            console.log(
                `trying to load added product with id #${id}, attempt #${attemptNum}, timeoutSeconds #${timeout}`
            );
            if (finished || attemptNum > attempts) {
                return;
            }

            setTimeout(() => {
                apiClient.getProduct(id).then(
                    product => {
                        finished = true;
                        store.dispatch(productAction(product));
                    },
                    e => {
                        console.log(e);
                        loader();
                    }
                );
            }, timeout * 1000);
        };

        loader();
    }

    _resetInputs()
    {
        this.skuInputRef.current.value = null;
        this.priceInputRef.current.value = null;
        this.nameInputRef.current.value = null;
        this.descriptionInputRef.current.value = null;
    }

    /**
     * @param {String} fieldName
     * @return {Array}
     * */
    _getErrors(fieldName)
    {
        const {store} = this.props;
        const {formErrors} = store.getState();
        const {formId, errors} = formErrors;

        if (formId !== this.props.formId || null === errors) {
            return [];
        }

        if (errors[fieldName] && errors[fieldName].length > 0) {
            return errors[fieldName];
        }

        return [];
    }

    /**
     * @param {String|Array} fieldName
     * @return {Boolean}
     * */
    _hasError(fieldName)
    {
        if ('object' === typeof fieldName && fieldName.length) {
            const self = this;
            return fieldName.filter(name => false !== self._hasError(name)).length > 0;
        }

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
     * @param {string|Array} fieldName
     * @return {string}
     * @private
     */
    _getInputWrapperErrorClass(fieldName)
    {
        return this._hasError(fieldName) ? 'has-danger' : '';
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

        const {formId, product} = formProduct;
        if (formId !== this.props.formId) {
            return null;
        }

        if (null === product) {
            return null;
        }

        const fieldValue = product[fieldName];

        return fieldValue ? fieldValue : null;
    }

    render()
    {
        const {store, view, submitText} = this.props;
        const {submittingFormId} = store.getState();

        if (submittingFormId === this.props.formId) {
            return <div className="text-center"><h3>...Submitting form...</h3></div>
        }

        if ('full' === view) {
            return <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <div className="form-row">
                        <div className={'col ' + this._getInputWrapperErrorClass('sku')}>
                            <input
                                type="text"
                                required
                                name="Product[sku]"
                                placeholder="Sku"
                                className="form-control"
                                defaultValue={this._getInputDefaultValue('sku')}
                                ref={this.skuInputRef}
                            />
                            {this._printInvalidFeedback('sku')}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <div className={'col ' +  this._getInputWrapperErrorClass('price')}>
                            <input
                                type="number"
                                step="0.01"
                                required
                                name="Product[price]"
                                placeholder="Price"
                                className="form-control"
                                defaultValue={this._getInputDefaultValue('price')}
                                ref={this.priceInputRef}
                            />
                            {this._printInvalidFeedback('price')}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <div className={'col ' + this._getInputWrapperErrorClass('name')}>
                            <input
                                type="text"
                                required
                                name="Product[name]"
                                placeholder="Name"
                                className="form-control"
                                defaultValue={this._getInputDefaultValue('name')}
                                ref={this.nameInputRef}
                            />
                            {this._printInvalidFeedback('name')}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <div className={'col ' + this._getInputWrapperErrorClass('description')}>
                            <textarea
                                name="Product[description]"
                                placeholder="Description"
                                className="form-control"
                                defaultValue={this._getInputDefaultValue('description')}
                                ref={this.descriptionInputRef}
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

        if ('td' === view) {
            return <div>
                <form className="row edit-items" onSubmit={this.onSubmit}>
                    <div className={'edit-item ' + this._getInputWrapperErrorClass('sku')}>
                        <input
                            type="text"
                            required
                            name="Product[sku]"
                            placeholder="Sku"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('sku')}
                            ref={this.skuInputRef}
                        />
                    </div>
                    <div className={'edit-item ' + this._getInputWrapperErrorClass('price')}>
                        <input
                            type="number"
                            step="0.01"
                            required
                            name="Product[price]"
                            placeholder="Price"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('price')}
                            ref={this.priceInputRef}
                        />
                    </div>
                    <div className={'edit-item ' + this._getInputWrapperErrorClass('name')}>
                        <input
                            type="text"
                            required
                            name="Product[name]"
                            placeholder="Name"
                            className="form-control"
                            defaultValue={this._getInputDefaultValue('name')}
                            ref={this.nameInputRef}
                        />
                    </div>
                    <div className={'edit-item ' + this._getInputWrapperErrorClass('description')}>
                    <textarea
                        name="Product[description]"
                        placeholder="Description"
                        className="form-control"
                        defaultValue={this._getInputDefaultValue('description')}
                        ref={this.descriptionInputRef}
                    />
                    </div>
                    <div className="edit-item ">
                        <input
                            type="submit"
                            value={submitText}
                            className="btn btn-sm btn-success"
                        />
                    </div>
                </form>
                <div className={"col-md-12 " + this._getInputWrapperErrorClass(['sku', 'price', 'name', 'description'])}>
                    {this._printInvalidFeedback('sku')}
                    {this._printInvalidFeedback('price')}
                    {this._printInvalidFeedback('name')}
                    {this._printInvalidFeedback('description')}
                </div>
            </div>;
        }

        throw new Error(`ProductForm view #${view} not supported`);
    }
};
