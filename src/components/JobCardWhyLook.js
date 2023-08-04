import React from "react";

const JobCardWhyLook = ({ text }) => {
  return (
    <React.Fragment>
      <p className="title">Why look at this role</p>
      <p className="description fs-12 color-tertiary">{text}</p>
    </React.Fragment>
  );
};
export default JobCardWhyLook;
