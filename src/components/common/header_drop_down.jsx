import myView from "../../assests/icons/my-view.svg";
import myProfile from "../../assests/icons/my-profile.svg";
import savedJobs from "../../assests/icons/saved-jobs.svg";
import recommendedJobs from "../../assests/icons/recommended-jobs.svg";
import job_search_preference from "../../assests/icons/job-search-icon.svg";
import setting from "../../assests/icons/setting.svg";
import logOut from "../../assests/icons/log-out.svg";
import { useNavigate } from "react-router";
import {
  CANDIDATE_ABOUT_ME_PAGE_ROUTE,
  CANDIDATE_ACCOUNT_PAGE_ROUTE,
  CANDIDATE_MY_VIEW_PAGE_ROUTE,
  CANDIDATE_RECOMMENDED_JOBS_PAGE_ROUTE,
  JOB_SEARCH_PREFERENCES_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE,
  REFEREE_SAVED_JOBS_PAGE_ROUTE,
  SAVED_JOBS_PAGE_ROUTE,
} from "../../constants/page-routes";
import { logout } from "../../_services/auth.service";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import RefereeProfileEditDialog from "../referrals-preferences-edit/referrals-preferences-edit-dialog";
import { useStoreActions } from "easy-peasy";

const HeaderDropDown = (props) => {
  const navigate = useNavigate();

  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        props?.show &&
        ref?.current &&
        !ref?.current?.contains(e?.target) &&
        !props?.parentRef?.current?.contains(e?.target)
      ) {
        props.onProfileDropdownClose();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [props.show]);

  const clearCandidateDetails = useStoreActions(
    (actions) => actions.candidate.clearCandidateData
  );

  return (
    <>
      <div
        className="header-dropdown-container fw-400 fs-12 position-absolute mt-2"
        ref={ref}
      >
        <div className="header-two-container">
          <div
            onClick={() => {
              navigate(CANDIDATE_MY_VIEW_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer"
          >
            <div className="row">
              <div className="col-2 pb-2 icon-positioning">
                <img src={myView} alt="My View" />
              </div>
              <div className="col-10 pb-2 px-0 ">
                <Link
                  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  My View
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div
            onClick={() => {
              navigate(CANDIDATE_ABOUT_ME_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer pb-0"
          >
            <div className="row">
              <div className="col-2 pb-2 icon-positioning">
                <img src={myProfile} alt="My Profile" />
              </div>
              <div className="col-10 pb-3 px-0">
                <Link
                  to={CANDIDATE_ABOUT_ME_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="header-two-container">
          <div
            onClick={() => {
              navigate(SAVED_JOBS_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning">
                <img src={savedJobs} alt="Saved Jobs" />
              </div>
              <div className="col-10 pb-2 px-0">
                <Link
                  to={SAVED_JOBS_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Saved Jobs - For Application
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div
            onClick={() => {
              navigate(REFEREE_SAVED_JOBS_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer pb-0"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning"></div>
              <div className="col-10 pb-3 px-0">
                <Link
                  to={REFEREE_SAVED_JOBS_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Saved Jobs - For Referral{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="header-two-container">
          <div
            onClick={() => {
              navigate(CANDIDATE_RECOMMENDED_JOBS_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer pointer"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning">
                <img src={recommendedJobs} alt="Recommended Jobs" />
              </div>
              <div className="col-10 pb-2 px-0">
                <Link
                  to={CANDIDATE_RECOMMENDED_JOBS_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Recommended Jobs
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div
            onClick={() => {
              navigate(REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer pb-0"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning"></div>
              <div className="col-10 pb-3 px-0">
                <Link
                  to={REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Refer these Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="header-two-container">
          <div
            onClick={() => {
              navigate(JOB_SEARCH_PREFERENCES_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning">
                <img src={job_search_preference} alt="job Search preference" />
              </div>
              <div className="col-10 pb-2 px-0">
                <Link
                  to={JOB_SEARCH_PREFERENCES_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Job Search Preferences
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div
            onClick={() => {
              if (props?.setShowRefereePreferencesDialog) {
                props?.setShowRefereePreferencesDialog(true);
              }
            }}
            className="header-dropdown-subcontainer pointer pb-0"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning"></div>
              <div className="col-10 pb-3 px-0">
                <div className="text-decoration-none referee-hover color-primary pointer">
                  Referee Preferences
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-two-container">
          <div
            onClick={() => {
              navigate(CANDIDATE_ACCOUNT_PAGE_ROUTE);
              props?.onProfileDropdownClose();
            }}
            className="header-dropdown-subcontainer pointer"
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning">
                <img src={setting} alt="Setting" />
              </div>
              <div className="col-10 pb-2 px-0">
                <Link
                  to={CANDIDATE_ACCOUNT_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  // onClick={() => props.onProfileDropdownClose()}
                >
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div
            className="header-dropdown-subcontainer pb-0 pointer"
            onClick={() => {
              logout();
              clearCandidateDetails();
              navigate(LOGIN_PAGE_ROUTE);
            }}
          >
            <div className="row ">
              <div className="col-2 pb-2 icon-positioning">
                <img src={logOut} alt="Log Out" />
              </div>
              <div className="col-10 pb-3 px-0 ">
                <Link
                  to={LOGIN_PAGE_ROUTE}
                  className="text-decoration-none color-primary"
                  onClick={() => {
                    props.onProfileDropdownClose();
                  }}
                >
                  Log out
                </Link>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};
export default HeaderDropDown;
