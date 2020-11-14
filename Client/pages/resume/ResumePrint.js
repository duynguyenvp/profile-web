import useStyles from "isomorphic-style-loader/useStyles";
import React from "react";
import PropTypes from "prop-types";
import ResumeBody from "./resume-body";
import s from "./resumePrint.scss";

const Home = ({ resume }) => {
  useStyles(s);
  return <ResumeBody isPrint {...resume} />;
};

Home.propTypes = {
  resume: PropTypes.any
};

Home.defaultProps = {
  resume: {}
};

export default Home;
