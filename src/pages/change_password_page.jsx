import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCreateNewPassword from "../components/account_create_new_password";
import HeaderTwo from "../components/common/headerTwo";
import {
  changePassword,
  retrievePassword,
} from "../_services/candidate.service";
import { useStoreActions, useStoreState } from "easy-peasy";
import toaster from "../utils/toaster";
import {
  initialiseFormData,
  onFormFeildsChange,
  validateField,
  validateForm,
} from "../utils/form_validators";
import { PASSWORD, REQUIRED } from "../constants/keys";
import Loader from "../components/common/loader";
import { logout } from "../_services/auth.service";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordPage = (props) => {
  const userRegistrationDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails?.userRegistrationDetails
  );

  const [formData, setFormData] = useState({
    oldPassword: { valueText: "", errorText: "", check: [REQUIRED] },
    newPassword: { valueText: "", errorText: "", check: [REQUIRED, PASSWORD] },
    confirmPassword: { valueText: "", errorText: "", check: [REQUIRED] },
  });
  const [formError, setFormError] = useState({
    confirmPassword: "",
  });

  const [isPasswordShown, setIsPasswordShown] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(<FaEyeSlash />);

  const [newPasswordShown, setNewPasswordShown] = useState("password");
  const [newPasswordIcon, setNewPasswordIcon] = useState(<FaEyeSlash />);

  const [changePasswordShown, setChangePasswordShown] = useState("password");
  const [ChangePasswordIcon, setChangePasswordIcon] = useState(<FaEyeSlash />);

  const oldPasswordChange = () => {
    if (isPasswordShown === "password") {
      setPasswordIcon(FaEye);
      setIsPasswordShown("text");
    } else {
      setPasswordIcon(FaEyeSlash);
      setIsPasswordShown("password");
    }
  };
  const newPasswordChange = () => {
    if (newPasswordShown === "password") {
      setNewPasswordIcon(FaEye);
      setNewPasswordShown("text");
    } else {
      setNewPasswordIcon(FaEyeSlash);
      setNewPasswordShown("password");
    }
  };
  const confPasswordChange = () => {
    if (changePasswordShown === "password") {
      setChangePasswordIcon(FaEye);
      setChangePasswordShown("text");
    } else {
      setChangePasswordIcon(FaEyeSlash);
      setChangePasswordShown("password");
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   setuserName(temp?.email);
  // }, [username]);
  const validateForm = (formData, setFormData) => {
    let isValid = true;
    if (
      formData?.newPassword?.valueText !== formData?.confirmPassword?.valueText
    ) {
      setFormError({
        confirmPassword: "Password and confirm password should be same",
      });
      isValid = false;
    } else {
      setFormError({
        confirmPassword: "",
      });
      isValid = true;
    }
    setFormData(formData);
    return isValid;
  };

  const savePassword = () => {
    let isValid = true;

    Object.keys(formData)?.forEach((key) => {
      if (!validateField(key, formData, setFormData)) {
        isValid = false;
      }
    });
    if (isValid && validateForm(formData, setFormData)) {
      setShowLoader(true);
      changePassword(
        userRegistrationDetails?.email,
        formData?.oldPassword?.valueText,
        formData?.newPassword?.valueText
      )
        .then((res) => {
          setShowLoader(false);
          if (res?.data?.status === "SUCCESS") {
            
            toaster("success", res?.data?.message);
            // navigate("/");
             props?.onClickCloseDialog();
            //  props.onDismissDialogClick();
          } else {
            toaster(
              "error",
              res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
            );
          }
        })
        .catch((error) => {
          setShowLoader(false);
          toaster(
            "error",
            error?.data?.message ? error?.data?.message : GENERAL_ERROR_MESSAGE
          );
        });
    }
  };
  return (
    <div className="h-auto w-100">
      {showLoader && <Loader />}
      <HeaderTwo onClickCloseDialog={props.onClickCloseDialog} />
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <div className="forgot-width pt-3">
            <h4 className="fw-bold fs-4"> Create New Password </h4>
            <br />
            <br />
            <span className="text-secondary"> Registered ID</span>
            <br />
            <span className="m-0 mt-3">
              <b> {userRegistrationDetails?.email} </b>
            </span>

            <br />
            <br />
            <div
              className="mt-3 mb-3 position-relative"
              id="Old-password"
              style={{ color: "#3E3E3E" }}
            >
              <b>Old Password</b>
              <input
                type={isPasswordShown}
                className={
                  (formData?.oldPassword?.errorText ? "error" : "") +
                  " form-control"
                }
                name="oldPassword"
                onChange={($event) => {
                  onFormFeildsChange($event, formData, setFormData);
                }}
                required
              />
              <div
                className="icons-span eye-icon-margin"
                onClick={(event) => {
                  oldPasswordChange();
                }}
              >
                {passwordIcon}
              </div>

              {formData?.oldPassword?.errorText && (
                <div className="field-error ">
                  {formData?.oldPassword?.errorText}
                </div>
              )}
            </div>

            <div
              className="mt-3 mb-3 position-relative"
              id="new-Password"
              style={{ color: "#3E3E3E" }}
            >
              <b>New Password </b>
              <input
                type={newPasswordShown}
                className={
                  (formData?.newPassword?.errorText ? "error" : "") +
                  " form-control"
                }
                name="newPassword"
                onChange={($event) => {
                  onFormFeildsChange($event, formData, setFormData);
                }}
                required
              />
              <div
                className="icons-span eye-icon-margin"
                onClick={() => {
                  newPasswordChange();
                }}
              >
                {newPasswordIcon}
              </div>

              {formData?.newPassword?.errorText && (
                <div className="field-error ">
                  {formData?.newPassword?.errorText}
                </div>
              )}
            </div>

            <div
              className="mt-3 mb-3 position-relative"
              id="Confiorm-password"
              style={{ color: "#3E3E3E" }}
            >
              <b>Confirm Password </b>
              <input
                type={changePasswordShown}
                className={
                  (formData?.confirmPassword?.errorText ? "error" : "") +
                  " form-control"
                }
                name="confirmPassword"
                onChange={($event) => {
                  onFormFeildsChange($event, formData, setFormData);
                }}
                required
              />
              <div
                className="icons-span eye-icon-margin"
                onClick={() => {
                  confPasswordChange();
                }}
              >
                {ChangePasswordIcon}
              </div>

              <p className="field-error mt-1">{formError.confirmPassword}</p>
              {formData?.confirmPassword?.errorText && (
                <div className="field-error ">
                  {formData?.confirmPassword?.errorText}
                </div>
              )}
            </div>
            <br />
            <input
              type="button"
              id="save-btn"
              value="Save"
              className="w-100 btn-rounded btn-primary"
              onClick={() => {
                savePassword();
                // props.onDismissDialogClick();

              }}

              // onClick={(submitPassword) => setIsSaved(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
