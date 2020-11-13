import React, {
  useCallback, useLayoutEffect, useRef, useState
} from "react";
import { Layout } from "antd";
import Quill from "quill";
import ImageResize from "quill-image-resize-module";
import ImageManager from "../../../components/image-manager";

import VideoBlot from "./VideoBlot";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "./quill.scss";
import { getObject, setObject } from "../../../utils/localForage";

const { Header, Content } = Layout;
Quill.register("modules/imageResize", ImageResize);
Quill.register(VideoBlot);

const EditorContent = ({ post, callback }) => {
  const [flagOpenImageManager, setFlagOpenImageManager] = useState(() => false);
  const [emojiPicker, setEmojiPicker] = useState(() => null);
  const [emojiPickerState, setEmojiPickerState] = useState(() => false);
  const [range, setRange] = useState(() => null);
  const [editor, setEditor] = useState(() => null);
  const refEditor = useRef();
  const getEditorMaxWidth = useCallback(() => {
    const editorDOM = document.querySelector(".ql-editor");
    const computedStyle = window.getComputedStyle(editorDOM);
    const padding = parseInt((computedStyle && computedStyle.paddingLeft) || "0px", 10)
      + parseInt((computedStyle && computedStyle.paddingRight) || "0px", 10);
    const editorClientWidth = (editorDOM && editorDOM.clientWidth) || 0;
    window.EDITOR_CLIENT_WIDTH = editorClientWidth === 0 ? 0 : editorClientWidth - padding;
  }, []);

  const saveContentToLocalStore = async data => {
    await setObject("post-content", data);
  };

  const getContentFromLocalStore = async () => {
    try {
      const result = await getObject("post-content");
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const closeImageManager = () => {
    setFlagOpenImageManager(false);
  };
  useLayoutEffect(() => {
    window.QuillEditor = new Quill(refEditor.current, {
      modules: {
        toolbar: "#toolbar",
        imageResize: {}
      },
      placeholder: "Nhập nội dung...",
      theme: "snow" // or 'bubble'
    });
    if (post && post.delta) {
      try {
        const delta = JSON.parse(post.delta);
        if (delta) {
          window.QuillEditor.setContents(delta);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (!post || Object.keys(post).length === 0) {
      getContentFromLocalStore()
        .then(data => {
          window.QuillEditor.setContents(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
    setEditor(window.QuillEditor);
  }, [post]);
  useLayoutEffect(() => {
    if (!editor) return;
    // quill editor add image handler
    editor.getModule("toolbar").addHandler("image", () => {
      const range = editor.getSelection();
      setRange(range);
      setFlagOpenImageManager(true);
    });
    editor.on("text-change", () => {
      const change = editor.getContents();
      if (change.length()) {
        saveContentToLocalStore(change);
      }
      callback({
        content: editor.root.innerHTML,
        delta: change
      });
    });
    getEditorMaxWidth();
  }, [editor]);
  const handleClickEmojiButton = e => {
    e.stopPropagation();
    setEmojiPickerState(!emojiPickerState);
  };
  const initEmojiBox = async () => {
    await import("emoji-mart/css/emoji-mart.css");
    const { Picker } = await import("emoji-mart");
    setEmojiPicker(
      <div className="input-emojibox">
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          set="facebook"
          native
          showPreview={false}
          onSelect={emoji => insertEmoji(emoji.native)}
        />
      </div>
    );
  };
  useLayoutEffect(() => {
    initEmojiBox();
  }, []);

  const renderEmojiPicker = () => {
    if (emojiPickerState) return <>{emojiPicker}</>;
    return null;
  };

  const insertEmoji = emoji => {
    setEmojiPickerState(false);
    if (window.QuillEditor) {
      const currentRange = window.QuillEditor.getSelection();
      window.QuillEditor.insertText(
        (currentRange && currentRange.index) || 0,
        emoji
      );
    }
  };
  return (
    <Layout>
      <Header className="editor-main-header">
        <div id="toolbar">
          <select className="ql-size" defaultValue="small">
            <option value="small" />
            <option value="large" />
            <option value="huge" />
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <span className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </span>
          <button className="ql-align" value="justify" />
          <button className="ql-align" value="center" />
          <button className="ql-align" value="right" />
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
          </span>
          <button className="ql-script" value="sub" />
          <button className="ql-script" value="super" />
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
          <span className="ql-formats">
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
          </span>
          <button
            className={emojiPickerState ? "ql-active" : ""}
            onClick={handleClickEmojiButton}
          >
            <i
              className="material-icons"
              style={{ fontSize: 18, float: "left" }}
            >
              mood
            </i>
          </button>
          {renderEmojiPicker()}
        </div>
      </Header>
      <Content className="editor-main-content">
        <ImageManager
          visible={flagOpenImageManager}
          close={closeImageManager}
          callback={src => {
            const Delta = Quill.import("delta");
            if (window.QuillEditor) {
              window.QuillEditor.updateContents(
                new Delta().retain((range && range.index) || 0).insert(
                  {
                    image: src
                  },
                  {
                    alt: src
                  }
                )
              );
            }
            setRange(null);
          }}
        />
        <div
          className="editor-content"
          ref={refEditor}
          dangerouslySetInnerHTML={{
            __html: (post && post.content) || ""
          }}
        />
      </Content>
    </Layout>
  );
};

export default EditorContent;
