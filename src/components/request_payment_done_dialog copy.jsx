import React from "react";
import Modal from "react-bootstrap/Modal";
import close from "../assests/icons/ic-close-24.svg";
import { NOT_MENTIONED } from "../constants/message";
import { convertToInternationalCurrencySystem } from "../utils/utils";
import Loader from "./common/loader";

const RequestPaymentDoneDialog = (props) => {
  return (
    
    <div>
      {props.showLoader && <Loader />}
      <Modal
        show={props?.showSendReferral}
        onHide={() => props.onSendReferralClick()}
        size="md"
        id="request-payment"
        className="border-radius-16 lg-dialog-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0 d-flex justify-content-end">
          <img
            src={close}
            alt="close-icon"
            className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-3 pointer"
            onClick={() => props.onSendReferralClick()}
          />
        </Modal.Header>

        <Modal.Body className="px-4 pt-0 scrolling-dialog mt-0">
          <div>
            <div className="fs-24 fw-700 color-primary pb-3">
              Payment Request
            </div>
            <p className="fs-12 color-tertiary">
              A payment request of ₹
              {props?.referralAmount
                ? `${
                    props?.currencyType ? props?.currencyType : "INR"
                  } ${convertToInternationalCurrencySystem(
                    props?.referralAmount,
                    props?.currencyType ? props?.currencyType : "INR"
                  )}`
                : NOT_MENTIONED}{" "}
              for your referral bonus has been sent to the employer.
            </p>
            <p className="fs-12 color-tertiary">
              You will be notified once it is processed.
            </p>
            <div className="pt-5 d-flex justify-content-end">
              <div
                className="btn btn-outline-dark fs-12 fw-700 text-white bg-dark ps-5 pe-5 p-2"
                onClick={() => props?.onSendReferralClick()}
              >
                Done
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RequestPaymentDoneDialog;
