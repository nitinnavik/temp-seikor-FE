import React from "react";
import locationBlueIcon from "./../assests/icons/ic-location-blue.svg";

const JobCardLocation = ({ text }) => {
  return (
    <div className="location d-flex align-items-center">
      <img src={locationBlueIcon} alt="location" />
      &nbsp;{`${text ? text : "Remote | Hyderabad"}`}
    </div>
  );
};
export default JobCardLocation;
