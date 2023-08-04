import React, { useEffect, useState } from "react";
import { CHOICE_QUESTION, FREE_TEXT, NO, YES } from "../constants/keys";
import { NO_QUESTIONS_ADDED } from "../constants/message";
import NoDataFoundCard from "./common/no_data_found_card";
import { isEmpty } from "../utils/form_validators";
import { useStoreState } from "easy-peasy";

const NonLoginUserApplyForJobQuestions = (props) => {
  const [charactersTyped, setCharactersTyped] = useState(500);
  const tempQuestions = useStoreState((state) => state?.tempQuestions);
  const applyForJobNonLoginUser = useStoreState(
    (state) => state?.applyForJobNonLoginUser
  );

  useEffect(() => {
    if (tempQuestions?.length > 0) {
      let temp = [];
      tempQuestions?.map((question, index) => {
        temp.push({
          questionId: question.questionId,
          answer: applyForJobNonLoginUser?.jobAnswers[index]?.answer,
          isMandatory: question.isMandatory,
        });
      });
      props?.setApplyForJob({ ...props.applyForJob, jobAnswers: [...temp] });
    } else if (!tempQuestions || tempQuestions?.length == 0) {
      props?.setIsMandatory(true);
      if (props?.setIsDisabled) {
        props?.setIsDisabled(false);
      }
    }
  }, [props?.jobDetails]);

  useEffect(() => {
    if (JSON.stringify(tempQuestions?.questions)?.length > 0) {
      let condition;
      props?.setIsMandatory(false);
      if (JSON.stringify(props?.applyForJob?.jobAnswers)?.length > 0) {
        tempQuestions?.questions?.map((ques, i1) => {
          props?.applyForJob?.jobAnswers?.some((ans, i2) => {
            if (ques?.questionId === ans?.questionId) {
              if (ques?.isMandatory !== "N") {
                condition = isEmpty(ans?.answer);
              }
            }
          });
        });

        props?.setIsMandatory(condition);
        if (props?.setIsDisabled) {
          props?.setIsDisabled(!condition);
        }
      }
    } else {
      props?.setIsMandatory(true);
      if (props?.setIsDisabled) {
        props?.setIsDisabled(false);
      }
    }
  }, [props?.applyForJob]);
  useEffect(() => {
    let copyArray = [];
    props?.applyForJob?.jobAnswers?.map((answers) => {
      if (answers?.isMandatory == "Y" && answers?.answer == "") {
        copyArray?.push(answers);
      }
    });
  }, [props?.applyForJob]);

  const handleQuestion = (Id, isMandatory, value) => {
    const jobCurrentIndex = props?.applyForJob?.jobAnswers.findIndex(
      (item) => item.questionId === Id
    );
    const newApplyForJob = { ...props?.applyForJob };
    newApplyForJob.jobAnswers[jobCurrentIndex].answer = value;
    props.setApplyForJob(newApplyForJob);
  };
  return (
    <>
      {tempQuestions?.questions?.length ? (
        <div className="container fade.in">
          <hr></hr>
          <div className="d-flex justify-content-center medium-black-text fw-700">
            Answer additional Questions
          </div>
          <hr></hr>
          {tempQuestions?.questions?.map((question, index) => {
            if (question.quesType === FREE_TEXT) {
              return (
                <>
                  <div className="pt-3 pb-3">
                    <h5 className="fw-500 fs-16">{question.questionText}</h5>
                    {question.isMandatory === "Y" ? (
                      <div className="small-text-gray pb-2">
                        Mandatory to answer
                        <span className="dark-pink-text">*</span>
                      </div>
                    ) : (
                      <div className="small-text-gray pb-2">Optional</div>
                    )}

                    <textarea
                      placeholder="Type your answer here..."
                      rows="5"
                      className="p-3 border border-radius w-100"
                      defaultValue={
                        applyForJobNonLoginUser?.jobAnswers[index]?.answer
                      }
                      onChange={(e) => {
                        if (charactersTyped > 0) {
                          handleQuestion(
                            question.questionId,
                            question.isMandatory,
                            e.target.value
                          );
                          setCharactersTyped(500 - e?.target?.value?.length);
                        }
                      }}
                    ></textarea>
                    <div className="d-flex justify-content-end small-text-gray pb-3">
                      {`${charactersTyped} characters left`}
                    </div>
                  </div>
                  <hr></hr>
                </>
              );
            } else {
              return <></>;
            }
          })}

          {tempQuestions?.questions?.map((question, index) => {
            if (question.quesType === CHOICE_QUESTION) {
              return (
                <>
                  <div className="fw-500 fs-16 pt-3" key={index}>
                    {question.questionText}
                  </div>
                  {question.isMandatory === "Y" ? (
                    <div className="small-text-gray pb-2">
                      Mandatory to answer
                      <span className="dark-pink-text">*</span>
                    </div>
                  ) : (
                    <div className="small-text-gray pb-2">Optional</div>
                  )}

                  <div className="pb-3 pt-2">
                    <input
                      type="radio"
                      id={`toggle-yes${index}`}
                      name={`answer${index}`}
                      className="yesNo"
                      onClick={() =>
                        handleQuestion(
                          question.questionId,
                          question.isMandatory,
                          YES
                        )
                      }
                    />

                    <label
                      htmlFor={`toggle-yes${index}`}
                      className="btn rounded-pill border pe-5 ps-5 me-3"
                    >
                      {" "}
                      Yes
                    </label>
                    <input
                      type="radio"
                      id={`toggle-no${index}`}
                      className="yesNo"
                      name={`answer${index}`}
                      onClick={() =>
                        handleQuestion(
                          question.questionId,
                          question.isMandatory,
                          NO
                        )
                      }
                    />

                    <label
                      htmlFor={`toggle-no${index}`}
                      className="btn rounded-pill border pe-5 ps-5 no-btn-responsive"
                    >
                      No
                    </label>
                  </div>
                </>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      ) : (
        <>
          <div className="no-data-found-width">
            <NoDataFoundCard text={NO_QUESTIONS_ADDED} />
          </div>
        </>
      )}
    </>
  );
};

export default NonLoginUserApplyForJobQuestions;
