import React, { useEffect, useState } from "react";
import skillLogo from "../../../assests/icons/skill-and-experience.svg";
import AddIcon from "../../../assests/icons/ic_add.svg";
import deleteIcon from "../../../assests/icons/delete.svg";
import editIcon from "../../../assests/icons/edit-icon.svg";
import crossButton from "../../../assests/icons/cross-icon.svg";
import SearchComboBox from "../../../components/SearchComboBox";
import Modal from "react-bootstrap/Modal";
import ProfessionalExperience from "../../../components/ProfessionalExperience";
import {
  addCandidateSkills,
  addCandidateWorkExperience,
  getLocations,
  getMaster,
} from "../../../_services/view.service";
import {
  MASTER_TYPE,
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
  TOKEN,
  USER_ID,
  YEAR_PATTERN,
} from "../../../constants/keys";
import toaster from "../../../utils/toaster";
import { getLocalStorage } from "../../../utils/storage";
import { useStoreActions } from "easy-peasy";
import {
  initialiseFormData,
  onFormFeildsChange,
  validateField,
} from "../../../utils/form_validators";
import Loader from "../../../components/common/loader";
import NoDataFoundCard from "../../../components/common/no_data_found_card";
import MonthPicker from "../../../components/month_picker";
import { GENERAL_ERROR_MESSAGE } from "../../../constants/message";

