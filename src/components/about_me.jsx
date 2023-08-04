import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import aboutLogo from "../assests/icons/about.svg";
import crossButton from "../assests/icons/cross-icon.svg";
import editLogo from "../assests/icons/edit-icon.svg";
import {
  companyDropdown,
  roleDropdown,
  userCurrentDetails,
  userMessage,
} from "../_services/candidate.service";
import { getMaster, UserName } from "../_services/view.service";
import SearchComboBox from "./SearchComboBox";
import Modal from "react-bootstrap/Modal";
import { MASTER_TYPE, STATUS_SUCCESS, TOKEN, USER_ID } from "../constants/keys";
import toaster from "../utils/toaster";
import Loader from "./common/loader";
import { getLocalStorage } from "../utils/storage";
import { useStoreActions } from "easy-peasy";
import { propTypes } from "react-bootstrap/esm/Image";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";

const AboutMe = ({
  candidateDetails,
  isApplyForJobComponent,
  newCandidateDetails,
  setNewCandidateDetails,
  setHideMainModal,
}) => {
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const navigate = useNavigate();
  const token = getLocalStorage(TOKEN);
  const [showCurrentRoleDialog, setShowCurrentRoleDialog] = useState(false);
  const [showWhyHireMeDialog, setShowWhyHireMeDialog] = useState(false);

  const [masterRoleList, setMasterRoleList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [hireMeField, setHireMeField] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isCurrentRoleCheck, setIsCurrentRoleCheck] = useState(false);
  const [isWhyShouldYouHireMeCheck, setIsWhyShouldYouHireMeCheck] =
    useState(false);
  const [companyOutput, setCompanyOutput] = useState([]);
  const [roleOutput, setRoleOutput] = useState([]);
  const [jobStatusSelected, setJobStatusSelected] = useState("");
  const Character_Limit = 500;
  const [isActive, setIsActive] = useState(false);
  const [total, setTotal] = useState("");

  const handleChange = (event) => {
    if (event.target.value.length >= Character_Limit) {
      setTotal(event.target.value.length - Character_Limit);
      setIsActive({ isActive: true });
    } else {
      setIsActive();
    }
    setHireMeField(event.target.value);
  };
  // const backButton = () => {
  //   if (window.innerWidth > 768) {
  //     navigate("/candidate");
  //   } else {
  //     props.setShowAboutMe(!props.showAboutMe);
  //   }
  // };

  const onSaveWhyShouldForm = () => {
    const message = hireMeField;
    if (isApplyForJobComponent && !isWhyShouldYouHireMeCheck) {
      setNewCandidateDetails({
        ...newCandidateDetails,
        additionalInfoProfileResponse: {
          ...newCandidateDetails?.additionalInfoProfileResponse,
          aboutMe: message,
        },
      });

      setShowWhyHireMeDialog(false);
    } else {
      setShowLoader(true);
      userMessage(message)
        .then((res) => {
          if (res?.data?.status === STATUS_SUCCESS) {
            toaster("success", "Saved successfully!");
            if (isApplyForJobComponent) {
              setNewCandidateDetails({
                ...newCandidateDetails,
                additionalInfoProfileResponse: {
                  ...newCandidateDetails?.additionalInfoProfileResponse,
                  aboutMe: message,
                },
              });
            }
            const userId = getLocalStorage(USER_ID);
            if (userId) {
              saveCandidateDetails(userId);
            }
          } else {
            toaster(
              "error",
              res?.message ? res?.message : GENERAL_ERROR_MESSAGE
            );
          }
          setShowLoader(false);
          setShowWhyHireMeDialog(false);
        })
        .catch((err) => {
          toaster("error", err?.message ? err?.message : GENERAL_ERROR_MESSAGE);
          setShowLoader(false);
          setShowWhyHireMeDialog(false);
        });
    }
  };

  const submitUserCurrentDetails = () => {
    const roles = roleOutput.toString();
    const company = companyOutput.toString();
    const jobStatus = jobStatusSelected;

    if (isApplyForJobComponent && !isCurrentRoleCheck) {
      // newCandidateDetails;
      setNewCandidateDetails({
        ...newCandidateDetails,
        additionalInfoProfileResponse: {
          ...newCandidateDetails?.additionalInfoProfileResponse,
          company: company,
          currentDesignation: roles,
          jobSearchStatus: jobStatus,
        },
      });

      setShowCurrentRoleDialog(false);
    } else {
      setShowLoader(true);
      userCurrentDetails(roles, company, jobStatus)
        .then((res) => {
          toaster("success", "Saved successfully!");
          setShowLoader(false);
          setShowCurrentRoleDialog(false);
          const userId = getLocalStorage(USER_ID);
          if (isApplyForJobComponent) {
            setNewCandidateDetails({
              ...newCandidateDetails,
              additionalInfoProfileResponse: {
                ...newCandidateDetails?.additionalInfoProfileResponse,
                company: company,
                currentDesignation: roles,
                jobSearchStatus: jobStatus,
              },
            });
          }
          if (userId) {
            saveCandidateDetails(userId);
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
          setShowCurrentRoleDialog(false);
        });
    }
  };

  const getAllMasterData = async () => {
    const roles = await getMaster(MASTER_TYPE.JOBROLE);
    const companies = await getMaster(MASTER_TYPE.COMPANY);
    const jobStatuses = await getMaster(MASTER_TYPE.JOBSTATUS);
    if (roles && roles.length > 0) {
      const roleValues = roles?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (roleValues && roleValues.length > 0) {
        setMasterRoleList(roleValues);
      }
    }
    if (companies && companies.length > 0) {
      const companyValues = companies?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (companyValues && companyValues.length > 0) {
        setCompanyList(companyValues);
      }
    }
    if (jobStatuses && jobStatuses.length > 0) {
      const jobStatusValues = jobStatuses?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (jobStatusValues && jobStatusValues.length > 0) {
        setJobStatuses(jobStatusValues);
      }
    }
  };

  // console.log("candidateDetails", candidateDetails);

  const roleSelectedOutput = (event) => {
    setRoleOutput(event);
  };

  const companySelectedOutput = (event) => {
    setCompanyOutput(event);
  };

  const onSelectJobStatus = (event) => {
    setJobStatusSelected(event?.target?.value);
  };

  const resetValues = () => {
    if (
      isApplyForJobComponent &&
      !isCurrentRoleCheck &&
      !isWhyShouldYouHireMeCheck
    ) {
      if (newCandidateDetails?.additionalInfoProfileResponse) {
        const info = newCandidateDetails?.additionalInfoProfileResponse;
        setJobStatusSelected(info?.jobSearchStatus);

        const company = info?.company?.split(",");
        if (company?.length === 1 && company[0] === "") {
          setCompanyOutput([]);
        } else {
          setCompanyOutput(company);
        }

        const roles = info?.currentDesignation?.split(",");
        if (roles?.length === 1 && roles[0] === "") {
          setRoleOutput([]);
        } else {
          setRoleOutput(roles);
        }
      }
      if (newCandidateDetails?.additionalInfoProfileResponse?.aboutMe) {
        setHireMeField(
          newCandidateDetails?.additionalInfoProfileResponse?.aboutMe
        );
      }
    } else {
      if (candidateDetails?.additionalInfoProfileResponse) {
        const info = candidateDetails?.additionalInfoProfileResponse;
        setJobStatusSelected(info?.jobSearchStatus);

        const company = info?.company?.split(",");
        if (company?.length === 1 && company[0] === "") {
          setCompanyOutput([]);
        } else {
          setCompanyOutput(company);
        }

        const roles = info?.currentDesignation?.split(",");
        if (roles?.length === 1 && roles[0] === "") {
          setRoleOutput([]);
        } else {
          setRoleOutput(roles);
        }
      }
      if (candidateDetails?.additionalInfoProfileResponse?.aboutMe) {
        setHireMeField(
          candidateDetails?.additionalInfoProfileResponse?.aboutMe
        );
      }
    }
  };

  useEffect(() => {
    getAllMasterData();
  }, []);

  useEffect(() => {
    resetValues();
  }, [candidateDetails]);

  return (
    <>
      {showLoader && <Loader />}
      <div>
        <div className="row">
          <div className="col">
            <div className="my-3">
              <div className="fw-bold fs-24">
                {" "}
                <img src={aboutLogo} alt={aboutLogo} />
                &nbsp;About Me
              </div>
            </div>

            <div className="flex-container pb-4">
              <div className="row">
                <div className="col-11">
                  <div className="intro-info pt-4 ps-4 about-me-name-display header-ellipse-1">
                    Hi, I Am {candidateDetails?.userRegistrationDetails?.name}
                  </div>
                  {isApplyForJobComponent && !isCurrentRoleCheck ? (
                    newCandidateDetails?.additionalInfoProfileResponse
                      ?.currentDesignation ? (
                      <div className="pt-2 ps-4 fs-14 ">
                        a{" "}
                        <span className="fw-700 header-ellipse-1">
                          {
                            newCandidateDetails?.additionalInfoProfileResponse
                              ?.currentDesignation
                          }
                        </span>{" "}
                        at{" "}
                        <span className="fw-700 header-ellipse-1">
                          {
                            newCandidateDetails?.additionalInfoProfileResponse
                              ?.company
                          }
                        </span>
                      </div>
                    ) : (
                      <div
                        className="text-danger  pt-2 ps-4"
                        style={{ fontSize: "14px", fontWeight: "400" }}
                      >
                        Update current role & company
                      </div>
                    )
                  ) : candidateDetails?.additionalInfoProfileResponse
                      ?.currentDesignation ? (
                    <div className="d-flex pt-2 ps-4 fs-14 flex-wrap">
                      <span style={{ paddingRight: "3px" }} className=""></span>
                      <span
                        style={{
                          maxWidth: "150px",
                        }}
                        className="fw-700 header-ellipse-1"
                      >
                        {
                          candidateDetails?.additionalInfoProfileResponse
                            ?.currentDesignation
                        }
                      </span>
                      <span
                        style={{ paddingRight: "3px", paddingLeft: "3px" }}
                        className=""
                      >
                        {" "}
                        at
                      </span>
                      <span
                        style={{ maxWidth: "150px" }}
                        className="fw-700 header-ellipse-1"
                      >
                        {
                          candidateDetails?.additionalInfoProfileResponse
                            ?.company
                        }
                      </span>
                    </div>
                  ) : (
                    <div
                      className="text-danger  pt-2 ps-4"
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      Update current role & company
                    </div>
                  )}
                  {isApplyForJobComponent && !isCurrentRoleCheck
                    ? newCandidateDetails?.additionalInfoProfileResponse
                        ?.jobSearchStatus && (
                        <div
                          className="activelyLooking mt-3 ms-4 text-primary"
                          style={{ fontWeight: "400", display: "inline-block" }}
                        >
                          {
                            newCandidateDetails?.additionalInfoProfileResponse
                              ?.jobSearchStatus
                          }
                        </div>
                      )
                    : candidateDetails?.additionalInfoProfileResponse
                        ?.jobSearchStatus && (
                        <div
                          className="activelyLooking mt-3 ms-4 text-primary"
                          style={{ fontWeight: "400", display: "inline-block" }}
                        >
                          {
                            candidateDetails?.additionalInfoProfileResponse
                              ?.jobSearchStatus
                          }
                        </div>
                      )}
                </div>
                <div className="col-1 pt-3 pe-2">
                  <img
                    src={editLogo}
                    onClick={() => {
                      resetValues();
                      setShowCurrentRoleDialog(true);
                      if (setHideMainModal) {
                        setHideMainModal(true);
                      }
                    }}
                    className="edit-button pointer"
                    style={{ position: "absolute", top: "7px", right: "6px" }}
                    alt="Edit Logo"
                  />

                  {/* React bootstrap Modal Starts */}
                  <Modal
                    show={showCurrentRoleDialog}
                    onHide={() => {
                      resetValues();
                      setShowCurrentRoleDialog(false);
                      if (setHideMainModal) {
                        setHideMainModal(false);
                      }
                    }}
                    backdrop="static"
                    fullscreen="lg-down"
                    centered
                    keyboard={false}
                    className="lg-dialog-modal"
                  >
                    <Modal.Header closeButton className="dialog-header">
                      <Modal.Title className="dialog-title">
                        Current Role, <br /> Company & Status{" "}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="dialog-body">
                      <div className="form-group">
                        <label className="modalLabel">Current Role</label>
                        <SearchComboBox
                          inputData={masterRoleList}
                          defaultValue={roleOutput}
                          isMultiSelect={false}
                          inputCssClass={"modal-input combo-search-box"}
                          wrapperCssClass={""}
                          placeholder={"Search or Select"}
                          onSelect={roleSelectedOutput}
                          searchListHeight={120}
                          isAllowUserDefined={true}
                        />
                      </div>

                      <div className="form-group">
                        <label className="modalLabel">Company</label>
                        <SearchComboBox
                          inputData={companyList}
                          defaultValue={companyOutput}
                          isMultiSelect={false}
                          inputCssClass={"modal-input combo-search-box"}
                          wrapperCssClass={""}
                          placeholder={"Search or Select"}
                          onSelect={companySelectedOutput}
                          searchListHeight={120}
                          isAllowUserDefined={true}
                        />
                      </div>

                      <div className="form-group">
                        <label className="modalLabel">Status</label>
                        <select
                          className="form-select modal-input fw-400 fs-12 pointer"
                          onChange={onSelectJobStatus}
                          defaultValue={jobStatusSelected}
                        >
                          <option value="">Select</option>
                          {jobStatuses &&
                            jobStatuses.length > 0 &&
                            jobStatuses.map((item) => (
                              <option value={item?.name}>{item?.name}</option>
                            ))}
                        </select>
                      </div>
                      {isApplyForJobComponent && token && (
                        <div className="dialog-footer-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              onChange={() =>
                                setIsCurrentRoleCheck(!isCurrentRoleCheck)
                              }
                              defaultChecked={isCurrentRoleCheck}
                              className="mt-2 ms-1 me-2 pt-1 "
                            />
                            Save this to profile
                          </label>
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer className="dialog-footer">
                      <button
                        onClick={() => {
                          resetValues();
                          setShowCurrentRoleDialog(false);
                          if (setHideMainModal) {
                            setHideMainModal(false);
                          }
                        }}
                        className="btn btn-cancel"
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-dark btn-save"
                        onClick={() => {
                          // if (token) {
                          submitUserCurrentDetails();
                          if (setHideMainModal) {
                            setHideMainModal(false);
                          }
                          // } else {
                          //   setShowCurrentRoleDialog(false);
                          //   if (setHideMainModal) {
                          //     setHideMainModal(false);
                          //   }
                          //   toaster("success", "Saved successfully!");
                          // }
                        }}
                      >
                        Save
                      </button>
                    </Modal.Footer>
                  </Modal>

                  {/* React bootstrap Modal endss */}
                </div>
              </div>
            </div>

            <div className="flex-container ">
              <div className="row">
                <div className="col-11">
                  <div
                    className="pt-4 ps-4 fw-bold"
                    style={{ fontSize: "16px" }}
                  >
                    Why you should hire me
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "400" }}>
                    {/* <div className="text-danger h-6 pt-2 ps-4">
                      Use this space to make the recruiter notice your
                      application.
                    </div>
                    <div className="ps-4 pb-4" style={{ fontWeight: "400" }}>
                      You might want to highlight how you're awesome to work
                      with,why you rock at what you do or anything else that
                      tells them why you'll be great for their company and great
                      to have around. {displayText}
                    </div> */}
                    {isApplyForJobComponent ? (
                      newCandidateDetails?.additionalInfoProfileResponse
                        ?.aboutMe ? (
                        <div className="color-tertiary ps-4 pb-4 mt-2 line-height-18 fw-400">
                          {
                            newCandidateDetails?.additionalInfoProfileResponse
                              ?.aboutMe
                          }
                        </div>
                      ) : (
                        <>
                          <div className="text-danger h-6 pt-2 ps-4 mt-2 line-height-18">
                            Use this space to make the recruiter notice your
                            application.
                          </div>
                          <div className="ps-4 pb-4 fw-400 line-height-18">
                            You might want to highlight how you're awesome to
                            work with,why you rock at what you do or anything
                            else that tells them why you'll be great for their
                            company and great to have around.
                          </div>
                        </>
                      )
                    ) : candidateDetails?.additionalInfoProfileResponse
                        ?.aboutMe ? (
                      <div className="color-tertiary ps-4 pb-4 mt-2  fw-400 line-height-18 text-break">
                        {
                          candidateDetails?.additionalInfoProfileResponse
                            ?.aboutMe
                        }
                      </div>
                    ) : (
                      <>
                        <div className="text-danger h-6 pt-2 ps-4 mt-2 line-height-18">
                          Use this space to make the recruiter notice your
                          application.
                        </div>
                        <div
                          style={{ color: "#808080" }}
                          className="ps-4 pb-4 fw-400 line-height-18"
                        >
                          You might want to highlight how you're awesome to work
                          with,why you rock at what you do or anything else that
                          tells them why you'll be great for their company and
                          great to have around.
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-1 pt-3 pe-3">
                  <img
                    src={editLogo}
                    onClick={() => {
                      resetValues();
                      setShowWhyHireMeDialog(true);
                      if (setHideMainModal) {
                        setHideMainModal(true);
                      }
                    }}
                    className="edit-button pointer"
                    style={{ position: "absolute", top: "7px", right: "6px" }}
                    alt="Edit Logo"
                  />

                  {/* React Bootstrap Modal Starts */}

                  <Modal
                    show={showWhyHireMeDialog}
                    onHide={() => {
                      resetValues();
                      setShowWhyHireMeDialog(false);
                      setHireMeField("");
                      if (setHideMainModal) {
                        setHideMainModal(false);
                      }
                    }}
                    backdrop="static"
                    fullscreen="lg-down"
                    centered
                    keyboard={false}
                    className="lg-dialog-modal"
                  >
                    <Modal.Header closeButton className="dialog-header">
                      <Modal.Title className="dialog-title">
                        Why you should hire me
                      </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="dialog-body">
                      <span
                        className={
                          isActive ? "whyShouldTextError" : "whyShouldText"
                        }
                      >
                        {/* {isActive ? ( */}
                        <textarea
                          maxLength={Character_Limit}
                          // className={"textAreaError"}
                          className={
                            isActive ? "textAreaError" : "whyShouldTextArea"
                          }
                          placeholder="Use this space to make the recruiter notice your application. You might want to highlight how you're awesome to work with, why you rock at what you do or anything else that tells them why you'll be great for their company and great to have around."
                          // onChange={(event) => {
                          //   setHireMeField(event.target.value);
                          // }}
                          onChange={handleChange}
                          defaultValue={hireMeField}
                        ></textarea>
                        {/* ) : ( */}
                        <br />
                        <span style={{ float: "right" }}>
                          {isActive
                            ? `${total}`
                            : `${hireMeField.length}-${Character_Limit}`}
                          characters left
                        </span>
                      </span>
                      {isApplyForJobComponent && token && (
                        <div className="dialog-footer-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              onChange={() =>
                                setIsWhyShouldYouHireMeCheck(
                                  !isWhyShouldYouHireMeCheck
                                )
                              }
                              defaultChecked={isWhyShouldYouHireMeCheck}
                              className="mt-2 ms-1 me-2 pt-1 "
                            />
                            Save this to profile
                          </label>
                        </div>
                      )}
                    </Modal.Body>

                    <Modal.Footer className="dialog-footer">
                      <button
                        onClick={() => {
                          resetValues();
                          setShowWhyHireMeDialog(false);
                          setHireMeField("");
                          if (setHideMainModal) {
                            setHideMainModal(false);
                          }
                        }}
                        className="btn btn-cancel"
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-dark btn-save"
                        onClick={() => {
                          // if (token) {
                          onSaveWhyShouldForm();
                          if (setHideMainModal) {
                            setHideMainModal(false);
                          }
                          // } else {
                          setShowWhyHireMeDialog(false);
                          if (setHideMainModal) {
                            setHideMainModal(false);
                          }
                          if (hireMeField != "") {
                            toaster("success", "Saved successfully!");
                          }
                          // }
                        }}
                      >
                        Save
                      </button>
                    </Modal.Footer>
                  </Modal>

                  {/* React Bootstrap Modal ends */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AboutMe;
