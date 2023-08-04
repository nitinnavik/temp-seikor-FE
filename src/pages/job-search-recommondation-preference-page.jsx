/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link } from "react-router-dom";
import HeaderTwo from "../components/common/headerTwo";
import Modal from "react-bootstrap/Modal";
import { useStoreActions } from "easy-peasy";
import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import "../styles/welcome.scss";

const JobSearchRecommondationPreferencePage = (props) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const setNewlyRegister = useStoreActions(
    (actions) => actions.setNewlyRegister
  );
  useEffect(() => {
    setNewlyRegister(false);
  }, []);
  return (
    <Modal
      show={props?.show}
      centered
      fullscreen
      className="rounded-0 dialog-wrapper w-100"
    >
      <div className="w-100 bg-white">
        <HeaderTwo
          onDismissDialogClick={() => props?.close()}
          preferencesWelcome={true}
        />
        <Modal.Body className="p-0 m-0 job-preference-dialog-body dialog-body w-100">
          <div className="container pt-md-5 pb-md-5 px-5 ps-lg-0 m-auto job-container w-100">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-4 col-12"></div>
              <div className="col-lg-8 col-12 ">
                <span className="large-text-gray welcome-page-medium-font">
                  {" "}
                  Welcome to Seikor{" "}
                </span>
                <br />
                <label className="color-primary fs-4 fw-600 welcome-page-name-font">
                  {candidateDetails?.userRegistrationDetails?.name}
                </label>
              </div>
            </div>

            <div className="row pt-5 d-flex justify-content-center">
              <div className="col-lg-4 col-12 pt-2 ">
                <img
                  src={require("../assests/images/job-references.png")}
                  alt="job-reference img"
                  className="w-100"
                />
              </div>
              <div className="col-lg-8 col-12 pt-5 pb-5">
                <span className="large-text-gray welcome-page-medium-font">
                  {" "}
                  First thing first,{" "}
                </span>
                <br />
                <span className="gradient-text fw-700 welcome-page-gradient-text">
                  {" "}
                  Add your Job search & <br /> recommendation preferences{" "}
                </span>{" "}
                <br />
                <span className="large-text-dark-gray welcome-page-medium-font">
                  Role | Work Mode | Location | Salary | Skills ++
                </span>
                <br />
                <span className="color-tertiary fw-400 welcome-page-medium-font pt-2">
                  {" "}
                  <img
                    src={require("./../assests/icons/time.png")}
                    width="18px"
                  />{" "}
                  1-2 mins{" "}
                </span>
              </div>
            </div>
          </div>
          <br />
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="bottom-0 start-0 end-0 position-fixed container bg-white pe-5 w-100">
            <div className="d-flex pt-lg-4 pb-lg-4 py-2 pb-4 justify-content-md-end justify-content-between align-items-center welcome-page-footer w-100">
              <button
                onClick={() => props?.close()}
                style={{ border: "none" }}
                className="btn ps-5 medium-text-dark-gray fw-700 col-lg-2  border-none welcome-page-small-font"
              >
                {" "}
                I will add later{" "}
              </button>
              <div className="">
                <button
                  onClick={() => props?.letGo()}
                  className="btn-primary btn-rounded w-100 px-5 text-decoration-none welcome-page-medium-font"
                >
                  {" "}
                  Let's Go
                </button>
              </div>
              {/* <div className="d-lg-none d-block p-3 pb-4 w-100">
                <Link
                  to="/candidate"
                  className="btn-primary btn-rounded ps-5 pe-5 btn-block text-decoration-none d-block text-center"
                >
                  {" "}
                  Verify & Create Account
                </Link>
              </div> */}
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default JobSearchRecommondationPreferencePage;
