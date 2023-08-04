import React, { useEffect, useRef, useState } from "react";
import "../styles/aboutme.scss";
import tick from "../assests/icons/ic-combo-tick.svg";
import { INPUT_BOX_MAX_LENGTH } from "../constants/keys";

const SearchComboBox = ({
  inputData,
  defaultValue,
  isMultiSelect,
  inputCssClass,
  wrapperCssClass,
  placeholder,
  onSelect,
  searchListHeight,
  badgeThemeCssClass,
  hideBadges,
  isAllowUserDefined,
  maxCheckedItem,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [inputDataStore, setInputDataStore] = useState([]);
  const [inputDataStoreBackup, setInputDataStoreBackup] = useState([]);
  const [outputDataStore, setOutputDataStore] = useState([]);
  const [contentZIndex, setContentZIndex] = useState(1);
  const ref = useRef();

  useEffect(() => {
    if (inputData && inputData.length > 0) {
      const newInputData = [...inputData];
      newInputData.forEach((item) => {
        item.isSelect = false;
      });
      setInputDataStore(newInputData);
      setInputDataStoreBackup(newInputData);
    }
    if (defaultValue && defaultValue.length > 0) {
      setOutputDataStore(defaultValue);
      // if (!isMultiSelect) {
      //   setSearchInputValue(defaultValue[0]);
      //   const newInputData = [...inputData];
      //   const findItemIndex = newInputData.findIndex(
      //     (item) => item.name === defaultValue[0]
      //   );
      //   if (findItemIndex !== -1) {
      //     newInputData[findItemIndex].isSelect = true;
      //   }
      //   setInputDataStore(newInputData);
      //   setInputDataStoreBackup(newInputData);
      // } else {
      if (inputData && inputData.length > 0) {
        const newInputData = [...inputData];
        newInputData.forEach((item) => {
          if (defaultValue.includes(item.name)) item.isSelect = true;
        });
        setInputDataStore(newInputData);
        setInputDataStoreBackup(newInputData);
        searchInputValue && onChangeHandler(searchInputValue);
      }
      // }
    } else {
      setOutputDataStore([]);
      searchInputValue && onChangeHandler(searchInputValue);
    }
  }, [inputData, defaultValue]);

  const onChangeHandler = (text) => {
    setSearchInputValue(text);
    const newInputDataStoreBackup = [...inputDataStoreBackup];
    if (newInputDataStoreBackup && newInputDataStoreBackup.length > 0) {
      const searchList = newInputDataStoreBackup.filter(
        (data) => data.name.toLowerCase().search(text.toLowerCase()) !== -1
      );

      setInputDataStore(searchList);
    }
    setInputFocus(true);
  };

  const onOptionClick = (data, index) => {
    const newInputDataStore = [...inputDataStore];
    const newInputDataStoreBackup = [...inputDataStoreBackup];
    const newOutputDataStore = [...outputDataStore];
    const record = newInputDataStore[index];

    const findBackupItemIndex = newInputDataStoreBackup.findIndex(
      (item) => item.name === data.name
    );
    const findOutputItemIndex = newOutputDataStore.findIndex(
      (item) => item === newInputDataStore[index].name
    );
    if (record.isSelect) {
      newInputDataStore[index].isSelect = false;
      newInputDataStoreBackup[findBackupItemIndex].isSelect = false;

      if (findOutputItemIndex !== -1) {
        newOutputDataStore.splice(findOutputItemIndex, 1);
      }
    } else {
      if (maxCheckedItem) {
        if (newOutputDataStore.length < maxCheckedItem) {
          newInputDataStore[index].isSelect = true;
          newInputDataStoreBackup[findBackupItemIndex].isSelect = true;
          newOutputDataStore.push(newInputDataStore[index].name);
        }
      } else {
        newInputDataStore[index].isSelect = true;
        newInputDataStoreBackup[findBackupItemIndex].isSelect = true;
        newOutputDataStore.push(newInputDataStore[index].name);
      }
    }
    if (!isMultiSelect) {
      newInputDataStore.forEach((record, i) => {
        if (i !== index) {
          record.isSelect = false;
        } else {
          newOutputDataStore.length = 0;
          newOutputDataStore.push(record?.name);
          setSearchInputValue("");
          // setSearchInputValue(record?.name);
        }
      });

      newInputDataStoreBackup.forEach((record, i) => {
        if (i !== findBackupItemIndex) {
          record.isSelect = false;
        }
      });
      setInputFocus(false);
      setContentZIndex(1);
    }
    setOutputDataStore(newOutputDataStore);
    setInputDataStore(newInputDataStore);
    setInputDataStoreBackup(newInputDataStoreBackup);

    onSelect(newOutputDataStore);
  };

  const onCloseListClick = () => {
    setInputFocus(false);
    setInputDataStore(inputDataStoreBackup);
    setSearchInputValue("");
    setContentZIndex(1);
    // if (isMultiSelect) {
    //   setSearchInputValue("");
    // }else{
    // 	setSearchInputValue(defaultValue[0]);
    // }
  };

  const onCloseBadge = (name) => {
    if (name) {
      const newInputDataStore = [...inputDataStore];
      const newInputDataStoreBackup = [...inputDataStoreBackup];
      const newOutputDataStore = [...outputDataStore];
      const findOutputItemIndex = newOutputDataStore.findIndex(
        (item) => item === name
      );
      if (findOutputItemIndex !== -1) {
        newOutputDataStore.splice(findOutputItemIndex, 1);
      }
      newInputDataStore.forEach((item) => {
        if (item.name === name) {
          item.isSelect = false;
        }
      });
      newInputDataStoreBackup.forEach((item) => {
        if (item.name === name) {
          item.isSelect = false;
        }
      });
      setOutputDataStore(newOutputDataStore);
      onSelect(newOutputDataStore);
      setInputDataStore(newInputDataStore);
      setInputDataStoreBackup(newInputDataStoreBackup);
    }
  };

  const onClearSearchText = () => {
    setSearchInputValue("");
    setInputDataStore(inputDataStoreBackup);
  };

  const onAddCustomOption = () => {
    const newInputDataStore = [...inputDataStore];
    let newOutputDataStore = [...outputDataStore];
    if (searchInputValue !== "") {
      if (isMultiSelect) {
        if (
          !newInputDataStore.includes(searchInputValue) &&
          !newOutputDataStore.includes(searchInputValue)
        ) {
          newInputDataStore.push(searchInputValue);
          newOutputDataStore.push(searchInputValue);
        }
      } else {
        newOutputDataStore = [searchInputValue];
      }
    }

    setOutputDataStore(newOutputDataStore);
    setInputDataStore(newInputDataStore);
    onSelect(newOutputDataStore);
    onCloseListClick();
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (inputFocus && ref.current && !ref.current.contains(e.target)) {
        setInputFocus(false);
        setContentZIndex(1);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [inputFocus]);

  const onPressingEnter = (e) => {
    if (isAllowUserDefined && e?.keyCode === 13) {
      onAddCustomOption();
    }
  };

  return (
    <div
      className={`position-relative ${wrapperCssClass}`}
      style={{ zIndex: contentZIndex }}
      ref={ref}
    >
      {/* {!isMultiSelect && inputFocus && (
        <span className="combo-clear-search-text" onClick={onClearSearchText}>
          &times;
        </span>
      )} */}
      <input
        className={inputCssClass}
        placeholder={placeholder}
        value={searchInputValue}
        type="text"
        maxLength={INPUT_BOX_MAX_LENGTH}
        onFocus={() => {
          setInputFocus(true);
          setContentZIndex(2);
        }}
        onChange={(e) => onChangeHandler(e.target.value)}
        onKeyDown={(e) => onPressingEnter(e)}
      />

      {inputFocus && inputDataStore && inputDataStore.length > 0 ? (
        <>
          <div className="position-relative">
            <div className="combo-close-list" onClick={onCloseListClick}></div>
          </div>
          <div
            className="combo-list-wrapper"
            style={{ maxHeight: searchListHeight ? searchListHeight : 200 }}
          >
            {/* <div className="close-list" onClick={onCloseListClick}></div> */}

            <ul>
              {isAllowUserDefined && (
                <li onClick={onAddCustomOption}>
                  <p
                    className="ml-4"
                    // className="option-name text-primary ml-4"

                    style={{ marginLeft: "2.4rem" }}
                  >
                    {/* Use custom option */}
                    {searchInputValue}
                  </p>
                </li>
              )}

              {inputDataStore.map((data, index) => (
                <li
                  className={data.isSelect ? "selected" : ""}
                  key={index}
                  onClick={() => {
                    onOptionClick(data, index);
                  }}
                >
                  <p className="icon">
                    {data.isSelect && <img src={tick} alt="" />}
                  </p>
                  <p className="option-name">{data.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        inputFocus &&
        searchInputValue.length > 0 &&
        inputDataStore.length === 0 &&
        isAllowUserDefined &&
        searchInputValue.trim().length > 0 && (
          <>
            <div className="position-relative">
              <div
                className="combo-close-list"
                onClick={onCloseListClick}
              ></div>
            </div>
            <div
              className="combo-list-wrapper"
              style={{ maxHeight: searchListHeight ? searchListHeight : 200 }}
            >
              <ul>
                <li onClick={onAddCustomOption}>
                  <p
                    // className="option-name text-primary px-4"
                    className="px-4"
                    style={{ marginLeft: "1rem" }}
                  >
                    {/* Use custom option */}
                    {searchInputValue}
                  </p>
                </li>
              </ul>
            </div>
          </>
        )
      )}

      {!hideBadges && outputDataStore && outputDataStore.length > 0 && (
        <div className="combo-multi-selected-output">
          {outputDataStore.map((item, index) => (
            <div
              className={`badge-wrapper ${
                badgeThemeCssClass ? badgeThemeCssClass : ""
              }`}
              key={index}
            >
              <p className="name">{item}</p>
              <p
                className="close-badge"
                onClick={() => {
                  onCloseBadge(item);
                }}
              >
                &times;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComboBox;
