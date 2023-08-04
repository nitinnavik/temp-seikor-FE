import React from "react";

const JobCardApplicationInfo = ({ data }) => {
  return (
    <React.Fragment>
      <p className="applied-date">
        Applied : {data?.appliedDate ? data?.appliedDate : "NA"}
      </p>
      <p className="applied-status">
        Application Status :{" "}
        {data?.applicationStatus ? data?.applicationStatus : "NA"}
      </p>
      {/* <p className="applied-status text-gray">Application Status : Shortlisted</p> */}
    </React.Fragment>
  );
};
export default JobCardApplicationInfo;
