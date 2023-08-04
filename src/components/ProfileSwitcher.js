import React, { useState } from "react";

const ProfileSwitcher = ({ profileSwitcher, setProfileSwitcher }) => {
  // const [candidateProfileSelected, setCandidateProfileSelected] = useState(
  //   profileSwitcher === "candidate" ? true : false
  // );
  // const [refereeProfileSelected, setRefereeProfileSelected] = useState(
  //   profileSwitcher !== "candidate" ? true : false
  // );

  const onSwitchClick = (name) => {
    //   if (name === "candidate") {
    //     setCandidateProfileSelected(true);
    //     setRefereeProfileSelected(false);
    //   } else {
    //     setCandidateProfileSelected(false);
    //     setRefereeProfileSelected(true);
    //   }
    setProfileSwitcher(name);
  };

  return (
    <div className="switch-widget d-inline-block d-flex">
      <button
        className={`option d-inline-block ${
          profileSwitcher === "Candidate Profile" ? "active" : ""
        }`}
        onClick={() => {
          onSwitchClick("Candidate Profile");
        }}
      >
        Candidate Profile
      </button>
      <button
        className={`option d-inline-block ${
          profileSwitcher === "Referee Profile" ? "active" : ""
        }`}
        onClick={() => {
          onSwitchClick("Referee Profile");
        }}
      >
        Referee Profile
      </button>
    </div>
  );
};
export default ProfileSwitcher;
