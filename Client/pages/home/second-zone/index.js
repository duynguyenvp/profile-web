import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import s from "./style.scss";

import CVIcon from "../../../assets/ic_cv";

const SecondZone = () => {
  useStyles(s);
  return (
    <div className="secondZone" id="secondZoneId">
      <div className="secondZoneContent">
        <div className="secondZoneLeftPanel">
          <p className="test">
            Đây là chức năng tạo cho phép tạo và chỉnh sửa Resume một cách nhanh
            chóng.
          </p>
          <p>Giao diện đơn giản, dễ dàng tiếp cận và sử dụng</p>
          <p>
            Mỗi resume sẽ là một trang web riêng, có địa chỉ riêng rất tiện lợi
            cho việc sử dụng
          </p>
          <p>
            Cho phép tải xuống Resume với định dạng PDF hoàn toàn không mất phí.
          </p>
          <div style={{ display: "flex" }}>
            <a href="/quan-tri" className="btn-try-now">
              Tạo Resume ngay
            </a>
          </div>
        </div>
        <div className="secondZoneRightPanel">
          <CVIcon />
        </div>
      </div>
    </div>
  );
};

export default SecondZone;
