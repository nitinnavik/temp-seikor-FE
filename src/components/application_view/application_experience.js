import React from "react";
import {
  NO_DATA_VIEW_APPLICATION,
  NO_EXPERIENCE_ADDED,
} from "../../constants/message";
import NoDataFoundCard from "../common/no_data_found_card";

const ApplicationExperience = ({ professionalExperienceDetails }) => {
  return (
    <div className="mt-4">
      <div className="title-card my-4 fw-bold fs-24">
        Professional Experience
      </div>
      {professionalExperienceDetails?.length !== 0 ? (
        <div className="card-parent-container mb-5">
          {professionalExperienceDetails?.map((edu) => {
            return (
              <>
                <div className="card-container p-3">
                  <div className="pt-3 ps-2">
                    <div>
                      <span className="card-badge">
                        {edu?.startDate} - {edu?.endDate}
                      </span>
                    </div>
                    <div className="title-card py-3">{edu.jobRole}</div>
                    <div className="card-subtitle">
                      {`${edu?.companyName} |
                      ${edu?.jobLocation} |
                      ${edu?.jobType} |
                      ${edu?.jobFunction}`}
                    </div>
                    <div className="card-content text-break">
                      {edu?.jobSummary}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <NoDataFoundCard text={NO_EXPERIENCE_ADDED} />
      )}
    </div>
  );
};

export default ApplicationExperience;
