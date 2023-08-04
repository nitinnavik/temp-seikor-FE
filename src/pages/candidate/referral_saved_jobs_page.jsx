import React, { useEffect, useRef, useState } from "react";
import RefreeSavedJobs from "../../components/refree_saved_jobs";
import BackButton from "../../assests/icons/back-icon.svg";
import filterIcon from "../../assests/icons/ic-filter-16.svg";
import icSaveBig from "../../assests/icons/ic_save_big.svg";
import icBlackDone from "../../assests/icons/ic_blackdone.svg";
import IcDoneWhite from "../../assests/icons/ic_done_white.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { SORT } from "../../constants/keys";
import { REFEREE_PROFILE_HASH } from "../../constants/page-routes";

const ReferralSavedJobsPage = () => {
  const [arraySortIndex, setArraySortIndex] = useState(null);
  const [isViewAll] = useState(true);
  const [savedJobsCount, setSavedJobsCount] = useState(null);
  const [filterSelect, setFilterSelect] = useState(true);
  const [isActive, setIsActive] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [sort, setSort] = useState(null);
  const [allSaved, setAllSaved] = useState(false);

  const dropdownSortArray = [
    { label: "New First", value: SORT.LATEST_FIRST },
    { label: "Salary - High to Low", value: SORT.SALARY_HIGH },
    { label: "Experience - Low to High", value: SORT.EXPIRIANCE_HIGH },
    { label: "A-Z", value: SORT.JOB_TITLE_ASC },
  ];

  const allreferralSavedJobsComponent = useRef();

  useEffect(() => {
    allreferralSavedJobsComponent?.current?.filter(
      isActive,
      applicationStatus,
      sort
    );
  }, [isActive, applicationStatus, sort]);

  return (
    <div className="bg-white w-100 pt-4">
      <div className="container pb-2">
        <div className="d-flex">
          <Link
            to={REFEREE_PROFILE_HASH}
            className="color-primary d-flex gap-2 mb-3 "
          >
            <img src={BackButton} alt={BackButton} />
            <span className="color-primary fs-12 fw-400 back-btn-width">
              Back to My View
            </span>
          </Link>
        </div>

        <div className="mt-3 d-flex flex-md-row flex-column justify-content-md-between pt-2">
          <div className="d-flex gap-4 justify-content-start">
            <div>
              <img src={icSaveBig} alt="save-bigsize-icon" className="mt-3" />
            </div>
            <div>
              <span className="color-primary fs-20 fw-700">
                Saved Jobs (For Referral)
              </span>
              <br />
              <span className="small-text-black">
                {savedJobsCount ? savedJobsCount : 0} Jobs
              </span>
            </div>
          </div>
          <div className="pt-3 pt-md-0">
            <div className="d-flex gap-2 pt-md-3 justify-content-end center-aligned-filters flex-wrap">
              <div
                className="btn page-filter-button bg-white text-center d-flex"
                onClick={() => {
                  setIsActive(true);
                  setAllSaved(false);
                }}
              >
                <span
                  className={
                    isActive === true
                      ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                      : "d-none"
                  }
                >
                  <img src={IcDoneWhite} alt="whitedone-icon" />
                </span>
                Active Only
              </div>
              <div
                className="btn page-filter-button bg-white text-center d-flex"
                onClick={() => {
                  setIsActive(null);
                  setAllSaved(true);
                }}
              >
                <span
                  className={
                    allSaved === true
                      ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                      : "d-none"
                  }
                >
                  <img src={IcDoneWhite} alt="whitedone-icon" />
                </span>
                All Saved
              </div>
              <Dropdown className="btn page-filter-button ">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                  style={{ width: "100px" }}
                >
                  <img src={filterIcon} alt="" className="pt-1 ms-2" /> Sort
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
                            arraySortIndex === index
                              ? "pe-2 d-block"
                              : "d-none pe-1"
                          }
                        />
                        <span
                          className={
                            arraySortIndex === index
                              ? "ps-0 color-primary fw-700"
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
            </div>
          </div>
        </div>
      </div>
      <div className="background-purple p-2 mt-3">
        <div className="container mt-xl-5 mt-3 mb-4">
          <RefreeSavedJobs
            viewAll={isViewAll}
            referralsavedJobCount={setSavedJobsCount}
            ref={allreferralSavedJobsComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralSavedJobsPage;
