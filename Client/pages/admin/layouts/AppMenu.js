import React, { Fragment, useEffect, useState } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore";
import menus from "../assets/menus";

const { SubMenu } = Menu;

const checkAdminRole = authentication => {
  if (!authentication || !authentication.userRoles) return false;
  const isAdmin = authentication.userRoles.find(
    f => f.roleName === "admin" || f.roleName === "superadmin"
  );
  if (isAdmin) {
    return true;
  }
  return false;
};

const AppMenu = () => {
  const [openKeys, setOpenKeys] = useState([""]);
  const [selectKeys, setSelectKeys] = useState([""]);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const auth = useAuthenticationStore();
  useEffect(() => {
    setIsAdmin(checkAdminRole(auth));
  }, [auth]);
  useEffect(() => {
    const current = menus.find(f => f.path === location.pathname);
    if (current) {
      setSelectKeys([current.menuId]);
      const keys = getAllOpenKeys(current);
      setOpenKeys(keys);
    }
  }, [location]);

  const menuSort = (a, b) => {
    if (a.order === b.order && a.name === b.name) return 0;
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };

  const renderMenus = id => {
    const menuItem = menus.find(f => f.menuId === id && f.disable !== true);
    if (!menuItem || (menuItem.adminOnly && !isAdmin)) return null;
    const submenus = menus.filter(f => f.parentMenuId === id).sort(menuSort);

    return renderMenuItem(menuItem, submenus);
  };
  const renderMenuItem = (menu, submenus) => (
    <Fragment key={menu.menuId}>
      {submenus && submenus.length ? (
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
              setOpenKeys(openKeys.filter(f => f !== key));
            } else {
              setOpenKeys([key]);
            }
          }}
        >
          {submenus.map(item => renderMenus(item.menuId))}
        </SubMenu>
      ) : (
        <Menu.Item key={menu.menuId}>
          <NavLink to={menu.path}>{menu.name}</NavLink>
        </Menu.Item>
      )}
    </Fragment>
  );

  const getAllOpenKeys = current => {
    const getParentSub = (menu, keys) => {
      const parentSub = menus.find(f => f.menuId === menu.parentMenuId);
      if (parentSub) {
        keys.push(parentSub.menuId);
        return getParentSub(parentSub, keys);
      }
      return keys;
    };

    return getParentSub(current, []);
  };

  const root = menus.find(f => f.isRoot);

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectKeys}
      openKeys={openKeys}
    >
      {menus
        .filter(f => f.parentMenuId === root.menuId)
        .sort(menuSort)
        .map(item => renderMenus(item.menuId))}
    </Menu>
  );
};

export default AppMenu;
