import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { onFormFeildsChange } from "../utils/form_validators";
import { GenerateOtp } from "../_services/member-profile.service";
import { validateField } from "../utils/form_validators";
import { useStoreState, useStoreActions } from "easy-peasy";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import { STATUS_SUCCESS, TOKEN, USER_ID } from "../constants/keys";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";
import { EMAIL_PATTERN } from "./../constants/keys";
import { emailValidation } from "../_services/candidate.service";

const EditEmailDialog = (props) => {
  const [formData, setFormData] = useState({
    email: {
      valueText: "",
      errorText: "",
      check: ["required", EMAIL_PATTERN],
    },
  });

  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );

  const token = getLocalStorage(TOKEN);

  const triggerTimer = () => {
    if (props?.firstTimeEmail[0]) {
      props?.firstTimeEmail[1](false);
    }
  };

  const onSaveEmail = () => {
    if (
      formData?.email.valueText ===
      candidateDetails?.userRegistrationDetails?.email
    ) {
      formData.email.errorText = "Please edit your email address";
      toaster("error", "Please edit your email address !");
    }
    if (
      formData?.email.valueText !== "" &&
      formData?.email.valueText !==
        candidateDetails?.userRegistrationDetails?.email &&
      formData?.email.errorText === ""
    ) {
      if (validateField("email", props?.emailData, props?.setEmailData)) {
        props.setShowLoader(true);
        GenerateOtp(
          props.emailData?.email?.valueText,
          "EMAIL",
          candidateDetails?.userRegistrationDetails?.email
        )
          .then((res) => {
            if (res?.status == STATUS_SUCCESS) {
              props.setShowLoader(false);
              props.setRefNumber(res?.data?.refNumber);
              toaster("success", "OTP sent successfully!");
              triggerTimer();
              props.setShow(false);
              props.setShow1(true);
            } else {
              toaster(
                "error",
                res?.message ? res?.message : GENERAL_ERROR_MESSAGE
              );
            }
          })
          .catch((err) => {
            props.setShowLoader(false);
            toaster(
              "error",
              err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            );
          });
      }
    }
    props?.setShowLoader(false);
    props.setShow(false);
  };

  useEffect(() => {
    props?.firstTimeEmail[1](true);
  }, [props?.firstTimeEmail]);

  useEffect(() => {
    if (candidateDetails?.userRegistrationDetails?.email) {
      formData.email.valueText =
        candidateDetails?.userRegistrationDetails?.email;
    }
  }, [candidateDetails?.userRegistrationDetails]);

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
          const email = candidateDetails?.userRegistrationDetails?.email;
          let copyFormData = { ...props?.emailData };
          copyFormData.email.errorText = "";
          copyFormData.email.valueText = email;
          props?.setEmailData(copyFormData);
          formData.email.errorText = "";
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
          <Modal.Title className="dialog-title">Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body mb-5">
          <label className="modalLabel" style={{ color: "#3E3E3E" }}>
            Email Address*
          </label>
          <input
            type="email"
            className={
              (props?.emailData?.email?.errorText ? "error" : "") +
              " form-control fs-12"
            }
            style={{ width: "90%" }}
            name="email"
            defaultValue={
              props.isApplyForJobComponent
                ? props.newCandidateDetails?.userRegistrationDetails?.email
                : candidateDetails?.userRegistrationDetails?.email
            }
            onChange={($event) => {
              onFormFeildsChange($event, props?.emailData, props?.setEmailData);
              onFormFeildsChange($event, formData, setFormData);

              if (formData?.email?.errorText === "") {
                emailValidation(formData, setFormData);
              }
            }}
          />
          {formData?.email?.errorText ? (
            <div className="field-error mt-1 me-5">
              {formData?.email?.errorText !== ""
                ? formData?.email?.errorText
                : ""}
            </div>
          ) : (
            ""
          )}

          <div className="large-text-gray mt-3 fs-14">
            This email will be used for communications
            <br /> and login
          </div>
          {props.isApplyForJobComponent && token && (
            <div className="dialog-footer-checkbox mt-2">
              <label>
                <input
                  type="checkbox"
                  onChange={() => props.setIsEmailCheck(!props.isEmailCheck)}
                  defaultChecked={props.isEmailCheck}
                  className="mt-2 me-2 pt-1 mb-3 "
                />
                Save this to profile
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="dialog-footer mt-5">
          <button
            onClick={() => {
              props.setShow(false);
              const email = candidateDetails?.userRegistrationDetails?.email;
              let copyFormData = { ...props?.emailData };
              copyFormData.email.errorText = "";
              copyFormData.email.valueText = email;
              props?.setEmailData(copyFormData);
              formData.email.errorText = "";
              formData.email.valueText = "";
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
              // if (token) {
              //   if (props?.emailData?.email?.errorText == "") {
              //     onSaveEmail();
              //   }
              // } else {
              if (props?.emailData?.email?.errorText == "") {
                onSaveEmail();
              }
              if (
                validateField("email", props?.emailData, props?.setEmailData)
              ) {
                props.setShow(false);
                if (props?.setHideMainModal) {
                  props?.setHideMainModal(false);
                }
                toaster("success", "Email saved!");
              } else {
                toaster("Error", "Invalid Email");
              }
              // }
            }}
          >
            Continue
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditEmailDialog;
