import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../assests/icons/back-icon.svg";
import jobCompanyLogo from "../../assests/images/job-company-logo.png";
import icDown from "../../assests/icons/ic-chevron-down-16.svg";
import icUp from "../../assests/icons/ic-chevron-up-16.svg";
import ReferralProfessionalExperience from "../../components/referral-profile-view/professional_experience";
import ReferralEducationDetails from "../../components/referral-profile-view/referral_education";
import RequestPaymentDialog from "../../components/request_payment_dialog";
import ViewMessagesDialog from "../../components/view_messages_dialog";
import ReferAJobDialog from "../../components/refer_a_job_dialog";
import EducationAcademics from "./member-profile/education_and_academics";
import { useStoreActions, useStoreState } from "easy-peasy";
import { fetchJobDetails } from "../../_services/member-profile.service";
import toaster from "../../utils/toaster";
import {
  CANDIDATE_API_FAILED,
  GENERAL_ERROR_MESSAGE,
  LOCATION_NOT_AVAILABLE,
  NOT_MENTIONED,
  NO_DETAILS_AVAILABLE,
} from "./../../constants/message.js";
import { APPLY_STATUS, STATUS_SUCCESS } from "../../constants/keys";
import { fetchReferedJobDetails } from "../../_services/job.service";
import CompanyImage from "../../components/company_image";
import ProfessionalExperience from "../../components/ProfessionalExperience";
import ApplicationExperience from "../../components/application_view/application_experience";
import ProfileImage from "../../components/profile_image";
import { isEmpty } from "../../utils/form_validators";
import { downloadFile } from "../../_services/view.service";
import { getCandidateDetails } from "../../_services/view.service";
import { convertToInternationalCurrencySystem } from "../../utils/utils";
import { Button } from "react-bootstrap";
import { useRef } from "react";
import Loader from "../../components/common/loader";

const ViewReferralPage = (props) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [showRequestPayment, setShowRequestPayment] = useState(false);
  const [showViewMessages, setShowViewMessages] = useState(false);
  const [referButtonClicked, setReferButtonClicked] = useState(false);
  const [disableReferralBtn, setDisableReferralBtn] = useState(false);
  const [referJobShow, setReferJobShow] = useState(false);
  const [editReferral] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [jobDetails, setJobDetails] = useState(true);
  const [refereeReferrals, setRefereeReferrals] = useState([]);
  const [profileSrc, setProfileSrc] = useState(null);
  const [jobIdProps, setJobIdProps] = useState(null);
  const [applicationid, setApplicationId] = useState(null);
  const [DetailsProps, setDetailsProps] = useState();
  const [apiRefresh, setApiRefresh] = useState(false);
  const [isFeedback, setIsFeedback] = useState();
  const [ratingStar, setRatingStar] = useState();
  const [reason, setReason] = useState();
  const [referralAmount, setReferralAmount] = useState();
  const [paymentStatus, setPaymentStatus] = useState();
  const [referrerId, setReferrerId] = useState(0);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [isCandidateError, setIsCandidateError] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  // const candidateDetails = useStoreState(
  //   (state) => state.candidate.candidateDetails
  // );
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );
  const referralEditBtnRef = useRef();

  let { id } = useParams();
  const fetchReferee = () => {
    setShowLoader(true);
    fetchReferedJobDetails(id)
      .then((res) => {
        if (!isEmpty(res?.data?.data) && res?.data?.status == STATUS_SUCCESS) {
          let t = res?.data?.data;
          setRefereeReferrals(t);
          setShowLoader(false);
          setReferrerId(t[0]?.referrerId);

          // toaster(
          //   "success",
          //   res?.data?.message ? res?.data?.message : STATUS_SUCCESS
          // );
        } else {
          toaster("error", "referral data is not available");
        }
      })
      .catch((err) => {
        setRefereeReferrals([]);
        setShowLoader(false);
        toaster("error", err);
      });
  };

  useEffect(() => {
    fetchReferee();
  }, []);

  useEffect(() => {
    if (viewProfile === true)
      getCandidateDetails(referrerId)
        .then((res) => {
          console.log(res);
          if (res?.status === 200) setCandidateDetails(res?.data?.data);
          else if (res?.message) {
            setIsCandidateError(res?.message);
          } else {
            setIsCandidateError(CANDIDATE_API_FAILED);
          }
        })
        .catch((err) => {
          console.log(err);
          toaster("error", CANDIDATE_API_FAILED);
        });
  }, [viewProfile]);

  useEffect(() => {
    if (apiRefresh === true) {
      fetchReferee();
      setApiRefresh(false);
    }
  }, [apiRefresh]);

  const [profilePicSrc, setProfilePicSrc] = useState("");

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setProfilePicSrc(res);
      }
    });
  };

  const [candidateStatus, setCandidateStatus] = useState(false);

  useEffect(() => {
    // console.log("refereeReferrals", refereeReferrals);
    if (refereeReferrals?.length) {
      downloadPicture(refereeReferrals[0]?.refererProfilePic);
    }
    if (refereeReferrals[0]?.jobApplicationStatus == "JOINED") {
      setCandidateStatus(true);
    } else {
      setCandidateStatus(false);
    }
  }, [refereeReferrals]);

  const onRefferalEditClicked = (referral) => {
    setReferJobShow(true);
    setJobIdProps(referral?.jobId);
    setApplicationId(id);
    setDetailsProps(referral?.referrerEmail);
    setIsFeedback(referral?.comments_business);
    setRatingStar(referral?.candidateRating);
    setReason(referral?.candidateSkills);
  };
