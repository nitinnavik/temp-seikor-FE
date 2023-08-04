import React from "react";
import JobCardCompany from "../components/JobCardCompany";
import jobCompanyLogo from "../assests/images/job-company-logo.png";
import JobCardApplicationInfo from "../components/JobCardApplicationInfo";

const ApplicationCompanyCard = ({ companyDetailsBind }) => {
  return (
    <div className="mt-3">
      <div className="job-card feedback-background">
        <JobCardCompany
          logo={companyDetailsBind?.companyLogo}
          name={companyDetailsBind?.designation}
          companyName={companyDetailsBind?.companyName}
        />

        <div className="applied-info">
          <JobCardApplicationInfo
            data={{
              appliedDate: companyDetailsBind?.applied,
              applicationStatus: companyDetailsBind?.appliedStatus,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCompanyCard;
