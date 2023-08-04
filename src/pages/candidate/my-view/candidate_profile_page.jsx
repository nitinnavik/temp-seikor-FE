import React, { useState, useEffect, useRef } from "react";
import { HashRouter, Link, useLocation } from "react-router-dom";
import ProfileHeader from "../../../components/ProfileHeader";
import ProfileSwitcher from "../../../components/ProfileSwitcher";
import JobCardCompany from "../../../components/JobCardCompany";
import CardReferred from "../../../components/CardReferred";
import ScreenNotification from "../../../components/ScreenNotification";
import referredJobsIcon from "./../../../assests/icons/ic-referred-jobs.svg";
import recommendedJobsIcon from "./../../../assests/icons/ic-recommended-jobs.svg";
import saveJobsTitleIcon from "./../../../assests/icons/ic-save-jobs.svg";
import applicationsIcon from "./../../../assests/icons/ic-applications.svg";
import settingIcon from "./../../../assests/icons/ic-setting.svg";
import editIcon from "./../../../assests/icons/ic-edit.svg";
import yourReferralIcon from "./../../../assests/icons/ic-your-referral.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import { APPLY_STATUS, USER_ID } from "../../../constants/keys";
import Loader from "../../../components/common/loader";
import SavedJobs from "../../../components/SavedJobs";
import ApplicationsData from "../../../components/my_applications";
import {
  fetchRefereeReferrals,
  getRefferedJobs,
} from "../../../_services/job.service";
import RefferedJob from "../../../components/reffered_job";
import ReccommendedJob from "../../../components/recommended_jobs";
import { fetchRefereeOverview } from "../../../_services/job.service";
import RefreeSavedJobs from "../../../components/refree_saved_jobs";
import RefreeReferredJobs from "../../../components/refree_referred_jobs";
import JobSearchPreferenceDialog from "../../../components/job_search_preference_dialog";
import RefereeReferrals from "../../../components/referee_referrals";
import RefereeProfileEditDialog from "./../../../components/referrals-preferences-edit/referrals-preferences-edit-dialog";
import ReferAJobDialog from "../../../components/refer_a_job_dialog";
import { isEmpty } from "../../../utils/form_validators";
import {
  convertToInternationalCurrencySystem,
  isCheckValue,
} from "./../../../utils/utils";
import toaster from "../../../utils/toaster";
import RefereeReferralsComponent from "../../../components/referee_referrals";
import JobSearchRecommondationPreferencePage from "./../../job-search-recommondation-preference-page";
import ProgressBar from "react-bootstrap/ProgressBar";
import { REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE } from "../../../constants/page-routes";
import { NOT_APPLICABLE, NOT_MENTIONED } from "../../../constants/message";
import NotFoundPage from "../../not_found_page";

