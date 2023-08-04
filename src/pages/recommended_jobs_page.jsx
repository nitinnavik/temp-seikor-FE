import React, { useEffect, useState, useRef } from "react";
import JobCard from "../components/JobCard";
import JobCardCompany from "../components/JobCardCompany";
import JobCardExperience from "../components/JobCardExperience";
import JobCardLocation from "../components/JobCardLocation";
import JobCardReferralBonus from "../components/JobCardReferralBonus";
import JobCardSalary from "../components/JobCardSalary";
import JobCardSave from "../components/JobCardSave";
import JobCardWhyLook from "../components/JobCardWhyLook";
import filterIcon from "./../assests/icons/ic-filter-16.svg";
import icSort from "./../assests/icons/ic_sort.svg";
import jobCompanyLogo from "./../assests/images/job-company-logo.png";
import featuredImage from "./../assests/images/job-featured.jpg";
import SwitchButton from "./../components/SwitchButton";
import jobReferencesSmallImage from "./../assests/images/job-references-small.png";
import Dropdown from "react-bootstrap/Dropdown";
import blackdone from "../assests/icons/ic_blackdone.svg";
import {
  Link,
  unstable_HistoryRouter,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AllJobFilter from "../components/AllJobFilterDialog";
import { getRecommendedJobs } from "../_services/view.service";
import { isEmpty } from "../utils/form_validators";
import toaster from "./../utils/toaster";
import { convertInThousand, isCheckValue } from "./../utils/utils";
import { filterfeaturedJobs } from "./../utils/featured_job_layout";
import Loader from "./../components/common/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import JobSearchPreferenceDialog from "../components/job_search_preference_dialog";
import RefereeRecommendedJobPage from "../components/referee_recommended_job";
import NoDataFoundCard from "../components/common/no_data_found_card";
import ReferAJobDialog from "../components/refer_a_job_dialog";
import { useStoreActions, useStoreState } from "easy-peasy";
import RecommendedJobDialog from "../components/recommended_job_dialog";
import {
  GENERAL_ERROR_MESSAGE,
  JOB_FETCH_FAILED,
  REECOMMENDED_JOB_EMPTY_MESSAGE,
} from "../constants/message";
import { SORT, TOKEN } from "../constants/keys";
import CompanyImage from "./../components/company_image";
import { fetchRefereeRecommendation } from "../_services/job.service";
import RefereeProfileEditDialog from "../components/referrals-preferences-edit/referrals-preferences-edit-dialog";
import NotFoundPage from "./not_found_page";
import { getLocalStorage } from "../utils/storage";
import Header from "../components/common/header";
import StaticHeader from "../components/common/staticHeader";

const RecommendedJobsPage = () => {
  const location = useLocation();
  let navigate = useNavigate();

  const [dataCount, setDataCount] = useState(0);
  const [refereeDataCount, setRefereeDataCount] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [refereeJobList, setRefereeJobList] = useState([]);
  const [refereeJobMessage, setRefereeJobMessage] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [switchValue, setSwitchValue] = useState("For Application");
  const [arraySortIndex, setArraySortIndex] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [referreCount, setReferreCount] = useState(0);
  const [jobMessage, setJobMessage] = useState();
  const [hashValue, setHashValue] = useState("For Application");

  const [selectedWorkMode, setselectedWorkMode] = useState([]);
  const [selectedSubRole, setselectedSubRole] = useState([]);

  const [filterDataParams, setFilterDataParams] = useSearchParams();

  let infiniteScroll = false;
  let infiniteReferralScroll = false;
  const [referJobShow, setReferJobShow] = useState(false);
  const [referButtonClicked, setReferButtonClicked] = useState(false);
  const [disableReferralBtn, setDisableReferralBtn] = useState(true);
  const [jobIdProps, setJobIdProps] = useState(null);
  const [jobDetailsProps, setJobDetailsProps] = useState();
  const [tempJobFilter, setTempJobFilter] = useState({});
  let initialFilter = {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
  const [allJobFilterData, setAllJobFilterData] = useState(initialFilter);

  const [allRefereeFilterData, setAllRefereeFilterData] =
    useState(initialFilter);

  const refereeRefferalJobs = useRef();

  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );

  const [showJobPreferencesMessage, setShowJobPreferencesMessage] =
    useState(true);

  const [showRefereePreferencesMessage, setShowRefereePreferencesMessage] =
    useState(true);
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );

  useEffect(() => {
    if (candidateDetails?.userJobPreferences) {
      if (
        isCheckValue(candidateDetails?.userJobPreferences?.dreamCompany) ||
        isCheckValue(candidateDetails?.userJobPreferences?.preferedLocation) ||
        isCheckValue(candidateDetails?.userJobPreferences?.preferedRoles) ||
        isCheckValue(candidateDetails?.userJobPreferences?.preferedTeams) ||
        isCheckValue(candidateDetails?.userJobPreferences?.preferedWorkmode) ||
        isCheckValue(candidateDetails?.userJobPreferences?.expectedSalary) ||
        isCheckValue(candidateDetails?.userJobPreferences?.maxExperience) ||
        isCheckValue(candidateDetails?.userJobPreferences?.minExperience) ||
        isCheckValue(candidateDetails?.userJobPreferences?.salaryCurrency)
      ) {
        setShowJobPreferencesMessage(false);
        setShowJobPreferenceDialogMessage("d-none");
      } else {
        setShowJobPreferencesMessage(true);
        setShowJobPreferenceDialogMessage("d-block");
      }
    } else {
      setShowJobPreferencesMessage(true);
      setShowJobPreferenceDialogMessage("d-block");
    }

    if (candidateDetails?.refereePreferencesResponse) {
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.dreamCompany
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedLocation
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedRoles
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedTeams
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedWorkmode
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.expectedSalary
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.maxExperience
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.minExperience
        ) ||
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.salaryCurrency
        )
      ) {
        setShowRefereePreferencesMessage(false);
        setShowRefereePreferenceDialogMessage("d-none");
      } else {
        setShowRefereePreferencesMessage(true);
        setShowRefereePreferenceDialogMessage("d-block");
      }
    } else {
      setShowRefereePreferencesMessage(true);
      setShowRefereePreferenceDialogMessage("d-block");
    }
  }, [
    candidateDetails?.userJobPreferences,
    candidateDetails?.refereePreferencesResponse,
    switchValue,
  ]);

  const dropdownSortArray = [
    { name: "Latest First", value: SORT.LATEST_FIRST },
    { name: "Salary - High to Low", value: SORT.SALARY_HIGH },
    { name: "Referral Bonus - High to Low", value: SORT.REFERAL_HIGH },
    { name: "Experience - More to Less", value: SORT.EXPIRIANCE_HIGH },
    { name: "Experience - Less to More", value: SORT.EXPIRIANCE_LOW },
    { name: "A-Z", value: SORT.JOB_TITLE_ASC },
  ];
  const dropdownSortHandler = (index, value) => {
    // setSortBy(value);
    setArraySortIndex(index);
    if (switchValue === "For Application") {
      setHashValue("For Application");
      setAllJobFilterData({
        ...allJobFilterData,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: value,
      });
      fetchRecommendedJobs({
        ...allJobFilterData,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: value,
      });
      setFilterDataParams({ ...allJobFilterData, sortBy: value, index: index });
    } else {
      setHashValue("For Referrals");
      setAllRefereeFilterData({
        ...allRefereeFilterData,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: value,
      });
      fetchRefereeRecommendedJobs({
        ...allRefereeFilterData,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: value,
      });
      setFilterDataParams({ ...allJobFilterData, sortBy: value, index: index });
    }
  };

  const [lgShow, setLgShow] = useState(false);

  const fetchRecommendedJobs = (filter) => {
    setShowLoader(true);

    getRecommendedJobs(filter).then(
      (res) => {
        if (!isEmpty(res.data)) {
          // let t = [...jobList].concat(res?.data);
          setDataCount(res?.totalCount);
          let data;
          if (infiniteScroll)
            data = filterfeaturedJobs([...jobList, ...res?.data]);
          else data = filterfeaturedJobs(res?.data);
          setApplicationCount(data?.length);
          setJobList(data);
          setShowLoader(false);
        } else if (isEmpty(res.data) && res.status === 200) {
          setJobList([]);
          setShowLoader(false);
          setJobMessage(res?.message ? res?.message : JOB_FETCH_FAILED);
        } else {
          setJobList([]);
          setJobMessage(res?.message ? res?.message : JOB_FETCH_FAILED);
          setShowLoader(false);
        }
      },
      (error) => {
        setJobMessage(error?.message ? error?.message : GENERAL_ERROR_MESSAGE);
        setShowLoader(false);
      }
    );
  };

  const fetchRefereeRecommendedJobs = (filter) => {
    setShowLoader(true);
    fetchRefereeRecommendation(filter).then(
      (res) => {
        if (!isEmpty(res?.data?.data)) {
          setRefereeDataCount(res?.data?.totalRecord);
          let data;
          if (infiniteReferralScroll)
            data = filterfeaturedJobs([...refereeJobList, ...res?.data?.data]);
          else data = filterfeaturedJobs(res?.data?.data);

          setRefereeJobList(data);
          setReferreCount(data?.length);
          setShowLoader(false);
        } else if (isEmpty(res?.data?.data) && res?.status === 200) {
          setRefereeJobList([]);
          setRefereeJobMessage(
            res?.data?.message ? res?.data?.message : JOB_FETCH_FAILED
          );
          setShowLoader(false);
        } else {
          setRefereeJobList([]);
          setRefereeJobMessage(
            res?.data?.message ? res?.data?.message : JOB_FETCH_FAILED
          );
          setShowLoader(false);
        }
      },
      (error) => {
        setRefereeJobMessage(
          error?.message ? error?.message : GENERAL_ERROR_MESSAGE
        );
        setShowLoader(false);
      }
    );
  };

  const refreshReferralJobs = () => {
    let filter = {
      pageNo: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    };
    fetchRefereeRecommendedJobs(filter);
  };

  // useEffect(() => {
  //   if (switchValue === "For Referrals") {
  //     window.location.hash = "#referrals";
  // setAllRefereeFilterData({});
  // refreshReferralJobs();
  // setFilterDataParams({});
  //   } else {
  //     window.location.hash = "#application";
  // refreshRecommendedJobs();
  // setFilterDataParams({});
  //   }
  // }, [switchValue]);

  useEffect(() => {
    let temp = {};
    for (let entry of filterDataParams.entries()) {
      if (entry[0] === "workMode") {
        if (temp?.workMode) {
          temp = { ...temp, workMode: [...temp?.workMode, entry[1]] };
        } else {
          temp = {
            ...temp,
            workMode: [entry[1]],
          };
        }
      } else if (entry[0] === "jobType") {
        if (temp?.jobType) {
          temp = {
            ...temp,
            jobType: [...temp?.jobType, entry[1]],
          };
        } else {
          temp = {
            ...temp,
            jobType: [entry[1]],
          };
        }
      } else if (entry[0] === "role") {
        if (temp?.role) {
          temp = {
            ...temp,
            role: [...temp?.role, entry[1]],
          };
        } else {
          temp = {
            ...temp,
            role: [entry[1]],
          };
        }
      } else if (entry[0] === "function") {
        if (temp?.function) {
          temp = {
            ...temp,
            function: [...temp?.function, entry[1]],
          };
        } else {
          temp = {
            ...temp,
            function: [entry[1]],
          };
        }
      } else if (entry[0] === "location") {
        if (temp?.location) {
          temp = {
            ...temp,
            location: [...temp?.location, entry[1]],
          };
        } else {
          temp = {
            ...temp,
            location: [entry[1]],
          };
        }
      } else if (entry[0] === "salaryCurrency") {
        temp = {
          ...temp,
          salaryCurrency: entry[1],
        };
      } else if (entry[0] === "salaryType") {
        temp = {
          ...temp,
          salaryType: entry[1],
        };
      } else if (entry[0] === "minSalary") {
        temp = {
          ...temp,
          minSalary: entry[1],
        };
      } else if (entry[0] === "minExpYrs") {
        temp = {
          ...temp,
          minExpYrs: entry[1],
        };
      } else if (entry[0] === "maxExpYrs") {
        temp = {
          ...temp,
          maxExpYrs: entry[1],
        };
      } else if (entry[0] === "bonusCurrency") {
        temp = {
          ...temp,
          bonusCurrency: entry[1],
        };
      } else if (entry[0] === "bonusAmount") {
        temp = {
          ...temp,
          bonusAmount: entry[1],
        };
      } else if (entry[0] === "searchString") {
        temp = {
          ...temp,
          searchString: entry[1],
        };
      } else if (entry[0] === "sortBy") {
        temp = {
          ...temp,
          sortBy: entry[1],
        };
      } else if (entry[0] === "index") {
        setArraySortIndex(Number(entry[1]));
      }
    }
    setTempJobFilter(temp);
    if (
      (location?.hash === "#referrals" || hashValue === "For Referrals") &&
      location?.hash !== "#application"
    ) {
      setSwitchValue("For Referrals");
      fetchRefereeRecommendation({ ...allRefereeFilterData, ...temp });
      setAllRefereeFilterData({ ...allRefereeFilterData, ...temp });
      // setReferrePage(temp?.pageNo);
    } else {
      setSwitchValue("For Application");
      fetchRecommendedJobs({ ...allJobFilterData, ...temp });
      setAllJobFilterData({ ...allJobFilterData, ...temp });
      setApplicationCount(temp?.pageNo);
    }
  }, [location?.hash, location?.search]);

  const fetchMoreData = () => {
    // let filter = {
    //   pageNo: page + 1,
    //   pageSize: DEFAULT_PAGE_SIZE,
    // };

    // setApplicationPage(allJobFilterData.pageNo);
    setShowLoader(true);
    if (switchValue === "For Referrals") {
      infiniteReferralScroll = true;
      fetchRefereeRecommendedJobs({
        ...allRefereeFilterData,
        pageNo: allRefereeFilterData?.pageNo + 1,
      });
      setAllRefereeFilterData({
        ...allRefereeFilterData,
        pageNo: allRefereeFilterData?.pageNo + 1,
      });
    } else {
      infiniteScroll = true;
      fetchRecommendedJobs({
        ...allJobFilterData,
        pageNo: allJobFilterData?.pageNo + 1,
      });
      setAllJobFilterData({
        ...allJobFilterData,
        pageNo: allJobFilterData?.pageNo + 1,
      });
    }
    setShowLoader(false);
  };

  const submitFormOnEnter = (e) => {
    if (e?.keyCode == 13) {
      if (switchValue === "For Referrals") {
        fetchRefereeRecommendedJobs({
          ...allRefereeFilterData,
        });
        setAllRefereeFilterData({
          ...allRefereeFilterData,
        });
        setFilterDataParams({
          ...allRefereeFilterData,
        });
      } else {
        fetchRecommendedJobs({
          ...allJobFilterData,
        });
        setAllJobFilterData({
          ...allJobFilterData,
        });
        setFilterDataParams({
          ...allJobFilterData,
        });
      }
    }
  };

  const switchHandler = (name) => {
    setTempJobFilter({});
    setselectedSubRole([]);
    setselectedWorkMode([]);
    if (name === "For Referrals") {
      // setAllRefereeFilterData();
      setJobList([]);
      fetchRefereeRecommendedJobs(initialFilter);
      setAllRefereeFilterData(initialFilter);
      setFilterDataParams(initialFilter);
      // window.location.hash = "#referrals";
      window?.location?.replace("#referrals");
    } else {
      // setAllJobFilterData({});
      setRefereeJobList([]);
      fetchRecommendedJobs(initialFilter);
      setFilterDataParams(initialFilter);
      setAllJobFilterData(initialFilter);
      // window.location.hash = "#application";
      window?.location?.replace("#application");
    }
  };

  const refreshRecommendedJobs = (filter = allJobFilterData) => {
    // let filter = {
    //   pageNo: 1,
    //   pageSize: DEFAULT_PAGE_SIZE,
    // };
    fetchRecommendedJobs(filter);
  };

  const [showJobPreferenceDialogMessage, setShowJobPreferenceDialogMessage] =
    useState("d-block");

  const [
    showRefereePreferenceDialogMessage,
    setShowRefereePreferenceDialogMessage,
  ] = useState("d-block");

  const [showJobPreferencesDialog, setShowJobPreferencesDialog] =
    useState(false);
  const [showRefereePreferencesDialog, setShowRefereePreferencesDialog] =
    useState(false);

  useEffect(() => {
    if (showJobPreferencesMessage) {
      setShowJobPreferenceDialogMessage("d-block");
    } else {
      setShowJobPreferenceDialogMessage("d-none");
    }
  }, [showJobPreferencesMessage]);

  useEffect(() => {
    if (showRefereePreferencesMessage) {
      setShowRefereePreferenceDialogMessage("d-block");
    } else {
      setShowRefereePreferenceDialogMessage("d-none");
    }
  }, [showRefereePreferencesMessage]);

  const searchHandler = (event) => {
    if (switchValue === "For Referrals") {
      setAllRefereeFilterData({
        ...allRefereeFilterData,
        searchString: event.target.value,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      // setFilterDataParams({
      //   ...allRefereeFilterData,
      //   searchString: event.target.value,
      // });
    } else {
      setAllJobFilterData({
        ...allJobFilterData,
        pageNo: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        searchString: event.target.value,
      });
      // setFilterDataParams({
      //   ...allJobFilterData,
      //   searchString: event.target.value,
      // });
    }
    setTempJobFilter({
      ...tempJobFilter,
      searchString: event.target.value,
      pageNo: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };
  const token = getLocalStorage(TOKEN);
  // const candidateDetails = useStoreState(
  //   (state) => state.candidate.candidateDetails
  // );

  return (
    <div className="w-100">
      {/* // {showLoader && <Loader />} */}
      {token ? (
        <Header candidateDetails={candidateDetails} />
      ) : (
        <StaticHeader candidateDetails={candidateDetails} />
      )}

      <React.Fragment>
        {token ||
        window?.location?.hash == "" ||
        window?.location?.hash == "#application" ||
        window?.location?.hash == "#referrals" ? (
          <section className="page-header w-100 jobs-gradient-bg">
            <div className="container">
              <div className="d-flex flex-lg-row flex-column justify-content-between align-items-center w-100">
                <div className="page-heading d-flex justify-content-start">
                  <SwitchButton
                    data={["For Application", "For Referrals"]}
                    value={switchValue}
                    // setValue={setSwitchValue}
                    theme={"black"}
                    onSwitch={(event) => {
                      switchHandler(event);
                    }}
                    // onClick={() => setSwitchValue(!switchValue)}
                  />
                </div>
                <div className="page-action d-flex flex-sm-row flex-column justify-content-end align-items-center pt-lg-0 pt-3 ">
                  <div className="d-flex gap-2 pt-lg-3 pb-3 pb-lg-4 align-items-center">
                    <div className="page-filter">
                      <button
                        type="button"
                        className="page-filter-button down-arrow"
                        onClick={() => setLgShow(true)}
                      >
                        <img src={filterIcon} alt="" /> Filters
                      </button>
                      <AllJobFilter
                        show={lgShow}
                        onShowHandler={() => setLgShow(false)}
                        setAllJobFilterData={
                          switchValue === "For Application"
                            ? setAllJobFilterData
                            : setAllRefereeFilterData
                        }
                        selectedSubRole={selectedSubRole}
                        selectedWorkMode={selectedWorkMode}
                        setselectedSubRole={setselectedSubRole}
                        setselectedWorkMode={setselectedWorkMode}
                        allJobFilterData={
                          switchValue === "For Application"
                            ? allJobFilterData
                            : allRefereeFilterData
                        }
                        tempJobFilter={tempJobFilter}
                        setTempJobFilter={setTempJobFilter}
                        fetchRecommendedJobs={fetchRecommendedJobs}
                        fetchRefereeRecommendedJobs={
                          fetchRefereeRecommendedJobs
                        }
                        componentName={switchValue}
                        setShow={setLgShow}
                        setAllFilterDataParams={setFilterDataParams}
                        allFilterDataParams={filterDataParams}
                        setHashValue={setHashValue}
                      />
                    </div>
                    <Dropdown className="">
                      <Dropdown.Toggle
                        variant="none"
                        id="dropdown-basic"
                        className="page-filter-button d-flex align-items-center bg-transparent down-arrow sort-jobs-filter-btn"
                        // style={{ width: "100px" }}
                      >
                        <img src={icSort} alt="" className=" ms-2" />
                        <span className="">Sort</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="fs-12 text-secondary mt-2">
                        {dropdownSortArray.map((d, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              value={d?.value}
                              className="d-flex pb-3"
                              onClick={() =>
                                dropdownSortHandler(index, d?.value)
                              }
                            >
                              <img
                                src={blackdone}
                                alt="blackdone-icon"
                                className={
                                  arraySortIndex === index
                                    ? "pe-2 d-block"
                                    : "d-none pe-1"
                                }
                              />{" "}
                              <span
                                className={
                                  arraySortIndex === index
                                    ? "ps-0 color-primary fw-700"
                                    : "ps-4"
                                }
                              >
                                {" "}
                                {d?.name}{" "}
                              </span>
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="page-search ms-3 pb-3 pt-lg-1">
                    <input
                      type="search"
                      placeholder="Search - Role, team, location, company"
                      defaultValue={
                        switchValue === "For Referrals"
                          ? allRefereeFilterData.searchString
                          : allJobFilterData.searchString
                      }
                      onChange={(event) => searchHandler(event)}
                      onKeyDown={(e) => submitFormOnEnter(e)}
                    />
                  </div>
                  {/* <div className="page-search ms-3 d-block d-lg-none">
                <button type="button" className="search-button"></button>
              </div> */}
                </div>
              </div>

              <section className="all-jobs">
                <div className="pt-2 pt-md-3">
                  {switchValue === "For Application" ? (
                    <div
                      className={`add-preferences-banner mb-4 ${showJobPreferenceDialogMessage}`}
                    >
                      {token ? (
                        <div className="row align-items-center">
                          <div className="col-lg-7">
                            <div className="d-flex align-items-center">
                              <div className="thumb">
                                <img
                                  src={jobReferencesSmallImage}
                                  className="img-fluid"
                                  alt="Job References"
                                />
                              </div>

                              <div className="content ps-3 flex-1">
                                <h3 className="m-0 fs-16 fw-700 color-primary">
                                  Help us, Help You
                                </h3>
                                <p className="m-0 mt-1 fs-14 fw-400 color-secondary">
                                  Add your job search preferences and see the
                                  best jobs for you
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-5">
                            <div className="actions d-flex justify-content-center justify-content-md-end align-items-center">
                              <div className="link">
                                <p
                                  onClick={() => {
                                    setShowJobPreferencesMessage(false);
                                  }}
                                  className="fs-14 fw-700 color-primary pointer add-later-link"
                                >
                                  I will Add later
                                </p>
                              </div>
                              <div className="button ms-4">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-rounded fs-14 fw-700"
                                  onClick={() => {
                                    setShowJobPreferencesDialog(true);
                                  }}
                                >
                                  Add Job Preferences
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <div
                      className={`add-preferences-banner mb-4 ${showRefereePreferenceDialogMessage}`}
                    >
                      {token ? (
                        <div className="row align-items-center">
                          <div className="col-lg-7">
                            <div className="d-flex align-items-center">
                              <div className="thumb">
                                <img
                                  src={jobReferencesSmallImage}
                                  className="img-fluid"
                                  alt="Job References"
                                />
                              </div>
                              <div className="content ps-3 flex-1">
                                <h3 className="m-0 fs-16 fw-700 color-primary">
                                  Help us, Help You
                                </h3>
                                <p className="m-0 mt-1 fs-14 fw-400 color-secondary">
                                  Add your job search preferences and see the
                                  best jobs for you
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-5">
                            <div className="actions d-flex justify-content-center justify-content-md-end align-items-center">
                              <div className="link">
                                <p
                                  onClick={() => {
                                    setShowRefereePreferencesMessage(false);
                                  }}
                                  className="fs-14 fw-700 color-primary pointer add-later-link"
                                >
                                  I will Add later
                                </p>
                              </div>
                              <div className="button ms-4">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-rounded fs-14 fw-700"
                                  onClick={() => {
                                    setShowRefereePreferencesDialog(true);
                                  }}
                                >
                                  Add Referral Preferences
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  {/* Preferences Modals */}
                  <JobSearchPreferenceDialog
                    show={showJobPreferencesDialog}
                    onDismissDialogClick={() =>
                      setShowJobPreferencesDialog(false)
                    }
                    isShowFlow={true}
                    onPreferencesSaved={() => {
                      refreshRecommendedJobs();
                    }}
                  />
                  <RefereeProfileEditDialog
                    show={showRefereePreferencesDialog}
                    onDismissDialogClick={() =>
                      setShowRefereePreferencesDialog(false)
                    }
                    isShowFlow={true}
                    onPreferencesSaved={() => {
                      refreshReferralJobs();
                    }}
                  />

                  {switchValue === "For Application" ? (
                    <InfiniteScroll
                      dataLength={dataCount}
                      next={() => fetchMoreData()}
                      hasMore={dataCount > applicationCount}
                      className="container-fluid"
                    >
                      {showLoader && <Loader headerLess={true} />}
                      {jobList?.length === 0 && showLoader === false ? (
                        <NoDataFoundCard
                          text={
                            jobMessage
                              ? jobMessage
                              : REECOMMENDED_JOB_EMPTY_MESSAGE
                          }
                        />
                      ) : null}
                      {jobList && jobList.length > 0 && (
                        <div className="row jobs">
                          {jobList.map((item, index) => {
                            if (item?.isPromoted === true) {
                              return (
                                <div
                                  className="col-12 col-sm-12 col-md-12 col-lg-6 mb-4"
                                  key={index}
                                >
                                  <div
                                    className="featured-job-card h-100"
                                    style={{
                                      backgroundImage: `url(${
                                        item?.promoMainImageURL === null
                                          ? jobCompanyLogo
                                          : process.env
                                              .REACT_APP_IMAGE_BASEURL +
                                            item?.promoMainImageURL
                                      })`,
                                    }}
                                  >
                                    <div className="card-tag-and-save">
                                      <div className="d-flex align-items-center">
                                        {item?.isPromoted === true && (
                                          <div className="tag">
                                            <span className="badge custom-red">
                                              {item?.jobStatus}
                                            </span>
                                          </div>
                                        )}
                                        <div className="save-job-wrapper ms-2">
                                          <div className="save-job-action">
                                            <JobCardSave
                                              saveStatus={item?.isSavedApplied}
                                              jobId={item?.jobId}
                                              isReferer={item?.isSavedReferal}
                                              // onJobSaved={() => {
                                              //   fetchMoreData();
                                              // }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="job-company-logo-wrapper">
                                      <div className="job-company-logo">
                                        <CompanyImage
                                          src={item?.companyLogo}
                                          width="50px"
                                          height="50px"
                                          name={item?.companyName}
                                          initialsContainerClass="initialsStyle2-xl"
                                        />
                                      </div>
                                    </div>
                                    <div className="job-content">
                                      <p className="sub-heading job-card-ellipse-1">
                                        {item?.companyName}
                                      </p>
                                      <h3 className="heading job-card-ellipse-1">
                                        {item?.jobTitle}
                                      </h3>
                                      <div className="job-other-info d-flex align-content-start flex-wrap">
                                        <div className="location-wrapper">
                                          <JobCardLocation
                                            text={item?.jobLocation}
                                          />
                                        </div>
                                        <div className="experience-wrapper">
                                          <JobCardExperience
                                            text={`${Math.floor(
                                              item?.jobMinExp
                                            )}-
                              ${Math.floor(item?.jobMaxExp)} yrs`}
                                          />
                                        </div>
                                        <div className="package-wrapper">
                                          <JobCardSalary
                                            //       text={`${convertInThousand(
                                            //         item?.jobMinSalary
                                            //       )}-
                                            // ${convertInThousand(item?.jobMaxSalary)}K`}
                                            data={item}
                                          />
                                        </div>
                                        <div className="package-wrapper">
                                          <JobCardReferralBonus
                                            text={Number(item?.referalBonus)}
                                            currencyType={item?.salaryCurrency}
                                          />
                                        </div>
                                      </div>
                                      <div className="description">
                                        {item?.why}
                                      </div>
                                    </div>
                                    <div className="feature-job-actions">
                                      <div className="row gx-3 gy-3">
                                        <div className="col-6 col-sm-6 col-md-3">
                                          <RecommendedJobDialog
                                            id={item?.jobId}
                                            applicationStatus={
                                              item?.applicationStatus
                                            }
                                            onJobApplied={() => {
                                              fetchRecommendedJobs(
                                                allJobFilterData
                                              );
                                            }}
                                            refererId={item?.refererId}
                                          />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3">
                                          <button
                                            type="button"
                                            className="btn btn-light w-100 alljobs-applied-btn"
                                            onClick={() => {
                                              setReferJobShow(true);
                                              setJobIdProps(item?.jobId);
                                              setJobDetailsProps(item);
                                            }}
                                          >
                                            Refer
                                          </button>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 fs-12 fw-700">
                                          <Link
                                            style={{ height: "40px" }}
                                            to={`/job/${item?.jobId}`}
                                            className="d-flex align-items-center justify-content-center btn btn-primary w-100 fs-12 fw-700"
                                          >
                                            View Details
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">
                                  <JobCard>
                                    <div className="save-job-action">
                                      <div className="d-flex justify-content-end align-items-center">
                                        <span className="badge custom-red me-2">
                                          {item?.jobStatus}
                                        </span>
                                        <JobCardSave
                                          saveStatus={item?.isSavedApplied}
                                          jobId={item?.jobId}
                                          isReferer={item?.isSavedReferal}
                                          // onJobSaved={() => {
                                          //   fetchMoreData();
                                          // }}
                                        />
                                      </div>
                                    </div>
                                    <JobCardCompany
                                      logo={item?.companyLogo}
                                      companyName={item?.companyName}
                                      name={item?.jobTitle}
                                      display="column"
                                    />
                                    <div className="job-other-info d-flex align-content-start flex-wrap">
                                      <div className="location-wrapper">
                                        <JobCardLocation
                                          text={item?.jobLocation}
                                        />
                                      </div>
                                      <div className="experience-wrapper">
                                        <JobCardExperience
                                          text={`${Math.floor(item?.jobMinExp)}-
                              ${Math.floor(item?.jobMaxExp)} yrs`}
                                        />
                                      </div>
                                    </div>
                                    <div className="job-other-info d-flex align-content-start flex-wrap mt-0">
                                      <div className="package-wrapper">
                                        <JobCardSalary
                                          //     text={`${convertInThousand(
                                          //       item?.jobMinSalary
                                          //     )}-
                                          // ${convertInThousand(item?.jobMaxSalary)}K`}
                                          data={item}
                                        />
                                      </div>
                                    </div>
                                    <div className="job-other-info d-flex align-content-start flex-wrap mt-0">
                                      <div className="package-wrapper">
                                        <JobCardReferralBonus
                                          text={Number(item?.referalBonus)}
                                          currencyType={item?.salaryCurrency}
                                        />
                                      </div>
                                    </div>
                                    <div className="why-look-job">
                                      <JobCardWhyLook
                                        text={item?.jobAdvantages[0]}
                                      />
                                    </div>
                                    <div className="key-skills mt-3">
                                      <p className="fs-12 fw-400 color-secondar">
                                        Key Skills
                                      </p>
                                      {item?.skillRequired &&
                                        item?.skillRequired?.length > 0 && (
                                          <div className="d-flex flex-wrap mt-2 gap-2">
                                            {item?.skillRequired?.map(
                                              (skill, index) => (
                                                <div
                                                  className="job-tag"
                                                  key={index}
                                                >
                                                  {skill}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                    <div className="all-job-action">
                                      <div className="d-flex gap-2">
                                        <div className="col-6">
                                          <RecommendedJobDialog
                                            id={item?.jobId}
                                            applicationStatus={
                                              item?.applicationStatus
                                            }
                                            onJobApplied={() => {
                                              fetchRecommendedJobs(
                                                allJobFilterData
                                              );
                                            }}
                                          />
                                        </div>

                                        <div className="col-6">
                                          <button
                                            type="button"
                                            className="btn btn-outline-dark w-100 alljobs-applied-btn"
                                            onClick={() => {
                                              setReferJobShow(true);
                                              setJobIdProps(item?.jobId);
                                              setJobDetailsProps(item);
                                            }}
                                          >
                                            Refer
                                          </button>
                                        </div>
                                      </div>
                                      <div className="row pt-2 ps-2 fs-12 fw-700">
                                        <Link
                                          style={{ height: "40px" }}
                                          to={`/job/${item?.jobId}`}
                                          className="d-flex align-items-center justify-content-center btn btn-dark w-100 fs-12 fw-700"
                                        >
                                          View Details
                                        </Link>
                                      </div>
                                    </div>
                                  </JobCard>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </InfiniteScroll>
                  ) : null}
                  {switchValue === "For Referrals" ? (
                    <RefereeRecommendedJobPage
                      ref={refereeRefferalJobs}
                      jobDetailsProps={jobDetailsProps}
                      setJobDetailsProps={setJobDetailsProps}
                      onJobSaved={() => {
                        fetchMoreData();
                      }}
                      dataCount={refereeDataCount}
                      count={referreCount}
                      setCount={setReferreCount}
                      fetchRefereeRecommendedJobs={fetchRefereeRecommendedJobs}
                      allRefereeFilterData={allRefereeFilterData}
                      setAllRefereeFilterData={setAllRefereeFilterData}
                      refereeJobMessage={refereeJobMessage}
                      refereeJobList={refereeJobList}
                      onJobApplied={() => {
                        fetchRefereeRecommendedJobs(allRefereeFilterData);
                      }}
                      showLoader={showLoader}
                    />
                  ) : null}
                </div>
                <ReferAJobDialog
                  onClosedButtonClick={() => {
                    setReferJobShow(false);
                    setNonLoginReferData();
                  }}
                  isShow={referJobShow}
                  referButtonClicked={referButtonClicked}
                  setReferButtonClicked={setReferButtonClicked}
                  disableReferralBtn={disableReferralBtn}
                  setDisableReferralBtn={setDisableReferralBtn}
                  referJobId={jobIdProps}
                  referJobShow={referJobShow}
                  setReferJobShow={setReferJobShow}
                  jobDetailsProps={jobDetailsProps}
                />
              </section>
            </div>
          </section>
        ) : (
          <NotFoundPage hideHeader={true} />
        )}
      </React.Fragment>
    </div>
  );
};
export default RecommendedJobsPage;
