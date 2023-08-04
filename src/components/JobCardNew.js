import React from "react";

const JobCardNew = ({ isNew }) => {
  return (
    <div className="d-flex justify-content-end">
      {isNew === true && (
        <div className="new-background end-0 text-center ">New</div>
      )}
    </div>
  );
};

export default JobCardNew;
