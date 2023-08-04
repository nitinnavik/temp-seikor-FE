import React, { useState, useEffect } from "react";
import thumbnailPdfIcon from "../assests/icons/thumbnail-pdf.svg";
import book from "../assests/icons/ic_book.svg";
import thumbnailWordIcon from "../assests/icons/thumbnail-word.svg";
import deleteIcon from "../assests/icons/ic-delete-red.svg";
import uploadIcon from "../assests/icons/ic-upload.svg";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import resumeAddIcon from "../assests/icons/ic-add-filled.svg";
import { useStoreState, useStoreActions } from "easy-peasy";
import toaster from "../utils/toaster";
import {
  downloadFile,
  updateResume,
  uploadFile,
} from "../_services/view.service";
import { getLocalStorage } from "../utils/storage";
import { FAILED_TO_LOAD, TOKEN, USER_ID } from "../constants/keys";
import Dropzone from "react-dropzone";
import Loader from "./common/loader";
import {
  GENERAL_ERROR_MESSAGE,
  RESUME_SIZE_EXCEEDING,
} from "../constants/message";
import { Modal } from "react-bootstrap";

const SelectResume = (props) => {
  const [updateYourProfileDialog, setUpdateYourProfileDialog] = useState();
  const token = getLocalStorage(TOKEN);
  const [firstResumeSelected, setFirstResumeSelected] = useState(false);
  const [secondResumeSelected, setSecondResumeSelected] = useState(false);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const [isCheck, setIsCheck] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [firstFileUploadedData, setFirstFileUploadedData] = useState();
  const [secondFileUploadedData, setSecondFileUploadedData] = useState();
  const [resumeUpdateObject, setResumeUpdateObject] = useState({});
  const [showSaveResumeToProfileDialog, setShowSaveResumeToProfileDialog] =
    useState(false);

  const saveNewResumeToProfile = (updateResumeObject) => {
    updateResume([updateResumeObject]).then(
      (data) => {
        if (data?.length == 0 || data == null) {
          setShowLoader(false);
          toaster("error", GENERAL_ERROR_MESSAGE);
        } else {
          setShowLoader(false);
          toaster("success", "Resume uploaded successfully!");
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
        }
      },
      (error) => {
        setShowLoader(false);
        toaster(
          "error",
          error?.message ? error?.message : GENERAL_ERROR_MESSAGE
        );
      }
    );
  };

  // useEffect(() => {
  //   if (firstResumeSelected || secondResumeSelected )
  //   {
  //     props.setIsResumeSelected(true);
  //     }
  // },[firstResumeSelected,secondResumeSelected])

  const onUploadResume = (acceptedFiles, resumeNumber, prevId = null) => {
    if (acceptedFiles.length > 1) {
      toaster("error", "Multiple Resumes cannot be selected");
      return;
    }
    const fileSize = acceptedFiles[0]?.size;
    const fileType = acceptedFiles[0]?.name;
    const isFileExtValid =
      fileType.includes(".doc") || fileType.includes(".pdf");
    if (!isFileExtValid) {
      toaster("error", "Invalid file!");
      return;
    }

    const isFileSizeValid = fileSize < 5e6;

    if (!isFileSizeValid) {
      toaster("error", RESUME_SIZE_EXCEEDING);
      return;
    }

    let formData = new FormData();
    const fileObjects = acceptedFiles.map((file) => {
      formData.append("contentData", file);
      formData.append(
        "contentMetaData",
        JSON.stringify({
          contentType: "RESUME",
          contentName: fileType,
          contentExtention: "",
        })
      );
    });
    setShowLoader(true);
    uploadFile(formData).then(
      (response) => {
        if (response?.id) {
          let resumeResponseUpdateObject = {
            fileId: response?.id,
            isActive: true,
            contentName: fileType,
            fileOrder: resumeNumber,
            previousFileId: prevId,
          };
          let index;
          if (props?.newCandidateDetails?.userResumeResponse?.length > 0) {
            props?.newCandidateDetails?.userResumeResponse?.map((item) => {
              console.log(item?.fileOrder);
              index = item?.fileOrder === resumeResponseUpdateObject?.fileOrder;
            });
            if (index === -1 || index === undefined) {
              props?.setNewCandidateDetails({
                ...props?.newCandidateDetails,
                userResumeResponse: [
                  {
                    ...resumeResponseUpdateObject,
                    downloadURL: response?.downloadUrl,
                  },
                ],
              });
            } else {
              props?.setNewCandidateDetails({
                ...props?.newCandidateDetails,
                userResumeResponse: [
                  ...props?.newCandidateDetails?.userResumeResponse,
                  {
                    ...props?.newCandidateDetails?.userResumeResponse[index],
                    ...resumeResponseUpdateObject,
                    downloadURL: response?.downloadUrl,
                  },
                ],
              });
            }
          } else {
            props?.setNewCandidateDetails({
              ...props?.newCandidateDetails,
              userResumeResponse: [
                {
                  ...resumeResponseUpdateObject,
                  downloadURL: response?.downloadUrl,
                },
              ],
            });
          }

          setResumeUpdateObject(resumeResponseUpdateObject);
          // if (
          //   (candidateDetails?.userResumeResponse?.length == 0 ||
          //     candidateDetails?.userResumeResponse == null) &&
          //   token
          // ) {
          //   saveNewResumeToProfile(resumeResponseUpdateObject);
          //   setShowLoader(false);
          //   return;
          // } else {
          //   if (token) {
          //     setShowSaveResumeToProfileDialog(true);
          //   }
          // }
          if (token) {
            setShowSaveResumeToProfileDialog(true);
          }
          setShowLoader(false);
        } else {
          setShowLoader(false);
          toaster(
            "error",
            response?.message ? response?.message : GENERAL_ERROR_MESSAGE
          );
        }
        if (response == null || response == undefined) {
          toaster("error", GENERAL_ERROR_MESSAGE);
          setShowLoader(false);
        }
      },
      (error) => {
        console.log(error);
        toaster(
          "error",
          error?.message ? error?.message : GENERAL_ERROR_MESSAGE
        );
        setShowLoader(false);
      }
    );
    setShowLoader(false);
  };

  const downloadResume = async (downloadedUrl, filename) => {
    setShowLoader(true);
    downloadFile(downloadedUrl)
      .then((res) => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = res;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(res);
        a.parentNode.removeChild(a);
        setShowLoader(false);
      })
      .catch((err) => {
        toaster("error", "Unable to download file");
        setShowLoader(false);
      });
  };

  const selectedResume = (i) => {
    if (props.isApplyForJobComponent && !isCheck) {
      if (
        props?.newCandidateDetails?.userResumeResponse &&
        props?.newCandidateDetails?.userResumeResponse?.length > 0
      ) {
        // const { userResumeResponse } = candidateDetails;
        // props.applyForJob.resumeId =
        //   props.newCandidateDetails?.userResumeResponse[i - 1]?.fileId;

        let index = props?.newCandidateDetails?.userResumeResponse
          .map((resume) => resume.fileOrder)
          .indexOf(i);

        props?.setApplyForJob({
          ...props?.applyForJob,
          resumeId:
            props.newCandidateDetails?.userResumeResponse[index]?.fileId,
        });
      }
    } else if (
      candidateDetails?.userResumeResponse &&
      candidateDetails?.userResumeResponse?.length > 0
    ) {
      // const { userResumeResponse } = candidateDetails;
      // props.applyForJob.resumeId =
      //   candidateDetails?.userResumeResponse[i - 1]?.fileId;
      let index = candidateDetails?.userResumeResponse
        .map((resume) => resume.fileOrder)
        .indexOf(i);

      props?.setApplyForJob({
        ...props?.applyForJob,
        resumeId: candidateDetails?.userResumeResponse[index]?.fileId,
      });
    }
  };

  const fileDetails = (url, fileName, fileOrder) => {
    let dotArray = url?.split(".");
    let fileExtension = url?.split(".")[dotArray.length - 1];
    // let slashArray = url.split("/");
    // let fileName = slashArray[slashArray.length - 1];
    return { fileName, fileExtension, url, fileOrder };
  };

  const newCandidateResumeResponse = () => {
    if (
      props?.newCandidateDetails?.userResumeResponse &&
      props?.newCandidateDetails?.userResumeResponse?.length > 0
    ) {
      const { userResumeResponse } = props?.newCandidateDetails;
      var firstResumeIndex, secondResumeIndex;
      let firstIndex;

      // let firstIndex; = userResumeResponse
      //   .map((resume) => resume.fileOrder)
      //   .indexOf(1);

      userResumeResponse?.map((resume) => {
        if (resume?.fileOrder == 1) {
          firstIndex = resume?.fileOrder;
          return;
        }
      });

      if (firstIndex) {
        firstResumeIndex = userResumeResponse
          .map((resume) => resume.fileOrder)
          .indexOf(firstIndex);

        setFirstFileUploadedData(
          fileDetails(
            userResumeResponse[firstResumeIndex]?.downloadURL,
            userResumeResponse[firstResumeIndex]?.contentName,
            firstIndex
          )
        );

        let resumeIdNumber;

        props?.newCandidateDetails?.userResumeResponse?.map((resume) => {
          if (resume?.fileOrder == 1) {
            resumeIdNumber = resume?.fileId;
          }
        });

        if (
          props?.applyForJob?.resumeId == 0 ||
          props?.applyForJob?.resumeId == null
        ) {
          
          props?.setApplyForJob({
            ...props?.applyForJob,
            resumeId: resumeIdNumber,
          });
          setFirstResumeSelected(true);
        }

        // setSecondResumeSelected(true);
      } else {
        setFirstFileUploadedData(null);
      }

      // For Second resume
      let secondIndex;

      userResumeResponse?.map((resume) => {
        if (resume?.fileOrder == 2) {
          secondIndex = resume?.fileOrder;
          return;
        }
      });

      if (secondIndex) {
        secondResumeIndex = userResumeResponse
          .map((resume) => resume.fileOrder)
          .indexOf(secondIndex);

        setSecondFileUploadedData(
          fileDetails(
            userResumeResponse[secondResumeIndex]?.downloadURL,
            userResumeResponse[secondResumeIndex]?.contentName,
            secondIndex
          )
        );

        let resumeIdNumber;

        props?.newCandidateDetails?.userResumeResponse?.map((resume) => {
          if (resume?.fileOrder == 2) {
            resumeIdNumber = resume?.fileId;
          }
        });

        if (
          firstIndex == null &&
          (props?.applyForJob?.resumeId == 0 ||
            props?.applyForJob?.resumeId == null)
        ) {
          props?.setIsResumeSelected(true);
          props?.setApplyForJob({
            ...props?.applyForJob,
            resumeId: resumeIdNumber,
          });
        }
      } else {
        setSecondFileUploadedData(null);
      }
    } else {
      setFirstFileUploadedData(null);
      setSecondFileUploadedData(null);
    }
  };

  const existingResumeResponse = () => {
    if (
      candidateDetails?.userResumeResponse &&
      candidateDetails?.userResumeResponse?.length > 0
    ) {
      const { userResumeResponse } = candidateDetails;
      // let firstIndex = userResumeResponse
      //   .map((resume) => resume.fileOrder)
      //   .indexOf(1);
      var firstResumeIndex, secondResumeIndex;
      var firstIndex;

      userResumeResponse?.map((resume) => {
        if (resume?.fileOrder == 1) {
          firstIndex = resume?.fileOrder;
          return;
        }
      });

      if (firstIndex == 1) {
        firstResumeIndex = userResumeResponse
          .map((resume) => resume.fileOrder)
          .indexOf(firstIndex);

        props?.setIsResumeSelected(true);

        let resumeIdNumber;
        candidateDetails?.userResumeResponse?.map((resume) => {
          if (resume?.fileOrder == 1) {
            resumeIdNumber = resume?.fileId;
          }
        });

        props?.setApplyForJob({
          ...props?.applyForJob,
          resumeId: resumeIdNumber,
        });
        setFirstResumeSelected(true);
        setFirstFileUploadedData(
          fileDetails(
            userResumeResponse[firstResumeIndex]?.downloadURL,
            userResumeResponse[firstResumeIndex]?.contentName,
            1
          )
        );
      } else {
        setFirstFileUploadedData(null);
        // setSecondResumeSelected(true);
      }

      // For Second resume

      // let secondIndex = userResumeResponse
      //   .map((resume) => resume.fileOrder)
      //   .indexOf(2);

      let secondIndex;

      userResumeResponse?.map((resume) => {
        if (resume?.fileOrder == 2) {
          secondIndex = resume?.fileOrder;
          return;
        }
      });

      if (secondIndex == 2) {
        secondResumeIndex = userResumeResponse
          .map((resume) => resume.fileOrder)
          .indexOf(secondIndex);

        let resumeIdNumber;
        candidateDetails?.userResumeResponse?.map((resume) => {
          if (resume?.fileOrder == 2) {
            resumeIdNumber = resume?.fileId;
          }
        });

        if (firstIndex != 1) {
          props?.setIsResumeSelected(true);
          props?.setApplyForJob({
            ...props?.applyForJob,
            resumeId: resumeIdNumber,
          });
          setFirstResumeSelected(true);
          setSecondResumeSelected(true);
        }

        setSecondFileUploadedData(
          fileDetails(
            userResumeResponse[secondResumeIndex]?.downloadURL,
            userResumeResponse[secondResumeIndex]?.contentName,
            2
          )
        );
      } else {
        setSecondFileUploadedData(null);
      }

      // if (secondIndex >= 0) {
      //   setSecondFileUploadedData(
      //     fileDetails(
      //       userResumeResponse[secondIndex]?.downloadURL,
      //       userResumeResponse[secondIndex]?.contentName,
      //       2
      //     )
      //   );
      // } else {
      //   setSecondFileUploadedData(null);
      // }
    } else {
      setFirstFileUploadedData(null);
      setSecondFileUploadedData(null);
    }
  };

  useEffect(() => {
    if (props?.applyForJob?.resumeId != 0) {
      if (props?.newCandidateDetails?.userResumeResponse) {
        var { userResumeResponse } = props?.newCandidateDetails;
      }

      // const { userResumeResponse } = candidateDetails;
      let obj = userResumeResponse?.filter(
        (resume) => resume?.fileId === props?.applyForJob?.resumeId
      );
      if (obj) {
        if (obj[0]?.fileOrder === 2) {
          setSecondResumeSelected(true);
          setFirstResumeSelected(false);
        } else if (obj[0]?.fileOrder === 1) {
          setSecondResumeSelected(false);
          setFirstResumeSelected(true);
        }
      }
    } else {
      setSecondResumeSelected(false);
      setFirstResumeSelected(true);
    }
  }, []);

  useEffect(() => {
    if (props?.newCandidateDetails) {
      newCandidateResumeResponse();
    } else {
      existingResumeResponse();
    }
  }, [candidateDetails, props?.newCandidateDetails]);

  // useEffect(() => {
  //   if(props?.saveToProfile){}
  // }, [props?.saveToProfile]);

  return (
    <>
      <div>
        {showLoader && <Loader />}
        {props.isApplyForJobComponent ? (
          <>
            {props.newCandidateDetails?.userResumeResponse?.length === 1 &&
            props?.forQuickApply ? (
              <></>
            ) : (
              <div>
                <div className="about-heading pb-3 pt-2">
                  <img src={book} alt="book-icon" />
                  &nbsp; Resume<span className="dark-pink-text">*</span>
                </div>
                {/* <label>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setIsCheck(!isCheck);
                      props?.setSaveToProfileCheck(true);
                    }}
                    defaultChecked={isCheck}
                    className="me-2"
                  />
                  Save this to profile
                </label> */}

                <div className="box-shadow mt-3 p-4">
                  <h5 className="dark-pink-text fs-16 fw-600 mb-3">
                    {props.newCandidateDetails?.userResumeResponse?.length ===
                      2 && !props.isResumeSelected
                      ? "Select 1 resume for your application"
                      : ""}
                  </h5>
                  <div className="upload-resume-wrapper mt-4">
                    <div className="row">
                      <div className="col-lg-6">
                        {!firstFileUploadedData && (
                          <div className="upload-resume d-flex align-items-center justify-content-center">
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                onUploadResume(acceptedFiles, 1);
                              }}
                              multiple={false}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <>
                                    <div className="label d-flex align-items-center justify-content-center">
                                      <img src={resumeAddIcon} alt={"Resume"} />
                                      &nbsp; Upload Resume
                                    </div>
                                    <p className="small-text-gray text-muted text-center mt-2">
                                      PDF, Doc - Upto 5 MB
                                    </p>
                                  </>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        )}
                        {firstFileUploadedData && (
                          <div className="uploaded-resume">
                            <div className="file-wrapper d-flex justify-content-start align-items-center">
                              <div className="file-type">
                                <img
                                  src={
                                    firstFileUploadedData?.fileExtension ===
                                    "pdf"
                                      ? thumbnailPdfIcon
                                      : thumbnailWordIcon
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="file-name ellipse-2">
                                {firstFileUploadedData?.fileName}
                              </div>
                            </div>
                            <div className="file-actions d-flex align-items-center">
                              <div className="link flex-1 small-text-gray">
                                <input
                                  type="radio"
                                  id="select-second"
                                  name="resume"
                                  className="yesNo"
                                  defaultChecked={firstResumeSelected === true}
                                  onClick={() => {
                                    selectedResume(1);
                                    props.setIsResumeSelected(true);
                                    setFirstResumeSelected(true);
                                    setSecondResumeSelected(false);
                                  }}
                                />
                                <label
                                  htmlFor="select-second"
                                  className="text-decoration-none btn rounded-pill border pe-5 ps-5 bg-white fs-12"
                                >
                                  {!firstResumeSelected
                                    ? "Select This"
                                    : "Selected"}
                                </label>
                              </div>
                              {/* <div className="delete text-end">
                            <img src={deleteIcon} alt={"delete"} />
                          </div>
                          <div className="upload text-end">
                            <img src={uploadIcon} alt={"upload"} />
                          </div> */}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6">
                        {!secondFileUploadedData && (
                          <div className="upload-resume d-flex align-items-center justify-content-center">
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                onUploadResume(acceptedFiles, 2);
                              }}
                              multiple={false}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <>
                                    <div className="label d-flex align-items-center justify-content-center">
                                      <img src={resumeAddIcon} alt={"Resume"} />
                                      &nbsp; Upload Resume
                                    </div>
                                    <p className="small-text-gray text-muted text-center mt-2">
                                      PDF, Doc - Upto 5 MB
                                    </p>
                                  </>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        )}
                        {secondFileUploadedData && (
                          <div className="uploaded-resume">
                            <div className="file-wrapper d-flex justify-content-start align-items-center">
                              <div className="file-type">
                                <img
                                  src={
                                    secondFileUploadedData?.fileExtension ===
                                    "pdf"
                                      ? thumbnailPdfIcon
                                      : thumbnailWordIcon
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="file-name ellipse-2">
                                {secondFileUploadedData?.fileName}
                              </div>
                            </div>

                            <div className="file-actions d-flex align-items-center">
                              <div className="link flex-1 small-text-gray">
                                <input
                                  type="radio"
                                  name="resume"
                                  id="select-first"
                                  className="yesNo"
                                  defaultChecked={secondResumeSelected}
                                  onClick={() => {
                                    selectedResume(2);
                                    props.setIsResumeSelected(true);
                                    setFirstResumeSelected(false);
                                    setSecondResumeSelected(true);
                                  }}
                                />
                                <label
                                  htmlFor="select-first"
                                  className="text-decoration-none btn rounded-pill border pe-5 ps-5 bg-white fs-12"
                                >
                                  {!secondResumeSelected
                                    ? "Select This"
                                    : "Selected"}
                                </label>
                              </div>
                              {/* <div className="delete text-end">
                            <img src={deleteIcon} alt={"delete"} />
                          </div>
                          <div className="upload text-end">
                            <img src={uploadIcon} alt={"upload"} />
                          </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {(candidateDetails?.userResumeResponse?.length === 0 ||
              candidateDetails?.userResumeResponse == null) &&
            props?.forQuickApply ? (
              <>
                <div className="about-heading pb-3 pt-2">
                  <img src={book} alt="book-icon" />
                  &nbsp; Resume
                </div>
                <div className="box-shadow p-4">
                  <div className="upload-resume-wrapper mt-4">
                    <div className="col-lg-6">
                      {!firstFileUploadedData && (
                        <div className="upload-resume d-flex align-items-center justify-content-center">
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              onUploadResume(acceptedFiles, 1);
                              setShowSaveResumeToProfileDialog(true);
                            }}
                            multiple={false}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <>
                                  <div className="label d-flex align-items-center justify-content-center">
                                    <img src={resumeAddIcon} alt={"Resume"} />
                                    &nbsp; Upload Resume
                                  </div>
                                  <p className="small-text-gray text-muted text-center mt-2">
                                    PDF, Doc - Upto 5 MB
                                  </p>
                                </>
                              </div>
                            )}
                          </Dropzone>
                        </div>
                      )}
                      {firstFileUploadedData && (
                        <div className="uploaded-resume">
                          <div className="file-wrapper d-flex justify-content-start align-items-center">
                            <div className="file-type">
                              <img
                                src={
                                  firstFileUploadedData?.fileExtension === "pdf"
                                    ? thumbnailPdfIcon
                                    : thumbnailWordIcon
                                }
                                alt=""
                              />
                            </div>
                            <div className="file-name ellipse-2">
                              {firstFileUploadedData?.fileName}
                            </div>
                          </div>
                          <div className="file-actions d-flex align-items-center">
                            <div className="link flex-1 small-text-gray">
                              <input
                                type="radio"
                                id="select-second"
                                name="resume"
                                className="yesNo"
                                defaultChecked={firstResumeSelected === true}
                                onClick={() => {
                                  selectedResume(1);
                                  props.setIsResumeSelected(true);
                                  setFirstResumeSelected(true);
                                  setSecondResumeSelected(false);
                                }}
                              />
                              <label
                                htmlFor="select-second"
                                className="text-decoration-none btn rounded-pill border pe-5 ps-5 bg-white fs-12"
                              >
                                {!firstResumeSelected
                                  ? "Select This"
                                  : "Selected"}
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : candidateDetails?.userResumeResponse?.length === 1 ? (
              <></>
            ) : (
              <div>
                <div className="about-heading pb-3 pt-2">
                  <img src={book} alt="book-icon" />
                  &nbsp; Resume
                </div>
                <div className="box-shadow mt-3 p-4">
                  <h5 className="dark-pink-text fs-16 fw-600 mb-3">
                    {candidateDetails?.userResumeResponse?.length === 2
                      ? "Select 1 resume for your application"
                      : ""}
                  </h5>
                  <div className="upload-resume-wrapper mt-4">
                    <div className="row">
                      <div className="col-lg-6">
                        {!firstFileUploadedData && (
                          <div className="upload-resume d-flex align-items-center justify-content-center">
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                onUploadResume(acceptedFiles, 1);
                                setShowSaveResumeToProfileDialog(true);
                              }}
                              multiple={false}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <>
                                    <div className="label d-flex align-items-center justify-content-center">
                                      <img src={resumeAddIcon} alt={"Resume"} />
                                      &nbsp; Upload Resume
                                    </div>
                                    <p className="small-text-gray text-muted text-center mt-2">
                                      PDF, Doc - Upto 5 MB
                                    </p>
                                  </>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        )}
                        {firstFileUploadedData && (
                          <div className="uploaded-resume">
                            <div className="file-wrapper d-flex justify-content-start align-items-center">
                              <div className="file-type">
                                <img
                                  src={
                                    firstFileUploadedData?.fileExtension ===
                                    "pdf"
                                      ? thumbnailPdfIcon
                                      : thumbnailWordIcon
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="file-name ellipse-2">
                                {firstFileUploadedData?.fileName}
                              </div>
                            </div>
                            <div className="file-actions d-flex align-items-center">
                              <div className="link flex-1 small-text-gray">
                                <input
                                  type="radio"
                                  id="select-second"
                                  name="resume"
                                  className="yesNo"
                                  defaultChecked={firstResumeSelected === true}
                                  onClick={() => {
                                    selectedResume(1);
                                    props.setIsResumeSelected(true);
                                    setFirstResumeSelected(true);
                                    setSecondResumeSelected(false);
                                  }}
                                />
                                <label
                                  htmlFor="select-second"
                                  className="text-decoration-none btn rounded-pill border pe-5 ps-5 bg-white fs-12"
                                >
                                  {!firstResumeSelected
                                    ? "Select This"
                                    : "Selected"}
                                </label>
                              </div>
                              {/* <div className="delete text-end">
                            <img src={deleteIcon} alt={"delete"} />
                          </div>
                          <div className="upload text-end">
                            <img src={uploadIcon} alt={"upload"} />
                          </div> */}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6">
                        {!secondFileUploadedData && (
                          <div className="upload-resume d-flex align-items-center justify-content-center">
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                onUploadResume(acceptedFiles, 2);
                                setShowSaveResumeToProfileDialog(true);
                              }}
                              multiple={false}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <>
                                    <div className="label d-flex align-items-center justify-content-center">
                                      <img src={resumeAddIcon} alt={"Resume"} />
                                      &nbsp; Upload Resume
                                    </div>
                                    <p className="small-text-gray text-muted text-center mt-2">
                                      PDF, Doc - Upto 5 MB
                                    </p>
                                  </>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        )}
                        {secondFileUploadedData && (
                          <div className="uploaded-resume">
                            <div className="file-wrapper d-flex justify-content-start align-items-center">
                              <div className="file-type">
                                <img
                                  src={
                                    secondFileUploadedData?.fileExtension ===
                                    "pdf"
                                      ? thumbnailPdfIcon
                                      : thumbnailWordIcon
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="file-name ellipse-2">
                                {secondFileUploadedData?.fileName}
                              </div>
                            </div>
                            <div className="file-actions d-flex align-items-center">
                              <div className="link flex-1 small-text-gray">
                                {secondResumeSelected}
                                <input
                                  type="radio"
                                  name="resume"
                                  id="select-first"
                                  className="yesNo"
                                  defaultChecked={secondResumeSelected}
                                  onClick={() => {
                                    props.setIsResumeSelected(true);
                                    selectedResume(2);
                                    setFirstResumeSelected(false);
                                    setSecondResumeSelected(true);
                                  }}
                                />
                                <label
                                  htmlFor="select-first"
                                  className="text-decoration-none btn rounded-pill border pe-5 ps-5 bg-white fs-12"
                                >
                                  {!secondResumeSelected
                                    ? "Select This"
                                    : "Selected"}
                                </label>
                              </div>
                              {/* <div className="delete text-end">
                            <img src={deleteIcon} alt={"delete"} />
                          </div>
                          <div className="upload text-end">
                            <img src={uploadIcon} alt={"upload"} />
                          </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        show={showSaveResumeToProfileDialog}
        backdrop="static"
        fullscreen="sm-down"
        keyboard={false}
        centered
        onHide={() => {
          setShowSaveResumeToProfileDialog(false);
        }}
      >
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">Save Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          Do you want to save this Resume to your profile ?
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            // style={{ border: "1px solid black" }}
            className="btn btn-cancel"
            onClick={() => {
              saveNewResumeToProfile(resumeUpdateObject);

              setShowSaveResumeToProfileDialog(false);
              props.setIsResumeSelected(true);
            }}
          >
            Yes
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              setShowSaveResumeToProfileDialog(false);
              props.setIsResumeSelected(true);
            }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SelectResume;
