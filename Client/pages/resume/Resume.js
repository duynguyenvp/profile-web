import React, { useEffect, useState } from "react";
import App from "../home/App";
import getApiInstance from "../../ajax/generic-api";

import ResumeBody from "./resume-body";
import ResumeBodySkeleton from "./resume-body/skeleton";

const Home = () => {
  const [state, setState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const loadData = (Username) => {
    let options = {
      url: "/Portfolio/ForHomePage",
    };
    if (Username) {
      options = {
        ...options,
        data: {
          Username,
        },
      };
    }
    getApiInstance()
      .getWithQueryString(options)
      .then((res) => {
        setIsLoading(false);
        const { successful, result } = res;
        if (successful) {
          if (result && result.length) {
            setState({ ...result[0] });
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };
  useEffect(() => {
    let pathname = window.location.pathname;
    pathname = pathname.split(/\//);

    let Username = pathname[pathname.length - 1];
    if (Username && Username != "resume" && Username != "print") {
      loadData(Username);
    } else {
      loadData();
    }
  }, []);
  return (
    <App>{isLoading ? <ResumeBodySkeleton /> : <ResumeBody {...state} />}</App>
  );
};
export default Home;