console.log( applicationid,"applicationid")
  return (
    <>
      {showLoader && <Loader />}
      <div className="bg-white w-100 pt-4">
        <div className="container pb-3">
          <div className="d-flex mb-3 w-100">
            <Link
              to="/candidate/referral-referred-jobs"
              className="color-primary d-flex gap-2"
            >
              <img src={BackButton} alt={BackButton} />
              <div className="color-primary fs-12 fw-400 back-btn-width">
                Back to My View
              </div>
            </Link>
          </div>
          {refereeReferrals?.length > 0 &&
            refereeReferrals?.map((referral, index) => {
              return (
                <div className="container" key={index}>
                  <div className="mt-3 d-flex justify-content-center">
                    <div className="col-lg-6 col-12">
                      {/* company details */}
                      <div className="box-shadow p-3 feedback-background">
                        <div className="company-details-wrapper d-flex justify-content-start align-items-center">
                          <div className="company-logo-wrapper">
                            <CompanyImage
                              src={referral?.companyLogo}
                              name={referral?.companyName}
                              width="50px"
                              initialsContainerClass="initialsStyle2-xl"
                            />
                            {/* <img src={jobCompanyLogo} alt="company name" /> */}
                          </div>
                          <div className="company-name">
                            {/* <span>{"Dunzo"}</span> */}
                            <span>{referral?.companyName}</span>
                            <br />
                            {referral?.jobTitle}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <Link
                            to={`/job/${referral?.jobId}`}
                            className="fs-12 fw-500 color-primary pe-3 text-decoration-underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                      {/* reffered to details */}
                      <div className="large-text-dark-gray fw-700 mt-4 mb-4">
                        Referred to
                      </div>
                      {/* referral profile details */}
                      <div className="box-shadow">
                        <div className="p-1">
                          <div className="d-flex gap-3 ps-2 pt-2">
                            <div className="sidebar-profile-pic">
                              {/* <img
                              src={require("./../../assests/images/profile.jpg")}
                              alt="profile-img"
                              width="70px"
                              className="border-radius"
                            /> */}
                              <ProfileImage
                                src={profilePicSrc}
                                name={referral?.refererName}
                                initialsContainerClass="initialsStyle2-xl"
                              />
                            </div>
                            <div className="pt-1">
                              <h4 className="fs-16 fw-600 m-0">
                                {/* Amon Soon */}
                                {referral?.refererName}
                              </h4>
                              <div className="d-flex gap-2">
                                <span className="fs-16 fw-500">
                                  {/* Senior Visual Designer */}
                                  {referral?.refererPost}
                                </span>{" "}
                                <span className="fs-16 fw-400 light-gray-color">
                                  {referral?.refererCompany && `at`}
                                </span>
                                <span className="fs-16 fw-500">
                                  {/* Microsoft  */}
                                  {referral?.refererCompany}
                                </span>
                              </div>
                              <div className="color-tertiary fw-400 fs-12">
                                {/* 21 May 2022 */}
                                {referral?.referedOn}
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        {!viewProfile ? (
                          <div className="d-flex justify-content-end p-3 pt-0 gap-2 pointer">
                            <div
                              className="fs-12 pe-2 text-decoration-underline pointer"
                              onClick={() => setViewProfile(true)}
                            >
                              View Details
                            </div>
                            <img
                              src={icDown}
                              alt="down-icon"
                              onClick={() => setViewProfile(true)}
                            />
                          </div>
                        ) : (
                          <div>
                            {isCandidateError ? (
                              <div>{CANDIDATE_API_FAILED}</div>
                            ) : !candidateDetails?.userPrivacySettings
                                ?.location &&
                              !candidateDetails?.userPrivacySettings
                                ?.workHistory &&
                              !candidateDetails?.userPrivacySettings
                                ?.education ? (
                              <div className="font-medium-gray ms-3">
                                {NO_DETAILS_AVAILABLE}
                              </div>
                            ) : (
                              candidateDetails?.userPrivacySettings
                                ?.location && (
                                <div className="p-3 pt-0 pb-0 fs-14">
                                  <div className="color-primary fw-600 pb-1">
                                    Current Location
                                  </div>
                                  <div className="font-medium-gray ">
                                    {" "}
                                    {candidateDetails
                                      ?.additionalInfoProfileResponse
                                      ?.currentLocation
                                      ? candidateDetails
                                          ?.additionalInfoProfileResponse
                                          ?.currentLocation
                                      : LOCATION_NOT_AVAILABLE}{" "}
                                  </div>
                                  <hr></hr>
                                </div>
                              )
                            )}
                            {candidateDetails?.userPrivacySettings
                              ?.workHistory && (
                              <>
                                <div className="title-card my-4 fw-600 fs-16 pt-1 pb-0 ps-3">
                                  Professional Experience
                                </div>
                                <ProfessionalExperience
                                  candidateDetails={candidateDetails}
                                  isReadOnlyProp={true}
                                  fromViewRefrral={true}
                                />
                                <hr></hr>
                              </>
                            )}
                            {candidateDetails?.userPrivacySettings
                              ?.education && (
                              <>
                                <div className="title-card my-4 fw-600 fs-16 pt-1 pb-0 ps-3">
                                  Education
                                </div>
                                {/* <ReferralEducationDetails /> */}
                                <EducationAcademics
                                  candidateDetails={candidateDetails}
                                  isReadOnly={true}
                                  fromViewRefrral={true}
                                />
                                <hr></hr>
                              </>
                            )}

                            <div className="d-flex justify-content-end p-3 pt-0 gap-2">
                              <div
                                className="fs-12 pe-2 text-decoration-underline pointer"
                                onClick={() => setViewProfile(false)}
                              >
                                Hide Profile
                              </div>
                              <img
                                src={icUp}
                                alt="up-icon"
                                onClick={() => setViewProfile(false)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 box-shadow p-3">
                        <div className="large-text-dark-gray fw-700 ">
                          Messages from recruiter
                        </div>
                        <div className="d-flex justify-content-between flex-sm-row flex-column">
                          <div className="medium-text-dark-gray fw-400 pt-2">
                            {messageCount} messages
                          </div>
                          <div className="d-flex justify-content-end pt-2 pt-sm-0">
                            <div
                              className="btn btn-outline-dark fs-12 fw-700"
                              onClick={() => setShowViewMessages(true)}
                            >
                              View Messages
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 box-shadow p-3">
                        <div className="large-text-dark-gray fw-700 ">
                          Application
                        </div>
                        <div className="medium-text-dark-gray fw-400 pt-2">
                          Application Status : {referral?.jobApplicationStatus}{" "}
                          -{referral?.appliedDate}
                        </div>
                      </div>

                      <div className="mt-3 box-shadow p-3">
                        <div className="large-text-dark-gray fw-700 ">
                          Referral Bonus
                        </div>
                        <div className="d-flex justify-content-between flex-sm-row flex-column">
                          <div className="medium-text-dark-gray fw-400 pt-2">
                            {/* ₹ 5,650 on candidate joining */}
                            {referral?.referralAmount
                              ? `${
                                  referral?.currencyType
                                    ? referral?.currencyType
                                    : "INR"
                                } ${convertToInternationalCurrencySystem(
                                  referral?.referralAmount,
                                  referral?.currencyType
                                    ? referral?.currencyType
                                    : "INR"
                                )}`
                              : NOT_MENTIONED}
                          </div>
                          <div className="d-flex justify-content-end">
                            {/* {referral?.jobApplicationStatus ===
                            APPLY_STATUS.JOINED && ( */}
                            {referral?.jobApplicationStatus ==
                            APPLY_STATUS?.JOINED ? (
                              referral?.paymentStatus == null ? (
                                <div
                                  className="btn btn-outline-dark fs-12 fw-700 text-white bg-dark cursor-none"
                                  onClick={() => {
                                    setShowRequestPayment(true);
                                    setReferralAmount(referral?.referralAmount);
                                    setPaymentStatus(referral?.paymentStatus);
                                  }}
                                >
                                  Request payment
                                </div>
                              ) : (
                                <div
                                  style={{
                                    opacity: 0.6,
                                    pointerEvents: "none",
                                    cursor: "none",
                                  }}
                                  className="btn btn-outline-dark fs-12 fw-700 text-white bg-dark "
                                >
                                  Payment Already Requested
                                </div>
                              )
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 box-shadow ">
                        <div className="p-3 pb-0">
                          <div className="d-flex justify-content-between flex-sm-row flex-column">
                            <div>
                              <div className="large-text-dark-gray fw-700 ">
                                Your recommendation
                              </div>
                              <div className="dark-pink-text fs-12">
                                The following recommendations will only be
                                shared with the employer
                              </div>
                            </div>
                            <div className="pt-3 pt-sm-0 w-100 d-flex justify-content-end">
                              <div>
                                <button
                                  ref={referralEditBtnRef}
                                  disabled={candidateStatus}
                                  className="btn btn-outline-dark fs-12 fw-700 text-white bg-dark ps-4 pe-4 p-2 mb-2"
                                  onClick={() => {
                                    onRefferalEditClicked(referral);
                                  }}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr></hr>
                          <div className="large-text-dark-gray fw-700 fs-14">
                            Rating of the candidate
                          </div>
                          <div className="fs-12 color-tertiary">
                            On a scale of 1-5, how would you rate this candidate
                            for this role
                          </div>
                          <div className="color-tertiary fs-32">
                            {referral?.candidateRating}{" "}
                          </div>
                        </div>
                        <hr></hr>
                        <div className="p-3 pt-0">
                          <div className="large-text-dark-gray fw-700 fs-14">
                            Top 3 reasons to refer this candidate
                          </div>
                          <div className="d-flex gap-2 pt-2">
                            {referral?.candidateSkills?.length > 0 &&
                              referral?.candidateSkills.map((skill, index) => (
                                <div
                                  className="font-color-blue"
                                  key={index + 1}
                                >
                                  {skill}
                                </div>
                              ))}
                          </div>
                        </div>
                        <hr></hr>
                        <div className="p-3 pt-0">
                          <div className="large-text-dark-gray fw-700 fs-14">
                            Feedback on Candidate
                          </div>
                          <div className="fs-12 color-tertiary">
                            {referral?.comments_business
                              ? referral?.comments_business
                              : NOT_MENTIONED}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <RequestPaymentDialog
          showRequestPayment={showRequestPayment}
          onClickRequestDismiss={() => setShowRequestPayment(false)}
          referralAmount={referralAmount}
          refereeReferrals={refereeReferrals}
          pamentStatus={paymentStatus}
          setApiRefresh={setApiRefresh}
        />
        <ViewMessagesDialog
          refereeReferrals={refereeReferrals}
          showViewMessages={showViewMessages}
          onClickMessagesDismiss={() => setShowViewMessages(false)}
          setMessageCount={setMessageCount}
          messageCount={messageCount}
        />
        <ReferAJobDialog
          onClosedButtonClick={() => {
            setReferJobShow(false);
            setNonLoginReferData();
          }}
          isShow={referJobShow}
          referrerId={referrerId}
          referButtonClicked={referButtonClicked}
          setReferButtonClicked={setReferButtonClicked}
          disableReferralBtn={disableReferralBtn}
          setDisableReferralBtn={setDisableReferralBtn}
          referJobId={jobIdProps}
          applicationId={applicationid}
          refereeId={DetailsProps}
          Feedback={isFeedback}
          ratingStar={ratingStar}
          reason={reason}
          referJobShow={referJobShow}
          setReferJobShow={setReferJobShow}
          editReferral={editReferral}
          onJobReferred={() => {
            if (props?.onJobReferred) {
              props?.onJobReferred();
            }
          }}
          setApiRefresh={setApiRefresh}
        />
        ;
      </div>
    </>
  );
};

export default ViewReferralPage;
