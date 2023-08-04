import React from "react";
import book from "../assests/icons/ic_book.svg";
import { useEffect, useState } from "react";
import "../styles/profile-resume.scss";
import resumeAddIcon from "../assests/icons/ic-add-filled.svg";
import thumbnailPdfIcon from "../assests/icons/thumbnail-pdf.svg";
import thumbnailWordIcon from "../assests/icons/thumbnail-word.svg";
import deleteIcon from "../assests/icons/ic-delete-red.svg";
import uploadIcon from "../assests/icons/ic-upload.svg";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import ApplyForJobQuestions from "./ApplyForJobQuestions";
import SelectResume from "./SelectResume";
import toaster from "../utils/toaster";
import { fetchJobDetails } from "../_services/member-profile.service";
import Loader from "./common/loader";
import CompanyImage from "./company_image";
import { useRef } from "react";

const QuickApplyResumeSelection = (props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });
  const [jobDetails, setJobDetails] = useState({});
  useEffect(() => {
    setShowLoader(true);
    fetchJobDetails(Number(props.id))
      .then((res) => {
        setShowLoader(false);
        if (res.status === 200) {
          setJobDetails(res.data.data);
        } else {
          toaster("error", "Unable to fetch data");
        }
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("error", err);
      });
  }, []);

  const [showLoader, setShowLoader] = useState(false);

  const [secondFileUploadedData, setSecondFileUploadedData] = useState();

  // useEffect(() => {
  //   fetchJobDetails()
  //     .then((res) => {
  //       setShowLoader(false);
  //       console.log(res);
  //       setJobDetails(res);

  //       // setIsFeatured(false);
  //     })
  //     .catch((err) => {
  //       setShowLoader(false);
  //       toaster("error", err);
  //       console.log(err);
  //     }),
  //     [];
  // });

  const quickApplyBodyRef = useRef();

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSecondFileUploadedData(acceptedFiles);
    } else {
      setSecondFileUploadedData([]);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (quickApplyBodyRef) {
      quickApplyBodyRef?.current?.focus();
    }
  }, [showLoader]);

  return (
    <div
      ref={quickApplyBodyRef}
      tabIndex="-1"
      style={{ outline: "none" }}
      className="container"
    >
      {showLoader && <Loader />}
      <span className="medium-black-text"> APPLYING FOR </span>
      <div className="">
        <h2 className="large-text-dark-gray fs-20 fw-700 mt-1">
          {props?.jobDetails?.jobTitle}
        </h2>
        <div className="d-flex">
          {(props?.jobDetails?.companyProfile?.companyLogo ||
            props?.jobDetails?.companyProfile?.companyName) && (
            <CompanyImage
              src={props?.jobDetails?.companyProfile?.companyLogo}
              height="60px"
              width="60px"
              name={props?.jobDetails?.companyProfile?.companyName}
              initialsContainerClass="initialsStyle2-xl bg-white p-2 border-1px solid gray border-radius"
            />
          )}
          <span className="ps-2 pt-2 mt-2 fs-16 medium-black-text">
            {props?.jobDetails?.companyProfile?.companyName}
          </span>
        </div>
        <hr />
      </div>
      {/* Resume section */}
      {/* <SelectResume
        setApplyForJob={props?.setApplyForJob}
        applyForJob={props?.applyForJob}
        forQuickApply={true}
        setIsResumeSelected={props?.setIsResumeSelected}
        isResumeSelected={props?.isResumeSelected}
        newCandidateDetails={props?.newCandidateDetails}
        setNewCandidateDetails={props?.setNewCandidateDetails}
      /> */}
      <SelectResume
        applyForJob={props?.applyForJob}
        setApplyForJob={props?.setApplyForJob}
        isResumeSelected={props?.isResumeSelected}
        setIsResumeSelected={props?.setIsResumeSelected}
        forQuickApply={true}
        newCandidateDetails={props?.newCandidateDetails}
        setNewCandidateDetails={props?.setNewCandidateDetails}
        backBtnClicked={props?.backBtnClicked}
        setBackBtnClicked={props?.setBackBtnClicked}
        saveToProfile={props?.saveToProfile}
        setSaveToProfile={props?.setSaveToProfile}
        saveToProfileCheck={props?.saveToProfileCheck}
        setSaveToProfileCheck={props?.setSaveToProfileCheck}
      />
      {/* Additional Questions section */}
      <div className="pt-4">
        <ApplyForJobQuestions
          setApplyForJob={props?.setApplyForJob}
          isMandatory={props?.isMandatory}
          setIsMandatory={props?.setIsMandatory}
          applyForJob={props?.applyForJob}
          jobDetails={jobDetails}
          isResumeSelected={props?.isResumeSelected}
        />
      </div>
    </div>
  );
};

export default QuickApplyResumeSelection;
