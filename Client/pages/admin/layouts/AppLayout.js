import React, { useMemo, useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import {
  LogoutOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import RouteLayout from "./RouteLayout";
import { useAuthenticationStore } from "../store/authStore";
import Logo from "../assets/images/logo.png";
import LogoSmall from "../assets/images/logo_small.png";
import defaultAvatar from "../assets/images/avatar.jpg";
import getApiInstance from "../api/generic-api";
import PopupChangePassword from "../components/PopupChangePassword";
import AppMenu from "./AppMenu";

const { Content, Footer, Sider, Header } = Layout;

const AppLayout = () => {
  const [broken, setBroken] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onCollapseToggle = () => {
    setCollapsed(collapsed => !collapsed);
  };
  const auth = useAuthenticationStore();

  const sigout = () => {
    getApiInstance("/account")
      .signout()
      .then(res => {
        if (res.successful) {
          window.location.reload();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<LockOutlined />} onClick={onOpen}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={sigout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const isRenderUserInfo = useMemo(() => {
    if (!broken) return true;
    return collapsed;
  }, [collapsed, broken]);

  return (
    <Router>
      <Layout>
        <Sider
          breakpoint="sm"
          onBreakpoint={_broken => {
            if (broken !== _broken && _broken) {
              setCollapsed(true);
            }
            setBroken(_broken);
          }}
          trigger={null}
          collapsible
          collapsedWidth={broken ? 0 : 80}
          collapsed={collapsed}
        >
          <div className="logo">
            <a href="/">
              <img
                src={collapsed ? LogoSmall : Logo}
                className="logo-image"
                alt="Something about me!"
              />
            </a>
          </div>
          <AppMenu />
        </Sider>
        <Layout
          style={{
            overflow: "auto",
            height: "100vh"
          }}
        >
          <Header className="page-header">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: onCollapseToggle
              }
            )}
            {isRenderUserInfo && (
              <>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    href="#"
                    style={{ color: "unset" }}
                    onClick={e => e.preventDefault()}
                  >
                    <Avatar src={(auth && auth.avatar) || defaultAvatar} />
                    <span style={{ color: "white", marginLeft: 8 }}>
                      {auth && auth.fullName}
                    </span>
                  </a>
                </Dropdown>
                <PopupChangePassword
                  visible={visible}
                  onClose={onClose}
                  sigout={sigout}
                />
              </>
            )}
          </Header>
          <Content style={{ margin: "16px", minHeight: "unset" }}>
            <RouteLayout />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            ©{new Date().getFullYear()} Created by Duy Nguyễn
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};
export default AppLayout;
