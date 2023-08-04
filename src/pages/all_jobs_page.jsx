import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import JobCard from "../components/JobCard";
import JobCardCompany from "../components/JobCardCompany";
import JobCardExperience from "../components/JobCardExperience";
import JobCardLocation from "../components/JobCardLocation";
import JobCardReferralBonus from "../components/JobCardReferralBonus";
import JobCardSalary from "../components/JobCardSalary";
import JobCardSave from "../components/JobCardSave";
import JobCardWhyLook from "../components/JobCardWhyLook";
import filterIcon from "./../assests/icons/ic-filter-16.svg";
import jobCompanyLogo from "./../assests/images/job-company-logo.png";
import icSort from "./../assests/icons/ic_sort.svg";
import blackdone from "./../assests/icons/ic_blackdone.svg";
import Dropdown from "react-bootstrap/Dropdown";
import AllJobFilter from "../components/AllJobFilterDialog";
import { getAllJobs } from "../_services/view.service";
import { isEmpty } from "../utils/form_validators";
import toaster from "../utils/toaster";
import { convertInThousand } from "../utils/utils";
import { filterfeaturedJobs } from "./../utils/featured_job_layout";
import Loader from "./../components/common/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import NoDataFoundCard from "../components/common/no_data_found_card";
import ReferAJobDialog from "../components/refer_a_job_dialog";
import RecommendedJobDialog from "../components/recommended_job_dialog";
import { QUICKAPPLYMODALSHOW, SORT, TOKEN } from "../constants/keys";
import CompanyImage from "./../components/company_image";
import { viewCandidateApplication } from "../_services/candidate.service";
import { GENERAL_ERROR_MESSAGE, JOB_FETCH_FAILED } from "../constants/message";
import Header from "../components/common/header";
import { action, useStoreActions, useStoreState } from "easy-peasy";
import { getLocalStorage, setLocalStorage } from "../utils/storage";
import ApplyForJobDialog from "../components/ApplyForJobDialog";
import QuickApplyJob from "../components/QuickApplyJob";
import StaticHeader from "../components/common/staticHeader";

