import React, { useEffect, useState } from "react";
import SearchComboBox from "../components/SearchComboBox";
import { useStoreState } from "easy-peasy";
import { getMaster } from "../_services/view.service";
import { MASTER_TYPE } from "../constants/keys";
import { isEmpty } from "../utils/form_validators";

const AddRoleJobPreference = ({ setPreferedRoles, setPreferedTeams }) => {
  const [flagInitialIsEmpty, setflagInitialIsEmpty] = useState(true);

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  const [roleOutput, setRoleOutput] = useState([]);
  const [masterRoleList, setMasterRoleList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectTeams, setSelectTeams] = useState([]);
  const [teamsStatic, setTeamStatic] = useState([]);
  const [roleStatic, setRoleStatic] = useState([]);


  const getAllMasterData = async () => {
    const roles = await getMaster(MASTER_TYPE.JOBROLE);
    let role = roles.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setMasterRoleList(role);
    const functions = await getMaster(MASTER_TYPE.FUNCTIONS);
    let funct = functions.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setTeams(funct);
    const rolesStatic = await getMaster(MASTER_TYPE.JOBROLE);
    let roleStatic = rolesStatic?.filter((el) => {
      return el?.isRecent === true;
    });
    setRoleStatic(roleStatic);
    const teamsStatic = await getMaster(MASTER_TYPE.FUNCTIONS);
    let teamstatic = teamsStatic?.filter((el) => {
      return el?.isRecent === true;
    });
    setTeamStatic(teamstatic);
  };

  useEffect(() => {
    setRoleOutput(candidateDetails?.userJobPreferences?.preferedRoles);
    setSelectTeams(candidateDetails?.userJobPreferences?.preferedTeams);
    if (
      !isEmpty(candidateDetails?.userJobPreferences?.preferedRoles) ||
      !isEmpty(candidateDetails?.userJobPreferences?.preferedTeams)
    ) {
      setflagInitialIsEmpty(false);
    }
  }, [candidateDetails]);
  useEffect(() => {
    getAllMasterData();
  }, []);

  return (
    <div className="job-preference-first-screen p-2 job-preferences-full-width">
      <div className="container text-center ">
        <div className="job-preference-dialog-content">
          <div className="my-5 d-flex justify-content-center align-content-center ">
            <div>
              <div className="large-text-dark my-4">
                Add roles you are looking for
              </div>
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                {roleStatic?.map((role, index) => {
               if(role.masterValue==="Accounts Manager" || role.masterValue==="Software Engineer" || role.masterValue==="Technical Support" || role.masterValue==="Sales Assistant" || role.masterValue==="Cloud Computing" ) { 

                  return (
                    <div
                      key={index + 1}
                      className={
                        roleOutput?.includes(
                          role?.masterValue === null ? "" : role?.masterValue
                        )
                        ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                        : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"                    
                          }
                      onClick={() => {
                        if (!isEmpty(roleOutput)) {
                          const newroleOutput = [...roleOutput];
                          if (newroleOutput.includes(role?.masterValue)) {
                            let itemIndex = roleOutput.findIndex(
                              (tm) => tm === role?.masterValue
                            );
                            newroleOutput.splice(itemIndex, 1);
                          } else {
                            newroleOutput.push(role?.masterValue);
                          }
                          setRoleOutput(newroleOutput);
                          setPreferedRoles(newroleOutput);
                        } else {
                          setRoleOutput([role?.masterValue]);
                          setPreferedRoles([role?.masterValue]);
                        }
                      }}
                    >
                      {role?.masterValue}
                    </div>
                  );
                    }
                })}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <SearchComboBox
                  inputData={masterRoleList}
                  defaultValue={roleOutput}
                  isMultiSelect={true}
                  inputCssClass={
                    "modal-input combo-search-box rounded-pill ps-5 bg-white border-0 fs-14 box-shadow searchbox-fixed-width add-search-icon"
                  }
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search or Select"}
                  onSelect={(event) => {
                    setRoleOutput(event);
                    setPreferedRoles(event);
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={"white p-2 fs-16 shadow-none"}
                  hideBadges={true}
                  isAllowUserDefined={true}
                />
              </div>
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
                {roleOutput &&
                  roleOutput.length > 0 &&
                  roleOutput.map((roleOutputItem, index) => {
                    if (roleOutputItem !== "") {
                      return (
                        <div
                          key={index + 1}
                          className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline"
                          // onClick={() => setroleOutputListItem(roleOutputItem)}
                        >
                          <div className="d-flex flex-wrap">
                            <p>{roleOutputItem}</p>
                            <button
                              onClick={() => {
                                const newroleOutput = [...roleOutput];
                                if (roleOutput.includes(roleOutputItem)) {
                                  let itemIndex = roleOutput.findIndex(
                                    (tm) => tm === roleOutputItem
                                  );

                                  newroleOutput.splice(itemIndex, 1);
                                  setRoleOutput(newroleOutput);
                                  setPreferedRoles(newroleOutput);
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
              <div className="fs-20 fw-700 mt-5 mb-3 text-black">
                Select teams to look for opportunities in
              </div>
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                {teamsStatic?.map((team, index) => {
               if(team.masterValue==="Engineering" || team.masterValue==="Design" || team.masterValue==="Sales" || team.masterValue==="Operations" || team.masterValue==="Marketing" ) { 

                  return (
                    <div
                      key={index + 1}
                      className={
                        selectTeams?.includes(
                          team?.masterValue === null ? "" : team?.masterValue
                        )
                          ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0 "
                          : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                      }
                      onClick={() => {
                        if (!isEmpty(selectTeams)) {
                          const newSelectTeams = [...selectTeams];
                          if (newSelectTeams.includes(team?.masterValue)) {
                            let itemIndex = selectTeams?.findIndex(
                              (tm) => tm === team?.masterValue
                            );
                            newSelectTeams.splice(itemIndex, 1);
                          } else {
                            newSelectTeams.push(team?.masterValue);
                          }
                          setSelectTeams(newSelectTeams);
                          setPreferedTeams(newSelectTeams);
                        } else {
                          setSelectTeams([team?.masterValue]);
                          setPreferedTeams([team?.masterValue]);
                        }
                      }}
                    >
                      {team?.masterValue}
                    </div>
                  );
                    }
                })}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <SearchComboBox
                  inputData={teams}
                  defaultValue={selectTeams}
                  isMultiSelect={true}
                  inputCssClass={
                    "modal-input combo-search-box rounded-pill border-0 fs-14 box-shadow ps-5 bg-white mb-2 searchbox-fixed-width add-search-icon"
                  }
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search or Select"}
                  onSelect={(event) => {
                    setSelectTeams(event);
                    setPreferedTeams(event);
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={
                    "text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none"
                  }
                  hideBadges={true}
                  isAllowUserDefined={false}
                />
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                {selectTeams &&
                  selectTeams?.length > 0 &&
                  selectTeams?.map((selectTeamsItem, index) => {
                    if (selectTeamsItem !== "") {
                      return (
                        <div
                          key={index + 1}
                          className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline"
                        >
                          <div className="d-flex flex-wrap">
                            <p>{selectTeamsItem}</p>
                            <button
                              onClick={() => {
                                const newTeamsOutput = [...selectTeams];
                                if (selectTeams.includes(selectTeamsItem)) {
                                  let itemIndex = roleOutput.findIndex(
                                    (tm) => tm === selectTeamsItem
                                  );

                                  newTeamsOutput.splice(itemIndex, 1);
                                  setSelectTeams(newTeamsOutput);
                                  setPreferedTeams(newTeamsOutput);
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleJobPreference;
