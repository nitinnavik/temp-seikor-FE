import { useCallback, useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AboutMePage from "./about_me_page";
import ContactAndOnlinePresence from "./contact_and_online_presence";
import editIcon from "../../../assests/icons/edit-icon.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EducationAcademics from "./education_and_academics";
import ResumePage from "./resume";
import SkillAndExperience from "./skill_and_experience";
import Privacy from "./privacy";
import JobSearchPreference from "./job_search_preference";
import BackButton from "../../../assests/icons/back-icon.svg";
import deleteIcon from "../../../assests/icons/delete.svg";
import useWindowDimensions from "../../../utils/use_window_dimension";
import { useStoreActions, useStoreState } from "easy-peasy";
import Dropzone from "react-dropzone";
import toaster from "../../../utils/toaster";
import Loader from "../../../components/common/loader";
import { downloadFile, uploadFile } from "../../../_services/view.service";
import { getLocalStorage } from "../../../utils/storage";
import {
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
  USER_ID,
} from "../../../constants/keys";
import {
  updateCandidateName,
  updateProfilePicture,
} from "../../../_services/candidate.service";
import {
  initialiseFormData,
  onFormFeildsChange,
  validateField,
} from "../../../utils/form_validators";
import AccountPage from "./account";
import ProfileImage from "../../../components/profile_image";
import {
  GENERAL_ERROR_MESSAGE,
  IMAGE_DIMENSION,
  IMAGE_SIZE_EXCEEDING,
  INVALID_IMAGE_TYPE,
} from "../../../constants/message";
import { ProgressBar } from "react-bootstrap";
import { isCheckValue } from "../../../utils/utils";
import ProfileCompletionBar from "../../../components/profile_completion_bar";
import { EDIT_CANDIDATE_PAGE } from "../../../constants/page-routes";
import NotFoundPage from "../../not_found_page";
import { useRef } from "react";

const CandidateProfileModule = () => {
  const [profileModalShow, setProfileModalShow] = useState(false);
  const [usernameModalShow, setUsernameModalShow] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [smartViewScreenDisplay, setSmartViewScreenDisplay] = useState(false);
  const [initials, setInitials] = useState("");
  const [photoId, setPhotoId] = useState(null);
  const [profileSrc, setProfileSrc] = useState(null);
  const [profileModalPhoto, setProfileModalPhoto] = useState(null);
  // const [profilePhotoBackup, setProfilePhotoBackup] = useState(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [previewRequested, setPreviewRequested] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [routeInvalid, setRouteInvalid] = useState(false);
  const editProfileRef = useRef();

  const navigate = useNavigate();

  const [usernameData, setUsernameData] = useState({
    firstName: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required"],
    },
    lastName: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required"],
    },
  });

  const [pictureData, setPictureData] = useState({
    acceptedFiles: null,
    fileName: "",
    extension: "",
  });

  const BREAKPOINT_TABLET_VIEW = 780;
  const { width } = useWindowDimensions();

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setProfileSrc(res);
      } else {
        setProfileSrc(null);
      }
    });
  };

  const getInitialsLetter = async () => {
    const name = candidateDetails?.userRegistrationDetails?.name;
    if (name?.split(" ").length > 1) {
      let InitName =
        name?.split(" ")[0]?.charAt(0)?.toUpperCase() +
        name?.split(" ")[1]?.charAt(0)?.toUpperCase();
      setInitials(InitName);
      console.log(initials)
      // setShowLoader(false);
    } else {
      let InitName = name?.split(" ")[0]?.charAt(0)?.toUpperCase();
      setInitials(InitName);
      // setShowLoader(false);
    }
  };

  const getProfilePicture = () => {
    if (
      candidateDetails?.basicDetailsResponse?.profilePicDownloadURL !==
      (undefined || null)
    ) {
      downloadPicture(
        candidateDetails?.basicDetailsResponse?.profilePicDownloadURL
      );
    } else {
      setProfileSrc(null);
    }
  };

  useEffect(() => {
    getProfilePicture();
    getInitialsLetter();
  }, [candidateDetails, candidateDetails?.userRegistrationDetails]);

  const onUsernameSave = () => {
    setShowLoader(true);

    let isValid = true;
    Object.keys(usernameData)?.forEach((key) => {
      if (!validateField(key, usernameData, setUsernameData)) {
        isValid = false;
      }
    });

    if (isValid) {
      let fullname =
        usernameData?.firstName?.valueText +
        " " +
        usernameData?.lastName?.valueText;
      let usernameObject = {
        name: fullname,
      };
      updateCandidateName(usernameObject)
        .then((res) => {
          if (res?.data?.status === STATUS_SUCCESS) {
            const userId = getLocalStorage(USER_ID);
            if (userId) {
              saveCandidateDetails(userId);
            }
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
          toaster(
            "error",
            err?.data?.message ? err?.data?.message : GENERAL_ERROR_MESSAGE
          );
        });
      setUsernameModalShow(false);
    } else {
      toaster("error", "Please input all mandatory fields");
      setShowLoader(false);
    }
    setShowLoader(false);
  };

  const updateProfilePictureApiCall = (response) => {
    setPhotoId(response?.id);
    const profilePicUpdateObject = {
      photoId: response?.id,
      uploadPhoto: `${pictureData?.fileName}`,
      workStatus: candidateDetails?.basicDetailsResponse?.workStatus,
      dob: candidateDetails?.basicDetailsResponse?.dob,
      experienceOverall:
        candidateDetails?.basicDetailsResponse?.experienceOverall,
      gender: candidateDetails?.basicDetailsResponse?.gender,
      currentAddress: candidateDetails?.basicDetailsResponse?.currentAddress,
      areaPinCode: candidateDetails?.basicDetailsResponse?.areaPinCode,
      permanentAddress:
        candidateDetails?.basicDetailsResponse?.permanentAddress,
      languageId: candidateDetails?.basicDetailsResponse?.languageId,
      proficiency: candidateDetails?.basicDetailsResponse?.proficiency,
    };
    updateProfilePicture(profilePicUpdateObject)
      .then((data) => {
        const userId = getLocalStorage(USER_ID);
        if (userId) {
          saveCandidateDetails(userId);
        }
        setProfileModalShow(false);
        setTimeout(() => {
          setShowLoader(false);
          toaster("success", "Profile picture updated successfully!");
        }, 1000);
      })
      .catch((err) => {
        setShowLoader(false);
        toaster(
          "error",
          "Couldn't update profile picture, please try again later"
        );
      });
  };

  const onSavePicture = () => {
    if (deleteFlag) {
      let response = {
        id: "",
      };
      updateProfilePictureApiCall(response);
    } else if (previewRequested) {
      let formData = new FormData();
      const fileObjects = pictureData?.acceptedFiles.map((file) => {
        formData.append("contentData", file);
        formData.append(
          "contentMetaData",
          JSON.stringify({
            contentType: "PROFILE",
            contentName: `${pictureData?.fileName}`,
            contentExtention: `${pictureData?.extension}`,
          })
        );
      });

      setShowLoader(true);
      uploadFile(formData)
        .then((response) => {
          if (response?.id) {
            updateProfilePictureApiCall(response);
          } else {
            setShowLoader(false);
            toaster("error", SOMETHING_WENT_WRONG);
          }
        })
        .catch((error) => {
          toaster(
            "error",
            error?.message ? error?.message : SOMETHING_WENT_WRONG
          );
          setShowLoader(false);
        });
      setPreviewRequested(false);
    }
  };

  const onUploadPicture = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles?.length >= 1) {
      var image = new Image();
      let isValid = true;

      const fileSize = acceptedFiles[0]?.size;
      const fileName = acceptedFiles[0]?.name;
      const extensionIndex = fileName.lastIndexOf(".");
      const extension = fileName.slice(extensionIndex + 1);
      const isFileExtValid =
        fileName.includes(".png") ||
        fileName.includes(".jpg") ||
        fileName.includes(".jpeg");

      if (!isFileExtValid) {
        toaster("error", INVALID_IMAGE_TYPE);
        setPreviewRequested(false);
        return;
      }

      const isFileSizeValid = fileSize < 2e6;

      if (!isFileSizeValid) {
        toaster("error", IMAGE_SIZE_EXCEEDING);
        setPreviewRequested(false);
        return;
      }

      if (isFileExtValid && isFileSizeValid) {
        isValid = true;
      } else {
        isValid = false;
      }

      if (isValid) {
        let dimensionValid = false;

        setPictureData({
          ...pictureData,
          acceptedFiles,
          fileName,
          extension,
        });
        let previewImage = Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        });

        image.src = previewImage?.preview;
        image.onload = function () {
          if (image.width <= 2000 && image.height <= 2000) {
            dimensionValid = true;
          }
          if (isValid && dimensionValid) {
            setPreviewRequested(true);
            setPreviewSrc(previewImage?.preview);
            setDeleteFlag(false);
          } else {
            toaster("error", IMAGE_DIMENSION);
            setPreviewRequested(false);
          }
        };
      }
    } else {
      toaster("error", GENERAL_ERROR_MESSAGE);
      setPreviewRequested(false);
    }
  };

  const handleDeletePicture = () => {
    setPreviewRequested(true);
    setPreviewSrc(null);
    setDeleteFlag(true);
  };

  const populatedUsername = () => {
    const candidateName = candidateDetails?.userRegistrationDetails?.name;
    let tempFirstName = [];
    let tempLastName = [];
    candidateName?.split(" ").map((item, index) => {
      if (index + 1 < candidateName.split(" ")?.length) {
        tempFirstName?.push(item);
      } else {
        tempLastName?.push(item);
      }
    });

    let firstName = tempFirstName?.join(" ");
    let lastName = tempLastName?.join("");
    // let firstName = candidateName?.split(" ")[0];
    // let lastName = candidateName?.split(" ")[1];
    let copyUsernameData = { ...usernameData };
    copyUsernameData.firstName.valueText = firstName;
    copyUsernameData.lastName.valueText = lastName;
    setUsernameData(copyUsernameData);
  };

  // const downloadPhoto = async (id) => {
  //   let formData = new FormData();
  //   formData.append("fileId", id);
  //   return downloadFile(formData);
  // };

  useEffect(() => {
    if (candidateDetails) {
      setUserDetails(candidateDetails);
    }
  }, [candidateDetails]);

  useEffect(() => {
    if (editProfileRef?.current?.childElementCount <= 1) {
      setRouteInvalid(true);
    } else {
      setRouteInvalid(false);
    }
  }, [window?.location?.href]);

  useEffect(() => {
    setSmartViewScreenDisplay(true);
  }, []);
  useEffect(() => {
    populatedUsername();
  }, [candidateDetails?.userRegistrationDetails?.name]);

  return (
    <>
      {routeInvalid ? (
        <NotFoundPage hideHeader={true} />
      ) : (
        <div className="bg-white h-100">
          {showLoader && <Loader />}
          <div className="container h-100">
            <div className="sidebar-layout-container d-flex h-100">
              <div
                className={`sidebar-wrapper h-100 ${
                  width < BREAKPOINT_TABLET_VIEW && smartViewScreenDisplay
                    ? "d-none"
                    : "d-block"
                }`}
              >
                <div className="list-group sidebar ">
                  <div className="profileName">
                    <div style={{ display: "flex", alignItems: "end" }}>
                      {/* <section> */}
                      <div className="sidebar-profile-pic">
                        <ProfileImage
                          src={profileSrc}
                          name={candidateDetails?.userRegistrationDetails?.name}
                          initialsContainerClass="sidebar-default-profile-picture"
                        />
                        <img
                          className="profileImageIcon pointer"
                          onClick={() => {
                            setProfileModalShow(true);
                          }}
                          src={editIcon}
                          alt=""
                        />
                      </div>

                      <Modal
                        show={profileModalShow}
                        onHide={() => {
                          setProfileModalShow(false);
                          getProfilePicture();
                          setDeleteFlag(false);
                          setPreviewRequested(false);
                        }}
                        fullscreen="lg-down"
                        className="lg-dialog-modal"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="dialog-title modal-title">
                            Profile Picture
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
                          <div className="modal-profile-picture-div">
                            {profileSrc || previewSrc ? (
                              <div>
                                {" "}
                                <div
                                  className="position-absolute deleteIconStyle pointer"
                                  onClick={handleDeletePicture}
                                >
                                  <img src={deleteIcon} alt="delete icon" />
                                </div>
                                <div className="position-relative d-flex justify-content-center profileImageStyle border rounded-3 overflow-hidden">
                                  {previewRequested ? (
                                    <ProfileImage
                                      src={previewSrc}
                                      name={
                                        candidateDetails
                                          ?.userRegistrationDetails?.name
                                      }
                                      initialsContainerClass=" initialsStyle2-xxxl"
                                    />
                                  ) : (
                                    <ProfileImage
                                      src={profileSrc}
                                      name={
                                        candidateDetails
                                          ?.userRegistrationDetails?.name
                                      }
                                      initialsContainerClass=" initialsStyle2-xxxl"
                                    />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="modal-default-profile-picture d-flex justify-content-center align-items-center">
                                {initials}
                              </p>
                            )}
                          </div>
                          <p className="mt-4 text-center small-text-gray">
                            * {IMAGE_DIMENSION}
                          </p>
                          <p className="mt-1 text-center small-text-gray">
                            * {IMAGE_SIZE_EXCEEDING}
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              onUploadPicture(acceptedFiles);
                            }}
                            multiple={false}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <>
                                  <div className="label d-flex align-items-center justify-content-center">
                                    <Button
                                      variant="secondary"
                                      style={{
                                        background: "transparent",
                                        color: "black",
                                      }}
                                    >
                                      Upload
                                    </Button>
                                  </div>
                                </>
                              </div>
                            )}
                          </Dropzone>
                          <Button
                            className="btn btn-dark"
                            style={{ background: "black" }}
                            onClick={() => {
                              onSavePicture();
                            }}
                          >
                            Save
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <h5
                        className="text-capitalize text-break ellipse-2"
                        style={{
                          maxWidth: "50%",
                          marginBottom: "1.2rem",
                          fontSize: "16px",
                          maxHeight: "40px",
                        }}
                      >
                        {candidateDetails?.userRegistrationDetails?.name}
                      </h5>
                    </div>
                    <img
                      className="profileImageIcon2 pointer"
                      onClick={() => {
                        populatedUsername();
                        setUsernameModalShow(true);
                      }}
                      src={editIcon}
                      alt=""
                    />{" "}
                    <Modal
                      show={usernameModalShow}
                      onHide={() => {
                        setUsernameModalShow(false);
                        initialiseFormData(usernameData, setUsernameData);
                      }}
                      fullscreen="lg-down"
                      className="lg-dialog-modal"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header
                        style={{ borderBottom: "none" }}
                        className="dialog-header"
                        closeButton
                      >
                        <Modal.Title className="dialog-title">Name</Modal.Title>
                      </Modal.Header>
                      <Modal.Body
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        className="dialog-body py-3 m-0"
                      >
                        <label className="modalLabel mt-3">First Name*</label>
                        <input
                          defaultValue={usernameData?.firstName?.valueText}
                          className={
                            (usernameData?.firstName?.errorText
                              ? "error"
                              : "") + " form-control mt-2 modal-input"
                          }
                          required
                          onChange={($event) => {
                            onFormFeildsChange(
                              $event,
                              usernameData,
                              setUsernameData
                            );
                          }}
                          name="firstName"
                        />
                        {usernameData.firstName.errorText && (
                          <div className="field-error mt-1">
                            {usernameData.firstName.errorText}
                          </div>
                        )}
                        <label className="modalLabel mt-4">Last Name*</label>
                        <input
                          defaultValue={usernameData?.lastName?.valueText}
                          className={
                            (usernameData?.lastName?.errorText ? "error" : "") +
                            " form-control mt-2 modal-input"
                          }
                          required
                          onChange={($event) => {
                            onFormFeildsChange(
                              $event,
                              usernameData,
                              setUsernameData
                            );
                          }}
                          name="lastName"
                        />
                        {usernameData.lastName.errorText && (
                          <div className="field-error mt-1">
                            {usernameData.lastName.errorText}
                          </div>
                        )}
                      </Modal.Body>
                      <Modal.Footer
                        style={{ borderTop: "none" }}
                        className="p-4 mt-3"
                      >
                        <Button
                          variant="secondary"
                          className="btn btn-cancel"
                          onClick={() => {
                            setUsernameModalShow(false);
                            initialiseFormData(usernameData, setUsernameData);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="btn btn-dark btn-save"
                          onClick={() => {
                            onUsernameSave();
                          }}
                        >
                          Save
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <div className="navigation-wrapper">
                    <NavLink
                      to="about-me"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      About Me
                    </NavLink>
                    <NavLink
                      to="contact-and-online-presence"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Contact &amp; Online Presence
                    </NavLink>
                    <NavLink
                      to="resume"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Resume
                    </NavLink>
                    <NavLink
                      to="skill-and-experience"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Skills &amp; Experience
                    </NavLink>
                    <NavLink
                      to="education-and-academics"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Education &amp; Academics
                    </NavLink>
                    <NavLink
                      to="job-search-preference"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Job Search Preferences
                    </NavLink>
                    <NavLink
                      to="privacy"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Privacy
                    </NavLink>
                    <NavLink
                      to="account"
                      onClick={() => {
                        setSmartViewScreenDisplay(true);
                      }}
                      className={({ isActive }) =>
                        width > BREAKPOINT_TABLET_VIEW && isActive
                          ? "sidebarShow"
                          : "sidebar-menu"
                      }
                    >
                      Account
                    </NavLink>
                  </div>
                </div>
              </div>

              <div
                ref={editProfileRef}
                className={`page-content-wrapper ${
                  width > BREAKPOINT_TABLET_VIEW
                    ? "d-block"
                    : smartViewScreenDisplay
                    ? "d-block"
                    : "d-none"
                }`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => {
                      if (width > BREAKPOINT_TABLET_VIEW) {
                        navigate(-1);
                      } else {
                        setSmartViewScreenDisplay(false);
                        // window.location = EDIT_CANDIDATE_PAGE;
                      }
                    }}
                    className="btn bg-transparent fw-bold ms-0 ps-0 pt-0 text-left go-back-btn px-3 pt-1"
                    style={{ color: "#808080", outline: "none" }}
                  >
                    <img className="ms-2" src={BackButton} alt={BackButton} />
                    <span className="backTitle">Go Back</span>
                  </button>
                  <div className="profile-update me-2">
                    <div className="d-flex text-end ">
                      <ProfileCompletionBar
                        candidateDetails={userDetails}
                        customCssClass={"small-text-black"}
                      />
                    </div>
                  </div>
                </div>
                <Routes>
                  <Route
                    // path={
                    //   width > BREAKPOINT_TABLET_VIEW ? "" : EDIT_CANDIDATE_PAGE
                    // }
                    element={<Navigate to="about-me" replace />}
                  />

                  <Route
                    path="about-me"
                    element={
                      <AboutMePage
                        setSmartViewScreenDisplay={setSmartViewScreenDisplay}
                        candidateDetails={candidateDetails}
                        isApplyForJobComponent={false}
                      />
                    }
                  />

                  <Route
                    path="contact-and-online-presence"
                    element={
                      <ContactAndOnlinePresence
                        isApplyForJobComponent={false}
                      />
                    }
                  />

                  <Route
                    path="skill-and-experience"
                    element={
                      <SkillAndExperience
                        candidateDetails={candidateDetails}
                        isApplyForJobComponent={false}
                      />
                    }
                  />
                  <Route
                    path="education-and-academics"
                    element={
                      <EducationAcademics isApplyForJobComponent={false} />
                    }
                  />

                  <Route path="resume" element={<ResumePage />} />
                  <Route
                    path="job-search-preference"
                    element={
                      <JobSearchPreference
                        isApplyForJobComponent={false}
                        candidateDetails={candidateDetails}
                      />
                    }
                  />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="account" element={<AccountPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateProfileModule;

// setProfilePhoto(URL.createObjectURL(res?.blobData));
// setProfilePhotoBackup(URL.createObjectURL(res?.blobData));
// setProfileModalPhoto(URL.createObjectURL(res?.blobData));
