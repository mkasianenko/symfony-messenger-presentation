import React, {Component} from "react";

class User extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            removing: false,
            user: this.props.user,
            view: this.props.view
        };
        this._deleteUser = this._deleteUser.bind(this);
    }

    _deleteUser()
    {
        this.setState({removing: true});
        const self = this;
        this.props.apiClient.removeUser(this.state.user.id)
            .then(
                res => self.props.updateUsers(),
                e => {
                    console.warn(e);
                    self.setState({removing: false})
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
                <td>{this.state.user.email}</td>
                <td>{this.state.user.password}</td>
                <td><button onClick={this._deleteUser}>Delete</button></td>
            </tr>;
        }

        if (this.state.removing) {
            return <div><p>...Removing...</p></div>;
        }

        return (
            <div>
                <p>{this.state.user.email}</p>
                <p>{this.state.user.password}</p>
                <p><button onClick={this._deleteUser}>Delete</button></p>
            </div>
        );
    }
}

export default User;