import React from "react";
import educationLogo from "../../assests/icons/ic_education.svg";
import {
  NO_DATA_VIEW_APPLICATION,
  NO_EDUCATION_ADDED,
} from "../../constants/message";
import NoDataFoundCard from "../common/no_data_found_card";

const ApplicationEducationAndAcademics = ({ educationAndAcademicsDetails }) => {
  return (
    <div>
      <div className="my-3">
        <span className="fw-bold" style={{ fontSize: "24px" }}>
          <img
            style={{ marginRight: "14px" }}
            src={educationLogo}
            alt={educationLogo}
          />
          Education and Academics
        </span>
      </div>
      {educationAndAcademicsDetails?.length !== 0 ? (
        <div className="card-parent-container mb-5">
          {educationAndAcademicsDetails?.map((edu) => {
            return (
              <>
                <div className="card-container p-3">
                  <div className="pt-3 ps-2">
                    <div>
                      <span className="card-badge">
                        {edu?.courseStartDate} - {edu?.courseEndDate}
                      </span>
                    </div>
                    <div className="title-card py-3">{edu?.qualification} </div>
                    <div className="card-subtitle">{`${edu?.institute}`}</div>
                    <div className="card-content">{`${edu?.degreeName}, ${edu?.specialization}`}</div>
                    <div className="card-content">{edu?.outcome}</div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <NoDataFoundCard text={NO_EDUCATION_ADDED} />
      )}
    </div>
  );
};

export default ApplicationEducationAndAcademics;
