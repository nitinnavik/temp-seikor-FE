import React, { useState, useEffect, useCallback } from "react";
import aboutLogo from "../../../assests/icons/about.svg";
import MailLogo from "../../../assests/icons/mail_icon.svg";
import mailLogo from "../../../assests/icons/ic_mail.svg";
import linkLogo from "../../../assests/icons/ic_link.svg";
import linkedinLogo from "../../../assests/icons/ic_linkedin.svg";
import contactLogo from "../../../assests/icons/ic_phone.svg";
import locationLogo from "../../../assests/icons/ic_location12.svg";
import editLogo from "../../../assests/icons/edit-icon.svg";
import LocationDialog from "../../../components/location_dialog";
import { useNavigate } from "react-router";
import VerifyOtpNumDialog from "../../../components/verify_otp_num_dialog";
import EditPhoneDialog from "../../../components/edit_phone_dialog";
import VerifyOtpEmailDialog from "../../../components/verify_otp_email_dialog";
import EditEmailDialog from "../../../components/edit_email_dialog";
import SocialMediaDialog from "../../../components/social_media_dialog";
import { FetchAllLocation } from "../../../_services/member-profile.service";
import { useStoreActions, useStoreState } from "easy-peasy";
import Loader from "../../../components/common/loader";
import { getLocalStorage } from "../../../utils/storage";
import {
  EMAIL_PATTERN,
  getPhoneNumberPattern,
  LOGIN,
  PHONE_CHECK,
  PHONE_NUMBER_PATTERN,
  TOKEN,
  USER_ID,
} from "../../../constants/keys";
import { LINKEDIN } from "../../../constants/api-endpoints";
import { Button, Modal } from "react-bootstrap";

