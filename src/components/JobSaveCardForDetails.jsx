import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import IcDoneWhite from "../assests/icons/ic_done_white.svg";
import { LOGIN, REGISTRATION, TOKEN } from "../constants/keys";
import {
  GENERAL_ERROR_MESSAGE,
  JOB_SAVED_SUCCESS,
  JOB_SAVE_REFERRAL,
  JOB_UNSAVED_SUCCESS,
} from "../constants/message";
import { getLocalStorage } from "../utils/storage";
import toaster from "../utils/toaster";
import { updateSavedAndPinJob } from "../_services/job.service";
import Loader from "./common/loader";
import { useStoreActions } from "easy-peasy";
import { Modal } from "react-bootstrap";

const JobSaveCardForDetails = (props) => {
  const [showNonLoginUserDailog, setShowNonLoginUserDailog] = useState();
  const [isSavedJob, setIsSavedJob] = useState();
  const [isReferer, setIsReferer] = useState();
  const [forApplying, setForApplying] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const setNonLoginSaveForApplying = useStoreActions(
    (actions) => actions.setNonLoginSaveForApplying
  );

  const callsaveUnsaveApi = (isSave, isRefer) => {
    setShowLoader(true);

    if (token) {
      updateSavedAndPinJob(props?.jobId, isSave, isRefer, false)
        .then((res) => {
          setShowLoader(false);
          if (isSavedJob === false && res?.isSave === true) {
            toaster("success", JOB_SAVED_SUCCESS);
            setIsSavedJob(true);
            if (props?.onJobSaved) {
              props?.onJobSaved();
            }
          } else if (isReferer === false && res?.isReferrer === true) {
            toaster("success", JOB_SAVED_SUCCESS);
            setIsReferer(true);
            if (props?.onJobSaved) {
              props?.onJobSaved();
            }
          } else if (isSavedJob === true && res?.isSave === false) {
            setIsSavedJob(false);
            toaster("success", JOB_UNSAVED_SUCCESS);
          } else if ((isReferer === true && res?.isReferrer) === false) {
            setIsReferer(false);
            toaster("success", JOB_UNSAVED_SUCCESS);
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("Error", err);
        });
    } else {
      setShowNonLoginUserDailog(true);
      setNonLoginSaveForApplying({
        jobId: props?.jobId,
        isSave: isSave,
        isRefer: isRefer,
        boolean: false,
      });
    }
  };

  // const onButtonClick = (isReferer, isSavedJob) => {
  //   setShowLoader(true);
  //   setIsSavedJob(isSavedJob);
  //   setIsReferer(isReferer);
  //   updateSavedAndPinJob(props?.jobId, isSavedJob, isReferer, false)
  //     .then((res) => {
  //       setShowLoader(false);
  //       if (forApplying) {
  //         if (res?.isSave) {
  //           toaster("success", JOB_SAVED_SUCCESS);
  //         } else {
  //           toaster("success", JOB_UNSAVED_SUCCESS);
  //         }
  //       } else {
  //         if (res?.isReferrer) {
  //           toaster("success", JOB_SAVED_SUCCESS);
  //         } else {
  //           toaster("success", JOB_UNSAVED_SUCCESS);
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       setShowLoader(false);
  //       toaster("Error", err?.message ? err?.message : GENERAL_ERROR_MESSAGE);
  //     });
  // };

  useEffect(() => {
    setIsSavedJob(props?.isSaved);
    setIsReferer(props?.isReferer);
  }, [props]);
  const token = getLocalStorage(TOKEN);
  const navigate = useNavigate();

  return (
    <div>
      {/* {showLoader && <Loader />} */}
      <div className="d-flex gap-2 flex-wrap">
        <div
          className="btn page-filter-button bg-white text-center d-flex justify-content-center"
          onClick={() => {
            callsaveUnsaveApi(!isSavedJob, isReferer);
            setForApplying(true);
          }}
        >
          <span
            className={
              isSavedJob == true
                ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                : "d-none"
            }
          >
            <img src={IcDoneWhite} alt="whitedone-icon" />
          </span>
          Save For Applying
        </div>
        <div
          className="btn page-filter-button bg-white text-center d-flex justify-content-center"
          onClick={() => {
            callsaveUnsaveApi(isSavedJob, !isReferer);
            setForApplying(false);
          }}
        >
          <span
            className={
              isReferer == true
                ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                : "d-none"
            }
          >
            <img src={IcDoneWhite} alt="whitedone-icon" />
          </span>
          Save For Referring
        </div>
      </div>
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
            Log in or register to save your application
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
    </div>
  );
};

export default JobSaveCardForDetails;
