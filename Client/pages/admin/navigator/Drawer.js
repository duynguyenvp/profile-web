import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { checkAdminRole, subscribe } from '../../../services/userService'
import { RComponent } from '../../../common/r-component';

class Drawer extends RComponent {
    constructor(props) {
        super(props);
        this.onMount(() => {
            this.onUnmount(subscribe(() => this.forceUpdate()))
        })
    }

    render() {
        const { active } = this.props
        const isAdmin = checkAdminRole()
        return (
            <div className={`drawer ${active ? 'active' : ''}`}>
                <NavLink exact to={"/quan-tri"}
                    className="menu-link"
                    activeClassName="active"
                >
                    <i className="material-icons">face</i>
                    Resume
                </NavLink >
                <NavLink exact to={"/quan-tri/blog-post"}
                    className="menu-link"
                    activeClassName="active"
                >
                    <i className="material-icons">note_add</i>
                    Bài đăng
                </NavLink >
                {isAdmin && <Fragment>
                    <NavLink exact to={"/quan-tri/user"}
                        className="menu-link"
                        activeClassName="active"
                    >
                        <i className="material-icons">supervisor_account</i>
                        Danh sách người dùng
                </NavLink >
                    <NavLink exact to={"/quan-tri/services"}
                        className="menu-link"
                        activeClassName="active"
                    >
                        <i className="material-icons">layers</i>
                        Danh sách dịch vụ
                </NavLink >
                    <NavLink exact to={"/quan-tri/roles"}
                        className="menu-link"
                        activeClassName="active"
                    >
                        <i className="material-icons">device_hub</i>
                        Danh sách quyền
                </NavLink >
                    <NavLink exact to={"/quan-tri/contact"}
                        className="menu-link"
                        activeClassName="active"
                    >
                        <i className="material-icons">feedback</i>
                        Liên hệ & Góp ý
                </NavLink >
                </Fragment>}
            </div>
        );
    }
}

export default Drawer;