import React, { useEffect, Fragment } from "react";
import "./style.scss";
import { CloseOutlined, EyeFilled } from "@ant-design/icons";
import {
  Row, Col, Table, Input, Button, notification, Modal
} from "antd";
import getApiInstance from "../../api/generic-api";
import {
  useFeedbackStore,
  removeFeedback,
  setFeedbacks
} from "../../store/feedbackStore";

const { Column } = Table;
const { confirm } = Modal;

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const Feedback = () => {
  const state = useFeedbackStore();

  useEffect(() => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/Home"
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          setFeedbacks(result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  const dataSource = state
    && state.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));

  const view = feedback => {
    Modal.info({
      title: "Nội dung liên hệ",
      content: <p>{feedback.message}</p>,
      onOk() {}
    });
  };

  const remove = feedback => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      content: feedback.feedbackName,
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        getApiInstance()
          .deleteWithFormAuth({
            url: "/Home",
            data: {
              id: feedback.id
            }
          })
          .then(res => {
            const { successful } = res;
            if (successful) {
              removeFeedback(feedback.id);
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
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Table
          dataSource={dataSource}
          pagination={{
            pageSize: 10
          }}
          rowClassName="feedback-custom-row"
          style={{ width: "100%" }}
        >
          <Column title="#" dataIndex="index" key="index" />
          <Column title="Người gửi" dataIndex="email" key="email" />
          <Column title="Nội dung" dataIndex="message" key="message" />
          <Column title="Ngày gửi" dataIndex="createdDate" key="createdDate" />
          <Column
            title=""
            key="action"
            width={120}
            render={(text, record) => (
              <Fragment>
                <Button
                  className="btn-remove"
                  size="small"
                  icon={<EyeFilled />}
                  type="primary"
                  onClick={e => {
                    e.stopPropagation();
                    view(record);
                  }}
                />
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
              </Fragment>
            )}
          />
        </Table>
      </Row>
    </Fragment>
  );
};

export default Feedback;
