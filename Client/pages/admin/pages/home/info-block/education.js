import React, { useState, useEffect, useMemo } from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteFilled
} from "@ant-design/icons";
import {
  Collapse,
  DatePicker,
  Row,
  Col,
  Form,
  Input,
  Button,
  Space
} from "antd";
import moment from "moment";
import EditorComponent from "../../../components/editor";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const PanelHeader = ({ title, description, remove, education }) => (
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
        onClick={e => {
          e.stopPropagation();
          if (typeof remove === "function") {
            remove(education);
          }
        }}
      />
    </div>
  </div>
);

const getTitle = (school, degree) => {
  const title =
    (school && degree && `Học ${degree} tại ${school}`) || "Chưa có thông tin";
  return title;
};
const getDescription = time =>
  (time && `${time[0].format(dateFormat)} - ${time[1].format(dateFormat)}`) ||
  "";
const dateFormat = "DD/MM/YYYY";
const EducationInfoBlock = ({
  education,
  total,
  handleReorderEducation,
  handleRemoveEducation,
  handleSave
}) => {
  const { id, schoolName, specialized, detail, startDate, endDate } =
    education || {};
  const [html, setHtml] = useState(detail || "");
  const [time, setTime] = useState([
    moment(new Date(startDate || Date.now()), dateFormat),
    moment(new Date(endDate || Date.now()), dateFormat)
  ]);
  const [title, setTitle] = useState(getTitle(schoolName, specialized));
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
  const onFinish = values => {
    const dateFormatMDY = "MM/DD/YYYY";
    const { degree, school, time } = values;
    handleSave({
      schoolName: school,
      specialized: degree,
      detail: html,
      startDate: time[0].format(dateFormatMDY),
      endDate: time[1].format(dateFormatMDY),
      id,
      ordinalNumber: education.ordinalNumber
    });
  };

  useEffect(() => {
    const { schoolName, specialized, detail, startDate, endDate } =
      education || {};
    setHtml(detail || "");
    setTime([
      moment(new Date(startDate || Date.now()), dateFormat),
      moment(new Date(endDate || Date.now()), dateFormat)
    ]);
    setTitle(getTitle(schoolName, specialized));
    setDescription(getDescription(time));
    setEditorKey(editorKey + 1);
  }, [education]);

  const isDisabledDown = useMemo(() => (education.ordinalNumber || 0) === 0, [
    education
  ]);
  const isDisabledUp = useMemo(
    () => (education.ordinalNumber || 0) >= total - 1,
    [education, total]
  );

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
          className="btnOrder"
          icon={<CaretUpOutlined />}
          onClick={e => {
            e.stopPropagation();
            if (typeof handleReorderEducation === "function") {
              let nextOrdinalNumber = (education.ordinalNumber || 0) - 1;
              nextOrdinalNumber = nextOrdinalNumber < 0 ? 0 : nextOrdinalNumber;
              handleReorderEducation({
                ...education,
                ordinalNumber: nextOrdinalNumber
              });
            }
          }}
        />
        <Button
          disabled={isDisabledUp}
          size="small"
          className="btnOrder"
          icon={<CaretDownOutlined />}
          onClick={e => {
            e.stopPropagation();
            if (typeof handleReorderEducation === "function") {
              let nextOrdinalNumber = (education.ordinalNumber || 0) + 1;
              nextOrdinalNumber =
                nextOrdinalNumber > total ? total : nextOrdinalNumber;
              handleReorderEducation({
                ...education,
                ordinalNumber: nextOrdinalNumber
              });
            }
          }}
        />
      </div>
      <Panel
        showArrow
        header={
          <PanelHeader
            education={education}
            remove={handleRemoveEducation}
            title={title}
            description={description}
          />
        }
        className="info-block-panel"
      >
        <Form
          layout="vertical"
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          onValuesChange={(changedValues, allValues) => {
            const { school, degree, time } = allValues;
            setTitle(getTitle(school, degree));
            setDescription(getDescription(time));
          }}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="school"
                label="Tên trường"
                initialValue={schoolName}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên trường!"
                  }
                ]}
              >
                <Input placeholder="Tên trường ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="degree"
                label="Ngành học"
                initialValue={specialized}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngành học!"
                  }
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
                rules={[
                  {
                    type: "array",
                    required: true,
                    message: "Vui lòng chọn thời gian!"
                  }
                ]}
              >
                <RangePicker
                  onChange={date => {
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
                callback={content => {
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

export default EducationInfoBlock;
