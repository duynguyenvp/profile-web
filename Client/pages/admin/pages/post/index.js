import React, { useEffect, useState, Fragment } from "react";
import "./style.scss";
import { CloseOutlined, EyeFilled, LoadingOutlined } from "@ant-design/icons";
import { Row, Col, Table, Input, Button, notification, Modal } from "antd";
import getApiInstance from "../../api/generic-api";
import { usePostStore, removePost, setPosts } from "../../store/postStore";
import PostPopup from "./popup";
import { getAuthentication } from "../../store/authStore";

const { Column } = Table;
const { confirm } = Modal;

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const Post = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterText, setFilterText] = useState(null);
  const auth = getAuthentication();
  const state = usePostStore();
  const { take, page, data, total } = state;
  useEffect(() => {
    loadData(auth);
  }, [auth && auth.id, take, page]);

  const loadData = auth => {
    if (!auth || !auth.id) return;
    getApiInstance()
      .postWithForm({
        url: "/Post/GetAll",
        data: {
          Take: take,
          Skip: (page - 1) * take,
          UserId: auth.id
        }
      })
      .then(res => {
        const { successful, result } = res;
        if (successful) {
          if (!result) return;
          const { total, data } = result;
          setPosts({ ...state, total, data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const search = () => {
    if (filterText.length < 3) return;
    setIsSearching(true);
    getApiInstance()
      .postWithForm({
        url: "/Post/FullTextSearch",
        data: {
          Condition: filterText,
          Username: auth && auth.username
        }
      })
      .then(res => {
        setIsSearching(false);
        const { successful, result } = res;
        if (successful) {
          if (!result) return;
          const { total, data } = result;
          setPosts({ ...state, total, data });
        }
      })
      .catch(err => {
        setIsSearching(false);
        console.error(err);
      });
  };

  const dataSource =
    data &&
    data.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));
  const closePopup = () => {
    setSelectedPost(null);
    setPopupVisible(false);
  };

  const remove = post => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      content: post.postName,
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        getApiInstance()
          .deleteWithFormAuth({
            url: "/Post/DeletePost",
            data: {
              postId: post.id
            }
          })
          .then(res => {
            const { successful } = res;
            if (successful) {
              openNotificationWithIcon("success", "Thành công.");
              removePost(post.id);
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

  const handleFilterChange = e => {
    const { value } = e.target;
    if (!value && auth) {
      loadData(auth);
    }
    setFilterText(value);
  };

  return (
    <Fragment>
      <Row>
        <Col span={12}>
          <h1>QUẢN TRỊ BÀI VIẾT</h1>
        </Col>
        <Col span={12}>
          <Row type="flex" style={{ flexDirection: "row" }}>
            <Input
              disabled={isSearching}
              prefix={isSearching ? <LoadingOutlined /> : null}
              placeholder="Nhập từ khoá tìm kiếm"
              style={{ flex: 1, marginRight: 16 }}
              value={filterText || ""}
              onChange={handleFilterChange}
              allowClear
              onPressEnter={search}
            />
            <Button
              type="primary"
              onClick={() => {
                setSelectedPost(null);
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
            onChange: nextPage => {
              setPosts({ ...state, page: nextPage });
            },
            pageSize: 10,
            total
          }}
          rowClassName="custom-row"
          onRow={record => ({
            onClick: () => {
              setSelectedPost(record);
              setPopupVisible(true);
            }
          })}
          style={{ width: "100%" }}
        >
          <Column
            title="#"
            dataIndex="index"
            key="index"
            responsive={["xxl", "xl", "lg", "md", "sm"]}
          />
          <Column
            title="Tiêu đề"
            dataIndex="title"
            key="title"
            responsive={["xxl", "xl", "lg", "md", "sm", "xs"]}
          />
          <Column
            title="Tags"
            dataIndex="tag"
            key="tag"
            responsive={["xxl", "xl", "lg", "md"]}
          />
          <Column
            title="Ngày đăng"
            dataIndex="postTime"
            key="postTime"
            responsive={["xxl", "xl", "lg", "md"]}
          />
          <Column
            title=""
            key="action"
            width={158}
            responsive={["xxl", "xl", "lg", "md", "sm", "xs"]}
            render={(text, record) => (
              <>
                <a href={record.postUrl} target="_blank" rel="noreferrer">
                  <Button
                    className="btn-preview"
                    size="small"
                    type="info"
                    icon={<EyeFilled />}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    Xem thử
                  </Button>
                </a>
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
              </>
            )}
          />
        </Table>
      </Row>
      <PostPopup
        onClose={closePopup}
        visible={popupVisible}
        post={selectedPost}
        callback={() => {
          loadData(auth);
        }}
      />
    </Fragment>
  );
};

export default Post;
