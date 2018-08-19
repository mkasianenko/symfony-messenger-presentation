import React, {Component} from "react";
import UsersTable from './UsersTable';
import UserForm from './UserForm';

class App extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            'users': [],
            'usersLoading': true
        };
        this.updateUsers = this.updateUsers.bind(this);
        this._renderUsers = this._renderUsers.bind(this);
    }

    updateUsers()
    {
        this.setState({'usersLoading': true});
        const self = this;
        this.props.apiClient.getUsers().then(users => {
            self.setState({'users': users, 'usersLoading': false});
        });
    }

    componentWillMount()
    {
        this.updateUsers();
    }

    _renderUsers()
    {
        if (this.state.usersLoading) {
            return <div className='t-a-center'>...Loading users...</div>
        }

        return <UsersTable
            users={this.state.users}
            apiClient={this.props.apiClient}
            updateUsers={this.updateUsers}
        />
    }

    render() {
        return (
            <div className="Users">
                <div className="Users__left">
                    <h3 className="Users__title t-a-center">Users list widget</h3>
                    {this._renderUsers()}
                </div>
                <div className="Users__right">
                    <h3 className="Users__title t-a-center">Users form</h3>
                    <div className="User__form">
                        <UserForm
                            updateUsers={this.updateUsers}
                            apiClient={this.props.apiClient}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;