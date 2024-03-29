import React, { Component } from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import s from "./style.scss";
import getApiInstance from "../../../ajax/generic-api";
import { validateEmail } from "../../../utils/validate";
import { addAlert } from "../../../services/alertService";
import FbPlugin from "../FbPagePlugin";

class FourthZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      message: "",
      isValidateEmail: "",
      isValidateMessage: ""
    };
  }

  onChange = (key, value) => {
    switch (key) {
      case "email":
        if (validateEmail(value)) {
          this.setState({
            email: value,
            isValidateEmail: ""
          });
        } else {
          this.setState({
            email: value,
            isValidateEmail: "Email không hợp lệ."
          });
        }
        break;

      case "message":
        if (value) {
          this.setState({
            message: value,
            isValidateMessage: ""
          });
        } else {
          this.setState({
            message: value,
            isValidateMessage: "Tin nhắn đang trống."
          });
        }
        break;
      default:
    }
  };

  send = () => {
    const { email, message, isValidateEmail, isValidateMessage } = this.state;
    if (isValidateEmail || isValidateMessage) {
      addAlert({ type: "warning", message: "Lỗi Validate." });
      return;
    }
    if (!email || !message) {
      addAlert({ type: "warning", message: "Thông tin chưa đầy đủ" });
      return;
    }
    getApiInstance()
      .postWithForm({
        url: "/Home",
        data: { email, message }
      })
      .then(res => {
        if (res) {
          addAlert({
            message: "Gửi phải hồi thành công. Cảm ơn bạn!!!",
            duration: 5000
          });
          this.setState({
            email: "",
            message: "",
            isValidateEmail: "",
            isValidateMessage: ""
          });
        } else {
          addAlert({ type: "warning", message: "Đã xảy ra lỗi!" });
        }
      })
      .catch(err => {
        console.error("Lỗi", err);
      });
  };

  render() {
    const { email, message, isValidateEmail, isValidateMessage } = this.state;
    return (
      <div
        id="fourthZoneId"
        className="lazyload"
        data-bg="dist/images/feedback-background.webp"
      >
        <div className="fourthZoneContent">
          <div className="box-contact" data-aos="fade-right">
            <h2>Liên hệ & góp ý</h2>
            <div className="contact-item">
              <label className="title" htmlFor="feedback-input-email">
                Email:
              </label>
              <input
                id="feedback-input-email"
                type="text"
                className={isValidateEmail ? "error" : ""}
                placeholder="Email ..."
                value={email}
                onChange={e => {
                  this.onChange("email", e.target.value);
                }}
              />
              {isValidateEmail && (
                <label className="validate-error">{isValidateEmail}</label>
              )}
            </div>
            <div className="contact-item">
              <label className="title" htmlFor="feedback-input-content">
                Tin nhắn:
              </label>
              <textarea
                id="feedback-input-content"
                style={{ width: "100%" }}
                rows="10"
                className={isValidateMessage ? "error" : ""}
                placeholder="Nhập nội dung ..."
                value={message}
                onChange={e => {
                  this.onChange("message", e.target.value);
                }}
              />
              {isValidateMessage && (
                <label className="validate-error">{isValidateMessage}</label>
              )}
            </div>
            <div className="contact-item">
              <button className="btnSend" onClick={this.send}>
                Gửi
              </button>
            </div>
          </div>
          <div className="box-social">
            <FbPlugin />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FourthZone);
