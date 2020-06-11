import React, { Component } from 'react';
import s from './style.scss'

import CVIcon from '../../../common-resources/ic_cv'
import withStyles from 'isomorphic-style-loader/withStyles'

class SecondZone extends Component {
    render() {
        return (
            <div className="secondZone" id="secondZoneId">
                <div className="secondZoneContent">
                    <div className="secondZoneLeftPanel">
                        <p data-aos="fade-down">Đây là chức năng tạo cho phép tạo và chỉnh sửa Resume một cách nhanh chóng.
                        </p>
                        <p data-aos="fade-down">Giao diện đơn giản, dễ dàng tiếp cận và sử dụng</p>
                        <p data-aos="fade-down">Mỗi resume sẽ là một trang web riêng, có địa chỉ riêng rất tiện lợi cho việc sử dụng</p>
                        <p data-aos="fade-down"><strong>somethingaboutme.info</strong> cam kết không bao giờ gửi thông tin của bạn đi bất cứ đâu, thông tin của bạn là của bạn, bạn có toàn quyền quyết định và sử dụng nó.</p>
                        <div data-aos="fade-up" style={{display: 'flex'}}>
                            <a href="/quan-tri" className="btn-try-now">Tạo Resume ngay</a>
                        </div>
                    </div>
                    <div className="secondZoneRightPanel" data-aos="zoom-in-down">
                        <CVIcon />
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(SecondZone);