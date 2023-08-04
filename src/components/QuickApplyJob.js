/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import caution from "../assests/icons/ic_caution.svg";
import close from "../assests/icons/ic-close-24.svg";
import { Link } from "react-router-dom";
import QuickApplyResumeSelection from "./QuickApplyResumeSelection";
import { useStoreActions, useStoreState } from "easy-peasy";
import toaster from "../utils/toaster";
import { applyingForJob } from "../_services/member-profile.service";
import { fetchJobDetails } from "../_services/member-profile.service";
import Loader from "./common/loader";
import ApplyForJobDialog from "./ApplyForJobDialog";
import {
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
  QUICKAPPLYMODALSHOW,
} from "../constants/keys";
import CompanyImage from "./company_image";
import { setLocalStorage } from "../utils/storage";

const QuickApplyJob = (props) => {
  const [isResumeSelected, setIsResumeSelected] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const [show, setShow] = useState(false);
  const [backBtnClicked, setBackBtnClicked] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [saveToProfileCheck, setSaveToProfileCheck] = useState(false);

  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );
  const [showLoader, setShowLoader] = useState(false);
  const [newCandidateDetails, setNewCandidateDetails] = useState();
  useEffect(() => {
    if (candidateDetails) {
      if (candidateDetails?.userResumeResponse?.length > 0) {
        setIsResumeSelected(true);
      }
    }
    if (newCandidateDetails) {
      if (newCandidateDetails?.userResumeResponse) {
        if (newCandidateDetails?.userResumeResponse?.length > 0) {
          setIsResumeSelected(true);
        }
      }
    }
  }, [newCandidateDetails]);
  const [applyForJob, setApplyForJob] = useState({
    jobId: Number(props.id),
    resumeId: 0,
    jobAnswers: [],
    profileImageId: candidateDetails?.basicDetailsResponse?.photoId
      ? candidateDetails?.basicDetailsResponse?.photoId
      : null,
    referalId: props?.refererId ? props?.refererId : null,
    recruitterFeedback: null,
    userProfileSnap: newCandidateDetails
      ? newCandidateDetails
      : candidateDetails,
  });
  const quickApply = () => {
    setShowLoader(true);
    applyingForJob(applyForJob)
      .then((res) => {
        if (res?.status === "FAILED") {
          toaster("error", res?.message ? res?.message : SOMETHING_WENT_WRONG);
        } else if (res?.status === "SUCCESS") {
          toaster("success", res?.message ? res?.message : STATUS_SUCCESS);
          if (props?.onJobApplied) {
            props?.onJobApplied();
          }
        } else {
          toaster("error", SOMETHING_WENT_WRONG);
        }
        props.setShowQuickApplyModal2(false);
        setShowLoader(false);
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("error", err);
      });
  };

  const [jobDetails, setJobDetails] = useState({});

  useEffect(() => {
    if (props.isModalCheck)
      setLocalStorage(QUICKAPPLYMODALSHOW, props.isModalCheck);
  }, [props.isModalCheck]);

  const onModalShow = () => {
    setShowLoader(true);
    fetchJobDetails(Number(props.id))
      .then((res) => {
        setShowLoader(false);
        if (res.status === 200) {
          setJobDetails(res.data.data);
          // if (props?.refererId != null) {
          //   setApplyForJob({
          //     ...applyForJob,
          //     referalId: props?.refererId,
          //   });
          // }
        } else {
          if (res?.data?.message) {
            toaster("error", res?.data?.message);
          }
        }
      })
      .catch((err) => {
        setShowLoader(false);
        // toaster("error", err);
      });
  };

  useEffect(() => {
    if (props.modalShow) {
      onModalShow();
    }
  }, [props.modalShow]);

  useEffect(() => {
    if (props?.openReviewApplicationModal) {
      onReviewApplicationPress();
      onModalShow();
      if (props?.setOpenReviewApplicationModal) {
        props?.setOpenReviewApplicationModal(false);
      }
    }
  }, [props?.openReviewApplicationModal]);

  const onReviewApplicationPress = () => {
    setShow(true);
    props.setModalShow(false);
  };

  return (
    <div>
      {showLoader && <Loader />}
      <Modal
        show={props?.modalShow}
        onHide={() => props.setModalShow(false)}
        size="lg"
        id="quickapply"
        className="border-radius-16"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0 d-flex justify-content-end">
          <img
            className="pointer"
            src={close}
            alt="close-icon"
            onClick={() => props.setModalShow(false)}
          />
        </Modal.Header>

        <Modal.Body className="px-5 pt-0 scrolling-dialog">
          <div>
            <h4 className="banner-text fs-24 m-0 mb-4 mt-0"> Quick Apply</h4>
            <div className="d-flex align-items-center">
              <div>
                {/* <img
                  src={`data:image/jpeg;base64 , ${jobDetails?.companyProfile?.companyLogo}`}
                  height="40"
                  width="40"
                  className="bg-white p-2 border border-radius"
                /> */}
                {(jobDetails?.companyProfile?.companyLogo ||
                  jobDetails?.companyProfile?.companyName) && (
                  <CompanyImage
                    src={jobDetails?.companyProfile?.companyLogo}
                    // height="60px"
                    width="60px"
                    name={jobDetails?.companyProfile?.companyName}
                    initialsContainerClass="initialsStyle2-xl bg-white p-2 border-1px solid gray border-radius"
                  />
                )}
              </div>

              <div className="ps-3">
                <span className="font-medium-gray fs-12">
                  {jobDetails?.companyProfile?.companyName}
                </span>
                <p className="big-font-gray fs-14 fw-600">
                  {jobDetails?.jobTitle}
                </p>
              </div>
            </div>
            <hr></hr>
            <div>
              <div className="d-flex">
                <div className="">
                  <img src={caution} alt="caution-icon" />
                </div>
                <div className="ps-3 font-medium-gray fs-12">
                  <p>Your profile details will be shared with the employer. </p>
                  <p>You can review your application or submit directly.</p>
                </div>
              </div>
              <div className="d-flex pt-2">
                <label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={props.isModalCheck}
                    onClick={(e) => {
                      props.setIsModalCheck(e.target.checked);
                    }}
                  />
                  <span className="ps-3 fs-12">Got It. Don’t show again.</span>
                </label>
              </div>
            </div>

            <div className="d-flex flex-md-row flex-column justify-content-end mt-4 ">
              <button
                className="btn review-btn "
                onClick={() => {
                  onReviewApplicationPress();
                }}
              >
                {" "}
                Review Application{" "}
              </button>

              <button
                className="btn review-btn submit-btn ms-md-3 mt-3 mt-md-0"
                onClick={() => {
                  props.setShowQuickApplyModal2(true);
                  props.setModalShow(false);
                }}
              >
                {" "}
                Submit Application{" "}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal component for apply-for-job of Button Review Application */}
      {
        <ApplyForJobDialog
          show={show}
          setShow={setShow}
          id={props.id}
          onJobSaved={() => {
            if (props.onJobSaved) {
              props?.onJobSaved();
            }
          }}
          onJobApplied={() => {
            if (props?.onJobApplied) {
              props?.onJobApplied();
            }
          }}
          jobDetails={jobDetails}
          backBtnClicked={backBtnClicked}
          setBackBtnClicked={setBackBtnClicked}
          saveToProfile={saveToProfile}
          setSaveToProfile={setSaveToProfile}
          saveToProfileCheck={saveToProfileCheck}
          setSaveToProfileCheck={setSaveToProfileCheck}
          setIsMandatory={setIsMandatory}
          refererId={props?.refererId}
        />
      }{" "}
      {/* Modal for Submit application */}
      <Modal
        show={props.showQuickApplyModal2}
        onHide={() => props.setShowQuickApplyModal2(false)}
        size="lg"
        fullscreen="lg-down"
        className="lg-dialog-modal"
        aria-labelledby="example-custom-modal-styling-title"
        scrollable={true}
      >
        <Modal.Header className="border-0 m-1">
          <Modal.Title id="example-custom-modal-styling-title">
            <img
              onClick={() => {
                props.setShowQuickApplyModal2(false);
                setNewCandidateDetails({});
              }}
              src={close}
              alt="close-icon"
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round position-absolute end-0 me-3 pointer"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="scrolling-dialog">
          <QuickApplyResumeSelection
            jobDetails={jobDetails}
            id={props?.id}
            isMandatory={isMandatory}
            applyForJob={applyForJob}
            setApplyForJob={setApplyForJob}
            setIsMandatory={setIsMandatory}
            setIsResumeSelected={setIsResumeSelected}
            isResumeSelected={isResumeSelected}
            onJobSaved={() => {
              if (props?.onJobSaved) {
                props?.onJobSaved();
              }
            }}
            newCandidateDetails={newCandidateDetails}
            setNewCandidateDetails={setNewCandidateDetails}
          />
        </Modal.Body>
        <Modal.Footer className="modal-dialog-footer">
          <div className="d-flex w-100">
            <div className="col-lg-8 col-0"></div>
            <div className="col-lg-4 col-12 ">
              <Button
                className="btn-rounded btn-primary w-100"
                onClick={quickApply}
                disabled={isMandatory || !isResumeSelected ? true : false}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuickApplyJob;
