import React, { useEffect, useRef, useState } from "react";
import privacy from "../../../assests/icons/privacy.svg";
import Form from "react-bootstrap/Form";
import { updatePrivacy } from "../../../_services/member-profile.service";
import Loader from "../../../components/common/loader";
import toaster from "../../../utils/toaster";
import { useStoreActions, useStoreState } from "easy-peasy";
import { USER_ID } from "../../../constants/keys";
import { getLocalStorage } from "../../../utils/storage";
import { updateNotificationPreference } from "../../../_services/member-profile.service";

const Privacy = (props) => {
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const userPrivacySettings = useStoreState(
    (state) => state?.candidate?.candidateDetails?.userPrivacySettings
  );
  const accountNotificationPreferencesResponse = useStoreState(
    (state) =>
      state?.candidate?.candidateDetails?.accountNotificationPreferencesResponse
  );
  const [showLoader, setShowLoader] = useState(false);
  const [checkboxs, setCheckbox] = useState("");
  const isMounted = useRef(false);

  const updatePrivacySettings = (changefeild, changeValue) => {
    const temp = { ...userPrivacySettings };
    temp[changefeild] = changeValue;
    setShowLoader(true);
    updatePrivacy(
      temp?.location,
      temp?.workHistory,
      temp?.education,
      temp?.workStatus,
      temp?.email,
      temp?.whatsApp
    )
      .then((res) => {
        const userId = getLocalStorage(USER_ID);
        if (userId) {
          saveCandidateDetails(userId);
        }
        toaster("success", "Saved successfully!");
        setShowLoader(false);
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("error", err);
      });
  };
  // const updateNotificationPreferenceSettings = (changefeild, changeValue) => {
  //   const temp = { ...userPrivacySettings };
  //   temp[changefeild] = changeValue;
  //   setShowLoader(true);
  //   updateNotificationPreference(
  //     temp?.updateOnEmail,
  //     temp?.updateOnWhatsApp,
  //     temp?.updateOnSms
  //   )
  //     .then((res) => {
  //       const userId = getLocalStorage(USER_ID);
  //       if (userId) {
  //         saveCandidateDetails(userId);
  //       }
  //       toaster("success", "Saved successfully!");
  //       setShowLoader(false);
  //     })
  //     .catch((err) => {
  //       setShowLoader(false);
  //       toaster("error", err);
  //     });
  // };

  return (
    <>
      {showLoader && <Loader />}
      <div className="row">
        <div className="col-lg-7">
          <div className="my-3">
            <div className="fw-bold" style={{ fontSize: "24px" }}>
              <img src={privacy} className="me-2" alt="Privacy Logo" />
              Privacy
            </div>
            <div className="card-content ms-4 mt-2">
              Choose what information from your profile is visible publically
            </div>
          </div>
          <div className="card-parent-container ms-lg-4">
            <div className="card-container fw-14 fw-400">
              <div className="m-3 mb-0 p-1">Location</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
                <input
                  class="form-check-input outline-none"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.location}
                  onChange={(e) => {
                    updatePrivacySettings("location", e.target.checked);
                  }}
                />
              </Form>
            </div>
            <div className="card-container">
              <div className="m-3 mb-0 p-1">Work History</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
              <input class="form-check-input outline-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.workHistory}
                  onChange={(e) =>
                    updatePrivacySettings("workHistory", e.target.checked)
                  }
                />
              </Form>
            </div>
            <div className="card-container">
              <div className="m-3 mb-0 p-1">Education</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
              <input class="form-check-input  outline-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.education}
                  onChange={(e) =>
                    updatePrivacySettings("education", e.target.checked)
                  }
                />
              </Form>
            </div>
            <div className="card-container">
              <div className="m-3 mb-0 p-1">Work Status</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
              <input class="form-check-input outline-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.workStatus}
                  onChange={(e) =>
                    updatePrivacySettings("workStatus", e.target.checked)
                  }
                />
              </Form>
            </div>
          </div>
          <div className="card-content ms-4 mt-2">
            How would you like to receive notifications?
          </div>
          <div className="card-parent-container ms-lg-4">
            <div className="card-container">
              <div className="m-3 mb-0 p-1">Email</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
              <input class="form-check-input outline-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.email}
                  onChange={(e) =>
                    updatePrivacySettings("email", e.target.checked)
                  }
                />
              </Form>
            </div>
            <div className="card-container">
              <div className="m-3 mb-0 p-1">Whatsapp</div>
              {/* <div className="form-check form-switch m-3 mb-0 p-1">
              <input class="form-check-input outline-none" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div> */}
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="m-3 mb-0 p-1"
                  checked={userPrivacySettings?.whatsApp}
                  onChange={(e) =>
                    updatePrivacySettings("whatsApp", e.target.checked)
                  }
                />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Privacy;
