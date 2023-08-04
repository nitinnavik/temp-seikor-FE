import React, { useCallback, useEffect, useState } from "react";
import "../../../styles/profile-resume.scss";
import resumeTitleIcon from "../../../assests/icons/ic-resume.svg";
import UpdateResume from "../../../components/UpdateResume";

const ResumePage = (props) => {
  return (
    <React.Fragment>
      <header>
        <h1 className="mb-4 mt-1">
          <span className="fw-bold" style={{ fontSize: "24px" }}>
            {" "}
            <img
              style={{ marginRight: "14px" }}
              src={resumeTitleIcon}
              alt={"Resume"}
            />
            Resume
          </span>
        </h1>
      </header>
      <div className="profile-resume-container">
        <div className="upload-resume-content">
          <h2 className="sub-heading">Upload your Resume</h2>
          <p className="small-text-gray">
            Upload upto 2 resumes. You can select one , while applying for a job
          </p>
          <UpdateResume />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResumePage;
