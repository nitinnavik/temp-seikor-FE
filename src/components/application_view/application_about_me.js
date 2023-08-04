import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import aboutLogo from "../../assests/icons/about.svg";
import ProfileImage from "../profile_image";

const ApplicationAboutMe = ({ aboutMeDetails }) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  return (
    <div>
      <div className="mt-3">
        <div className="fw-bold fs-24">
          {" "}
          <img src={aboutLogo} alt={aboutLogo} />
          &nbsp;About Me
        </div>
        <div className="box-shadow border-radius p-2 mt-3">
          <div className="d-flex gap-3">
            <div className="application-about-me-profile-picture">
              <ProfileImage
                src={aboutMeDetails?.profileImage}
                name={candidateDetails?.userRegistrationDetails?.name}
                initialsContainerClass="application-about-me-default-div"
              />
            </div>
            <div className="pt-3">
              <h4 className="fs-16 fw-600">{aboutMeDetails?.profileName} </h4>
              <span className="fs-16 fw-500">
                {" "}
                {aboutMeDetails?.profileDesignation}{" "}
              </span>{" "}
              <span className="fs-16 fw-400 light-gray-color">
                {" "}
                {aboutMeDetails?.lastCompanyName && `at`}{" "}
              </span>
              <span className="fs-16 fw-500">
                {" "}
                {aboutMeDetails?.lastCompanyName}{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="box-shadow border-radius p-3 mt-3">
          <div className="fw-bold fs-16 pb-2">Why should you hire me</div>
          <p className="fs-12 fw-400 color-tertiary">
            {aboutMeDetails?.whyshouldhiredescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationAboutMe;
