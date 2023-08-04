import React, { useEffect, useState } from "react";
import BackButton from "../../assests/icons/back-icon.svg";
import { Link, useParams } from "react-router-dom";
import ApplicationCompanyCard from "../../components/application_company_card";
import FeedbackComponent from "../../components/FeedbackComponent";
import icRetract from "./../../assests/icons/ic_retract.svg";
import ApplicationAboutMe from "../../components/application_view/application_about_me";
import ApplicationResume from "../../components/application_view/application_resume";
import ApplicationContactOnlinePresence from "../../components/application_view/application_contact_online_presence";
import ApplicationSkills from "../../components/application_view/application_skills";
import ApplicationExperience from "../../components/application_view/application_experience";
import ApplicationEducationAndAcademics from "../../components/application_view/application_education_and_academics";
import ApplicationQuestions from "../../components/application_view/application_questions";
import { useStoreState } from "easy-peasy";
import {
  getApplicationRetract,
  getAppliedJobsById,
} from "../../_services/job.service";
import toaster from "./../../utils/toaster";
import JobCardApplication from "../../components/JobCardapplication";
import { APPLIED, APPLY_STATUS, STATUS_SUCCESS } from "../../constants/keys";
import { GENERAL_ERROR_MESSAGE, NOT_MENTIONED } from "../../constants/message";
import { downloadFile } from "../../_services/view.service";
import { Dropdown } from "react-bootstrap";

