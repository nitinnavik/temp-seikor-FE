import React, { isValidElement, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ALPHABET_CHECK,
  EMAIL_PATTERN,
  FORM_VALIDATION_MESSAGE,
  getPhoneNumberPattern,
  LOGIN,
  PASSWORD_PATTERN,
  pattern,
  PHONE_CHECK,
  PHONE_NUMBER_PATTERN,
  PHONE_NUMBER_PATTERN_LOGIN,
  REQUIRED,
  STATUS_SUCCESS,
  TOKEN,
  USER_ID,
} from "../constants/keys";
import {
  onFormFeildsChange,
  validateField,
  enableShouldErrorShow,
  isPasswordValid,
  disableShouldErrorShow,
} from "../utils/form_validators";
import toaster from "../utils/toaster";
import { login } from "../_services/auth.service";
import Loader from "./common/loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { checkPhoneNumberValid } from "../utils/utils";
import {
  deleteCandidateResume,
  mobileValidation,
  userCurrentDetails,
  userMessage,
} from "../_services/candidate.service";
import { GENERAL_ERROR_MESSAGE, JOB_SAVED_SUCCESS } from "../constants/message";
import RegistrationForm from "./registration_form";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  ALL_JOBS_PAGE_ROUTE,
  JOB_DETAILS_PAGE_ROUTE,
} from "../constants/page-routes";
import {
  AddLocation,
  AddSocialMedia,
  addEducationDetails,
  referJob,
} from "../_services/member-profile.service";
import {
  addCandidateSkills,
  addCandidateWorkExperience,
  updateResume,
} from "../_services/view.service";
import { getLocalStorage } from "../utils/storage";
import { Modal } from "react-bootstrap";
import { updateSavedAndPinJob } from "../_services/job.service";

