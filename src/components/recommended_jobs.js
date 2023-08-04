import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { getRecommendedJobs } from "../_services/view.service";
import JobCardQuickApply from "../components/JobCardQuickApply";
import JobCardLocation from "../components/JobCardLocation";
import JobCardSalary from "../components/JobCardSalary";
import JobCardExperience from "../components/JobCardExperience";
import JobCardWhyLook from "../components/JobCardWhyLook";
import JobCardSave from "../components/JobCardSave";
import JobCard from "./JobCard";
import { convertInThousand } from "../utils/utils";
import NoDataFoundCard from "./common/no_data_found_card";
import Loader from "./common/loader";
import { isEmpty } from "../utils/form_validators";
import toaster from "../utils/toaster";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import InfiniteScroll from "react-infinite-scroll-component";
import CompanyImage from "./company_image";
import { REECOMMENDED_JOB_EMPTY_MESSAGE } from "../constants/message";

const ReccommendedJob = forwardRef((props, ref) => {
  const [recommendedJobList, setRecommendedJobList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh() {
      setPage(0);
      fetchRecommendedJobs();
    },
  }));

  let pageSize = props.viewAll === true ? DEFAULT_PAGE_SIZE : 6;
  const jobFilter = {
    pageNo: page + 1,
    pageSize: pageSize,
  };

  const fetchRecommendedJobs = () => {
    setShowLoader(true);
    getRecommendedJobs(jobFilter).then(
      (res) => {
        if (!isEmpty(res)) {
          setRecommendedJobList(res?.data);
          setShowLoader(false);
          props.recommendedJobsCount(res?.totalCount);
        } else {
          setRecommendedJobList([]);
          setJobMessage(res?.message);
          setShowLoader(false);
        }
      },
      (error) => {
        setShowLoader(false);
        toaster("error", error);
      }
    );
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  return (
    <div>
      <InfiniteScroll
        dataLength={recommendedJobList.length}
        next={() => fetchRecommendedJobs()}
        hasMore={
          props.viewAll !== false &&
          recommendedJobList.length < DEFAULT_PAGE_SIZE
        }
        style={{ overflow: "hidden" }}
      >
        {props?.viewAll && showLoader && <Loader />}
        <div className="row">
          {recommendedJobList?.length === 0 && !showLoader ? (
            <div className="pe-3">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : REECOMMENDED_JOB_EMPTY_MESSAGE}
              />
            </div>
          ) : null}
          {recommendedJobList?.length > 0 &&
            recommendedJobList?.slice(0,6)?.map((list, index) => (
              <div className="col-md-6 col-lg-4 mb-3" key={index + 1}>
                <JobCard>
                  <div className="save-job-action">
                    <JobCardSave
                      jobId={list?.jobId}
                      saveStatus={list?.isSavedApplied}
                      isReferer={list?.isSavedReferal}
                      onJobSaved={() => {
                        props?.onJobSaved();
                      }}
                    />
                  </div>
                  <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                    <div className="company-logo-wrapper">
                      {/* <img
                        src={`data:image/jpeg;base64 , ${list?.companyLogo}`}
                        alt="company name"
                        width="50px"
                      /> */}
                      <CompanyImage
                        src={list?.companyLogo}
                        width="50px"
                        height="50px"
                        name={list?.companyName}
                        initialsContainerClass="initialsStyle2-xl"
                      />
                    </div>
                    <div className="company-name">
                      <span>{list?.companyName}</span>
                      <br />
                      {list?.jobTitle}
                    </div>
                  </div>

                  <div className="job-other-info d-flex align-content-start flex-wrap">
                    <div className="location-wrapper">
                      <JobCardLocation
                        text={`${list?.reportingType} | ${list?.jobLocation}`}
                      />
                    </div>
                    <div className="package-wrapper">
                      <JobCardSalary
                        // text={`${
                        //   list?.jobMinSalary
                        //     ? convertInThousand(list?.jobMinSalary) + "-"
                        //     : ""
                        // }${convertInThousand(list?.jobMaxSalary)}K`}
                        data={list}
                      />
                    </div>
                    <div className="experience-wrapper">
                      <JobCardExperience
                        text={`${Number(list?.jobMinExp)} - ${Number(
                          list?.jobMaxExp
                        )} Yrs`}
                      />
                    </div>
                  </div>
                  <div className="why-look-job">
                    <JobCardWhyLook
                      text={list?.jobAdvantages ? list?.jobAdvantages[0] : null}
                    />
                  </div>
                  <JobCardQuickApply
                    jobId={list?.jobId}
                    applicationStatus={list?.applicationStatus}
                    onJobApplied={() => {
                      if (props?.onJobApplied) {
                        props?.onJobApplied();
                      }
                    }}
                  />
                </JobCard>
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </div>
  );
});

export default ReccommendedJob;
