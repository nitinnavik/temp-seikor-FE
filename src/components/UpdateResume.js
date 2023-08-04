import React, { useCallback, useEffect, useState, createRef } from "react";
import "../styles/profile-resume.scss";
import resumeTitleIcon from "../assests/icons/ic-resume.svg";
import resumeAddIcon from "../assests/icons/ic-add-filled.svg";
import thumbnailPdfIcon from "../assests/icons/thumbnail-pdf.svg";
import thumbnailWordIcon from "../assests/icons/thumbnail-word.svg";
import deleteIcon from "../assests/icons/ic-delete-red.svg";
import uploadIcon from "../assests/icons/ic-upload.svg";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import {
  downloadFile,
  updateResume,
  uploadFile,
} from "../_services/view.service";
import Loader from "./common/loader";
import toaster from "../utils/toaster";
import { useStoreState, useStoreActions } from "easy-peasy";
import { getLocalStorage } from "../utils/storage";
import { FAILED_TO_LOAD, USER_ID } from "../constants/keys";

import { deleteCandidateResume } from "../_services/candidate.service";
import {
  GENERAL_ERROR_MESSAGE,
  IMAGE_SIZE_EXCEEDING,
  RESUME_SIZE_EXCEEDING,
} from "../constants/message";
import { Modal } from "react-bootstrap";
import close from "../assests/icons/ic-close-24.svg";

