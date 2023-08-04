import React, { useState } from "react";
const ProfilePic = ({ url, name, type }) => {
  const [userInitials, setUserInitials] = useState("");

  let candidateInitials =
    name?.split(" ")[0]?.charAt(0)?.toUpperCase() +
    name?.split(" ")[1]?.charAt(0)?.toUpperCase();
  setUserInitials(candidateInitials);
  return (
    <>
      <div className="defaultProfileDiv">
        <p className="d-flex justify-content-center align-items-center initialsStyle">
          {userInitials}
        </p>
      </div>
    </>
  );
};
export default ProfilePic;
