import React from "react";
import { useStoreState } from "easy-peasy";

const ExpectedExperienceReferralsPreferencesModal = ({
  setMinExperience,
  setMaxExperience,
  minExperience,
  maxExperience,
}) => {
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );
  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const checkMaxValue = (value) => {
    if (!value) {
      setMaxExperience("");
      // setMinExperience("");
    } else {
      let number = Number(value);
      // console.log(minExperience, maxExperience);
      if (number < minExperience) {
        setMinExperience(number);
        setMaxExperience(number);
      } else {
        setMaxExperience(number);
      }
    }
  };

  const checkMinValue = (value) => {
    if (!value) {
      setMinExperience("");
    } else {
      // console.log(minExperience, maxExperience);
      let number = Number(value);
      if (number > maxExperience) {
        setMaxExperience(number);
        setMinExperience(number);
      } else {
        setMinExperience(number);
      }
    }
  };

  return (
    <div className="model-gradient-background p-0 m-0 job-preferences-full-height overflow-scroll">
      {/* dream-company modal */}
      <div className="container p-2">
        <div className="job-preference-dialog-content">
          <div className="d-flex justify-content-center align-content-center">
            <div className="mt-5">
              <h2 className="color-primary fs-24 fw-700 mb-3">
                Show me jobs that need experience of
              </h2>
              <br />

              <div className="w-100 d-flex gap-3 justify-content-center">
                <input
                  type="number"
                  className="btn input-border-black p-2"
                  // defaultValue={
                  //   candidateDetails?.refereePreferencesResponse?.minExperience
                  //     ? candidateDetails?.refereePreferencesResponse
                  //         ?.minExperience
                  //     : ""
                  // }
                  value={minExperience}
                  onKeyDown={blockInvalidChar}
                  // onChange={(e) => setMinExperience(e.target.value)}
                  onChange={(e) => {
                    //> 0 ? e.target.value : 0
                    if (e?.target?.value > 100) {
                      return;
                    } else {
                      checkMinValue(e?.target?.value);
                    }
                  }}
                  // onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                />
                <span className="pt-2"> to </span>
                <input
                  type="number"
                  className="btn p-2 input-border-black"
                  // defaultValue={
                  //   candidateDetails?.refereePreferencesResponse?.maxExperience
                  //     ? candidateDetails?.refereePreferencesResponse
                  //         ?.maxExperience
                  //     : ""
                  // }
                  value={maxExperience}
                  onKeyDown={blockInvalidChar}
                  // onChange={(e) => setMaxExperience(e.target.value)}
                  onChange={(e) => {
                    if (e?.target?.value > 100) {
                      return;
                    } else {
                      checkMaxValue(e?.target?.value);
                    }
                  }}
                  // onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
               />
                <span className="pt-2"> Years </span>
              </div>
              {/* <div className="w-100 d-flex justify-content-center mt-5">
                <input type="range" className="w-50 p-1" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectedExperienceReferralsPreferencesModal;
