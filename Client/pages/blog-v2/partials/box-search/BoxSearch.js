import React, { useState, useEffect } from "react";
import getApiInstance from "../../../../ajax/generic-api";

import useStyles from "isomorphic-style-loader/useStyles";
import s from "./style.scss";
import { dateToStringFormatCultureVi } from "../../../../utils/date-utils";

const BoxSearch = ({ changePost }) => {
  let typingTimer;
  const doneTypingInterval = 1500;
  useStyles(s);
  const [searchResults, setSearchResults] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isShowStatus, setIsShowStatus] = useState(false);

  useEffect(() => {
    let pathname = window.location.pathname;
    pathname = pathname.split(/\//);
    let username = "";
    if (pathname && pathname.length && pathname[2] != "bai-viet") {
      username = pathname[2];
    }
    username = username && username.length > 0 ? username : "duynguyen";
    setCurrentUsername(username);
  }, []);

  const onChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
  };

  const onKeyDown = (e) => {
    clearTimeout(typingTimer);
    var keycode = e.charCode || e.keyCode;
    if (keycode == 13) {
      search();
    }
  };

  const onKeyUp = (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  };

  const doneTyping = () => {
    if (!keyword) onRefresh();
  };

  const search = () => {
    setIsSearching(true);
    setIsShowStatus(true);
    getApiInstance()
      .postWithForm({
        url: "/Post/FullTextSearch",
        data: {
          Condition: keyword,
          Username: currentUsername,
        },
      })
      .then((res) => {
        setIsSearching(false);
        if (res.successful) {
          setSearchResults(res.result.data);
        }
      })
      .catch((err) => {
        setIsSearching(false);
        console.error(err);
      });
  };

  const onRefresh = () => {
    setKeyword("");
    setSearchResults(null);
    setIsShowStatus(false);
  };

  return (
    <section className="boxSearch">
      <div className="searchKeywordWrapper">
        <i className="searchKeywordWrapper__preIcon material-icons">search</i>
        <input
          id="searchKeywordWrapper__input"
          className="searchKeywordWrapper__input"
          placeholder="Nhập từ khóa tìm kiếm ..."
          aria-label="Nhập từ khóa tìm kiếm"
          value={keyword}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
        />
        {keyword && (
          <button
            className="searchKeywordWrapper__btnClear"
            onClick={onRefresh}
          >
            <i className="material-icons">cancel</i>
          </button>
        )}
      </div>
      <div className="searchResult">
        {isSearching && (
          <h5 className="searchResult__status">Đang tìm kiếm...</h5>
        )}
        {isShowStatus && keyword && !isSearching && (
          <h5 className="searchResult__status">
            Đã tìm thấy {(searchResults && searchResults.length) || 0} bài viết
          </h5>
        )}
        {keyword &&
          !isSearching &&
          searchResults &&
          searchResults.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <div className="searchItem">
                  <div className="searchItem__title">
                    <a
                      href={item.postUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        changePost(item.id);
                      }}
                    >
                      <p className="searchItem__postTime">
                        {dateToStringFormatCultureVi(item.postTime)}
                      </p>
                      <p>{item.title}</p>
                    </a>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </section>
  );
};

export default BoxSearch;
