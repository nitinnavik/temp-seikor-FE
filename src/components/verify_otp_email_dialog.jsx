import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { onFormFeildsChange } from "../utils/form_validators";
import {
  OtpVerification,
  updateEmail,
  UpdateMailNumber,
  GenerateOtp,
} from "../_services/member-profile.service";
import { validateField } from "../utils/form_validators";
import InputOtp from "./input_otp";
import toaster from "../utils/toaster";
import { clearLocalStorage, getLocalStorage } from "../utils/storage";
import { STATUS_SUCCESS, USER_ID } from "../constants/keys";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useNavigate } from "react-router";
import { LOGIN_PAGE_ROUTE } from "../constants/page-routes";
import { logout } from "../_services/auth.service";
import { RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS } from "../constants/config";
import {
  DETAILS_UPDATED,
  ENTER_VALID_EMAIL_OTP,
  GENERAL_ERROR_MESSAGE,
  INVALID_EMAIL_OTP,
} from "../constants/message";

const VerifyOtpEmailDialog = (props) => {
  const [otp, setOtp] = useState("");
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const navigate = useNavigate();

  const [count, setCount] = useState(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
  const [otpResendRequired, setOtpResendRequired] = useState(false);
  const [triggerTimer, setTriggerTimer] = useState(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState(false);

  const refTime = useRef(null);

  useEffect(() => {
    if (!props.firstTimeEmail[0]) {
      startTimer();
    }
  }, [triggerTimer, props?.firstTimeEmail[0]]);

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
      props?.emailData?.email?.valueText,
      "EMAIL",
      candidateDetails?.userRegistrationDetails?.email
    )
      .then((res) => {
        props?.setShowLoader(false);
        toaster("success", "OTP sent successfully!");
        setOtpResendRequired(false);
        props?.setRefNumber(res?.data?.refNumber);
        setTriggerTimer(!triggerTimer);
      })
      .catch((err) => {
        props?.setShowLoader(false);
        toaster("error", "Technical Error, please try again");
      });
    props?.setShowLoader(false);
  };

  const onVerify = () => {
    if (
      validateField("email", props?.emailData, props?.setEmailData) &&
      props?.refNumber
    ) {
      props?.setShowLoader(true);

      if (props?.isApplyForJobComponent && !props.isCheck) {
        props?.setNewCandidateDetails({
          ...props?.newCandidateDetails,
          userRegistrationDetails: {
            ...props?.newCandidateDetails?.userRegistrationDetails,
            email: props?.emailData?.email?.valueText,
          },
        });
        props?.setShow(false);
        props?.setShowLoader(false);
        if (props?.setHideMainModal) {
          props?.setHideMainModal(false);
        }
      } else {
        OtpVerification(
          props?.emailData?.email?.valueText,
          props?.refNumber,
          otp,
          "email",
          candidateDetails?.userRegistrationDetails?.email
        )
          .then((res) => {
            setOtp("");

            if (res?.data?.verifyStatus) {
              // updateEmail(props?.emailData?.email?.valueText)
              //   .then((response) => {
              //     if (response?.data?.data?.verifyStatus) {
              //       props?.setShow(false);
              //       props?.firstTimeEmail[1](true);
              //       logout();
              //       navigate(LOGIN_PAGE_ROUTE);
              //       props?.setShowLoader(false);
              //       toaster("success", DETAILS_UPDATED);
              //     } else {
              //       props?.setShow(false);
              //       props?.firstTimeEmail[1](true);
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
              //     toaster(
              //       "error",
              //       err?.message ? err?.message : GENERAL_ERROR_MESSAGE
              //     );
              //     setInvalidEmailMessage(true);
              //   });
              props?.setShow(false);
              props?.firstTimeEmail[1](true);
              logout();
              navigate(LOGIN_PAGE_ROUTE);
              props?.setShowLoader(false);
              toaster("success", DETAILS_UPDATED);
            } else {
              props?.setShowLoader(false);
              toaster("error", res?.message ? res?.message : INVALID_EMAIL_OTP);
              setInvalidEmailMessage(true);
            }
          })
          .catch((err) => {
            // setOtp("");
            // props?.setShowLoader(false);
            // toaster(
            //   "error",
            //   err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            // );
            // setInvalidEmailMessage(true);
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
          props?.setShow(false);
          clear();
          setCount(RESEND_OTP_ON_EDIT_WAIT_TIME_IN_SECONDS);
          setOtpResendRequired(false);
          setOtp("");
          if (props?.setHideMainModal) {
            props?.setHideMainModal(false);
          }
        }}
        backdrop="static"
        fullscreen="lg-down"
        keyboard={false}
        centered
        className="lg-dialog-modal"
      >
        <Modal.Header closeButton className="dialog-header ">
          <Modal.Title className="dialog-title">Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body mb-5">
          <div
            className="fw-400 fs-14"
            style={{
              color: "#808080",
            }}
          >
            An OTP has sent to {props.emailData.email.valueText}
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
          {/* {invalidEmailMessage ? (
            <div className="text-danger fs-12">{INVALID_EMAIL_OTP}</div>
          ) : (
            ""
          )} */}
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            onClick={() => {
              props?.setShow(false);
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
            Cancel
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              if (otp?.length === 4) {
                onVerify();
              } else {
                setOtp("");
                toaster("error", ENTER_VALID_EMAIL_OTP);
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
export default VerifyOtpEmailDialog;
