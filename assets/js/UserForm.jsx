import React, {Component} from "react";

class UserForm extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            errors: {},
            submitting: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this._getErrors = this._getErrors.bind(this);
        this._hasError = this._hasError.bind(this);
        this._printErrorsHint = this._printErrorsHint.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps)
    {
        this.setState({errors: {}, submitting: false});
    }

    onSubmit(e)
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        this.setState({submitting: true});
        this.props.apiClient.addUser(formData).then(
            data => {
                if (data.success) {
                    return this.props.updateUsers();
                }

                if (data.errors) {
                    this.setState({errors: data.errors, submitting: false})
                }
            },
            e => console.warn(e)
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
    _printErrorsHint(fieldName)
    {
        const pwdErrors = this._getErrors(fieldName);
        if (pwdErrors.length > 0) {
            return <div>
                {pwdErrors.map((e, index) => <p key={index}>{e}</p>)}
            </div>
        }

        return '';
    }

    render()
    {
        if (this.state.submitting) {
            return <div>...Submitting...</div>
        }

        return <form name="User" onSubmit={this.onSubmit}>
            <label>Email</label>
            <div className={this._hasError('email') ? 'Has_error' : 'No_error'}>
                {this._printErrorsHint('email')}
            </div>
            <input
                type="email"
                name="User[email]"
                className={this._hasError('email') ? 'Has_error' : ''}
            />
            <label>Password</label>
            <div className={this._hasError('password') ? 'Has_error' : 'No_error'}>
                {this._printErrorsHint('password')}
            </div>
            <input
                type="password"
                name="User[password]"
                className={this._hasError('password') ? 'Has_error' : ''}
            />
            <input type="submit" value="Add user"/>
        </form>
    }
};

export default UserForm;