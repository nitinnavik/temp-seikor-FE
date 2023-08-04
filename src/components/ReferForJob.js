import React, { forwardRef, useEffect, useState } from "react";
import whatsapp from "../assests/icons/ic_whatsapp.svg";
import linkedin from "../assests/icons/ic_linkedin.svg";
import facebook from "../assests/icons/ic_facebook.svg";
import Form from "react-bootstrap/Form";
import SearchComboBox from "../components/SearchComboBox";
import CandidateProfileViewPage from "./CandidateProfileDialog";
import redclose from "../assests/icons/ic_redclose.svg";
import IcDoneWhite from "../assests/icons/ic_done_white.svg";
import {
  getCandidateByEmail,
  getCandidateByMobile,
  getCandidateByName,
  referJob,
  addRecommendation,
} from "../_services/member-profile.service";
import {
  initialiseFormData,
  isEmpty,
  onFormFeildsChange,
} from "../utils/form_validators";
import toaster from "../utils/toaster";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  downloadFile,
  getCandidateDetails,
  getMaster,
} from "../_services/view.service";
import {
  FORM_VALIDATION_MESSAGE,
  MASTER_TYPE,
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
  TOKEN,
  USER_ID,
} from "../constants/keys";
import Loader from "./common/loader";
import { getCountryMaster } from "../_services/candidate.service";
import { GENERAL_ERROR_MESSAGE, JOB_SHARING_MSG } from "../constants/message";
import {
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import CompanyImage from "./company_image";
import { StarRating } from "./star_rating_component";
import { checkPhoneNumberValid } from "../utils/utils";
import ProfileImage from "./profile_image";
import { getLocalStorage } from "../utils/storage";
import ConfirmationRefereeNonRegister from "./ConfirmationRefereeNonRegister";

const ReferForJob = (props) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const setIsReferringWithOutLogin = useStoreActions(
    (state) => state.setIsReferringWithOutLogin
  );
  const setNonLoginReferData = useStoreActions(
    (state) => state.setNonLoginReferData
  );
  const isReferringWithOutLogin = useStoreState(
    (actions) => actions?.isReferringWithOutLogin
  );
  const token = getLocalStorage(TOKEN);

  const nonLoginReferData = useStoreState((action) => action.nonLoginReferData);
  const [multipleCandidates, setMultipleCandidates] = useState(false);
  const [multipleCandidatesArray, setMultipleCandidatesArray] = useState([]);
  const [showCandidateBox, setShowCandidateBox] = useState(false);
  const [viewCandidateProfile, setViewCandidateProfile] = useState(false);
  const [gotCandidate, setGotCandidate] = useState(false);
  const [noCandidateFound, setNoCandidateFound] = useState(true);
  const [noProfileMobileNumber, setNoProfileMobileNumber] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [noCandiateButton, setNoCandidateButton] = useState("OK");
  const [countryCode, setCountryCode] = useState([]);
  const [rating, setRating] = useState(0);
  const [editRecommandationSkill, setEditRecommandationSkill] = useState([]);
  const [editRecommandationFeedback, setEditRecommandationFeedback] =
    useState();
  const [keySkill, setKeySkills] = useState([]);

  const getCountryCodeCall = () => {
    getCountryMaster().then((res) => {
      let countryCodeObj = [];
      res?.data?.map((data) => {
        countryCodeObj.push({
          name: data?.name,
          dialingCode: data?.dialingCode,
        });
      });
      setCountryCode(countryCodeObj);
      let copyFormData = { ...props?.formData };
      copyFormData.countryCode.valueText = countryCodeObj[0]?.dialingCode;
      props?.setFormData(copyFormData);
    });
  };

  useEffect(() => {
    const getDataFromMaster = async () => {
      const jobKeySkills = await getMaster(MASTER_TYPE.KEYSKILLS);
      let jobKeySkillsArray = [];
      jobKeySkills?.map((data) => {
        jobKeySkillsArray.push({
          id: data?.id,
          name: data?.masterValue,
          description: "",
        });
      });
      setKeySkills(jobKeySkillsArray);
    };
    getDataFromMaster();
    getCountryCodeCall();
  }, []);

  useEffect(() => {
    if (!props?.referJobShow) {
      initialiseFormData(props?.formData, props?.setFormData);
    }
    if (props?.ratingStar) {
      setRating(props?.ratingStar);
    }
  }, [props?.referJobShow, props]);

  useEffect(() => {
    if (props?.reason) {
      setEditRecommandationSkill(props?.reason);
    } else {
      setEditRecommandationSkill([]);
    }

    if (props?.Feedback) {
      setEditRecommandationFeedback(props?.Feedback);
    } else {
      setEditRecommandationFeedback("");
    }
  }, []);
  const [selectedDetails, setselectedDetails] = useState("Email");

  const typeDetails = ["Contact Number", "Email", "Name"];

  const [validationStatus, setValidationStatus] = useState({
    emailValid: false,
    phoneValid: false,
    nameValid: false,
  });

  const [foundCandidate, setFoundCandidate] = useState({
    candidateInitials: "",
    name: "",
    designation: "",
    id: null,
    email: "",
  });

  const [foundCandidateSrc, setFoundCandidateSrc] = useState(null);

  const [viewCandidate, setViewCandidate] = useState({});

  const clearAllData = () => {
    setShowCandidateBox(false);
    initialiseFormData(props?.formData, props?.setFormData);
    setFoundCandidate({
      candidateInitials: "",
      name: "",
      designation: "",
      id: null,
      email: "",
      src: null,
    });
    setValidationStatus({
      emailValid: false,
      phoneValid: false,
      nameValid: false,
    });

    props?.setDisableReferralBtn(true);
  };

  const selectedValue = (value, name) => {
    let event = { target: { value: "", name: "" } };
    event.target.value = value;
    event.target.name = name;
    onFormFeildsChange(event, props?.formData, props?.setFormData);
  };

  const getCandidateInitials = (name) => {
    let firstInitial = name?.split(" ")[0]?.slice(0, 1)?.toUpperCase();
    let secondInitial = name?.split(" ")[1]?.slice(0, 1)?.toUpperCase();

    if (firstInitial == undefined) {
      firstInitial = "";
    } else if (secondInitial == undefined) {
      secondInitial = "";
    }

    return firstInitial + secondInitial;
  };

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setFoundCandidateSrc(res);
      }
    });
  };

  const handleGotCandidateForName = (responseObject) => {
    setGotCandidate(true);
    let copyFoundCandidate = { ...foundCandidate };

    if (responseObject?.data?.data?.length == 1) {
      const candidateName = responseObject?.data?.data[0]?.name;
      copyFoundCandidate.name = candidateName;
      copyFoundCandidate.designation =
        responseObject?.data?.data[0]?.designation;
      copyFoundCandidate.id = responseObject?.data?.data[0]?.userId;
      copyFoundCandidate.email = responseObject?.data?.data[0]?.email;
      downloadPicture(responseObject?.data?.data[0]?.profilePicDownloadURL);
      setMultipleCandidates(false);
    } else {
      setMultipleCandidatesArray(responseObject?.data?.data);
      setMultipleCandidates(true);
    }

    setFoundCandidate(copyFoundCandidate);
  };

  const handleGotCandidate = (responseObject) => {
    const candidateName = responseObject?.data?.data?.name;

    setGotCandidate(true);
    setMultipleCandidates(false);

    let copyFoundCandidate = { ...foundCandidate };

    // copyFoundCandidate.candidateInitials = getCandidateInitials(candidateName);
    copyFoundCandidate.name = candidateName;
    copyFoundCandidate.designation = responseObject?.data?.data?.designation;
    copyFoundCandidate.id = responseObject?.data?.data?.userId;
    copyFoundCandidate.email = responseObject?.data?.data?.email;
    downloadPicture(responseObject?.data?.data?.profilePicDownloadURL);

    setFoundCandidate(copyFoundCandidate);
  };

  const handleGetCandidateByEmail = async () => {
    const response = await getCandidateByEmail({
      email: props?.formData?.email?.valueText,
    });

    if (response?.data?.data?.email != null) {
      setShowCandidateBox(true);
      handleGotCandidate(response);
      setNoCandidateFound(false);
    } else {
      setGotCandidate(false);
      setNoCandidateFound(true);
      setShowCandidateBox(true);
      setNoProfileMobileNumber("");
      setNoCandidateButton("Ok");
    }
  };

  useEffect(() => {
    if (
      validationStatus?.emailValid &&
      props?.formData?.email?.valueText != ""
    ) {
      handleGetCandidateByEmail();
    } else {
      setGotCandidate(false);
      setNoCandidateFound(false);
      setNoProfileMobileNumber("");
    }
  }, [props?.formData?.email?.valueText]);

  const handleGetCandidateByMobile = async () => {
    const response = await getCandidateByMobile({
      mobile:
        props?.formData?.countryCode?.valueText +
        props?.formData?.contactNumber?.valueText,
    });
    if (response?.data?.data?.mobile != null) {
      setShowCandidateBox(true);
      handleGotCandidate(response);
      setNoCandidateFound(false);
    } else {
      setGotCandidate(false);
      setNoCandidateFound(true);
      setShowCandidateBox(true);
      setNoProfileMobileNumber(
        ` for "${
          props?.formData?.countryCode?.valueText +
          props?.formData?.contactNumber?.valueText
        }"`
      );
      setNoCandidateButton("OK");
    }
  };

  useEffect(() => {
    if (
      validationStatus?.phoneValid &&
      props?.formData?.contactNumber?.valueText != ""
    ) {
      handleGetCandidateByMobile();
    } else {
      setGotCandidate(false);
      setNoCandidateFound(false);
      setNoProfileMobileNumber("");
    }
  }, [
    props?.formData?.contactNumber?.valueText,
    props?.formData?.countryCode?.valueText,
  ]);

  const getCandidateByFullName = async () => {
    const response = await getCandidateByName({
      name: props?.formData?.name?.valueText,
    });
    if (response.data.data.length > 0) {
      setShowCandidateBox(true);
      handleGotCandidateForName(response);
      setNoCandidateFound(false);
    } else {
      setGotCandidate(false);
      setNoCandidateFound(true);
      setShowCandidateBox(true);
      setNoProfileMobileNumber("");
      setNoCandidateButton("OK");
    }
  };

  useEffect(() => {
    if (validationStatus?.nameValid && props?.formData?.name?.valueText != "") {
      getCandidateByFullName();
    } else {
      setGotCandidate(false);
      setNoCandidateFound(false);
      setNoProfileMobileNumber("");
    }
  }, [props?.formData?.name?.valueText]);

  useEffect(() => {
    if (token && nonLoginReferData && isReferringWithOutLogin) {
      props.formData.commentsCandidate.valueText =
        nonLoginReferData?.commentsCandidate;
      props.formData.commentsBusiness.valueText =
        nonLoginReferData?.commentsBusiness;
      props.formData.candidateRating.valueText =
        nonLoginReferData?.candidateRating;
      setRating(nonLoginReferData?.candidateRating);
      props.formData.topReasonsToRefer.valueText =
        nonLoginReferData?.candidateSkills;
      props.formData.email.valueText = nonLoginReferData?.email;
      props.formData.name.valueText = nonLoginReferData?.name;
      props.formData.contactNumber.valueText = nonLoginReferData?.contactNumber;
      props.formData.countryCode.valueText =
        nonLoginReferData?.contactNumberPrefix;
      setselectedDetails(nonLoginReferData?.selectedDetails);
      if (nonLoginReferData?.selectedDetails === "Email") {
        handleGetCandidateByEmail();
      } else if (nonLoginReferData?.selectedDetails === "Name") {
        getCandidateByFullName();
      } else {
        handleGetCandidateByMobile();
      }
    }
  }, []);
  console.log("jobId", props.referJobId);
  const sendReferralApiCall = (emailPassed) => {
    if (
      props?.formData?.email?.valueText ==
      candidateDetails?.userRegistrationDetails?.email
    ) {
      clearAllData();
      toaster("error", "Cannot refer yourself");
      setShowLoader(false);
      return;
    } else if (
      emailPassed == candidateDetails?.userRegistrationDetails?.email
    ) {
      clearAllData();
      toaster("error", "Cannot refer yourself");
      setShowLoader(false);
      return;
    } else {
      setShowLoader(true);
      let referId = props?.editReferral ? props?.refereeId : emailPassed;
      // let referId = "1234@gmail.co.in";

      const apiObject = {
        jobId: props?.referJobId,
        applicationId: props?.applicationId,
        refereeId: referId,
        commentsCandidate: props?.formData?.commentsCandidate?.valueText,
        commentsBusiness: props?.editReferral
          ? editRecommandationFeedback
          : props?.formData?.commentsBusiness?.valueText,
        candidateRating: rating,
        candidateSkills: props?.editReferral
          ? editRecommandationSkill
          : props?.formData?.topReasonsToRefer?.valueText,
      };
      setNonLoginReferData({
        ...apiObject,
        email: props?.formData?.email?.valueText,
        contactNumber: props?.formData?.contactNumber?.valueText,
        name: props?.formData?.name?.valueText,
        selectedDetails: selectedDetails,
        contactNumberPrefix: props?.formData?.countryCode?.valueText,
        jobId: props?.referJobId,
        companyDetails: props?.jobDetailsProps,
        applicationId: props?.applicationId,
      });

      if (props?.editReferral && apiObject.candidateRating === 0) {
        toaster("error", "Please add rating of the candidate");
        setShowLoader(false);
        return;
      }

      if (props?.editReferral) {
        addRecommendation(apiObject)
          .then((res) => {
            if (res?.data?.status == STATUS_SUCCESS) {
              toaster(
                "success",
                res?.data?.message ? res?.data?.message : STATUS_SUCCESS
              );
              props?.setReferJobShow(false);
              if (props?.onJobReferred) {
                props?.onJobReferred();
              }
              props?.setApiRefresh(true);
              setNonLoginReferData();
              setShowLoader(false);
            } else {
              toaster(
                "error",
                res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
              );
              props?.setApiRefresh(false);

              props?.setReferJobShow(false);
              setShowLoader(false);
              setNonLoginReferData();
            }
          })
          .catch((err) => {
            setShowLoader(false);
            props?.setReferJobShow(false);
            props?.setApiRefresh(false);

            toaster(
              "error",
              err?.data?.message ? err?.data?.message : GENERAL_ERROR_MESSAGE
            );
          });
      } else {
        if (token) {
          if (apiObject.jobId === null) {
            apiObject.jobId = nonLoginReferData?.jobId;
          }
          referJob(apiObject)
            .then((res) => {
              if (res?.data?.status == STATUS_SUCCESS) {
                toaster(
                  "success",
                  res?.data?.message ? res?.data?.message : STATUS_SUCCESS
                );
                props?.setReferJobShow(false);
                if (props?.onJobReferred) {
                  props?.onJobReferred();
                }
                props?.setApiRefresh(true);
                setNonLoginReferData();
                setShowLoader(false);
              } else {
                toaster(
                  "error",
                  res?.data?.message
                    ? res?.data?.message
                    : GENERAL_ERROR_MESSAGE
                );
                props?.setApiRefresh(false);

                props?.setReferJobShow(false);
                setShowLoader(false);
                setNonLoginReferData();
              }
            })
            .catch((err) => {
              setShowLoader(false);
              props?.setReferJobShow(false);
              props?.setApiRefresh(false);

              toaster(
                "error",
                err?.data?.message ? err?.data?.message : GENERAL_ERROR_MESSAGE
              );
            });
          setNonLoginReferData();
        } else {
          props?.setReferJobShow(false);
          props?.setConfirmationRefereeNonRegisterShow(true);
        }
      }
    }
    props?.setDisableReferralBtn(true);
  };

  // useEffect(() => {
  //   if (!gotCandidate || !validationStatus?.emailValid) {
  //     props?.setDisableReferralBtn(true);
  //   }
  // }, [gotCandidate, validationStatus?.emailValid]);

  useEffect(() => {
    if (props?.referButtonClicked) {
      if (gotCandidate) {
        sendReferralApiCall(
          props?.editReferral ? props?.refereeId : foundCandidate?.email
        );
      } else if (
        props?.editReferral ? props?.refereeId : validationStatus?.emailValid
      ) {
        sendReferralApiCall(
          props?.editReferral
            ? props?.refereeId
            : props?.formData?.email?.valueText
        );
      } else {
        setGotCandidate(false);
        toaster("error", "Enter valid details");
      }
    }

    props?.setReferButtonClicked(false);
  }, [props?.referButtonClicked]);

  const sendProfileProps = (candidate) => {
    let id;
    if (candidate) {
      id = candidate?.userId;
    } else {
      id = foundCandidate?.id;
    }

    getCandidateDetails(id)?.then((res) => {
      setViewCandidate(res?.data?.data);
    });
  };

  const copyCurrentPageLink = () => {
    const url = `https://${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`;
    navigator.clipboard.writeText(url);
    toaster("success", "Link copied to Clipboard");
  };

  useEffect(() => {
    if (!token) {
      setIsReferringWithOutLogin(true);
    }
  }, []);

  return (
    <div>
      {showLoader && <Loader />}
      {!props?.editReferral ? (
        <>
          <div className="container">
            <span className="medium-black-text"> REFER JOB </span>
            <div className="pt-2">
              <h2 className="large-text-dark-gray text-black fs-20">
                {props?.jobDetailsProps?.jobTitle
                  ? props?.jobDetailsProps?.jobTitle
                  : nonLoginReferData?.companyDetails?.jobTitle
                  ? nonLoginReferData?.companyDetails?.jobTitle
                  : ""}
              </h2>
              <div className="d-flex pt-2">
                <div>
                  <CompanyImage
                    src={
                      props?.jobDetailsProps?.companyLogo
                        ? props?.jobDetailsProps?.companyLogo
                        : nonLoginReferData?.companyDetails?.companyLogo
                        ? nonLoginReferData?.companyDetails?.companyLogo
                        : ""
                    }
                    width="50px"
                    height="50px"
                    name={
                      props?.jobDetailsProps?.companyName
                        ? props?.jobDetailsProps?.companyName
                        : nonLoginReferData?.companyDetails?.companyName
                        ? nonLoginReferData?.companyDetails?.companyName
                        : ""
                    }
                    initialsContainerClass="initialsStyle2-xl"
                  />
                </div>

                {/* <img
              src={`data:image/jpeg;base64 , ${props?.jobDetailsProps?.companyName}`}
              className="bg-white p-1 border rounded-3"
              width="40px"
              height="40px"
              alt="airbnb-logo"
            /> */}
                <span className="ps-2 pt-2 medium-black-text">
                  {props?.jobDetailsProps?.companyName
                    ? props?.jobDetailsProps?.companyName
                    : nonLoginReferData?.companyDetails?.companyName
                    ? nonLoginReferData?.companyDetails?.companyName
                    : ""}
                </span>
              </div>
              <div className="d-flex justify-content-end p-0 m-0">
                <span className="fs-12">
                  {" "}
                  <span className="text-danger">*</span>Required
                </span>
              </div>
              <hr></hr>
            </div>
            <div className="row pt-2">
              <div className="col-lg-6 col-12 border-end border-lg-none pe-5">
                <h5 className="fs-14 color-primary fw-700">
                  {" "}
                  Refer this job to<span className="text-danger">*</span>
                </h5>
                <div className="d-flex mt-4 gap-2 flex-wrap">
                  {typeDetails.map((type, index) => {
                    return (
                      <button
                        className="btn rounded-pill p-1 pe-3 border fs-12 color-primary fw-400"
                        onClick={() => {
                          clearAllData();
                          setselectedDetails(type);
                        }}
                        key={index}
                      >
                        <div className="d-flex">
                          <span
                            className={
                              selectedDetails === type
                                ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                                : "d-none p-1"
                            }
                          >
                            <img src={IcDoneWhite} alt="whitedone-icon" />
                          </span>
                          <span> {type} </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-3 pb-4">
                  <div
                    className={
                      selectedDetails === "Contact Number"
                        ? "form-group d-flex d-block"
                        : "form-group d-flex d-none"
                    }
                  >
                    <div className="col-4">
                      <select
                        value={props?.formData?.countryCode?.valueText}
                        name="countryCode"
                        className="form-control form-select fs-12 modal-form-input pointer"
                        aria-label="Select country"
                        onChange={($event) => {
                          selectedValue($event.target.value, "countryCode");
                          if (props?.formData?.contactNumber?.valueText) {
                            const isPhoneNumberValid = checkPhoneNumberValid(
                              props?.formData?.contactNumber?.valueText,
                              $event?.target?.value
                            );
                            let copyFormData = { ...props?.formData };

                            if (!isPhoneNumberValid) {
                              copyFormData.contactNumber.errorText =
                                FORM_VALIDATION_MESSAGE.PHONE;
                            } else {
                              copyFormData.contactNumber.errorText = "";
                            }
                            props?.setFormData(copyFormData);
                          }
                          if (props?.formData?.contactNumber?.errorText == "") {
                            setValidationStatus({
                              ...validationStatus,
                              phoneValid: true,
                            });
                          } else {
                            setValidationStatus({
                              ...validationStatus,
                              phoneValid: false,
                            });
                          }
                        }}
                      >
                        {countryCode?.map((codeData, index) => {
                          return (
                            <option
                              className="bg-white form-control outline-none mb-4 p-2 color-primary fs-12"
                              key={index}
                              value={codeData?.dialingCode}
                              name={codeData?.dialingCode}
                            >
                              {codeData?.dialingCode}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-8">
                      <input
                        value={props?.formData?.contactNumber?.valueText}
                        className={
                          (props?.formData?.contactNumber?.errorText
                            ? "error"
                            : "") + " form-control ms-2 fs-12 modal-form-input"
                        }
                        onChange={($event) => {
                          onFormFeildsChange(
                            $event,
                            props?.formData,
                            props?.setFormData
                          );

                          const isPhoneNumberValid = checkPhoneNumberValid(
                            $event?.target?.value,
                            props?.formData?.countryCode?.valueText
                          );
                          let copyFormData = { ...props?.formData };

                          if (!isPhoneNumberValid) {
                            copyFormData.contactNumber.errorText =
                              FORM_VALIDATION_MESSAGE.PHONE;
                          } else {
                            copyFormData.contactNumber.errorText = "";
                          }
                          props?.setFormData(copyFormData);

                          if (props?.formData?.contactNumber?.errorText == "") {
                            setValidationStatus({
                              ...validationStatus,
                              phoneValid: true,
                            });
                          } else {
                            setValidationStatus({
                              ...validationStatus,
                              phoneValid: false,
                            });
                          }
                        }}
                        type="text"
                        placeholder="Phone Number"
                        name="contactNumber"
                      />
                      <div>
                        {props?.formData?.contactNumber?.errorText && (
                          <div className="field-error mt-1">
                            {props?.formData?.contactNumber?.errorText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      selectedDetails === "Email"
                        ? "d-block pb-4"
                        : "d-none pb-4"
                    }
                  >
                    <input
                      value={props?.formData?.email?.valueText}
                      type="email"
                      className={
                        (props?.formData?.email?.errorText ? "error" : "") +
                        " form-control fs-12 modal-form-input"
                      }
                      required
                      placeholder="Email of candidate"
                      onChange={($event) => {
                        onFormFeildsChange(
                          $event,
                          props?.formData,
                          props?.setFormData
                        );
                        if (props?.formData?.email?.errorText == "") {
                          setValidationStatus({
                            ...validationStatus,
                            emailValid: true,
                          });
                        } else {
                          setValidationStatus({
                            ...validationStatus,
                            emailValid: false,
                          });
                        }
                      }}
                      name="email"
                    />
                    <div>
                      {props?.formData?.email?.errorText && (
                        <div className="field-error mt-1">
                          {props?.formData?.email?.errorText}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      selectedDetails === "Name"
                        ? "d-block pb-4"
                        : "d-none pb-4"
                    }
                  >
                    <input
                      value={props?.formData?.name?.valueText}
                      className={
                        (props?.formData?.name?.errorText ? "error" : "") +
                        " form-control fs-12 modal-form-input"
                      }
                      onChange={($event) => {
                        onFormFeildsChange(
                          $event,
                          props?.formData,
                          props?.setFormData
                        );
                        if (props?.formData?.name?.errorText == "") {
                          setValidationStatus({
                            ...validationStatus,
                            nameValid: true,
                          });
                        } else {
                          setValidationStatus({
                            ...validationStatus,
                            nameValid: false,
                          });
                        }
                        // disableBtnOnNameField();
                      }}
                      name="name"
                      type="name"
                      required
                      placeholder="Search by candidate name"
                    />
                    <div>
                      {props?.formData?.name?.errorText && (
                        <div className="field-error mt-1">
                          {props?.formData?.name?.errorText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* view profile dialog parent */}
                  {gotCandidate && showCandidateBox ? (
                    <div
                      style={{ zIndex: "1" }}
                      className="box-shadow p-2 border bg-white position-absolute half-width-popup"
                    >
                      <div className="w-100 h-100 row p-0 m-0 gray-bottom-margin-selector">
                        {multipleCandidates ? (
                          <div className="p-0">
                            {multipleCandidatesArray &&
                              multipleCandidatesArray?.map(
                                (candidate, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="w-100 mt-1 mb-3 gray-bottom-margin"
                                    >
                                      <div className="d-flex w-100">
                                        <div className="d-flex btn-primary candidate-found-initials-box align-items-center justify-content-center me-2">
                                          <ProfileImage
                                            src={
                                              candidate?.profilePicDownloadURL
                                            }
                                            name={candidate?.name}
                                            width="48px"
                                            height="48px"
                                            initialsContainerClass="rounded-circle"
                                          />
                                        </div>
                                        <div>
                                          <h6 className="fs-14 color-primary fw-700 pt-2">
                                            {candidate?.name}
                                          </h6>
                                          <div className="header-gray-text">
                                            {candidate?.designation}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="d-flex justify-content-end my-3">
                                        <button
                                          className="btn rounded-pill p-1 ps-3 pe-3 border fs-12 color-primary fw-400 ms-2"
                                          onClick={() => {
                                            setViewCandidateProfile(true);
                                            sendProfileProps(candidate);
                                          }}
                                        >
                                          View Profile
                                        </button>
                                        <button
                                          onClick={() => {
                                            props?.setDisableReferralBtn(false);
                                            setShowCandidateBox(false);
                                            setFoundCandidate({
                                              ...foundCandidate,
                                              email: candidate?.email,
                                            });
                                          }}
                                          className="btn rounded-pill p-1 ps-3 pe-3 border fs-12 color-primary fw-400 ms-2"
                                        >
                                          Select for referral
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        ) : (
                          <div className="w-100">
                            <div className="d-flex w-100">
                              <div className="d-flex btn-primary candidate-found-initials-box align-items-center justify-content-center me-2">
                                <ProfileImage
                                  src={foundCandidateSrc}
                                  name={foundCandidate?.name}
                                  width="48px"
                                  height="48px"
                                  initialsContainerClass="rounded-circle"
                                />
                              </div>
                              <div className="w-100 d-flex justify-content-between ">
                                <div>
                                  <h6 className="fs-14 color-primary fw-700 pt-2">
                                    {foundCandidate?.name}
                                  </h6>
                                  <div className="header-gray-text">
                                    {foundCandidate?.designation}
                                  </div>
                                </div>
                                <div
                                  className="pointer"
                                  onClick={() => {
                                    setShowCandidateBox(false);
                                  }}
                                >
                                  <img src={redclose} alt="red-clopse-btn" />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4 gray-top-margin">
                              <button
                                className="btn rounded-pill p-1 ps-3 pe-3 border fs-12 color-primary fw-400 ms-2"
                                onClick={() => {
                                  setViewCandidateProfile(true);
                                  sendProfileProps();
                                }}
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  props?.setDisableReferralBtn(false);
                                  setShowCandidateBox(false);
                                }}
                                className="btn rounded-pill p-1 ps-3 pe-3 border fs-12 color-primary fw-400 ms-2"
                              >
                                Select for referral
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {noCandidateFound && showCandidateBox ? (
                    <div className="box-shadow p-3 border bg-white position-absolute half-width-popup">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex gap-3">
                          <div>
                            <h4 className="fs-14 color-primary fw-700 pt-2">
                              Address not registered {noProfileMobileNumber}
                            </h4>
                            <div className="header-gray-text mb-3">
                              <p>Referral will be sent by email</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="pointer"
                          onClick={() => {
                            setShowCandidateBox(false);
                          }}
                        >
                          <img src={redclose} alt="red-clopse-btn" />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => {
                            if (validationStatus?.emailValid) {
                              props?.setDisableReferralBtn(false);
                            }
                            setShowCandidateBox(false);
                          }}
                          className="btn rounded-pill px-4 p-1 border fs-12 color-primary fw-400 ms-2"
                        >
                          {noCandiateButton}
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-lg-6 col-12 ps-3">
                <h5 className="fs-14 color-primary fw-700 pb-4">
                  {" "}
                  Share Link for this job
                </h5>
                <span className="header-gray-text"> Share link & Message </span>
                <div className="d-flex  flex-wrap">
                  <button
                    onClick={copyCurrentPageLink}
                    className="btn border rounded-3 ps-4 pe-4 small-text-dark-gray fw-400 mt-2"
                    style={{ height: "40px", width: "130px" }}
                  >
                    <img
                      src="/static/media/ic_link.1f440cc12f2f3e035dc5b5f20659c989.svg"
                      alt=""
                      className="pe-1"
                      width="15px"
                    />
                    Copy Link
                  </button>
                  <span className="ms-2 d-flex gap-2 flex-wrap mt-2">
                    <button
                      className="btn border p-2  border-radius d-flex justify-content-center align-items-center"
                      style={{ height: "40px", width: "40px" }}
                    >
                      <WhatsappShareButton
                        title={JOB_SHARING_MSG}
                        source={window?.location?.host}
                        url={`https://${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`}
                      >
                        <WhatsappIcon size={26} />
                      </WhatsappShareButton>
                      {/* <a
                        href={`https://web.whatsapp.com/send?text= ${JOB_SHARING_MSG}, ${`${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`}`}
                        rel="nofollow noopener"
                        className="share-icon"
                      >
                        <WhatsappIcon size={26} />
                      </a>
                      <a
                        href={`whatsapp://send?text= ${JOB_SHARING_MSG}, ${`${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`}`}
                        rel="nofollow noopener"
                        className="share-icon"
                      >
                        <WhatsappIcon size={26} />
                      </a> */}
                    </button>
                    <button
                      className="btn border  border-radius d-flex justify-content-center align-items-center"
                      style={{ height: "40px", width: "40px" }}
                    >
                      <LinkedinShareButton
                        title={JOB_SHARING_MSG}
                        source={window?.location?.host}
                        url={`https://${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`}
                      >
                        <LinkedinIcon size={26} />
                      </LinkedinShareButton>
                    </button>
                    <button
                      className="btn border  border-radius d-flex justify-content-center align-items-center"
                      style={{ height: "40px", width: "40px" }}
                    >
                      <FacebookShareButton
                        title={JOB_SHARING_MSG}
                        source={window?.location?.host}
                        url={`https://${window?.location?.host}/job/${props?.referJobId}?refereeId=${candidateDetails?.userRegistrationDetails?.userId}`}
                      >
                        <FacebookIcon size={26} />
                      </FacebookShareButton>
                    </button>
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="fs-14 color-primary fw-700 pb-1">
                  Personalize your referral
                </h5>
                <h6 className="color-tertiary fw-400 fs-12">
                  {" "}
                  Add a message for the candidate{" "}
                </h6>
                <textarea
                  type="text"
                  className="w-100 btn border border-radius text-start p-2 fs-14 fw-400 ps-3 cursor-text"
                  placeholder="Hey ! This job looks like a great opportunity."
                  rows="3"
                  onChange={($event) => {
                    onFormFeildsChange(
                      $event,
                      props?.formData,
                      props?.setFormData
                    );
                  }}
                  name="commentsCandidate"
                  value={props?.formData?.commentsCandidate?.valueText}
                />
              </div>
            </div>
          </div>

          <hr className="mx-0 px-0"></hr>
        </>
      ) : null}
      <div className="pt-3 container">
        <h2 className="large-text-dark-gray text-black fs-20">
          Add your recommendations for better conversion chances
        </h2>
        <div className="dark-pink-text fs-14 fw-400">
          The following recommendations will only be shared with the employer
        </div>
        <div className="row mt-4">
          <div className="col-lg-6 col-12">
            <h5 className="fs-14 color-primary fw-700 pb-1">
              Rating of the candidate
            </h5>
            <h6 className="color-tertiary fw-400 fs-12">
              On a scale of 1-5, how would you rate this candidate for this role
            </h6>
            <div>
              <StarRating
                totalStars={5}
                setRating={setRating}
                rating={rating}
                // rating={props?.editReferral ? props?.ratingStar : rating}
                customClasses={"gap-3 mb-4"}
              />

              {/* <Form.Range
                name="candidateRating"
                min={1}
                max={5}
                step={1}
                className="range-gradient"
                onChange={($event) => {
                  onFormFeildsChange(
                    $event,
                    props?.formData,
                    props?.setFormData
                  );
                }}
                value={props?.formData?.candidateRating?.valueText}
              /> */}
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <h5 className="fs-14 color-primary fw-700 pb-1">
              Top 3 reasons to refer this candidate
            </h5>
            <SearchComboBox
              inputData={keySkill}
              defaultValue={
                props?.editReferral
                  ? props?.reason
                  : props?.formData?.topReasonsToRefer?.valueText
              }
              isMultiSelect={true}
              inputCssClass={"modal-input combo-search-box pointer"}
              wrapperCssClass={"form-group "}
              placeholder={"Search or Select"}
              onSelect={($event) => {
                if (
                  props?.formData?.topReasonsToRefer?.valueText?.length >= 3
                ) {
                  return;
                } else {
                  if (props?.editReferral) {
                    setEditRecommandationSkill($event);
                  } else {
                    selectedValue($event, "topReasonsToRefer");
                  }
                }
              }}
              searchListHeight={150}
              badgeThemeCssClass={"blue"}
              name="topReasonsToRefer"
              isAllowUserDefined={true}
              maxCheckedItem={3}
            />
          </div>
        </div>
        <div className="mt-4">
          <h5 className="fs-14 color-primary fw-700 pb-1">
            Feedback on Candidate
          </h5>
          <h6 className="color-tertiary fw-400 fs-12">
            Add a message for the employer
          </h6>
          <textarea
            type="text"
            className="w-100 btn border border-radius text-start p-2 fs-12 fw-400 ps-3 mt-2 cursor-text mb-5"
            placeholder="Add your message"
            rows="5"
            onChange={($event) => {
              if (props?.editReferral) {
                setEditRecommandationFeedback($event.target.value);
              } else {
                onFormFeildsChange($event, props?.formData, props?.setFormData);
              }
            }}
            name="commentsBusiness"
            // value={props?.formData?.commentsBusiness?.valueText}
            defaultValue={
              props?.editReferral
                ? props?.Feedback
                : props?.formData?.commentsBusiness?.valueText
            }
          />
        </div>
      </div>
      <CandidateProfileViewPage
        show={viewCandidateProfile}
        onCloseButtonClick={() => {
          setViewCandidateProfile(false);
        }}
        candidateDetails={viewCandidate}
      />
    </div>
  );
};

export default ReferForJob;
