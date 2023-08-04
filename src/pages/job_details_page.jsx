/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import BackButton from "../assests/icons/back-icon.svg";
import close from "../assests/icons/ic-close-24.svg";
import down from "../assests/icons/ic_down.svg";
import up from "../assests/icons/ic_up.svg";
// import whitecircle from "../assests/icons/ic_whitecircle.svg";
import AboutEmployer from "../components/AboutEmployer";
import JobDetails from "../components/JobDetails";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ApplyForJobQuestions from "../components/ApplyForJobQuestions";
// import disabled from "../assests/icons/ic_disabled.svg";
import {
  fetchJobDetails,
  applyingForJob,
} from "../_services/member-profile.service";
import toaster from "../utils/toaster";
import { useNavigate } from "react-router-dom";
import {
  convertToInternationalCurrencySystem,
  monthConversion,
  yearConversion,
} from "../utils/utils";
import JobCardSave from "../components/JobCardSave";
import ReferAJobDialog from "../components/refer_a_job_dialog";
import JobSaveCardForDetails from "../components/JobSaveCardForDetails";

import ApplyForJobDialog from "../components/ApplyForJobDialog";
import { APPLIED, SOMETHING_WENT_WRONG, TOKEN } from "../constants/keys";
import CompanyImage from "./../components/company_image";
import Loader from "../components/common/loader";
import { FROM_REFEREE_PAGE, NOT_MENTIONED } from "../constants/message";
import NotFoundPage from "./not_found_page";
import LinkInvalid from "./link_invalid";
import NoDataFoundCard from "../components/common/no_data_found_card";
import { REFEREE_ID_SEARCH_PARAMS } from "../constants/page-routes";
import { downloadFile } from "../_services/view.service";
import { getLocalStorage } from "../utils/storage";
import { useStoreActions, useStoreState } from "easy-peasy";
import StaticHeader from "../components/common/staticHeader";

