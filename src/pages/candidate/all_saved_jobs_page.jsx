import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../assests/icons/back-icon.svg";
import filterIcon from "../../assests/icons/ic-filter-16.svg";
import icSaveBig from "../../assests/icons/ic_save_big.svg";
import SavedJobs from "../../components/SavedJobs";
import icBlackDone from "../../assests/icons/ic_blackdone.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { APPLY_STATUS, SORT } from "../../constants/keys";

const AllSavedJobs = () => {
  const [applied, setApplied] = useState(null);
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [sort, setSort] = useState(null);
  const [isViewAll] = useState(true);
  const [savedJobsCount, setSavedJobsCount] = useState(null);
  const [arraySortIndex, setArraySortIndex] = useState(null);
  const dropdownSortArray = [
    "New First",
    "Salary - High to Low",
    "Experience - Low to High",
    "A-Z",
  ];

  const sortArray = [
    SORT.LATEST_FIRST,
    SORT.SALARY_HIGH,
    SORT.EXPIRIANCE_HIGH,
    SORT.JOB_TITLE_ASC,
  ];
  //
  const dropdownSortHandler = (index) => {
    setArraySortIndex(index);
  };

  const allSavedJobsComponent = useRef();

  useEffect(() => {
    allSavedJobsComponent?.current?.filter(isActiveFilter, applied, sort);
  }, [isActiveFilter, applied, sort]);

  return (
    <div className="bg-white w-100 pt-4">
      <div className="container pb-2">
        <div className="d-flex mb-3">
          <Link to="/candidate" className="color-primary d-flex gap-2 my-1">
            <img src={BackButton} alt={BackButton} />
            <span className="color-primary fs-12 fw-400 back-btn-width">
              Back to My View
            </span>
          </Link>
        </div>

        <div className="mt-3 d-flex flex-md-row flex-column justify-content-md-between pt-2">
          <div className="d-flex gap-4">
            <div>
              <img src={icSaveBig} alt="save-bigsize-icon" className="mt-3" />
            </div>
            <div>
              <span className="color-primary fs-20 fw-700">
                Saved Jobs (For Application)
              </span>
              <br />
              <span className="small-text-black">
                {savedJobsCount ? savedJobsCount : 0} Jobs
              </span>
            </div>
          </div>
          <div className="pt-3 pt-md-0">
            <div className="d-flex flex-wrap justify-content-end gap-2 pt-md-3 center-aligned-filters">
              <Dropdown className="btn page-filter-button">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                  style={{ width: "100px" }}
                >
                  <img src={filterIcon} alt="" className="pt-1 pe-1" /> Active
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2 pe-5">
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setIsActiveFilter(true);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={
                        isActiveFilter ? "pe-2 d-block" : "d-none pe-1"
                      }
                    />
                    <span
                      className={
                        isActiveFilter ? "ps-0 color-primary fw-700" : "ps-4"
                      }
                    >
                      Active Only
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setIsActiveFilter(false);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={
                        isActiveFilter === false
                          ? "pe-2 d-block"
                          : "d-none pe-1"
                      }
                    />
                    <span
                      className={
                        isActiveFilter === false
                          ? "ps-0 color-primary fw-700"
                          : "ps-4"
                      }
                    >
                      In Active
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* new line */}
              <Dropdown className="btn page-filter-button">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                  style={{ width: "100px" }}
                >
                  <img src={filterIcon} alt="" className="pt-1 pe-1" />
                  Applied
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2 pe-5">
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setApplied(APPLY_STATUS.APPLIED);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={
                        applied === APPLY_STATUS.APPLIED
                          ? "pe-2 d-block"
                          : "d-none pe-1"
                      }
                    />
                    <span
                      className={
                        applied === APPLY_STATUS.APPLIED
                          ? "ps-0 color-primary fw-700"
                          : "ps-4"
                      }
                    >
                      Applied jobs
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setApplied(APPLY_STATUS.NOT_APPLIED);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={
                        applied === APPLY_STATUS.NOT_APPLIED
                          ? "pe-2 d-block"
                          : "d-none pe-1"
                      }
                    />
                    <span
                      className={
                        applied === APPLY_STATUS.NOT_APPLIED
                          ? "ps-0 color-primary fw-700"
                          : "ps-4"
                      }
                    >
                      Not Applied
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                          dropdownSortHandler(index);
                          setSort(sortArray[index]);
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
                          {sortFilterItem}
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
          <SavedJobs
            viewAll={isViewAll}
            savedJobCount={setSavedJobsCount}
            ref={allSavedJobsComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default AllSavedJobs;
