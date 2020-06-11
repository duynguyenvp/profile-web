import React, { useState } from 'react'
import { RightOutlined, DeleteFilled } from '@ant-design/icons'
import { Collapse, DatePicker, Row, Col, Form, Input, Button, Space } from 'antd'
const { Panel } = Collapse
const { RangePicker } = DatePicker;
import './style.scss'
import EditorComponent from '../../../components/editor';
import moment from 'moment'

const PanelHeader = ({ title, description, remove, education }) => {
    return <div className="info-block-panel-header">
        <div className="info-block-panel-header-title">
            <span className="title">{title}</span>
            <span className="description">{description}</span>
        </div>
        <div>
            <Button shape="circle"
                type="danger"
                size="small"
                icon={
                    <DeleteFilled />
                }
                onClick={e => {
                    e.stopPropagation()
                    if (typeof remove === 'function') {
                        remove(education)
                    }
                }}>
            </Button>
        </div>
    </div>
}

const getTitle = (school, degree, city) => {
    let title = school && degree && `Học ${degree} tại ${school}` || 'Chưa có thông tin'
    if (school && degree && city) title += `, ${city}`
    return title
}
const getDescription = (time) => {
    return time && `${time[0].format(dateFormat)} - ${time[1].format(dateFormat)}` || ''
}
const dateFormat = 'DD/MM/YYYY';
const EducationInfoBlock = ({ portfolioId, education, handleRemoveEducation, handleSave }) => {
    const {
        id,
        schoolName,
        specialized,
        city,
        detail,
        startDate,
        endDate
    } = education || {}
    const [html, setHtml] = useState(detail || '')
    const [time, setTime] = useState([moment(new Date(startDate || Date.now()), dateFormat), moment(new Date(endDate || Date.now()), dateFormat)])
    const [title, setTitle] = useState(getTitle(schoolName, specialized, city))
    const [description, setDescription] = useState(getDescription(time))
    const [editorKey, setEditorKey] = useState(1)
    const [form] = Form.useForm();

    const onReset = () => {
        setHtml('')
        setTitle('Chưa có thông tin')
        setDescription('')
        setEditorKey(editorKey + 1)
        form.resetFields();
    };
    const onFinish = values => {
        const dateFormatMDY = "MM/DD/YYYY"
        const { city, degree, school, time } = values
        handleSave({
            schoolName: school,
            specialized: degree,
            detail: html,
            startDate: time[0].format(dateFormatMDY),
            endDate: time[1].format(dateFormatMDY),
            id,
            city
        })
    };

    return <Collapse
        bordered={false}
        defaultActiveKey={[]}
        className="info-block-collapse"
    >
        <Panel showArrow={true}
            header={<PanelHeader
                education={education}
                remove={handleRemoveEducation}
                title={title}
                description={description} />}
            key="1"
            className="info-block-panel">
            <Form
                layout="vertical"
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onValuesChange={(changedValues, allValues) => {
                    const { school, degree, city, time } = allValues
                    setTitle(getTitle(school, degree, city))
                    setDescription(getDescription(time))
                }}
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name={`school`}
                            label={`Tên trường`}
                            initialValue={schoolName}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên trường!',
                                },
                            ]}
                        >
                            <Input placeholder="Tên trường ..." />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={`degree`}
                            label={`Ngành học`}
                            initialValue={specialized}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngành học!',
                                },
                            ]}
                        >
                            <Input placeholder="Ngành học ..." />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="time"
                            label="Thời gian học"
                            initialValue={time}
                            rules={[{ type: 'array', required: true, message: 'Vui lòng chọn thời gian!' }]}>
                            <RangePicker
                                onChange={date => { setTime(date) }}
                                style={{ width: "100%" }}
                                format={dateFormat} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={`city`}
                            label={`Tỉnh/Thành phố`}
                            initialValue={city}
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường của bạn ở đâu?',
                                },
                            ]}
                        >
                            <Input placeholder="Tên tỉnh hoặc thành phố ..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <span>Mô tả</span>
                        <EditorComponent
                            key={editorKey}
                            html={html}
                            callback={content => {
                                setHtml(content)
                            }} />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{ textAlign: 'right', marginTop: 16 }}>
                        <Space>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                            <Button
                                onClick={onReset}
                            >Làm mới</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Panel>
    </Collapse>
}

export default EducationInfoBlock