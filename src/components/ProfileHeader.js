import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileImg from "./../assests/images/profile.jpg";
import editIcon from "./../assests/icons/ic-edit-icon.svg";
import { isEmpty } from "../utils/form_validators";
import ProgressBar from "react-bootstrap/ProgressBar";
import ProfileImage from "./profile_image";
import { downloadFile } from "../_services/view.service";
import { isCheckValue } from "./../utils/utils";
import { parseCommandLine } from "typescript";
import ProfileCompletionBar from "./profile_completion_bar";

const ProfileHeader = ({ candidateDetails }) => {
  const [userInitials, setUserInitials] = useState("");
  const [profileSrc, setProfileSrc] = useState(null);

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setProfileSrc(res);
      }
    });
  };

  const date = new Date();
  let hours = date.getHours();
  let status =
    hours < 12
      ? "Good Morning!"
      : hours <= 17 && hours >= 12
      ? "Good Afternoon!"
      : "Good Evening!";

  const checkProfileProgressPercentagePreferences = () => {
    if (candidateDetails) {
      let totalParameters = 16;
      let percentage = {
        name: null,
        phone: null,
        email: null,
        currentRole: null,
        currentCompany: null,
        status: null,
        location: null,
        resume: null,
        professionalExp: null,
        education: null,
        keySkills: null,
        industries: null,
        functions: null,
        whyHireMe: null,
        links: null,
        profilePic: null,
      };
      let link = null;

      let errorMessage = "";

      // preferences percentage
      if (isCheckValue(candidateDetails?.userRegistrationDetails?.name)) {
        percentage.name = 1;
      } else {
        errorMessage = "Add name";
        link = "/candidate/profile/about-me";
      }

      if (isCheckValue(candidateDetails?.userRegistrationDetails?.mobile)) {
        percentage.phone = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Mobile number";
          link = "/candidate/profile/contact-and-online-presence";
        }
      }

      if (isCheckValue(candidateDetails?.userRegistrationDetails?.email)) {
        percentage.email = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Email";
          link = "/candidate/profile/contact-and-online-presence";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.currentDesignation
        )
      ) {
        percentage.currentRole = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Current Designation";
          link = "/candidate/profile/about-me";
        }
      }

      if (
        isCheckValue(candidateDetails?.additionalInfoProfileResponse?.company)
      ) {
        percentage.currentCompany = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Current Company";
          link = "/candidate/profile/about-me";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.jobSearchStatus
        )
      ) {
        percentage.status = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Job search Status";
          link = "/candidate/profile/about-me";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.currentLocation
        )
      ) {
        percentage.location = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Location";
          link = "/candidate/profile/contact-and-online-presence";
        }
      }

      if (isCheckValue(candidateDetails?.userResumeResponse)) {
        percentage.resume = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Resume";
          link = "/candidate/profile/resume";
        }
      }

      if (isCheckValue(candidateDetails?.workExperienceResponse)) {
        percentage.professionalExp = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Professional Experience";
          link = "/candidate/profile/skill-and-experience";
        }
      }
      if (isCheckValue(candidateDetails?.educationalExperienceResponse)) {
        percentage.education = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Education";
          link = "/candidate/profile/education-and-academics";
        }
      }
      if (isCheckValue(candidateDetails?.skillsResponse?.keySkills)) {
        percentage.keySkills = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Skills";
          link = "/candidate/profile/skill-and-experience";
        }
      }

      if (isCheckValue(candidateDetails?.skillsResponse?.industries)) {
        percentage.industries = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Industries";
          link = "/candidate/profile/skill-and-experience";
        }
      }

      if (isCheckValue(candidateDetails?.skillsResponse?.functions)) {
        percentage.functions = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Functions";
          link = "/candidate/profile/skill-and-experience";
        }
      }
      if (
        isCheckValue(candidateDetails?.additionalInfoProfileResponse?.aboutMe)
      ) {
        percentage.whyHireMe = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Why you should hire me ";
          link = "/candidate/profile/about-me";
        }
      }
      if (isCheckValue(candidateDetails?.socialLinksResponses)) {
        percentage.links = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add SocialLink";
          link = "/candidate/profile/contact-and-online-presence";
        }
      }
      if (
        isCheckValue(
          candidateDetails?.basicDetailsResponse?.profilePicDownloadURL
        )
      ) {
        percentage.profilePic = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Add Profile Picture";
          link = "/candidate/profile/about-me";
        }
      }

      let finalPercent = Math.round(
        ((percentage.name +
          percentage.phone +
          percentage.email +
          percentage.currentRole +
          percentage.currentCompany +
          percentage.status +
          percentage.location +
          percentage.resume +
          percentage.professionalExp +
          percentage.education +
          percentage.keySkills +
          percentage.industries +
          percentage.functions +
          percentage.whyHireMe +
          percentage.links +
          percentage.profilePic) /
          totalParameters) *
          100
      );

      let finalRemain =
        percentage.name +
        percentage.phone +
        percentage.email +
        percentage.currentRole +
        percentage.currentCompany +
        percentage.status +
        percentage.location +
        percentage.resume +
        percentage.professionalExp +
        percentage.education +
        percentage.keySkills +
        percentage.industries +
        percentage.functions +
        percentage.whyHireMe +
        percentage.links +
        percentage.profilePic;
      return {
        percent: finalPercent,
        remain: finalRemain,
        error: errorMessage,
        link: link ? link : "/",
      };
    }
  };
  useEffect(() => {
    if (candidateDetails?.basicDetailsResponse) {
      downloadPicture(
        candidateDetails?.basicDetailsResponse?.profilePicDownloadURL
      );
    }
    let candidateName = candidateDetails?.userRegistrationDetails?.name;
    let candidateInitials =
      candidateName?.split(" ")[0]?.charAt(0)?.toUpperCase() +
      candidateName?.split(" ")[1]?.charAt(0)?.toUpperCase();
    setUserInitials(candidateInitials);
  }, [candidateDetails]);

  useEffect(() => {
    if (candidateDetails?.userRegistrationDetails) {
      checkProfileProgressPercentagePreferences();
    }
  }, [candidateDetails?.userRegistrationDetails]);
  return (
    <div className="candidate-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="profile-indentification d-flex align-items-center">
              <div className="profile-pic">
                <ProfileImage
                  src={profileSrc}
                  name={candidateDetails?.userRegistrationDetails?.name}
                  initialsContainerClass="initialsStyle2"
                  backgroundColor="white"
                />
              </div>
              <div className="profile-name">
                <p className="greeting">{status}</p>
                <p className="name text-capitalize my-view-header-name-display header-ellipse-1">
                  {candidateDetails?.userRegistrationDetails?.name}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="candidate-profile-action d-flex justify-content-between align-items-md-center align-items-end justify-content-md-end">
              <div className="add-skills d-none d-md-block">
                {/* <Link
                  to="profile/skill-and-experience"
                  className="text-decoration-none"
                >
                  Add Skills
                </Link> */}
                <Link
                  to={
                    checkProfileProgressPercentagePreferences()?.link
                      ? checkProfileProgressPercentagePreferences()?.link
                      : "/"
                  }
                  className="text-decoration-none"
                >
                  {checkProfileProgressPercentagePreferences()?.error
                    ? checkProfileProgressPercentagePreferences()?.error
                    : ""}
                </Link>
              </div>
              <div className="edit-profile">
                <Link
                  to="/candidate/profile/about-me"
                  className="text-decoration-none"
                >
                  <button
                    type="button"
                    className="btn btn-outline-dark p-1 d-flex align-items-center justify-content-center"
                    style={{ width: "113px", height: "32px" }}
                  >
                    <div>
                      <img
                        src={editIcon}
                        alt="edit"
                        width="12px"
                        height="12px"
                      />
                    </div>
                    <div className=" ">Edit Profile</div>
                  </button>
                </Link>
              </div>
              <div className="profile-update me-2">
                <div className="d-flex text-end ">
                  <ProfileCompletionBar
                    candidateDetails={candidateDetails}
                    customCssClass={"small-text-black"}
                  />
                </div>
              </div>
              {/* <div className="profile-update">
                <div className="d-flex">
                  <div className="small-text-gray percentage text-end">
                    <span>
                      {checkProfileProgressPercentagePreferences()?.percent}%
                    </span>
                    <br />
                    Profile Updated
                    <ProgressBar
                      now={checkProfileProgressPercentagePreferences()?.percent}
                      // now={30}
                      style={{ height: "0.5rem", width: "5.5rem" }}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
