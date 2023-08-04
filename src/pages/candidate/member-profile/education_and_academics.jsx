import React, { useState, useEffect } from "react";
import educationLogo from "../../../assests/icons/ic_education.svg";
import AddIcon from "../../../assests/icons/ic_add.svg";
import crossButton from "../../../assests/icons/cross-icon.svg";
import deleteIcon from "../../../assests/icons/delete.svg";
import editIcon from "../../../assests/icons/edit-icon.svg";
import SearchComboBox from "../../../components/SearchComboBox";
import Modal from "react-bootstrap/Modal";
import {
  onFormFeildsChange,
  validateField,
  initialiseFormData,
} from "../../../utils/form_validators";
import { onChangeHandler } from "../../../components/SearchComboBox";
import {
  deleteEducationalExperience,
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
import { addEducationDetails } from "../../../_services/member-profile.service";
import Loader from "../../../components/common/loader";
import toaster from "../../../utils/toaster";
import { getLocalStorage } from "../../../utils/storage";
import { useStoreActions, useStoreState } from "easy-peasy";
import MonthPicker from "../../../components/month_picker";
import NoDataFoundCard from "../../../components/common/no_data_found_card";
import {
  GENERAL_ERROR_MESSAGE,
  NO_EDUCATION_ADDED,
} from "../../../constants/message";

const EducationAcademics = (props) => {
  const token = getLocalStorage(TOKEN);
  const [candidateDetails, setCandiateDetails] = useState({});

  const candidateDetailsFromStore = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [isCheck, setIsCheck] = useState(false);
  useEffect(() => {
    if (props?.candidateDetails == undefined) {
      setCandiateDetails(candidateDetailsFromStore);
    } else {
      setCandiateDetails(props?.candidateDetails);
    }

    if (props?.isReadOnly) {
      setIsReadOnly(props?.isReadOnly);
    }
  }, [
    props?.candidateDetails,
    candidateDetailsFromStore,
    props?.newCandidateDetails,
  ]);

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const [modalShow, setModalShow] = useState(false);

  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const jobRole = await getMaster(MASTER_TYPE.QUALIFICATION);
      const degreeData = await getMaster(MASTER_TYPE.DEGREE);
      const speciData = await getMaster(MASTER_TYPE.SPECIALIZATION);

      let jobRoleArray = [];
      let degreeArray = [];
      let speciArray = [];

      jobRole.map((data) => {
        jobRoleArray.push({
          id: data.id,
          name: data.masterValue,
          description: "",
        });
      });

      degreeData.map((data) => {
        degreeArray.push({
          id: data.id,
          name: data.masterValue,
          description: "",
        });
      });

      speciData.map((data) => {
        speciArray.push({
          id: data.id,
          name: data.masterValue,
          description: "",
        });
      });

      setQualification(jobRoleArray);
      setDegree(degreeArray);
      setSpecialized(speciArray);
    };
    getData();
  }, []);

  const [qualification, setQualification] = useState([]);
  const [degree, setDegree] = useState([]);
  const [specialized, setSpecialized] = useState([]);
  const [disabledDate, setDisabledDate] = useState(false);

  const [formData, setFormData] = useState({
    qualification: {
      valueText: [],
      initial: [],
      errorText: "",
      check: ["required"],
    },
    degreeName: {
      valueText: [],
      initial: [],
      errorText: "",
      check: ["required"],
    },
    specialization: {
      valueText: [],
      initial: [],
      errorText: "",
      check: [""],
    },
    institute: {
      valueText: "",
      initial: "",
      errorText: "",
      check: ["required"],
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

    outcome: { valueText: "", initial: "", errorText: "", check: ["required"] },
    isCompleted: {
      valueText: true,
      initial: true,
      errorText: "",
      check: ["required"],
    },
  });

  const selectedValue = (value, name) => {
    let event = { target: { value: "", name: "" } };
    event.target.value = value;
    event.target.name = name;
    onFormFeildsChange(event, formData, setFormData);
  };

  const [showLoader, setShowLoader] = useState(false);

  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    var isValid = true;

    Object.keys(formData)?.forEach((key) => {
      if (!validateField(key, formData, setFormData)) {
        isValid = false;
      } else if (formData?.institute?.valueText == "") {
        isValid = false;
      } else if (
        formData?.isCompleted?.valueText &&
        formData?.outcome?.valueText == ""
      ) {
        isValid = false;
      }
    });

    var isCompleted = formData?.isCompleted?.valueText;

    if (isValid) {
      let startDate, endDate, outcomeData;

      if (isCompleted) {
        startDate =
          formData?.courseStartMonth?.valueText +
          " " +
          formData?.courseStartYear?.valueText;
        endDate =
          formData?.courseEndMonth?.valueText +
          " " +
          formData?.courseEndYear?.valueText;
        outcomeData = formData?.outcome?.valueText;
      } else {
        startDate =
          formData?.courseStartMonth?.valueText +
          " " +
          formData?.courseStartYear?.valueText;
        endDate = "Present";
        outcomeData = "";
      }

      const qualification = formData?.qualification?.valueText[0];
      const degreeName = formData?.degreeName?.valueText[0];
      const specialization = formData?.specialization?.valueText[0];
      const institute = formData?.institute?.valueText;
      const courseStartDate = startDate;
      const courseEndDate = endDate;
      const outcome = outcomeData;
      let id = editId ? editId : null;

      if (props.isApplyForJobComponent) {
        setModalShow(false);
        var index =
          props?.newCandidateDetails?.educationalExperienceResponse?.findIndex(
            (x) => x.id === id
          );
        if (index === -1 || index === undefined) {
          id = new Date().valueOf();
          if (
            props?.newCandidateDetails?.educationalExperienceResponse?.length >
            0
          ) {
            props.setNewCandidateDetails({
              ...props?.newCandidateDetails,
              educationalExperienceResponse: [
                ...props?.newCandidateDetails.educationalExperienceResponse,
                {
                  id,
                  qualification,
                  degreeName,
                  specialization,
                  institute,
                  courseStartDate,
                  courseEndDate,
                  outcome,
                  isCompleted,
                },
              ],
            });
          } else {
            props?.setNewCandidateDetails({
              ...props.newCandidateDetails,
              educationalExperienceResponse: [
                {
                  id,
                  qualification,
                  degreeName,
                  specialization,
                  institute,
                  courseStartDate,
                  courseEndDate,
                  outcome,
                  isCompleted,
                },
              ],
            });
          }
          initialiseFormData(formData, setFormData);
        } else {
          props.setNewCandidateDetails({
            ...props.newCandidateDetails,
            educationalExperienceResponse: [
              ...props.newCandidateDetails.educationalExperienceResponse.slice(
                0,
                index
              ),
              Object.assign(
                {},
                props.newCandidateDetails.educationalExperienceResponse[index],
                {
                  id,
                  qualification,
                  degreeName,
                  specialization,
                  institute,
                  courseStartDate,
                  courseEndDate,
                  outcome,
                  isCompleted,
                }
              ),
              ...props.newCandidateDetails.educationalExperienceResponse.slice(
                index + 1
              ),
            ],
          });
          initialiseFormData(formData, setFormData);
        }
      } else {
        setShowLoader(true);
        addEducationDetails(
          id,
          qualification,
          degreeName,
          specialization,
          institute,
          courseStartDate,
          courseEndDate,
          outcome,
          isCompleted
        )
          .then((res) => {
            if (res?.status === 200) {
              const userId = getLocalStorage(USER_ID);
              if (userId) {
                saveCandidateDetails(userId);
              }
              setShowLoader(false);
              if (props.isApplyForJobComponent) {
                var index =
                  props.candidateDetails.educationalExperienceResponse.findIndex(
                    (x) => x.id === id
                  );
                if (index === -1) {
                  props.setNewCandidateDetails({
                    ...props.newCandidateDetails,
                    educationalExperienceResponse: [
                      {
                        ...props.candidateDetails
                          ?.educationalExperienceResponse,
                      },
                      { ...res?.data?.data },
                    ],
                  });
                  initialiseFormData(formData, setFormData);
                } else {
                  props.setNewCandidateDetails({
                    ...props.newCandidateDetails,
                    educationalExperienceResponse: [
                      ...props.candidateDetails.educationalExperienceResponse.slice(
                        0,
                        index
                      ),
                      Object.assign(
                        {},
                        props.candidateDetails.educationalExperienceResponse[
                          index
                        ],
                        res?.data?.data
                      ),
                      ...props.candidateDetails.educationalExperienceResponse.slice(
                        index + 1
                      ),
                    ],
                  });
                }
              }
              toaster("success", "Data saved successfully");
              setDisabledDate(false);
              const tempFormData = { ...formData };
              tempFormData.outcome.check = ["required"];
              tempFormData.courseEndYear.check = ["required", YEAR_PATTERN];
              setFormData(tempFormData);
              initialiseFormData(formData, setFormData);
            } else {
              toaster(
                "error",
                res?.message ? res?.message : GENERAL_ERROR_MESSAGE
              );
              setShowLoader(false);
              setDisabledDate(false);
              const tempFormData = { ...formData };
              tempFormData.outcome.check = ["required"];
              tempFormData.courseEndYear.check = ["required", YEAR_PATTERN];
              setFormData(tempFormData);
              initialiseFormData(formData, setFormData);
            }
            setModalShow(false);
          })
          .catch((err) => {
            setShowLoader(false);
            setModalShow(false);
            setDisabledDate(false);
            const tempFormData = { ...formData };
            tempFormData.outcome.check = ["required"];
            tempFormData.courseEndYear.check = ["required", YEAR_PATTERN];
            setFormData(tempFormData);
            initialiseFormData(formData, setFormData);
            toaster(
              "error",
              err?.message ? err?.message : GENERAL_ERROR_MESSAGE
            );
          });
      }
    } else {
      toaster("error", "Please input all mandatory fields");
    }
    setShowLoader(false);
  };

  const handleEdit = (editDetails) => {
    setModalShow(true);
    setEditId(editDetails?.id);

    let courseCompleteEndMonth, courseCompleteEndYear;
    const isCompleted = editDetails?.isCompleted;

    if (isCompleted) {
      courseCompleteEndMonth = editDetails?.courseEndDate?.split(" ")[0];
      courseCompleteEndYear = editDetails?.courseEndDate?.split(" ")[1];
      setDisabledDate(false);
    } else {
      setDisabledDate(true);
      courseCompleteEndMonth = editDetails?.courseEndDate;
      courseCompleteEndYear = "";
      const tempFormData = { ...formData };
      tempFormData.outcome.check = [];
      tempFormData.courseEndYear.check = [];
      setFormData(tempFormData);
    }

    const populatedFormData = { ...formData };

    populatedFormData.qualification.valueText = [editDetails?.qualification];
    populatedFormData.degreeName.valueText = [editDetails?.degreeName];
    populatedFormData.specialization.valueText = [editDetails?.specialization];
    populatedFormData.institute.valueText = editDetails?.institute;
    populatedFormData.outcome.valueText = editDetails?.outcome;
    populatedFormData.isCompleted.valueText = isCompleted;
    populatedFormData.courseStartMonth.valueText =
      editDetails?.courseStartDate?.split(" ")[0];
    populatedFormData.courseStartYear.valueText =
      editDetails?.courseStartDate?.split(" ")[1];
    populatedFormData.courseEndMonth.valueText = courseCompleteEndMonth;
    populatedFormData.courseEndYear.valueText = courseCompleteEndYear;

    setFormData(populatedFormData);
  };
  const deleteData = (id) => {
    if (props.isApplyForJobComponent && !isCheck) {
      var index =
        props.newCandidateDetails.educationalExperienceResponse.findIndex(
          (x) => x.id === id
        );
      if (id === null || index == -1) {
        toaster("Error", "Invalid Input");
      } else {
        props.setNewCandidateDetails({
          ...props.newCandidateDetails,
          educationalExperienceResponse: [
            ...props.newCandidateDetails.educationalExperienceResponse.slice(
              0,
              index
            ),
            ...props.newCandidateDetails.educationalExperienceResponse.slice(
              index + 1
            ),
          ],
        });
      }
    } else {
      setShowLoader(true);
      deleteEducationalExperience(id)
        .then((res) => {
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
          setShowLoader(false);
          toaster("success", "Data delete");
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
        });
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <div className="row mt-0">
        <div className="col-12 ">
          {!isReadOnly ? (
            <div>
              <div className="my-3">
                <span className="fw-bold" style={{ fontSize: "24px" }}>
                  {" "}
                  <img
                    style={{ marginRight: "14px" }}
                    src={educationLogo}
                    alt={educationLogo}
                  />
                  Education and Academics
                </span>
              </div>
            </div>
          ) : null}
          {!isReadOnly ? (
            <div
              onClick={() => {
                setModalShow(true);
                setEditId(null);
              }}
              className="outline-icon-button"
            >
              <img src={AddIcon} alt="" />
              <h6>Add Education</h6>
            </div>
          ) : null}

          {props?.isApplyForJobComponent && !isCheck ? (
            props?.newCandidateDetails?.educationalExperienceResponse?.length ==
            0 ? (
              <div className="no-data-found-width">
                <NoDataFoundCard text={NO_EDUCATION_ADDED} />
              </div>
            ) : (
              <div
                className={
                  !props?.fromViewRefrral ? "card-parent-container my-4" : "p-2"
                }
              >
                {props.newCandidateDetails?.educationalExperienceResponse?.map(
                  (education) => {
                    return (
                      <div key={education?.id}>
                        <div
                          className={
                            !props?.fromViewRefrral ? "card-container" : "ps-2"
                          }
                        >
                          <div className="ps-4 pt-4">
                            <div>
                              <span className="card-badge">
                                {education.courseStartDate}
                                {" - "}
                                {education.courseEndDate}
                              </span>
                            </div>
                            <div className="title-card">
                              {education.degreeName}
                            </div>
                            <div className="card-subtitle">
                              {education.institute}
                            </div>
                            <div className="card-content">
                              {education.specialization}
                            </div>
                            <div className="edu-percent">
                              {education.outcome}
                            </div>
                          </div>
                          {!isReadOnly ? (
                            <div
                              className="pt-2 pe-1"
                              style={{ minWidth: "102px" }}
                            >
                              <img
                                src={deleteIcon}
                                style={{ height: "18px", width: "16px" }}
                                className="pointer mx-2 mb-2 me-4 "
                                onClick={() => deleteData(education.id)}
                                alt="Delete Icon"
                              />

                              <img
                                src={editIcon}
                                className="pointer mx-2 mb-2"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop1"
                                style={{
                                  padding: "4px",
                                  borderRadius: "5px",
                                  border: "1px solid #E5E5E5",
                                }}
                                alt="Edit Icon"
                                onClick={() => {
                                  handleEdit(education);
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )
          ) : candidateDetails?.educationalExperienceResponse?.length == 0 ||
            candidateDetails?.educationalExperienceResponse == null ? (
            <div className="no-data-found-width ">
              <NoDataFoundCard text={NO_EDUCATION_ADDED} />
            </div>
          ) : (
            <div
              className={
                !props?.fromViewRefrral ? "card-parent-container my-4" : "p-2"
              }
            >
              {candidateDetails?.educationalExperienceResponse?.map(
                (education) => {
                  return (
                    <div key={education?.id}>
                      <div
                        className={
                          !props?.fromViewRefrral ? "card-container" : "ps-2"
                        }
                      >
                        <div className="ps-4 pt-4">
                          <div>
                            <span className="card-badge">
                              {education.courseStartDate}
                              {" - "}
                              {education.courseEndDate}
                            </span>
                          </div>
                          <div className="title-card">
                            {education.degreeName}
                          </div>
                          <div className="card-subtitle">
                            {education.institute}
                          </div>
                          <div className="card-content">
                            {education.specialization}
                          </div>
                          <div className="edu-percent">{education.outcome}</div>
                        </div>
                        {!isReadOnly ? (
                          <div
                            className="pt-2 pe-1"
                            style={{ minWidth: "102px" }}
                          >
                            <img
                              src={deleteIcon}
                              style={{ height: "18px", width: "16px" }}
                              className="pointer mx-2 mb-2 me-4 "
                              onClick={() => deleteData(education.id)}
                              alt="Delete Icon"
                            />

                            <img
                              src={editIcon}
                              className="pointer mx-2 mb-2"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop1"
                              style={{
                                padding: "4px",
                                borderRadius: "5px",
                                border: "1px solid #E5E5E5",
                              }}
                              alt="Edit Icon"
                              onClick={() => {
                                handleEdit(education);
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* {candidateDetails?.educationalExperienceResponse?.length == 0 ? (
            <NoDataFoundCard text="No education Added" />
          ) : (
            <div
              className={
                !props?.fromViewRefrral ? "card-parent-container my-4" : "p-2"
              }
            >
              {candidateDetails?.educationalExperienceResponse?.map(
                (education) => {
                  return (
                    <div key={education?.id}>
                      <div
                        className={
                          !props?.fromViewRefrral ? "card-container" : "ps-2"
                        }
                      >
                        <div className="ps-4 pt-4">
                          <div>
                            <span className="card-badge">
                              {education.courseStartDate}
                              {" - "}
                              {education.courseEndDate}
                            </span>
                          </div>
                          <div className="title-card">
                            {education.degreeName}
                          </div>
                          <div className="card-subtitle">
                            {education.institute}
                          </div>
                          <div className="card-content">
                            {education.specialization}
                          </div>
                          <div className="edu-percent">{education.outcome}</div>
                        </div>
                        {!isReadOnly ? (
                          <div
                            className="pt-2 pe-1"
                            style={{ minWidth: "102px" }}
                          >
                            <img
                              src={deleteIcon}
                              style={{ height: "18px", width: "16px" }}
                              className="pointer mx-2 mb-2 me-4 "
                              onClick={() => deleteData(education.id)}
                              alt="Delete Icon"
                            />

                            <img
                              src={editIcon}
                              className="pointer mx-2 mb-2"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop1"
                              style={{
                                padding: "4px",
                                borderRadius: "5px",
                                border: "1px solid #E5E5E5",
                              }}
                              alt="Edit Icon"
                              onClick={() => {
                                handleEdit(education);
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )} */}

          <div>
            <Modal
              show={modalShow}
              onHide={() => {
                setModalShow(false);
                setDisabledDate(false);
                const tempFormData = { ...formData };
                tempFormData.outcome.check = ["required"];
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
                  Education Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="dialog-body">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="mb-2 d-flex">
                      <input
                        defaultChecked={!formData?.isCompleted?.valueText}
                        type="checkbox"
                        name="isCompleted"
                        onChange={(event) => {
                          selectedValue(!event?.target?.checked, "isCompleted");
                          const tempFormData = { ...formData };
                          if (event?.target?.checked) {
                            setDisabledDate(true);
                            tempFormData.outcome.check = [];
                            tempFormData.courseEndYear.check = [];
                            tempFormData.courseEndMonth.valueText = "Jan";
                            tempFormData.courseEndYear.valueText = "";
                            tempFormData.outcome.valueText = "";
                          } else {
                            setDisabledDate(false);
                            tempFormData.outcome.check = ["required"];
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
                        This is an ongoing education
                      </h6>
                    </div>

                    <div className="col-md-6 col-12">
                      {" "}
                      <label className="modalLabel">Qualification*</label>
                      <br />
                      <SearchComboBox
                        defaultValue={formData?.qualification?.valueText}
                        inputData={qualification}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.qualification?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={(event) => {
                          selectedValue(event, "qualification");
                        }}
                        name="qualification"
                        searchListHeight={150}
                        isAllowUserDefined={true}
                      />
                      {formData.qualification.errorText && (
                        <div className="field-error mt-1">
                          {formData.qualification.errorText}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      {" "}
                      <label className="modalLabel">Institution*</label>
                      <br />
                      <input
                        defaultValue={formData?.institute?.valueText}
                        type="text"
                        className={
                          (formData?.institute?.errorText ? "error" : "") +
                          " form-control"
                        }
                        name="institute"
                        onChange={($event) => {
                          selectedValue($event.target.value, "institute");
                        }}
                      />
                      {formData?.institute?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.institute?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      {" "}
                      <label className="modalLabel">Degree*</label>
                      <br />
                      <SearchComboBox
                        defaultValue={formData?.degreeName?.valueText}
                        inputData={degree}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.degreeName?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={(event) => {
                          selectedValue(event, "degreeName");
                        }}
                        searchListHeight={150}
                        name="degreeName"
                        isAllowUserDefined={true}
                      />
                      {formData?.degreeName?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.degreeName?.errorText}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      {" "}
                      <label className="modalLabel">Specialization</label>
                      <br />
                      <SearchComboBox
                        defaultValue={formData?.specialization?.valueText}
                        inputData={specialized}
                        isMultiSelect={false}
                        inputCssClass={`modal-input combo-search-box ${
                          formData?.specialization?.errorText ? "error" : ""
                        } form-control`}
                        wrapperCssClass={"form-group text-start"}
                        placeholder={"Search or Select"}
                        onSelect={(event) => {
                          selectedValue(event, "specialization");
                        }}
                        searchListHeight={150}
                        name="specialization"
                        isAllowUserDefined={true}
                      />
                      {formData?.specialization?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.specialization?.errorText}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      {" "}
                      <label className="modalLabel">Outcome*</label>
                      <br />
                      <input
                        value={formData?.outcome?.valueText}
                        disabled={disabledDate}
                        type="text"
                        className={
                          (formData?.outcome?.errorText ? "error" : "") +
                          " form-control"
                        }
                        name="outcome"
                        onChange={($event) => {
                          selectedValue($event.target.value, "outcome");
                        }}
                      />
                      {formData?.outcome?.errorText && (
                        <div className="field-error mt-1">
                          {formData?.outcome?.errorText}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mt-3 mt-md-0">
                      {" "}
                      <div className="row">
                        {" "}
                        <div className="col-sm-6 col-12 ">
                          {" "}
                          <label className="modalLabel">Start Date*</label>
                          <br />
                          <div className="row">
                            <div className="col-5">
                              <MonthPicker
                                className={
                                  (formData?.courseStartMonth?.errorText
                                    ? "error"
                                    : "") +
                                  " modal-form-input-select form-control outline-none p-2"
                                }
                                value={formData?.courseStartMonth?.valueText}
                                name="courseStartMonth"
                                onChange={($event) => {
                                  selectedValue(
                                    $event.target.value,
                                    "courseStartMonth"
                                  );
                                }}
                              />
                              {formData?.courseStartMonth?.errorText && (
                                <div className="field-error mt-1">
                                  {formData?.courseStartMonth?.errorText}
                                </div>
                              )}
                            </div>
                            <div className="col-7  ps-0">
                              <input
                                max={2099}
                                min={1900}
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
                        <div className="col-sm-6 col-12">
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
                                    ? "error"
                                    : "") +
                                  " modal-form-input-select form-control outline-none"
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
                </div>
                {props.isApplyForJobComponent && token && (
                  <div className="dialog-footer-checkbox mt-2">
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => setIsCheck(!isCheck)}
                        defaultChecked={isCheck}
                        className="mt-2 ms-1 me-2 pt-1 mb-3"
                      />
                      Save this to profile
                    </label>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="dialog-footer">
                <button
                  onClick={() => {
                    setModalShow(false);
                    setDisabledDate(false);
                    const tempFormData = { ...formData };
                    tempFormData.outcome.check = ["required"];
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
                <button onClick={handleSave} className="btn btn-dark btn-save">
                  Save
                </button>
              </Modal.Footer>
            </Modal>

            {/* <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationAcademics;