const LoginForm = (props) => {
  const isNewlyRegistered = useStoreState((state) => state.isNewlyRegistered);
  const token = getLocalStorage(TOKEN);
  const userId = getLocalStorage(USER_ID);
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const applyForJobNonLoginUser = useStoreState(
    (state) => state?.applyForJobNonLoginUser
  );
  const currentJobDetails = useStoreState((state) => state?.currentJobDetails);
  const isNonLoginUserApplyDetailJob = useStoreState(
    (state) => state?.isNonLoginUserApplyDetailJob
  );
  const [formData, setFormData] = useState({
    username: {
      valueText: "",
      errorText: "",
      check: [REQUIRED, EMAIL_PATTERN, PHONE_CHECK],
      shouldShowError: false,
    },
    password: {
      valueText: "",
      errorText: "",
      check: [REQUIRED],
      shouldShowError: false,
    },
  });
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const [isPasswordShown, setIsPasswordShown] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(<FaEyeSlash />);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [dataParams] = useSearchParams();
  const isApplyingWithOutLogin = useStoreState(
    (state) => state?.isApplyingWithOutLogin
  );
  const setIsApplyingWithOutLogin = useStoreActions(
    (actions) => actions?.setIsApplyingWithOutLogin
  );
  const nonLoginSaveForApplying = useStoreState(
    (state) => state?.nonLoginSaveForApplying
  );
  const setNonLoginSaveForApplying = useStoreActions(
    (actions) => actions?.setNonLoginSaveForApplying
  );

  const isReferringFromDetailsWithOutLogin = useStoreState(
    (actions) => actions?.isReferringFromDetailsWithOutLogin
  );

  const isReferringWithOutLogin = useStoreState(
    (actions) => actions?.isReferringWithOutLogin
  );
  const nonLoginReferData = useStoreState(
    (actions) => actions?.nonLoginReferData
  );
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );
  useEffect(() => {
    if (window?.location?.search) {
      setRegistrationUrl(window?.location?.search?.replace(/\?/g, ""));
    }
  }, [window?.location]);

  const togglePasswordVisiblity = () => {
    if (isPasswordShown === "password") {
      setIsPasswordShown("text");
      setPasswordIcon(FaEye);
    } else {
      setIsPasswordShown("password");
      setPasswordIcon(FaEyeSlash);
    }
  };

  const submitFormOnEnter = (e) => {
    if (e?.keyCode == 13) {
      if (formData?.username?.errorText == "") {
        submitLoginForm();
      }
    }
  };

  // const navigateToSearchParam = (link) => {
  //   navigate(link);
  // };

  const navigateToPage = () => {
    if (window?.location?.search == "") {
      if (
        isApplyingWithOutLogin &&
        !isNewlyRegistered &&
        !nonLoginSaveForApplying &&
        !nonLoginReferData
      ) {
        setShowUpdateConfirmDialog(true);
      } else if (
        isApplyingWithOutLogin &&
        !isNewlyRegistered &&
        nonLoginSaveForApplying &&
        !nonLoginReferData
      ) {
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
        navigate("/candidate/");
      }
    } else {
      const params = dataParams?.get("redirectTo");
      window.location.href = params;
      console.log(params);

      // let link = window?.location?.search?.replace(/\?/g, "");
      // navigate(params);
    }
  };

  const navigateToRegistration = () => {
    if (registrationUrl == "") {
      navigate("registration");
    } else {
      navigate({
        pathname: "registration",
        search: registrationUrl,
      });
    }
  };

  const submitLoginForm = () => {
    let emailValid = true;
    let isValid = true;

    Object.keys(formData)?.forEach((key) => {
      enableShouldErrorShow({ target: { name: key } }, formData, setFormData);
      if (
        !validateField(key, formData, setFormData) ||
        !isPasswordValid("password", formData, setFormData)
      ) {
        isValid = false;
      }
    });

    // validateField("username", formData, setFormData);
    // console.log(ALPHABET_CHECK.test(formData?.username?.valueText));
    if (ALPHABET_CHECK.test(formData?.username?.valueText)) {
      emailValid = validateField("username", formData, setFormData);
    }

    if (emailValid && isValid) {
      setShowLoader(true);
      login(formData?.username?.valueText, formData?.password?.valueText)
        .then(async (res) => {
          setShowLoader(false);
          if (res?.status === 200) {
            if (res?.data?.data?.id) {
              await saveCandidateDetails(res?.data?.data?.id);
            }
            if (
              EMAIL_PATTERN.test(formData?.username?.valueText) &&
              res?.data?.data?.emailVerified == false
            ) {
              if (props?.verificationNeeded) {
                props?.setEmail(formData?.username?.valueText);
                props?.verificationNeeded();
              }
            } else {
              navigateToPage();
            }
          } else {
            toaster(
              "error",
              res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
            );
            setShowLoader(false);
          }
        })
        .catch((err) => {
          console.log("err", err);
          setShowLoader(false);
          toaster("error", err?.message ? err?.message : GENERAL_ERROR_MESSAGE);
        });
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <div className="heading1">Log In</div>
      <div className="mb-5 d-flex">
        Don't have account?{" "}
        <div
          onClick={navigateToRegistration}
          className="fw-700 text-underline ms-1 pointer color-blue"
        >
          Register Here
        </div>
      </div>
      <form className="login-btn-hover" autoComplete="off">
        <div className="form-row">
          <label className="form-label">Email/Phone Number</label>
          <input
            autoFocus={true}
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            type="text"
            onBlur={($event) => {
              enableShouldErrorShow($event, formData, setFormData);
            }}
            onFocus={($event) => {
              disableShouldErrorShow($event, formData, setFormData);
            }}
            className={
              (formData?.username?.errorText &&
              formData?.username?.shouldShowError
                ? "error"
                : "") + " form-control"
            }
            name="username"
            defaultValue={formData.username.valueText}
            onChange={($event) => {
              onFormFeildsChange($event, formData, setFormData);

              if (!ALPHABET_CHECK.test(formData?.username?.valueText)) {
                const isPhoneNumberValid = checkPhoneNumberValid(
                  $event?.target?.value
                );
                let copyFormData = { ...formData };
                if (!isPhoneNumberValid) {
                  copyFormData.username.errorText =
                    FORM_VALIDATION_MESSAGE.PHONE;
                  setFormData(copyFormData);
                } else {
                  copyFormData.username.errorText = "";
                  setFormData(copyFormData);
                }
              }
            }}
          />
          {formData.username.errorText && formData.username.shouldShowError && (
            <div className="field-error mt-1">
              {formData.username.errorText}
            </div>
          )}
        </div>
        <div className="form-row">
          <label className="form-label">Password</label>
          <input
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            onBlur={($event) => {
              enableShouldErrorShow($event, formData, setFormData);
            }}
            onFocus={($event) => {
              disableShouldErrorShow($event, formData, setFormData);
            }}
            type={isPasswordShown}
            className={
              (formData?.password?.errorText ? "error" : "") + " form-control"
            }
            name="password"
            defaultValue={formData.password.valueText}
            onChange={($event) => {
              disableShouldErrorShow($event, formData, setFormData);
              onFormFeildsChange($event, formData, setFormData);
            }}
          />
          <span className="icons" onClick={togglePasswordVisiblity}>
            {passwordIcon}
          </span>
          <br />
          {formData.password.errorText &&
            formData?.password?.shouldShowError && (
              <div className="field-error mt-1">
                {formData.password.errorText}
              </div>
            )}
          <br />
          <div className="forget-password-link mt-1">
            {" "}
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        </div>
        <input
          type="button"
          onClick={() => {
            if (formData?.username?.errorText == "") {
              submitLoginForm();
            }
          }}
          className="w-100 btn-rounded btn-primary login-btn-focus"
          value="Log In"
        />
      </form>
      <Modal
        show={showUpdateConfirmDialog}
        backdrop="static"
        // fullscreen="lg-down"
        keyboard={false}
        centered
        onHide={() => {
          setShowUpdateConfirmDialog(false);
        }}
      >
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">
            Update your profile with this info?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          Choose "Yes" if you want to update your profile with the info you just
          entered
        </Modal.Body>
        <Modal.Footer className="dialog-footer justify-content-between">
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              navigate(ALL_JOBS_PAGE_ROUTE);
              setShowUpdateConfirmDialog(false);
            }}
          >
            No
          </button>
          <button
            // style={{ border: "1px solid black" }}
            className="btn btn-cancel"
            onClick={() => {
              if (!nonLoginSaveForApplying) {
                if (
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.additionalInfoProfileResponse?.aboutMe
                ) {
                  userMessage(
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.additionalInfoProfileResponse?.aboutMe
                  );
                }
                if (
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.additionalInfoProfileResponse?.company ||
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.additionalInfoProfileResponse?.currentDesignation ||
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.additionalInfoProfileResponse?.jobSearchStatus
                ) {
                  let userCurrentDetailsObj = {
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
                      : candidateDetails?.additionalInfoProfileResponse
                          ?.company,
                    jobSearchStatus: applyForJobNonLoginUser?.userProfileSnap
                      ?.additionalInfoProfileResponse?.jobSearchStatus
                      ? applyForJobNonLoginUser?.userProfileSnap
                          ?.additionalInfoProfileResponse?.jobSearchStatus
                      : candidateDetails?.additionalInfoProfileResponse
                          ?.jobSearchStatus,
                  };
                  userCurrentDetails(
                    userCurrentDetailsObj?.currentDesignation,
                    userCurrentDetailsObj?.company,
                    userCurrentDetailsObj?.jobSearchStatus
                  );
                }
                if (
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.additionalInfoProfileResponse?.currentLocation
                ) {
                  AddLocation(
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.additionalInfoProfileResponse?.currentLocation
                  );
                }
                let temp = [];
                temp =
                  applyForJobNonLoginUser?.userProfileSnap?.socialLinksResponses?.map(
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
                  );
                if (
                  applyForJobNonLoginUser?.userProfileSnap?.socialLinksResponses
                ) {
                  AddSocialMedia(temp);
                }

                const request = {
                  keySkills:
                    applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                      ?.keySkills,
                  industries:
                    applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                      ?.industries,
                  functions:
                    applyForJobNonLoginUser?.userProfileSnap?.skillsResponse
                      ?.functions,
                };

                if (applyForJobNonLoginUser?.userProfileSnap?.skillsResponse) {
                  addCandidateSkills(request);
                }

                if (
                  applyForJobNonLoginUser?.userProfileSnap
                    ?.workExperienceResponse
                ) {
                  if (
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.workExperienceResponse?.length > 0
                  ) {
                    for (
                      let i = 0;
                      i <
                      applyForJobNonLoginUser?.userProfileSnap
                        ?.workExperienceResponse?.length;
                      i++
                    ) {
                      addCandidateWorkExperience(
                        applyForJobNonLoginUser?.userProfileSnap
                          ?.workExperienceResponse[i]
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
                      );
                    }
                  }
                }
                if (candidateDetails?.userResumeResponse?.length > 0) {
                  for (
                    let i = 0;
                    i <
                    applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
                      ?.length;
                    i++
                  ) {
                    for (
                      let j = 0;
                      j < candidateDetails?.userResumeResponse?.length;
                      j++
                    ) {
                      if (
                        applyForJobNonLoginUser?.userProfileSnap
                          ?.userResumeResponse[i]?.fileOrder ===
                        candidateDetails?.userResumeResponse[j]?.fileOrder
                      ) {
                        deleteCandidateResume(
                          candidateDetails?.userResumeResponse[j]?.fileId
                        );
                      }
                    }
                  }
                }

                if (
                  applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
                ) {
                  if (
                    applyForJobNonLoginUser?.userProfileSnap
                      ?.userResumeResponse[1] === undefined &&
                    applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
                  ) {
                    updateResume([
                      applyForJobNonLoginUser?.userProfileSnap
                        ?.userResumeResponse[0],
                    ]);
                  } else if (
                    applyForJobNonLoginUser?.userProfileSnap?.userResumeResponse
                  ) {
                    updateResume([
                      applyForJobNonLoginUser?.userProfileSnap
                        ?.userResumeResponse[0],
                    ]);
                    updateResume([
                      applyForJobNonLoginUser?.userProfileSnap
                        ?.userResumeResponse[1],
                    ]);
                  }
                }

                if (isNonLoginUserApplyDetailJob) {
                  navigate(
                    `/${JOB_DETAILS_PAGE_ROUTE}/${currentJobDetails?.jobId}`
                  );
                } else {
                  navigate(ALL_JOBS_PAGE_ROUTE);
                }
              }
              setShowUpdateConfirmDialog(false);
            }}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LoginForm;
