import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import JobCard from "./JobCard";
import JobCardSave from "./JobCardSave";
import { fetchRefereeSavedJobs } from "../_services/job.service";
import locationBlueIcon from "./../assests/icons/ic-location-blue.svg";
import salaryIcon from "./../assests/icons/ic-salary.svg";
import experienceIcon from "./../assests/icons/ic-experience.svg";
import starbuckLogo from "./../assests/starbuck_logo.png";
import { Link } from "react-router-dom";
import JobCardSalary from "./JobCardSalary";
import NoDataFoundCard from "./common/no_data_found_card";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import { isEmpty } from "../utils/form_validators";
import toaster from "./../utils/toaster";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./common/loader";
import { REFEREE_SAVED_JOB_EMPTY_MESSAGE } from "../constants/message";
import CompanyImage from "./company_image";
import { convertToInternationalCurrencySystem } from "../utils/utils";
import { JOB_DETAILS_PAGE_REFEREE_ROUTE } from "../constants/page-routes";

const RefreeSavedJobs = forwardRef((props, ref) => {
  const [refereeSavedJobs, setRefereeSavedJobs] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh() {
      setRefereeSavedJobs([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      setFilter(newfilter);
      // fetchMoreData();
    },

    filter(isActive, applicationStatus, sortBy) {
      setRefereeSavedJobs([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      newfilter.isActive = isActive;
      newfilter.applicationStatus = applicationStatus;
      newfilter.sortBy = sortBy;
      setFilter(newfilter);
      // fetchMoreData();
    },
  }));

  const [filter, setFilter] = useState({
    pageNo: 1,
    pageSize: props?.viewAll ? 10 : 6,
    isActive: null,
    applicationStatus: null,
    sortBy: null,
  });

  const getRefereeSavedJobs = (filter) => {
    setShowLoader(true);
    fetchRefereeSavedJobs(filter).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          let t = [...refereeSavedJobs].concat(res?.data?.data);
          setRefereeSavedJobs(t);
          props.referralsavedJobCount(res?.data?.totalRecord);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        } else {
          setRefereeSavedJobs([]);
          setJobMessage(res?.data?.message);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        }
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (props.viewAll && firstUpdate?.current) {
      firstUpdate.current = false;
      return;
    }
    getRefereeSavedJobs(filter);
  }, [filter]);

  const fetchMoreData = () => {
    const newfilter = {
      ...filter,
    };

    newfilter.pageNo = newfilter.pageNo + 1;
    newfilter.pageSize = props?.viewAll === true ? DEFAULT_PAGE_SIZE : 6;
    console.log(newfilter);
    setFilter(newfilter);
    //   fetchSavedJobs(filter);
  };

  const SetJobDetailsObject = (jobDetails) => {
    const jobTitle = jobDetails?.jobTitle;
    const companyName = jobDetails?.companyName;
    const companyLogo = jobDetails?.companyLogo;

    props?.setJobDetailsProps({
      ...props?.jobDetailsProps,
      jobTitle,
      companyName,
      companyLogo,
    });
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={refereeSavedJobs.length}
        next={() => fetchMoreData()}
        hasMore={props.viewAll !== false && refereeSavedJobs.length < dataCount}
        style={{ overflowX: "hidden" }}
        // loader={showLoader ? <Loader /> : ""}
      >
        {props?.viewAll && showLoader && <Loader />}
        <div className="row">
          {refereeSavedJobs?.length === 0 && showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : REFEREE_SAVED_JOB_EMPTY_MESSAGE}
              />
            </div>
          ) : null}

          {refereeSavedJobs?.length > 0 &&
            refereeSavedJobs?.slice(0,6)?.map((savedJob, index) => {
              return (
                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                  {console.log(savedJob, "refer")}
                  <JobCard>
                    <div className="save-job-action">
                      <JobCardSave
                        saveStatus={savedJob?.isSavedApplied}
                        jobId={savedJob?.jobId}
                        isReferer={savedJob?.isSavedReferal}
                        onJobSaved={() => {
                          props?.onJobSaved();
                        }}
                      />
                    </div>
                    <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                      <div className="company-logo-wrapper">
                        {/* <img
                          src={`data:image/jpeg;base64 , ${savedJob?.companyLogo}`}
                          alt="company name"
                          width="50px"
                        /> */}
                        <CompanyImage
                          src={savedJob?.companyLogo}
                          width="50px"
                          name={savedJob?.companyName}
                          initialsContainerClass="initialsStyle2-xl"
                        />
                      </div>
                      <div className="company-name">
                        <span>{savedJob?.companyName}</span>
                        <br />
                        {savedJob?.jobTitle}
                      </div>
                    </div>

                    <div className="job-other-info d-flex align-content-start flex-wrap">
                      <div className="location-wrapper">
                        <div className="location d-flex align-items-center">
                          <img
                            src={locationBlueIcon}
                            alt="location"
                            className="pe-1"
                          />
                          {savedJob?.reportingType} | {savedJob?.jobLocation}
                        </div>
                      </div>
                      <div className="package-wrapper">
                        <div className="package d-flex align-items-center">
                          <img src={salaryIcon} alt="salary" className="pe-1" />
                          {`${convertToInternationalCurrencySystem(
                            savedJob?.jobMinSalary,
                            savedJob?.salaryCurrency
                          )} - ${convertToInternationalCurrencySystem(
                            savedJob?.jobMaxSalary,
                            savedJob?.salaryCurrency
                          )}  ${savedJob?.salaryCurrency} ${
                            savedJob?.salaryType
                          }`}
                        </div>
                      </div>
                      <div className="experience-wrapper">
                        <div className="experience d-flex align-items-center">
                          <img
                            src={experienceIcon}
                            alt="experience"
                            className="pe-1"
                          />
                          {Number(savedJob?.jobMinExp)} -{" "}
                          {Number(savedJob?.jobMaxExp)} Yrs
                        </div>
                      </div>
                      <div className="package-wrapper">
                        <JobCardSalary
                          text={` Referral Bonus - ${Number(
                            savedJob.referalBonus
                          )}`}
                        />
                      </div>
                    </div>
                    <div className="why-look-job pt-4">
                      <p className="title">Why look at this role</p>
                      <p className="description">
                        {savedJob?.jobAdvantages
                          ? savedJob?.jobAdvantages[0]
                          : null}
                      </p>
                    </div>
                    <div className="action">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn blue-gradient"
                          onClick={() => {
                            props?.setReferJobShow(true);
                            props?.setJobIdProps(savedJob?.jobId);
                            SetJobDetailsObject(savedJob);
                          }}
                        >
                          Refer this Role
                        </button>

                        <div className="link">
                          <Link
                            to={{
                              pathname: `/job/${savedJob?.jobId}${JOB_DETAILS_PAGE_REFEREE_ROUTE}`,
                            }}
                          >
                            See Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </JobCard>
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
    </div>
  );
});

export default RefreeSavedJobs;
