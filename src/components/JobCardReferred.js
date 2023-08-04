import React from "react";
import ProfileImage from "./profile_image";

const JobCardReferred = (props) => {
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <p className="small-text-gray">Referred By</p>
        <p className="small-text-gray">{props.referedOn}</p>
      </div>
      <div className="referred-person-wrapper d-flex align-items-start">
        <div className="referred-person-pic-wrpper">
          <div className="referred-person-pic imageBackground">
            {/* <img src={props.profileImg} alt="" /> */}
            {}
            <ProfileImage
              src={`http://api.seikor.com` + props?.src}
              name={props?.name}
              initialsContainerClass="initialsStyle2"
              backgroundColor="white"
            />
          </div>
        </div>
        <div className="referred-person-details">
          <div className="name text-break ellipse-1">{props.reffererName}</div>
          <div className="name text-break ellipse-1">{props.refererPost}</div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default JobCardReferred;
