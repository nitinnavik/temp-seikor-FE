import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { APPLIED, QUICKAPPLYMODALSHOW } from "../constants/keys";
import { getLocalStorage } from "../utils/storage";
import QuickApplyJob from "./QuickApplyJob";
import icGreenDone from "../assests/icons/ic-green-done.svg";

const JobCardQuickApply = (props) => {
  let quickApplyModalShow;
  const [isModalCheck, setIsModalCheck] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [showQuickApplyModal2, setShowQuickApplyModal2] = useState(false);

  const shouldQuickApplyModalShow = () => {
    if (isModalCheck === true) {
      setModalShow(false);
      setShowQuickApplyModal2(true);
    } else {
      setModalShow(true);
    }
  };
  useEffect(() => {
    let quickApplyModalShow = getLocalStorage(QUICKAPPLYMODALSHOW);

    if (quickApplyModalShow) {
      if (quickApplyModalShow === "true" || quickApplyModalShow === true) {
        setIsModalCheck(true);
      } else {
        setIsModalCheck(false);
      }
    }
  }, []);

  return (
    <div className="action">
      <div className="d-flex justify-content-between align-items-center">
        <div className="button">
          {props?.applicationStatus === APPLIED ? (
            <div className="small-green-text fs-12 fw-700 d-flex align-items-center gap-2">
              <div>
                <img src={icGreenDone} alt="green-done-icon" />
              </div>
              <div> {props?.applicationStatus}</div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className={"btn blue-gradient"}
                onClick={() => shouldQuickApplyModalShow()}
                disabled={props?.applicationStatus === APPLIED ? true : false}
              >
                Quick Apply
              </button>
              <QuickApplyJob
                id={props?.jobId}
                modalShow={modalShow}
                onJobApplied={() => {
                  if (props?.onJobApplied) {
                    props?.onJobApplied();
                  }
                }}
                setModalShow={setModalShow}
                isModalCheck={isModalCheck}
                setIsModalCheck={setIsModalCheck}
                showQuickApplyModal2={showQuickApplyModal2}
                setShowQuickApplyModal2={setShowQuickApplyModal2}
                refererId={props?.refererId ? props?.refererId : null}
              />
            </div>
          )}
        </div>
        <div className="link">
          <Link
            to={`/job/${props?.jobId}${
              props?.refererId ? `?refereeId=${props?.refererId}` : ""
            }`}
          >
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default JobCardQuickApply;
