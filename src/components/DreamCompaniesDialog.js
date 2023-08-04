import React, { useState, useEffect } from "react";
import close from "../assests/icons/ic-close-24.svg";
import { MASTER_TYPE } from "../constants/keys";
import { getMaster } from "../_services/view.service";
import SearchComboBox from "./SearchComboBox";
import { useStoreState } from "easy-peasy";
import { isEmpty } from "../utils/form_validators";

const DreamCompany = ({ setDreamCompany }) => {
  const [role, setRole] = useState([]);
  const [dreamsStatic, setDreamStatic] = useState([]);
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );

  const [dreamOutput, setDreamOutput] = useState();

  const getAllMasterData = async () => {
    const companies = await getMaster(MASTER_TYPE.COMPANY);
    let company = companies.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setRole(company);
    const dreamsStatic = await getMaster(MASTER_TYPE.COMPANY);
    let dreamStatic = dreamsStatic?.filter((el) => {
      return el?.isRecent === true;
    });
    setDreamStatic(dreamStatic);
  };
  useEffect(() => {
    setDreamOutput(candidateDetails?.userJobPreferences?.dreamCompany);
  }, [candidateDetails]);
  useEffect(() => {
    getAllMasterData();
  }, []);
  return (
    <div className="model-gradient-background p-0 m-0 job-preferences-full-width">
      {/* dream-company modal */}
      <div className="container p-2">
        <div className="job-preference-dialog-content pt-5">
          <div className="d-flex justify-content-center align-content-center">
            <div className="mt-5 text-center">
              <h2 className="color-primary fs-24 fw-700"> Dream Companies </h2>
              <br />
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                {dreamsStatic?.map((team, index) => {
                  if (
                    team.masterValue === "Google" ||
                    team.masterValue === "Catseye system & solution" ||
                    team.masterValue === "Microsoft" ||
                    team.masterValue === "Apple"
                  ) {
                    return (
                      <div
                        key={index}
                        className={
                          dreamOutput?.includes(
                            team?.masterValue === null ? "" : team?.masterValue
                          )
                            ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0 "
                            : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                        }
                        onClick={() => {
                          if (!isEmpty(dreamOutput)) {
                            let itemIndex = dreamOutput.findIndex(
                              (tm) => tm === team?.masterValue
                            );
                            const newSelectTeams = [...dreamOutput];
                            if (newSelectTeams.includes(team?.masterValue)) {
                              newSelectTeams.splice(itemIndex, 1);
                            } else {
                              newSelectTeams.push(team?.masterValue);
                            }
                            setDreamOutput(newSelectTeams);
                            setDreamCompany(newSelectTeams);
                          } else {
                            setDreamOutput([team?.masterValue]);
                            setDreamCompany([team?.masterValue]);
                          }
                        }}
                      >
                        {team?.masterValue}
                      </div>
                    );
                  }
                })}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <SearchComboBox
                  inputData={role ? role : []}
                  defaultValue={dreamOutput}
                  isMultiSelect={true}
                  inputCssClass={
                    "modal-input combo-search-box rounded-pill box-shadow ps-4 bg-white mb-2 border-0 p-3 fs-12 searchbox-fixed-width"
                  }
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search "}
                  onSelect={(event) => {
                    setDreamOutput(event);
                    setDreamCompany(event);
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={"white p-2 fs-16 shadow-none"}
                  hideBadges={true}
                  isAllowUserDefined={false}
                />
              </div>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                {dreamOutput &&
                  dreamOutput?.length > 0 &&
                  dreamOutput?.map((dreamOutputItem, index) => {
                    if (dreamOutputItem !== "") {
                      return (
                        <div
                          key={index + 1}
                          className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline"
                        >
                          <div className="d-flex gap-md-2 gap-1 align-items-center">
                            <p>{dreamOutputItem}</p>
                            <button
                              onClick={() => {
                                const newDreamsOutput = [...dreamOutput];
                                if (dreamOutput.includes(dreamOutputItem)) {
                                  let itemIndex = newDreamsOutput.findIndex(
                                    (tm) => tm === dreamOutputItem
                                  );

                                  newDreamsOutput.splice(itemIndex, 1);
                                  setDreamOutput(newDreamsOutput);
                                  setDreamCompany(newDreamsOutput);
                                }
                              }}
                              className=" btn-close-dropdown bg-transparent border-0 "
                            >
                              x
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
              {dreamOutput?.length == 0 ? (
                <div style={{ height: "200px" }} />
              ) : (
                <div style={{ height: "100px" }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamCompany;
