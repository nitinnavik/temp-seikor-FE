import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderTwo from "../components/common/headerTwo";
import whiteTick from "../../src/assests/icons/ic_done_white.svg";
import {
  changePassword,
  emailValidation,
  MailValid,
  retrievePassword,
} from "../_services/candidate.service";
import {
  ALPHABET_CHECK,
  EMAIL_PATTERN,
  FORM_VALIDATION_MESSAGE,
  getPhoneNumberPattern,
  LOGIN,
  pattern,
  PHONE_CHECK,
  PHONE_NUMBER_PATTERN,
  REQUIRED,
} from "../constants/keys";
import {
  disableShouldErrorShow,
  enableShouldErrorShow,
  initialiseFormData,
  onFormFeildsChange,
  validateField,
} from "../utils/form_validators";
import toaster from "../utils/toaster";
import Loader from "../components/common/loader";
import ForgetPasswordLinkPage from "./forget_password_link_page";
import { UserName } from "../_services/view.service";
import AccountCreateNewPassword from "../components/account_create_new_password";
import { checkPhoneNumberValid } from "../utils/utils";
import { RESET_PASSWORD_LINK_SUCCESS } from "../constants/message";
const ForgetPasswordPage = (props) => {
  const [formData, setFormData] = useState({
    email: {
      valueText: "",
      initial: "",
      errorText: "",
      check: [REQUIRED, EMAIL_PATTERN, PHONE_CHECK],
    },
  });
  const [error, setError] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [token, settoken] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const submitFormOnEnter = (e) => {
    if (e?.keyCode == 13) {
      if (formData?.email?.errorText == "") {
        sendLink();
      }
    }
  };

  const sendLink = () => {
    let emailValid = true;
    if (ALPHABET_CHECK.test(formData?.email?.valueText)) {
      emailValid = validateField("email", formData, setFormData);
    }
    if (emailValid) {
      setShowLoader(true);
      retrievePassword(formData?.email?.valueText)
        .then((res) => {
          setShowLoader(false);
          if (res.data.status === "SUCCESS") {
            settoken(res.data.data.refNumber);
            setResetLinkSent(true);
            initialiseFormData(formData, setFormData);
            toaster("success", RESET_PASSWORD_LINK_SUCCESS);
          } else {
            toaster("error", res.data.message);
            setResetLinkSent(false);
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
          setResetLinkSent(false);
        });
    }
  };

  return (
    <div className="h-100 w-100">
      {showLoader && <Loader />}
      <HeaderTwo />
      <div className="container h-100">
        {resetLinkSent ? (
          <div
            className="card text-white bg-success mb-3"
            style={{ maxWidth: "300px", height: "300px", margin: "30px auto" }}
          >
            <div className="d-flex flex-column card-body align-items-center justify-content-center">
              <p className="mb-2">
                <div className="reset-pswd-success text-center">
                  <img style={{ width: "30px" }} src={whiteTick} />
                </div>
              </p>
              <p className="fw-700 fs-24 mb-3">Success</p>
              <p className="card-text text-center">
                {RESET_PASSWORD_LINK_SUCCESS}
              </p>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center non-found-height px-4">
            <div className=" ">
              <h4 className="heading1 fs-4">
                {props.changePassword ? "Change " : "Retrieve "} Your Password{" "}
              </h4>
              <br />
              <span className="text-secondary fs-6">
                Enter Your Registered Email or Phone Number
              </span>
              <br />
              <br />
              <br />
              <span className="m-0 mt-3 email-font">
                <b>Email / Phone Number</b>
              </span>
              <input
                type="text"
                // className="w-100 form-control error"
                className={
                  (formData?.email?.errorText &&
                  formData?.email?.shouldShowError
                    ? "error"
                    : "") + "  form-control"
                }
                name="email"
                // defaultValue={formData?.email?.valueText}
                value={formData?.email?.valueText}
                onKeyDown={(e) => {
                  submitFormOnEnter(e);
                }}
                onBlur={($event) => {
                  enableShouldErrorShow($event, formData, setFormData);
                }}
                onFocus={($event) => {
                  disableShouldErrorShow($event, formData, setFormData);
                }}
                onChange={($event) => {
                  onFormFeildsChange($event, formData, setFormData);

                  if (!ALPHABET_CHECK.test(formData?.email?.valueText)) {
                    const isPhoneNumberValid = checkPhoneNumberValid(
                      $event?.target?.value
                    );
                    let copyFormData = { ...formData };
                    if (!isPhoneNumberValid) {
                      copyFormData.email.errorText =
                        FORM_VALIDATION_MESSAGE.PHONE;
                      setFormData(copyFormData);
                    } else {
                      copyFormData.email.errorText = "";
                      setFormData(copyFormData);
                    }
                  }
                }}
                required
              />
              {/* <ForgetPasswordLinkPage emailvalue={formData.email.valueTex} /> */}
              {formData?.email?.shouldShowError && (
                <div className="field-error mt-1">
                  {formData?.email?.shouldShowError
                    ? formData?.email?.errorText
                    : ""}
                </div>
              )}
              {/* <div className="field-error mt-1">Invalid Id</div> */}
              <div className="text-secondary fs-16 pt-3">
                {" "}
                A link to reset password will be sent{" "}
                {/* <Link to="/forget-password-link"> </Link> */}
              </div>
              <br />
              <br />
              <br />

              {/* <input
              type="button"
              className="btn-rounded btn-primary w-100"
              onClick={() => {
                sendLink();
              }}
              value="Send Reset Link"
            />{" "} */}

              {!props.changePassword ? (
                // <Link to="/forget-password-link">// </Link>
                <div>
                  <input
                    type="button"
                    className="btn-rounded btn-primary w-100"
                    onKeyDown={(e) => {
                      submitFormOnEnter(e);
                    }}
                    onClick={() => {
                      if (formData?.email?.errorText == "") {
                        sendLink();
                      }
                    }}
                    value="Send Reset Link"
                  />{" "}
                </div>
              ) : null}
              {props.changePassword ? (
                <div>
                  <input
                    type="button"
                    className="btn-rounded btn-primary w-100"
                    value="Send Reset Link"
                    onClick={() => setShowPasswordModal(true)}
                  />
                  <AccountCreateNewPassword
                    show={showPasswordModal}
                    onModalClose={() => setShowPasswordModal(false)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
