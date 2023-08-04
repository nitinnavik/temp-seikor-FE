import React from "react";
import CompanyImage from "./company_image";

const JobCardCompany = ({ logo, name, companyName, display }) => {
  return (
    <div
      className={`company-details-wrapper d-flex justify-content-start align-items-center ${
        display === "column" ? "flex-column" : ""
      }`}
    >
      <div className="company-logo-wrapper">
        {/* <img
          src={logo ? logo : ""}
          alt="company name"
          width="50px"
          height="50px"
        /> */}

        <CompanyImage
          src={logo}
          width="50px"
          height="50px"
          initialsContainerClass="initialsStyle2-xl"
          name={companyName}
        />
      </div>
      <div className="w-100 py-2">
        <div className=" small-text-gray job-card-ellipse-1">{companyName}</div>
        <div className="company-name mt-0 job-card-ellipse-1">{name}</div>
      </div>
    </div>
  );
};
export default JobCardCompany;
