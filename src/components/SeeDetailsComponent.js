import React from "react";
import { Link } from "react-router-dom";
import { APPLIED } from "../constants/keys";
import icGreenDone from "../assests/icons/ic-green-done.svg";
import icPinkDone from "../assests/icons/ic-pink-done.svg";

const SeeDetailsComponent = (props) => {
  return (
    <div className="action">
      <div className="d-flex justify-content-between align-items-center">
        {props?.status != "RETRACTED" ? (
          <div className="small-green-text fs-12 fw-700 d-flex align-items-center gap-2">
            <div>
              <img src={icGreenDone} alt="green-done-icon" />
            </div>
            <div>{props?.status}</div>
          </div>
        ) : (
          <div className="dark-pink-text fs-12 fw-700 d-flex align-items-center gap-2">
            <div>
              <img src={icPinkDone} alt="green-done-icon" />
            </div>
            <div>RETRACTED</div>
          </div>
        )}
        <div className="link">
          <Link to={`/candidate/application-detailed-view/${props?.id}`}>
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeeDetailsComponent;
