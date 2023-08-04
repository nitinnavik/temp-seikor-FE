import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import close from "../assests/icons/ic-close-24.svg";
import AddRoleJobPreference from "../components/AddRoleJobPreference";
import DreamCompany from "../components/DreamCompaniesDialog";
import ExpectedMinimumSalaryDialog from "../components/ExpectedMinimumSalaryDialog";
import JobPreferenceExperience from "../components/JobPreferenceExperience";
import WorkModeJobPreference from "../components/WorkModeJobPreference";
import { updateJobPreferences } from "../_services/member-profile.service";
import { useStoreActions, useStoreState } from "easy-peasy";
import toaster from "./../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import { STATUS_SUCCESS, USER_ID } from "../constants/keys";
import { GENERAL_ERROR_MESSAGE } from "../constants/message";

const JobSearchPreferenceDialog = (props) => {
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const [slideIndex, setSlideIndex] = useState(0);

  const [preferedRoles, setPreferedRoles] = useState();
  const [preferedWorkmode, setPreferedWorkmode] = useState();
  const [salaryCurrency, setSalaryCurrency] = useState();
  const [expectedSalary, setExpectedSalary] = useState();
  const [salaryType, setSalaryType] = useState();
  const [minExperience, setMinExperience] = useState();
  const [maxExperience, setMaxExperience] = useState();
  const [preferedLocation, setPreferedLocation] = useState();
  const [preferedTeams, setPreferedTeams] = useState();
  const [dreamCompany, setDreamCompany] = useState();

  useEffect(() => {
    setPreferedRoles(candidateDetails?.userJobPreferences?.preferedRoles);
    setPreferedWorkmode(candidateDetails?.userJobPreferences?.preferedWorkmode);
    setSalaryCurrency(candidateDetails?.userJobPreferences?.salaryCurrency);
    setExpectedSalary(candidateDetails?.userJobPreferences?.expectedSalary);
    setSalaryType(candidateDetails?.userJobPreferences?.salaryType);
    setMinExperience(candidateDetails?.userJobPreferences?.minExperience);
    setMaxExperience(candidateDetails?.userJobPreferences?.maxExperience);
    setPreferedLocation(candidateDetails?.userJobPreferences?.preferedLocation);
    setPreferedTeams(candidateDetails?.userJobPreferences?.preferedTeams);
    setDreamCompany(candidateDetails?.userJobPreferences?.dreamCompany);
  }, [candidateDetails]);
  // console.log(Number.isInteger(expectedSalary) + "  value");
  useEffect(() => {
    if (props.showPageIndex && !props.isShowFlow) {
      setSlideIndex(props.showPageIndex);
    }
    // } else {
    //   setSlideIndex(0);
    // }
  }, [props.showPageIndex, props.isShowFlow, candidateDetails]);

  const slideAction = (buttonLabel) => {
    const totalSlides = 5;
    if (props.isShowFlow) {
      const currentSlideIndex = slideIndex;
      if (buttonLabel === "Back") {
        if (currentSlideIndex > 0) {
          setSlideIndex(currentSlideIndex - 1);
        }
      }

      if (buttonLabel === "Next" || buttonLabel === "Save") {
        if (currentSlideIndex < totalSlides - 1) {
          setSlideIndex(currentSlideIndex + 1);
        }
        if (slideIndex == 2) {
          // if (expectedSalary <= 0) {
          //   toaster(
          //     "error",
          //     "Expected salary can not be negative and not be zero"
          //   );
          //   return;
          // }
          if (expectedSalary % 1 != 0) {
            toaster("error", "Expected salary can not be decimal");
            return;
          }
          if (expectedSalary != 0 && (!salaryType || salaryType == "")) {
            toaster("error", "Select salary type");
            return;
          }
        }
        updateJobPreferences(
          preferedRoles,
          preferedTeams,
          preferedLocation,
          preferedWorkmode,
          salaryCurrency?.toString(),
          expectedSalary,
          salaryType,
          minExperience,
          maxExperience,
          dreamCompany
        )
          .then((res) => {
            if (res.status === 200 || res?.status == STATUS_SUCCESS) {
              toaster("success", "Preferences updated");
            } else {
              toaster(
                "error",
                res?.message ? res?.message : GENERAL_ERROR_MESSAGE
              );
            }
            if (buttonLabel === "Next") {
            } else {
              props.onDismissDialogClick();
            }
            if (buttonLabel === "Save") {
              setSlideIndex(0);
            }
            const userId = getLocalStorage(USER_ID);
            if (userId && buttonLabel === "Save") {
              saveCandidateDetails(userId);
            }
            if (userId && buttonLabel === "Next") {
              saveCandidateDetails(userId);
            }
          })
          .catch((err) => {
            toaster(
              "error",
              err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            );
            if (buttonLabel === "Next") {
            } else {
              props.onDismissDialogClick();
            }
          });
      }
    } else if (props.isShowFlow === false) {
      if (buttonLabel === "Cancel") {
        props.onDismissDialogClick();
        return;
      }

      if (minExperience < 0 || maxExperience < 0) {
        toaster("error", "Experience cannot be negative");
        return;
      }

      if (maxExperience < minExperience) {
        toaster(
          "error",
          "Minimum experience cannot be greater than maximum experience"
        );
        return;
      }
      if (slideIndex == 2) {
        // if (expectedSalary <= 0) {
        //   toaster(
        //     "error",
        //     "Expected salary can not be negative and not be zero"
        //   );
        //   return;
        // }
        if (expectedSalary % 1 != 0) {
          toaster("error", "Expected salary can not be decimal");
          return;
        }
        if (expectedSalary != 0 && (!salaryType || salaryType == "")) {
          toaster("error", "Select salary type");
          return;
        }
      }

      // if (buttonLabel === "Save") {
      // }
      updateJobPreferences(
        preferedRoles,
        preferedTeams,
        preferedLocation,
        preferedWorkmode,
        salaryCurrency?.toString(),
        expectedSalary,
        salaryType,
        minExperience,
        maxExperience,
        dreamCompany
      )
        .then((res) => {
          if (res.status === 200 || res?.status == STATUS_SUCCESS) {
            const userId = getLocalStorage(USER_ID);
            saveCandidateDetails(userId);
            toaster("success", "Preferences updated");
          } else {
            toaster(
              "error",
              res?.message ? res?.message : GENERAL_ERROR_MESSAGE
            );
          }
          // const userId = getLocalStorage(USER_ID);

          // if (userId) {
          //   console.log("save candidate details called");
          //   saveCandidateDetails(userId);
          // }
          props.onDismissDialogClick();
        })
        .catch((err) => {
          toaster("error", err?.message ? err?.message : GENERAL_ERROR_MESSAGE);
          props.onDismissDialogClick();
        });
      // }
    }
  };

  return (
    <Modal
      onExit={() => {
        setSlideIndex(0);
        if (props?.onPreferencesSaved) {
          props?.onPreferencesSaved();
        }
      }}
      show={props?.show}
      centered
      fullscreen
      className="rounded-0 "
    >
      <Modal.Body className="p-0 m-0 job-preference-dialog-body job-preference-second-screen">
        <div
          className={
            props.isShowFlow
              ? "position-relative job-preferences-progressbar-white-bg"
              : "position-relative"
          }
        >
          <div className="bg-light w-100">
            <div className="job-preference-dialog-close">
              <img
                src={close}
                alt="close-icon"
                className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round dialog-close-btn pointer"
                onClick={() => {
                  props?.onDismissDialogClick();
                  props?.setCurrentIndexShowPage(null);
                  if (props.isShowFlow) {
                    setSlideIndex(0);
                  }
                }}
              />
            </div>
            {props.isShowFlow ? (
              <div className="job-preference-progressbar-wrapper overflow-hidden">
                <div className=" row justify-content-center pt-5 gap-2 mb-3 job-search-preferences-progressbars">
                  {[
                    "progress-bar-first",
                    "progress-bar-second",
                    "progress-bar-third",
                    "progress-bar-forth",
                    "progress-bar-fifth",
                  ].map((progressGradient, index) => {
                    return (
                      <div
                        className={
                          (index < slideIndex
                            ? progressGradient
                            : "progress-bar-blank") + " col-2 rounded-pill p-0"
                        }
                      >
                        {index === slideIndex ? (
                          <div className={progressGradient + " w-25 p-2"}></div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Carousel
          indicators={false}
          controls={false}
          activeIndex={slideIndex}
          className="p-0 m-0"
          interval={null}
          slide={props.isShowFlow}
        >
          <Carousel.Item className="">
            <AddRoleJobPreference
              setPreferedRoles={setPreferedRoles}
              setPreferedTeams={setPreferedTeams}
            />
            <div
              style={{ height: "130px" }}
              className="pb-5 job-preference-first-screen"
            ></div>
          </Carousel.Item>
          <Carousel.Item>
            <WorkModeJobPreference
              setPreferedLocation={setPreferedLocation}
              setPreferedWorkmode={setPreferedWorkmode}
            />
            <div className="pb-5 job-preference-second-screen second-screen-div"></div>
          </Carousel.Item>
          <Carousel.Item>
            <ExpectedMinimumSalaryDialog
              setExpectedSalary={setExpectedSalary}
              setSalaryCurrency={setSalaryCurrency}
              salaryType={salaryType}
              setSalaryType={setSalaryType}
            />
          </Carousel.Item>
          <Carousel.Item>
            <JobPreferenceExperience
              setMinExperience={setMinExperience}
              setMaxExperience={setMaxExperience}
              minExperience={minExperience}
              maxExperience={maxExperience}
            />
          </Carousel.Item>
          <Carousel.Item>
            <DreamCompany setDreamCompany={setDreamCompany} />
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
      <Modal.Footer className=" d-flex justify-content-center gap-2 align-content-end job-preference-dialog-footer">
        {slideIndex === 0 ? (
          ""
        ) : (
          <button
            className="btn btn-rounded bg-white text-primary fw-700 fs-16 job-preference-btn"
            style={{ border: "1px solid #0B44D8" }}
            onClick={() => slideAction(props?.isShowFlow ? "Back" : "Cancel")}
          >
            {props?.isShowFlow ? "Back" : "Cancel"}
          </button>
        )}
        <button
          className="btn btn-rounded btn-primary fw-700 fs-16 job-preference-btn"
          onClick={() => {
            slideAction(
              props.isShowFlow === true && slideIndex !== 4 ? "Next" : "Save"
            );
          }}
        >
          {props.isShowFlow === true && slideIndex !== 4
            ? "Save & Next"
            : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobSearchPreferenceDialog;
