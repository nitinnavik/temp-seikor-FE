import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import JobCard from "./JobCard";
import SeeDetailsComponent from "./SeeDetailsComponent";
import { getAppliedJobs } from "../_services/job.service";
import NoDataFoundCard from "./common/no_data_found_card";
import Loader from "./common/loader";
import { isEmpty } from "../utils/form_validators";
import toaster from "./../utils/toaster";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import InfiniteScroll from "react-infinite-scroll-component";
import { APPLIED_JOB_EMPTY_MESSAGE } from "../constants/message";
import CompanyImage from "./company_image";
import JobCardApplication from "./JobCardapplication";

const ApplicationsData = forwardRef((props, ref) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh,
    performFiltering,
  }));
  const refresh = () => {
    setAppliedJobs([]);
    const newfilter = {
      ...filter,
    };
    newfilter.pageNo = 1;
    setFilter(newfilter);
  };

  const performFiltering = (isActive, applicationStatus, sortBy) => {
    setAppliedJobs([]);
    const newfilter = {
      ...filter,
    };
    newfilter.pageNo = 1;
    newfilter.isActive = isActive;
    newfilter.applicationStatus = applicationStatus;
    newfilter.sortBy = sortBy;
    setFilter(newfilter);
  };
  const [filter, setFilter] = useState({
    pageNo: 1,
    pageSize: props?.viewAll ? DEFAULT_PAGE_SIZE : 6,
    isActive: null,
    applicationStatus: null,
    sortBy: null,
  });

  const fetchAppliedJobs = (filter) => {
    setShowLoader(true);
    getAppliedJobs(filter).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          let t = [...appliedJobs].concat(res?.data?.data);
          setAppliedJobs(t);
          props.appliedJobsCount(res?.data?.totalRecord);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        } else {
          setShowLoader(false);
          setJobMessage(res?.data?.message);
          props.appliedJobsCount(res?.data?.totalRecord);
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
    fetchAppliedJobs(filter);
  }, [filter]);

  const fetchMoreData = () => {
    const newfilter = {
      ...filter,
    };

    newfilter.pageNo = newfilter.pageNo + 1;
    newfilter.pageSize = props?.viewAll === true ? DEFAULT_PAGE_SIZE : 6;
    setFilter(newfilter);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={appliedJobs.length}
        next={() => fetchMoreData()}
        hasMore={props.viewAll !== false && appliedJobs.length < dataCount}
        style={{ overflow: "hidden" }}
      >
        {props?.viewAll && showLoader && <Loader />}
        <div className="row">
          {appliedJobs?.length === 0 && showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : APPLIED_JOB_EMPTY_MESSAGE}
              />
            </div>
          ) : null}
          {appliedJobs?.length > 0 &&
            appliedJobs?.map((appliedJob, index) => {
              return (
                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                  <JobCard>
                    <div className="save-job-action">
                      <JobCardApplication
                        id={appliedJob?.jobId}
                        onJobRetract={() => {
                          refresh();
                        }}
                      />
                    </div>
                    <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                      <div className="company-logo-wrapper">
                        {/* <img
                          src={`data:image/jpeg;base64 , ${appliedJob?.companyLogo}`}
                          alt="company name"
                          width="50px"
                        /> */}
                        <CompanyImage
                          src={appliedJob?.companyLogo}
                          width="50px"
                          name={appliedJob?.companyName}
                          initialsContainerClass="initialsStyle2-xl"
                        />
                      </div>
                      <div className="company-name">
                        <span> {appliedJob?.companyName}</span>
                        <br />
                        {appliedJob?.jobTitle}
                      </div>
                    </div>
                    <div className="applied-info">
                      <p className="applied-date">
                        Applied : {appliedJob?.appliedDate}
                      </p>
                      <p className="applied-status">
                        Application Status : {appliedJob?.applicationStatus}
                      </p>
                    </div>
                    <SeeDetailsComponent
                      id={appliedJob?.jobId}
                      status={appliedJob?.applicationStatus}
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

export default ApplicationsData;