const AllJobsPage = () => {
  const isApplyingWithOutLogin = useStoreState(
    (state) => state?.isApplyingWithOutLogin
  );
  const currentJobDetails = useStoreState((state) => state?.currentJobDetails);
  const setCurrentJobDetails = useStoreActions(
    (action) => action.setCurrentJobDetails
  );

  const [showNonLoginApplyDialog, setShowNonLoginApplyDialog] = useState();
  useEffect(() => {
    if (isApplyingWithOutLogin) {
      setShowNonLoginApplyDialog(true);
    }
  }, []);
  let quickApplyModalShow = getLocalStorage(QUICKAPPLYMODALSHOW);

  const token = getLocalStorage(TOKEN);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const nonLoginSaveForApplying = useStoreState(
    (state) => state?.nonLoginSaveForApplying
  );
  const isNonLoginUserApplyDetailJob = useStoreState(
    (action) => action.isNonLoginUserApplyDetailJob
  );
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );
  const applyForJobNonLoginUser = useStoreState(
    (action) => action.applyForJobNonLoginUser
  );
  const isReferringWithOutLogin = useStoreState(
    (action) => action.isReferringWithOutLogin
  );
  const isReferringFromDetailsWithOutLogin = useStoreState(
    (action) => action.isReferringFromDetailsWithOutLogin
  );
  const setIsReferringFromDetailsWithOutLogin = useStoreActions(
    (state) => state?.setIsReferringFromDetailsWithOutLogin
  );
  const nonLoginReferData = useStoreState((action) => action.nonLoginReferData);
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [arrayIndex, setArrayIndex] = useState(0);
  const [currentOffset, setCurrentOffSet] = useState(0);
  const [filterData, setFilterData] = useState();
  const [allJobMessage, setAllJobMessage] = useState("");
  const [selectedWorkMode, setselectedWorkMode] = useState([]);
  const [selectedSubRole, setselectedSubRole] = useState([]);
  const [tempJobFilter, setTempJobFilter] = useState({});
  let isInfinite = false;
  const dropdownSortArray = [
    { name: "Latest First", value: SORT.LATEST_FIRST },
    { name: "Salary - High to Low", value: SORT.SALARY_HIGH },
    { name: "Referral Bonus - High to Low", value: SORT.REFERAL_HIGH },
    { name: "Experience - More to Less", value: SORT.EXPIRIANCE_HIGH },
    { name: "Experience - Less to More", value: SORT.EXPIRIANCE_LOW },
    { name: "A-Z", value: SORT.JOB_TITLE_ASC },
  ];

  const dropdownHandler = (index, value) => {
    setSortBy(value);
    setArrayIndex(index);
    setAllJobFilterData({
      ...allJobFilterData,
      sortBy: value,
      pageNo: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    fetchAllJobs({
      ...allJobFilterData,
      sortBy: value,
      pageNo: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    setAllJobFilterDataParams({
      ...allJobFilterData,
      sortBy: value,
      index: index,
    });
  };

  const initialFilterData = {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const [lgShow, setLgShow] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [referJobShow, setReferJobShow] = useState(false);
  const [referButtonClicked, setReferButtonClicked] = useState(false);
  const [disableReferralBtn, setDisableReferralBtn] = useState(true);
  const [jobIdProps, setJobIdProps] = useState(null);
  const [jobDetailsProps, setJobDetailsProps] = useState();
  const [allJobFilterData, setAllJobFilterData] = useState(initialFilterData);

  {
  }
  const [allJobFilterDataParams, setAllJobFilterDataParams] = useSearchParams({
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const fetchMoreData = () => {
    // setCurrentOffSet(currentOffset + 1);
    isInfinite = true;
    fetchAllJobs({
      ...allJobFilterData,
      pageNo: allJobFilterData?.pageNo + 1,
    });
    setAllJobFilterData({
      ...allJobFilterData,
      pageNo: allJobFilterData?.pageNo + 1,
    });
  };

  const fetchAllJobs = (filter) => {
    setShowLoader(true);
    getAllJobs(filter).then(
      (res) => {
        if (res?.data && !isEmpty(res?.data)) {
          setDataCount(res?.totalCount);

          let data;
          if (!isInfinite) {
            data = filterfeaturedJobs(res?.data);
          } else {
            data = filterfeaturedJobs([...jobList, ...res?.data]);
          }
          setCurrentOffSet(data?.length);
          setJobList(data);
          setShowLoader(false);
        } else if (isEmpty(res?.data) && res?.status === 200) {
          setJobList([]);
          setShowLoader(false);
          setAllJobMessage(res?.message ? res?.message : JOB_FETCH_FAILED);
        } else {
          setJobList([]);
          setAllJobMessage(res?.message ? res?.message : JOB_FETCH_FAILED);
          setShowLoader(false);
        }
      },
      (error) => {
        toaster(
          "error",
          error?.message ? error?.message : GENERAL_ERROR_MESSAGE
        );
        setShowLoader(false);
      }
    );
  };

  // useEffect =
  //   (() => {
  //     fetchAllJobs(allJobFilterData);
  //   },
  //   [sortBy]);

  const savedJobsRef = useRef();
  const appliedJobsRef = useRef();
  const referredJobsRef = useRef();
  const recommendedRef = useRef();
  const referralsRef = useRef();
  const refereeReferrredJobRef = useRef();
  const refereeSavedJobRef = useRef();

  const refreshList = () => {
    savedJobsRef?.current?.refresh();
    appliedJobsRef?.current?.refresh();
    referredJobsRef?.current?.refresh();
    recommendedRef?.current?.refresh();
    referralsRef?.current?.refresh();
    refereeReferrredJobRef?.current?.refresh();
    refereeSavedJobRef?.current?.refresh();
  };

  useEffect(() => {
    // setCurrentOffSet(allJobFilterData?.pageNo);
    // fetchMoreData();
    let temp = { ...initialFilterData };
    for (let entry of allJobFilterDataParams.entries()) {
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
      } else if (entry[0] === "index") {
        setArrayIndex(Number(entry[1]));
      } else if (entry[0] === "sortBy") {
        temp = {
          ...temp,
          sortBy: entry[1],
        };
      }
    }
    setAllJobFilterData(temp);
    fetchAllJobs(temp);
  }, [window?.location?.href]);

  const refresh = () => {
    fetchMoreData();
  };

  const submitFormOnEnter = (e) => {
    if (e?.keyCode == 13) {
      setAllJobFilterDataParams(allJobFilterData);
      fetchAllJobs(allJobFilterData);
    }
  };

  // const viewApplication = (id) => {
  //   viewCandidateApplication(id).then((res) => {
  //     console.log("res in viewAPpli", res);
  //   });
  // };

  useEffect(() => {
    if (token && isReferringWithOutLogin && nonLoginReferData) {
      setReferJobShow(true);
    }
    if (!token && isReferringFromDetailsWithOutLogin) {
      setIsReferringFromDetailsWithOutLogin(false);
    }
  }, []);

  return (
    <div className="w-100">
      {showLoader && <Loader />}
      {token 
       ? <Header candidateDetails={candidateDetails} />
    :  <StaticHeader candidateDetails={candidateDetails} /> }

      <section className="page-header jobs-gradient-bg">
        <div className="container ">
          <div className="d-flex flex-md-row flex-column justify-content-md-between ">
            <div className="page-heading d-flex justify-content-start">
              <h1 className="fs-20 fw-700 font-color-black m-0 ps-1">
                All Jobs
              </h1>
            </div>
            <div className="page-action d-flex align-items-center pt-3 pt-md-0 justify-content-between justify-content-md-end flex-sm-row flex-column">
              <div className="d-flex gap-2 pb-2 pb-sm-0">
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
                    setShow={setLgShow}
                    onShowHandler={() => setLgShow(false)}
                    setFilterData={setFilterData}
                    filterData={filterData}
                    allJobFilterData={allJobFilterData}
                    setAllJobFilterData={setAllJobFilterData}
                    allFilterDataParams={allJobFilterDataParams}
                    setAllFilterDataParams={setAllJobFilterDataParams}
                    fetchAllJobs={fetchAllJobs}
                    componentName="allJob"
                    tempJobFilter={tempJobFilter}
                    setTempJobFilter={setTempJobFilter}
                    setselectedSubRole={setselectedSubRole}
                    setselectedWorkMode={setselectedWorkMode}
                    selectedSubRole={selectedSubRole}
                    selectedWorkMode={selectedWorkMode}
                    // setTotalJobCount={setCurrentOffSet}
                    // setJobList={setJobList}
                    // jobList={jobList}
                  />
                </div>
                <div className="page-sort-by">
                  <Dropdown className="">
                    <Dropdown.Toggle
                      variant="none"
                      id="dropdown-basic"
                      className="page-filter-button d-flex align-items-center bg-transparent down-arrow sort-jobs-filter-btn"
                      // style={{ width: "100px" }}
                    >
                      <img src={icSort} alt="" className="pt-1 ms-2" /> Sort
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="fs-12 text-secondary mt-2">
                      {dropdownSortArray.map((d, index) => {
                        return (
                          <Dropdown.Item
                            key={index}
                            className="d-flex pb-3"
                            onClick={() => dropdownHandler(index, d?.value)}
                          >
                            <img
                              src={blackdone}
                              alt="blackdone-icon"
                              className={
                                arrayIndex === index
                                  ? "pe-2 d-block"
                                  : "d-none pe-1"
                              }
                            />{" "}
                            <span
                              className={
                                arrayIndex === index
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
              </div>
              <div className="page-search ms-0 ms-sm-3">
                <input
                  type="search"
                  placeholder="Search - Role, team, location, company"
                  defaultValue={allJobFilterData?.searchString}
                  onChange={(event) => {
                    setAllJobFilterData({
                      ...allJobFilterData,
                      searchString: event.target.value,
                      pageNo: 1,
                      pageSize: DEFAULT_PAGE_SIZE,
                    });

                    setTempJobFilter({
                      ...tempJobFilter,
                      searchString: event.target.value,
                      pageNo: 1,
                      pageSize: DEFAULT_PAGE_SIZE,
                    });
                  }}
                  onKeyDown={(e) => submitFormOnEnter(e)}
                />
              </div>
              {/* <div className="page-search ms-3 d-block d-lg-none">
                <button type="button" className="search-button"></button>
              </div> */}
            </div>
          </div>

          <section className="pt-3 pt-md-4">
            <div className="all-jobs-container">
              {jobList?.length === 0 && showLoader === false ? (
                <NoDataFoundCard
                  text={
                    jobList?.length === 0 ? allJobMessage : " No Jobs Found "
                  }
                />
              ) : null}
              {jobList && jobList?.length > 0 && (
                <InfiniteScroll
                  dataLength={currentOffset}
                  next={() => fetchMoreData()}
                  hasMore={dataCount > currentOffset}
                  className="container-fluid"
                >
                  {showLoader && <Loader />}
                  <div className="row jobs">
                    {jobList?.map((item, index) => {
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
                                    : process.env.REACT_APP_IMAGE_BASEURL +
                                      item?.promoMainImageURL
                                })`,
                              }}
                            >
                              <div className="card-tag-and-save">
                                <div className="d-flex align-items-center">
                                  {item?.isPromoted === true && (
                                    <div className="tag">
                                      <span className="badge custom-red">
                                        {item?.type}
                                      </span>
                                    </div>
                                  )}
                                  {item?.tagTitle && (
                                    <div
                                      style={{
                                        background:
                                          "linear-gradient(154.48deg, #EB1260 13.72%, #FF3D12 83.84%)",
                                        padding: "5px 15px",
                                        borderRadius: "7px",
                                        border: "none",
                                      }}
                                    >
                                      <div
                                        style={{
                                          color: "white",
                                          border: "none",
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          display: "flex",
                                        }}
                                      >
                                        {item?.tagTitle}
                                      </div>
                                    </div>
                                  )}

                                  <div className="save-job-wrapper ms-2">
                                    <div className="save-job-action">
                                      <JobCardSave
                                        jobId={item?.jobId}
                                        saveStatus={item?.isSavedApplied}
                                        isReferer={item?.isSavedReferal}
                                        // onJobSaved={() => {
                                        //   refresh();
                                        // }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="job-company-logo-wrapper">
                                  <div className="job-company-logo">
                                    <CompanyImage
                                      src={item?.companyLogo}
                                      width="52px"
                                      height="52px"
                                      name={item?.companyName}
                                      initialsContainerClass="initialsStyle2-xl"
                                    />
                                  </div>
                                </div>
                                <div className="job-content">
                                  <p className="fs-16 fw-700 text-white job-card-ellipse-1">
                                    {item?.companyName}
                                  </p>
                                  <h3 className="fs-32 fw-700 text-white job-card-ellipse-1">
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
                                        text={
                                          item?.jobMinExp > item?.jobMaxExp
                                            ? `${Math.floor(
                                                item?.jobMinExp
                                              )} yrs`
                                            : `${Math.floor(item?.jobMinExp)}-
                              ${Math.floor(item?.jobMaxExp)} yrs`
                                        }
                                      />
                                    </div>
                                    <div className="package-wrapper">
                                      <JobCardSalary
                                        //     text={`${convertInThousand(
                                        //       item?.jobMinSalary
                                        //     )}-
                                        // ${convertInThousand(item?.jobMaxSalary)}`}
                                        data={item}
                                      />
                                    </div>
                                    <div className="package-wrapper">
                                      <JobCardReferralBonus
                                        text={Number(item?.referalBonus)}
                                        currencyType={
                                          item?.salaryCurrency ||
                                          item?.salCurrency
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="description">
                                    {item?.tagLine}
                                  </div>
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
                                      companyLogo={item?.companyLogo}
                                      ref={recommendedRef}
                                      onJobApplied={() => {
                                        fetchAllJobs(allJobFilterData);
                                      }}
                                      item={item}
                                      setCurrentJobDetails={
                                        setCurrentJobDetails
                                      }
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
                                  <div className="col-12 col-sm-12 col-md-6">
                                    <Link
                                      style={{ height: "40px" }}
                                      to={`/job/${item?.jobId}`}
                                      type="button"
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
                              <div className="save-job-action d-flex">
                                {item?.tagTitle && (
                                  <div
                                    style={{
                                      background:
                                        "linear-gradient(154.48deg, #EB1260 13.72%, #FF3D12 83.84%)",
                                      padding: "5px 15px",
                                      borderRadius: "7px",
                                      border: "none",
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "white",
                                        border: "none",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        display: "flex",
                                      }}
                                    >
                                      {item?.tagTitle}
                                    </div>
                                  </div>
                                )}
                                <JobCardSave
                                  jobId={item?.jobId}
                                  saveStatus={item?.isSavedApplied}
                                  isReferer={item?.isSavedReferal}
                                  // onJobSaved={() => {
                                  //   refresh();
                                  // }}
                                />
                              </div>

                              <JobCardCompany
                                logo={item?.companyLogo}
                                companyName={item?.companyName}
                                name={item?.jobTitle}
                                display="column"
                              />
                              <div className="job-other-info d-flex align-content-start flex-wrap">
                                <div className="location-wrapper">
                                  <JobCardLocation text={item?.jobLocation} />
                                </div>
                                <div className="experience-wrapper">
                                  <JobCardExperience
                                    text={
                                      item?.jobMinExp > item?.jobMaxExp
                                        ? `${Math.floor(item?.jobMinExp)} yrs`
                                        : `${Math.floor(item?.jobMinExp)}-
                              ${Math.floor(item?.jobMaxExp)} yrs`
                                    }
                                  />
                                </div>
                              </div>

                              <div className="job-other-info d-flex align-content-start flex-wrap mt-0">
                                <div className="package-wrapper">
                                  <JobCardSalary
                                    //   text={`${convertInThousand(item?.jobMinSalary)}-
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
                                  text={
                                    item?.jobAdvantages
                                      ? item?.jobAdvantages[0]
                                      : null
                                  }
                                />
                              </div>
                              <div className="key-skills mt-3">
                                <p className="fs-12 fw-400 color-secondar">
                                  Key Skills
                                </p>

                                {item?.skillRequired &&
                                  item?.skillRequired?.length > 0 && (
                                    <div className="d-flex flex-wrap mt-2 gap-1">
                                      {item?.skillRequired?.map(
                                        (skill, index) => (
                                          <span className="job-tag" key={index}>
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="all-job-action">
                                <div className="row gx-2 gy-3">
                                  <div className="col-6">
                                    <RecommendedJobDialog
                                      id={item?.jobId}
                                      applicationStatus={
                                        item?.applicationStatus
                                      }
                                      companyLogo={item?.companyLogo}
                                      ref={recommendedRef}
                                      onJobApplied={() => {
                                        fetchAllJobs(allJobFilterData);
                                      }}
                                      item={item}
                                      setCurrentJobDetails={
                                        setCurrentJobDetails
                                      }
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
                                  <div className="col-12">
                                    <Link
                                      style={{ height: "40px" }}
                                      to={`/job/${item?.jobId}`}
                                      type="button"
                                      className="d-flex align-items-center justify-content-center btn btn-dark w-100 fs-12 fw-700"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </JobCard>
                          </div>
                        );
                      }
                    })}
                  </div>
                </InfiniteScroll>
              )}
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
      {isApplyingWithOutLogin &&
        currentJobDetails &&
        applyForJobNonLoginUser && (
          <ApplyForJobDialog
            show={showNonLoginApplyDialog}
            setShow={setShowNonLoginApplyDialog}
            id={currentJobDetails?.id}
            jobDetails={currentJobDetails}
            refereeId={null}
          />
        )}
    </div>
  );
};
export default AllJobsPage;
