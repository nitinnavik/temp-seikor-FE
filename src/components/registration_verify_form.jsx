import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import InputOtp from "./input_otp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  AddLocation,
  AddSocialMedia,
  GenerateOtp,
  OtpVerification,
  addEducationDetails,
} from "../_services/member-profile.service";
import { updateMobile, updateEmail } from "../_services/member-profile.service";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import {
  SOMETHING_WENT_WRONG,
  STATUS_200,
  STATUS_SUCCESS,
  USER_ID,
  WRONG_CREDENTIALS,
} from "../constants/keys";
import Loader from "../components/common/loader";
import { login } from "../_services/auth.service";
import { useStoreActions, useStoreState } from "easy-peasy";
import { RESEND_OTP_WAIT_TIME_IN_SECONDS } from "../constants/config";
import { Button } from "react-bootstrap";
import {
  BOTH_OTP_SENT,
  EMAIL_OTP_SENT,
  ENTER_VALID_EMAIL_OTP,
  ENTER_VALID_OTP,
  GENERAL_ERROR_MESSAGE,
  INVALID_EMAIL_OTP,
  INVALID_PHONE_OTP,
  MOBILE_OTP_SENT,
  VALID_EMAIL_OTP,
  VALID_PHONE_OTP,
  BOTH_EMAIL_AND_PHONE_INVALID,
  WAIT_FOR_TIMER,
} from "../constants/message";
import {
  updateAdditionalDetails,
  userCurrentDetails,
  userMessage,
} from "../_services/candidate.service";
import {
  addCandidateSkills,
  addCandidateWorkExperience,
  updateResume,
} from "../_services/view.service";
import {
  ALL_JOBS_PAGE_ROUTE,
  JOB_DETAILS_PAGE_ROUTE,
} from "../constants/page-routes";
import { updateSavedAndPinJob } from "../_services/job.service";

