import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import JobCard from "./JobCard";
import JobCardSave from "./JobCardSave";
import { getSavedJobs } from "./../_services/job.service";
import locationBlueIcon from "./../assests/icons/ic-location-blue.svg";
import salaryIcon from "./../assests/icons/ic-salary.svg";
import experienceIcon from "./../assests/icons/ic-experience.svg";
import starbuckLogo from "./../assests/starbuck_logo.png";
import { Link } from "react-router-dom";
import NoDataFoundCard from "./common/no_data_found_card";
import Loader from "./common/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import toaster from "./../utils/toaster";
import { isEmpty } from "../utils/form_validators";
import JobCardQuickApply from "../components/JobCardQuickApply";
import { SAVED_JOB_EMPTY_MESSAGE } from "../constants/message";
import CompanyImage from "./company_image";
import { convertToInternationalCurrencySystem } from "../utils/utils";

const SavedJobs = forwardRef((props, ref) => {
  const [dataCount, setDataCount] = useState(0);
  const [currentOffset, setCurrentOffSet] = useState(0);
  // const [page, setPage] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh() {
      setSavedJobs([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      setFilter(newfilter);
      // fetchMoreData();
    },

    filter(isActive, applicationStatus, sortBy) {
      setSavedJobs([]);
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

  const fetchSavedJobs = (filter) => {
    setShowLoader(true);
    getSavedJobs(filter).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          let t = [...savedJobs].concat(res?.data?.data);
          setSavedJobs(t);
          props.savedJobCount(res?.data?.totalRecord);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        } else {
          setSavedJobs([]);
          setShowLoader(false);
          setJobMessage(res?.data?.message);
          props.savedJobCount(res?.data?.totalRecord);
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
    fetchSavedJobs(filter);
  }, [filter]);

  const fetchMoreData = () => {
    const newfilter = {
      ...filter,
    };

    newfilter.pageNo = newfilter.pageNo + 1;
    newfilter.pageSize = props?.viewAll === true ? 10 : 6;
    console.log(newfilter.pageNo);
    setFilter(newfilter);
    //   fetchSavedJobs(filter);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={savedJobs.length}
        next={() => fetchMoreData()}
        hasMore={props.viewAll !== false && savedJobs.length < dataCount}
        style={{ overflow: "hidden" }}
      >
        {props?.viewAll && showLoader && <Loader />}
        <div className="row">
          {savedJobs?.length === 0 && showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : SAVED_JOB_EMPTY_MESSAGE}
              />
            </div>
          ) : null}

          {savedJobs?.length > 0 &&
            savedJobs?.slice(0,6)?.map((savedJob, index) => {
              return (
                <div className="col-md-6 col-lg-4 mb-3" key={index}>
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
                          height="50px"
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
                          {/* {savedJob.salaryCurrency} */}
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
                    </div>
                    <div className="why-look-job">
                      <p className="title">Why look at this role</p>
                      <p className="description">
                        {savedJob?.jobAdvantages
                          ? savedJob?.jobAdvantages[0]
                          : null}
                      </p>
                    </div>

                    <JobCardQuickApply
                      jobId={savedJob?.jobId}
                      applicationStatus={savedJob?.applicationStatus}
                      onJobApplied={() => {
                        if (props?.onJobApplied) {
                          props?.onJobApplied();
                        }
                      }}
                    />
                  </JobCard>
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
    </div>
  );
});

export default SavedJobs;
