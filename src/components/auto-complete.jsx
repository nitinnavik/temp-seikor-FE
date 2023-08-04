import React, { useEffect, useState } from "react";
import "../styles/aboutme.scss";
import tick from "../assests/icons/ic-combo-tick.svg";

const AutoComplete = ({
  inputData,
  defaultValue,
  inputCssClass,
  wrapperCssClass,
  placeholder,
  onChange,
  searchListHeight,
}) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [inputDataStore, setInputDataStore] = useState([]);
  const [inputDataStoreBackup, setInputDataStoreBackup] = useState([]);
  const [contentZIndex, setContentZIndex] = useState(1);

  useEffect(() => {
    if (inputData && inputData.length > 0) {
      const newInputData = [...inputData];
      setInputDataStoreBackup(newInputData);
    }
    if (defaultValue) {
      setSearchInputValue(defaultValue);
    } else {
      searchInputValue && onChangeHandler(searchInputValue);
    }
  }, [inputData, defaultValue]);

  const onChangeHandler = (text) => {
    onChange(text);
    setSearchInputValue(text);
    const newInputDataStoreBackup = [...inputDataStoreBackup];
    if (text && newInputDataStoreBackup && newInputDataStoreBackup.length > 0) {
      const searchList = newInputDataStoreBackup.filter(
        (data) => data.name.toLowerCase().search(text.toLowerCase()) !== -1
      );
      setInputDataStore(searchList);
      // console.log("searchList", searchList);
    } else {
      setInputDataStore([]);
    }
  };

  const onOptionClick = (data) => {
    if (data) {
      onChange(data.name);
      setSearchInputValue(data.name);
      setInputDataStore([]);
    }
  };

  return (
    <div
      className={`position-relative ${wrapperCssClass}`}
      style={{ zIndex: contentZIndex }}
    >
      <input
        className={inputCssClass}
        placeholder={placeholder}
        value={searchInputValue}
        type="text"
        autoComplete={"disabled"}
        onFocus={() => {
          setContentZIndex(2);
          searchInputValue && onChangeHandler(searchInputValue);
        }}
        onBlur={() => {
          setContentZIndex(1);
          setInputDataStore([]);
        }}
        onChange={(e) => onChangeHandler(e.target.value)}
      />
      {inputDataStore && inputDataStore.length > 0 && (
        <>
          <div
            className="auto-complete-list-wrapper"
            style={{ maxHeight: searchListHeight ? searchListHeight : 200 }}
          >
            <ul>
              {inputDataStore.map((data, index) => (
                <li
                  className={
                    searchInputValue.toLowerCase() === data.name.toLowerCase()
                      ? "selected"
                      : ""
                  }
                  key={index}
                  onMouseDown={() => {
                    onOptionClick(data);
                  }}
                >
                  <p className="option-name">{data.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoComplete;
