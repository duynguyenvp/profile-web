import React, { useState, useEffect } from "react";
import {
  DeleteFilled,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import {
  Collapse,
  DatePicker,
  Row,
  Col,
  Form,
  Input,
  Button,
  Space,
} from "antd";
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
import EditorComponent from "../../../components/editor";
import moment from "moment";

const PanelHeader = ({ title, description, remove, experience }) => {
  return (
    <div className="info-block-panel-header">
      <div className="info-block-panel-header-title">
        <span className="title">{title}</span>
        <span className="description">{description}</span>
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
              remove(experience);
            }
          }}
        ></Button>
      </div>
    </div>
  );
};

const getTitle = (company, position) => {
  let title =
    (company && position && `Làm ${position} tại ${company}`) ||
    "Chưa có thông tin";
  return title;
};
const getDescription = (time) => {
  return (
    (time && `${time[0].format(dateFormat)} - ${time[1].format(dateFormat)}`) ||
    ""
  );
};
const dateFormat = "DD/MM/YYYY";
const ExperienceInfoBlock = ({
  portfolioId,
  experience,
  handleRemoveExperience,
  handleSaveExperience,
}) => {
  const [experienceData, setExperienceData] = useState(experience);
  const { id, company, position, detail, startDate, endDate } =
    experienceData || {};
  const [html, setHtml] = useState(detail || "");
  const [time, setTime] = useState([
    moment(new Date(startDate || Date.now()), dateFormat),
    moment(new Date(endDate || Date.now()), dateFormat),
  ]);
  const [title, setTitle] = useState(getTitle(company, position));
  const [description, setDescription] = useState(getDescription(time));
  const [editorKey, setEditorKey] = useState(1);
  const [form] = Form.useForm();

  const onReset = () => {
    setHtml("");
    setTitle("Chưa có thông tin");
    setDescription("");
    setEditorKey(editorKey + 1);
    form.resetFields();
  };
  const onFinish = (values) => {
    const dateFormatMDY = "MM/DD/YYYY";
    const { position, company, time } = values;
    handleSaveExperience({
      company: company,
      position: position,
      detail: html,
      startDate: time[0].format(dateFormatMDY),
      endDate: time[1].format(dateFormatMDY),
      id,
    });
  };

  useEffect(() => {
    setExperienceData(experience);
  }, [experience]);

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={[]}
      className="info-block-collapse"
    >
      {/* <div className="order-controls">
        <Button
          size="small"
          className="btnOrder"
          icon={<CaretUpOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            // if (typeof remove === "function") {
            //   remove(experience);
            // }
          }}
        ></Button>
        <Button
          size="small"
          className="btnOrder"
          icon={<CaretDownOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            // if (typeof remove === "function") {
            //   remove(experience);
            // }
          }}
        ></Button>
      </div> */}
      <Panel
        showArrow={true}
        header={
          <PanelHeader
            experience={experienceData}
            remove={handleRemoveExperience}
            title={title}
            description={description}
          />
        }
        key="1"
        className="info-block-panel"
      >
        <Form
          layout="vertical"
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          onValuesChange={(changedValues, allValues) => {
            const { company, position, time } = allValues;
            setTitle(getTitle(company, position));
            const description = getDescription(time);
            setDescription(description);
          }}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={`company`}
                label={`Tên công ty`}
                initialValue={company}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công ty!",
                  },
                ]}
              >
                <Input placeholder="Tên công ty ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={`position`}
                label={`Vị trí`}
                initialValue={position}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập vị trí!",
                  },
                ]}
              >
                <Input placeholder="Vị trí ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Thời gian"
                initialValue={time}
                rules={[
                  {
                    type: "array",
                    required: true,
                    message: "Vui lòng chọn thời gian!",
                  },
                ]}
              >
                <RangePicker
                  onChange={(date) => {
                    setTime(date);
                  }}
                  style={{ width: "100%" }}
                  format={dateFormat}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <span>Mô tả</span>
              <EditorComponent
                key={editorKey}
                html={html}
                callback={(content) => {
                  setHtml(content);
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

export default ExperienceInfoBlock;
