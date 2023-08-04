import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import { useStoreActions, useStoreState } from "easy-peasy";
import close from "../../assests/icons/ic-close-24.svg";
import toaster from "./../../utils/toaster";
import { updateRefereePreferences } from "../../_services/member-profile.service";
import MinimumRefferalBonusJobReferralModal from "./add-refferal-bonus-job-referral-modal";
import ExpectedExperienceReferralsPreferencesModal from "./add-referrals-expected-preference-experience";
import AddRoleTeamsJobReferralModal from "./add-role-teams-job-referral-modal";
import AddWorkModeRefrralsPreferencesModal from "./add-workmode-location-job-referal-modal";
import { getLocalStorage } from "./../../utils/storage";
import { USER_ID } from "../../constants/keys";

const RefereeProfileEditDialog = (props) => {
  const totalSlides = 4;
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const [slideIndex, setSlideIndex] = useState(0);

  const [preferedRoles, setPreferedRoles] = useState();
  const [preferedWorkmode, setPreferedWorkmode] = useState();
  const [referralCurrency, setReferralCurrency] = useState();
  const [minReferralBonus, setMinReferralBonus] = useState();
  const [minExperience, setMinExperience] = useState();
  const [maxExperience, setMaxExperience] = useState();
  const [preferedLocation, setPreferedLocation] = useState();
  const [preferedTeams, setPreferedTeams] = useState();

  useEffect(() => {
    setPreferedRoles(
      candidateDetails?.refereePreferencesResponse?.preferedRoles
    );
    setPreferedWorkmode(
      candidateDetails?.refereePreferencesResponse?.preferedWorkmode
    );
    setReferralCurrency(
      candidateDetails?.refereePreferencesResponse?.referralCurrency
    );
    setMinReferralBonus(
      candidateDetails?.refereePreferencesResponse?.minReferralBonus
    );
    setMinExperience(
      candidateDetails?.refereePreferencesResponse?.minExperience
    );
    setMaxExperience(
      candidateDetails?.refereePreferencesResponse?.maxExperience
    );
    setPreferedLocation(
      candidateDetails?.refereePreferencesResponse?.preferedLocation
    );
    setPreferedTeams(
      candidateDetails?.refereePreferencesResponse?.preferedTeams
    );
  }, [candidateDetails]);
  useEffect(() => {
    if (props?.showPageIndex && !props?.isShowFlow) {
      setSlideIndex(props?.showPageIndex);
    }
    // } else {
    //   setSlideIndex(0);
    // }
  }, [props?.showPageIndex, props?.isShowFlow, candidateDetails]);

  const slideAction = (buttonLabel) => {
    if (props.isShowFlow) {
      const currentSlideIndex = slideIndex;
      if (buttonLabel === "Back") {
        if (currentSlideIndex > 0) {
          setSlideIndex(currentSlideIndex - 1);
        }
      }
      console.log(currentSlideIndex + "test");
      if (buttonLabel === "Next" || buttonLabel === "Save") {
        if (currentSlideIndex < totalSlides - 1) {
          setSlideIndex(currentSlideIndex + 1);
        }
        updateRefereePreferences(
          preferedRoles,
          preferedTeams,
          preferedLocation,
          preferedWorkmode,
          referralCurrency,
          minReferralBonus,
          minExperience,
          maxExperience
        )
          .then((res) => {
            if (res.status === 200) {
              toaster("success", "Preferences updated");
            }

            if (buttonLabel === "Next") {
            } else {
              props?.onDismissDialogClick();
            }
            if (buttonLabel === "Save") {
              setSlideIndex(0);
            }
            const userId = getLocalStorage(USER_ID);

            if (buttonLabel === "Save") {
              saveCandidateDetails(userId);
              if (props?.onRefereePreferencesSet) {
                props?.onRefereePreferencesSet();
              }
              if (props?.refreshReferralJobs) {
                props?.refreshReferralJobs();
              }
              if (props?.onPreferencesSaved) {
                props?.onPreferencesSaved();
              }
            }
            if (buttonLabel === "Next") {
              saveCandidateDetails(userId);
              if (props?.onPreferencesSaved) {
                props?.onPreferencesSaved();
              }
            }
          })
          .catch((err) => {
            toaster("error", err);
            if (buttonLabel === "Next") {
            } else {
              props?.onDismissDialogClick();
            }
          });
      }
    }
  };

  return (
    <Modal
      onExit={() => {
        if (props?.onPreferencesSaved) {
          props?.onPreferencesSaved();
        }
      }}
      show={props?.show}
      centered
      fullscreen
      className="rounded-0"
    >
      <Modal.Body
        className="p-0 m-0 job-preference-dialog-body h-100"
        style={{ overflowX: "hidden" }}
      >
        <div
          className={
            props?.isShowFlow
              ? "position-relative job-preferences-progressbar-white-bg-referee"
              : "position-relative"
          }
        >
          <div className="job-preference-dialog-close">
            <img
              src={close}
              alt="close-icon"
              className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round dialog-close-btn pointer"
              onClick={() => {
                props?.onDismissDialogClick();
                if (props.isShowFlow) {
                  setSlideIndex(0);
                }
                const userId = getLocalStorage(USER_ID);
                if (userId) {
                  saveCandidateDetails(userId);
                  if (props?.onRefereePreferencesSet) {
                    props?.onRefereePreferencesSet();
                  }
                  if (props?.refreshReferralJobs) {
                    props?.refreshReferralJobs();
                  }
                }
              }}
            />
          </div>
          {props?.isShowFlow ? (
            <div className="job-preference-progressbar-wrapper">
              <div className=" row justify-content-center p-5 gap-2 job-search-preferences-progressbars">
                {[
                  "progress-bar-first",
                  "progress-bar-second",
                  "progress-bar-third",
                  "progress-bar-forth",
                ].map((progressGradient, index) => {
                  return (
                    <div
                      className={
                        (index < slideIndex
                          ? progressGradient
                          : "progress-bar-blank") + " col-2 rounded-pill p-0"
                      }
                      key={index}
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
        <Carousel
          indicators={false}
          controls={false}
          activeIndex={slideIndex}
          className="p-0 m-0 h-100"
          interval={null}
          slide={props?.isShowFlow}
        >
          <Carousel.Item className="job-preference-first-screen h-100">
            <AddRoleTeamsJobReferralModal
              setPreferedRoles={setPreferedRoles}
              setPreferedTeams={setPreferedTeams}
            />
            {/* <div
              style={{ height: "450px" }}
              className="mb-5 pb-5 job-preference-first-screen"
            ></div> */}
          </Carousel.Item>
          <Carousel.Item>
            <AddWorkModeRefrralsPreferencesModal
              setPreferedLocation={setPreferedLocation}
              setPreferedWorkmode={setPreferedWorkmode}
            />
          </Carousel.Item>
          <Carousel.Item>
            <MinimumRefferalBonusJobReferralModal
              setMinReferralBonus={setMinReferralBonus}
              setReferralCurrency={setReferralCurrency}
            />
          </Carousel.Item>
          <Carousel.Item>
            <ExpectedExperienceReferralsPreferencesModal
              setMinExperience={setMinExperience}
              setMaxExperience={setMaxExperience}
              minExperience={minExperience}
              maxExperience={maxExperience}
            />
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
          onClick={() =>
            slideAction(
              props?.isShowFlow === true && slideIndex !== totalSlides - 1
                ? "Next"
                : "Save"
            )
          }
        >
          {props?.isShowFlow === true && slideIndex !== totalSlides - 1
            ? "Save & Next"
            : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RefereeProfileEditDialog;
