/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import icWhiteDone from "../../assests/icons/ic_done_white.svg";
import { CHOICE_QUESTION, FREE_TEXT } from "../../constants/keys";

const ApplicationQuestions = ({ additionalQuestionsDetails }) => {
  return (
    <div className="mt-5 mb-5">
      <div className="fs-24 fw-700 color-primary"> Additional Questions</div>
      {additionalQuestionsDetails?.map((question) => {
        return (
          <>
            <div className="fw-500 fs-16 pt-3">{question[0]?.question}</div>
            {question[0]?.isMandate == true ? (
              <div className="small-text-gray pb-2">Mandatory to answer</div>
            ) : (
              <div className="small-text-gray pb-2">Optional</div>
            )}
            <div className="pb-3 pt-2 ">
              {question[0]?.quesType == CHOICE_QUESTION ? (
                <button className="btn rounded-pill border pe-2 ps-2 p-0 d-flex">
                  <img
                    src={icWhiteDone}
                    className="bg-black p-1 rounded-circle me-1 mt-1"
                  />
                  <span> {question[1]?.answer}</span>
                </button>
              ) : (
                <div className="pt-3 pb-3">
                  <p className="color-tertiary fs-12 fw-400">
                    {question[1]?.answer}
                  </p>
                  <hr></hr>
                </div>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ApplicationQuestions;
