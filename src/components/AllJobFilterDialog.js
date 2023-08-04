import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import filterIcon from "./../assests/icons/ic-filter-16.svg";
import closeroundbtn from "../assests/icons/ic_closeroundbtn.svg";
import minus from "../assests/icons/ic_minus.svg";
import plus from "../assests/icons/ic_plus.svg";
import SearchComboBox from "./SearchComboBox";
import IcDoneWhite from "../assests/icons/ic_done_white.svg";
import {
  getMaster,
  getCurrency,
  getLocations,
} from "../_services/view.service";
import { MASTER_TYPE, USER_ID } from "../constants/keys";
import toaster from "../utils/toaster";
import Loader from "./common/loader";
import { updateJobPreferences } from "../_services/member-profile.service";
import { useStoreState, useStoreActions } from "easy-peasy";
import { getLocalStorage } from "../utils/storage";
import { isEmpty } from "../utils/form_validators";
import { DEFAULT_PAGE_SIZE } from "../constants/config";

const AllJobFilter = (props) => {
  const [masterRoleList, setMasterRoleList] = useState([]);
  const [masterFunctionsList, setMasterFunctionsList] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [masterSalaryType, setMasterSalaryType] = useState([]);
  const [notAValidReferralAmount, setNotAValidReferralAmount] = useState(false);
  const [notAValidSalary, setNotAValidSalary] = useState(false);

  // const workModeHandler = (workMode) => {
  //   props?.setselectedWorkMode(workMode);
  // };
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const [masterWorkModeList, setMasterWorkModeList] = useState([]);
  const [isPreferenceChecked, setIsPreferenceChecked] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [initialFilter, setInitialFilter] = useState(props?.allJobFilterData);

  const inputSalaryref = useRef();
  const inputReferrelref = useRef();
  const selectSalaryPeriodRef = useRef();
  const selectReferrelCurrencyRef = useRef();
  const selectSalaryCurrencyRef = useRef();
  //count function and state
  const [count, setCount] = useState("");
  const [count2, setCount2] = useState("");

  const getAllMasterData = async () => {
    const jobType = await getMaster(MASTER_TYPE.JOBTYPES);
    const roles = await getMaster(MASTER_TYPE.JOBROLE);
    const functions = await getMaster(MASTER_TYPE.FUNCTIONS);
    const workmode = await getMaster(MASTER_TYPE.WORKMODE);
    const location = await getLocations(MASTER_TYPE.LOCATION);
    const currency = await getCurrency();
    const salaryType = await getMaster(MASTER_TYPE.SALARYTYPE);

    if (roles && roles.length > 0) {
      const roleValues = roles?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (roleValues && roleValues.length > 0) {
        setMasterRoleList(roleValues);
      }
    }
    if (currency && currency.length > 0) {
      const currencyValues = currency?.map((currency) => currency.code);
      if (currencyValues && currencyValues.length > 0) {
        setCurrencies(currencyValues);
      }
    }
    if (functions && functions.length > 0) {
      const functionsValues = functions?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (functionsValues && functionsValues.length > 0) {
        setMasterFunctionsList(functionsValues);
      }
    }

    if (salaryType && salaryType.length > 0) {
      setMasterSalaryType(salaryType);
    }

    if (workmode && workmode.length > 0) {
      setMasterWorkModeList(workmode);
    }

    // if (location && location.length > 0) {
    let locationValues = location?.data;
    // const locationValues = location?.map(
    //   (item) => item.masterValue && { name: item.masterValue }
    // );
    if (locationValues && locationValues.length > 0) {
      setLocationList(locationValues);
    }

    // }
    if (jobType && jobType.length > 0) {
      setJobTypes(jobType);
    }
  };

  // console.log("locationList", locationList);
  useEffect(() => {
    getAllMasterData();
  }, []);

  const resetValue = () => {
    // const pageFilter = {
    //   pageNo: props?.allJobFilterData?.pageNo,
    //   pageSize: props?.allJobFilterData?.pageSize,
    // };
    // props.setAllJobFilterData(pageFilter);
    // props?.setTempJobFilter({});
    // props?.setselectedWorkMode([]);
    // props?.setselectedSubRole([]);
    props?.setAllJobFilterData({
      ...props?.allJobFilterData,
      workMode: [],
      location: [],
      role: [],
      jobType: [],
      function: [],
      salaryCurrency: "",
      salaryType: "",
      minSalary: "",
      bonusAmount: "",
      bonusCurrency: "",
    });
  };

  const resetTempValue = () => {
    const pageFilter = {
      pageNo: props?.allJobFilterData?.pageNo,
      pageSize: props?.allJobFilterData?.pageSize,
    };

    props?.setTempJobFilter({});
    props?.setselectedWorkMode([]);
    props?.setselectedSubRole([]);
  };

  const [allowFilter, setAllowFilter] = useState(true);

  useEffect(() => {
    // if (
    //   JSON.stringify(props?.allJobFilterData) == JSON.stringify(initialFilter)
    // ) {
    //   setAllowFilter(false);
    // } else {
    //   setAllowFilter(true);
    // }

    if (props?.allJobFilterData?.minExpYrs)
      setCount(Number(props?.allJobFilterData?.minExpYrs));
    if (props?.allJobFilterData?.maxExpYrs)
      setCount2(Number(props?.allJobFilterData?.maxExpYrs));
  }, [props?.allJobFilterData, initialFilter]);

  useEffect(() => {
    if (props?.allJobFilterData?.workMode && props?.show) {
      props?.setselectedWorkMode(props?.allJobFilterData?.workMode);
    } else {
      props?.setselectedWorkMode([]);
    }
    if (props?.allJobFilterData?.jobType && props?.show) {
      props?.setselectedSubRole(props?.allJobFilterData?.jobType);
    } else {
      props?.setselectedSubRole([]);
    }
    if (props?.allJobFilterData) {
      props?.setTempJobFilter(props?.allJobFilterData);
    }
  }, [props?.show]);

  const isValidCurrency = () => {
    let isValid = true;
    if (
      (props?.tempJobFilter?.salaryCurrency ||
        props?.tempJobFilter?.minSalary ||
        props?.tempJobFilter?.salaryType) &&
      !(
        props?.tempJobFilter?.salaryCurrency &&
        props?.tempJobFilter?.minSalary &&
        props?.tempJobFilter?.salaryType
      )
    ) {
      setNotAValidSalary(true);
      isValid = false;
    } else {
      setNotAValidSalary(false);
    }
    if (
      (props?.tempJobFilter?.bonusCurrency ||
        props?.tempJobFilter?.bonusAmount) &&
      !(
        props?.tempJobFilter?.bonusCurrency && props?.tempJobFilter?.bonusAmount
      )
    ) {
      setNotAValidReferralAmount(true);
      isValid = false;
    } else {
      setNotAValidReferralAmount(false);
    }
    return isValid;
  };
  // useEffect(() => {
  //   resetValue();
  //   if (props.componentName === "For Application")
  //     props.fetchRecommendedJobs(props.allJobFilterData);
  //   else if (props.componentName === "For Referrals")
  //     props.fetchRefereeRecommendedJobs(props.allJobFilterData);
  //   else if (props.componentName === "allJob")
  //     props.fetchAllJobs(props.allJobFilterData);
  // }, [props?.componentName]);

  const applyFilter = () => {
    if (isValidCurrency()) {
      clearProperties();
      if (props?.setHashValue) {
        props?.setHashValue(props?.componentName);
      }
      // console.log(
      //   "filter data params",
      //   props?.tempJobFilter,
      //   props?.allJobFilterData
      // );
      props.setAllFilterDataParams({
        // ...props?.allJobFilterData,
        ...props?.tempJobFilter,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      setInitialFilter(props?.tempJobFilter);
      // if (allowFilter)
      if (allowFilter) {
        if (props.componentName === "For Application")
          props.fetchRecommendedJobs({
            ...props?.allJobFilterData,
            ...props?.tempJobFilter,
            pageNo: 1,
            pageSize: DEFAULT_PAGE_SIZE,
          });
        else if (props.componentName === "For Referrals")
          props.fetchRefereeRecommendedJobs({
            ...props?.allJobFilterData,
            ...props?.tempJobFilter,
            pageNo: 1,
            pageSize: DEFAULT_PAGE_SIZE,
          });
        else if (props.componentName === "allJob") {
          // props?.setTotalJobCount(0);
          // let copyJobList = props?.jobList;
          // copyJobList = [];

          props.fetchAllJobs({
            ...props?.allJobFilterData,
            ...props?.tempJobFilter,
            pageNo: 1,
            pageSize: DEFAULT_PAGE_SIZE,
          });
        }

        props.setAllJobFilterData({
          // ...props?.allJobFilterData,
          ...props?.tempJobFilter,
          pageNo: 1,
          pageSize: DEFAULT_PAGE_SIZE,
        });
      }

      if (isPreferenceChecked) {
        setShowLoader(true);
        updateJobPreferences(
          props?.tempJobFilter?.role,
          props?.tempJobFilter?.function,
          props?.tempJobFilter?.location,
          props?.tempJobFilter?.workMode,
          props?.tempJobFilter?.salaryCurrency,
          props?.tempJobFilter?.minSalary,
          props?.tempJobFilter?.salaryType,
          props?.tempJobFilter?.minExpYrs,
          props?.tempJobFilter?.maxExpYrs,
          candidateDetails?.userJobPreferences?.dreamCompany
        )
          .then((res) => {
            toaster("success", res?.data?.message);
            setShowLoader(false);
            const userId = getLocalStorage(USER_ID);
            if (userId) {
              saveCandidateDetails(userId);
            }
          })
          .catch((err) => {
            toaster("error", err);
            setShowLoader(false);
          });
      }
      props.setShow(false);
    } else {
      toaster("error", "Please select all required field");
    }
  };

  const calculateMin = (value) => {
    let zeroLetter = value?.charAt(0);
    if (zeroLetter === "0") {
      value = value?.slice(1);
    }
    if (!value) {
      setCount(0);
    } else {
      let number = Number(value);
      if (number > count2) {
        setCount2(number);
        setCount(number);
      } else {
        setCount(number);
      }
    }
  };

  const calculateMax = (value) => {
    let zeroLetter = value?.charAt(0);
    if (zeroLetter === "0") {
      value = value?.slice(1);
    }
    if (!value) {
      setCount2(0);
       setCount(0);
    } else {
      let number = Number(value);
      if (number < count) {
        setCount(number);
        setCount2(number);
      } else {
        setCount2(number);
      }
    }
  };

  useEffect(() => {
    let minYear = count.toString();
    if (minYear != "0")
      props?.setTempJobFilter({
        ...props?.tempJobFilter,
        minExpYrs: minYear,
      });
  }, [count]);

  useEffect(() => {
    let maxYear = count2.toString();
    if (maxYear != "0")
      props?.setTempJobFilter({
        ...props?.tempJobFilter,
        maxExpYrs: maxYear,
      });
  }, [count2]);

  const clearProperties = () => {
    Object.keys(props?.tempJobFilter)?.forEach((key) => {
      let copyAllJob = props?.tempJobFilter;
      if (
        typeof props?.tempJobFilter[key] === typeof [] &&
        isEmpty(props?.tempJobFilter[key])
      ) {
        delete copyAllJob[key];
      }
      props?.setTempJobFilter(copyAllJob);
    });

    //All job filter
    Object.keys(props?.allJobFilterData)?.forEach((key) => {
      let copyAllJob = props?.allJobFilterData;
      if (
        typeof props?.allJobFilterData[key] === typeof [] &&
        isEmpty(props?.allJobFilterData[key])
      ) {
        delete copyAllJob[key];
      }
      props?.setAllJobFilterData(copyAllJob);
    });
  };

  const removeProperty = (name) => {
    let copyallJobFilterData = props.allJobFilterData;
    let copyTempJobFilter = props?.tempJobFilter;
    delete copyTempJobFilter[name];
    delete copyallJobFilterData[name];
    props?.setTempJobFilter(copyTempJobFilter);
    props.setAllJobFilterData(copyallJobFilterData);
  };

  useEffect(() => {
  }, [props.selectedSubRole, props?.tempJobFilter, props?.allJobFilterData]);

  const subRoleSelection = (masterCode) => {
    if (props.selectedSubRole.includes(masterCode)) {
      let indexValue = props.selectedSubRole.indexOf(masterCode);
      let selectedValue = [
        ...props.selectedSubRole.slice(0, indexValue),
        ...props.selectedSubRole.slice(indexValue + 1),
      ];
      props?.setselectedSubRole(selectedValue);
      let index = props?.tempJobFilter.jobType.indexOf(masterCode);

      props?.setTempJobFilter({
        ...props?.tempJobFilter,
        jobType: [
          ...props?.tempJobFilter.jobType.slice(0, index),
          ...props?.tempJobFilter.jobType.slice(index + 1),
        ],
      });
    } else {
      if (!props?.tempJobFilter.jobType) {
        props?.setselectedSubRole([...props.selectedSubRole, masterCode]);
        props?.setTempJobFilter({
          ...props?.tempJobFilter,
          jobType: [masterCode],
        });
      } else {
        props?.setselectedSubRole([...props.selectedSubRole, masterCode]);
        props?.setTempJobFilter({
          ...props?.tempJobFilter,
          jobType: [...props?.tempJobFilter.jobType, masterCode],
        });
      }
    }
  };

  const workModeSelection = (masterCode) => {
    if (props?.selectedWorkMode.includes(masterCode)) {
      let indexValue = props?.selectedWorkMode.indexOf(masterCode);
      let selectedValue = [
        ...props?.selectedWorkMode.slice(0, indexValue),
        ...props?.selectedWorkMode.slice(indexValue + 1),
      ];
      props?.setselectedWorkMode(selectedValue);
      let index = props?.tempJobFilter.workMode.indexOf(masterCode);

      props?.setTempJobFilter({
        ...props?.tempJobFilter,
        workMode: [
          ...props?.tempJobFilter.workMode.slice(0, index),
          ...props?.tempJobFilter.workMode.slice(index + 1),
        ],
      });
    } else {
      if (!props?.tempJobFilter.workMode) {
        props?.setselectedWorkMode([...props?.selectedWorkMode, masterCode]);
        props?.setTempJobFilter({
          ...props?.tempJobFilter,
          workMode: [masterCode],
        });
      } else {
        props?.setselectedWorkMode([...props?.selectedWorkMode, masterCode]);
        props?.setTempJobFilter({
          ...props?.tempJobFilter,
          workMode: [...props?.tempJobFilter.workMode, masterCode],
        });
      }
    }
  };

  const clearData = (field, all) => {
    if (field.length > 0 && field === "function") {
      props?.setTempJobFilter({ ...props.tempJobFilter, function: [] });
      props.setAllJobFilterData({ ...props.allJobFilterData, function: [] });
    }
    if (field.length > 0 && field === "role") {
      props?.setselectedSubRole([]);
      props?.setTempJobFilter({
        ...props.tempJobFilter,
        role: [],
        jobType: [],
      });
      props.setAllJobFilterData({
        ...props.allJobFilterData,
        role: [],
        jobType: [],
      });
    }
    if (field.length > 0 && field === "location") {
      props?.setTempJobFilter({ ...props.tempJobFilter, location: [] });
      props.setAllJobFilterData({ ...props.allJobFilterData, location: [] });
    }
    if (field.length > 0 && field === "workMode") {
      props?.setTempJobFilter({ ...props.tempJobFilter, workMode: [] });
      props.setAllJobFilterData({ ...props.allJobFilterData, workMode: [] });
      props?.setselectedWorkMode([]);
    }
    if (all) {
      props?.setTempJobFilter({
        ...props?.tempJobFilter,
        workMode: [],
        location: [],
        role: [],
        jobType: [],
        function: [],
        salaryCurrency: "",
        salaryType: "",
        minSalary: "",
        minExpYrs: "",
        maxExpYrs: "",
        bonusAmount: "",
        bonusCurrency: "",
      });
      props?.setAllJobFilterData({
        ...props?.allJobFilterData,
        workMode: [],
        location: [],
        role: [],
        jobType: [],
        function: [],
        salaryCurrency: "",
        salaryType: "",
        minSalary: "",
        minExpYrs: "",
        maxExpYrs: "",
        bonusAmount: "",
        bonusCurrency: "",
      });
      setCount("");
      setCount2("");
      props?.setselectedWorkMode([]);
      props?.setselectedSubRole([]);
      inputSalaryref.current.value = "";
      inputReferrelref.current.value = "";

      selectSalaryCurrencyRef.current.value = "";
      selectSalaryPeriodRef.current.value = "";
      selectReferrelCurrencyRef.current.value = "";
    }
  };

  const incrementMinimumYears = () => {
    if (count === count2) {
      setCount(Number(count) + 1);
      setCount2(Number(count2) + 1);
    } else {
      setCount(Number(count) + 1);
    }
  };

  const decrementMinimumYears = () => {
    if (count <= 0) {
      setCount("0");
    } else {
      setCount(Number(count) - 1);
    }
  };

  const incrementMaximumYears = () => {
    setCount2(Number(count2) + 1);
  };

  const decrementMaximumYears = () => {
    if (count2 == 0) {
      setCount("0");
      setCount2("0");
    } else if (count === count2) {
      setCount(Number(count) - 1);
      setCount2(Number(count2) - 1);
    } else {
      setCount2(Number(count2) - 1);
    }
  };

  return (
    <div>
      {showLoader && <Loader />}
      <Modal
        show={props.show}
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
        fullscreen="lg-down"
        className="lg-dialog-modal dialog-wrapper"
      >
        <Modal.Header className="d-flex flex-wrap flex-wrap justify-content-between pt-4 pb-3">
          <div className="d-flex flex-wrap flex-wrap  gap-2 fs-16 fw-600 color-primary">
            <img src={filterIcon} alt="" />
            <span> Filters </span>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <span
              className=" dark-pink-text fs-12 pt-1 pointer"
              onClick={() => {
                clearData("", true);
              }}
            >
              {" "}
              Clear All{" "}
            </span>
            <div
              onClick={() => {
                props.onShowHandler();
                resetTempValue();
              }}
              className="pointer"
            >
              <img
                src={closeroundbtn}
                alt="close-icon"
                className=""
                width="25px"
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <div className="container">
            <div>
              <div className="d-flex flex-wrap justify-content-between">
                <span className="fs-14 color-primary fw-700"> Roles </span>
                <span
                  className="dark-pink-text fs-12 pointer"
                  onClick={() => {
                    clearData("role", false);
                  }}
                >
                  {" "}
                  Clear{" "}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2 pt-3">
                {jobTypes?.map((subRole, index) => {
                  return (
                    <button
                      className="btn jobs-filter-button bg-white text-center d-flex flex-wrap px-2 py-1"
                      onClick={() => {
                        subRoleSelection(subRole.masterCode);
                      }}
                      key={index}
                    >
                      <span
                        style={{ height: "20px", width: "20px" }}
                        className={
                          props.selectedSubRole.includes(subRole.masterCode)
                            ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                            : "d-none"
                        }
                      >
                        <img
                          src={IcDoneWhite}
                          alt="whitedone-icon"
                          className=""
                        />
                      </span>
                      {subRole.masterValue}
                    </button>
                  );
                })}
              </div>
              <div className="pt-3">
                <SearchComboBox
                  inputData={masterRoleList}
                  defaultValue={props.allJobFilterData.role}
                  isMultiSelect={true}
                  inputCssClass={"modal-input combo-search-box"}
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search or Select"}
                  onSelect={(event) => {
                    props?.setTempJobFilter({
                      ...props?.tempJobFilter,
                      role: [...event],
                    });
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={"gray"}
                  isAllowUserDefined={false}
                />
              </div>
            </div>
            <hr></hr>
            <div className="pt-2">
              <div className="d-flex flex-wrap justify-content-between">
                <span className="fs-14 color-primary fw-700"> Functions </span>
                <span
                  className="dark-pink-text fs-12 pointer"
                  onClick={() => {
                    clearData("function", false);
                  }}
                >
                  {" "}
                  Clear{" "}
                </span>
              </div>
              <div className="pt-3">
                <SearchComboBox
                  inputData={masterFunctionsList}
                  defaultValue={props.allJobFilterData.function}
                  isMultiSelect={true}
                  inputCssClass={"modal-input combo-search-box"}
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search or Select"}
                  onSelect={(event) => {
                    props?.setTempJobFilter({
                      ...props?.tempJobFilter,
                      function: [...event],
                    });
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={"gray"}
                  isAllowUserDefined={false}
                />
              </div>
            </div>
            <hr></hr>
            <div className="pt-1">
              <div className="d-flex flex-wrap justify-content-between pt-2">
                <span className="fs-14 color-primary fw-700"> Work Mode</span>
                <span
                  className="dark-pink-text fs-12 pointer"
                  onClick={() => {
                    clearData("workMode", false);
                  }}
                >
                  {" "}
                  Clear{" "}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2 pt-3">
                {masterWorkModeList.map((workMode, index) => {
                  return (
                    <button
                      className="btn jobs-filter-button bg-white text-center d-flex flex-wrap px-2 py-1 form-select-width "
                      onClick={() => {
                        workModeSelection(workMode.masterCode);
                      }}
                      key={index}
                    >
                      <span
                        style={{ height: "20px", width: "20px" }}
                        className={
                          props?.selectedWorkMode.includes(workMode.masterCode)
                            ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                            : "d-none"
                        }
                      >
                        <img src={IcDoneWhite} alt="whitedone-icon" />
                      </span>
                      {workMode.masterValue}
                    </button>
                  );
                })}
              </div>
              <hr></hr>
              <div>
                <div className="d-flex flex-wrap justify-content-between pt-2">
                  <span className="fs-14 color-primary fw-700">
                    {" "}
                    Locations{" "}
                  </span>
                  <span
                    className="dark-pink-text fs-12 pointer"
                    onClick={() => {
                      clearData("location", false);
                    }}
                  >
                    {" "}
                    Clear{" "}
                  </span>
                </div>
                <div className="pt-3">
                  <SearchComboBox
                    inputData={locationList}
                    isMultiSelect={true}
                    defaultValue={props.allJobFilterData.location}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => {
                      props?.setTempJobFilter({
                        ...props?.tempJobFilter,
                        location: event,
                      });
                    }}
                    searchListHeight={150}
                    badgeThemeCssClass={"gray"}
                    isAllowUserDefined={false}
                  />
                </div>
              </div>
              <hr></hr>
              <div>
                <div className="fs-14 color-primary fw-700">
                  {" "}
                  Minimum Salary
                </div>
                <div className="d-flex flex-wrap mt-3 gap-2">
                  <select
                    className="form-select rounded-pill form-select-width pt-1 pb-1 pointer"
                    aria-label="Default select example"
                    defaultValue={props?.allJobFilterData?.salaryCurrency}
                    ref={selectSalaryCurrencyRef}
                    onChange={(event) => {
                      if (event.target.value !== "select") {
                        props?.setTempJobFilter({
                          ...props?.tempJobFilter,
                          salaryCurrency: event.target.value,
                        });
                      } else {
                        removeProperty("salaryCurrency");
                      }
                    }}
                  >
                    {!props?.allFilterDataParams?.salaryCurrency ? (
                      <option value="" selected>
                        Currency
                      </option>
                    ) : (
                      <option>Currency</option>
                    )}
                    {currencies &&
                      currencies.map((currency) => {
                        return (
                          // props?.allJobFilterData?.salaryCurrency &&
                          // currency ===
                          //   props?.allJobFilterData?.salaryCurrency ? null : (
                          <>
                            <option value={currency}> {currency}</option>
                          </>
                        );
                      })}
                  </select>
                  <select
                    className="form-select rounded-pill form-select-width pt-1 pb-1 pointer"
                    aria-label="Default select example"
                    defaultValue={props?.allJobFilterData?.salaryType}
                    ref={selectSalaryPeriodRef}
                    onChange={(event) => {
                      if (event.target.value !== "select")
                        props?.setTempJobFilter({
                          ...props?.tempJobFilter,
                          salaryType: event.target.value,
                        });
                      else {
                        removeProperty("salaryType");
                      }
                    }}
                  >
                    {/* {props?.allJobFilterData?.salaryType ? (
                      <>
                        {masterSalaryType.map((salaryType) => {
                          if (
                            salaryType.masterCode ===
                            props?.allJobFilterData?.salaryType
                          )
                            return (
                              <>
                                <option selected>
                                  {salaryType.masterValue}
                                </option>
                              </>
                            );
                        })}
                        <option>select</option>
                        
                      </>
                    ) : (
                      <>
                        <option selected>select</option>
                      </>
                    )} */}
                    {!props?.allFilterDataParams?.salaryType ? (
                      <option value="" selected>
                        Time Frame
                      </option>
                    ) : (
                      <option>Time Frame</option>
                    )}

                    {masterSalaryType.map((salaryType) => {
                      return (
                        // salaryType?.masterValue === "lakh per annum" ||
                        //   salaryType?.masterCode ===
                        //     props?.allJobFilterData?.salaryType) ? null : (

                        <>
                          <option value={salaryType.masterCode}>
                            {" "}
                            {salaryType.masterValue}{" "}
                          </option>
                        </>
                      );
                    })}
                  </select>
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    className="color-primary modal-form-input "
                    placeholder=" Enter Salary "
                    defaultValue={props?.allJobFilterData?.minSalary}
                    ref={inputSalaryref}
                    onChange={(e) => {
                      props?.setTempJobFilter({
                        ...props?.tempJobFilter,
                        minSalary: e.target.value,
                      });
                    }}
                  />
                </div>
                {notAValidSalary && (
                  <div className="field-error mt-1">
                    Please select all the options
                  </div>
                )}
              </div>

              <hr></hr>
              <div className="mt-3 mb-2">
                <div className="fs-14 color-primary fw-700">
                  {" "}
                  Experience Required
                </div>
                <div className="d-flex flex-wrap mt-4">
                  <div className="col-lg-6 col-md-6 col-sm-12 my-1">
                    <h6 className="small-text-dark-gray fw-400">
                      Minimum years
                    </h6>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      <button
                        className="btn rounded border ps-3 pe-3"
                        onClick={decrementMinimumYears}
                      >
                        {" "}
                        <img src={minus} alt="minus-icon" />
                      </button>
                      <input
                        type="number"
                        className="ps-3 pe-3 btn rounded border w-25 text-center"
                        // defaultValue={count}
                        value={count}
                        onKeyDown={(evt) =>
                          evt.key === "e" && evt.preventDefault()
                        }
                        // value={count}
                        onChange={(e) => {
                          calculateMin(e.target.value);
                        }}
                      />

                      <button
                        className="btn rounded border ps-3 pe-3"
                        onClick={incrementMinimumYears}
                      >
                        {" "}
                        <img src={plus} alt="plus-icon" />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12  my-1">
                    <h6 className="small-text-dark-gray fw-400">
                      Maximum years
                    </h6>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      <button
                        className="btn rounded border ps-3 pe-3"
                        onClick={decrementMaximumYears}
                      >
                        {" "}
                        <img src={minus} alt="minus-icon" />
                      </button>
                      <input
                        type="number"
                        className="ps-3 pe-3 btn rounded border w-25 text-center"
                        // defaultValue={count2}
                        value={count2}
                        onKeyDown={(evt) =>
                          evt.key === "e" && evt.preventDefault()
                        }
                        onChange={(e) => {
                          calculateMax(e.target.value);
                        }}
                      />

                      <button
                        className="btn rounded border ps-3 pe-3"
                        onClick={incrementMaximumYears}
                      >
                        {" "}
                        <img src={plus} alt="plus-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div>
                <div className="fs-14 color-primary fw-700">
                  {" "}
                  Minimum Referral Bonus
                </div>
                <div className="d-flex flex-wrap mt-3 gap-2">
                  <select
                    className="form-select rounded-pill form-select-width pt-1 pb-1 pointer"
                    aria-label="Default select example"
                    ref={selectReferrelCurrencyRef}
                    defaultValue={props?.allJobFilterData?.bonusCurrency}
                    onChange={(event) => {
                      props?.setTempJobFilter({
                        ...props?.tempJobFilter,
                        bonusCurrency: event.target.value,
                      });
                    }}
                  >
                    {!props?.allFilterDataParams?.bonusCurrency ? (
                      <option value="" selected>
                        Currency
                      </option>
                    ) : (
                      <option>Currency</option>
                    )}
                    {currencies &&
                      currencies.map((currency) => {
                        return (
                          <>
                            <option value={currency}> {currency}</option>
                          </>
                        );
                      })}
                  </select>
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    className="modal-form-input color-primary"
                    defaultValue={props?.allJobFilterData?.bonusAmount}
                    ref={inputReferrelref}
                    placeholder=" Enter bonus amount"
                    onChange={(event) => {
                      props?.setTempJobFilter({
                        ...props?.tempJobFilter,
                        bonusAmount: event.target.value,
                      });
                    }}
                  />
                </div>
                {notAValidReferralAmount && (
                  <div className="field-error mt-1">
                    Please select both the options
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-dialog-footer d-flex flex-no-wrap justify-content-between filter-dialog-footer">
          <div className="flex-1 d-flex align-items-center">
            <input
              style={{ marginTop: "0" }}
              className="form-check-input flex-0"
              type="checkbox"
              defaultChecked={isPreferenceChecked}
              onClick={() => setIsPreferenceChecked(!isPreferenceChecked)}
              id="flexCheckDefault"
            />
            <label
              htmlFor="flexCheckDefault"
              className="form-check-label ps-2 small-text-dark-gray fw-400"
            >
              Save changes to My Preferences also
            </label>
          </div>
          <button
            className="btn-black flex-0"
            onClick={() => {
              // resetTempValue();
              applyFilter();

              // clearData("", true);
            }}
          >
            {" "}
            Apply{" "}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllJobFilter;
