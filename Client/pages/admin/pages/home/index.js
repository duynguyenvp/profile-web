import React, { Fragment, useState, useEffect } from "react";
import { Card, Button, notification, Result } from "antd";
import { PlusCircleFilled, LoadingOutlined } from "@ant-design/icons";

import PersonalInfoBlock from "./info-block/personalInfo";
import EducationInfoBlock from "./info-block/education";
import ExperienceInfoBlock from "./info-block/experience";
import SkillInfoBlock from "./info-block/skill";

import getApiInstance from "../../api/generic-api";
import { getAuthentication } from "../../store/authStore";
import {
  insertEducation,
  insertNewSkill,
  loadData,
  removeEducation,
  removeSkill,
  saveSkill,
  saveEducation,
  saveExperience,
  insertNewExperience,
  removeExperience,
} from "./queries";

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content,
  });
};

const cardAttribute = {
  bordered: false,
  headStyle: { textTransform: "uppercase", fontWeight: "bold" },
};
const Home = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState("");
  const [portfolioId, setPortfolioId] = useState(null);
  const [educations, setEducations] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [skills, setSkills] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const auth = getAuthentication();

  useEffect(() => {
    if (portfolioId) return;
    loadData()
      .then(({ error, isEmpty, result }) => {
        setIsLoading(false);
        if (error) {
          setError(error);
        } else if (isEmpty) {
          setIsEmpty(isEmpty);
        } else {
          const {
            id,
            portfolioEducations,
            portfolioExperiences,
            portfolioSkills,
            portfolioUser,
          } = result;
          setPortfolioId(id);
          setPersonalInfo(portfolioUser);
          setEducations(portfolioEducations);
          setExperiences(portfolioExperiences);
          setSkills(portfolioSkills);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.error(error);
      });
  }, [portfolioId]);

  const handleInsertNewSkill = () => {
    insertNewSkill(portfolioId).then((result) => {
      setSkills([...skills, ...result]);
    });
  };

  const handleSaveSkill = (skill) => {
    saveSkill(portfolioId, skills, skill).then((res) => {
      setSkills(res);
    });
  };
  const handleRemoveSkill = (item) => {
    removeSkill(portfolioId, item).then(() => {
      let newSkills = skills.filter((f) => f.id != item.id);
      setSkills(newSkills);
    });
  };

  const handleInsertEducation = () => {
    insertEducation(portfolioId, educations).then((res) => {
      setEducations(res);
    });
  };
  const handleRemoveEducation = (item) => {
    removeEducation(portfolioId, educations, item).then((res) => {
      setEducations(res);
    });
  };
  const handleSaveEducation = (education) => {
    saveEducation(portfolioId, educations, education).then((res) => {
      setEducations(res);
    });
  };

  const handleInsertNewExperience = () => {
    insertNewExperience(portfolioId, experiences).then((res) => {
      setExperiences(res);
    });
  };
  const handleRemoveExperience = (item) => {
    removeExperience(portfolioId, experiences, item).then((res) => {
      setExperiences(res);
    });
  };
  const handleSaveExperience = (experience) => {
    saveExperience(portfolioId, experiences, experience).then((res) => {
      setExperiences(res);
    });
  };

  const createPortfolio = () => {
    const auth = getAuthentication();
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/Insert",
        data: {
          UserId: auth.id,
        },
      })
      .then((res) => {
        const { successful } = res;
        if (successful) {
          openNotificationWithIcon("success", "Lưu thành công!!!");
          loadData();
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
          setError(error || "Tạo resume lỗi: Không xác định");
        }
      })
      .catch((error) => {
        openNotificationWithIcon(
          "error",
          "Lỗi: " + (error || "Không xác định") + "."
        );
        console.error(error);
        setError(error || "Tạo resume lỗi: Không xác định");
      });
  };

  if (isLoading)
    return (
      <Result
        icon={<LoadingOutlined />}
        title="Đang xử lý thông tin, vui lòng chờ ...!"
      />
    );
  if (isEmpty)
    return (
      <Result
        title="Your operation has been executed"
        extra={
          <Button type="primary" onClick={createPortfolio}>
            <span>Tạo resume ngay</span>
          </Button>
        }
      />
    );
  if (error) return <Result status="500" title="500" subTitle={error} />;

  return (
    <Fragment>
      <Card title="Thông tin cá nhân" {...cardAttribute}>
        <PersonalInfoBlock personalInfo={personalInfo} />
      </Card>
      <Card title="Quá trình học tập" {...cardAttribute}>
        {educations &&
          educations.map((item, index) => (
            <EducationInfoBlock
              key={index}
              education={item}
              portfolioId={portfolioId}
              handleRemoveEducation={handleRemoveEducation}
              handleSave={handleSaveEducation}
            />
          ))}
        <Button
          type="primary"
          shape="round"
          style={{ margin: " 16px 0" }}
          icon={<PlusCircleFilled />}
          onClick={handleInsertEducation}
        >
          {"Thêm mới"}
        </Button>
      </Card>
      <Card title="Kinh nghiệm làm việc" {...cardAttribute}>
        {experiences &&
          experiences.map((item, index) => (
            <ExperienceInfoBlock
              key={index}
              experience={item}
              portfolioId={portfolioId}
              handleRemoveExperience={handleRemoveExperience}
              handleSaveExperience={handleSaveExperience}
            />
          ))}
        <Button
          type="primary"
          shape="round"
          style={{ margin: " 16px 0" }}
          icon={<PlusCircleFilled />}
          onClick={handleInsertNewExperience}
        >
          {"Thêm mới"}
        </Button>
      </Card>
      <Card title="Kỹ năng" {...cardAttribute}>
        {skills &&
          skills.map((item, index) => (
            <SkillInfoBlock
              key={index}
              handleSaveSkill={handleSaveSkill}
              handleRemoveSkill={handleRemoveSkill}
              skill={item}
              portfolioId={portfolioId}
            />
          ))}
        <Button
          type="primary"
          shape="round"
          style={{ margin: " 16px 0" }}
          icon={<PlusCircleFilled />}
          onClick={handleInsertNewSkill}
        >
          {"Thêm mới"}
        </Button>
      </Card>
    </Fragment>
  );
};

export default Home;
