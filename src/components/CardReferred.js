import React, { useEffect, useState } from "react";
import { downloadFile } from "../_services/view.service";
import profileImg from "./../assests/images/profile.jpg";
import ProfileImage from "./profile_image";

const CardReferred = (props) => {
  return (
    <React.Fragment>
      <div className="referred-person-wrapper mt-0 d-flex align-items-center">
        <div className="referred-person-pic-wrpper">
          <div className="referred-person-pic">
            <ProfileImage
              src={`http://api.seikor.com` + props?.src}
              name={props?.name}
              initialsContainerClass="initialsStyle2"
            />
            <img src={props.img} alt="" />
          </div>
        </div>
        <div className="referred-person-details align-middle">
          <p className="name header-ellipse-1 your-referrals-name">
            {props.name}
          </p>
          <p className="designation small-text-gray">{props.designation}</p>
          <p className="designation small-text-gray">{props.company}</p>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CardReferred;
