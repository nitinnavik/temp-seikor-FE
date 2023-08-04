import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import JobCard from "../components/JobCard";
import JobCardReferred from "../components/JobCardReferred";
import JobCardQuickApply from "../components/JobCardQuickApply";
import jobCompanyLogo from "../assests/images/job-company-logo.png";
import { getRefferedJobs } from "../_services/job.service";
import NoDataFoundCard from "./common/no_data_found_card";
import locationBlueIcon from "./../assests/icons/ic-location-blue.svg";
import salaryIcon from "./../assests/icons/ic-salary.svg";
import experienceIcon from "./../assests/icons/ic-experience.svg";
import JobCardWhyLook from "./JobCardWhyLook";
import JobCardNew from "./JobCardNew";
import Loader from "./common/loader";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import InfiniteScroll from "react-infinite-scroll-component";
import { isEmpty } from "../utils/form_validators";
import toaster from "../utils/toaster";
import { REFERRED_JOB_EMPTY_MESSAGE } from "../constants/message";
import { downloadFile } from "../_services/view.service";
import CompanyImage from "./company_image";
import { convertToInternationalCurrencySystem } from "../utils/utils";

const RefferedJob = forwardRef((props, ref) => {
  const [refferedJobs, setRefferedJobs] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh() {
      setRefferedJobs([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      setFilter(newfilter);
      // fetchMoreData();
    },

    filter(isActive, applicationStatus, sortBy) {
      setRefferedJobs([]);
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

  const fetchRefferedJobs = (filter) => {
    setShowLoader(true);
    getRefferedJobs(filter).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          let t = [...refferedJobs].concat(res?.data?.data?.referedJobList);
          setRefferedJobs(t);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
          props.refferedJobCount(res?.data?.totalRecord);
          props?.setCheckRefferedJobCount(res?.data?.totalRecord);
          props.newJobCount(res?.data?.data?.newRecords);
        } else {
          setRefferedJobs([]);
          setShowLoader(false);
          setJobMessage(res?.data?.message);
          props.refferedJobCount(res?.data?.totalRecord);
          props?.setCheckRefferedJobCount(res?.data?.totalRecord);
          props.newJobCount(res?.data?.data?.newRecords);
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
    fetchRefferedJobs(filter);
  }, [filter]);

  const fetchMoreData = () => {
    const newfilter = {
      ...filter,
    };

    newfilter.pageNo = newfilter.pageNo + 1;
    newfilter.pageSize = props?.viewAll === true ? DEFAULT_PAGE_SIZE : 6;

    setFilter(newfilter);
    //   fetchSavedJobs(filter);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={refferedJobs.length}
        next={() => fetchMoreData()}
        hasMore={props.viewAll !== false && refferedJobs.length < dataCount}
        style={{ overflow: "hidden" }}
        // loader={showLoader ? <Loader /> : ""}
      >
        {showLoader && <Loader headerLess={props.viewAll ? false : true} />}
        <div className="row">
          {refferedJobs?.length === 0 && showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : REFERRED_JOB_EMPTY_MESSAGE}
              />
            </div>
          ) : null}
          {refferedJobs?.length > 0 &&
            refferedJobs?.map((refferJob, index) => {
              return (
                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                  <JobCard>
                    {props.viewAll ? (
                      <div>
                        <JobCardNew isNew={refferJob?.isNew} />
                      </div>
                    ) : null}
                    <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                      <div className="company-logo-wrapper">
                        <CompanyImage
                          src={refferJob?.companyLogo}
                          width="50px"
                          name={refferJob?.companyName}
                          initialsContainerClass="initialsStyle2-xl"
                        />
                        {/* <img
                          src={`data:image/jpeg;base64 , ${refferJob?.companyLogo}`}
                          alt="company name"
                          width="50px"
                        /> */}
                      </div>
                      <div className="company-name">
                        <span>{refferJob?.companyName}</span>
                        <br />
                        {refferJob?.jobTitle}
                      </div>
                    </div>
                    {props.viewAll ? (
                      <div>
                        <div className="job-other-info d-flex align-content-start flex-wrap">
                          <div className="location-wrapper">
                            <div className="location d-flex align-items-center">
                              <img
                                src={locationBlueIcon}
                                alt="location"
                                className="pe-1"
                              />
                              {refferJob?.reportingType} |{" "}
                              {refferJob?.jobLocation}
                            </div>
                          </div>
                          <div className="package-wrapper">
                            <div className="package d-flex align-items-center">
                              <img
                                src={salaryIcon}
                                alt="salary"
                                className="pe-1"
                              />
                              {`${convertToInternationalCurrencySystem(
                                refferJob?.jobMinSalary,
                                refferJob?.salaryCurrency
                              )} - ${convertToInternationalCurrencySystem(
                                refferJob?.jobMaxSalary,
                                refferJob?.salaryCurrency
                              )}  ${refferJob?.salaryCurrency} ${
                                refferJob?.salaryType
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
                              {Number(refferJob?.jobMinExp)} -{" "}
                              {Number(refferJob?.jobMaxExp)} Yrs
                            </div>
                          </div>
                        </div>
                        <div className="fs-12">
                          <JobCardWhyLook
                            text={
                              refferJob?.jobAdvantages
                                ? refferJob?.jobAdvantages[0]
                                : null
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="job-referred-by-wrapper">
                      <JobCardReferred
                        reffererName={refferJob?.refererName}
                        refererPost={refferJob?.refererPost}
                        referedOn={refferJob?.referedOn}
                        src={refferJob?.refererProfilePic}
                        name={refferJob?.refererName}
                        backgroundColor="white"
                      />
                    </div>
                    <JobCardQuickApply
                      jobId={refferJob?.jobId}
                      applicationStatus={refferJob?.applicationStatus}
                      refererId={refferJob?.refererId}
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

export default RefferedJob;
