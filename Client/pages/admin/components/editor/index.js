import "./style.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";

import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // custom button values
  [{ list: "ordered" }, { list: "bullet" }]
];
class EditorComponent extends Component {
  editor = null;

  static propTypes = {
    html: PropTypes.string,
    callback: PropTypes.func
  };

  static defaultProps = {
    html: "",
    callback: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      html: props.html
    };
  }

  componentDidMount() {
    this.initEditor();
  }

  initEditor = () => {
    const { callback } = this.props;
    const { html } = this.state;
    const self = this;
    // this.removeAllToolbars()
    self.editor = new Quill(this.refEditor, {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: "Nhập nội dung...",
      theme: "snow" // or 'bubble'
    });
    self.editor.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        self.setState(
          { html: self.editor.root.innerHTML, delta: oldDelta.concat(delta) },
          () => {
            callback(self.editor.root.innerHTML);
          }
        );
      }
    });
    // self.editor.clipboard.dangerouslyPasteHTML(0, html);
    self.editor.setContents(self.editor.clipboard.convert(html));
    self.editor.blur();
  };

  removeAllToolbars = () => {
    const toolbars = document.querySelectorAll(".ql-toolbar");
    for (let index = 0; index < toolbars.length; index += 1) {
      const toolbar = toolbars[index];
      try {
        toolbar.parentNode.removeChild(toolbar);
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    return (
      <div
        className="quill-editor"
        ref={instance => (this.refEditor = instance)}
      />
    );
  }
}

export default EditorComponent;
