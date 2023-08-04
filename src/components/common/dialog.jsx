import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import close from "../../assests/icons/ic-close-24.svg";
import { Button } from "react-bootstrap";
import Loader from "./loader";

const Dialog = ({
  children,
  isShow,
  onClosedButtonClick,
  referButtonClicked,
  disableReferralBtn,
  editReferral,
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const setReferButtonClicked = referButtonClicked;

  return (
    <>
      {showLoader && <Loader />}
      <Modal
        show={isShow}
        aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        fullscreen="lg-down"
        className="dialog-wrapper lg-dialog-modal"
      >
        <Modal.Header className="border-0 m-1">
          <Modal.Title id="example-custom-modal-styling-title">
            <img
              src={close}
              alt="close-icon"
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round position-absolute end-0 me-3 pointer"
              onClick={() => onClosedButtonClick()}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">{children}</Modal.Body>
        <Modal.Footer className="modal-dialog-footer w-100 ">
          {editReferral ? (
            <Button
              onClick={() => {
                setReferButtonClicked(true);
              }}
              className="btn-rounded btn-primary pe-5 ps-5 d-md-block d-none referral-btn"
            >
              {" "}
              Save
            </Button>
          ) : (
            <Button
              disabled={disableReferralBtn}
              onClick={() => {
                setReferButtonClicked(true);
              }}
              className="btn-rounded btn-primary pe-5 ps-5 d-md-block d-none referral-btn"
            >
              {" "}
              Send Referral
            </Button>
          )}
          <div className="d-md-none d-block w-100 p-3 z-index-align ps-5 pe-sm-5 bg-white bottom-0 position-fixed">
            <Button
              disabled={editReferral ? false : disableReferralBtn}
              onClick={() => {
                setReferButtonClicked(true);
              }}
              type="button"
              className="btn-primary btn-rounded text-center p-3 w-100 referral-btn"
            >
              {editReferral ? "Save" : "Send Referral"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dialog;
