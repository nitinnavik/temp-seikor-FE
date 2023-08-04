import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { onFormFeildsChange } from "../utils/form_validators";
import {
  GenerateOtp,
  OtpVerification,
  UpdateMailNumber,
  updateMobile,
} from "../_services/member-profile.service";
import { validateField } from "../utils/form_validators";
import InputOtp from "./input_otp";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import { STATUS_SUCCESS, USER_ID } from "../constants/keys";
import { useStoreActions, useStoreState } from "easy-peasy";
import { logout } from "../_services/auth.service";
import { useNavigate } from "react-router";
import { LOGIN_PAGE_ROUTE } from "../constants/page-routes";
import { RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS } from "../constants/config";
import {
  DETAILS_UPDATED,
  ENTER_VALID_PHONE_OTP,
  GENERAL_ERROR_MESSAGE,
  INVALID_EMAIL_OTP,
  INVALID_INPUT,
  INVALID_PHONE_OTP,
} from "../constants/message";

const VerifyOtpNumDialog = (props) => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [count, setCount] = useState(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
  const [otpResendRequired, setOtpResendRequired] = useState(false);
  const [triggerTimer, setTriggerTimer] = useState(false);
  const [invalidPhoneMessage, setInvalidPhoneMessage] = useState(false);

  const refTime = useRef(null);

  useEffect(() => {
    if (!props.firstTime[0]) {
      startTimer();
    }
  }, [triggerTimer, props?.firstTime[0]]);

  useEffect(() => {
    if (count === 0) {
      clear();
      refTime.current = null;
      setOtpResendRequired(true);
    }
  }, [count]);

  const startTimer = () => {
    refTime.current = window.setInterval(() => {
      setCount((time) => time - 1);
    }, 1000);
    return () => clear();
  };

  const clear = () => [window.clearInterval(refTime.current)];

  const resendOtp = () => {
    props?.setShowLoader(true);

    setCount(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
    startTimer();

    GenerateOtp(
      props?.numData?.mobile?.valueText,
      "SMS",
      candidateDetails?.userRegistrationDetails?.mobile
    )
      .then((res) => {
        console.log("Response", res);
        props?.setShowLoader(false);
        props?.setRefNumber(res?.data?.refNumber);
        toaster("success", "OTP sent successfully!");
        setOtpResendRequired(false);
        setTriggerTimer(!triggerTimer);
      })
      .catch((err) => {
        props?.setShowLoader(false);
        toaster("error", "Technical Error, please try again");
      });
    props?.setShowLoader(false);
  };

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const onVerifyNum = () => {
    if (
      validateField("mobile", props?.numData, props?.setNumData) &&
      props?.refNumber
    ) {
      setOtp("");
      props?.setShowLoader(true);
      if (props?.isApplyForJobComponent && !props.isCheck) {
        props?.setNewCandidateDetails({
          ...props?.newCandidateDetails,
          userRegistrationDetails: {
            ...props?.newCandidateDetails?.userRegistrationDetails,
            mobile: props?.numData?.mobile?.valueText,
          },
        });
        props?.setShow(false);
        props?.setShowLoader(false);
        if (props?.setHideMainModal) {
          props?.setHideMainModal(false);
        }
      } else {
        OtpVerification(
          props?.numData?.mobile?.valueText,
          props?.refNumber,
          otp,
          "mobile",
          candidateDetails?.userRegistrationDetails?.mobile
        )
          .then((res) => {
            if (res?.data?.verifyStatus) {
              // updateMobile(props?.numData?.mobile?.valueText)
              //   .then((response) => {
              //     if (response?.data?.status == STATUS_SUCCESS) {
              //       props?.setShow(false);
              //       if (props?.setHideMainModal) {
              //         props?.setHideMainModal(false);
              //       }
              //       props?.firstTime[1](true);
              //       logout();
              //       navigate(LOGIN_PAGE_ROUTE);
              //       props?.setShowLoader(false);
              //       toaster("success", DETAILS_UPDATED);
              //     } else {
              //       props?.setShow(false);
              //       if (props?.setHideMainModal) {
              //         props?.setHideMainModal(false);
              //       }
              //       props?.firstTime[1](true);
              //       props?.setShowLoader(false);
              //       toaster(
              //         "error",
              //         response?.message
              //           ? response?.message
              //           : GENERAL_ERROR_MESSAGE
              //       );
              //     }
              //   })
              //   .catch((err) => {
              //     props?.setShowLoader(false);
              //     toaster(
              //       "error",
              //       err?.message ? err?.message : GENERAL_ERROR_MESSAGE
              //     );
              //     setInvalidPhoneMessage(true);
              //   });
              props?.setShow(false);
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
              props?.firstTime[1](true);
              logout();
              navigate(LOGIN_PAGE_ROUTE);
              props?.setShowLoader(false);
              toaster("success", DETAILS_UPDATED);
            } else {
              props?.setShowLoader(false);
              toaster("error", res?.message ? res?.message : INVALID_PHONE_OTP);
              setInvalidPhoneMessage(true);
            }
          })
          .catch((err) => {
            setOtp("");
            props?.setShowLoader(false);
            toaster(
              "error",
              err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            );
            setInvalidPhoneMessage(true);
          });
      }
      props?.setShowLoader(false);
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
          clear();
          setCount(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
          setOtpResendRequired(false);
          setOtp("");
        }}
        backdrop="static"
        fullscreen="lg-down"
        keyboard={false}
        centered
        className="lg-dialog-modal"
      >
        <Modal.Header closeButton className="dialog-header ">
          <Modal.Title className="dialog-title">Verify Phone No</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body mb-5">
          <div
            className="fw-400 fs-14"
            style={{
              color: "#808080",
            }}
          >
            An OTP has sent to {props?.numData?.mobile?.valueText}
          </div>
          <label className="modalLabel mt-4" style={{ color: "#3E3E3E" }}>
            Enter OTP
          </label>

          <InputOtp otp={otp} setOtp={setOtp} />
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
          {/* {invalidPhoneMessage ? (
            <div className="text-danger fs-12">{INVALID_PHONE_OTP}</div>
          ) : (
            ""
          )} */}
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            onClick={() => {
              props.setShow(false);
              clear();
              setCount(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
              setOtpResendRequired(false);
              setOtp("");
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
            }}
            className="btn btn-cancel"
          >
            Close
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              if (otp?.length === 4) {
                onVerifyNum();
              } else {
                setOtp("");
                toaster("error", ENTER_VALID_PHONE_OTP);
              }
            }}
          >
            Verify
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VerifyOtpNumDialog;