const UpdateResume = () => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const [showLoader, setShowLoader] = useState(false);
  const [firstFileUploadedData, setFirstFileUploadedData] = useState();
  const [FileNameDoc, setFileNameDoc] = useState();
  const [secondFileUploadedData, setSecondFileUploadedData] = useState();
  const [smShow, setSmShow] = useState(false);
  const [sm1Show, setSm1Show] = useState(false);

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

    setShowLoader(true);

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

    uploadFile(formData).then(
      (response) => {
        setFileNameDoc(response?.data?.contentName);

        if (response?.id) {
          const resumeUpdateObject = {
            fileId: response?.id,
            isActive: true,
            contentName: fileType,
            fileOrder: resumeNumber,
            previousFileId: prevId,
          };
          updateResume([resumeUpdateObject]).then(
            (data) => {
              setShowLoader(false);
              const userId = getLocalStorage(USER_ID);
              if (userId) {
                saveCandidateDetails(userId);
                toaster("success", "Resume uploaded successfully!");
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
        } else {
          setShowLoader(false);
          toaster(
            "error",
            response?.message ? response?.message : GENERAL_ERROR_MESSAGE
          );
        }
      },
      (error) => {
        toaster(
          "error",
          error?.message ? error?.message : GENERAL_ERROR_MESSAGE
        );
        setShowLoader(false);
      }
    );
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

  const fileDetails = (url, fileName, fileOrder) => {
    if (url !== null) {
      let dotArray = url.split(".");
      let fileExtension = url.split(".")[dotArray.length - 1];
      // let slashArray = url.split("/");
      //slashArray[slashArray.length - 1];
      // console.log(candidateDetails?.userResumeResponse[index]);
      // let fileName = candidateDetails?.userResumeResponse[index]?.contentName;

      // let fileName = slashArray[slashArray.length - 1];
      console.log(fileName);
      return { fileName, fileExtension, url, fileOrder };
    }
  };

  useEffect(() => {
    if (
      candidateDetails?.userResumeResponse &&
      candidateDetails?.userResumeResponse.length > 0
    ) {
      const { userResumeResponse } = candidateDetails;
      let firstIndex = userResumeResponse
        .map((resume) => resume.fileOrder)
        .indexOf(1);
      console.log(firstIndex);
      if (firstIndex >= 0) {
        setFirstFileUploadedData(
          fileDetails(
            userResumeResponse[firstIndex]?.downloadURL,
            userResumeResponse[firstIndex]?.contentName,
            1
          )
        );
      } else {
        setFirstFileUploadedData(null);
      }
      // For Second resume
      let secondIndex = userResumeResponse
        .map((resume) => resume.fileOrder)
        .indexOf(2);
      console.log(secondIndex);
      if (secondIndex >= 0) {
        setSecondFileUploadedData(
          fileDetails(
            userResumeResponse[secondIndex]?.downloadURL,
            userResumeResponse[secondIndex]?.contentName,
            2
          )
        );
      } else {
        setSecondFileUploadedData(null);
      }

      // if (candidateDetails?.userResumeResponse.length === 1) {
      //   setFirstFileUploadedData(
      //     fileDetails(
      //       userResumeResponse[0]?.downloadURL,
      //       userResumeResponse[0]?.contentName
      //     )
      //   );
      //   setSecondFileUploadedData(null);
      // } else if (candidateDetails?.userResumeResponse.length > 1) {
      //   setFirstFileUploadedData(
      //     fileDetails(
      //       userResumeResponse[userResumeResponse.length - 2]?.downloadURL,
      //       userResumeResponse[userResumeResponse.length - 2]?.contentName
      //     )
      //   );
      //   setSecondFileUploadedData(
      //     fileDetails(
      //       userResumeResponse[userResumeResponse.length - 1]?.downloadURL,
      //       userResumeResponse[userResumeResponse.length - 1]?.contentName
      //     )
      //   );
      // }
    } else {
      setFirstFileUploadedData(null);
      setSecondFileUploadedData(null);
    }
    setShowLoader(false);
  }, [candidateDetails]);

  const handleDeleteResume = (fileNumber) => {
    setShowLoader(true);
    let index = candidateDetails?.userResumeResponse
      .map((resume) => resume.fileOrder)
      .indexOf(fileNumber);

    const fileId = candidateDetails?.userResumeResponse[index]?.fileId;

    deleteCandidateResume(fileId)
      .then((res) => {
        const userId = getLocalStorage(USER_ID);
        if (userId) {
          saveCandidateDetails(userId);
          toaster("success", "Resume deleted successfully");
        }
        setShowLoader(false);
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("error", "Couldn't delete resume");
      });
  };

  return (
    <React.Fragment>
      {showLoader && <Loader />}
      <div className="upload-resume-wrapper mt-4">
        <div className="row">
          <div className="col-lg-6">
            {!firstFileUploadedData && (
              <div className="upload-resume d-flex align-items-center justify-content-center">
                <Dropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    onUploadResume(acceptedFiles, 1);
                  }}
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
                  <div className="file-name ellipse-3">
                    {/* {filesname?.contentName} */}
                    {firstFileUploadedData?.fileName}
                  </div>
                </div>
                <div className="file-actions d-flex align-items-center">
                  <div className="link flex-1 small-text-gray">
                    <Link
                      to="/"
                      className="text-decoration-none"
                      onClick={(event) => {
                        event.preventDefault();
                        downloadResume(
                          firstFileUploadedData?.url,
                          firstFileUploadedData?.fileName
                        );
                      }}
                    >
                      Download
                    </Link>
                  </div>
                  <div className="delete text-end">
                    <img
                      onClick={() => {
                        setSmShow(true);
                      }}
                      src={deleteIcon}
                      alt={"delete"}
                    />
                  </div>
                  <Modal
                    show={smShow}
                    onHide={() => setSmShow(false)}
                    size="md"
                    id="request-payment"
                    className="border-radius-16 lg-dialog-modal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header className="border-0 d-flex justify-content-end">
                      <img
                        src={close}
                        alt="close-icon"
                        className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-1"
                        onClick={() => setSmShow(false)}
                      />
                    </Modal.Header>

                    <Modal.Body className="ps-4">
                      {/*  */}
                      <div className="mb-5">
                        <h3 className="color-primary fw-700  fs-24">
                          {" "}
                          Delete Resume
                        </h3>
                        <p className="color-tertiary fs-14 ">
                          Are you sure you want to delete your resume?
                        </p>
                      </div>
                    </Modal.Body>

                    <Modal.Footer className="modal-dialog-footer d-flex justify-content-end align-items-center gap-2">
                      <button
                        className="btn retract--cancel-btn fs-12"
                        onClick={() => setSmShow(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn retract-btn fs-12"
                        onClick={() => {
                          handleDeleteResume(1);
                          setSmShow(false);
                        }}
                        src={deleteIcon}
                        alt={"delete"}
                      >
                        Yes Delete
                      </button>
                    </Modal.Footer>
                  </Modal>
                  <div className="upload text-end">
                    <Dropzone
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        let index = candidateDetails?.userResumeResponse
                          .map((resume) => resume?.fileOrder)
                          .indexOf(1);
                        onUploadResume(
                          acceptedFiles,
                          firstFileUploadedData?.fileOrder,
                          candidateDetails?.userResumeResponse[index]?.fileId
                        );
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <img src={uploadIcon} alt={"upload"} />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-6">
            {!secondFileUploadedData && (
              <div className="upload-resume d-flex align-items-center justify-content-center">
                <Dropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    onUploadResume(acceptedFiles, 2);
                  }}
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
                        secondFileUploadedData?.fileExtension === "pdf"
                          ? thumbnailPdfIcon
                          : thumbnailWordIcon
                      }
                      alt=""
                    />
                  </div>
                  <div className="file-name ellipse-3">
                    {secondFileUploadedData?.fileName}
                  </div>
                </div>
                <div className="file-actions d-flex align-items-center">
                  <div className="link flex-1 small-text-gray">
                    <Link
                      to="/"
                      className="text-decoration-none"
                      onClick={(event) => {
                        event.preventDefault();
                        downloadResume(
                          secondFileUploadedData?.url,
                          secondFileUploadedData?.fileName
                        );
                      }}
                    >
                      Download
                    </Link>
                  </div>
                  {/* <div className="delete text-end">
                    <img
                      onClick={() => {
                        handleDeleteResume(1);
                      }}
                      src={deleteIcon}
                      alt={"delete"}
                    />
                  </div> */}
                  <div className="delete text-end">
                    <img
                      onClick={() => {
                        setSm1Show(true);
                      }}
                      src={deleteIcon}
                      alt={"delete"}
                    />
                  </div>
                  <Modal
                    show={sm1Show}
                    onHide={() => setSm1Show(false)}
                    size="md"
                    id="request-payment"
                    className="border-radius-16 lg-dialog-modal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header className="border-0 d-flex justify-content-end">
                      <img
                        src={close}
                        alt="close-icon"
                        className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-1"
                        onClick={() => setSm1Show(false)}
                      />
                    </Modal.Header>

                    <Modal.Body className="ps-4">
                      {/*  */}
                      <div className="mb-5">
                        <h3 className="color-primary fw-700  fs-24">
                          {" "}
                          Delete Resume
                        </h3>
                        <p className="color-tertiary fs-14 ">
                          Are you sure you want to delete your resume?
                        </p>
                      </div>
                    </Modal.Body>

                    <Modal.Footer className="modal-dialog-footer d-flex justify-content-end align-items-center gap-2">
                      <button
                        className="btn retract--cancel-btn fs-12"
                        onClick={() => setSm1Show(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn retract-btn fs-12"
                        onClick={() => {
                          handleDeleteResume(2);
                          setSm1Show(false);
                        }}
                        src={deleteIcon}
                        alt={"delete"}
                      >
                        Yes Delete
                      </button>
                    </Modal.Footer>
                  </Modal>
                  <div className="upload text-end">
                    <Dropzone
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        let index = candidateDetails?.userResumeResponse
                          .map((resume) => resume?.fileOrder)
                          .indexOf(2);
                        onUploadResume(
                          acceptedFiles,
                          secondFileUploadedData?.fileOrder,
                          candidateDetails?.userResumeResponse[index]?.fileId
                        );
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <img src={uploadIcon} alt={"upload"} />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* })} */}
    </React.Fragment>
  );
};

export default UpdateResume;
