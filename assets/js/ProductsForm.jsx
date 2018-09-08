import React, {Component} from "react";
import { forms, buttons } from 'bootstrap-css'

export default class ProductsForm extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            product: null,
            errors: {},
            submitting: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this._getErrors = this._getErrors.bind(this);
        this._hasError = this._hasError.bind(this);
        this._printInvalidFeedback = this._printInvalidFeedback.bind(this);
        this._getInputWrapperClassName = this._getInputWrapperClassName.bind(this);
        this._getInputDefaultValue = this._getInputDefaultValue.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps)
    {
        this.setState({errors: {}, submitting: false});
    }

    onSubmit(e)
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        this.setState(
            {
                product: {
                    'sku': formData.get('Product[sku]'),
                    'price': formData.get('Product[price]'),
                    'name': formData.get('Product[name]'),
                    'description': formData.get('Product[description]'),
                },
                submitting: true
            }
        );
        this.props.apiClient.addProduct(formData).then(
            data => {
                if (data.success) {
                    return this.props.updateProducts(data.successMessage);
                }

                const newState = {submitting: false};
                if (data.errors) {
                    newState.errors = data.errors;
                }

                this.setState(newState);
            },
            e => this.props.setErrorAlert(e)
        );
    }

    /**
     * @param {String} fieldName
     * @return {Boolean}
     * */
    _getErrors(fieldName)
    {
        const errors = this.state.errors;
        if (errors[fieldName] && errors[fieldName].length > 0) {
            return errors[fieldName];
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
        if (null === this.state.product) {
            return null;
        }

        const fieldValue = this.state.product[fieldName];

        return fieldValue ? fieldValue : null;
    }

    render()
    {
        if (this.state.submitting) {
            return <div>...Submitting...</div>
        }

        return <form name="Product" onSubmit={this.onSubmit}>
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
