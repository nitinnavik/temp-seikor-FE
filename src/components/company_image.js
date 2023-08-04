import React, { useEffect } from "react";
import { useState } from "react";

const CompanyImage = ({ src, name, initialsContainerClass, width, height }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isError, setIsError] = useState(false);
  const [initials, setInitials] = useState(null);

  const getInitialsLetter = () => {
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
    getInitialsLetter();
  }, [isError, name, showLoader, src]);
  return (
    <div
      className={
        src
          ? "company-image-border"
          : "company-image-background company-image-border"
      }
    >
      {src || name ? (
        <>
          {" "}
          {!isError ? (
            <img
              src={`data:image/jpeg;base64 , ${src}`}
              height={height}
              width={width}
              style={{ background: "transparent", objectFit: "contain" }}
              alt=""
              onError={() => {
                setIsError(true);
              }}
            />
          ) : initials != null && initials != "" ? (
            <p
              className={` d-flex justify-content-center align-items-center companyImageStyle ${
                initialsContainerClass ? initialsContainerClass : "NA"
              }`}
              style={{
                width: `${width}`,
                textAlign: "center",
                height: `${width} ? ${height} : "100%`,
                borderRadius: "4px",
              }}
            >
              {initials}
            </p>
          ) : (
            <img
              src={require("./../assests/images/placeholder.png")}
              style={{
                height: `${height ? height : "100%"}`,
                width: `${width ? width : "100%"}`,
                background: "transparent",
                borderRadius: "4px",
              }}
              className={`profile-image-resolution ${
                initialsContainerClass ? initialsContainerClass : ""
              }`}
              alt=""
            />
          )}
          {showLoader && (
            <span
              className="spinner-border "
              style={{
                color: "white",

                background:
                  "linear-gradient(336deg, #0b44d8 11.62%, #0578ff 77.5%)",
              }}
            ></span>
          )}
        </>
      ) : (
        <img
          src={require("./../assests/images/placeholder.png")}
          style={{
            height: `${height ? height : "100%"}`,
            width: `${width ? width : "100%"}`,
            background: "transparent",
          }}
          className={`profile-image-resolution ${
            initialsContainerClass ? initialsContainerClass : ""
          }`}
          alt=""
        />
      )}
    </div>
  );
};

export default CompanyImage;