const JobDetailsPage = (props) => {
  let { id } = useParams();
  const setCurrentJobDetails = useStoreActions(
    (action) => action.setCurrentJobDetails
  );
  const isNonLoginUserApplyDetailJob = useStoreState(
    (action) => action.isNonLoginUserApplyDetailJob
  );
  const isReferringFromDetailsWithOutLogin = useStoreState(
    (action) => action.isReferringFromDetailsWithOutLogin
  );
  const setIsNonLoginUserApplyDetailJob = useStoreActions(
    (action) => action.setIsNonLoginUserApplyDetailJob
  );
  const setIsApplyingWithOutLogin = useStoreActions(
    (state) => state?.setIsApplyingWithOutLogin
  );
  const setIsReferringFromDetailsWithOutLogin = useStoreActions(
    (state) => state?.setIsReferringFromDetailsWithOutLogin
  );

  const setIsReferringWithOutLogin = useStoreActions(
    (state) => state?.setIsReferringWithOutLogin
  );
  const isReferringWithOutLogin = useStoreState(
    (action) => action.isReferringWithOutLogin
  );
  const nonLoginReferData = useStoreState((action) => action.nonLoginReferData);
  const navigate = useNavigate();
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );
  //CAndidate Details
  // const candidateDetails = useStoreState(
  //   (state) => state.candidate.candidateDetails
  // );
  // const saveCandidateDetails = useStoreActions(
  //   (actions) => actions.candidate.saveCandidateDetails
  // );
  // const isLoading = useStoreState((state) => state.candidate.isLoading);

  // useEffect(() => {
  //   const userId = getLocalStorage(USER_ID);
  //   if (userId) {
  //     saveCandidateDetails(userId);
  //   }
  // }, []);

  //Candidate Details end

  // const [isResumeSelected, setIsResumeSelected] = useState(false);
  const [refereeId, setRefereeId] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isJobDetails, setIsJobDetails] = useState(true);
  const [isReferJob, setIsReferJob] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [disableReferralBtn, setDisableReferralBtn] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true); //check featured product
  const [mainImage, setMainImage] = useState(
    "https://bitsofco.de/content/images/2018/12/broken-1.png"
  );
  const [addImage1, setAddImage1] = useState("");
  const [addImage2, setAddImage2] = useState("");
  const [jobDetailsProps, setJobDetailsProps] = useState({
    jobTitle: "",
    companyName: "",
    companyLogo: "",
  });
  const [appliedForJob, setAppliedForJob] = useState(false);
  const [backBtnClicked, setBackBtnClicked] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [saveToProfileCheck, setSaveToProfileCheck] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);

  useEffect(() => {
    setRefereeId(searchParams?.get(REFEREE_ID_SEARCH_PARAMS));
    // console.log("ref id", searchParams?.get(REFEREE_ID_SEARCH_PARAMS));
  }, []);

  // const getRefereeId = () => {
  //   if (window?.location?.href?.includes("=")) {
  //     let indexOfRefereeId = window?.location?.href?.lastIndexOf("=");
  //     let refereeId = window?.location?.href?.slice(indexOfRefereeId + 1);
  //
  //     setRefereeId(refereeId);
  //   } else {
  //
  //     setRefereeId("");
  //   }
  // };

  const SetJobDetailsObject = (jobDetails) => {
    const jobTitle = jobDetails?.jobTitle;
    const companyName = jobDetails?.companyProfile?.companyName;
    const companyLogo = jobDetails?.companyProfile?.companyLogo;

    setJobDetailsProps({
      ...jobDetailsProps,
      jobTitle,
      companyName,
      companyLogo,
    });
  };

  const isJobDetailsHandler = () => {
    setIsJobDetails(!isJobDetails);
  };
  const isReferJobHandler = () => {
    setIsReferJob(!isReferJob);
  };
  const AboutEmployerHandler = () => {
    setIsEmployer(!isEmployer);
  };

  const [show, setShow] = useState(false);

  // const popupPageHandler = () => {
  //   if (isPageShow === true) {
  //     setIsPageShow(false);
  //   } else {
  //     if (!isMandatory) {
  //       applyingForJob(applyForJob)
  //         .then((res) => {
  //
  //           toaster("success", "Successfully applied to the job");
  //           setShow(false);
  //         })
  //         .catch((err) => {
  //
  //           toaster("error", err);
  //         });
  //     }
  //     setIsPageShow(true);
  //   }
  // };
  const [scrollOffset, setScrollOffset] = useState(0);
  const [referButtonClicked, setReferButtonClicked] = useState(false);
  const [notFoundPage, setNotFoundPage] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState({
    state: false,
    class: "d-none",
  });
  const [apiMessage, setApiMessage] = useState("");

  let [searchParams, setSearchParams] = useSearchParams();

  const downloadImage = (url, setState) => {
    // setShowLoader(true);
    // downloadFile(url)
    //   .then((res) => {
    //     setShowLoader(false);
    //     setState(res);
    //   })
    //   .catch((err) => {
    //     setShowLoader(false);
    //     toaster("error", err);
    //   });
    // url = url.substr(url.indexOf("/", 1));
    url = url.replace(/\//, "");
    if (url) setState(`${process.env.REACT_APP_API_URL}${url}`);
  };

  const getJobDetails = () => {
    fetchJobDetails(Number(id))
      .then((res) => {
        if (res?.data?.data?.jobId === null) {
          setNotFoundPage(true);
          setLinkInvalid({ ...linkInvalid, class: "d-block", state: false });
          // navigate("/not-found", { replace: true });
          setShowLoader(false);
        } else {
          if (res.status === 200) {
            // console.log(res?.data?.data);
            setNotFoundPage(false);
            setLinkInvalid({ ...linkInvalid, class: "d-block", state: false });
            setJobDetails(res?.data?.data);
            if (res?.data?.data?.applicationStatus !== APPLIED) {
              if (isNonLoginUserApplyDetailJob) {
                setShow(true);
                setIsNonLoginUserApplyDetailJob(false);
                setIsApplyingWithOutLogin(false);
              }
              if (token && isReferringWithOutLogin && nonLoginReferData) {
                setReferJobShow(true);
              }
            } else {
              setIsNonLoginUserApplyDetailJob(false);
              setIsApplyingWithOutLogin(false);
            }
            setIsFeatured(res?.data?.data?.isPromotion);
            if (res?.data?.data?.isPromotion) {
              if (res?.data?.data?.JobPromotion?.mainImage)
                downloadImage(
                  res?.data?.data?.JobPromotion?.mainImage,
                  setMainImage
                );
              if (res?.data?.data?.JobPromotion?.addImage1)
                downloadImage(
                  res?.data?.data?.JobPromotion?.addImage1,
                  setAddImage1
                );
              if (res?.data?.data?.JobPromotion?.addImage2)
                downloadImage(
                  res?.data?.data?.JobPromotion?.addImage2,
                  setAddImage2
                );
            }
            SetJobDetailsObject(res?.data?.data);
            setShowLoader(false);
          } else {
            toaster(
              "error",
              res?.data?.error ? res?.data?.error : SOMETHING_WENT_WRONG
            );
            if (res?.data?.error) {
              setApiMessage(res?.data?.error);
            } else {
              setApiMessage(SOMETHING_WENT_WRONG);
            }
            setShowLoader(false);
            setLinkInvalid({ ...linkInvalid, state: true, class: "d-none" });
          }
        }
        // setIsFeatured(false);
      })
      .catch((err) => {
        setShowLoader(false);
        navigate(-1);
        if (err) {
          toaster("error", err?.message ? err?.message : SOMETHING_WENT_WRONG);
        }
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    const onScroll = () => setScrollOffset(window.pageYOffset);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    setShowLoader(true);
    getJobDetails();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollShow = scrollOffset > 130;

  const [referJobShow, setReferJobShow] = useState(false);

  const referring = searchParams?.get("source") === FROM_REFEREE_PAGE;
  const token = getLocalStorage(TOKEN);

  useEffect(() => {
    if (!token) {
      setIsReferringFromDetailsWithOutLogin(true);
    } else {
      setIsReferringFromDetailsWithOutLogin(false);
    }
    if (
      token &&
      isReferringWithOutLogin &&
      isReferringFromDetailsWithOutLogin &&
      nonLoginReferData
    ) {
      setReferJobShow(true);
    }
  }, []);

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  return (
    <>
      {showLoader && <Loader />}
      {linkInvalid?.state ? <NoDataFoundCard text={apiMessage} /> : ""}
      {notFoundPage ? (
        <NotFoundPage />
      ) : (
        <div className={`${linkInvalid?.class} w-100 h-100`}>
          {token ? (
            // <Header candidateDetails={candidateDetails} />
            ""
          ) : (
            <StaticHeader candidateDetails={candidateDetails} />
          )}
          <div
            className={`d-flex justify-content-between p-3 pb-3 w-100 header-navigations ${
              scrollOffset > 200 ? "trasparent-white" : ""
            }`}
          >
            <button
              className="btn color-primary"
              onClick={() => {
                navigate(-1);
                setIsNonLoginUserApplyDetailJob(false);
                setIsApplyingWithOutLogin(false);
              }}
            >
              <img src={BackButton} />
              <span className="color-primary fs-12 ps-2"> Go Back </span>
            </button>
            {/* <span>
          <span className="header-gray-text pe-2"> Hit ESC to close </span>
          <Link to="/">
            <img
              src={close}
              alt="close-icon"
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round"
            />
          </Link>
        </span> */}
          </div>
          <header className="job-detail-header">
            <div className="container pt-2">
              <div className="d-flex p-2">
                <div className="col-md-8 col-12">
                  <span className="d-flex justify-content-between pb-2">
                    {isFeatured ? (
                      <>
                        <span className="gradient-background p-1 m-2 m-md-0">
                          {" "}
                          Featured
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </span>
                  <p className="big-font-gray">{jobDetails.jobTitle}</p>
                  <br />
                  <span className="fs-12 fw-400 d-block d-lg-none">
                    <JobSaveCardForDetails
                      isSaved={jobDetails?.isSavedApplied}
                      jobId={jobDetails?.jobId}
                      isReferer={jobDetails?.isSavedReferal}
                      jobDetails={jobDetails}
                    />
                    {/* <JobCardSave saveStatus={false} jobId={id}>
                  Save this job
                </JobCardSave>{" "} */}
                  </span>
                </div>
                <div className="col-md-4 col-12 text-end d-none d-lg-block">
                  <div className="d-flex justify-content-end">
                    <JobSaveCardForDetails
                      isSaved={jobDetails?.isSavedApplied}
                      jobId={jobDetails?.jobId}
                      isReferer={jobDetails?.isSavedReferal}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex pb-5 p-2">
                <div className="col-md-8 col-12 d-flex flex-wrap gap-4 pt-4">
                  {/* <img
                src={`data:image/jpeg;base64 , ${jobDetails?.companyProfile?.companyLogo}`}
                className="bg-white p-1 d-md-block d-none rounded"
                width="40px"
                height="40px"
              /> */}
                  <div className="d-md-block d-none">
                    <CompanyImage
                      src={jobDetails?.companyProfile?.companyLogo}
                      width="50px"
                      // height="50px"
                      name={jobDetails?.companyProfile?.companyName}
                      initialsContainerClass="initialsStyle2-xl bg-white p-1 d-md-block d-none rounded"
                    />
                  </div>
                  <div className="d-flex gap-4 flex-wrap ">
                    <div className="order-sm-first order-last">
                      <span className="small-text-gray "> Posted By </span>
                      <br />
                      <span className="black-text">
                        {" "}
                        {jobDetails?.companyProfile?.companyName}{" "}
                      </span>
                    </div>
                    <br className="d-md-none d-block"></br>
                    <div className="order-sm-last order-first">
                      <span className="small-text-gray "> Job Location </span>
                      <br />
                      <span className="black-text">
                        {" "}
                        {jobDetails.reportingType === "OPEN_TO_ALL"
                          ? "Open To All"
                          : jobDetails.reportingType &&
                            jobDetails.reportingType === "INPERSON"
                          ? "In Person"
                          : jobDetails.reportingType}{" "}
                        | {jobDetails.locationName}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-12 d-md-block d-none text-md-end text-center">
                  {referring ? (
                    <input
                      type="button"
                      onClick={() => setReferJobShow(true)}
                      value="Refer This Role"
                      className={`btn-primary btn-rounded text-white ps-lg-5 pe-lg-5 ps-md-4 pe-md-4`}
                    />
                  ) : (
                    <input
                      type="button"
                      onClick={() => {
                        setShow(true);
                        if (!token) {
                          setCurrentJobDetails(jobDetails);
                          setIsNonLoginUserApplyDetailJob(true);
                        }
                      }}
                      disabled={
                        jobDetails?.applicationStatus === APPLIED ? true : false
                      }
                      value={
                        jobDetails?.applicationStatus === APPLIED
                          ? "Applied"
                          : "Apply For This Role"
                      }
                      className={` btn-rounded text-white ps-lg-5 pe-lg-5 ps-md-4 pe-md-4 ${
                        jobDetails?.applicationStatus === APPLIED
                          ? "btn-disable"
                          : "btn-primary"
                      } `}
                    />
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="d-md-none d-block w-100 p-3 z-index-align ps-5 pe-5 bg-white bottom-0 position-fixed">
            {referring ? (
              <input
                type="button"
                onClick={() => setReferJobShow(true)}
                value="Refer This Role"
                className="btn-primary btn-rounded text-white p-2 w-100"
              />
            ) : (
              <input
                type="button"
                onClick={() => {
                  setShow(true);
                  if (!token) {
                    setCurrentJobDetails(jobDetails);
                    setIsNonLoginUserApplyDetailJob(true);
                  }
                }}
                disabled={
                  jobDetails?.applicationStatus === APPLIED ? true : false
                }
                value={
                  jobDetails?.applicationStatus === APPLIED
                    ? "Applied"
                    : "Apply For This Role"
                }
                className={`w-100 btn-rounded text-white ps-lg-5 pe-lg-5 ps-md-4 pe-md-4 ${
                  jobDetails?.applicationStatus === APPLIED
                    ? "btn-disable"
                    : "btn-primary"
                } `}
              />
            )}
          </div>
          <div
            className={`d-none d-md-block position-fixed float-bottom-button-hidden ${
              scrollShow ? "float-bottom-button" : ""
            }`}
          >
            {referring ? (
              <input
                type="button"
                onClick={() => setReferJobShow(true)}
                value="Refer This Role"
                className="btn-primary btn-rounded text-white ps-lg-5 pe-lg-5 ps-md-4 pe-md-4"
              />
            ) : (
              <input
                type="button"
                onClick={() => {
                  // if (token) {
                  setShow(true);
                  if (!token) {
                    setCurrentJobDetails(jobDetails);
                    setIsNonLoginUserApplyDetailJob(true);
                  }
                  // setReferJobShow(true);
                  // } else {
                  //   navigate("/login");
                  // }
                }}
                disabled={
                  jobDetails?.applicationStatus === APPLIED ? true : false
                }
                value={
                  jobDetails?.applicationStatus === APPLIED
                    ? "Applied"
                    : "Apply For This Role"
                }
                className={` btn-rounded text-white ps-lg-5 pe-lg-5 ps-md-4 pe-md-4 ${
                  jobDetails?.applicationStatus === APPLIED
                    ? "btn-disable"
                    : "btn-primary"
                } `}
              />
            )}
          </div>
          <div className="bg-white rounded-border shadow h-auto job-detail-content">
            <div className="container">
              <div
                style={{ paddingTop: "34px" }}
                className="d-md-flex gap-md-3 ps-2 pb-3 flex-wrap"
              >
                <span>
                  <span className="small-text-gray "> Job Type </span>
                  <br />
                  <span className="black-text">
                    {" "}
                    {jobDetails.jobType === "FULLTIME"
                      ? "Full Time"
                      : jobDetails.jobType && jobDetails.jobType === "PARTTIME"
                      ? "Part Time"
                      : jobDetails.jobType}{" "}
                  </span>
                </span>
                <hr className="d-block d-md-none"></hr>
                <span>
                  <span className="small-text-gray "> Salary </span>
                  <br />
                  <span className="black-text">
                    {`${convertToInternationalCurrencySystem(
                      jobDetails?.minSalary,
                      jobDetails?.salCurrency
                    )} - ${convertToInternationalCurrencySystem(
                      jobDetails?.maxSalary,
                      jobDetails?.salCurrency
                    )}  ${jobDetails?.salCurrency} ${jobDetails?.salaryType}`}
                  </span>
                </span>
                <hr className="d-block d-md-none"></hr>
                <span>
                  <span className="small-text-gray "> Experience </span>
                  <br />
                  <span className="black-text">
                    {" "}
                    {`${yearConversion(
                      jobDetails?.minExpRequiredMonths,
                      jobDetails?.maxExpRequiredMonths
                    )}`}
                  </span>
                </span>
                <hr className="d-block d-md-none"></hr>
                <span>
                  <span className="small-text-gray "> Function </span>
                  <br />
                  <span className="black-text">
                    {" "}
                    {jobDetails.departmentName}{" "}
                  </span>
                </span>
                <hr className="d-block d-md-none"></hr>
                {/* <span>
                  <span className="small-text-gray "> Target Start Date </span>
                  <br />
                  <span className="black-text"> {jobDetails.targetDate} </span>
                </span> */}
                <hr className="d-block d-md-none"></hr>
                <span>
                  <span className="small-text-gray "> Referral Bonus </span>
                  <br />
                  <span className="black-text">
                    {jobDetails?.referralBonus &&
                    (jobDetails?.salCurrency || jobDetails?.salaryCurrency)
                      ? convertToInternationalCurrencySystem(
                          jobDetails?.referralBonus,
                          jobDetails?.salCurrency || jobDetails?.salaryCurrency
                        ) +
                        " " +
                        jobDetails?.salCurrency
                      : NOT_MENTIONED}
                  </span>
                </span>
                <hr className="d-block d-md-none"></hr>
                <span>
                  <span className="small-text-gray "> Job Created On </span>
                  <br />
                  <span className="black-text">
                    {jobDetails?.jobCreationDate
                      ? jobDetails?.jobCreationDate
                      : NOT_MENTIONED}
                  </span>
                </span>
              </div>
              <hr className="mt-3 mb-3"></hr>
              <div>
                <div
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseDiv"
                  aria-expanded="false"
                  aria-controls="collapseDiv"
                  onClick={isJobDetailsHandler}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="fw-bold text-primary">Job Details</span>
                  <div
                    style={{ height: "29px", width: "29px" }}
                    className="btn-blue-round p-2 pt-1 pb-1 pointer"
                  >
                    <img
                      src={isJobDetails ? down : up}
                      alt="down-btn"
                      className="text-primary "
                    />
                  </div>
                </div>
                {/* Collapse Element  */}

                <div
                  className={
                    isJobDetails ? "collapse show d-block mt-4" : "d-none"
                  }
                  id="collapseDiv"
                >
                  <div
                    className={
                      isFeatured
                        ? "pt-2 d-md-flex gap-2 d-block"
                        : "d-none pt-2 d-flex gap-2"
                    }
                  >
                    <div className="col-md-6 col-12 pe-2">
                      <img
                        src={mainImage}
                        className="rounded-image w-100 p-1"
                      />
                    </div>
                    <div className="col-md-6 col-12 ps-2">
                      <img src={addImage1} className="rounded-image w-50 p-1" />

                      <img src={addImage2} className="rounded-image w-50 p-1" />

                      <p className="font-color-gray p-1 pt-3">
                        {jobDetails?.JobPromotion?.tagsLine}
                      </p>
                    </div>
                  </div>
                  <JobDetails
                    jobDetails={jobDetails}
                    showReferJobDialog={() => {
                      setReferJobShow(true);
                    }}
                  />
                </div>
              </div>
              <hr />
              <div
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#referjobcollapse"
                aria-expanded="false"
                aria-controls="referjobcollapse"
                onClick={isReferJobHandler}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold text-primary">Refer this Job</span>
                <div className="btn-blue-round p-2 pt-1 pb-1 pointer">
                  <img
                    src={(referring ? !isReferJob : isReferJob) ? down : up}
                    alt="down-btn"
                    className="text-black"
                  />
                </div>
              </div>
              <div
                className={
                  (referring ? isReferJob : !isReferJob)
                    ? "collapse h-100"
                    : "h-0"
                }
                id="referjobcollapse"
              >
                <div className="row">
                  <div className="col-12 mt-4">
                    <p className="font-medium-gray">
                      {" "}
                      For a better referral conversion, refer candidates with
                      following criteria :{" "}
                    </p>
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <span className="font-color-black fw-600 fs-16">
                      {" "}
                      Current or Past Employer{" "}
                    </span>{" "}
                    <br />
                    <div className="pt-1 pb-3 d-flex flex-wrap">
                      {jobDetails.referralCriteriaCompany?.map(
                        (company, index) => {
                          return (
                            <>
                              <div
                                className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2"
                                key={index}
                              >
                                {company}
                              </div>
                            </>
                          );
                        }
                      )}
                      {/* <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Google
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Uber
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    AirBnB
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    KhataBook
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Cred
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    ICICI Bank
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    HDFC Bank
                  </div> */}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mt-4">
                    <span className="font-color-black fw-600 fs-16">
                      Preferred Industries
                    </span>
                    <br />
                    <div className="pt-1 pb-3 d-flex flex-wrap">
                      {jobDetails.referralCriteriaIndustry?.map(
                        (industry, index) => {
                          return (
                            <>
                              <div
                                className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2"
                                key={index}
                              >
                                {industry}
                              </div>
                            </>
                          );
                        }
                      )}
                      {/* <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Payments
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Loans
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Payments
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Digital Payments
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    Digital Payments
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    eWallets
                  </div> */}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mt-3">
                    <span className="font-color-black fw-600 fs-16">
                      {" "}
                      Other{" "}
                    </span>
                    <br />
                    <div className="pt-1 pb-3 d-flex flex-wrap">
                      <ul className="p-2 ps-3 style-done">
                        {jobDetails?.referralCriteriaOther?.map(
                          (other, index) => {
                            return (
                              <li
                                className="small-text-gray fs-12 ps-1 pb-1"
                                key={index}
                              >
                                {other}
                              </li>
                            );
                          }
                        )}
                      </ul>
                      {/* {jobDetails.referralCriteriaOther?.map((other, index) => {
                        return (
                          <>
                            <div
                              className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2"
                              key={index}
                            >
                              {other}
                            </div>
                          </>
                        );
                      })} */}

                      {/* <div className="font-gray-bg p-1 ps-2 pe-2 mt-2">
                    On Notice Period
                  </div>
                  <div className="font-gray-bg p-1 ps-2 pe-2 me-2 mt-2">
                    in Service Company
                  </div> */}
                    </div>
                  </div>
                  <div className="col-12">
                    <input
                      type="button"
                      value=" Refer this Role "
                      className="btn-black mb-4 me-4 mt-3 refer-this-job-btn"
                      onClick={() => {
                        setReferJobShow(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#employer"
                aria-expanded="false"
                aria-controls="employer"
                onClick={AboutEmployerHandler}
                role="button"
                className="d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold text-primary">About the Employer</span>
                <div className="btn-blue-round p-2 pt-1 pb-1 pointer">
                  <img
                    src={isEmployer ? down : up}
                    alt="down-btn"
                    className="text-primary"
                  />
                </div>
              </div>
              <div
                id="employer"
                className={isEmployer ? "collapse pt-2 d-block" : "d-none"}
                aria-expanded="false"
              >
                <AboutEmployer
                  jobDetails={jobDetails}
                  mainImage={mainImage}
                  isEmployer={isEmployer}
                />
              </div>
              <hr />
              <br />
              <br />
              <br />
            </div>
          </div>

          {/* Modal component for apply-for-job */}
          {
            // <ApplyForJobDialog
            //   show={show}
            //   setShow={setShow}
            //   id={id}
            //   jobDetails={jobDetails}
            //   refereeId={refereeId}
            //   getJobDetails={() => {
            //     getJobDetails();
            //   }}
            // />
            <ApplyForJobDialog
              show={show}
              setShow={setShow}
              id={id}
              refereeId={refereeId}
              getJobDetails={() => {
                getJobDetails();
              }}
              jobDetails={jobDetails}
              backBtnClicked={backBtnClicked}
              setBackBtnClicked={setBackBtnClicked}
              saveToProfile={saveToProfile}
              setSaveToProfile={setSaveToProfile}
              saveToProfileCheck={saveToProfileCheck}
              setSaveToProfileCheck={setSaveToProfileCheck}
              setIsMandatory={setIsMandatory}
            />
          }
          {/* <Modal
        fullscreen="lg-down"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        scrollable={true}
      >
        <Modal.Header className="m-1 justify-content-end border-0">
          <Link to={`/job/${id}`} onClick={() => setShow(false)}>
            <img
              src={close}
              alt="close-icon"
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-3"
            />
          </Link>
        </Modal.Header>
        <Modal.Body className="scrolling-dialog">
          {isPageShow ? (
            <ApplyForJob
              jobDetails={jobDetails}
              applyForJob={applyForJob}
              setApplyForJob={setApplyForJob}
              setIsMandatory={setIsMandatory}
              isResumeSelected={isResumeSelected}
              setIsResumeSelected={setIsResumeSelected}
            />
          ) : (
            <ApplyForJobQuestions
              jobDetails={jobDetails}
              applyForJob={applyForJob}
              setApplyForJob={setApplyForJob}
              setIsMandatory={setIsMandatory}
              isMandatory={isMandatory}
              isResumeSelected={isResumeSelected}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="modal-dialog-footer">
          <div className="row w-100">
            <div className="col-6">
              <div className="d-flex gap-3">
                <div className={isPageShow ? "order-first" : "order-last"}>
                  <button className="btn-primary rounded-pill ps-3 pe-3 mt-2 text-light">
                    {isPageShow ? "1/2" : "2/2"}
                  </button>
                </div>
                <div className="mt-2 ">
                  <img
                    src={disabled}
                    alt="disabled-page-btn"
                    onClick={popupPageHandler}
                  />
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="d-flex justify-content-end">
                {isPageShow ? (
                  ""
                ) : (
                  <button
                    className="btn text-decoration-underline mt-2 fw-700 fs-14 "
                    onClick={() => setIsPageShow(true)}
                  >
                    {" "}
                    Back{" "}
                  </button>
                )}
              </div>
            </div>

            <div className="col-4 ">
              <Button
                className="btn-rounded btn-primary w-100"
                onClick={popupPageHandler}
                disabled={!isPageShow && isMandatory ? true : false}
              >
                {isPageShow ? " Continue " : " Submit Application "}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal> */}
        </div>
      )}

      {/* Refer this job modal */}

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
        referJobId={id}
        referJobShow={referJobShow}
        setReferJobShow={setReferJobShow}
        jobDetailsProps={jobDetailsProps}
        editReferral={false}
      />
    </>
  );
};

export default JobDetailsPage;
