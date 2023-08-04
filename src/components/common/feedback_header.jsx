import React from "react";
import logo from "../../assests/ic_seikorfull.svg";
import { Link } from "react-router-dom";

const FeedbackHeader = () => {
  return (
    <div className="w-100 ">
      <div className="container w-100 border-bottom pb-2">
        <div className="d-flex justify-content-between pt-4 pb-2">
          <span className="">
            <img src={logo} alt="logo" />
          </span>

          <Link
            to="/login"
            className="color-primary fw-600 fs-14 text-decoration-none"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHeader;
