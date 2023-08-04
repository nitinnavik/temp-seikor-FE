import React, { useState, useParams } from "react";
import { Link } from "react-router-dom";
const JobCardViewReferralDetails = (props) => {
  return (
    <div className="action-card">
      <div className="d-flex justify-content-end align-items-center ">
        <div className="link w-100 d-flex justify-content-end me-1">
          <Link
            to={`/candidate/view-referral/${props?.referalId}`}
            className="text-decoration-none btn btn-outline-dark fs-12 fw-700 text-white bg-dark ps-4 pe-4 p-2 referral-hover-btn"
          >
            View Referral
          </Link>
        </div>
      </div>
    </div>
  );
};
export default JobCardViewReferralDetails;
