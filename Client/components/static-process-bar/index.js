import React, { Component } from "react";
import "./style.scss";
import PropTypes from "prop-types";

class StaticProcessBar extends Component {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.number,
    isShowValue: PropTypes.bool
  };

  static defaultProps = {
    name: "",
    className: "",
    value: 0,
    isShowValue: false
  };

  render() {
    return (
      <div className={`processBarItem ${this.props.className || "default"}`}>
        {this.props.name && (
          <p className="processBarTitle">{this.props.name}</p>
        )}
        <div className="processBarContainer">
          <div
            className="processBarValue"
            style={{ width: `${this.props.value}%` }}
          >
            {this.props.isShowValue && `${this.props.value}%`}
          </div>
        </div>
      </div>
    );
  }
}

export default StaticProcessBar;
