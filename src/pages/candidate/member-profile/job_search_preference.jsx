import React, { useState } from "react";
import jobLogo from "../../../assests/icons/job-search-preference.svg";

import editIcon from "../../../assests/icons/edit-icon.svg";
import JobSearchPreferenceDialog from "../../../components/job_search_preference_dialog";
import { useStoreState } from "easy-peasy";

const JobSearchPreference = (props) => {
  const userJobPreferences = useStoreState(
    (state) => state?.candidate?.candidateDetails?.userJobPreferences
  );
  const [showJobPreferences, setShowJobPreferences] = useState(false);
  const [currentIndexShowPage, setCurrentIndexShowPage] = useState(0);

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="my-3">
            <div className="fw-bold" style={{ fontSize: "24px" }}>
              <img src={jobLogo} className="me-2" alt="Skill Logo" />
              Job Search Preference
            </div>
          </div>
          <div className="card-parent-container mb-4">
            <div className="card-container">
              <div className="ps-4 pt-3">
                <div className="title-card">Roles & Team</div>
                <div className="pb-3">
                  {userJobPreferences?.preferedRoles?.length > 0 ? (
                    userJobPreferences?.preferedRoles.map((role) => {
                      if (role !== "") {
                        return (
                          <span className="me-2 card-badge-blue">{role} </span>
                        );
                      }
                      //  else {
                      //   return <small>no roles is selected</small>;
                      // }
                    })
                  ) : (
                    <small style={{ color: "#808080" }}>
                      No roles is selected
                    </small>
                  )}

                  <br />
                  {userJobPreferences?.preferedTeams?.length > 0 ? (
                    userJobPreferences?.preferedTeams?.map((role) => {
                      if (role !== "") {
                        return (
                          <span className="me-2 card-badge2">{role} </span>
                        );
                      }
                      //  else {
                      //   return <small>no team is selected</small>;
                      // }
                    })
                  ) : (
                    <small style={{ color: "#808080" }}>
                      No team is selected
                    </small>
                  )}
                </div>
              </div>

              <div className="pt-2 pe-2">
                <img
                  src={editIcon}
                  alt="Edit Button"
                  onClick={() => {
                    setCurrentIndexShowPage(0);
                    setShowJobPreferences(true);
                  }}
                  className="edit-button pointer"
                />
              </div>
            </div>
            <div className="card-container">
              <div className="ps-4 pt-3">
                <div className="title-card">Work Mode & Location</div>
                <div className="pb-3">
                  {userJobPreferences?.preferedWorkmode?.length > 0 ? (
                    userJobPreferences?.preferedWorkmode?.map((mode) => {
                      if (mode !== "") {
                        return (
                          <span className="me-2 card-badge-blue">{mode} </span>
                        );
                      }
                      // else {
                      //   return <small>no workmode is selected</small>;
                      // }
                    })
                  ) : (
                    <small style={{ color: "#808080" }}>
                      No workmode is selected
                    </small>
                  )}
                  <br />
                  {userJobPreferences?.preferedLocation?.length > 0 ? (
                    userJobPreferences?.preferedLocation.map((mode) => {
                      if (mode !== "") {
                        return (
                          <span className="me-2 card-badge2">{mode} </span>
                        );
                      }
                      // else {
                      //   return <small>no location is selected</small>;
                      // }
                    })
                  ) : (
                    <small style={{ color: "#808080" }}>
                      No location is selected
                    </small>
                  )}
                </div>
              </div>
              <div className="pt-2 pe-2">
                <img
                  src={editIcon}
                  alt="Edit Button"
                  onClick={() => {
                    setCurrentIndexShowPage(1);
                    setShowJobPreferences(true);
                  }}
                  className="edit-button pointer"
                />
              </div>
            </div>
            <div className="card-container">
              <div className="ps-4 pt-3">
                <div className="title-card">Expected Salary</div>
                {userJobPreferences?.expectedSalary ? (
                  <div className="card-content">Minimum Salary</div>
                ) : (
                  ""
                )}
                <div className="card-subtitle large-text-gray fs-14  pb-3">
                  {userJobPreferences?.expectedSalary ? (
                    `${
                      userJobPreferences?.salaryCurrency
                        ? userJobPreferences?.salaryCurrency
                        : ""
                    }
                  ${userJobPreferences?.expectedSalary} CTC${
                      userJobPreferences?.salaryType == "ANNUAL"
                        ? "/year"
                        : userJobPreferences?.salaryType == "MONTHLY"
                        ? "/month"
                        : ""
                    }`
                  ) : (
                    <small style={{ color: "#808080" }}>
                      Expected salary is not added
                    </small>
                  )}
                </div>
              </div>
              <div className="pt-2 pe-2">
                <img
                  src={editIcon}
                  size="lg"
                  fullscreen="xxl-down"
                  alt="Edit Button"
                  className="edit-button pointer"
                  onClick={() => {
                    setCurrentIndexShowPage(2);
                    setShowJobPreferences(true);
                  }}
                />
              </div>
            </div>
            <div className="card-container">
              <div className="ps-4 pt-3">
                <div className="title-card">Experience</div>
                <div className="card-subtitle large-text-gray fs-14 pb-3">
                  {userJobPreferences?.minExperience &&
                  userJobPreferences?.maxExperience ? (
                    `${userJobPreferences?.minExperience}
                  - ${userJobPreferences?.maxExperience} years`
                  ) : (
                    <small>Minimum and Maximum experience are not added.</small>
                  )}
                </div>
              </div>
              <div className="pt-2 pe-2">
                <img
                  src={editIcon}
                  alt="Edit Button"
                  className="edit-button pointer"
                  onClick={() => {
                    setCurrentIndexShowPage(3);
                    setShowJobPreferences(true);
                  }}
                />
              </div>
            </div>
            <div className="card-container">
              <div className="ps-4 pt-3">
                <div className="title-card">Dream Company</div>

                <div className="pb-3">
                  {userJobPreferences?.dreamCompany &&
                  userJobPreferences?.dreamCompany?.length > 0 ? (
                    userJobPreferences?.dreamCompany?.map((dream) => {
                      if (dream) {
                        return <span className="card-badge2">{dream}</span>;
                      }
                      //  else {
                      //   return <small>no dream is selected</small>;
                      // }
                    })
                  ) : (
                    <small style={{ color: "#808080" }}>
                      No dream company is selected
                    </small>
                  )}
                </div>
              </div>
              <div className="pt-2 pe-2">
                <img
                  src={editIcon}
                  size="lg"
                  fullscreen="xxl-down"
                  alt="Edit Button"
                  className="edit-button pointer"
                  onClick={() => {
                    setCurrentIndexShowPage(4);
                    setShowJobPreferences(true);
                  }}
                />
              </div>
            </div>
          </div>
          {/* Modal Starts from here */}
          <JobSearchPreferenceDialog
            show={showJobPreferences}
            isShowFlow={false}
            setShowJobPreferences={setShowJobPreferences}
            showPageIndex={currentIndexShowPage}
            onDismissDialogClick={() => {
              setShowJobPreferences(false);
            }}
            setCurrentIndexShowPage={setCurrentIndexShowPage}
          />
          {/* Modal Ends here */}
        </div>
      </div>
    </>
  );
};

export default JobSearchPreference;