const SkillAndExperience = ({
  candidateDetails,
  isApplyForJobComponent,
  newCandidateDetails,
  setNewCandidateDetails,
}) => {
  let [editId, setEditId] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const token = getLocalStorage(TOKEN);
  //FormData
  const [formData, setFormData] = useState({
    yourRole: {
      valueText: [],
      initial: [],
      errorText: "",
      check: ["required"],
    },
    company: {
      valueText: [],
      initial: [],
      errorText: "",
      check: ["required"],
    },
    function: {
      valueText: [],
      initial: [],
      errorText: "",
      check: [""],
    },
    onGoing: {
      valueText: false,
      initial: false,
      errorText: "",
      check: [""],
    },
    Location: {
      valueText: "",
      initial: "",
      errorText: "",
      check: [""],
    },

    jobType: {
      valueText: "",
      initial: "",
      errorText: "",
      check: [""],
    },

    courseStartMonth: {
      valueText: "Jan",
      initial: "Jan",
      errorText: "",
      check: ["required"],
    },
    courseStartYear: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required", YEAR_PATTERN],
    },

    courseEndMonth: {
      valueText: "Jan",
      initial: "Jan",
      errorText: "",
      check: ["required"],
    },
    courseEndYear: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required", YEAR_PATTERN],
    },

    describe: { valueText: "", errorText: "", check: [""] },
  });

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const [modalShow, setModalShow] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [keySkill, setKeySkill] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [role, setRole] = useState([]);
  const [company, setCompany] = useState([]);
  const [locations, setLocation] = useState([]);
  const [jobtype, setJobtype] = useState([]);
  const [keySkillOutput, setkeySkillOutput] = useState([]);
  const [industriesOutput, setIndustriesOutput] = useState([]);
  const [functionsOutput, setFunctionsOutput] = useState([]);
  const [roleOutput, setRoleOutput] = useState([]);
  const [companyOutput, setCompanyOutput] = useState([]);
  const [locationOutput, setLocationOutput] = useState([]);
  const [jobTypeOutput, setJobTypeOutput] = useState([]);
  const [description, setDescription] = useState("");
  const [isProfessionalCheck, setIsProfessionalCheck] = useState(false);
  const [disabledDate, setDisabledDate] = useState(false);

  const getAllMasterData = async () => {
    const roles = await getMaster(MASTER_TYPE.JOBROLE);
    let role = roles.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setRole(role);
    const companies = await getMaster(MASTER_TYPE.COMPANY);
    let company = companies.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setCompany(company);
    const functions = await getMaster(MASTER_TYPE.FUNCTIONS);
    let funct = functions.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setFunctions(funct);
    // const locations = await getMaster(MASTER_TYPE.LOCATION);
    // let location = locations.map((el) => {
    //   return { name: el.masterValue, description: el.Code };
    // });
    // setLocation(location);

    const locations = await getLocations(MASTER_TYPE.LOCATION);
    let location = locations?.data;
    setLocation(location);

    const jobTypes = await getMaster(MASTER_TYPE.JOBTYPES);
    let jobType = jobTypes.map((el) => {
      return { name: el.masterValue, description: el.Code };
    });
    setJobtype(jobType);
    const skills = await getMaster(MASTER_TYPE.KEYSKILLS);
    const industries = await getMaster(MASTER_TYPE.INDUSTRIES);
    // const functions = await getMaster(MASTER_TYPE.FUNCTIONS);
    if (skills && skills.length > 0) {
      const skillValues = skills?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (skillValues && skillValues.length > 0) {
        setKeySkill(skillValues);
      }
    }
    if (industries && industries.length > 0) {
      const industryValues = industries?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (industryValues && industryValues.length > 0) {
        setIndustries(industryValues);
      }
    }
    if (functions && functions.length > 0) {
      const functionValues = functions?.map(
        (item) => item.masterValue && { name: item.masterValue }
      );
      if (functionValues && functionValues.length > 0) {
        setFunctions(functionValues);
      }
    }
  };

  // getLocations().then((res) => {
  //   setLocation(res?.data);
  //   return res;
  // });

  const onSaveForm = () => {
    const keySkills = keySkillOutput;
    const industries = industriesOutput;
    const functions = functionsOutput;

    if (isApplyForJobComponent && !isCheck) {
      setNewCandidateDetails({
        ...newCandidateDetails,
        skillsResponse: {
          ...newCandidateDetails?.skillsResponse,
          functions: [...functions],
          keySkills: [...keySkills],
          industries: [...industries],
        },
      });
      toaster("success", "Saved for this job!");
    } else {
      const request = {
        keySkills: keySkills,
        industries: industries,
        functions: functions,
      };
      setShowLoader(true);
      addCandidateSkills(request)
        .then((res) => {
          toaster("success", "Saved successfully!");
          setShowLoader(false);
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
          if (isApplyForJobComponent) {
            setNewCandidateDetails({
              ...newCandidateDetails,
              skillsResponse: {
                ...newCandidateDetails?.skillsResponse,
                functions: [...functions],
                keySkills: [...keySkills],
                industries: [industries],
              },
            });
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
        });
    }
  };

  const resetValues = () => {
    if (candidateDetails?.skillsResponse) {
      const info = candidateDetails?.skillsResponse;
      setkeySkillOutput(info?.keySkills);
      setIndustriesOutput(info?.industries);
      setFunctionsOutput(info?.functions);
    }
  };

  useEffect(() => {
    getAllMasterData();
  }, []);

  useEffect(() => {
    resetValues();
  }, [candidateDetails]);

  const handleSave = (e) => {
    let isValid = true;
    Object.keys(formData)?.forEach((key) => {
      if (!validateField(key, formData, setFormData)) {
        isValid = false;
      }
    });

    let userId = localStorage.getItem("userId");

    let isOngoing = formData?.onGoing?.valueText;

    if (isValid) {
      let startDate, endDate;

      if (!isOngoing) {
        startDate =
          formData?.courseStartMonth?.valueText +
          " " +
          formData?.courseStartYear?.valueText;
        endDate =
          formData?.courseEndMonth?.valueText +
          " " +
          formData?.courseEndYear?.valueText;
      } else {
        startDate =
          formData?.courseStartMonth?.valueText +
          " " +
          formData?.courseStartYear?.valueText;
        endDate = "Present";
      }

      let data = {
        id: editId ? editId : null,
        companyName: formData?.company?.valueText?.toString(),
        startDate: startDate,
        endDate: endDate,
        jobRole: formData?.yourRole?.valueText?.toString(),
        jobSummary: formData?.describe?.valueText,
        jobFunction: formData?.function?.valueText?.toString(),
        jobType: formData?.jobType?.valueText?.toString(),
        jobLocation: formData?.Location?.valueText?.toString(),
        isOngoing: isOngoing,
      };

      if (isApplyForJobComponent) {
        var index = newCandidateDetails?.workExperienceResponse?.findIndex(
          (x) => x?.id === data?.id
        );
        if (index === -1 || index === undefined) {
          data.id = new Date().valueOf();
          if (newCandidateDetails?.workExperienceResponse?.length > 0) {
            setNewCandidateDetails({
              ...newCandidateDetails,
              workExperienceResponse: [
                ...newCandidateDetails?.workExperienceResponse,
                { ...data },
              ],
            });
          } else {
            setNewCandidateDetails({
              ...newCandidateDetails,
              workExperienceResponse: [{ ...data }],
            });
          }
        } else {
          setNewCandidateDetails({
            ...newCandidateDetails,
            workExperienceResponse: [
              ...newCandidateDetails?.workExperienceResponse.slice(0, index),
              Object.assign(
                {},
                newCandidateDetails?.workExperienceResponse[index],
                data
              ),
              ...newCandidateDetails?.workExperienceResponse.slice(index + 1),
            ],
          });
        }
        setModalShow(false);
        const tempFormData = { ...formData };
        tempFormData.courseEndYear.check = ["required"];
        setFormData(tempFormData);
        initialiseFormData(formData, setFormData);
        setDisabledDate(false);
      } else {
        setShowLoader(true);
        addCandidateWorkExperience(data)
          .then((res) => {
            if (res?.status === 400) {
              toaster(
                "error",
                res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
              );
              setShowLoader(false);
              return;
            }
            if (res?.status === 200) {
              if (data?.id == null) {
                toaster("success", "Data Added Successfully");
              } else {
                toaster("success", "Error, please try again in some time.");
              }
              const tempFormData = { ...formData };
              tempFormData.courseEndYear.check = ["required"];
              setFormData(tempFormData);
              initialiseFormData(formData, setFormData);
              setDisabledDate(false);
              if (isApplyForJobComponent) {
                var index =
                  newCandidateDetails?.workExperienceResponse?.findIndex(
                    (x) => x.id === data.id
                  );
                if (index === -1) {
                  data.id = res?.data?.data?.id;
                  setNewCandidateDetails({
                    ...newCandidateDetails,
                    workExperienceResponse: [
                      ...newCandidateDetails?.workExperienceResponse,
                      { ...data },
                    ],
                  });
                } else {
                  setNewCandidateDetails({
                    ...newCandidateDetails,
                    workExperienceResponse: [
                      ...newCandidateDetails?.workExperienceResponse.slice(
                        0,
                        index
                      ),
                      Object.assign(
                        {},
                        newCandidateDetails?.workExperienceResponse[index],
                        data
                      ),
                      ...newCandidateDetails?.workExperienceResponse.slice(
                        index + 1
                      ),
                    ],
                  });
                }
              }
              setShowLoader(false);
            } else {
              toaster(
                "error",
                res?.message ? res?.message : GENERAL_ERROR_MESSAGE
              );
              setShowLoader(false);
              const tempFormData = { ...formData };
              tempFormData.courseEndYear.check = ["required"];
              setFormData(tempFormData);
              initialiseFormData(formData, setFormData);
              setDisabledDate(false);
            }

            if (userId) {
              saveCandidateDetails(userId);
            }
            setModalShow(false);
          })
          .catch((err) => {
            console.log("res eror", err);
            toaster(
              "error",
              err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            );
            const tempFormData = { ...formData };
            tempFormData.courseEndYear.check = ["required"];
            setFormData(tempFormData);
            initialiseFormData(formData, setFormData);
            setDisabledDate(false);
            setModalShow(false);
            setShowLoader(false);
          });
      }
    } else {
      toaster("error", "Please input all mandatory fields");
    }
  };

  const selectedValue = (value, name) => {
    let event = {
      target: {
        value: "",
        name: "",
      },
    };
    event.target.value = value;
    event.target.name = name;
    onFormFeildsChange(event, formData, setFormData);
  };

  const handleEdit = (data) => {
    setEditId(data?.id);

    const isOngoing = data?.isOngoing;
    let courseCompleteEndMonth, courseCompleteEndYear;

    if (!isOngoing) {
      courseCompleteEndMonth = data?.endDate?.split(" ")[0];
      courseCompleteEndYear = data?.endDate?.split(" ")[1];
      setDisabledDate(false);
    } else {
      setDisabledDate(true);
      courseCompleteEndMonth = data?.endDate;
      courseCompleteEndYear = "";
      const tempFormData = { ...formData };
      tempFormData.courseEndYear.check = [];
      setFormData(tempFormData);
    }

    const newFormData = { ...formData };

    newFormData.yourRole.valueText = [data?.jobRole];
    newFormData.company.valueText = [data?.companyName];
    newFormData.onGoing.valueText = isOngoing;
    newFormData.describe.valueText = data?.jobSummary;

    if (data?.jobFunction == "") {
      newFormData.function.valueText = [];
    } else {
      newFormData.function.valueText = [data?.jobFunction];
    }
    if (data?.jobFunction == "") {
      newFormData.Location.valueText = [];
    } else {
      newFormData.Location.valueText = [data?.jobLocation];
    }
    if (data?.jobType == "") {
      newFormData.jobType.valueText = [];
    } else {
      newFormData.jobType.valueText = [data?.jobType];
    }

    newFormData.courseStartMonth.valueText = data?.startDate.split(" ")[0];
    newFormData.courseStartYear.valueText = data?.startDate.split(" ")[1];
    newFormData.courseEndMonth.valueText = courseCompleteEndMonth;
    newFormData.courseEndYear.valueText = courseCompleteEndYear;

    setFormData(newFormData);
  };

  return (
    <>
      {showLoader && <Loader />}
      <div className="row">
        <div className="col">
          <div className="my-3">
            <div className="fw-bold fs-24">
              <img src={skillLogo} className="me-2" alt="Skill Logo" />
              Skill and Experience
            </div>
            {isApplyForJobComponent && token && (
              <>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => setIsCheck(!isCheck)}
                    defaultChecked={isCheck}
                    className="mt-3 ms-1 me-2 pt-1 mb-2"
                  />
                  Save this to profile
                </label>
              </>
            )}
          </div>

          {isApplyForJobComponent ? (
            <>
              <div className="card-parent-container p-4">
                <div className="skill">
                  <div className="title-card">Key Skills</div>
                  <SearchComboBox
                    inputData={keySkill}
                    defaultValue={
                      newCandidateDetails?.skillsResponse?.keySkills
                    }
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setkeySkillOutput(event)}
                    searchListHeight={150}
                    isAllowUserDefined={true}
                  />
                  <hr />
                </div>
                <div className="skill">
                  <div className="title-card">Industries</div>
                  <SearchComboBox
                    inputData={industries}
                    defaultValue={
                      newCandidateDetails?.skillsResponse?.industries
                    }
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setIndustriesOutput(event)}
                    searchListHeight={150}
                    badgeThemeCssClass={"blue"}
                    isAllowUserDefined={true}
                  />
                  <hr />
                </div>
                <div className="skill">
                  <div className="title-card">Functions</div>
                  <SearchComboBox
                    inputData={functions}
                    defaultValue={
                      newCandidateDetails?.skillsResponse?.functions
                    }
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setFunctionsOutput(event)}
                    searchListHeight={150}
                    badgeThemeCssClass={"gray"}
                    isAllowUserDefined={true}
                  />
                </div>
                <div className="form-group text-end">
                  <button
                    className="btn btn-cancel"
                    onClick={() => {
                      resetValues();
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-dark btn-save ms-3"
                    onClick={() => {
                      onSaveForm();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card-parent-container p-4">
                <div className="skill">
                  <div className="title-card">Key Skills</div>
                  <SearchComboBox
                    inputData={keySkill}
                    defaultValue={keySkillOutput}
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setkeySkillOutput(event)}
                    searchListHeight={150}
                    isAllowUserDefined={true}
                  />
                  <hr />
                </div>
                <div className="skill">
                  <div className="title-card">Industries</div>
                  <SearchComboBox
                    inputData={industries}
                    defaultValue={industriesOutput}
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setIndustriesOutput(event)}
                    searchListHeight={150}
                    badgeThemeCssClass={"blue"}
                    isAllowUserDefined={true}
                  />
                  <hr />
                </div>
                <div className="skill">
                  <div className="title-card">Functions</div>
                  <SearchComboBox
                    inputData={functions}
                    defaultValue={functionsOutput}
                    isMultiSelect={true}
                    inputCssClass={"modal-input combo-search-box"}
                    wrapperCssClass={"form-group text-start"}
                    placeholder={"Search or Select"}
                    onSelect={(event) => setFunctionsOutput(event)}
                    searchListHeight={150}
                    badgeThemeCssClass={"gray"}
                    isAllowUserDefined={true}
                  />
                </div>
                <div className="form-group text-end">
                  {/* <button
                className="btn btn-cancel"
                onClick={() => {
                  resetValues();
                }}
              >
                Reset
              </button>  */}
                  <button
                    className="btn btn-dark btn-save ms-3 save-btn-responsive"
                    onClick={() => {
                      onSaveForm();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="title-card my-4 fw-600 fs-16">
            Professional Experience
          </div>
          <div
            onClick={() => {
              setModalShow(true);
              setEditId(null);
            }}
            className="outline-icon-button mb-4"
          >
            <img src={AddIcon} alt="" />
            <h6>Add Experience</h6>
          </div>

          <ProfessionalExperience
            candidateDetails={candidateDetails}
            setModalShow={setModalShow}
            onEditClick={handleEdit}
            newCandidateDetails={newCandidateDetails}
            setNewCandidateDetails={setNewCandidateDetails}
            isApplyForJobComponent={isApplyForJobComponent}
            isCheck={isProfessionalCheck}
          />

          {/* React Bootstrap Modal */}
          <Modal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              setDisabledDate(false);
              const tempFormData = { ...formData };
              tempFormData.courseEndYear.check = ["required", YEAR_PATTERN];
              setFormData(tempFormData);
              initialiseFormData(formData, setFormData);
            }}
            size="lg"
            fullscreen="lg-down"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="lg-dialog-modal"
          >
            <Modal.Header closeButton className="dialog-header">
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="dialog-title"
              >
                Experience Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="dialog-body">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="mb-2 d-flex">
                    <input
                      type="checkbox"
                      name="onGoing"
                      defaultChecked={formData?.onGoing?.valueText}
                      onChange={(e) => {
                        selectedValue(e?.target?.checked, "onGoing");
                        const tempFormData = { ...formData };

                        if (e?.target?.checked) {
                          setDisabledDate(true);
                          tempFormData.courseEndYear.check = [];
                          tempFormData.courseEndMonth.valueText = "Jan";
                          tempFormData.courseEndYear.valueText = "";
                        } else {
                          setDisabledDate(false);
                          tempFormData.courseEndYear.check = [
                            "required",
                            YEAR_PATTERN,
                          ];
                          tempFormData.courseEndMonth.valueText = "Jan";
                        }

                        setFormData(tempFormData);
                      }}
                    />
                    <h6 className="small-text-dark-gray fw-400 pt-2 ps-2">
                      This is an ongoing role
                    </h6>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="form-group">
                      <label className="modalLabel">Your Role*</label>
                      <br />
                      {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> */}
                      <SearchComboBox
                        name="yourRole"
                        inputData={role}
                        defaultValue={formData?.yourRole?.valueText}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.yourRole?.errorText ? "error" : ""
                        } form-control`}
                        // inputCssClass={"modal-input combo-search-box"}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={($event) => {
                          selectedValue($event, "yourRole");
                        }}
                        searchListHeight={150}
                        isAllowUserDefined={true}
                      />
                      {formData?.yourRole?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.yourRole?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="form-group">
                      <label className="modalLabel">Company*</label>
                      <br />
                      {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> */}
                      <SearchComboBox
                        name="company"
                        inputData={company}
                        defaultValue={formData?.company?.valueText}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.company?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        searchListHeight={150}
                        onSelect={($event) => {
                          // setCompanyOutput($event);
                          selectedValue($event, "company");
                        }}
                        isAllowUserDefined={true}
                      />
                      {formData?.company?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.company?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="form-group">
                      <label className="modalLabel">Function</label>
                      <br />
                      {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> */}
                      <SearchComboBox
                        name="function"
                        inputData={functions}
                        defaultValue={formData?.function?.valueText}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.function?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={($event) => {
                          // setFunctionsOutput($event);
                          selectedValue($event, "function");
                        }}
                        searchListHeight={150}
                        isAllowUserDefined={true}
                      />
                      {formData?.function?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.function?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="form-group">
                      <label className="modalLabel">Location</label>
                      <br />
                      {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> */}
                      <SearchComboBox
                        className={
                          (formData?.Location?.errorText ? "error" : "") +
                          " form-control"
                        }
                        name="Location"
                        inputData={locations}
                        defaultValue={formData?.Location?.valueText}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.Location?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={($event) => {
                          selectedValue($event, "Location");
                        }}
                        searchListHeight={150}
                        isAllowUserDefined={true}
                      />
                      {formData?.Location?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.Location?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="form-group">
                      <label className="modalLabel">Job Type</label>
                      <br />
                      {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> */}
                      <SearchComboBox
                        className={
                          (formData?.jobType?.errorText ? "error" : "") +
                          " form-control"
                        }
                        name="jobType"
                        inputData={jobtype}
                        defaultValue={formData?.jobType?.valueText}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.jobType?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        searchListHeight={150}
                        onSelect={($event) => {
                          selectedValue($event, "jobType");
                        }}
                        isAllowUserDefined={true}
                      />
                      {formData?.jobType?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.jobType?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {" "}
                    <div className="row">
                      {" "}
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {" "}
                        <label className="modalLabel">Start Date*</label>
                        <br />
                        <div className="row">
                          <div className="col-5">
                            <MonthPicker
                              value={formData?.courseStartMonth?.valueText}
                              className={
                                (formData?.courseStartMonth?.errorText
                                  ? "error"
                                  : "") +
                                "modal-form-input-select form-control outline-none mb-4"
                              }
                              name="courseStartMonth"
                              onChange={($event) => {
                                selectedValue(
                                  $event.target.value,
                                  "courseStartMonth"
                                );
                              }}
                            />
                          </div>

                          <div className="col-7  ps-0">
                            <input
                              min={1900}
                              max={2099}
                              value={formData?.courseStartYear?.valueText}
                              className={
                                (formData?.courseStartYear?.errorText
                                  ? "error"
                                  : "") +
                                " modal-form-input outline-none mb-1 form-control"
                              }
                              type="number"
                              placeholder="YYYY"
                              name="courseStartYear"
                              onChange={($event) => {
                                if ($event?.target?.value?.length <= 4) {
                                  selectedValue(
                                    $event.target.value,
                                    "courseStartYear"
                                  );
                                } else {
                                  return;
                                }
                              }}
                            />
                            {formData?.courseStartYear?.errorText && (
                              <div className="field-error mt-1">
                                {formData?.courseStartYear?.errorText}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {" "}
                        <label className="modalLabel">End Date*</label>
                        <br />
                        <div className="row">
                          <div className="col-5">
                            <MonthPicker
                              value={formData?.courseEndMonth?.valueText}
                              disabled={disabledDate}
                              className={
                                (formData?.courseEndMonth?.errorText
                                  ? "error "
                                  : "mb-4") +
                                "modal-form-input-select form-control outline-none"
                              }
                              name="courseEndMonth"
                              onChange={($event) => {
                                selectedValue(
                                  $event.target.value,
                                  "courseEndMonth"
                                );
                              }}
                            />
                            {formData?.courseEndMonth?.errorText && (
                              <div className="field-error mt-1">
                                {formData?.courseEndMonth?.errorText}
                              </div>
                            )}
                          </div>

                          <div className="col-7 ps-0">
                            <input
                              min={1900}
                              max={2099}
                              value={formData?.courseEndYear?.valueText}
                              disabled={disabledDate}
                              className={
                                (formData?.courseEndYear?.errorText
                                  ? "error"
                                  : "") +
                                " modal-form-input outline-none mb-1 form-control"
                              }
                              type="number"
                              placeholder="YYYY"
                              name="courseEndYear"
                              onChange={($event) => {
                                if ($event?.target?.value?.length <= 4) {
                                  selectedValue(
                                    $event.target.value,
                                    "courseEndYear"
                                  );
                                } else {
                                  return;
                                }
                              }}
                            />
                            {formData?.courseEndYear?.errorText && (
                              <div className="field-error mt-1">
                                {formData?.courseEndYear?.errorText}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <label className="modalLabel">Describe your role</label>
                    <br />
                    <textarea
                      className={
                        (formData?.describe?.errorText
                          ? "error modal-form-input outline-none"
                          : "") + " form-control modal-form-input outline-none"
                      }
                      name="describe"
                      type="text"
                      defaultValue={formData?.describe?.valueText}
                      style={{ paddingLeft: "10px", resize: "none" }}
                      placeholder="Write here"
                      onChange={(e) => {
                        selectedValue(e.target.value, "describe");
                      }}
                    />
                    {formData?.describe?.errorText && (
                      <div className="field-error mt-1">
                        {formData?.describe?.errorText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isApplyForJobComponent && token && (
                <div className="dialog-footer-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setIsProfessionalCheck(!isProfessionalCheck)
                      }
                      defaultChecked={isProfessionalCheck}
                      className="mt-3 ms-1 me-2 pt-1 mb-2"
                    />
                    Save this to profile
                  </label>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="dialog-footer">
              <div className="d-flex gap-2 ">
                <button
                  onClick={() => {
                    setModalShow(false);
                    setDisabledDate(false);
                    const tempFormData = { ...formData };
                    tempFormData.courseEndYear.check = [
                      "required",
                      YEAR_PATTERN,
                    ];
                    setFormData(tempFormData);
                    initialiseFormData(formData, setFormData);
                  }}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
                <button
                  // onClick={() => setModalShow(false)}
                  onClick={(e) => handleSave(e)}
                  className="btn btn-dark btn-save"
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* {edit_work_experience_modal && (
            <EditWorkExperienceModal
              editData={editData}
              show={edit_work_experience_modal}
              setShow={setEdit_work_experience_modal}
            />
          )} */}

          {/* Bootstrap Modal */}

          {/* <div>
            <div
              className="modal fade "
              id="staticBackdrop1"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: "768px" }}
              >
                <div className="modal-content dialog-wrapper modal">
                  <div className="modal-header dialog-header">
                    <h5
                      className="modal-title dialog-title"
                      id="staticBackdropLabel"
                    >
                      Experience Details
                    </h5>

                    <img
                      src={crossButton}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      className="pointer"
                      alt="cross Button"
                    />
                  </div>

                  <div className="modal-body dialog-body">
                    <div className="container-fluid p-0">
                      <div className="row">
                        <div className="mb-2 d-flex">
                          <input type="checkbox" />
                          <h6 className="small-text-dark-gray fw-400 pt-2 ps-2">
                            This is an ongoing role
                          </h6>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="form-group">
                            <label className="modalLabel">Your Role*</label>
                            <br />
                            {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> 
                            <SearchComboBox
                              inputData={role}
                              // defaultValue={roleOutput}
                              isMultiSelect={true}
                              inputCssClass={"modal-input combo-search-box"}
                              wrapperCssClass={"form-group text-start"}
                              placeholder={"Search or Select"}
                              onSelect={(event) => setRoleOutput(event)}
                              searchListHeight={150}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="form-group">
                            <label className="modalLabel">Company*</label>
                            <br />
                            {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> 
                            <SearchComboBox
                              inputData={company}
                              defaultValue={companyOutput}
                              isMultiSelect={true}
                              inputCssClass={"modal-input combo-search-box"}
                              wrapperCssClass={"form-group text-start"}
                              placeholder={"Search or Select"}
                              onSelect={(event) => setCompanyOutput(event)}
                              searchListHeight={150}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="form-group">
                            <label className="modalLabel">Function</label>
                            <br />
                            {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> 
                            <SearchComboBox
                              inputData={functions}
                              defaultValue={functionsOutput}
                              isMultiSelect={true}
                              inputCssClass={"modal-input combo-search-box"}
                              wrapperCssClass={"form-group text-start"}
                              placeholder={"Search or Select"}
                              onSelect={(event) => setFunctionsOutput(event)}
                              searchListHeight={150}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="form-group">
                            <label className="modalLabel">Location</label>
                            <br />
                            {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> 
                            <SearchComboBox
                              inputData={locations}
                              defaultValue={locationOutput}
                              isMultiSelect={true}
                              inputCssClass={"modal-input combo-search-box"}
                              wrapperCssClass={"form-group text-start"}
                              placeholder={"Search or Select"}
                              onSelect={(event) => setLocationOutput(event)}
                              searchListHeight={150}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="form-group">
                            <label className="modalLabel">Job Type</label>
                            <br />
                            {/* <input
                            className="modal-form-input outline-none mb-4"
                            type="text"
                            placeholder="Search or select"
                          /> 
                            <SearchComboBox
                              inputData={jobtype}
                              defaultValue={jobTypeOutput}
                              isMultiSelect={true}
                              inputCssClass={"modal-input combo-search-box"}
                              wrapperCssClass={"form-group text-start"}
                              placeholder={"Search or Select"}
                              onSelect={(event) => setJobTypeOutput(event)}
                              searchListHeight={150}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {" "}
                          <div className="row">
                            {" "}
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              {" "}
                              <label className="modalLabel">Start Date*</label>
                              <br />
                              <div className="row">
                                <div className="col-5">
                                  <input
                                    className="modal-form-input outline-none mb-4"
                                    type="text"
                                    placeholder="MM"
                                  />
                                </div>

                                <div className="col-7  ps-0">
                                  <input
                                    className="modal-form-input outline-none mb-4"
                                    type="text"
                                    placeholder="YYYY"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              {" "}
                              <label className="modalLabel">End Date*</label>
                              <br />
                              <div className="row">
                                <div className="col-5">
                                  <input
                                    className="modal-form-input outline-none mb-4"
                                    type="text"
                                    placeholder="MM"
                                  />
                                </div>

                                <div className="col-7 ps-0">
                                  <input
                                    className="modal-form-input outline-none mb-4"
                                    type="text"
                                    placeholder="YYYY"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <label className="modalLabel">
                            Describe your role
                          </label>
                          <br />
                          <textArea
                            className="modal-form-input outline-none"
                            type="text"
                            style={{ paddingLeft: "10px", resize: "none" }}
                            placeholder="Write here"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer dialog-footer">
                    <button
                      type="button"
                      className="btn fw-700 px-4 p-2 fs-12"
                      style={{
                        border: "1px solid #1C1C1C",
                      }}
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className=" btn-black fw-700 px-4 p-2 fs-12"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
export default SkillAndExperience;
