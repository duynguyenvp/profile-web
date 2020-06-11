import React, { Component } from 'react';
import s from './style.scss'
import withStyles from 'isomorphic-style-loader/withStyles'

import BlogIcon from '../../../common-resources/ic_blog'

class ThirdZone extends Component {
    render() {
        return (
            <div className="thirdZone" id="thirdZoneId">
                <div className="thirdZoneContent">
                    <div className="thirdZoneRightPanel" data-aos="zoom-in-down">
                        <BlogIcon />
                    </div>
                    <div className="thirdZoneLeftPanel">
                        <p data-aos="fade-down">Bạn có thể tạo blog của riêng mình ở đây.</p>
                        <p data-aos="fade-down">Chia sẻ những thông tin hữu ích, hay đơn giản là viết bất cứ thứ gì bạn muốn</p>
                        <p data-aos="fade-down">Tạo ra một thế giới của riêng bạn, mang màu sắc và cá tính riêng</p>
                        <div data-aos="fade-up" style={{display: 'flex'}}>
                            <a href="/quan-tri/blog-post" className="btn-try-now">Tạo ngay Blog</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(ThirdZone);