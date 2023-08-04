import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import JobCard from "./JobCard";
import JobCardSave from "./JobCardSave";
import {
  fetchRefereeRecommendation,
  fetchRefereeReferedJobs,
  fetchRefereeSavedJobs,
  getSavedJobs,
} from "../_services/job.service";
import locationBlueIcon from "./../assests/icons/ic-location-blue.svg";
import salaryIcon from "./../assests/icons/ic-salary.svg";
import experienceIcon from "./../assests/icons/ic-experience.svg";
import starbuckLogo from "./../assests/starbuck_logo.png";
import { Link } from "react-router-dom";
import JobCardSalary from "./JobCardSalary";
import JobCardWhyLook from "./JobCardWhyLook";
import NoDataFoundCard from "./common/no_data_found_card";
import { isEmpty } from "../utils/form_validators";
import toaster from "./../utils/toaster";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./common/loader";

import ReferForJob from "./ReferForJob";
import { REFEREE_REFERRED_JOB_EMPTY_MESSAGE } from "../constants/message";
import CompanyImage from "./company_image";
import { convertToInternationalCurrencySystem } from "../utils/utils";
import { JOB_DETAILS_PAGE_REFEREE_ROUTE } from "../constants/page-routes";

const RefreeReferredJobs = forwardRef((props, ref) => {
  const [refreeReferrededJobs, setRefreeReferrededJobs] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [referJobShow, setReferJobShow] = useState(false);
  const [disableReferralBtn, setDisableReferralBtn] = useState(false);
  const [jobMessage, setJobMessage] = useState();

  useImperativeHandle(ref, () => ({
    refresh() {
      setPage(0);
      fetchMoreData();
    },
  }));

  const filter = {
    pageNo: 1,
    pageSize: props.viewAll === true ? 100 : 6,
  };
  const fetchReferredJobs = (filter) => {
    setShowLoader(true);
    fetchRefereeRecommendation(filter).then(
      (res) => {
        if (res?.data?.status === "SUCCESS" && !isEmpty(res)) {
          if (!props?.viewAll) {
            setRefreeReferrededJobs(res?.data?.data);
          } else {
            let t = [...refreeReferrededJobs].concat(res?.data?.data);

            setRefreeReferrededJobs(t);
          }
          props.referralreferredJobCount(res?.data?.totalRecord);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        } else {
          setRefreeReferrededJobs([]);
          setShowLoader(false);
          setJobMessage(res?.data?.message);
        }
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };
  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = () => {
    let filter = {
      pageNo: 1,
      pageSize: props?.viewAll === true ? DEFAULT_PAGE_SIZE : 6,
    };
    setPage(filter.pageNo);
    fetchReferredJobs(filter);
  };
  return (
    <div>
      <InfiniteScroll
        dataLength={refreeReferrededJobs.length}
        next={() => fetchMoreData()}
        hasMore={
          props.viewAll !== false && refreeReferrededJobs.length < dataCount
        }
        style={{ overflowX: "hidden" }}
        // loader={showLoader ? <Loader /> : ""}
      >
        {props?.viewAll && showLoader && <Loader />}
        <div className="row">
          {(refreeReferrededJobs?.length === 0 || dataCount === 0) &&
          showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={
                  jobMessage ? jobMessage : REFEREE_REFERRED_JOB_EMPTY_MESSAGE
                }
              />
            </div>
          ) : null}

          {refreeReferrededJobs?.length > 0 &&
            refreeReferrededJobs.slice(0, 6)?.map((referredJob, index) => {
              return (
                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                  <JobCard>
                    <div className="save-job-action">
                      <JobCardSave
                        saveStatus={referredJob?.isSavedApplied}
                        jobId={referredJob?.jobId}
                        isReferer={referredJob?.isSavedReferal}
                        onJobSaved={() => {
                          props?.onJobSaved();
                        }}
                      />
                    </div>
                    <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                      <div className="company-logo-wrapper">
                        <CompanyImage
                          src={referredJob?.companyLogo}
                          width="50px"
                          name={referredJob?.companyName}
                          initialsContainerClass="initialsStyle2-xl"
                        />
                      </div>
                      <div className="company-name">
                        <span>{referredJob?.companyName}</span>
                        <br />
                        {referredJob?.jobTitle}
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
                          {referredJob?.reportingType} |{" "}
                          {referredJob?.jobLocation}
                        </div>
                      </div>
                      <div className="package-wrapper">
                        <div className="package d-flex align-items-center">
                          <img src={salaryIcon} alt="salary" className="pe-1" />
                          {`${convertToInternationalCurrencySystem(
                            referredJob?.jobMinSalary,
                            referredJob?.salaryCurrency
                          )} - ${convertToInternationalCurrencySystem(
                            referredJob?.jobMaxSalary,
                            referredJob?.salaryCurrency
                          )}  ${referredJob?.salaryCurrency} ${
                            referredJob?.salaryType
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
                          {Number(referredJob?.jobMinExp)} -{" "}
                          {Number(referredJob?.jobMaxExp)} Yrs
                        </div>
                      </div>
                      <div className="package-wrapper">
                        <JobCardSalary
                          text={` Referral Bonus - ${Number(
                            referredJob.referalBonus
                          )}`}
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <JobCardWhyLook
                        text={
                          referredJob?.jobAdvantages
                            ? referredJob?.jobAdvantages[0]
                            : null
                        }
                      />
                    </div>
                    <div className="action">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn blue-gradient"
                          onClick={() => {
                            props?.setReferJobShow(true);
                            props?.setJobIdProps(referredJob?.jobId);
                            props?.setJobDetailsProps(referredJob);
                          }}
                        >
                          Refer this Role
                        </button>
                        <div className="link">
                          <Link
                            to={{
                              pathname: `/job/${referredJob?.jobId}`,
                              search: JOB_DETAILS_PAGE_REFEREE_ROUTE,
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

export default RefreeReferredJobs;
