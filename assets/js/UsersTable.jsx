import React, {Component} from "react";
import User from './User';

class UsersTable extends Component {

    render() {
        return (
            <table className="Users__table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.users.map(
                        (user, index) => {
                            return <User
                                key={index}
                                user={user}
                                view='tr'
                                updateUsers={this.props.updateUsers}
                                apiClient={this.props.apiClient}
                            />
                        }
                    )}
                </tbody>
            </table>
        );
    }
};

export default UsersTable;