import React, { useEffect, useRef, useState } from "react";
import BackButton from "./../../assests/icons/back-icon.svg";
import filterIcon from "./../../assests/icons/ic-filter-16.svg";
import icMyApplication from "./../../assests/icons/ic_my_applications.svg";
import icBlackDone from "./../../assests/icons/ic_blackdone.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import ApplicationsData from "./../../components/my_applications";
import { SORT } from "../../constants/keys";

const MyApplicationsPage = (props) => {
  const [arrayFilterIndex, setArrayFilterIndex] = useState(null);
  const dropdownFilterArray = ["Active Only", "All Applicaitons"];
  const [isActive, setIsActive] = useState(null);
  const [allApplications, setAllApplications] = useState(null);
  const [sort, setSort] = useState(null);

  const sortArray = [
    SORT.LATEST_FIRST,
    SORT.SALARY_HIGH,
    SORT.EXPIRIANCE_HIGH,
    SORT.JOB_TITLE_ASC,
  ];

  const [arraySortIndex, setArraySortIndex] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(null);
  const [isViewAll] = useState(true);

  const dropdownSortArray = [
    "New First",
    "Salary - High to Low",
    "Experience - Low to High",
    "A-Z",
  ];
  const dropdownSortHandler = (index) => {
    setArraySortIndex(index);
  };

  const allAppliedJobsComponent = useRef();

  useEffect(() => {
    allAppliedJobsComponent?.current?.performFiltering(isActive, null, sort);
  }, [isActive, null, sort]);
  return (
    <div className="bg-white w-100 pt-4">
      <div className="container pb-2">
        <div className="d-flex mb-3">
          <Link to="/candidate" className="color-primary d-flex gap-2 ">
            <img src={BackButton} alt={BackButton} />
            <span className="color-primary fs-12 fw-400 back-btn-width">
              Back to My View
            </span>
          </Link>
        </div>
        <div className="mt-3 d-flex flex-sm-row flex-column justify-content-sm-between pt-2">
          <div className="d-flex gap-4">
            <div>
              <img
                src={icMyApplication}
                alt="applications-icon"
                className="mt-3"
              />
            </div>
            <div>
              <span className="color-primary fs-20 fw-700">
                {" "}
                My Applications
              </span>{" "}
              <br />
              <span className="small-text-black">
                {appliedJobsCount ? appliedJobsCount : "0"} Applications{" "}
              </span>
            </div>
          </div>
          <div className="pt-3 pt-sm-0">
            <div className="d-flex justify-content-end gap-2 pt-sm-3">
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
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setIsActive(true);
                      setAllApplications(null);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={isActive ? "pe-2 d-block" : "d-none pe-1"}
                    />
                    <span
                      className={
                        isActive ? "ps-0 color-primary fw-700" : "ps-4"
                      }
                    >
                      Active Only
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex pb-3"
                    onClick={() => {
                      setAllApplications(true);
                      setIsActive(null);
                    }}
                  >
                    <img
                      src={icBlackDone}
                      alt="blackdone-icon"
                      className={
                        allApplications ? "pe-2 d-block" : "d-none pe-1"
                      }
                    />
                    <span
                      className={
                        allApplications ? "ps-0 color-primary fw-700" : "ps-4"
                      }
                    >
                      All Applicaitons
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
                  {dropdownSortArray.map((sortItem, index) => {
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
                          {sortItem}
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
          <ApplicationsData
            viewAll={isViewAll}
            appliedJobsCount={setAppliedJobsCount}
            ref={allAppliedJobsComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