const RegistrationVerifyForm = (props) => {
  const [isPasswordShown, setIsPasswordShown] = useState("password");
  const [isEmailPasswordShown, setIsEmailPasswordShown] = useState("password");
  const [emailPasswordIcon, setEmailPasswordIcon] = useState(
    <FaEyeSlash size={24} />
  );
  const [passwordIcon, setPasswordIcon] = useState(<FaEyeSlash size={24} />);
  const nonLoginSaveForApplying = useStoreState(
    (state) => state?.nonLoginSaveForApplying
  );
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const setNewlyRegister = useStoreActions(
    (actions) => actions.setNewlyRegister
  );
  const currentJobDetails = useStoreState((state) => state?.currentJobDetails);
  const isNonLoginUserApplyDetailJob = useStoreState(
    (state) => state?.isNonLoginUserApplyDetailJob
  );
  const isReferringWithOutLogin = useStoreState(
    (actions) => actions?.isReferringWithOutLogin
  );
  const nonLoginReferData = useStoreState(
    (actions) => actions?.nonLoginReferData
  );

  const isReferringFromDetailsWithOutLogin = useStoreState(
    (actions) => actions?.isReferringFromDetailsWithOutLogin
  );

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const navigate = useNavigate();
  const [otpNum, setOtpNum] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [count, setCount] = useState(RESEND_OTP_WAIT_TIME_IN_SECONDS);
  const [submitButton, setSubmitButton] = useState("Verify and Create Account");
  const [otpResendRequired, setOtpResendRequired] = useState(false);
  const [isPhoneVerificationSuccessful, setIsPhoneVerificationSuccessful] =
    useState(false);
  const [isEmailVerificationSuccessful, setIsEmailVerificationSuccessful] =
    useState(false);

  // const saveCandidateDetails = useStoreActions(
  //   (actions) => actions.candidate.saveCandidateDetails
  // );
  const [isMobileResendAsked, setIsMobileResendAsked] = useState(true);
  const [isEmailResendAsked, setIsEmailResendAsked] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [invalidPhoneMessage, setInvalidPhoneMessage] = useState(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState(false);
  const refTime = useRef(null);
  // const [isEmailOtpResent, setIsEmailOtpResent] = useState(false);
  // const [isPhoneOtpResent, setIsPhoneOtpResent] = useState(false);
  const [waitForEmailVerification, setWaitForEmailVerification] =
    useState(true);
  const [unableToGetOtp, setUnableToGetOtp] = useState(null);
  const [dataParams] = useSearchParams();
  const applyForJobNonLoginUser = useStoreState(
    (state) => state?.applyForJobNonLoginUser
  );
  const isApplyingWithOutLogin = useStoreState(
    (state) => state?.isApplyingWithOutLogin
  );
  var email = props.sentParentToChild?.email;
  var phone = props.sentParentToChild?.phone;

  const redirectPage = () => {
    let reqArray = [];
    if (props?.redirectUrl == "") {
      if (isApplyingWithOutLogin) {
        if (nonLoginSaveForApplying) {
          updateSavedAndPinJob(
            nonLoginSaveForApplying?.jobId,
            nonLoginSaveForApplying?.isSave,
            nonLoginSaveForApplying?.isRefer,
            nonLoginSaveForApplying?.boolean
          );
          navigate(
            `/${JOB_DETAILS_PAGE_ROUTE}/${nonLoginSaveForApplying?.jobId}`
          );
        } else if (isReferringWithOutLogin && nonLoginReferData) {
          if (isReferringFromDetailsWithOutLogin) {
            navigate(`/${JOB_DETAILS_PAGE_ROUTE}/${nonLoginReferData?.jobId}`);
          } else {
            navigate(ALL_JOBS_PAGE_ROUTE);
          }
        } else {
          //   let message = userMessage(
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.aboutMe ? applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.aboutMe : ""
          //   )
          //   if (
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.aboutMe
          //   ) {

          //     reqArray.push(message);
          //   }

          //   let userCurrentDetailsObj = {
          // currentDesignation: applyForJobNonLoginUser?.userProfileSnap
          //   ?.additionalInfoProfileResponse?.currentDesignation
          //   ? applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.currentDesignation
          //   : candidateDetails?.additionalInfoProfileResponse
          //       ?.currentDesignation,
          // company: applyForJobNonLoginUser?.userProfileSnap
          //   ?.additionalInfoProfileResponse?.company
          //   ? applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.company
          //   : candidateDetails?.additionalInfoProfileResponse?.company,
          // jobSearchStatus: applyForJobNonLoginUser?.userProfileSnap
          //   ?.additionalInfoProfileResponse?.jobSearchStatus
          //   ? applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.jobSearchStatus
          //   : candidateDetails?.additionalInfoProfileResponse
          //       ?.jobSearchStatus,
          //   };
          //   let userDetails = userCurrentDetails(
          //     userCurrentDetailsObj?.currentDesignation,
          //     userCurrentDetailsObj?.company,
          //     userCurrentDetailsObj?.jobSearchStatus
          //   );
          //   if (
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.company ||
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.currentDesignation ||
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.jobSearchStatus
          //   ) {
          //     reqArray.push(userDetails);
          //   }

          // let addLocation = AddLocation(
          //   applyForJobNonLoginUser?.userProfileSnap
          //     ?.additionalInfoProfileResponse?.currentLocation ? applyForJobNonLoginUser?.userProfileSnap
          //     ?.additionalInfoProfileResponse?.currentLocation : null
          // );
          //   if (
          //     applyForJobNonLoginUser?.userProfileSnap
          //       ?.additionalInfoProfileResponse?.currentLocation
          //   ) {
          //     reqArray.push(addLocation);
          //   }
          let additionalDetails = updateAdditionalDetails({
            currentDesignation: applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.currentDesignation
              ? applyForJobNonLoginUser?.userProfileSnap
                  ?.additionalInfoProfileResponse?.currentDesignation
              : candidateDetails?.additionalInfoProfileResponse
                  ?.currentDesignation,
            company: applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.company
              ? applyForJobNonLoginUser?.userProfileSnap
                  ?.additionalInfoProfileResponse?.company
              : candidateDetails?.additionalInfoProfileResponse?.company,
            jobSearchStatus: applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.jobSearchStatus
              ? applyForJobNonLoginUser?.userProfileSnap
                  ?.additionalInfoProfileResponse?.jobSearchStatus
              : candidateDetails?.additionalInfoProfileResponse
                  ?.jobSearchStatus,
            aboutMe: applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.aboutMe
              ? applyForJobNonLoginUser?.userProfileSnap
                  ?.additionalInfoProfileResponse?.aboutMe
              : "",
            currentLocation: applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.currentLocation
              ? applyForJobNonLoginUser?.userProfileSnap
                  ?.additionalInfoProfileResponse?.currentLocation
              : null,
          });
          if (
            applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.aboutMe ||
            applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.company ||
            applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.currentDesignation ||
            applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.jobSearchStatus ||
            applyForJobNonLoginUser?.userProfileSnap
              ?.additionalInfoProfileResponse?.currentLocation
          ) {
            reqArray.push(additionalDetails);
          }

          let temp = [];
          temp = applyForJobNonLoginUser?.userProfileSnap?.socialLinksResponses
            ? applyForJobNonLoginUser?.userProfileSnap?.socialLinksResponses?.map(
                (finalObj, index) => {
                  if (finalObj?.linkUrl.length > 0) {
                    return {
                      id: finalObj.id,
                      linkTitle: finalObj.linkTitle,
                      linkUrl: finalObj.linkUrl,
                    };
                  } else {
                    return {
                      id: finalObj.id,
                      linkTitle: finalObj.linkTitle,
                      linkUrl: finalObj.linkUrl,
                    };
                  }
                }
              )
            : [];

          let addSocialMediaData = AddSocialMedia(temp);
          if (applyForJobNonLoginUser?.userProfileSnap?.socialLinksResponses) {
            reqArray.push(addSocialMediaData);
          }

          const request = {
            keySkills: applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
              ?.keySkills
              ? applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                  ?.keySkills
              : null,
            industries: applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
              ?.industries
              ? applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                  ?.industries
              : null,
            functions: applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
              ?.functions
              ? applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                  ?.functions
              : null,
          };

          let addCandidateSkillsData = addCandidateSkills(request);
          if (applyForJobNonLoginUser?.userProfileSnap?.skillsResponse) {
            reqArray.push(addCandidateSkillsData);
          }

          // let addCandidateWorkExperienceData = addCandidateSkills(request);
          if (
            applyForJobNonLoginUser?.userProfileSnap?.workExperienceResponse
          ) {
            if (
              applyForJobNonLoginUser?.userProfileSnap?.workExperienceResponse
                ?.length > 0
            ) {
              for (
                let i = 0;
                i <
                applyForJobNonLoginUser?.userProfileSnap?.workExperienceResponse
                  ?.length;
                i++
              ) {
                reqArray.push(
                  addCandidateWorkExperience(
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.workExperienceResponse[i]
                  )
                );
              }
            }
          }
          if (
            applyForJobNonLoginUser?.userProfileSnap
              ?.educationalExperienceResponse
          ) {
            if (
              applyForJobNonLoginUser?.userProfileSnap
                ?.educationalExperienceResponse?.length > 0
            ) {
              for (
                let i = 0;
                i <
                applyForJobNonLoginUser?.userProfileSnap
                  ?.educationalExperienceResponse?.length;
                i++
              ) {
                reqArray.push(
                  addEducationDetails(
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.id,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.qualification,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.degreeName,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.specialization,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.institute,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.courseStartDate,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.courseEndDate,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.outcome,
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.educationalExperienceResponse[i]?.isCompleted
                  )
                );
              }
            }
          }
          if (applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse) {
            if (
              applyForJobNonLoginUser?.userProfileSnap
                ?.userResumeResponse[1] === undefined &&
              applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
            ) {
              reqArray.push(
                updateResume([
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.userResumeResponse[0],
                ])
              );
            } else if (
              applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
            ) {
              reqArray.push(
                updateResume([
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.userResumeResponse[0],
                ])
              );
              reqArray.push(
                updateResume([
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.userResumeResponse[1],
                ])
              );
            }
          }
          reqArray.push(
            updateSavedAndPinJob(
              nonLoginSaveForApplying?.jobId,
              nonLoginSaveForApplying?.isSave,
              nonLoginSaveForApplying?.isRefer,
              nonLoginSaveForApplying?.boolean
            )
          );

          if (isNonLoginUserApplyDetailJob) {
            navigate(`/${JOB_DETAILS_PAGE_ROUTE}/${currentJobDetails?.jobId}`);
          } else {
            navigate(ALL_JOBS_PAGE_ROUTE);
          }
        }
      } else {
        navigate("/candidate/");
      }

      Promise.all(reqArray).then((res) => {
        const userId = getLocalStorage(USER_ID);
        if (res) {
          saveCandidateDetails(userId);
        }
      });
    } else {
      const params = dataParams?.get("redirectTo");
      window.location.href = params;
    }
  };

  useEffect(() => {
    if (window?.location?.search) {
      props?.setRedirectUrl(window?.location?.search?.replace(/\?/g, ""));
    }
  }, [window?.location]);

  useEffect(() => {
    resendOtp();
    startTimer();
  }, []);

  useEffect(() => {
    if (isMobileResendAsked && isEmailResendAsked) {
      if (props?.isEmailOtpResent && props?.isPhoneOtpResent) {
        toaster("success", BOTH_OTP_SENT);
        props?.setIsEmailOtpResent(false);
        props?.setIsPhoneOtpResent(false);
      }
    } else if (isMobileResendAsked && !isEmailResendAsked) {
      if (props?.isPhoneOtpResent) {
        toaster("success", MOBILE_OTP_SENT);
        props?.setIsPhoneOtpResent(false);
      }
    } else if (isEmailResendAsked && !isMobileResendAsked) {
      if (props?.isEmailOtpResent) {
        toaster("success", EMAIL_OTP_SENT);
        props?.setIsEmailOtpResent(false);
      }
    }
  }, [props?.isEmailOtpResent, props?.isPhoneOtpResent]);

  const startTimer = () => {
    refTime.current = window.setInterval(() => {
      setCount((time) => time - 1);
    }, 1000);
    return () => clear();
  };

  useEffect(() => {
    if (count === 0) {
      clear();
      refTime.current = null;
      setOtpResendRequired(true);
    }
  }, [count]);

  const clear = () => [window.clearInterval(refTime.current)];

  useEffect(() => {
    if (isPhoneVerificationSuccessful) {
      if (!waitForEmailVerification) {
        verifyCandidate();
      }
    }
  }, [isPhoneVerificationSuccessful, isEmailVerificationSuccessful]);

  const verifyCandidate = () => {
    if (isPhoneVerificationSuccessful) {
      setShowLoader(true);
      login(props?.sentParentToChild?.email, props?.sentParentToChild?.password)
        .then((res) => {
          setShowLoader(false);
          setNewlyRegister(true);
          if (res.status === STATUS_200) {
            redirectPage();
          } else {
            if (res?.data?.message) {
              toaster("error", res?.data?.message);
            } else {
              toaster("error", WRONG_CREDENTIALS);
            }
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err?.message ? err?.message : SOMETHING_WENT_WRONG);
        });
    }
    setShowLoader(false);
  };

  const resendOtp = () => {
    setShowLoader(true);
    props?.setIsEmailOtpResent(false);
    props?.setIsPhoneOtpResent(false);
    setIsMobileResendAsked(false);
    setIsEmailResendAsked(false);

    if (!firstTime) {
      setCount(RESEND_OTP_WAIT_TIME_IN_SECONDS);
      startTimer();
    }

    if (!isPhoneVerificationSuccessful) {
      setIsMobileResendAsked(true);
      GenerateOtp(phone, "SMS")
        .then((res) => {
          if (res?.status == STATUS_SUCCESS) {
            props?.setIsPhoneOtpResent(true);
            setShowLoader(false);
            setOtpResendRequired(false);
            props?.setRefNumberPhone(res?.data?.refNumber);
            if (!firstTime) {
              setUnableToGetOtp(false);
            }
          } else {
            props?.setIsPhoneOtpResent(false);
            setShowLoader(false);
            setOtpResendRequired(true);
            toaster("error", GENERAL_ERROR_MESSAGE);
            if (!firstTime) {
              setUnableToGetOtp(true);
            }
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err?.message ? err?.message : SOMETHING_WENT_WRONG);
          setOtpResendRequired(true);
        });
    }

    if (!isEmailVerificationSuccessful) {
      setIsEmailResendAsked(true);
      GenerateOtp(email, "EMAIL")
        .then((res) => {
          if (res?.status == STATUS_SUCCESS) {
            props?.setIsEmailOtpResent(true);
            // toaster("success", "OTP sent");

            setShowLoader(false);
            setOtpResendRequired(false);
            props?.setRefNumberEmail(res?.data?.refNumber);
            if (!firstTime) {
              setUnableToGetOtp(false);
            }
          } else {
            props?.setIsEmailOtpResent(true);
            setShowLoader(false);
            setOtpResendRequired(false);
            toaster("error", SOMETHING_WENT_WRONG);
            if (!firstTime) {
              setUnableToGetOtp(true);
            }
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err?.message ? err?.message : SOMETHING_WENT_WRONG);
          setOtpResendRequired(true);
        });
    }
    setFirstTime(false);
  };

  const verifyOtpEmail = () => {
    OtpVerification(
      props?.sentParentToChild?.email,
      props?.refNumberEmail,
      otpEmail,
      "email"
    )
      .then((responseEmail) => {
        if (responseEmail?.data?.verifyStatus === true) {
          setIsEmailVerificationSuccessful(true);

          setWaitForEmailVerification(false);
        } else {
          setIsEmailVerificationSuccessful(false);
          setInvalidEmailMessage(true);
          // toaster(
          //   "error",
          //   responseEmail?.message ? responseEmail?.message : INVALID_EMAIL_OTP
          // );
          setOtpEmail("");
          if (!isPhoneVerificationSuccessful) {
            toaster("error", BOTH_EMAIL_AND_PHONE_INVALID);
          } else toaster("error", INVALID_EMAIL_OTP);
        }

        setShowLoader(false);
      })
      .catch((err) => {
        setOtpEmail("");
        setShowLoader(false);
        setInvalidEmailMessage(true);
        setIsEmailVerificationSuccessful(false);
        toaster("error", INVALID_EMAIL_OTP);
      });
  };

  const verifyOtpMobile = () => {
    OtpVerification(
      props?.sentParentToChild?.phone,
      props?.refNumberPhone,
      otpNum,
      "mobile"
    )
      .then((responseNum) => {
        if (responseNum?.data?.verifyStatus === true) {
          setIsPhoneVerificationSuccessful(true);
          // clear();
          // refTime.current = null;
          // setCount(0);
        } else {
          setIsPhoneVerificationSuccessful(false);
          setInvalidPhoneMessage(true);
          if (isEmailVerificationSuccessful) {
            toaster(
              "error",
              responseNum?.message ? responseNum?.message : INVALID_PHONE_OTP
            );
          }
          setOtpNum("");
        }
        if (!isEmailVerificationSuccessful && otpEmail?.length === 4) {
          verifyOtpEmail();
        } else {
          setShowLoader(false);
        }
      })
      .catch((err) => {
        setOtpNum("");
        setInvalidPhoneMessage(true);
        setIsPhoneVerificationSuccessful(false);
        setShowLoader(false);
        if (isEmailVerificationSuccessful) {
          toaster("error", err?.message ? err?.message : INVALID_PHONE_OTP);
        }
      });
  };

  const onVerify = () => {
    setShowLoader(true);

    if (!isPhoneVerificationSuccessful) {
      verifyOtpMobile();
    }
    // setTimeout(() => {
    //   if (!isEmailVerificationSuccessful && otpEmail?.length === 4) {
    //     verifyOtpEmail();
    //   }
    // }, 500);

    // } else if (isEmailVerificationSuccessful) {
    //   return;
    // } else {
    //   toaster("error", ENTER_VALID_EMAIL_OTP);
    // }
    setShowLoader(false);
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (otpNum?.length === 4) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [otpNum]);

  const togglePasswordVisiblity = () => {
    if (isPasswordShown === "password") {
      setIsPasswordShown("text");
      setPasswordIcon(<FaEye size={24} />);
    } else {
      setIsPasswordShown("password");
      setPasswordIcon(<FaEyeSlash size={24} />);
    }
  };
  const toggleEmailPasswordVisiblity = () => {
    if (isEmailPasswordShown === "password") {
      setIsEmailPasswordShown("text");
      setEmailPasswordIcon(<FaEye size={24} />);
    } else {
      setIsEmailPasswordShown("password");
      setEmailPasswordIcon(<FaEyeSlash size={24} />);
    }
  };
  return (
    <>
      {showLoader && <Loader />}
      <div className="heading1">Verify your details</div>
      <div className="medium-text-dark-gray fw-400 pt-2">
        <span className="dark-pink-text">*</span>Required
      </div>
      <div className="mt-5">
        {/* Contact Number Verification */}
        <div className="form-row">
          <label className="form-label">
            Contact Number Verification Code
            <span className="dark-pink-text">*</span>
          </label>
          <div className="form-control-hints my-1">
            sent to {props.sentParentToChild.phone}
          </div>
          <div className="row">
            <div className="d-flex align-items-baseline">
              <InputOtp
                otp={otpNum}
                setOtp={setOtpNum}
                isInputNum={true}
                isDisabled={isPhoneVerificationSuccessful}
                isInputSecure={isPasswordShown === "password" ? true : false}
              />
              <div className="pointer" onClick={togglePasswordVisiblity}>
                {passwordIcon}
              </div>
            </div>
            <div style={{ marginTop: -20 }}>
              {!isPhoneVerificationSuccessful && invalidPhoneMessage ? (
                <div className="text-danger fs-12">{INVALID_PHONE_OTP}</div>
              ) : (
                ""
              )}
            </div>
            <div style={{ marginTop: -20 }}>
              {isPhoneVerificationSuccessful && (
                <div className="text-success fs-12">{VALID_PHONE_OTP}</div>
              )}
            </div>
          </div>
        </div>

        {/* Email Verification Code */}
        <div className="form-row">
          <label className="form-label">Email Verification Code</label>
          <div className="form-control-hints my-1">
            sent to {props.sentParentToChild.email}
          </div>
          <div className="row">
            <div className="d-flex align-items-baseline">
              <InputOtp
                otp={otpEmail}
                setOtp={setOtpEmail}
                isInputNum={false}
                isDisabled={isEmailVerificationSuccessful}
                isInputSecure={
                  isEmailPasswordShown === "password" ? true : false
                }
              />
              <div className="pointer" onClick={toggleEmailPasswordVisiblity}>
                {emailPasswordIcon}
              </div>
            </div>

            <div style={{ marginTop: -20 }}>
              {!isEmailVerificationSuccessful && invalidEmailMessage ? (
                <div className="text-danger fs-12">{INVALID_EMAIL_OTP}</div>
              ) : (
                ""
              )}
            </div>
            <div style={{ marginTop: -20 }}>
              {isEmailVerificationSuccessful && (
                <div className="text-success fs-12">{VALID_EMAIL_OTP}</div>
              )}
            </div>
          </div>
        </div>
        {!unableToGetOtp ? (
          <div className="d-flex justify-content-center">
            <div
              onClick={() => {
                if (count === 0) {
                  resendOtp();
                } else {
                  return;
                }
              }}
              className={`text-black otp-counter mb-4 text-center ${
                otpResendRequired
                  ? "text-decoration-underline pointer otp-resend-link"
                  : ""
              }`}
            >
              {otpResendRequired ? "Resend code" : `Resend code in ${count}s`}
            </div>
          </div>
        ) : (
          <div className="d-flex gap-2 justify-content-center mb-4">
            <div className="small-text-red-bold fs-14 fw-400">
              Unable to get the code?
            </div>
            <div className="medium-text-dark-gray text-decoration-underline">
              Contact Us
            </div>
          </div>
        )}
        {isPhoneVerificationSuccessful && !isEmailVerificationSuccessful ? (
          <div className="d-flex justify-content-center align-items-center flex-column flex-sm-row flex-lg-column flex-xl-row">
            <div className="link me-4">
              <Link
                onClick={() => {
                  verifyCandidate();
                }}
                to=""
                className="fs-14 fw-700 color-primary"
              >
                Verify Email Later
              </Link>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-rounded fs-14 fw-700 mt-3 mt-sm-0 mt-lg-3 mt-xl-0 verify-btn"
              onClick={() => {
                if (otpEmail?.length === 4) {
                  verifyOtpEmail();
                } else {
                  toaster("error", ENTER_VALID_EMAIL_OTP);
                  setOtpEmail("");
                }
              }}
            >
              Verify Email & Create Account
            </button>
          </div>
        ) : (
          <Button
            disabled={buttonDisabled}
            type=""
            onClick={() => {
              onVerify();
            }}
            className={`w-100 btn-rounded btn-primary ${
              buttonDisabled ? "btn-disabled-registration" : ""
            }`}
          >
            {submitButton}
          </Button>
        )}
      </div>
    </>
  );
};
export default RegistrationVerifyForm;
