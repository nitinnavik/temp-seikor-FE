import React, { useState, useParams } from "react";
import toaster from "../utils/toaster";
import Loader from "./common/loader";
import icThreeDots from "../assests/icons/ic_retract.svg";
import icBlackDone from "./../assests/icons/ic_blackdone.svg";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { MASTER_TYPE, STATUS_SUCCESS } from "../constants/keys";
import { getApplicationRetract } from "../_services/job.service";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";
import { getAppliedJobs } from "../_services/job.service";
import { Link } from "react-router-dom";
import close from "../assests/icons/ic-close-24.svg";

const JobCardApplication = (props) => {
  // let { id } = useParams();
  const [viewApplication, setviewApplication] = useState();
  // props.ApplicationStatus ? props.ApplicationStatus : false;
  const [isRetract, setIsRetract] = useState();
  const [smShow, setSmShow] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const onButtonClick = () => {
    setShowLoader(true);
    getApplicationRetract(props.id)
      .then((res) => {
        setShowLoader(false);
        if (res?.data?.status == STATUS_SUCCESS) {
          props?.onJobRetract();
          toaster(
            "success",
            res?.data?.message ? res?.data?.message : STATUS_SUCCESS
          );
        } else {
          toaster(
            "error",
            res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
          );
        }
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("error", err);
      });
  };
  return (
    <>
      {showLoader && <Loader />}
      <React.Fragment>
        <Dropdown className="down-btn-remove">
          <Dropdown.Toggle
            variant="none"
            id="dropdown-basic"
            className="d-flex p-0 m-0 border-0 bg-transparent "
          >
            <img src={icThreeDots} alt="retract-icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu className="fs-12 text-secondary mt-2 border-dark ">
            <Dropdown.Item className="d-flex pb-2 pt-2">
              <div
                className="d-flex gap-2 "
                // onClick={() => onButtonClick(isRetract, !viewApplication)}
              >
                {viewApplication ? (
                  <img src={icBlackDone} alt="blackdone-icon" className="" />
                ) : (
                  ""
                )}
                <span className={viewApplication ? "fw-700" : ""}>
                  <Link
                    className="font-color-black text-decoration-none text-reset"
                    to={`/candidate/application-detailed-view/${props?.id}`}
                  >
                    View Application
                  </Link>
                </span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="d-flex pb-2 pt-2">
              <div
                className="d-flex gap-2  dark-pink-text"
                onClick={() => {
                  setSmShow(true);
                }}
              >
                {isRetract ? (
                  <img src={icBlackDone} alt="blackdone-icon" className="" />
                ) : (
                  ""
                )}
                <span className={isRetract ? "fw-700" : ""}>
                  Retract Application
                </span>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Modal
          show={smShow}
          onHide={() => setSmShow(false)}
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
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-1"
              onClick={() => setSmShow(false)}
            />
          </Modal.Header>

          <Modal.Body className="ps-4">
            {/*  */}
            <div className="mb-5">
              <h3 className="color-primary fw-700  fs-24">
                {" "}
                Retract Application
              </h3>
              <p className="color-tertiary fs-14 ">
                Are you sure you want to retract your job application?
              </p>
            </div>
          </Modal.Body>

          <Modal.Footer className="modal-dialog-footer d-flex justify-content-end align-items-center gap-2">
            <button
              className="btn retract--cancel-btn fs-12"
              onClick={() => setSmShow(false)}
            >
              Cancel
            </button>
            <button
              className="btn retract-btn fs-12"
              onClick={() => {
                onButtonClick(!isRetract, viewApplication);
                setSmShow(false);
              }}
            >
              Yes Retract
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    </>
  );
};
export default JobCardApplication;
