import React, { useEffect, useState } from "react";
import {
  CHOICE_QUESTION,
  FREE_TEXT,
  NO,
  REQUIRED,
  YES,
} from "../constants/keys";
import { NO_EDUCATION_ADDED, NO_QUESTIONS_ADDED } from "../constants/message";
import NoDataFoundCard from "./common/no_data_found_card";
import { isEmpty } from "../utils/form_validators";
import { useStoreActions } from "easy-peasy";

const ApplyForJobQuestions = (props) => {
const [charactersTyped, setCharactersTyped] = useState({}); // Initialize as an empty object

  const setTempQuestions = useStoreActions(
    (action) => action?.setTempQuestions
  );
  useEffect(() => {
    if (props?.jobDetails?.questions?.length > 0) {
      let temp = [];
      props?.jobDetails?.questions?.map((question, index) => {
        temp.push({
          questionId: question.questionId,
          answer: "",
          isMandatory: question.isMandatory,
        });
      });
      props?.setApplyForJob({ ...props.applyForJob, jobAnswers: [...temp] });
    } else if (
      !props?.jobDetails?.questions ||
      props?.jobDetails?.questions?.length == 0
    ) {
      props?.setIsMandatory(true);
    }
    setTempQuestions(props?.jobDetails);
  }, [props?.jobDetails]);
  useEffect(() => {
    if (props?.jobDetails?.questions?.length > 0) {
      let condition;
      props?.setIsMandatory(false);
      if (props?.applyForJob?.jobAnswers?.length > 0) {
        props?.jobDetails?.questions?.map((ques, i1) => {
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
      props?.setIsMandatory(false);
      if (props?.setIsDisabled) {
        props?.setIsDisabled(true);
      }
    }
  }, [props?.applyForJob]);
  useEffect(() => {
    // const jobAnswerIsPendingAnswerFilter =
    //   props?.applyForJob?.jobAnswers.filter(
    //     (item) => item.isMandatory === "Y" && item.answer === ""
    //   );
    let copyArray = [];
    props?.applyForJob?.jobAnswers?.map((answers) => {
      if (answers?.isMandatory == "Y" && answers?.answer == "") {
        copyArray?.push(answers);
      }
    });
    // console.log("copyarray", copyArray);
    // if (copyArray?.length > 0) {
    //   props.setIsMandatory(true);
    // } else {
    //   props.setIsMandatory(false);
    // }
  }, [props?.applyForJob]);

  const handleQuestion = (Id, isMandatory, value) => {
    const jobCurrentIndex = props?.applyForJob?.jobAnswers.findIndex(
      (item) => item.questionId === Id
    );
    const newApplyForJob = { ...props?.applyForJob };
    newApplyForJob.jobAnswers[jobCurrentIndex].answer = value;
    // newJobAnswers[jobCurrentIndex].answer = value;
    // const newApplyForJob = props?.applyForJob?.jobAnswers.map(
    //   (answerObj, index) => {
    //     if (answerObj.isMandatory === "Y" && answerObj.answer.length === 0) {
    //       isValid = true;
    //       props.setIsMandatory(true);
    //     }
    //     if (answerObj.questionId === Id) {
    //       return { ...answerObj, answer: value };
    //     } else {
    //       return { ...answerObj };
    //     }
    //   }
    // );

    props.setApplyForJob(newApplyForJob);

    // props?.applyForJob?.jobAnswers.map((answerObj, index) => {
    //   if (answerObj.questionId === Id) {
    //     props.applyForJob.jobAnswers[index].answer = value;
    //     props.setApplyForJob(props.applyForJob);
    //   }
    //   if (answerObj.isMandatory === "Y" && answerObj.answer.length === 0) {
    //     isValid = true;
    //     props.setIsMandatory(true);
    //   }
    // });

    // if (!isValid && props.isResumeSelected) {
    //   props.setIsMandatory(false);
    // }
  };
  return (
    <>
      {props?.jobDetails?.questions?.length ? (
        <div className="container fade.in">
          <hr></hr>
          <div className="d-flex justify-content-center medium-black-text fw-700">
            Answer additional Questions
          </div>
          <hr></hr>
          {props?.jobDetails?.questions?.map((question, index) => {
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
                      key={index}
                      onChange={(e) => {
                        const remainingCharacters = 500 - e.target.value.length;
                        const updatedCharactersTyped = { ...charactersTyped }; // Create a copy of the charactersTyped object
                        updatedCharactersTyped[index] = remainingCharacters; // Update the character count for the current input field
                      
                        if (remainingCharacters >= 0) {
                          handleQuestion(
                            question.questionId,
                            question.isMandatory,
                            e.target.value
                          );
                          setCharactersTyped(updatedCharactersTyped);
                        }
                      }}
                      
                    ></textarea>
                    <div className="d-flex justify-content-end small-text-gray pb-3">
                     {/* {`${charactersTyped} characters left`} */}
                     {`${charactersTyped[index] || 500} characters left`}
                    </div>
                  </div>
                  <hr></hr>
                </>
              );
            } else {
              return <></>;
            }
          })}

          {props?.jobDetails?.questions?.map((question, index) => {
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

export default ApplyForJobQuestions;
