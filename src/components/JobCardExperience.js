import React from "react";
import experienceIcon from "./../assests/icons/ic-experience.svg";

const JobCardExperience = ({ text }) => {
  return (
    <div className="experience d-flex align-items-center">
      <img src={experienceIcon} alt="experience" />
      &nbsp;{`${text ? text : "2-5 Yrs"}`}
    </div>
  );
};
export default JobCardExperience;
