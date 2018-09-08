import React, {Component} from "react";
import { alert } from "bootstrap-css";

export default class HeaderAlert extends Component {

    constructor(props)
    {
        super(props);
        this._onDismiss = this._onDismiss.bind(this);
    }

    _onDismiss()
    {
        this.props.setAlert(null);
    }

    render() {
        if (!this.props.message) {
            return '';
        }

        let className = `alert ${this.props.alertClass} alert-dismissible fade show`;

        return <div className={className} role="alert">
            {this.props.message}
            <button onClick={this._onDismiss} type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>;
    }
};
