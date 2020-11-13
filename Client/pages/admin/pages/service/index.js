import React, { useEffect, useState, Fragment } from "react";
import "./style.scss";
import { CloseOutlined } from "@ant-design/icons";
import {
  Row, Col, Table, Input, Button, notification, Modal
} from "antd";
import getApiInstance from "../../api/generic-api";
import {
  useServiceStore,
  removeService,
  setServices
} from "../../store/serviceStore";
import ServicePopup from "./popup";

const { Column } = Table;
const { confirm } = Modal;
const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const Service = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const state = useServiceStore();

  useEffect(() => {
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

  const dataSource = state
    && state.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));

  const closePopup = () => {
    setSelectedService(null);
    setPopupVisible(false);
  };

  const remove = service => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      content: service.serviceName,
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        getApiInstance()
          .postWithFormAuth({
            url: "/User/UserServiceAddOrUpdate",
            data: {
              Id: service.id,
              IsDisable: true
            }
          })
          .then(res => {
            const { successful } = res;
            if (successful) {
              removeService(service.id);
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
                setSelectedService(null);
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
              setSelectedService(record);
              setPopupVisible(true);
            }
          })}
          style={{ width: "100%" }}
        >
          <Column title="#" dataIndex="index" key="index" />
          <Column title="Tên" dataIndex="serviceName" key="serviceName" />
          <Column
            title="Mô tả"
            dataIndex="serviceDescription"
            key="serviceDescription"
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
      <ServicePopup
        onClose={closePopup}
        visible={popupVisible}
        service={selectedService}
      />
    </Fragment>
  );
};

export default Service;