const CandidateProfilePage = () => {
  const isNewlyRegistered = useStoreState((state) => state.isNewlyRegistered);
  const [profileSwitcher, setProfileSwitcher] = useState("candidate");
  const [savedJobsCount, setSavedJobsCount] = useState(null);
  const [isViewAll] = useState(false);
  const [refferedJobCount, setRefferedJobCount] = useState(null);
  const [checkRefferedJobCount, setCheckRefferedJobCount] = useState(1);
  const [recommendedJobsCount, setRecommendedJobsCount] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [appliedJobsCount, setAppliedJobsCount] = useState(null);
  const [refereeOverview, setRefereeOverview] = useState({});
  const [refreeSavedJobsCount, setRefreeSavedJobsCount] = useState(null);
  const [welcomePageShow, setWelcomePageShow] = useState(isNewlyRegistered);
  const [newJobCount, setNewJobCount] = useState();
  const [referralreferredJobCount, setReferralreferredJobCount] =
    useState(null);
  const [referralsCount, setReferralsCount] = useState(null);
  const [currentIndexShowPage, setCurrentIndexShowPage] = useState(0);
  const [showJobPreferences, setShowJobPreferences] = useState(false);

  const [viewReferralPreferencesModal, setViewReferralPreferencesModal] =
    useState(false);
  let [isShowfirstPrompt, setIsShowfirstPrompt] = useState(false);
  let [isShowSecondPrompt, setIsShowSecondPrompt] = useState(false);
  let [isShowThirdPrompt, setIsShowThirdPrompt] = useState(false);
  let [isShowfourthPrompt, setIsShowfourthPrompt] = useState(false);

  // Refer Job part

  const [referJobShow, setReferJobShow] = useState(false);
  const [referButtonClicked, setReferButtonClicked] = useState(false);
  const [disableReferralBtn, setDisableReferralBtn] = useState(true);
  const [jobIdProps, setJobIdProps] = useState(null);
  const [jobDetailsProps, setJobDetailsProps] = useState({
    jobTitle: "",
    companyName: "",
    companyLogo: "",
  });
  const [referredJobsList, setReferredJobsList] = useState([]);
  const [referralEarnedObject, setReferralEarnedObject] = useState(null);

  const savedJobsRef = useRef();
  const appliedJobsRef = useRef();
  const referredJobsRef = useRef();
  const recommendedRef = useRef();
  const referralsRef = useRef();
  const refereeReferrredJobRef = useRef();
  const refereeSavedJobRef = useRef();
  const setNonLoginReferData = useStoreActions(
    (actions) => actions?.setNonLoginReferData
  );
  const refreshList = () => {
    savedJobsRef?.current?.refresh();
    appliedJobsRef?.current?.refresh();
    referredJobsRef?.current?.refresh();
    recommendedRef?.current?.refresh();
    referralsRef?.current?.refresh();
    refereeReferrredJobRef?.current?.refresh();
    refereeSavedJobRef?.current?.refresh();
  };

  const fetchReferee = () => {
    fetchRefereeOverview().then(
      (res) => {
        if (!isEmpty(res)) {
          setRefereeOverview(res?.data?.data);
        } else {
          setRefereeOverview([]);
          setShowLoader(false);
        }
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const PAGE_SIZE = 6;
  const checkProgressPercentagePreferences = () => {
    if (candidateDetails) {
      let percentage = {
        role: 0,
        teams: 0,
        workmode: 0,
        location: 0,
        bonusandcurrency: 0,
        minandmaxexp: 0,
      };
      let preferencesRemain = {
        role: 0,
        teams: 0,
        workmode: 0,
        location: 0,
        bonusandcurrency: 0,
        minandmaxexp: 0,
      };
      let errorMessage = "";

      // preferences percentage
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedRoles
        )
      ) {
        percentage.role = 16.66666666666667;
      } else {
        errorMessage = "Add Role";
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedTeams
        )
      ) {
        percentage.teams = 16.66666666666667;
      } else {
        errorMessage = "Add Teams";
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedWorkmode
        )
      ) {
        percentage.workmode = 16.66666666666667;
      } else {
        errorMessage = "Add Workmode";
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedLocation
        )
      ) {
        percentage.location = 16.66666666666667;
      } else {
        errorMessage = "Add Location";
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.minReferralBonus &&
            candidateDetails?.refereePreferencesResponse?.referralCurrency
        )
      ) {
        percentage.bonusandcurrency = 16.66666666666667;
      } else {
        errorMessage = "Add Bonus and Currency";
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.minExperience &&
            candidateDetails?.refereePreferencesResponse?.maxExperience
        )
      ) {
        percentage.minandmaxexp = 16.66666666666667;
      } else {
        errorMessage = "Add Minimum and Maximum Experience";
      }

      // preferences remaining
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedRoles
        )
      ) {
        preferencesRemain.role = 1;
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedTeams
        )
      ) {
        preferencesRemain.teams = 1;
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedWorkmode
        )
      ) {
        preferencesRemain.workmode = 1;
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.preferedLocation
        )
      ) {
        preferencesRemain.location = 1;
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.minReferralBonus &&
            candidateDetails?.refereePreferencesResponse?.referralCurrency
        )
      ) {
        preferencesRemain.bonusandcurrency = 1;
      }
      if (
        isCheckValue(
          candidateDetails?.refereePreferencesResponse?.minExperience &&
            candidateDetails?.refereePreferencesResponse?.maxExperience
        )
      ) {
        preferencesRemain.minandmaxexp = 1;
      }

      // console.log(roleAndTeams);
      let finalPercent =
        percentage.role +
        percentage.teams +
        percentage.workmode +
        percentage.location +
        percentage.bonusandcurrency +
        percentage.minandmaxexp;

      let finalRemain =
        preferencesRemain.role +
        preferencesRemain.teams +
        preferencesRemain.workmode +
        preferencesRemain.location +
        preferencesRemain.bonusandcurrency +
        preferencesRemain.minandmaxexp;
      return {
        percent: finalPercent,
        remain: finalRemain,
        error: errorMessage,
      };
    }
  };

  useEffect(() => {
    if (referredJobsList?.length > 0) {
      for (let i = 0; i < referredJobsList?.length; i++) {
        if (referredJobsList[i]?.jobApplicationStatus == APPLY_STATUS?.JOINED) {
          setIsShowThirdPrompt(true);
          setReferralEarnedObject(referredJobsList[i]);
          return;
        }
      }
    } else {
      setIsShowThirdPrompt(false);
    }
  }, [referredJobsList]);

  useEffect(() => {
    if (candidateDetails?.refereePreferencesResponse) {
      checkProgressPercentagePreferences();
    }

    if (refereeOverview.referralsJoined > 0) {
      setIsShowfirstPrompt(false);
      setIsShowSecondPrompt(false);
      // setIsShowThirdPrompt(true);
      setIsShowfourthPrompt(false);
    } else if (refereeOverview?.referralsMade === 1) {
      setIsShowfirstPrompt(false);
      setIsShowSecondPrompt(true);
      setIsShowThirdPrompt(false);
      setIsShowfourthPrompt(false);
    } else if (
      checkProgressPercentagePreferences()?.remain > 0 &&
      refereeOverview?.referralsMade === 0
    ) {
      setIsShowfirstPrompt(false);
      setIsShowSecondPrompt(false);
      setIsShowThirdPrompt(false);
      setIsShowfourthPrompt(true);
    } else if (
      checkProgressPercentagePreferences()?.remain === 0 &&
      refereeOverview?.referralsJoined == 0
    ) {
      setIsShowfirstPrompt(true);
      setIsShowSecondPrompt(false);
      setIsShowThirdPrompt(false);
      setIsShowfourthPrompt(false);
    }
  }, [candidateDetails?.refereePreferencesResponse, window?.location?.hash]);

  useEffect(() => {
    fetchReferee();
  }, [candidateDetails]);

  const handleWelcomePageClose = () => {
    setWelcomePageShow(!welcomePageShow);
  };

  const handleWelcomePageLetGo = () => {
    setShowJobPreferences(true);
    setWelcomePageShow(false);
  };

  const location = useLocation();

  useEffect(() => {
    if (location?.hash === "#referee") {
      setProfileSwitcher("Referee Profile");
      fetchReferee();
    } else if (location?.hash === "#candidate") {
      setProfileSwitcher("Candidate Profile");
      fetchReferee();
    } else {
      setProfileSwitcher("Candidate Profile");
      fetchReferee();
    }
  }, []);

  useEffect(() => {
    if (profileSwitcher === "Referee Profile") {
      window.location.hash = "#referee";
    } else {
      window.location.hash = "#candidate";
    }
  }, [profileSwitcher]);

  return (
    <React.Fragment>
      {window?.location?.hash == "" ||
      window?.location?.hash == "#referee" ||
      window?.location?.hash == "#candidate" ? (
        <>
          {showLoader && <Loader headerLess={true} />}
          <ProfileHeader candidateDetails={candidateDetails} />

          <section className="main-content light-cool-bg">
            <div className="container">
              <div className="profile-switcher-wrapper d-flex profile-switcher-text">
                <ProfileSwitcher
                  data={["Candidate Profile", "Referee Profile"]}
                  value={profileSwitcher}
                  profileSwitcher={profileSwitcher}
                  setProfileSwitcher={setProfileSwitcher}
                  onClick={() => setProfileSwitcher(!profileSwitcher)}
                />
              </div>

              {profileSwitcher === "Candidate Profile" ? (
                <div className="candidate-profile-group">
                  {checkRefferedJobCount && checkRefferedJobCount > 0 ? (
                    <section className="referred-for">
                      <div className="content-header-wrapper">
                        <div className="row justify-content-between align-items-center justify-content-sm-end">
                          <div className="col-sm-8">
                            <div className="content-header d-flex align-items-center">
                              <div className="icon">
                                <img src={referredJobsIcon} alt="" />
                              </div>
                              <div className="header">
                                <h2>You have been referred for</h2>
                                <div className="other-info">
                                  <span className="small-text-gray">
                                    {refferedJobCount} Jobs
                                  </span>{" "}
                                  {refferedJobCount > 0 && newJobCount > 0 ? (
                                    <span className="badge custom-red">
                                      {newJobCount} New
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="content-header-action text-start text-sm-end">
                              <div
                                className={
                                  refferedJobCount >= PAGE_SIZE
                                    ? " d-block wired-dark-button"
                                    : "d-none wired-dark-button"
                                }
                              >
                                <Link
                                  type="button"
                                  className="btn btn-outline-dark"
                                  to="/candidate/reffered-jobs"
                                >
                                  View All
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="content-body">
                        <RefferedJob
                          viewAll={isViewAll}
                          refferedJobCount={setRefferedJobCount}
                          ref={referredJobsRef}
                          newJobCount={setNewJobCount}
                          setCheckRefferedJobCount={setCheckRefferedJobCount}
                          onJobApplied={() => {
                            refreshList();
                          }}
                        />
                      </div>
                    </section>
                  ) : (
                    ""
                  )}

                  <section className="recommended-jobs pt-2">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={recommendedJobsIcon} alt="" />
                            </div>
                            <div className="header">
                              <h2>Recommended Jobs for you</h2>
                              <div className="other-info">
                                <span className="small-text-gray">
                                  {recommendedJobsCount
                                    ? recommendedJobsCount
                                    : 0}{" "}
                                  Jobs
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                recommendedJobsCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link
                                type="button"
                                className="btn btn-outline-dark"
                                to="/candidate/recommended-jobs"
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <ReccommendedJob
                        viewAll={isViewAll}
                        recommendedJobsCount={setRecommendedJobsCount}
                        ref={recommendedRef}
                        onJobSaved={() => {
                          refreshList();
                        }}
                        onJobApplied={() => {
                          refreshList();
                        }}
                      />
                    </div>
                  </section>

                  <section className="recommended-jobs pt-2">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={saveJobsTitleIcon} alt="" />
                            </div>
                            <div className="header">
                              <h3>Saved Jobs (For Applications)</h3>
                              <div className="other-info">
                                <span className="small-text-gray">
                                  {savedJobsCount} Jobs
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                savedJobsCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link to="/candidate/saved-jobs">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark"
                                >
                                  View All
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <SavedJobs
                      viewAll={isViewAll}
                      savedJobCount={setSavedJobsCount}
                      ref={savedJobsRef}
                      onJobSaved={() => {
                        refreshList();
                      }}
                      onJobApplied={() => {
                        refreshList();
                      }}
                    />
                  </section>

                  <section className="applications pt-2">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={applicationsIcon} alt="" />
                            </div>
                            <div className="header">
                              <h3>Applications</h3>
                              <div className="other-info">
                                <span className="small-text-gray">
                                  {appliedJobsCount} Applications
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                appliedJobsCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link to="/candidate/my-applications">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark"
                                >
                                  View All
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <div className="row">
                        <ApplicationsData
                          viewAll={isViewAll}
                          appliedJobsCount={setAppliedJobsCount}
                          ref={appliedJobsRef}
                          onJobSaved={() => {
                            refreshList();
                          }}
                          onJobApplied={() => {
                            refreshList();
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
              {
                // Candidate Profile Group End here
              }

              {profileSwitcher === "Referee Profile" ? (
                <div className="referee-profile-group">
                  <div className="screen-notification-wrapper">
                    <ScreenNotification
                      isShowfirstPrompt={isShowfirstPrompt}
                      setIsShowfirstPrompt={setIsShowfirstPrompt}
                      isShowSecondPrompt={isShowSecondPrompt}
                      setIsShowSecondPrompt={setIsShowSecondPrompt}
                      isShowThirdPrompt={isShowThirdPrompt}
                      setIsShowThirdPrompt={setIsShowThirdPrompt}
                      isShowfourthPrompt={isShowfourthPrompt}
                      setIsShowfourthPrompt={setIsShowfourthPrompt}
                      referralEarnedObject={referralEarnedObject}
                    />
                  </div>

                  <div className="overview-referral-wrapper">
                    <div className="row align-items-stretch">
                      <div className="col-lg-8 mb-4">
                        <div className="overview-wrapper">
                          <div className="title">Overview</div>
                          <div className="row">
                            <div className="col-12 col-sm-3 col-md-4 col-lg-3">
                              <div className="referrals-made">
                                <p className="counts">
                                  {refereeOverview?.referralsMade}
                                </p>
                                <p className="label">Referrals Made</p>
                              </div>
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                              <div className="referrals-joined divider">
                                <p className="counts">
                                  {refereeOverview?.referralsJoined}
                                </p>
                                <p className="label">Referrals Joined</p>
                              </div>
                            </div>
                            <div className="col-12 col-sm-5 col-md-4 col-lg-5">
                              <div className="referrals-bonus divider">
                                <p className="counts">
                                  {refereeOverview?.referralBonus
                                    ? convertToInternationalCurrencySystem(
                                        refereeOverview?.referralBonus,
                                        refereeOverview.referralsAmountCurrency
                                      ) +
                                      " " +
                                      refereeOverview.referralsAmountCurrency
                                    : 0}
                                </p>
                                <p className="label">Referrals Bonus</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mb-4">
                        <div className="referral-preferences-wrapper">
                          <div className="d-flex align-items-start title-wrapper">
                            <div className="icon">
                              <img src={settingIcon} alt="" />
                            </div>
                            <div className="referral-content-wrapper">
                              <div className="title">Referrals Preferences</div>
                              <div className="seekbar-wrapper">
                                <ProgressBar
                                  now={
                                    checkProgressPercentagePreferences().percent
                                  }
                                  style={{ height: "0.5rem" }}
                                />
                              </div>
                              <div className="status">
                                {checkProgressPercentagePreferences().remain}/6
                                preferences added
                              </div>
                              <div className="referral-actions">
                                <div className="d-flex justify-content-end align-items-center">
                                  <p className="link line-height-18">
                                    <Link to={""}>
                                      {
                                        checkProgressPercentagePreferences()
                                          .error
                                      }
                                    </Link>
                                  </p>
                                  <button
                                    type="button"
                                    className="edit edit-btn-fixed-width"
                                    onClick={() => {
                                      setViewReferralPreferencesModal(
                                        !viewReferralPreferencesModal
                                      );
                                    }}
                                  >
                                    <img src={editIcon} alt="edit" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your Referral section */}
                  <section className="your-referrals">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={yourReferralIcon} alt="" />
                            </div>
                            <div className="header">
                              <h2>Your Referrals</h2>
                              <div className="other-info">
                                <span className="small-text-gray">
                                  {referralsCount} Referrals
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                referralsCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link
                                to="referral-referred-jobs"
                                type="button"
                                className="btn btn-outline-dark"
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <div
                        className={
                          referralsCount > 0
                            ? "referral-table flex-table border rounded"
                            : "p-2 pt-0 ps-0 pe-0"
                        }
                      >
                        {referralsCount && referralsCount > 0 ? (
                          <div className="referral-table-header d-flex row-divider card-view">
                            <div className="referral-table-left-column">
                              <p className="label">Role</p>
                            </div>
                            <div className="d-flex referral-table-right-column">
                              <div className="referred-to">
                                <p className="label left-space">Referred To</p>
                              </div>
                              <div className="date">
                                <p className="label left-space">Date</p>
                              </div>
                              <div className="status">
                                <p className="label left-space">Status</p>
                              </div>
                              <div className="your-recommendation">
                                <p className="label left-space">
                                  Your recommendation
                                </p>
                              </div>
                              <div className="bonus">
                                <p className="label left-space">Bonus</p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <div>
                          <RefereeReferralsComponent
                            viewAll={isViewAll}
                            referrals={setReferralsCount}
                            ref={referralsRef}
                            onJobSaved={() => {
                              refreshList();
                            }}
                            setReferredJobsList={setReferredJobsList}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="recommended-jobs pt-2">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={recommendedJobsIcon} alt="" />
                            </div>
                            <div className="header">
                              <h2>Refer these jobs</h2>
                              <div
                                className={
                                  referralreferredJobCount !== 0
                                    ? "other-info d-block"
                                    : "d-none"
                                }
                              >
                                <span className="small-text-gray">
                                  {referralreferredJobCount
                                    ? referralreferredJobCount
                                    : 0}{" "}
                                  Jobs
                                </span>
                              </div>
                              <div
                                className={
                                  referralreferredJobCount === 0
                                    ? "d-block small-text-black"
                                    : "d-none"
                                }
                              >
                                {" "}
                                No recommendations available{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                referralreferredJobCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link
                                to={REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE}
                                type="button"
                                className="btn btn-outline-dark"
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <div className="row">
                        <RefreeReferredJobs
                          viewAll={isViewAll}
                          referralreferredJobCount={setReferralreferredJobCount}
                          setJobIdProps={setJobIdProps}
                          setReferJobShow={setReferJobShow}
                          ref={refereeReferrredJobRef}
                          onJobSaved={() => {
                            refreshList();
                          }}
                          jobDetailsProps={jobDetailsProps}
                          setJobDetailsProps={setJobDetailsProps}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="recommended-jobs pt-2">
                    <div className="content-header-wrapper">
                      <div className="row justify-content-between align-items-center justify-content-sm-end">
                        <div className="col-sm-8">
                          <div className="content-header d-flex align-items-center">
                            <div className="icon">
                              <img src={saveJobsTitleIcon} alt="" />
                            </div>
                            <div className="header">
                              <h3>Saved Jobs (For Referrals)</h3>
                              <div className="other-info">
                                <span className="small-text-gray">
                                  {refreeSavedJobsCount
                                    ? refreeSavedJobsCount
                                    : 0}{" "}
                                  Jobs
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="content-header-action text-start text-sm-end">
                            <div
                              className={
                                refreeSavedJobsCount >= PAGE_SIZE
                                  ? " d-block wired-dark-button"
                                  : "d-none wired-dark-button"
                              }
                            >
                              <Link
                                to="referral-saved-jobs"
                                type="button"
                                className="btn btn-outline-dark"
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <div className="row">
                        <RefreeSavedJobs
                          viewAll={isViewAll}
                          referralsavedJobCount={setRefreeSavedJobsCount}
                          setJobIdProps={setJobIdProps}
                          setReferJobShow={setReferJobShow}
                          ref={refereeSavedJobRef}
                          onJobSaved={() => {
                            refreshList();
                          }}
                          jobDetailsProps={jobDetailsProps}
                          setJobDetailsProps={setJobDetailsProps}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
              <RefereeProfileEditDialog
                show={viewReferralPreferencesModal}
                isShowFlow={true}
                setShowJobPreferences={setViewReferralPreferencesModal}
                showPageIndex={currentIndexShowPage}
                onDismissDialogClick={() => {
                  setViewReferralPreferencesModal(false);
                  refreshList();
                }}
                onRefereePreferencesSet={() => {
                  refreshList();
                }}
              />
              <JobSearchPreferenceDialog
                show={showJobPreferences}
                isShowFlow={true}
                setShowJobPreferences={setShowJobPreferences}
                showPageIndex={currentIndexShowPage}
                onDismissDialogClick={() => {
                  setShowJobPreferences(false);
                  recommendedRef?.current?.refresh();
                }}
              />
              {
                // Referee Profile Group End here
              }
            </div>
            <ReferAJobDialog
              onClosedButtonClick={() => {
                setReferJobShow(false);
                setNonLoginReferData();
              }}
              isShow={referJobShow}
              referButtonClicked={referButtonClicked}
              setReferButtonClicked={setReferButtonClicked}
              disableReferralBtn={disableReferralBtn}
              setDisableReferralBtn={setDisableReferralBtn}
              referJobId={jobIdProps}
              referJobShow={referJobShow}
              setReferJobShow={setReferJobShow}
              onJobReferred={() => {
                referralsRef?.current?.refresh();
                fetchReferee();
              }}
              jobDetailsProps={jobDetailsProps}
            />
            <JobSearchRecommondationPreferencePage
              show={welcomePageShow}
              close={handleWelcomePageClose}
              letGo={handleWelcomePageLetGo}
            />
          </section>
        </>
      ) : (
        <NotFoundPage hideHeader={true} />
      )}
    </React.Fragment>
  );
};

export default CandidateProfilePage;
