import React, { useEffect } from "react";
import { useState } from "react";

const ProfileImage = ({
  src,
  name,
  initialsContainerClass,
  height,
  width,
  backgroundColor,
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isError, setIsError] = useState(false);
  const [initials, setInitials] = useState(null);

  const getInitialsLetter = async () => {
    if (name?.split(" ").length > 1) {
      let InitName =
        name?.split(" ")[0]?.charAt(0)?.toUpperCase() +
        name?.split(" ")[1]?.charAt(0)?.toUpperCase();
      setInitials(InitName);
      setShowLoader(false);
    } else {
      let InitName = name?.split(" ")[0]?.charAt(0)?.toUpperCase();
      setInitials(InitName);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    // console.log("src", src);
    getInitialsLetter();
  }, [isError, name, src]);

  return (
    <>
      {showLoader ? (
        <img
          src={require("./../assests/icons/loadingGif.gif")}
          style={{
            height: `${height ? height : "100%"}`,
            width: `${width ? width : "100%"}`,
            background: `${backgroundColor ? backgroundColor : "transparent"}`,
          }}
          className={`profile-image-resolution ${
            initialsContainerClass ? initialsContainerClass : ""
          }`}
          alt=""
        />
      ) : !isError && src && (!name || name) ? (
        <>
          <img
            src={src}
            style={{
              height: `${height ? height : "100%"}`,
              width: `${width ? width : "100%"}`,
              background: `${
                backgroundColor ? backgroundColor : "transparent"
              }`,
            }}
            className={`profile-image-resolution ${
              initialsContainerClass ? initialsContainerClass : ""
            }`}
            alt=""
            onError={() => {
              setIsError(true);
            }}
          />
        </>
      ) : isError || name ? (
        <>
          <p
            className={` d-flex justify-content-center align-items-center companyImageStyle ${
              initialsContainerClass ? initialsContainerClass : "NA"
            }`}
            style={{
              height: `${height ? height : "100%"}`,
              width: `${width ? width : "100%"}`,
            }}
          >
            {initials}
          </p>
        </>
      ) : (
        <img
          src={require("./../assests/images/profile.jpg")}
          style={{
            height: `${height ? height : "100%"}`,
            width: `${width ? width : "100%"}`,
            background: `${backgroundColor ? backgroundColor : "transparent"}`,
          }}
          className={`profile-image-resolution ${
            initialsContainerClass ? initialsContainerClass : ""
          }`}
          alt=""
        />
      )}
    </>
  );
};

export default ProfileImage;
