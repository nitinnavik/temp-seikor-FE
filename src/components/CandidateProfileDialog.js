import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import EducationAcademics from "../pages/candidate/member-profile/education_and_academics.jsx";
import BackButton from "../assests/icons/back-icon.svg";
import location from "../assests/icons/ic_location12.svg";
import ProfessionalExperience from "./ProfessionalExperience.js";
import { Button } from "react-bootstrap";
import {
  LOCATION_NOT_AVAILABLE,
  NO_DETAILS_AVAILABLE,
} from "../constants/message.js";
import { downloadFile } from "../_services/view.service.js";
import ProfileImage from "./profile_image.js";

const CandidateProfileViewPage = (props) => {
  const [foundCandidateSrc, setFoundCandidateSrc] = useState(null);

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setFoundCandidateSrc(res);
      }
    });
  };

  useEffect(() => {
    downloadPicture(props?.basicDetailsResponse?.profilePicDownloadURL);
  }, [props]);
// console.log(process.env.REACT_APP_IMAGE_BASEURL +  props?.candidateDetails?.profilePic,"dd")
  return (
    <div>
      <Modal
        show={props.show}
        fullscreen="lg-down"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        className="dialog-wrapper lg-dialog-modal"
      >
        <Modal.Header className="border-0 m-1"></Modal.Header>
        <div className="d-flex ps-4">
          <button
            className="btn bg-transparent fw-bold text-left"
            style={{ color: "#808080", outline: "none" }}
            onClick={() => props.onCloseButtonClick()}
          >
            <img src={BackButton} alt={BackButton} />{" "}
          </button>
          <h2 className="pt-2 fs-20 color-primary fw-700">
            {" "}
            Candidate Profile{" "}
          </h2>
        </div>
        <Modal.Body className="dialog-body">
          <div className="container">
            <div className="box-shadow border-radius p-2 mt-3">
              <div className="d-flex gap-3">
                <div className="">
                  {/* {props?.candidateDetails?.basicDetailsResponse?.profilePicDownloadURL} */}
                  <ProfileImage
                    src={
                      process.env.REACT_APP_IMAGE_BASEURL +  props?.candidateDetails?.profilePic}
                      // process.env.REACT_APP_IMAGE_BASEURL +  props?.candidateDetails?.basicDetailsResponse?.profilePicDownloadURL}
                    name={
                      props?.candidateDetails?.userRegistrationDetails?.name
                    }
                    width="80px"
                    height="80px"
                    initialsContainerClass=""
                  />
                </div>
                <div className="pt-2">
                  <h4 className="fs-16 fw-600 text-break">
                    {props?.candidateDetails?.userRegistrationDetails?.name}
                  </h4>
                  <div className="d-flex flex-wrap">
                    {props?.candidateDetails?.additionalInfoProfileResponse
                      ?.currentDesignation && (
                      <span className="fs-16 fw-500">
                        {
                          props?.candidateDetails?.additionalInfoProfileResponse
                            ?.currentDesignation
                        }
                      </span>
                    )}
                    {props?.candidateDetails?.additionalInfoProfileResponse
                      ?.company && (
                      <div>
                        <span className="fs-16 fw-400 light-gray-color">
                          &nbsp; at{" "}
                        </span>
                        <span className="fs-16 fw-500">
                          {
                            props?.candidateDetails
                              ?.additionalInfoProfileResponse?.company
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="d-flex pt-2">
                    {props?.candidateDetails?.userPrivacySettings?.workStatus &&
                      props?.candidateDetails?.additionalInfoProfileResponse
                        ?.jobSearchStatus && (
                        <div className="fs-12 fw-400 p-1 ps-2 pe-2 btn-blue-p-blue">
                          {
                            props?.candidateDetails
                              ?.additionalInfoProfileResponse?.jobSearchStatus
                          }
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            {!props?.candidateDetails?.userPrivacySettings?.location &&
            !props?.candidateDetails?.userPrivacySettings?.workHistory &&
            !props?.candidateDetails?.userPrivacySettings?.education ? (
              <>
                <div className="title-card my-1 fs-16 pt-3 mb-0 font-medium-gray fw-600">
                  {NO_DETAILS_AVAILABLE}
                </div>
              </>
            ) : (
              props?.candidateDetails?.userPrivacySettings?.location && (
                <div className="box-shadow p-3 ps-4 mt-3">
                  <div className="d-flex gap-2">
                    <img src={location} alt="location-icon" />
                    <h5 className="fw-600 fs-14 color-primary pt-1">
                      Current Location
                    </h5>
                  </div>
                  <div className="font-medium-gray ">
                    {props?.candidateDetails?.additionalInfoProfileResponse
                      ?.currentLocation
                      ? props?.candidateDetails?.additionalInfoProfileResponse
                          ?.currentLocation
                      : LOCATION_NOT_AVAILABLE}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="p-3 pt-1">
            {props?.candidateDetails?.userPrivacySettings?.workHistory && (
              <div className="">
                <div className="title-card my-4 fw-600 fs-16 pt-1 pb-0">
                  Professional Experience
                </div>
                <ProfessionalExperience
                  candidateDetails={props?.candidateDetails}
                  isReadOnlyProp={true}
                />
              </div>
            )}
            {props?.candidateDetails?.userPrivacySettings?.education && (
              <div>
                <div className="title-card my-1 fw-600 fs-16 pt-3 mb-0">
                  Education
                </div>
                <EducationAcademics
                  candidateDetails={props?.candidateDetails}
                  isReadOnly={true}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-2 pb-3 pt-3">
          <Button
            className="fs-12 btn-rounded btn-primary ps-5 pe-5 "
            onClick={() => props.onCloseButtonClick()}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CandidateProfileViewPage;
