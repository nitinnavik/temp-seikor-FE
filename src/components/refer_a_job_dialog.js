import React, { useEffect, useState } from "react";
import {
  EMAIL_PATTERN,
  getPhoneNumberPattern,
  PHONE_CHECK,
  PHONE_NUMBER_PATTERN,
  REGISTRATION,
  TOKEN,
} from "../constants/keys";
import Dialog from "./common/dialog";
import ReferForJob from "./ReferForJob";
import ConfirmationRefereeNonRegister from "./ConfirmationRefereeNonRegister";
import { useStoreState } from "easy-peasy";
import { getLocalStorage } from "../utils/storage";

function ReferAJobDialog(props) {
  const [formData, setFormData] = useState({
    email: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required", EMAIL_PATTERN],
    },
    name: { valueText: "", initial: "", errorText: "", check: ["required"] },
    contactNumber: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required"],
    },
    countryCode: {
      valueText: "+91",
      initial: "+91",
      errorText: "",
      check: ["required"],
    },
    commentsCandidate: {
      valueText: "",
      initial: "",
      check: [""],
    },
    commentsBusiness: {
      valueText: "",
      initial: "",
      check: [""],
    },
    candidateRating: {
      valueText: 0,
      initial: 0,
      check: [""],
    },
    topReasonsToRefer: {
      valueText: [],
      initial: [],
      check: [""],
    },
  });
  const [
    confirmationRefereeNonRegisterShow,
    setConfirmationRefereeNonRegisterShow,
  ] = useState(false);

  function handleHideConfirmationDailog() {
    setConfirmationRefereeNonRegisterShow(false);
  }

  return (
    <>
      <Dialog
        onClosedButtonClick={props?.onClosedButtonClick}
        isShow={props?.referJobShow}
        referButtonClicked={props?.setReferButtonClicked}
        disableReferralBtn={props?.disableReferralBtn}
        editReferral={props?.editReferral}
      >
        <ReferForJob
          confirmationRefereeNonRegisterShow={
            confirmationRefereeNonRegisterShow
          }
          setConfirmationRefereeNonRegisterShow={
            setConfirmationRefereeNonRegisterShow
          }
          referButtonClicked={props?.referButtonClicked}
          disableReferralBtn={props?.disableReferralBtn}
          setDisableReferralBtn={props?.setDisableReferralBtn}
          referJobId={props?.referJobId}
          applicationId={props?.applicationId}
          refereeId={props?.refereeId}
          formData={formData}
          referrerId={props?.referrerId}
          setFormData={setFormData}
          Feedback={props?.Feedback}
          ratingStar={props?.ratingStar}
          reason={props?.reason}
          setReferButtonClicked={props?.setReferButtonClicked}
          referJobShow={props?.referJobShow}
          setReferJobShow={props?.setReferJobShow}
          editReferral={props?.editReferral}
          newJobReferred={props?.newJobReferred}
          setNewJobReferred={props?.setNewJobReferred}
          onJobReferred={() => {
            if (props?.onJobReferred) {
              props?.onJobReferred();
            }
          }}
          jobDetailsProps={props?.jobDetailsProps}
          setApiRefresh={props?.setApiRefresh}
        />
      </Dialog>
      {confirmationRefereeNonRegisterShow && (
        <ConfirmationRefereeNonRegister
          show={confirmationRefereeNonRegisterShow}
          onHide={handleHideConfirmationDailog}
          title={"Login or register to refer this job"}
        />
      )}
    </>
  );
}

export default ReferAJobDialog;
