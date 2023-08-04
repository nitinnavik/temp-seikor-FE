/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import FeedbackHeader from "./../components/common/feedback_header";
import { Link } from "react-router-dom";

const LinkInvalid = () => {
  return (
    <div className="w-100 bg-white">
      <FeedbackHeader />
      <div className="d-flex justify-content-center">
        <div className="mt-3 p-2 text-center">
          <img src={require("./../assests/images/link-invalid.png")} />
          <div className="fs-32 fw-400 color-tertiary mt-3">
            This link is no longer valid :/
          </div>
          <Link
            to="/candidate/"
            className="btn text-white background-gray fs-12 fw-700  ps-5 pe-5 p-2 mt-4"
          >
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkInvalid;
