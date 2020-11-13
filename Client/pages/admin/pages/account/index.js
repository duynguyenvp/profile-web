import React, { useEffect, useState, Fragment } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Row, Col, Table, Input, Button, notification, Modal } from "antd";
import getApiInstance from "../../api/generic-api";
import {
  useAccountStore,
  setAccounts,
  removeAccount
} from "../../store/accountStore";
import "./style.scss";
import AccountPopup from "./popup";

const { Column } = Table;
const { confirm } = Modal;

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const User = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dataRoles, setDataRoles] = useState(null);
  const [filterText, setFilterText] = useState(null);
  const state = useAccountStore();
  const { take, page, total, data } = state;
  useEffect(() => {
    LoadData();
    LoadRoleData();
  }, []);

  const LoadData = () => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/User/UserListAll",
        data: {
          Take: take,
          Skip: (page - 1) * take,
          Condition: filterText // TODO: filter
        }
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          const { total, data } = result;
          setAccounts({ ...state, total, data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const LoadRoleData = () => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/User/UserRoleListAll"
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          setDataRoles(result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const dataSource =
    data &&
    data.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));

  const closePopup = () => {
    setSelectedAccount(null);
    setPopupVisible(false);
  };

  const remove = account => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      content: account.name,
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        getApiInstance()
          .deleteWithFormAuth({
            url: "/User/DeleteUser",
            data: {
              userId: account.id
            }
          })
          .then(res => {
            const { successful } = res;
            if (successful) {
              removeAccount(account.id);
              openNotificationWithIcon("success", "Xóa thành công!");
            }
          })
          .catch(error => {
            console.error(error);
            openNotificationWithIcon("error", error);
          });
      },
      onCancel() {
        console.error("Cancel");
      }
    });
  };

  return (
    <Fragment>
      <Row>
        <Col span={12}>
          <h1>QUẢN TRỊ TÀI KHOẢN</h1>
        </Col>
        <Col span={12}>
          <Row type="flex" style={{ flexDirection: "row" }}>
            <Input
              placeholder="Nhập từ khoá tìm kiếm"
              style={{ flex: 1, marginRight: 16 }}
              value={filterText || ""}
              onChange={e => {
                setFilterText(e.target.value);
              }}
              onPressEnter={LoadData}
            />
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Table
          dataSource={dataSource}
          pagination={{
            current: page,
            pageSize: take,
            total,
            responsive: true
          }}
          onRow={record => ({
            onClick: () => {
              setSelectedAccount(record);
              setPopupVisible(true);
            }
          })}
          rowClassName="custom-row"
          style={{ width: "100%" }}
          onChange={_page => {
            setAccounts({ ...state, page: _page });
            LoadData();
          }}
        >
          <Column title="#" dataIndex="index" key="index" />
          <Column title="Tài khoản" dataIndex="username" key="username" />
          <Column title="Tên" dataIndex="name" key="name" />
          <Column
            title="Giới tính"
            key="gender"
            dataIndex="gender"
            render={gender => {
              if (gender === 0) return <span>Nam</span>;
              if (gender === 1) return <span>Nữ</span>;
              return <span />;
            }}
          />
          <Column title="Ngày sinh" dataIndex="birthday" key="birthday" />
          <Column title="Điện thoại" dataIndex="phone" key="phone" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column
            title=""
            key="action"
            width={56}
            render={(text, record) => (
              <Button
                className="btn-remove"
                size="small"
                type="danger"
                icon={<CloseOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  remove(record);
                }}
              />
            )}
          />
        </Table>
      </Row>
      <AccountPopup
        onClose={closePopup}
        visible={popupVisible}
        account={selectedAccount}
        dataRoles={dataRoles}
      />
    </Fragment>
  );
};

export default User;
