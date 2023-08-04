/* eslint-disable jsx-a11y/alt-text */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { fetchRefereeReferrals } from "../_services/job.service";
import CardReferred from "./CardReferred";
import NoDataFoundCard from "./common/no_data_found_card";
import JobCardViewReferralDetails from "./JobCardViewReferralDetails";
import Loader from "./common/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import toaster from "./../utils/toaster";
import { isEmpty } from "../utils/form_validators";
import {
  CURRENCY,
  NOT_MENTIONED,
  REFEREE_REFERRAL_EMPTY_MESSAGE,
} from "../constants/message";
import icWhiteDone from "../assests/icons/ic_done_white.svg";
import CompanyImage from "./company_image";
import { convertToInternationalCurrencySystem } from "../utils/utils";

const RefereeReferralsComponent = forwardRef((props, ref) => {
  const [refereeReferrals, setRefereeReferrals] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [jobMessage, setJobMessage] = useState();
  // Ref
  useImperativeHandle(ref, () => ({
    refresh() {
      setRefereeReferrals([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      setFilter(newfilter);
      // fetchMoreData();
    },

    filter(applicationStatus, isPendingRecommendation, sortBy, jobRole) {
      setRefereeReferrals([]);
      const newfilter = {
        ...filter,
      };
      newfilter.pageNo = 1;
      newfilter.applicationStatus = applicationStatus;
      newfilter.isPendingRecommendation = isPendingRecommendation;
      newfilter.sortBy = sortBy;
      newfilter.jobRole = jobRole;
      setFilter(newfilter);
      // fetchMoreData();
    },
  }));

  const [filter, setFilter] = useState({
    pageNo: 1,
    pageSize: props?.viewAll ? 10 : 6,
    applicationStatus: null,
    isPendingRecommendation: null,
    sortBy: null,
  });

  const fetchRefereeReferralsJobs = (filter) => {
    setShowLoader(true);
    fetchRefereeReferrals(filter).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          let t = [...refereeReferrals].concat(res?.data?.data);
          setRefereeReferrals(t);
          if (props?.setReferredJobsList) {
            props?.setReferredJobsList(t);
          }
          props.referrals(res?.data?.totalRecord);
          setDataCount(res?.data?.totalRecord);
          setShowLoader(false);
        } else {
          setRefereeReferrals([]);
          setJobMessage(res?.data?.message);
          console.log(jobMessage, res?.data?.message);
          props.referrals(res?.data?.totalRecord);
          setShowLoader(false);
        }
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };

  const fetchMoreData = () => {
    const newfilter = {
      ...filter,
    };

    newfilter.pageNo = newfilter.pageNo + 1;
    newfilter.pageSize = props?.viewAll === true ? DEFAULT_PAGE_SIZE : 6;

    setFilter(newfilter);
    //   fetchSavedJobs(filter);
  };

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (props?.viewAll && firstUpdate?.current) {
      firstUpdate.current = false;

      return;
    }

    fetchRefereeReferralsJobs(filter);
  }, [filter]);

  const progressBarCalculator = (referral, index) => {
    if (referral) {
      const rating = isEmpty(referral?.candidateRating) ? 0 : 100 / 3;
      const recommendation = isEmpty(referral?.comments_business) ? 0 : 100 / 3;
      const skills = isEmpty(referral?.candidateSkills) ? 0 : 100 / 3;
      let progress = rating + recommendation + skills;
      return progress;
    }
  };
  return (
    <div>
      <InfiniteScroll
        dataLength={refereeReferrals.length}
        next={() => fetchMoreData()}
        hasMore={props?.viewAll && refereeReferrals.length < dataCount}
        style={{ overflowX: "hidden" }}
        // loader={showLoader ? <Loader /> : ""}
      >
        {showLoader && <Loader headerLess={props?.viewAll ? false : true} />}
        <div className={refereeReferrals?.length === 0 ? "row" : "row"}>
          {refereeReferrals?.length === 0 && showLoader === false ? (
            <div className="pe-4">
              <NoDataFoundCard
                text={jobMessage ? jobMessage : REFEREE_REFERRAL_EMPTY_MESSAGE}
              />
            </div>
          ) : null}

          {refereeReferrals?.length > 0 &&
            refereeReferrals?.map((referral, index) => {
              return (
                <div
                  className="d-flex row-divider card-view position-relative card-parent"
                  key={index}
                >
                  <div className="referral-table-left-column">
                    <div className="company-details-wrapper d-flex justify-content-start align-items-center text-left">
                      <div className="company-logo-wrapper">
                        {/* <img
                          src={
                            referral?.companyLogo
                              ? `data:image/jpeg;base64 , ${referral?.companyLogo}`
                              : ""
                          }
                          alt="company name"
                          width="50px"
                        /> */}
                        <CompanyImage
                          src={referral?.companyLogo}
                          width="50px"
                          name={referral?.companyName}
                          initialsContainerClass="initialsStyle2-xl"
                        />
                      </div>
                      <div className="company-name">
                        <span>{referral?.companyName}</span>
                        <br />
                        {referral?.jobTitle}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column referral-table-right-column">
                    <div className="d-flex flex-column referral-child-row">
                      <div className="d-flex justify-content-between">
                        <p className="label mb-2 d-block d-xl-none">
                          Referred to
                        </p>
                        <p className="small-text-gray mb-2 d-block d-md-none">
                          {referral?.referedOn}
                        </p>
                      </div>

                      <div className="d-flex align-items-middle align-items-md-center flex-column flex-md-row">
                        <div className="referred-to align-middle">
                          <div className="label left-space">
                            <CardReferred
                              name={referral?.refererName}
                              designation={referral?.refererPost}
                              src={referral?.refererProfilePic}
                              company={referral?.refererCompany}
                            />
                          </div>
                        </div>
                        <div className="date d-none d-lg-block">
                          <p className="small-text-gray left-space">
                            {referral?.referedOn}
                          </p>
                        </div>
                        <div className="status">
                          <p className="small-text-dark-gray left-space">
                            <span className="label d-md-none">
                              Status&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>{" "}
                            {referral?.jobApplicationStatus}
                          </p>
                        </div>
                        <div className="your-recommendation">
                          <p className="small-text-dark-gray left-space">
                            <div className="label d-md-none pb-2">
                              Your recommendation&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>{" "}
                            <div className="pe-4">
                              {referral?.jobApplicationStatus == "JOINED" ? (
                                "Candidate has joined"
                              ) : progressBarCalculator(referral, index) ===
                                100 / 3 ? (
                                <div>
                                  <div className="fs-12 dark-pink-text pb-2">
                                    Complete recommending
                                  </div>
                                  <div className="w-100 recommendation-wrapper ">
                                    <div className="progress-bar-blue w-33"></div>
                                  </div>
                                </div>
                              ) : progressBarCalculator(referral, index) ===
                                100 / 3 + 100 / 3 ? (
                                <div>
                                  <div className="fs-12 dark-pink-text pb-2">
                                    Complete recommending
                                  </div>
                                  <div className="w-100 recommendation-wrapper ">
                                    <div className="progress-bar-blue w-66"></div>
                                  </div>
                                </div>
                              ) : progressBarCalculator(referral, index) ===
                                100 ? (
                                <div className="d-flex gap-2">
                                  <img
                                    src={icWhiteDone}
                                    className="bg-success p-1 rounded-circle me-1 mt-1"
                                  />
                                  <div className="pt-1"> Added</div>
                                </div>
                              ) : (
                                <div
                                  className={
                                    progressBarCalculator(referral, index) === 0
                                      ? "d-block"
                                      : "d-none"
                                  }
                                >
                                  <div className="fs-12 dark-pink-text">
                                    Add recommmendation
                                  </div>
                                  <div className="w-100 recommendation-wrapper mt-2">
                                    <div className="progress-bar-blue w-0"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </p>
                        </div>
                        <div className="bonus">
                          <p className="small-text-dark-gray left-space">
                            <div className="label d-md-none">
                              Bonus &nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                              {referral?.referralAmount &&
                              referral?.referalCurrency ? (
                                <div>
                                  <div className="mb-1">
                                    {convertToInternationalCurrencySystem(
                                      referral?.referralAmount,
                                      referral?.referalCurrency
                                    ) +
                                      " " +
                                      referral?.referalCurrency}
                                  </div>
                                  <p>on candidate joining</p>
                                  {referral?.paymentStatus &&
                                    referral?.paymentStatus ===
                                      "REQUEST_PAYMENT" && (
                                      <p className="fs-11 fw-600 request_payment">
                                        Payment Requested
                                      </p>
                                    )}
                                  {referral?.paymentStatus &&
                                    referral?.paymentStatus ===
                                      "PAYMENT_PROCESSED" && (
                                      <p className="fs-11 fw-600 processed_payment">
                                        Payment Processed
                                      </p>
                                    )}
                                </div>
                              ) : (
                                NOT_MENTIONED
                              )}
                            </div>
                          </p>
                        </div>
                        <JobCardViewReferralDetails
                          referalId={referral?.referalId}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
    </div>
  );
});

export default RefereeReferralsComponent;
