import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../assests/icons/back-icon.svg";
import filterIcon from "../../assests/icons/ic-filter-16.svg";
import icSaveBig from "../../assests/icons/ic_save_big.svg";
import icBlackDone from "../../assests/icons/ic_blackdone.svg";
import IcDoneWhite from "../../assests/icons/ic_done_white.svg";
import icSort from "../../assests/icons/ic_sort.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import RefereeReferralsComponent from "../../components/referee_referrals";
import { APPLY_STATUS, SORT, STATUS } from "../../constants/keys";
import { REFEREE_PROFILE_HASH } from "../../constants/page-routes";

const ReferralReferredJobsPage = () => {
  const [arraySortIndex, setArraySortIndex] = useState(null);
  const [recommendedArraySortIndex, setRecommendedArraySortIndex] =
    useState(null);
  const [referantArraySortIndex, setReferantArraySortIndex] = useState(null);
  const [isViewAll] = useState(true);
  const [referralreferredJobCount, setReferralreferredJobCount] =
    useState(null);

  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isPendingRecommendation, setIsPendingRecommendation] = useState(null);
  const [sort, setSort] = useState(null);
  const [jobRole, setJobRole] = useState(null);
  const [recommendationStatus, setRecommendationStatus] = useState(null);
  const [referentStatus, setReferantStatus] = useState(null);
  const [selectionArray, setSelectionArray] = useState();

  const arraySelection = [
    "All Referrals",
    "Referred not applied",
    "Recommendation Pending",
  ];

  const arraySelectionHandler = (index) => {
    if (arraySelection[index] === "All Referrals") {
      setApplicationStatus(null);
      setIsPendingRecommendation(null);
    } else if (arraySelection[index] === "Referred not applied") {
      setApplicationStatus(APPLY_STATUS.NOT_APPLIED);
      setIsPendingRecommendation(null);
    } else if (arraySelection[index] === "Recommendation Pending") {
      setApplicationStatus(null);
      setIsPendingRecommendation(true);
    }
  };

  const dropdownSortArray = [
    { label: "New First", value: SORT.LATEST_FIRST },
    { label: "Salary - High to Low", value: SORT.SALARY_HIGH },
    { label: "Experience - Low to High", value: SORT.EXPIRIANCE_HIGH },
    { label: "A-Z", value: SORT.JOB_TITLE_ASC },
  ];

  const recommendationDropDownArray = [
    {
      label: "Pending",
      value: true,
    },
    {
      label: "Completed",
      value: false,
    },
  ];
  const referantDropDownArray = [
    { label: "Applied", value: APPLY_STATUS.APPLIED },
    { label: "Not Applied", value: APPLY_STATUS.NOT_APPLIED },
  ];
  const jobRoleDropDownArray = [
    { label: "Active", value: STATUS.ACTIVE },
    { label: "Closed", value: STATUS.CLOSED },
  ];
  const allreferralsComponent = useRef();

  useEffect(() => {
    allreferralsComponent?.current?.filter(
      referentStatus,
      recommendationStatus,
      sort,
      jobRole
    );
  }, [
    applicationStatus,
    isPendingRecommendation,
    sort,
    jobRole,
    recommendationStatus,
    referentStatus,
  ]);

  return (
    <div className="bg-white w-100 pt-4">
      <div className="container pb-2">
        <div className="d-flex mb-3">
          <Link
            to={REFEREE_PROFILE_HASH}
            className="color-primary d-flex gap-2"
          >
            <img src={BackButton} alt={BackButton} />
            <span className="color-primary fs-12 fw-400 back-btn-width">
              Back to My View
            </span>
          </Link>
        </div>

        <div className="mt-3 d-flex flex-lg-row flex-column justify-content-lg-between pt-2">
          <div className="d-flex gap-4 ">
            <div>
              <img src={icSaveBig} alt="save-bigsize-icon" className="mt-3" />
            </div>
            <div>
              <span className="color-primary fs-20 fw-700">Your Referrals</span>
              <br />
              <span className="small-text-black">
                {referralreferredJobCount ? referralreferredJobCount : 0} Jobs
              </span>
            </div>
          </div>

          <div className="pt-3 pt-md-2 pt-lg-0">
            <div className="d-flex gap-2 pt-lg-3 flex-wrap justify-content-end center-aligned-filters">
              {/* {arraySelection?.map((array, index) => {
                return (
                  <div
                    className="btn page-filter-button bg-white text-center d-flex"
                    key={index}
                    onClick={() => {
                      arraySelectionHandler(index);
                      setSelectionArray(index);
                    }}
                  >
                    <div
                      className={
                        selectionArray === index
                          ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                          : "d-none"
                      }
                    >
                      <img src={IcDoneWhite} alt="whitedone-icon" />
                    </div>
                    {array}
                  </div>
                );
              })} */}

              {/* Job Role  */}
              <Dropdown className="btn page-filter-button ">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex pr-25 p-0 m-0 border-0 bg-transparent down-arrow"
                >
                  <img src={filterIcon} alt="" className="pt-1 ms-2" /> Job Role
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2">
                  {jobRoleDropDownArray?.map((sortFilterItem, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        className="d-flex pb-3"
                        onClick={() => {
                          setJobRole(sortFilterItem.value);
                          setArraySortIndex(index);
                        }}
                      >
                        <img
                          src={icBlackDone}
                          alt="blackdone-icon"
                          className={
                            arraySortIndex === index ? "d-block pe-2" : "d-none"
                          }
                        />
                        <span
                          className={
                            arraySortIndex === index
                              ? "ps-0 pe-0 color-primary fw-700"
                              : "ps-4"
                          }
                        >
                          {sortFilterItem.label}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              {/* Job Role End  */}

              {/* Recommendation Status End */}
              <Dropdown className="btn page-filter-button ">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button pr-25 d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                >
                  <img src={filterIcon} alt="" className="pt-1 ms-2" />{" "}
                  Recommendation Status
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2">
                  {recommendationDropDownArray?.map((sortFilterItem, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        className="d-flex pb-3"
                        onClick={() => {
                          setRecommendationStatus(sortFilterItem.value);
                          setRecommendedArraySortIndex(index);
                        }}
                      >
                        <img
                          src={icBlackDone}
                          alt="blackdone-icon"
                          className={
                            recommendedArraySortIndex === index
                              ? "d-block pe-2"
                              : "d-none"
                          }
                        />
                        <span
                          className={
                            recommendedArraySortIndex === index
                              ? "ps-0 pe-0 color-primary fw-700"
                              : "ps-4"
                          }
                        >
                          {sortFilterItem.label}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              {/* Recommendation Status End */}

              {/* Referent Status  */}
              <Dropdown className="btn page-filter-button ">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button pr-25 d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                >
                  <img src={filterIcon} alt="" className="pt-1 ms-2" /> Referent
                  Status
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2">
                  {referantDropDownArray?.map((sortFilterItem, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        className="d-flex pb-3"
                        onClick={() => {
                          setReferantStatus(sortFilterItem.value);
                          setReferantArraySortIndex(index);
                        }}
                      >
                        <img
                          src={icBlackDone}
                          alt="blackdone-icon"
                          className={
                            referantArraySortIndex === index
                              ? "d-block pe-2"
                              : "d-none"
                          }
                        />
                        <span
                          className={
                            referantArraySortIndex === index
                              ? "ps-0 pe-0 color-primary fw-700"
                              : "ps-4"
                          }
                        >
                          {sortFilterItem.label}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              {/* Referent Status End */}

              {/* Sort functionality */}
              <Dropdown className="btn page-filter-button ">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                  style={{ width: "100px" }}
                >
                  <img src={icSort} alt="" className="pt-1 ms-2" /> Sort
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2">
                  {dropdownSortArray?.map((sortFilterItem, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        className="d-flex pb-3"
                        onClick={() => {
                          setSort(sortFilterItem.value);
                          setArraySortIndex(index);
                        }}
                      >
                        <img
                          src={icBlackDone}
                          alt="blackdone-icon"
                          className={
                            arraySortIndex === index ? "d-block pe-2" : "d-none"
                          }
                        />
                        <span
                          className={
                            arraySortIndex === index
                              ? "ps-0 pe-0 color-primary fw-700"
                              : "ps-4"
                          }
                        >
                          {sortFilterItem.label}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              {/* Sort Functionality End  */}
            </div>
          </div>
        </div>
      </div>

      <div className="background-purple p-2 mt-3">
        <div className="container mt-xl-5 mb-4">
          <div className="content-body">
            <div className="referral-table flex-table border rounded">
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
                    <p className="label left-space">Your recommendation</p>
                  </div>
                  <div className="bonus">
                    <p className="label left-space">Bonus</p>
                  </div>
                </div>
              </div>
              <div>
                <RefereeReferralsComponent
                  viewAll={isViewAll}
                  referrals={setReferralreferredJobCount}
                  ref={allreferralsComponent}
                />
              </div>
            </div>
          </div>

          {/* // <RefereeReferralsComponent
            //   viewAll={isViewAll}
            //   referrals={setReferralreferredJobCount}
            //   ref={allreferralsComponent}
            // /> */}
        </div>
      </div>
    </div>
  );
};

export default ReferralReferredJobsPage;
