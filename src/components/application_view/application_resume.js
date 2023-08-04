import React from "react";
import icResume from "../../assests/icons/ic-resume.svg";
import icThumbnailPdf from "../../assests/icons/thumbnail-pdf.svg";
import NoDataFoundCard from "../common/no_data_found_card";

const ApplicationResume = ({ allDetails }) => {
  return (
    <div>
      <div className="d-flex mt-5 gap-2">
        <img src={icResume} alt={"Resume"} />
        <span className="fw-bold fs-24">Resume</span>
      </div>
      {allDetails?.resumeName !== null ? (
        <>
          <div className="box-shadow border-radius p-2 ps-3 mt-3 feedback-background  ">
            <div className=" d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <img src={icThumbnailPdf} alt="thumbnailPDF-icon" />
                <div className="fs-11 fw-600 color-secondary">
                  {allDetails?.resumeName === "" ||
                  allDetails?.resumeName === null
                    ? "resume"
                    : allDetails?.resumeName}
                </div>
                {/* <div className="fs-11 fw-600 color-secondary">
          {resumeName ? resumeName : "No resume is added"}
        </div> */}
              </div>
              <div>
                <button
                  className="btn-dialog-cancel"
                  onClick={() =>
                    window.open(
                      `https://api.seikor.com${allDetails?.resumePath}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoDataFoundCard text="Not Uploaded" />
      )}
    </div>
  );
};

export default ApplicationResume;
