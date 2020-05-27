import React, { useState, useEffect } from 'react'
import { DeleteFilled } from '@ant-design/icons'
import { Collapse, Row, Col, Form, Input, Button, Space, Slider } from 'antd'
const { Panel } = Collapse
import './style.scss'

const PanelHeader = ({ title, remove, skill }) => {
    return <div className="info-block-panel-header">
        <div className="info-block-panel-header-title">
            <span className="title">{title}</span>
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
                        remove(skill)
                    }
                }}>
            </Button>
        </div>
    </div>
}
const SkillInfoBlock = ({ skill, handleSaveSkill, handleRemoveSkill }) => {
    const [skillData, setSkillData] = useState(skill)
    const {
        id,
        skillName,
        level: _level
    } = skillData || {}
    const [title, setTitle] = useState(skillName && skillName || 'Chưa có thông tin')
    const [level, setLevel] = useState(_level || 50)
    const [form] = Form.useForm();

    const onReset = () => {
        setTitle('Chưa có thông tin')
        setLevel(50)
        form.resetFields();
    };
    const onFinish = values => {
        handleSaveSkill({...values, level, id})
    };

    useEffect(() => {
        setSkillData(skill)
    }, [skill])

    return <Collapse
        bordered={false}
        defaultActiveKey={[]}
        className="info-block-collapse"
    >
        <Panel showArrow={true}
            header={<PanelHeader
                skill={skillData}
                remove={handleRemoveSkill}
                title={title} />}
            key="1"
            className="info-block-panel">
            <Form
                layout="vertical"
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onValuesChange={(changedValues, allValues) => {
                    const { skillName } = allValues
                    setTitle(skillName && skillName || 'Chưa có thông tin')
                }}
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name={`skillName`}
                            label={`Tên kỹ năng`}
                            initialValue={skillName}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên kỹ năng!',
                                },
                            ]}
                        >
                            <Input placeholder="Tên kỹ năng ..." />
                        </Form.Item>
                    </Col>
                    <Col span={12} flex="test" style={{ display: "flex", alignItems: "center" }}>
                        <Slider value={level}
                            style={{ width: "100%" }}
                            onChange={value => { setLevel(value) }}
                        />
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

export default SkillInfoBlock