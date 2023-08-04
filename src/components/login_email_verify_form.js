import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RESEND_OTP_WAIT_TIME_IN_SECONDS } from "../constants/config";
import { SOMETHING_WENT_WRONG } from "../constants/keys";
import { INVALID_EMAIL_OTP, VALID_EMAIL_OTP } from "../constants/message";
import toaster from "../utils/toaster";
import {
  GenerateOtp,
  OtpVerification,
} from "../_services/member-profile.service";
import InputOtp from "./input_otp";

const LoginEmailVerifyForm = (props) => {
  const navigate = useNavigate();

  const [otpResendRequired, setOtpResendRequired] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [count, setCount] = useState(RESEND_OTP_WAIT_TIME_IN_SECONDS);
  const [otpEmail, setOtpEmail] = useState("");
  const [firstTime, setFirstTime] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [isEmailVerificationSuccessful, setIsEmailVerificationSuccessful] =
    useState(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const refTime = useRef(null);

  useEffect(() => {
    if (otpEmail?.length === 4) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [otpEmail]);

  const startTimer = () => {
    refTime.current = window.setInterval(() => {
      setCount((time) => time - 1);
    }, 1000);
    return () => clear();
  };

  useEffect(() => {
    sendEmailOtp();
    startTimer();
  }, []);

  useEffect(() => {
    if (count === 0) {
      clear();
      refTime.current = null;
      setOtpResendRequired(true);
      // setSubmitButton("Resend OTP");
    }
  }, [count]);

  const clear = () => [window.clearInterval(refTime.current)];

  const verifyOtpEmail = () => {
    OtpVerification(props?.email, refNumber, otpEmail, "email")
      .then((responseEmail) => {
        if (responseEmail?.data?.verifyStatus === true) {
          setIsEmailVerificationSuccessful(true);
          navigate("/candidate");
        } else {
          setIsEmailVerificationSuccessful(false);
          setInvalidEmailMessage(true);
          setOtpEmail("");
        }

        setShowLoader(false);
      })
      .catch((err) => {
        setOtpEmail("");
        setShowLoader(false);
        setInvalidEmailMessage(true);
        setIsEmailVerificationSuccessful(false);
      });
  };

  const sendEmailOtp = () => {
    if (!isEmailVerificationSuccessful) {
      GenerateOtp(props?.email, "EMAIL")
        .then((res) => {
          setShowLoader(false);
          if (res?.data?.refNumber) {
            if (!firstTime) {
              setCount(RESEND_OTP_WAIT_TIME_IN_SECONDS);
              startTimer();
            }
            setRefNumber(res?.data?.refNumber);
            setOtpResendRequired(false);
            toaster("success", "OTP sent to Email");
          } else {
            toaster("error", SOMETHING_WENT_WRONG);
            setOtpResendRequired(true);
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", SOMETHING_WENT_WRONG);
          setOtpResendRequired(true);
        });
    }
    setFirstTime(false);
  };

  return (
    <>
      <div className="heading1">Verify your Email </div>
      <div className="mt-5">
        <div className="form-row">
          <label className="form-label">Email Verification Code</label>
          <div className="form-control-hints my-1">
            {otpResendRequired ? "" : `sent to ${props?.email}`}
          </div>
          <InputOtp
            otp={otpEmail}
            setOtp={setOtpEmail}
            isInputNum={false}
            isDisabled={isEmailVerificationSuccessful}
          />
          <div style={{ marginTop: -20 }}>
            {!isEmailVerificationSuccessful && invalidEmailMessage ? (
              <div className="text-danger fs-12">{INVALID_EMAIL_OTP}</div>
            ) : (
              ""
            )}
          </div>
          <div style={{ marginTop: -20 }}>
            {isEmailVerificationSuccessful && (
              <div className="text-success fs-12">{VALID_EMAIL_OTP}</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div
            onClick={() => {
              if (count === 0) {
                sendEmailOtp();
              } else {
                return;
              }
            }}
            className={`text-black otp-counter mt-5 mb-4 text-center ${
              otpResendRequired
                ? "text-decoration-underline pointer otp-resend-link"
                : ""
            }`}
          >
            {otpResendRequired ? "Resend code" : `Resend code in ${count}s`}
          </div>
        </div>

        <div className="d-flex justify-content-center flex-column flex-sm-row flex-lg-column flex-xl-row align-items-center">
          <p
            onClick={() => {
              props?.setVerificationNeeded(false);
            }}
            to=""
            className="pointer me-4 fs-16 fw-700 text-underline color-primary link"
          >
            Login With Phone Number
          </p>
          <Button
            disabled={disableButton}
            type="button"
            onClick={() => {
              verifyOtpEmail();
            }}
            className="btn-rounded btn-primary verify-btn mt-3 mt-sm-0 mt-lg-3 mt-xl-0"
          >
            Verify and Log In
          </Button>
        </div>
      </div>
    </>
  );
};
export default LoginEmailVerifyForm;
