import React from "react";

const NoDataFoundCard = (props) => {
  return (
    <div className="card-parent-container-null  my-4 bg-white">
      <p>{props.text}</p>
    </div>
  );
};

export default NoDataFoundCard;
