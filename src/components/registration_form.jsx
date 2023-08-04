import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  onFormFeildsChange,
  validateField,
  validateForm,
  isPasswordValid,
  enableShouldErrorShow,
  disableShouldErrorShow,
} from "../utils/form_validators";
import {
  registerCandiate,
  emailValidation,
  mobileValidation,
  getCountryMaster,
} from "../_services/candidate.service";
import { GenerateOtp } from "../_services/member-profile.service";
import toaster from "../utils/toaster";
import Loader from "./common/loader";
import PrivacyPolicyDialog from "./privacy_policy_dialog";
import {
  ALPHABET_CHECK,
  EMAIL_PATTERN,
  FORM_VALIDATION_MESSAGE,
  getPhoneNumberPattern,
  NAME_PATTERN,
  PASSWORD,
  PASSWORD_PATTERN,
  PHONE_CHECK,
  PHONE_NUMBER_PATTERN,
  REGISTRATION,
  SPECIAL_CHARS_PATTERN,
  STATUS_SUCCESS,
} from "../constants/keys";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { checkPhoneNumberValid } from "../utils/utils";

const RegistrationForm = ({ verificationNeeded, ...props }) => {
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setFormData] = useState({
    firstname: {
      valueText: "",
      errorText: "",
      check: ["required"],
      shouldShowError: false,
    },
    lastname: {
      valueText: "",
      errorText: "",
      check: ["required"],
      shouldShowError: false,
    },
    email: {
      valueText: "",
      errorText: "",
      check: ["required", EMAIL_PATTERN],
      shouldShowError: false,
    },

    countrycode: {
      valueText: "+91",
      errorText: "",
      check: ["required"],
      shouldShowError: false,
    },
    phonenumber: {
      valueText: "",
      errorText: "",
      check: ["required"],
      shouldShowError: false,
    },
    password: {
      valueText: "",
      errorText: "",
      check: ["required", PASSWORD],
      shouldShowError: false,
    },
    privacy: { valueText: false, errorText: "", check: [""] },
  });
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(<FaEyeSlash />);

  const togglePasswordVisiblity = () => {
    if (isPasswordShown === "password") {
      setIsPasswordShown("text");
      setPasswordIcon(FaEye);
    } else {
      setIsPasswordShown("password");
      setPasswordIcon(FaEyeSlash);
    }
  };
  // const navigate = useNavigate();
  // const handleChangeUserName = (e) => {
  //   if (e.target.value.match("^[a-zA-Z ]*$") != null) {
  //     setFormData({ firstname: e.target.value });
  //   }
  // };
  const getCountryCodeCall = () => {
    getCountryMaster().then((res) => {
      let countryCodeObj = [];
      res?.data?.map((data) => {
        countryCodeObj.push({
          name: data?.name,
          dialingCode: data?.dialingCode,
        });
      });
      setCountryCode(countryCodeObj);
      // let copyFormData = { ...formData };
      // copyFormData.countrycode.valueText = countryCodeObj[0]?.dialingCode;
      // setFormData(copyFormData);
    });
  };

  useEffect(() => {
    getCountryCodeCall();
  }, []);

  const submitFormOnEnter = (e) => {
    if (e?.keyCode == 13) {
      if (formData?.phonenumber?.errorText == "") {
        submitRegistrationForm();
      }
    }
  };

  const submitRegistrationForm = () => {
    // Validate if all field are valid

    let isValid = true;
    Object.keys(formData)?.forEach((key) => {
      enableShouldErrorShow({ target: { name: key } }, formData, setFormData);
      if (
        !validateField(key, formData, setFormData) ||
        !isPasswordValid("password", formData, setFormData)
      ) {
        isValid = false;
      }
    });

    if (isValid) {
      const name =
        formData?.firstname?.valueText?.trim() +
        " " +
        formData?.lastname?.valueText?.trim();
      // formData?.firstname?.valueText?.match("[a-zA-Z]*") +
      // " " +
      // formData?.lastname?.valueText?.match("[a-zA-Z]*");
      const email = formData?.email?.valueText;
      const phone =
        formData?.countrycode?.valueText + formData?.phonenumber?.valueText;
      const password = formData?.password?.valueText;
      const whatsappAlert = formData?.privacy?.valueText;

      setShowLoader(true);

      registerCandiate(name, email, phone, password, whatsappAlert)
        .then((res) => {
          if (res?.data?.status === STATUS_SUCCESS && res?.data?.data?.id) {
            verificationNeeded(email, phone, password);
          } else {
            toaster(
              "error",
              res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
            );
            setShowLoader(false);
          }
        })
        .catch((err) => {
          toaster(
            "error",
            err?.data?.message ? err?.data?.message : GENERAL_ERROR_MESSAGE
          );
          setShowLoader(false);
        });
    }
  };

  useEffect(() => {
    if (window?.location?.search) {
      props?.setRedirectUrl(window?.location?.search?.replace(/\?/g, ""));
    }
  }, [window?.location]);

  const navigateToLogin = () => {
    if (props?.redirectUrl == "") {
      navigate("/login");
    } else {
      navigate({
        pathname: "/login",
        search: props?.redirectUrl,
      });
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <div className="heading1">Register</div>
      <div className="mb-4 d-flex">
        Already have an account?{" "}
        {/* <Link to="/login" className="fw-700">
          Log In Instead
        </Link> */}
        <div
          onClick={navigateToLogin}
          className="fw-700 text-underline ms-1 pointer color-blue"
        >
          Log In Instead
        </div>
      </div>
      <div className="pt-3">
        {/* Name row */}
        <div className="form-row d-flex flex-wrap">
          <div className="col-12 col-sm-6">
            <div className="me-sm-3">
              <label className="form-label">First Name</label>
              <input
                autoFocus={true}
                onPaste={(e) => {
                  e.preventDefault();
                }}
                onKeyDown={(e) => {
                  submitFormOnEnter(e);
                }}
                value={formData?.firstname?.valueText}
                type="text"
                maxLength={32}
                name="firstname"
                onBlur={($event) => {
                  enableShouldErrorShow($event, formData, setFormData);
                }}
                onChange={($event) => {
                  // let copyFormData = { ...formData };
                  // let text = $event?.target?.value?.match("^[a-zA-Z ]*$") != null;

                  // copyFormData.firstname.valueText = text;
                  // setFormData(text);

                  // selectedValue(text, $event?.target?.value);

                  disableShouldErrorShow($event, formData, setFormData);
                  onFormFeildsChange($event, formData, setFormData);
                }}
                className={
                  (formData?.firstname?.errorText &&
                  formData?.firstname?.shouldShowError
                    ? "error"
                    : "") + " form-control"
                }
              />
              <div className="field-error mt-1">
                {formData?.firstname?.shouldShowError
                  ? formData?.firstname?.errorText
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-12 mt-3 mt-sm-0">
            <label className="form-label">Last Name</label>
            <input
              onPaste={(e) => {
                e.preventDefault();
              }}
              onKeyDown={(e) => {
                submitFormOnEnter(e);
              }}
              value={formData?.lastname?.valueText}
              type="text"
              maxLength={32}
              name="lastname"
              onBlur={($event) => {
                enableShouldErrorShow($event, formData, setFormData);
              }}
              onChange={($event) => {
                // let copyFormData = { ...formData };
                // let text = $event?.target?.value?.replace(/\s/g, "");
                // copyFormData.lastname.valueText = text;
                // setFormData(copyFormData);
                // selectedValue(text, "lastname");
                onFormFeildsChange($event, formData, setFormData);
              }}
              className={
                (formData?.lastname?.errorText &&
                formData?.lastname?.shouldShowError
                  ? "error"
                  : "") + " form-control"
              }
            />
            <div className="field-error mt-1">
              {formData?.lastname?.shouldShowError
                ? formData?.lastname?.errorText
                : ""}
            </div>
          </div>
        </div>

        {/* Email row */}
        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            type="email"
            name="email"
            maxLength={50}
            value={formData?.email?.valueText}
            onBlur={($event) => {
              enableShouldErrorShow($event, formData, setFormData);
            }}
            onFocus={($event) => {
              disableShouldErrorShow($event, formData, setFormData);
            }}
            onChange={($event) => {
              // let copyFormData = { ...formData };
              // let text = $event?.target?.value?.replace(/\s/g, "");
              // copyFormData.email.valueText = text;
              // setFormData(copyFormData);
              // selectedValue(text, "email");

              onFormFeildsChange($event, formData, setFormData);
              if (formData?.email?.errorText == "") {
                emailValidation(formData, setFormData);
              }
            }}
            className={
              (formData?.email?.errorText && formData?.email?.shouldShowError
                ? "error"
                : "") + "  form-control"
            }
          />

          <div className="field-error mt-1">
            {formData?.email?.shouldShowError ? formData?.email?.errorText : ""}
          </div>
        </div>

        {/* Phone number row */}
        <div className="form-row">
          <label className="form-label">Contact Number</label>

          <div className="d-flex gap-2 contact-number-inputs">
            <div className="col-md-3 me-2 margin-right">
              <select
                value={formData?.countrycode?.valueText}
                name="countrycode"
                className="form-select fixed-width"
                aria-label="Select country"
                onBlur={($event) => {
                  enableShouldErrorShow($event, formData, setFormData);
                }}
                onChange={($event) => {
                  onFormFeildsChange($event, formData, setFormData);
                  if (formData?.phonenumber?.valueText) {
                    const isPhoneNumberValid = checkPhoneNumberValid(
                      formData?.phonenumber?.valueText,
                      $event?.target?.value
                    );
                    let copyFormData = { ...formData };

                    if (!isPhoneNumberValid) {
                      copyFormData.phonenumber.errorText =
                        FORM_VALIDATION_MESSAGE.PHONE;
                    } else {
                      copyFormData.phonenumber.errorText = "";
                    }
                    setFormData(copyFormData);
                  }
                  // if ($event?.target?.value == "+91") {
                  //   let copyFormData = { ...formData };
                  //   let tenDigitNumber =
                  //     formData?.phonenumber?.valueText?.slice(0, 10);
                  //   copyFormData.phonenumber.valueText = tenDigitNumber;
                  //   setFormData(copyFormData);
                  // }
                  if (formData?.phonenumber?.errorText == "") {
                    mobileValidation(formData, setFormData);
                  }
                }}
              >
                {countryCode?.map((codeData, index) => {
                  return (
                    <option
                      key={index}
                      value={codeData?.dialingCode}
                      name={codeData?.dialingCode}
                    >
                      {codeData?.dialingCode}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col ps-md-3 ps-xl-0">
              <input
                onPaste={(e) => {
                  e.preventDefault();
                }}
                onKeyDown={(e) => {
                  submitFormOnEnter(e);
                }}
                value={formData?.phonenumber?.valueText}
                type="number"
                name="phonenumber"
                onFocus={($event) => {
                  disableShouldErrorShow($event, formData, setFormData);
                }}
                onBlur={($event) => {
                  enableShouldErrorShow($event, formData, setFormData);
                }}
                onChange={($event) => {
                  // let copyFormData = { ...formData };
                  // let text = $event?.target?.value?.replace(/\s/g, "");
                  // copyFormData.phonenumber.valueText = text;
                  // setFormData(copyFormData);

                  // selectedValue(text, "phonenumber");
                  // if (formData?.countrycode?.valueText == "+91") {
                  //   if ($event?.target?.value?.length <= 10) {
                  //     onFormFeildsChange($event, formData, setFormData);
                  //   } else {
                  //     return;
                  //   }
                  // }

                  onFormFeildsChange($event, formData, setFormData);
                  const isPhoneNumberValid = checkPhoneNumberValid(
                    $event?.target?.value,
                    formData?.countrycode?.valueText
                  );
                  let copyFormData = { ...formData };
                  if (!isPhoneNumberValid) {
                    copyFormData.phonenumber.errorText =
                      FORM_VALIDATION_MESSAGE.PHONE;
                    setFormData(copyFormData);
                  } else {
                    copyFormData.phonenumber.errorText = "";
                    setFormData(copyFormData);
                  }

                  if (formData?.phonenumber?.errorText == "") {
                    mobileValidation(formData, setFormData);
                  }
                }}
                className={
                  (formData?.phonenumber?.errorText &&
                  formData?.phonenumber?.shouldShowError
                    ? "error"
                    : "") + " form-control"
                }
              />
              <div className="field-error mt-1">
                {formData?.phonenumber?.shouldShowError
                  ? formData?.phonenumber?.errorText
                  : ""}
              </div>
              {/* <div className="field-error mt-1">
                {phoneError && "Invalid Phone Number"}
              </div> */}
            </div>
          </div>
        </div>

        {/* Password row */}
        <div className="form-row">
          <label className="form-label ">Password</label>
          <input
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            value={formData?.password?.valueText}
            type={isPasswordShown}
            maxLength={16}
            minLength={8}
            onFocus={($event) => {
              disableShouldErrorShow($event, formData, setFormData);
            }}
            name="password"
            onBlur={($event) => {
              enableShouldErrorShow($event, formData, setFormData);
            }}
            onChange={($event) => {
              // let copyFormData = { ...formData };
              // let text = $event?.target?.value?.replace(/\s/g, "");
              // copyFormData.password.valueText = text;
              // setFormData(copyFormData);
              onFormFeildsChange($event, formData, setFormData);
            }}
            className={
              (formData?.password?.errorText &&
              formData?.password?.shouldShowError
                ? "error"
                : "") + " form-control "
            }
          />
          <span className="icons pointer" onClick={togglePasswordVisiblity}>
            {passwordIcon}
          </span>
          <div className="field-error mt-3">
            {formData?.password?.shouldShowError
              ? formData?.password?.errorText
              : ""}
          </div>
        </div>

        {/* Privacy policy checkbox */}
        <div className="form-row pt-3">
          <input
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            name="privacy"
            className={
              (formData?.password?.errorText ? "error" : "") +
              " form-check-input me-1 pointer"
            }
            type="checkbox"
            onChange={($event) => {
              let copyFormData = { ...formData };
              copyFormData.privacy.valueText = $event?.target?.checked;
              setFormData(copyFormData);
            }}
          />
          <span className="fs-12 fw-400 color-tertiary">
            Get job updates on WhatsApp.{" "}
          </span>
          <span>
            <button
              style={{ background: "white", border: "none" }}
              className="text-decoration-underline fs-12 fw-500 color-primary p-0 login-btn-focus"
              onClick={() =>
                window.open(
                  `https://site.seikor.com/privacy_policy.html`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Privacy Policy
            </button>
          </span>
        </div>

        {/* Submit button */}
        <div className="login-btn-hover">
          <input
            onKeyDown={(e) => {
              submitFormOnEnter(e);
            }}
            type="submit"
            onClick={() => {
              if (formData?.phonenumber?.errorText == "") {
                submitRegistrationForm();
              }
            }}
            className="w-100 btn-rounded btn-primary login-btn-focus "
            value="Continue"
          />
        </div>

        <div className="fs-11 fw-300 color-tertiary mt-4 text-center">
          A verification code will be sent to verify your Email and Contact
          Number
        </div>
      </div>

      {/* Privacy policy dialog */}
      <PrivacyPolicyDialog
        showPrivacy={showPrivacy}
        onClickHidePrivacy={() => setShowPrivacy(false)}
      />
    </>
  );
};
export default RegistrationForm;
