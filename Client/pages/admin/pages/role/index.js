import React, { useEffect, useState, Fragment } from "react";
import "./style.scss";
import { CloseOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Table,
  Input,
  Button,
  notification,
  Modal,
  Popover
} from "antd";
import getApiInstance from "../../api/generic-api";
import { useRoleStore, removeRole, setRoles } from "../../store/roleStore";
import RolePopup from "./popup";

const { Column } = Table;
const { confirm } = Modal;
const getPopoverContent = services => {
  const result = (
    <div>
      {services &&
        services.map((service, index) => (
          <p key={index}>{service.serviceName}</p>
        ))}
    </div>
  );
  return result;
};
const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const Role = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [popovercontent, setPopovercontent] = useState(null);
  const [services, setServices] = useState(null);
  const state = useRoleStore();

  useEffect(() => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/User/UserRoleListAll",
        data: {
          Condition: ""
        }
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          setRoles(result);
        }
      })
      .catch(err => {
        console.error(err);
      });

    getApiInstance()
      .getWithQueryStringAuth({
        url: "/User/UserServiceListAll",
        data: {
          Condition: ""
        }
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          setServices(result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const dataSource =
    state &&
    state.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));

  const closePopup = () => {
    setSelectedRole(null);
    setPopupVisible(false);
  };

  const remove = role => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      content: role.roleName,
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        getApiInstance()
          .postWithFormAuth({
            url: "/User/UserServiceAddOrUpdate",
            data: {
              Id: role.id,
              IsDisable: true
            }
          })
          .then(res => {
            const { successful } = res;
            if (successful) {
              removeRole(role.id);
              openNotificationWithIcon("success", "Thành công!");
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
            />
            <Button
              type="primary"
              onClick={() => {
                setSelectedRole(null);
                setPopupVisible(true);
              }}
            >
              THÊM MỚI
            </Button>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Table
          dataSource={dataSource}
          pagination={{
            pageSize: 10
          }}
          rowClassName="custom-row"
          onRow={record => ({
            onClick: () => {
              setSelectedRole(record);
              setPopupVisible(true);
            }
          })}
          style={{ width: "100%" }}
        >
          <Column title="#" dataIndex="index" key="index" />
          <Column title="Tên" dataIndex="roleName" key="roleName" />
          <Column
            title="Mô tả"
            dataIndex="roleDescription"
            key="roleDescription"
          />
          <Column title="Cấp bậc" dataIndex="roleLevel" key="roleLevel" />
          <Column
            title="Dịch vụ đã gán"
            dataIndex="services"
            key="services"
            render={(text, record) => (
              <Popover
                content={popovercontent}
                title="Danh sách dịch vụ"
                trigger="click"
              >
                <Button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPopovercontent(getPopoverContent(record.services));
                  }}
                >
                  {record.services.length} Dịch vụ
                </Button>
              </Popover>
            )}
          />
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
      <RolePopup
        onClose={closePopup}
        visible={popupVisible}
        role={selectedRole}
        services={services}
      />
    </Fragment>
  );
};

export default Role;
