import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RefferedJob from "../../components/reffered_job";
import BackButton from "../../assests/icons/back-icon.svg";
import filterIcon from "../../assests/icons/ic-filter-16.svg";
import icReferJob from "../../assests/icons/ic_referjob.svg";
import icBlackDone from "../../assests/icons/ic_blackdone.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { APPLY_STATUS, SORT } from "../../constants/keys";

const AllReferredJobPage = () => {
  const [arrayFilterIndex, setArrayFilterIndex] = useState();
  const [arraySortIndex, setArraySortIndex] = useState();
  const [isViewAll] = useState(true);
  const [refferedJobCount, setRefferedJobCount] = useState();
  const [newJobCount, setNewJobCount] = useState();
  const [isActive, setIsActive] = useState(null);
  const [applied, setApplied] = useState(null);
  const [sort, setSort] = useState(null);

  const dropdownFilterArray = [
    "All Referrals",
    "Active Roles",
    "Not Applied",
    "Applied",
  ];
  const dropdownFilterHandler = (index) => {
    setArrayFilterIndex(index);
    if (dropdownFilterArray[index] === "All Referrals") {
      setApplied(null);
      setIsActive(null);
    } else if (dropdownFilterArray[index] === "Active Roles") {
      setApplied(null);
      setIsActive(true);
    } else if (dropdownFilterArray[index] === "Not Applied") {
      setApplied(APPLY_STATUS.NOT_APPLIED);
      setIsActive(null);
    } else if (dropdownFilterArray[index] === "Applied") {
      setApplied(APPLY_STATUS.APPLIED);
      setIsActive(null);
    }
  };

  const sortArray = [
    SORT.LATEST_FIRST,
    SORT.SALARY_HIGH,
    SORT.EXPIRIANCE_HIGH,
    SORT.JOB_TITLE_ASC,
  ];

  const dropdownSortArray = [
    "New First",
    "Salary - High to Low",
    "Experience - Low to High",
    "A-Z",
  ];
  const dropdownSortHandler = (index) => {
    setArraySortIndex(index);
  };

  const allReferredJobsComponent = useRef();

  useEffect(() => {
    allReferredJobsComponent?.current?.filter(isActive, applied, sort);
  }, [isActive, applied, sort]);

  return (
    <div className="bg-white w-100 pt-4">
      <div className="container pb-2">
        <div className="d-flex mb-3">
          <Link to="/candidate" className="color-primary d-flex gap-2">
            <img src={BackButton} alt={BackButton} />
            <span className="color-primary fs-12 fw-400 back-btn-width">
              Back to My View
            </span>
          </Link>
        </div>
        <div className="mt-3 d-flex flex-md-row flex-column justify-content-md-between pt-2">
          <div className="d-flex gap-4  ">
            <div>
              <img src={icReferJob} alt="refer-job-icon" className="mt-3" />
            </div>
            <div>
              <span className="color-primary fs-20 fw-700">
                You have been referred for
              </span>
              <br />
              <div className="d-flex gap-3">
                <span className="small-text-black">
                  {refferedJobCount} Jobs
                </span>
                {newJobCount > 0 && (
                  <div className="new-background end-0 text-center ">
                    {newJobCount} New
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-3 pt-md-0">
            <div className="d-flex gap-2 pt-md-3 justify-content-end">
              <Dropdown className="btn page-filter-button">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="page-filter-button d-flex p-0 m-0 border-0 bg-transparent down-arrow"
                  style={{ width: "100px" }}
                >
                  <img src={filterIcon} alt="" className="pt-1 pe-1" /> Filters
                </Dropdown.Toggle>

                <Dropdown.Menu className="fs-12 text-secondary mt-2 pe-5">
                  {dropdownFilterArray.map((dropdownFilterItem, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        className="d-flex pb-3"
                        onClick={() => dropdownFilterHandler(index)}
                      >
                        <img
                          src={icBlackDone}
                          alt="blackdone-icon"
                          className={
                            arrayFilterIndex === index
                              ? "pe-2 d-block"
                              : "d-none pe-1"
                          }
                        />
                        <span
                          className={
                            arrayFilterIndex === index
                              ? "ps-0 color-primary fw-700"
                              : "ps-4"
                          }
                        >
                          {dropdownFilterItem}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
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
          <RefferedJob
            viewAll={isViewAll}
            refferedJobCount={setRefferedJobCount}
            newJobCount={setNewJobCount}
            ref={allReferredJobsComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default AllReferredJobPage;
