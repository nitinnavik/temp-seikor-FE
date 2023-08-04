import ApplyForJob from "./ApplyForJob";
import { useEffect, useState } from "react";
import ApplyForJobQuestions from "./ApplyForJobQuestions";
import { Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import disabled from "../assests/icons/ic_disabled.svg";
import close from "../assests/icons/ic-close-24.svg";
import toaster from "../utils/toaster";
import { applyingForJob } from "../_services/member-profile.service";
import {
  LOGIN,
  REGISTRATION,
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
  TOKEN,
} from "../constants/keys";
import { STATUS_FAILED, SUCCESSFULLY_APPLIED_JOB } from "../constants/message";
import { useStoreState, useStoreActions } from "easy-peasy";
import { USER_ID } from "../constants/keys";
import { getLocalStorage } from "../utils/storage";
import Loader from "./common/loader";
import { useRef } from "react";
import { isEmpty } from "../utils/form_validators";
import NonLoginUserApplyForJobQuestions from "./NonLoginUserApplyForJobQuestions";

const ApplyForJobDialog = (props) => {
  const navigate = useNavigate();
  const token = getLocalStorage(TOKEN);

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const isApplyingWithOutLogin = useStoreState(
    (state) => state?.isApplyingWithOutLogin
  );
  const setIsApplyingWithOutLogin = useStoreActions(
    (actions) => actions?.setIsApplyingWithOutLogin
  );
  const applyForJobNonLoginUser = useStoreState(
    (state) => state?.applyForJobNonLoginUser
  );
  const setApplyForJobNonLoginUser = useStoreActions(
    (actions) => actions.setApplyForJobNonLoginUser
  );
  const currentJobDetails = useStoreState((state) => state?.currentJobDetails);
  const isReferringFromDetailsWithOutLogin = useStoreState(
    (actions) => actions?.isReferringFromDetailsWithOutLogin
  );

  const setTempQuestions = useStoreActions(
    (actions) => actions?.setTempQuestions
  );

  const [showLoader, setShowLoader] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const [isResumeSelected, setIsResumeSelected] = useState(false);
  const [isPageShow, setIsPageShow] = useState(true);
  const [newCandidateDetails, setNewCandidateDetails] = useState({});
  const [showNonLoginUserDailog, setShowNonLoginUserDailog] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const setCurrentJobDetails = useStoreActions(
    (action) => action.setCurrentJobDetails
  );                           
  const [applyForJob, setApplyForJob] = useState({
    jobId: Number(props?.id),
    referalId: props?.refererId ? props?.refererId : null,
    resumeId: 0,
    jobAnswers: [],
    isMandatory: true,
    userProfileSnap: newCandidateDetails
    ? newCandidateDetails
    : candidateDetails,
  });

  const modalBodyRef = useRef();
  useEffect(() => {
    if (modalBodyRef) {
      modalBodyRef?.current?.focus();
    }
  }, [isPageShow, newCandidateDetails]);
  useEffect(() => {
    if (props?.refereeId) {
      setApplyForJob({ ...applyForJob, referalId: Number(props?.refereeId) });
    }
  }, [props]);

  useEffect(() => {
    const userId = getLocalStorage(USER_ID);
    saveCandidateDetails(userId);
    if (!token) {
      setIsApplyingWithOutLogin(true);
    }
  }, []);

  useEffect(() => {
    if (isApplyingWithOutLogin) {
      if (applyForJobNonLoginUser) {
        setApplyForJob(applyForJobNonLoginUser);
      }
    }
  }, [applyForJobNonLoginUser]);

  useEffect(() => {
    if (token) {
      setNewCandidateDetails(candidateDetails);
    }
  }, [candidateDetails]);

  useEffect(() => {
    setApplyForJob({
      ...applyForJob,
      userProfileSnap: newCandidateDetails,
    });
    
  }, [newCandidateDetails]);

  const applyJobApiCall = () => {
    if (token) {
      if (isDisabled) {
        applyingForJob(applyForJob)
          .then((res) => {
            if (res?.status === STATUS_FAILED) {
              toaster(
                "error",
                res?.message ? res?.message : SOMETHING_WENT_WRONG
              );
            } else if (res?.status === STATUS_SUCCESS) {
              toaster(
                "success",
                res?.message ? res?.message : SUCCESSFULLY_APPLIED_JOB
              );
              if (props?.onJobSaved) {
                props?.onJobSaved();
              }
              if (props?.getJobDetails) {
                props?.getJobDetails();
              }
              if (props?.onJobApplied) {
                props?.onJobApplied();
              }
            } else {
              toaster("error", SOMETHING_WENT_WRONG);
            }
            props.setShow(false);
            setApplyForJobNonLoginUser(null);
            setTempQuestions(null);
          })
          .catch((err) => {
            console.log(err);
            setApplyForJobNonLoginUser(null);
            setTempQuestions(null);
            toaster(
              "error",
              err?.message ? err?.message : SOMETHING_WENT_WRONG
            );
            props.setShow(false);
          });
      }
    } else {
      setApplyForJobNonLoginUser(applyForJob);
    }
    setIsPageShow(true);
  };

  const popupPageHandler = () => {
    setIsPageShow(false);
    applyJobApiCall();
    setShowLoader(false);
  };
  const [mainModalDisplay, setMainModalDisplay] = useState("d-block");
  const [hideMainModal, setHideMainModal] = useState(false);

  useEffect(() => {
    if (hideMainModal) {
      setMainModalDisplay("d-none");
    } else {
      setMainModalDisplay("d-block");
    }
  }, [hideMainModal]);

  useEffect(() => {
    if (isPageShow && newCandidateDetails?.userResumeResponse?.length > 0) {
      setIsDisabled(true);
    }
  }, [applyForJob, newCandidateDetails]);
  useEffect(() => {
    if (applyForJobNonLoginUser) {
      setApplyForJob(applyForJobNonLoginUser);
    }
  }, [applyForJobNonLoginUser]);

  useEffect(() => {
    if (isResumeSelected)
    {
      setIsDisabled(true);
    }
  },[isResumeSelected])
 
  return (
    <>
      {showLoader && <Loader />}
      {/* Modal component for apply-for-job */}
      <Modal
        fullscreen="lg-down"
        show={props.show}
        onHide={() => {
          props.setShow(false);
        }}
        aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        scrollable={true}
        className={`lg-dialog-modal ${mainModalDisplay}`}
      >
        <Modal.Header className="m-1 justify-content-end border-0 pb-0">
          <img
            onClick={() => {
              props.setShow(false);
              if (token && isApplyingWithOutLogin) {
                setIsApplyingWithOutLogin(false);
                setApplyForJobNonLoginUser();
                setCurrentJobDetails();
                setTempQuestions();
              }
            }}
            src={close}
            alt="close-icon"
            className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 pointer"
          />
        </Modal.Header>
        <Modal.Body
          ref={modalBodyRef}
          style={{ outline: "none" }}
          tabIndex="-1"
          className="scrolling-dialog pt-0"
        >
          {isPageShow ? (
            <ApplyForJob
              jobDetails={props?.jobDetails}
              applyForJob={applyForJob}
              setApplyForJob={setApplyForJob}
              setIsMandatory={setIsMandatory}
              isResumeSelected={isResumeSelected}
              setIsResumeSelected={setIsResumeSelected}
              newCandidateDetails={newCandidateDetails}
              setNewCandidateDetails={setNewCandidateDetails}
              backBtnClicked={props?.backBtnClicked}
              setBackBtnClicked={props?.setBackBtnClicked}
              saveToProfile={props?.saveToProfile}
              setSaveToProfile={props?.setSaveToProfile}
              saveToProfileCheck={props?.saveToProfileCheck}
              setSaveToProfileCheck={props?.setSaveToProfileCheck}
              mainModalDisplay={mainModalDisplay}
              setMainModalDisplay={setMainModalDisplay}
              hideMainModal={hideMainModal}
              setHideMainModal={setHideMainModal}
              setIsMandatory2={props?.setIsMandatory}
            />
          ) : applyForJobNonLoginUser ? (
            <NonLoginUserApplyForJobQuestions
              applyForJob={applyForJob}
              setApplyForJob={setApplyForJob}
              setIsMandatory={setIsMandatory}
              isMandatory={isMandatory}
              isResumeSelected={isResumeSelected}
              setIsDisabled={setIsDisabled}
              setIsMandatory2={props?.setIsMandatory}
            />
          ) : (
            <ApplyForJobQuestions
              jobDetails={props?.jobDetails}
              applyForJob={applyForJob}
              setApplyForJob={setApplyForJob}
              setIsMandatory={setIsMandatory}
              isMandatory={isMandatory}
              isResumeSelected={isResumeSelected}
              setIsDisabled={setIsDisabled}
              setIsMandatory2={props?.setIsMandatory}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="modal-dialog-footer">
          <div className="d-flex  w-100 align-items-center flex-wrap justify-content-between">
            <div
              className={
                isPageShow
                  ? "col-md-6 col-sm-4 col-3"
                  : "col-md-6 col-sm-4 col-6"
              }
            >
              <div className="d-flex gap-md-3 gap-sm-2 gap-1 align-items-center">
                <div className={isPageShow ? "order-first" : "order-last"}>
                  <button className="btn-primary rounded-pill ps-3 pe-3 text-light quick-apply-review-blue-btn">
                    {isPageShow ? "1/2" : "2/2"}
                  </button>
                </div>
                <div>
                  <img
                    src={disabled}
                    alt="disabled-page-btn"
                    onClick={() => {
                      if (isPageShow) {
                        if (
                          !newCandidateDetails?.userResumeResponse?.length > 0
                        ) {
                          setIsDisabled(false);
                          toaster("error", "Please fill mandatory fields");
                        } else {
                          setIsPageShow(false);
                        }
                      } else {
                        setIsPageShow(true);
                      }
                    }}
                    className="pointer"
                  />
                </div>
              </div>
            </div>
            <div className={isPageShow ? "col-2" : "col-sm-2 col-6"}>
              <div className="d-flex justify-content-end">
                {isPageShow ? (
                  ""
                ) : (
                  <button
                    className="btn text-decoration-underline fw-700 fs-14 "
                    onClick={() => {
                      setIsPageShow(true);
                      props?.setBackBtnClicked(true);
                      if (newCandidateDetails?.userResumeResponse?.length > 0) {
                        setIsDisabled(true);
                      } else {
                        setIsDisabled(false);
                      }
                    }}
                  >
                    {" "}
                    Back{" "}
                  </button>
                )}
              </div>
            </div>

            <div
              className={
                isPageShow
                  ? "col-md-4 col-sm-6 col-7"
                  : "col-md-4 col-sm-6 col-12 mt-3 mt-sm-0"
              }
            >
              <div className="d-flex justify-content-end">
                <Button
                  className="btn-rounded btn-primary w-100"
                  onClick={() => {
                    if (!isPageShow) {
                      setShowLoader(true);
                      setTimeout(() => {
                        popupPageHandler();
                      }, 1000);
                    } else {
                      setIsPageShow(false);
                    }
                    if (!token && !isPageShow) {
                      props.setShow(false);
                      setShowNonLoginUserDailog(true);
                    }

                    if (props?.saveToProfileCheck) {
                      props?.setSaveToProfile(true);
                    }
                  }}
                  disabled={!isDisabled}
                >
                  {isPageShow ? " Continue " : " Submit Application "}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNonLoginUserDailog}
        backdrop="static"
        // fullscreen="lg-down"
        keyboard={false}
        centered
        onHide={() => {
          setShowNonLoginUserDailog(false);
        }}
      >
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">
            Log in or register to submit your application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          {/* You need to signup with us to apply for this job. */}
        </Modal.Body>
        <Modal.Footer className="dialog-footer justify-content-between">
          <button
            // style={{ border: "1px solid black" }}
            className="btn btn-cancel"
            onClick={() => {
              setShowNonLoginUserDailog(false);
              navigate(`/${REGISTRATION}`);
            }}
          >
            Register
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              setShowNonLoginUserDailog(false);
              navigate(`/${LOGIN}`);
            }}
          >
            Log in
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ApplyForJobDialog;
