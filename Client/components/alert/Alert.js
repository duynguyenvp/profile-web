import React, { Component } from "react";
import PropTypes from "prop-types";

class Alert extends Component {
  static propTypes = {
    message: PropTypes.string,
    callback: PropTypes.func,
    close: PropTypes.func,
    duration: PropTypes.number,
    type: PropTypes.oneOf(["success", "warning", "error"])
  };

  static defaultProps = {
    message: "",
    callback: () => {},
    close: () => {},
    duration: 5000,
    type: "success"
  };

  componentDidMount() {
    const { duration } = this.props;
    const that = this;
    if (duration > 0) {
      setTimeout(() => {
        that.close();
      }, duration);
    }
  }

  close = () => {
    this.props.close();
  };

  confirm = () => {
    this.props.callback();
  };

  render() {
    const { message, type } = this.props;
    return (
      <div className={`alert-item ${type}`}>
        <div className="icon" onClick={this.close} />
        <div className="alert-content">{message && <span>{message}</span>}</div>
      </div>
    );
  }
}

export default Alert;
