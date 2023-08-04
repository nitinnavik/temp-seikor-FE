import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { onFormFeildsChange } from "../utils/form_validators";
import { GenerateOtp } from "../_services/member-profile.service";
import { validateField } from "../utils/form_validators";
import { useStoreState, useStoreActions } from "easy-peasy";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import {
  FORM_VALIDATION_MESSAGE,
  STATUS_SUCCESS,
  TOKEN,
  USER_ID,
} from "../constants/keys";
import {
  getCountryMaster,
  mobileValidation,
  mobileValidationWithCode,
} from "../_services/candidate.service";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";
import { checkPhoneNumberValid } from "../utils/utils";

const EditPhoneDialog = (props) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const isLoading = useStoreState((state) => state.candidate.isLoading);

  const token = getLocalStorage(TOKEN);

  const updateNumber = () => {
    if (validateField("mobile", props?.numData, props?.setNumData)) {
      props.setShowLoader(true);
      GenerateOtp(
        props.numData?.mobile?.valueText,
        "SMS",
        candidateDetails?.userRegistrationDetails?.mobile
      )
        .then((res) => {
          if (res?.status == STATUS_SUCCESS) {
            props.setShowLoader(false);
            toaster("success", "OTP sent successfully!");
            props.setRefNumber(res?.data?.refNumber);
            props.setShow2(false);
            props.setShow5(true);
            triggerTimer();
          } else {
            toaster(
              "error",
              res?.message ? res?.message : GENERAL_ERROR_MESSAGE
            );
          }
        })
        .catch((err) => {
          props.setShowLoader(false);
          toaster("error", err?.message ? err?.message : GENERAL_ERROR_MESSAGE);
        });
      props?.setShowLoader(false);
    }
    props?.setShowLoader(false);
    props.setShow2(false);
  };

  const triggerTimer = () => {
    if (props?.firstTime[0] === true) {
      props?.firstTime[1](false);
    }
  };

  useEffect(() => {
    props?.firstTime[1](true);
  }, [props?.firstTime]);

  const [countryCode, setCountryCode] = useState([]);

  useEffect(() => {
    const getCountryCodeCall = async () => {
      const countryCodeResponse = await getCountryMaster();
      let countryCodeObj = [];
      countryCodeResponse?.data?.map((data) => {
        countryCodeObj.push({
          name: data?.name,
          dialingCode: data?.dialingCode,
        });
      });
      setCountryCode(countryCodeObj);
    };
    getCountryCodeCall();
  }, []);

  return (
    <>
      <Modal
        show={props.show2}
        onHide={() => {
          props.setShow2(false);
          const mobile = candidateDetails?.userRegistrationDetails?.mobile;
          let copyFormData = { ...props?.numData };
          copyFormData.mobile.errorText = "";
          copyFormData.mobile.valueText = mobile;
          props?.setNumData(copyFormData);
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
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <label className="modalLabel" style={{ color: "#3E3E3E" }}>
            Phone Number*
          </label>
          <div className="d-flex">
            {/* <select
              type="text"
              style={{ width: "12%" }}
              defaultValue={candidateDetails?.userRegistrationDetails?.mobile}
              name="countryCode"
              className=" form-control  fs-12 modal-form-input"
              onChange={($event) => {
                onFormFeildsChange($event, props?.numData, props?.setNumData);
              }}
            >
              {countryCode.map((codeData, index) => {
                return (
                  <option
                    className="bg-white form-control outline-none mb-4 p-2 color-primary fs-12 down-arrow-logo"
                    key={index}
                    value={codeData?.dialingCode}
                    name={codeData?.dialingCode}
                  >
                    {codeData?.dialingCode}
                  </option>
                );
              })}
            </select> */}
            <input
              style={{ width: "100%" }}
              // maxLength={13}
              defaultValue={
                props.isApplyForJobComponent
                  ? props.newCandidateDetails?.userRegistrationDetails?.mobile
                  : candidateDetails?.userRegistrationDetails?.mobile
              }
              className={
                (props?.numData?.mobile?.errorText ? "error" : "") +
                " form-control fs-12 modal-form-input"
              }
              onChange={($event) => {
                onFormFeildsChange($event, props?.numData, props?.setNumData);

                const isPhoneNumberValid = checkPhoneNumberValid(
                  $event?.target?.value
                );
                let copyFormData = { ...props?.numData };
                if (!isPhoneNumberValid) {
                  copyFormData.mobile.errorText = FORM_VALIDATION_MESSAGE.PHONE;
                  props?.setNumData(copyFormData);
                } else {
                  copyFormData.mobile.errorText = "";
                  props?.setNumData(copyFormData);
                }
                if (props?.numData?.mobile?.errorText == "") {
                  mobileValidationWithCode(props?.numData, props?.setNumData);
                }
              }}
              type="text"
              placeholder="Phone Number"
              name="mobile"
            />
          </div>
          <div className="field-error mt-1">
            {props?.numData?.mobile?.errorText}
          </div>
          <div className="fs-14 mt-3" style={{ color: "#808080" }}>
            Number will be verified with a One Time Password
          </div>
          {props.isApplyForJobComponent && token && (
            <div className="dialog-footer-checkbox mt-2">
              <label>
                <input
                  type="checkbox"
                  onChange={() => props.setIsPhoneCheck(!props.isPhoneCheck)}
                  defaultChecked={props.isPhoneCheck}
                  className="mt-2 me-2 pt-1 mb-3 "
                />
                Save this to profile
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            onClick={() => {
              props.setShow2(false);
              const mobile = candidateDetails?.userRegistrationDetails?.mobile;
              let copyFormData = { ...props?.numData };
              copyFormData.mobile.errorText = "";
              copyFormData.mobile.valueText = mobile;
              props?.setNumData(copyFormData);
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
              if (props?.numData?.mobile?.errorText == "") {
                // if (token) {
                //   updateNumber();
                // } else {
                updateNumber();
                if (
                  validateField("mobile", props?.numData, props?.setNumData)
                ) {
                  props.setShow2(false);
                  if (props?.setHideMainModal) {
                    props?.setHideMainModal(false);
                  }
                  toaster("success", "Phone saved!");
                } else {
                  toaster("Error", "Invalid Number");
                }
                // }
              }
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditPhoneDialog;