const MyApplicationDetailedViewPage = (props) => {
  let { id } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [allDetails, setAllDetails] = useState();
  const [companyDetails, setCompanyDetails] = useState();
  // const [isFeedback, setIsFeedback] = useState(false);
  // setIsFeedback(allDetails?.feedback === null);

  const [isRetractShow, setIsRetractShow] = useState(false);
  const [candidateProfilePicture, setCandidateProfilePicture] = useState();

  const candidateDetailsFromStore = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setCandidateProfilePicture(res);
      } else {
        setCandidateProfilePicture(null);
      }
    });
  };

  useEffect(() => {
    if (
      candidateDetailsFromStore?.basicDetailsResponse?.profilePicDownloadURL !==
      (undefined || null)
    ) {
      downloadPicture(
        candidateDetailsFromStore?.basicDetailsResponse?.profilePicDownloadURL
      );
    } else {
      setCandidateProfilePicture(null);
    }
  }, [candidateDetailsFromStore]);

  const Retract = () => {
    setShowLoader(true);
    getApplicationRetract(id)
      .then((res) => {
        fetchReferee();
        setIsRetractShow(false);
        if (res?.data?.status == STATUS_SUCCESS) {
          toaster(
            "success",
            res?.data?.message ? res?.data?.message : STATUS_SUCCESS
          );
        } else {
          toaster(
            "error",
            res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
          );
        }
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("Error", err);
      });
  };

  const fetchReferee = () => {
    setShowLoader(true);
    getAppliedJobsById(id)
      .then((res) => {
        setShowLoader(false);
        // if (res?.data?.status == STATUS_SUCCESS) {
        //   toaster(
        //     "success",
        //     res?.data?.message ? res?.data?.message : STATUS_SUCCESS
        //   );
        // } else {
        //   toaster(
        //     "error",
        //     res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
        //   );
        // }
        setAllDetails(res?.data?.data);
      })
      .catch((err) => {
        setShowLoader(false);
        // toaster("error", err);
      });
  };

  useEffect(() => {
    fetchReferee();
  }, []);

  const retractButtonHandler = () => {
    if (isRetractShow === false) {
      setIsRetractShow(true);
    } else {
      setIsRetractShow(false);
    }
  };

  return (
    <div className="bg-white w-100">
      <div className="container">
        <div className="pt-3 pb-3">
          <Link
            // to="/candidate/my-applications"
            to={-1}
            className="btn bg-transparent fw-bold ms-0 ps-0 pt-0 text-left"
            style={{ color: "#808080", outline: "none" }}
          >
            <img src={BackButton} alt={BackButton} />{" "}
            <span className="backTitle"> Go Back</span>
          </Link>
        </div>
        <div className="container">
          <div className="d-flex row justify-content-center">
            <div className="col-lg-6 col-12">
              <ApplicationCompanyCard
                companyDetailsBind={{
                  jobId: allDetails?.jobApplication?.jobId,
                  companyName: allDetails?.companyProfile?.companyName,
                  designation: allDetails?.jobPosting?.jobTitle,
                  applied: allDetails?.jobApplication?.appliedDate,
                  appliedStatus: allDetails?.jobApplication?.applicationStatus,
                  companyLogo: allDetails?.companyProfile?.companyLogo,
                }}
              />
              <div className="mt-3">
                <h3 className="font-color-black fs-20 fw-700">
                  {" "}
                  Your Application{" "}
                </h3>

                {/*<div>
                  {allDetails?.jobApplication?.applicationStatus ===
                  APPLY_STATUS.APPLIED ? (
                    <div
                      className="d-flex justify-content-end pointer"
                      onClick={retractButtonHandler}
                    >
                      <img src={icRetract} alt="retract-icon" />
                    </div>
                  ) : null}
                  <div
                    className={
                      isRetractShow
                        ? "d-flex justify-content-end mt-1 d-block"
                        : "d-none"
                    }
                  >
                    <button
                      className="btn bg-white dark-pink-text fs-12 retract-btn-padding border-dark"
                      id="retract-btn"
                      onClick={Retract}
                    >
                      {" "}
                      Retract Application{" "}
                    </button>

                    {/* <button onclick="Retract()">sayHelloRetract Application</button>  
                  </div>
                </div>*/}

                <Dropdown className="d-flex justify-content-end timeline-select-dropdown p-0">
                  <Dropdown.Toggle
                    // style={{ padding: "0.2rem 0.7rem" }}
                    variant="none"
                    // id="dropdown-basic"
                    className={
                      allDetails?.jobApplication?.applicationStatus ===
                      APPLY_STATUS.APPLIED
                        ? "d-flex justify-content-end pointer"
                        : "d-none"
                    }
                  >
                    <img src={icRetract} alt="retract-icon" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={Retract}
                      className="btn bg-white dark-pink-text fs-12 border-dark"
                      id="retract-btn"
                    >
                      <span className="">Retract Application</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div>
                  <ApplicationAboutMe
                    aboutMeDetails={{
                      profileImage: candidateProfilePicture,
                      profileName:
                        allDetails?.viewProfileResponse?.userRegistrationDetails
                          ?.name,
                      profileDesignation:
                        allDetails?.viewProfileResponse
                          ?.additionalInfoProfileResponse?.currentDesignation,
                      lastCompanyName:
                        allDetails?.viewProfileResponse
                          ?.additionalInfoProfileResponse?.company,
                      whyshouldhiredescription: allDetails?.viewProfileResponse
                        ?.additionalInfoProfileResponse?.aboutMe
                        ? allDetails?.viewProfileResponse
                            ?.additionalInfoProfileResponse?.aboutMe
                        : NOT_MENTIONED,
                    }}
                  />
                </div>
                <div className="mt-2">
                  <ApplicationResume allDetails={allDetails} />
                </div>
                <div>
                  <ApplicationContactOnlinePresence
                    contactAndOnlinePresenceDetails={{
                      email: allDetails?.viewProfileResponse
                        ?.userRegistrationDetails?.email
                        ? allDetails?.viewProfileResponse
                            ?.userRegistrationDetails?.email
                        : NOT_MENTIONED,
                      mobile:
                        allDetails?.viewProfileResponse?.userRegistrationDetails
                          ?.mobile,
                      currentLocation:
                        allDetails?.viewProfileResponse?.basicDetailsResponse
                          ?.currentAddress,
                      socialLink:
                        allDetails?.viewProfileResponse?.socialLinksResponses,
                    }}
                  />
                </div>
                <div>
                  <ApplicationSkills
                    skillAndExperienceDetails={{
                      skills:
                        allDetails?.viewProfileResponse?.skillsResponse
                          ?.keySkills,
                      industries:
                        allDetails?.viewProfileResponse?.skillsResponse
                          ?.industries,
                      functions:
                        allDetails?.viewProfileResponse?.skillsResponse
                          ?.functions,
                    }}
                  />
                </div>

                <div>
                  <ApplicationExperience
                    professionalExperienceDetails={
                      allDetails?.viewProfileResponse?.workExperienceResponse
                    }
                  />
                </div>
                <div>
                  <ApplicationEducationAndAcademics
                    educationAndAcademicsDetails={
                      allDetails?.viewProfileResponse
                        ?.educationalExperienceResponse
                    }
                  />
                </div>
                {allDetails?.jobQuestionAndAnswers?.length > 0 && (
                  <div>
                    <ApplicationQuestions
                      additionalQuestionsDetails={
                        allDetails?.jobQuestionAndAnswers
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            {(allDetails?.jobApplication?.applicationStatus ===
              APPLY_STATUS.RETRACTED ||
              allDetails?.jobApplication?.applicationStatus ===
                APPLY_STATUS.JOINED) &&
            allDetails?.feedback === null ? (
              <div className="col-lg-6 col-12 mb-5">
                <FeedbackComponent
                  feedbackDetails={allDetails?.feedback}
                  ratingDefault={allDetails?.feedback?.rating}
                  feedbackDefault={allDetails?.feedback?.feedback}
                  jobId={allDetails?.jobApplication?.jobId}
                  jobAppId={allDetails?.jobApplication?.applicationId}
                  userId={allDetails?.jobApplication?.userId}
                  onJobFeedback={(event) => {
                    fetchReferee();
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplicationDetailedViewPage;
