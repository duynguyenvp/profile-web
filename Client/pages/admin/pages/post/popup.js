import React, { useState, useLayoutEffect } from "react";
import { Drawer, Button, Layout } from "antd";
import PostForm from "./editor/PostForm";
import EditorContent from "./editor/EditorContent";

const { Sider } = Layout;

const PostPopup = ({
  visible, onClose, post, callback
}) => {
  const [content, setContent] = useState(() => "");
  const [delta, setDelta] = useState(() => null);
  const [isMobile, setIsMobile] = useState(false);
  const [visiblePostForm, setVisiblePostForm] = useState(() => false);
  useLayoutEffect(() => {
    const x = window.matchMedia("(max-width: 768px)");
    if (x.matches) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  });

  const onClosePostForm = () => {
    setVisiblePostForm(false);
  };
  const onOpenPostForm = () => {
    setVisiblePostForm(true);
  };

  return (
    <Drawer
      title={`${
        post && Object.keys(post) ? "Chỉnh sửa bài viết" : "Viết bài mới"
      }`}
      className="post-popup"
      closable
      width="100%"
      onClose={onClose}
      visible={visible}
      destroyOnClose
      keyboard={false}
      bodyStyle={{ padding: 0 }}
    >
      <Layout className="editor-layout">
        <EditorContent
          post={post}
          callback={({ content, delta }) => {
            setContent(content);
            setDelta(delta);
          }}
        />
        {!isMobile && (
          <Sider width={350} className="editor-right-side">
            <PostForm
              onClose={onClose}
              post={post}
              content={content}
              delta={delta}
              callback={callback}
            />
          </Sider>
        )}
      </Layout>
      {isMobile && (
        <>
          {visiblePostForm && (
            <div
              className="editor-postform-mobile-overlay"
              onClick={onClosePostForm}
            />
          )}
          <div
            className={`editor-postform-mobile ${
              visiblePostForm ? "active" : ""
            }`}
          >
            <PostForm
              onClose={() => {
                onClosePostForm();
                onClose();
              }}
              post={post}
              content={content}
              delta={delta}
              callback={callback}
            />
          </div>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={onOpenPostForm}
          >
            Tiếp theo
          </Button>
        </>
      )}
    </Drawer>
  );
};

export default PostPopup;
