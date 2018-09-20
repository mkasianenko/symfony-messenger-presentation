import React, {Component} from "react";
import { alert } from "bootstrap-css";

import {
    globalMessageSetSuccess,
    globalMessageSetError
} from '../actions/actions';

export default class HeaderAlert extends Component {

    constructor(props)
    {
        super(props);
        this._onDismiss = this._onDismiss.bind(this);
    }

    _onDismiss()
    {
        const {store} = this.props;
        const { globalErrorMessage, globalSuccessMessage } = store.getState();

        if (null !== globalErrorMessage) {
            return store.dispatch(globalMessageSetError(null));
        }

        if (null !== globalSuccessMessage) {
            return store.dispatch(globalMessageSetSuccess(null));
        }
    }

    render() {
        const {store} = this.props;
        const { globalErrorMessage, globalSuccessMessage } = store.getState();

        let className = `alert alert-dismissible fade show`;
        let message = null;

        if (null !== globalErrorMessage) {
            className += ' alert-danger';
            message = 'object' === typeof globalErrorMessage ? globalErrorMessage.message : globalErrorMessage;
        }

        if (null !== globalSuccessMessage) {
            className += ' alert-success';
            message = 'object' === typeof globalSuccessMessage ? globalSuccessMessage.message : globalSuccessMessage;
        }

        if (null !== message) {
            return <div className={className} role="alert">
                {message}
                <button onClick={this._onDismiss} type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>;
        }

        return '';
    }
};
