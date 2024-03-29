import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import s from "./style.scss";

import BlogIcon from "../../../assets/ic_blog";

const ThirdZone = () => {
  useStyles(s);
  return (
    <div className="thirdZone" id="thirdZoneId">
      <div className="thirdZoneContent">
        <div className="thirdZoneRightPanel">
          <BlogIcon />
        </div>
        <div className="thirdZoneLeftPanel">
          <p>Bạn có thể tạo blog của riêng mình ở đây.</p>
          <p>
            Chia sẻ những thông tin hữu ích, hay đơn giản là viết bất cứ thứ gì
            bạn muốn
          </p>
          <p>
            Tạo ra một thế giới của riêng bạn, mang màu sắc và cá tính riêng
          </p>
          <div style={{ display: "flex" }}>
            <a href="/quan-tri/post" className="btn-try-now">
              Tạo ngay Blog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdZone;
