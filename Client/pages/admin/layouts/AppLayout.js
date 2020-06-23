import React, { useEffect, useState } from 'react'
import menus from '../assets/menus'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
    BrowserRouter as Router,
    NavLink,
    useLocation
} from 'react-router-dom'
import RouteLayout from './RouteLayout'
import { useAuthenticationStore, setAuthentication } from '../store/authStore'
import Logo from '../assets/images/logo.png'
import LogoSmall from '../assets/images/logo_small.png'
import { LogoutOutlined, LockOutlined } from '@ant-design/icons'
import defaultAvatar from '../assets/images/avatar.jpg'
import getApiInstance from '../api/generic-api'
import PopupChangePassword from '../components/PopupChangePassword'

const { Content, Footer, Sider, Header } = Layout
const { SubMenu } = Menu
const checkAdminRole = (authentication) => {
    if (!authentication || !authentication.userRoles) return false
    const isAdmin = authentication.userRoles.find(f => f.roleName == 'admin' || f.roleName == 'superadmin')
    if (isAdmin) {
        return true
    }
    return false
}
const AppMenu = props => {
    const [openKeys, setOpenKeys] = useState([''])
    const [selectKeys, setSelectKeys] = useState([''])
    const [isAdmin, setIsAdmin] = useState(false)
    let location = useLocation()
    const auth = useAuthenticationStore()
    useEffect(() => {
        setIsAdmin(checkAdminRole(auth))
    }, [auth])
    useEffect(() => {
        //current menu
        const current = menus.find(f => f.path == location.pathname)
        if (current) {
            setSelectKeys([current.menuId])
            const keys = getAllOpenKeys(current)
            setOpenKeys(keys)
        }
    }, [location])

    const menuSort = (a, b) => {
        if (a.order == b.order && a.name == b.name) return 0
        if (a.order < b.order) return -1
        else if (a.order > b.order) return 1
        if (a.name < b.name) return -1
        else if (a.name > b.name) return 1
    }

    const renderMenus = (id) => {
        const menuItem = menus.find(f => f.menuId == id && f.disable != true)
        if (!menuItem || (menuItem.adminOnly && !isAdmin)) return null
        const submenus = menus.filter(f => f.parentMenuId == id).sort(menuSort)

        return renderMenuItem(menuItem, submenus)
    }
    const renderMenuItem = (menu, submenus) => {
        return submenus && submenus.length ? (
            <SubMenu
                key={menu.menuId}
                title={
                    <span>
                        {menu.icon}
                        <span>{menu.name}</span>
                    </span>
                }
                onTitleClick={({ key }) => {
                    if (openKeys.includes(key)) {
                        setOpenKeys(openKeys.filter(f => f != key))
                    } else {
                        setOpenKeys([key])
                    }
                }}
            >
                {
                    submenus.map((item, index) => renderMenus(item.menuId))
                }
            </SubMenu>
        ) : <Menu.Item key={menu.menuId}>
                <NavLink to={menu.path}>
                    {menu.name}
                </NavLink>
            </Menu.Item>;
    }

    const getAllOpenKeys = current => {
        const getParentSub = (menu, keys) => {
            const parentSub = menus.find(f => f.menuId == menu.parentMenuId)
            if (parentSub) {
                keys.push(parentSub.menuId)
                return getParentSub(parentSub, keys)
            }
            return keys
        }

        return getParentSub(current, [])
    }

    const root = menus.find(f => f.isRoot)

    return (
        <Menu theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            openKeys={openKeys}
        >
            {
                menus.filter(f => f.parentMenuId == root.menuId)
                    .sort(menuSort)
                    .map(item => renderMenus(item.menuId))
            }
        </Menu>
    )
}

const AppLayout = ({ children }) => {
    const [broken, setBroken] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [visible, setVisible] = useState(false)

    const onOpen = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };
    const auth = useAuthenticationStore()
    const siderProps = broken ? { collapsedWidth: "0" } : { collapsible: true }

    const sigout = () => {
        getApiInstance('/account').signout().then(res => {
            if (res.successful) {
                location.reload()
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const menu = (
        <Menu>
            <Menu.Item
                key="0"
                icon={<LockOutlined />}
                onClick={onOpen}
            >Đổi mật khẩu</Menu.Item>
            <Menu.Divider />
            <Menu.Item
                key="1"
                icon={<LogoutOutlined />}
                onClick={sigout}
            >Đăng xuất</Menu.Item>
        </Menu>
    );

    return (
        <Router>
            <Layout>
                <Sider
                    breakpoint="md"
                    onCollapse={onCollapse}
                    collapsed={collapsed}
                    onBreakpoint={_broken => {
                        setBroken(_broken)
                    }}
                    {...siderProps}
                >
                    <div className="logo">
                        <a href="/">
                            <img src={collapsed ? LogoSmall : Logo}
                                className="logo-image"
                                alt="Something about me!" />
                        </a>
                    </div>
                    <AppMenu />
                </Sider>
                <Layout style={{
                    overflow: 'auto',
                    height: '100vh'
                }}>
                    <Header className="page-header">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a style={{ color: "unset" }}
                                onClick={e => e.preventDefault()}>
                                <Avatar src={auth && auth.avatar || defaultAvatar} />
                                <span style={{ color: "white", marginLeft: 8 }}>{auth && auth.fullName}</span>
                            </a>
                        </Dropdown>
                        <PopupChangePassword visible={visible} onClose={onClose} sigout={sigout} />
                    </Header>
                    <Content style={{ margin: '16px', minHeight: "unset" }}>
                        <RouteLayout />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>©{new Date().getFullYear()} Created by Duy Nguyễn</Footer>
                </Layout>
            </Layout>
        </Router>
    );
}
export default AppLayout