const ContactAndOnlinePresencePage = (props) => {
  const token = getLocalStorage(TOKEN);

  const [firstTimeEmail, setFirstTimeEmail] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [isCheck, setIsCheck] = useState(false);
  const [isEmailCheck, setIsEmailCheck] = useState(false);
  const [isPhoneCheck, setIsPhoneCheck] = useState(false);
  const [isLocationCheck, setIsLocationCheck] = useState(false);
  const [isSocialMediaCheck, setIsSocialMediaCheck] = useState(false);
  const [propsDetails, setPropsDetails] = useState({
    emailData: "",
    numData: "",
  });
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const isLoading = useStoreState((state) => state.candidate.isLoading);

  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [showConfirmEmailChangeModal, setShowConfirmEmailChangeModal] =
    useState(false);
  const [showConfirmMobileChangeModal, setShowConfirmMobileChangeModal] =
    useState(false);

  const [emailData, setEmailData] = useState({
    email: {
      valueText: "",
      errorText: "",
      check: ["required", EMAIL_PATTERN],
    },
  });
  const [numData, setNumData] = useState({
    mobile: {
      valueText: "",
      errorText: "",
      check: ["required"],
    },
  });

  useEffect(() => {
    let email = candidateDetails?.userRegistrationDetails?.email;
    let mobile = candidateDetails?.userRegistrationDetails?.mobile;
    let copyEmailData = { ...emailData };
    let copyNumData = { ...numData };
    copyEmailData.email.valueText = email;
    copyNumData.mobile.valueText = mobile;
    setEmailData(copyEmailData);
    setNumData(copyNumData);
  }, [candidateDetails]);

  // useEffect(() => {
  //   const userId = getLocalStorage(USER_ID);
  //   if (userId) {
  //     saveCandidateDetails(userId);
  //   }
  // }, [candidateDetails]);
  const [refNumber, setRefNumber] = useState(null);

  const navigate = useNavigate();
  const [locationList, setLocationList] = useState([]);

  const getLocationList = () => {
    FetchAllLocation().then((res) => {
      let arr = [];
      // console.log("Location List", res.data.data);
      res.data.data.map((data) => {
        arr.push({ name: data.masterValue });
      });
      setLocationList(arr);
    });
  };
  const backButton = () => {
    if (window.innerWidth > 768) {
      navigate("/candidate");
    } else {
      props.setShowContact(!props.showContact);
    }
  };

  let [linkedInProfile, setLinkedInProfile] = useState();

  useEffect(() => {
    candidateDetails?.socialLinksResponses?.forEach((socialProfile) => {
      if (socialProfile && socialProfile.linkTitle === LINKEDIN) {
        setLinkedInProfile(socialProfile);
        // console.log(socialProfile);
      }
    });
  }, [candidateDetails]);

  useEffect(() => {
    props.newCandidateDetails?.socialLinksResponses?.forEach(
      (socialProfile) => {
        if (socialProfile && socialProfile.linkTitle === LINKEDIN) {
          setLinkedInProfile(socialProfile);
          // console.log(socialProfile);
        }
      }
    );
  }, [props.newCandidateDetails]);

  return (
    <>
      <div className="row">
        <div className="col ">
          {showLoader && <Loader />}
          {/* style={{marginTop:"-13px"}} */}
          <div className="my-3">
            <span className="fw-bold" style={{ fontSize: "24px" }}>
              {" "}
              <img
                style={{ marginRight: "14px" }}
                src={MailLogo}
                alt={aboutLogo}
              />
              Contact & Online Presence
            </span>
          </div>

          <div className="ContactOnlineContainer d-flex flex-lg-row flex-column">
            {token && (
              <div
                className="contactContainer"
                style={{ padding: "20px 0 10px 15px" }}
              >
                <h6
                  style={{
                    marginBottom: "15px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  <img
                    style={{ marginRight: "11.33px" }}
                    src={mailLogo}
                    alt=""
                  />
                  Email
                </h6>
                <img
                  onClick={() => {
                    if (token) {
                      setShowConfirmEmailChangeModal(true);
                    } else {
                      if (props?.setHideMainModal) {
                        props?.setHideMainModal(true);
                      }
                      setShowEditEmail(true);
                    }
                  }}
                  className="editlogo"
                  src={editLogo}
                  alt="Edit Logo"
                />
                <h6
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    color: "#808080",
                  }}
                >
                  {props?.isApplyForJobComponent
                    ? props.newCandidateDetails?.userRegistrationDetails?.email
                    : candidateDetails?.userRegistrationDetails?.email}
                </h6>
              </div>
            )}

            {token && (
              <div
                className="contactContainer"
                style={{ padding: "20px 0 10px 15px" }}
              >
                <h6
                  style={{
                    marginBottom: "15px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  <img
                    style={{ marginRight: "11.33px" }}
                    src={contactLogo}
                    alt=""
                  />
                  Phone
                </h6>

                <img
                  className="editlogo"
                  onClick={() => {
                    if (token) {
                      setShowConfirmMobileChangeModal(true);
                    } else {
                      if (props?.setHideMainModal) {
                        props?.setHideMainModal(true);
                      }
                      setShowPhone(true);
                    }
                  }}
                  src={editLogo}
                  alt="Edit Logo"
                />

                <h6
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    color: "#808080",
                  }}
                >
                  {props?.isApplyForJobComponent
                    ? props?.newCandidateDetails?.userRegistrationDetails
                        ?.mobile
                    : candidateDetails?.userRegistrationDetails?.mobile}
                </h6>
              </div>
            )}
            <div
              className="contactContainer"
              style={{ padding: "20px 0 10px 15px" }}
            >
              <h6
                style={{
                  marginBottom: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                <img
                  style={{ marginRight: "11.33px" }}
                  src={locationLogo}
                  alt=""
                />
                Current Location
              </h6>

              <img
                className="editlogo"
                onClick={() => {
                  setShowLocation(true);
                  getLocationList();
                  if (props?.setHideMainModal) {
                    props?.setHideMainModal(true);
                  }
                }}
                src={editLogo}
                alt="Edit Logo"
              />

              <h6
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  color: "#808080",
                }}
              >
                {props?.isApplyForJobComponent
                  ? props?.newCandidateDetails?.additionalInfoProfileResponse
                      ?.currentLocation
                  : candidateDetails?.additionalInfoProfileResponse
                      ?.currentLocation}
              </h6>
            </div>
          </div>
          <div className="socialProfile p-2 pt-4 pb-0">
            <div className="skill-block">
              <div className="d-flex mb-2">
                <img className="mb-4" src={linkedinLogo} alt="" />
                <div style={{ margin: "0px 0 0 17px" }}>
                  <span className="fs-16 fw-600">LinkedIn</span>
                  <h6 className="linkedinIcon">
                    {linkedInProfile?.linkUrl
                      ? linkedInProfile?.linkUrl
                      : candidateDetails?.socialLinksResponses?.length > 0 && (
                          <p className="">Link not added</p>
                        )}
                  </h6>
                </div>
              </div>
              <img
                className="editlogo"
                onClick={() => {
                  setShowSocial(true);
                  if (props?.setHideMainModal) {
                    props?.setHideMainModal(true);
                  }
                }}
                src={editLogo}
                alt=""
              />

              {props?.isApplyForJobComponent ? (
                props?.newCandidateDetails?.socialLinksResponses?.length ===
                0 ? (
                  <div className="dark-pink-text fs-14">
                    Add your social media profiles here.
                  </div>
                ) : null
              ) : candidateDetails?.socialLinksResponses?.length === 0 ? (
                <div className="dark-pink-text fs-14">
                  Add your social media profiles here.
                </div>
              ) : null}
              {/* <hr style={{ margin: "1rem 24px 0px" }} /> */}
            </div>

            {props.isApplyForJobComponent ? (
              props?.newCandidateDetails?.socialLinksResponses?.map(
                (socialProfile) => {
                  if (socialProfile && socialProfile.linkTitle === LINKEDIN) {
                    return null;
                  } else {
                    if (socialProfile?.linkUrl)
                      return (
                        <div className="skill-block">
                          <div className="d-flex mb-2">
                            <img className="mb-4" src={linkLogo} alt="" />
                            <div style={{ margin: "0px 0 0 17px" }}>
                              <span
                                style={{ fontSize: "16px", fontWeight: "600" }}
                              >
                                {socialProfile?.linkTitle}
                              </span>
                              <h6 className="linkedinIcon text-break">
                                {socialProfile?.linkUrl}
                              </h6>
                            </div>
                          </div>
                          {/* <hr style={{ margin: "1rem 24px 0px" }} /> */}
                        </div>
                      );
                  }
                }
              )
            ) : (
              <>
                {candidateDetails?.socialLinksResponses?.map(
                  (socialProfile) => {
                    if (socialProfile && socialProfile.linkTitle === LINKEDIN) {
                      return null;
                    } else {
                      if (socialProfile?.linkUrl)
                        return (
                          <div className="skill-block">
                            <div className="d-flex mb-2">
                              <img className="mb-4" src={linkLogo} alt="" />
                              <div style={{ margin: "0px 0 0 17px" }}>
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {socialProfile?.linkTitle}
                                </span>
                                <h6 className="linkedinIcon text-break">
                                  {socialProfile?.linkUrl}
                                </h6>
                              </div>
                            </div>
                            {/* <hr style={{ margin: "1rem 24px 0px" }} /> */}
                          </div>
                        );
                    }
                  }
                )}
              </>
            )}

            {/* <div className="profileEditable">
              <img src={linkLogo} alt="" />
              <div style={{ margin: "0px 0 0 17px" }}>
                <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  {candidateDetails?.socialLinksResponses[2]?.linkTitle
                    ? candidateDetails?.socialLinksResponses[2]?.linkTitle
                    : "My Stack Profile"}
                </span>
                <h6 className="linkedinIcon mb-4">
                  {candidateDetails?.socialLinksResponses[2]?.linkUrl
                    ? candidateDetails?.socialLinksResponses[2]?.linkUrl
                    : "domain.xyz/user849y92"}
                </h6>
              </div>
            </div> */}

            <Modal
              show={showConfirmEmailChangeModal}
              backdrop="static"
              // fullscreen="lg-down"
              keyboard={false}
              centered
              onHide={() => {
                setShowConfirmEmailChangeModal(false);
              }}
            >
              <Modal.Header closeButton className="dialog-header">
                <Modal.Title className="dialog-title">
                  Are you sure you want to continue?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="dialog-body">
                You will be logged out after email is saved
              </Modal.Body>
              <Modal.Footer className="dialog-footer">
                <button
                  // style={{ border: "1px solid black" }}
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowEditEmail(true);
                    if (props?.setHideMainModal) {
                      props?.setHideMainModal(true);
                    }
                    setShowConfirmEmailChangeModal(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-dark btn-save"
                  onClick={() => {
                    setShowConfirmEmailChangeModal(false);
                  }}
                >
                  No
                </button>
              </Modal.Footer>
            </Modal>

            {/* Email Modal React Bootstrap -1 */}
            <EditEmailDialog
              show={showEditEmail}
              setShow={setShowEditEmail}
              setShow1={setShowEmailOtp}
              emailData={emailData}
              setEmailData={setEmailData}
              setRefNumber={setRefNumber}
              showLoader={showLoader}
              setShowLoader={setShowLoader}
              firstTimeEmail={[firstTimeEmail, setFirstTimeEmail]}
              newCandidateDetails={props?.newCandidateDetails}
              isEmailCheck={isEmailCheck}
              setIsEmailCheck={setIsEmailCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Email Modal React Bootstrap -1 ends*/}

            {/* Email Modal React Bootstrap -2 starts*/}
            <VerifyOtpEmailDialog
              show={showEmailOtp}
              setShow={setShowEmailOtp}
              emailData={emailData}
              setEmailData={setEmailData}
              refNumber={refNumber}
              setRefNumber={setRefNumber}
              setShowLoader={setShowLoader}
              firstTimeEmail={[firstTimeEmail, setFirstTimeEmail]}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              isCheck={isEmailCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Email Modal React Bootstrap -2 ends*/}

            {/* Phone Modal React Bootstrap starts*/}

            <Modal
              show={showConfirmMobileChangeModal}
              backdrop="static"
              // fullscreen="lg-down"
              keyboard={false}
              centered
              onHide={() => {
                setShowConfirmMobileChangeModal(false);
              }}
            >
              <Modal.Header closeButton className="dialog-header">
                <Modal.Title className="dialog-title">
                  Are you sure you want to continue?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="dialog-body">
                You will be logged out after number is saved
              </Modal.Body>
              <Modal.Footer className="dialog-footer">
                <button
                  // style={{ border: "1px solid black" }}
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowPhone(true);
                    setShowConfirmMobileChangeModal(false);
                    if (props?.setHideMainModal) {
                      props?.setHideMainModal(true);
                    }
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-dark btn-save"
                  onClick={() => {
                    setShowConfirmMobileChangeModal(false);
                  }}
                >
                  No
                </button>
              </Modal.Footer>
            </Modal>

            <EditPhoneDialog
              show2={showPhone}
              show5={showPhoneOtp}
              setShow2={setShowPhone}
              setShow5={setShowPhoneOtp}
              setRefNumber={setRefNumber}
              numData={numData}
              setNumData={setNumData}
              setShowLoader={setShowLoader}
              firstTime={[firstTime, setFirstTime]}
              newCandidateDetails={props?.newCandidateDetails}
              isPhoneCheck={isPhoneCheck}
              setIsPhoneCheck={setIsPhoneCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Phone Modal React Bootstrap  ends*/}

            {/* Phone Modal React Bootstrap -2 starts*/}
            <VerifyOtpNumDialog
              show={showPhoneOtp}
              setShow={setShowPhoneOtp}
              refNumber={refNumber}
              setRefNumber={setRefNumber}
              numData={numData}
              setNumData={setNumData}
              setShowLoader={setShowLoader}
              firstTime={[firstTime, setFirstTime]}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              isCheck={isPhoneCheck}
              setIsCheck={setIsPhoneCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Phone Modal React Bootstrap -2 ends*/}

            {/* Location Modal React Bootstrap starts */}
            <LocationDialog
              show3={showLocation}
              setShow3={setShowLocation}
              locationList={locationList}
              setShowLoader={setShowLoader}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              isCheck={isLocationCheck}
              setIsCheck={setIsLocationCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Location Modal React Bootstrap ends */}

            {/* Linkedin Modal React Bootstrap starts */}
            <SocialMediaDialog
              show={showSocial}
              setShowLoader={setShowLoader}
              setShow={setShowSocial}
              linkedInProfile={linkedInProfile}
              setLinkedInProfile={setLinkedInProfile}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              isCheck={isSocialMediaCheck}
              setIsCheck={setIsSocialMediaCheck}
              isApplyForJobComponent={props?.isApplyForJobComponent}
              setHideMainModal={props?.setHideMainModal}
            />
            {/* Linkedin Modal React Bootstrap ends */}

            {/* Email Modal */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactAndOnlinePresencePage;
