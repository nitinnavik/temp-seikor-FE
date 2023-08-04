import React from "react";
import icSkill from "../../assests/icons/skill-and-experience.svg";
import {
  NO_DATA_VIEW_APPLICATION,
  NO_SKILLS_EXPERIENCE_ADDED,
} from "../../constants/message";
import { isEmpty } from "../../utils/form_validators";
import NoDataFoundCard from "../common/no_data_found_card";

const ApplicationSkills = ({ skillAndExperienceDetails }) => {
  return (
    <>
      <div className="mt-5">
        <div className="fw-bold fs-24">
          <img src={icSkill} className="me-2" alt="Skills-icon" />
          Skill and Experience
        </div>
        {skillAndExperienceDetails?.skills?.length !== 0 &&
        skillAndExperienceDetails?.industries?.length !== 0 &&
        skillAndExperienceDetails?.functions?.length !== 0 ? (
          <div>
            <div className="box-shadow border-radius p-4 mt-3 ">
              {skillAndExperienceDetails?.skills?.length !== 0 && (
                <div>
                  <div className="color-primary fs-16 fw-600"> Key Skills </div>
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    {skillAndExperienceDetails?.skills?.map((skill, index) => {
                      return (
                        <div className="font-color-pink" key={index}>
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                  <hr></hr>
                </div>
              )}

              {skillAndExperienceDetails?.industries?.length !== 0 && (
                <div>
                  <div className="color-primary fs-16 fw-600"> Industries </div>
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    {skillAndExperienceDetails?.industries?.map(
                      (industry, index) => {
                        return (
                          <div className="font-color-blue" key={index}>
                            {industry}
                          </div>
                        );
                      }
                    )}
                  </div>
                  <hr></hr>
                </div>
              )}

              {skillAndExperienceDetails?.functions?.length !== 0 && (
                <div>
                  <div className="color-primary fs-16 fw-600"> Functions </div>
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    {skillAndExperienceDetails?.functions?.map(
                      (keyFunction, index) => {
                        return (
                          <div className="font-gray-bg" key={index}>
                            {keyFunction}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <NoDataFoundCard text={NO_SKILLS_EXPERIENCE_ADDED} />
        )}
      </div>
    </>
  );
};

export default ApplicationSkills;
