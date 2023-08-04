/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import book from "../assests/icons/ic_book.svg";
import AboutMe from "./about_me";
import ContactAndOnlinePresencePage from "../pages/candidate/member-profile/contact_and_online_presence";
import EducationAcademics from "../pages/candidate/member-profile/education_and_academics";
import SkillAndExperience from "../pages/candidate/member-profile/skill_and_experience";
import UpdateResume from "./UpdateResume";
import { useStoreState, useStoreActions } from "easy-peasy";
import QuickApplyResumeSelection from "./QuickApplyResumeSelection";
import SelectResume from "./SelectResume";
import CompanyImage from "./company_image";

const ApplyForJob = (props) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const isApplyForJobComponent = true;

  // const [newCandidateDetails, setNewCandidateDetails] =
  //   useState(candidateDetails);
  //about me javascript
  // const [roleOutput, setRoleOutput] = useState(["Candidate"]);
  // const roleSelectedOutput = (event) => {
  //   setRoleOutput(event);
  //   console.log("event", event);
  // };
  // console.log(candidateDetails);
  return (
    <div className="container">
      <span className="medium-black-text"> APPLYING FOR </span>
      <div className="">
        <h2 className="large-text-dark-gray fs-20 fw-700 mt-2">
          {" "}
          {props?.jobDetails?.jobTitle}
        </h2>
        <div className="d-flex align-items-center">
          <CompanyImage
            src={props?.jobDetails?.companyProfile?.companyLogo}
            width="50px"
            height="50px"
            name={props?.jobDetails?.companyProfile?.companyName}
            initialsContainerClass="initialsStyle2-xl"
          />
          {/* <img
            src={`data:image/jpeg;base64 , ${props?.jobDetails?.companyProfile?.companyLogo}`}
            className="bg-white p-1 border rounded-3"
            width="40px"
            height="40px"
            alt="airbnb-logo"
          /> */}
          <span className="ps-2 pt-2 medium-black-text">
            {" "}
            {props?.jobDetails?.companyProfile?.companyName}{" "}
          </span>
        </div>
        <hr></hr>
        <div className="d-flex justify-content-center medium-black-text fw-700">
          Review your Application
        </div>
        <hr></hr>

        {/* About section  */}
        <div>
          <AboutMe
            candidateDetails={candidateDetails}
            isApplyForJobComponent={isApplyForJobComponent}
            newCandidateDetails={props?.newCandidateDetails}
            setNewCandidateDetails={props?.setNewCandidateDetails}
            setHideMainModal={props?.setHideMainModal}
          />
        </div>

        {/* Resume section */}
        {/* <div>
          <div className="about-heading pb-3 pt-4">
            <img src={book} alt="book-icon" />
            &nbsp; Resume
          </div>
          <div className="box-shadow mt-3 p-4">
            <h5 className="dark-pink-text fs-16 fw-600 mb-3">
              {" "}
              Select 1 resume for your application{" "}
            </h5>
            {/* <UpdateResume /> */}
        {/*    <QuickApplyResumeSelection/>
          </div>
        </div> */}
        <SelectResume
          applyForJob={props?.applyForJob}
          setApplyForJob={props?.setApplyForJob}
          isResumeSelected={props?.isResumeSelected}
          setIsResumeSelected={props?.setIsResumeSelected}
          forQuickApply={false}
          isApplyForJobComponent={isApplyForJobComponent}
          newCandidateDetails={props?.newCandidateDetails}
          setNewCandidateDetails={props?.setNewCandidateDetails}
          backBtnClicked={props?.backBtnClicked}
          setBackBtnClicked={props?.setBackBtnClicked}
          saveToProfile={props?.saveToProfile}
          setSaveToProfile={props?.setSaveToProfile}
          saveToProfileCheck={props?.saveToProfileCheck}
          setSaveToProfileCheck={props?.setSaveToProfileCheck}
        />

        {/* contact section */}

        <div className="row pt-4">
          <div className="w-100">
            <ContactAndOnlinePresencePage
              isApplyForJobComponent={isApplyForJobComponent}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              setHideMainModal={props?.setHideMainModal}
            />
          </div>

          {/* Skills section */}
          <div className="w-100 mt-3">
            <SkillAndExperience
              candidateDetails={candidateDetails}
              isApplyForJobComponent={isApplyForJobComponent}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              setHideMainModal={props?.setHideMainModal}
            />
          </div>
          {/* Education section  */}
          <div className="w-100">
            <EducationAcademics
              isApplyForJobComponent={isApplyForJobComponent}
              newCandidateDetails={props?.newCandidateDetails}
              setNewCandidateDetails={props?.setNewCandidateDetails}
              setHideMainModal={props?.setHideMainModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForJob;
