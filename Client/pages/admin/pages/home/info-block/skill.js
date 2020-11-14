import React, { useState, useEffect, useMemo } from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteFilled
} from "@ant-design/icons";
import {
  Collapse, Row, Col, Form, Input, Button, Space, Slider
} from "antd";

const { Panel } = Collapse;

const PanelHeader = ({ title, remove, skill }) => (
  <div className="info-block-panel-header">
    <div className="info-block-panel-header-title">
      <span className="title">{title}</span>
    </div>
    <div>
      <Button
        shape="circle"
        type="danger"
        size="small"
        icon={<DeleteFilled />}
        onClick={(e) => {
          e.stopPropagation();
          if (typeof remove === "function") {
            remove(skill);
          }
        }}
      />
    </div>
  </div>
);
const SkillInfoBlock = ({
  skill,
  total,
  handleReorderSkill,
  handleSaveSkill,
  handleRemoveSkill
}) => {
  const [skillData, setSkillData] = useState(skill);
  const { id, skillName, level: _level } = skillData || {};
  const [title, setTitle] = useState(
    (skillName && skillName) || "Chưa có thông tin"
  );
  const [level, setLevel] = useState(_level || 50);
  const [form] = Form.useForm();

  const onReset = () => {
    setTitle("Chưa có thông tin");
    setLevel(50);
    form.resetFields();
  };
  const onFinish = (values) => {
    handleSaveSkill({
      ...values,
      level,
      id,
      ordinalNumber: skill.ordinalNumber
    });
  };

  useEffect(() => {
    setSkillData(skill);
    const { skillName, level: _level } = skill || {};
    setTitle((skillName && skillName) || "Chưa có thông tin");
    setLevel(_level || 50);
  }, [skill]);

  const isDisabledDown = useMemo(() => (skill.ordinalNumber || 0) === 0, [
    skill
  ]);
  const isDisabledUp = useMemo(() => (skill.ordinalNumber || 0) >= total - 1, [
    skill,
    total
  ]);

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={[]}
      className="info-block-collapse"
    >
      <div className="order-controls">
        <Button
          size="small"
          disabled={isDisabledDown}
          icon={<CaretUpOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof handleReorderSkill === "function") {
              let nextOrdinalNumber = (skill.ordinalNumber || 0) - 1;
              nextOrdinalNumber = nextOrdinalNumber < 0 ? 0 : nextOrdinalNumber;
              handleReorderSkill({
                ...skill,
                ordinalNumber: nextOrdinalNumber
              });
            }
          }}
        />
        <Button
          disabled={isDisabledUp}
          size="small"
          icon={<CaretDownOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof handleReorderSkill === "function") {
              let nextOrdinalNumber = (skill.ordinalNumber || 0) + 1;
              nextOrdinalNumber = nextOrdinalNumber > total ? total : nextOrdinalNumber;
              handleReorderSkill({
                ...skill,
                ordinalNumber: nextOrdinalNumber
              });
            }
          }}
        />
      </div>
      <Panel
        showArrow
        header={(
          <PanelHeader
            skill={skillData}
            remove={handleRemoveSkill}
            title={title}
          />
        )}
        key="1"
        className="info-block-panel"
      >
        <Form
          layout="vertical"
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          onValuesChange={(changedValues, allValues) => {
            const { skillName } = allValues;
            setTitle((skillName && skillName) || "Chưa có thông tin");
          }}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="skillName"
                label="Tên kỹ năng"
                initialValue={skillName}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kỹ năng!"
                  }
                ]}
              >
                <Input placeholder="Tên kỹ năng ..." />
              </Form.Item>
            </Col>
            <Col
              span={12}
              flex="test"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Slider
                value={level}
                style={{ width: "100%" }}
                onChange={(value) => {
                  setLevel(value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
                <Button onClick={onReset}>Làm mới</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default SkillInfoBlock;
