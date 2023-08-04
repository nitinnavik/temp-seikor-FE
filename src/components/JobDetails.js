/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import preview from "../assests/icons/preview.svg";
import star from "../assests/icons/ic_star.svg";
import shock from "../assests/icons/ic_shock.svg";
import process from "../assests/icons/ic_process.svg";
import people from "../assests/icons/ic_people.svg";
import product from "../assests/icons/ic_product.svg";
import flag from "../assests/icons/ic_flag.png";
import whatElse from "../assests/icons/ic_what_else.svg";
import banner from "../assests/images/airbnb_logo.png";
import { NOT_MENTIONED } from "../constants/message";
import { isEmpty } from "../utils/form_validators";
import { getLocalStorage } from "../utils/storage";
import { TOKEN } from "../constants/keys";
import { useNavigate } from "react-router";
// import { report } from "process";

const JobDetails = (props) => {
  const token = getLocalStorage(TOKEN);
  const navigate = useNavigate();
  // const screeningProcess = ["abhdhd", "aihuuuee", "sinuwuww", "sppiwuehe"];
  return (
    <div className="container p-0">
      <div className="row pt-2 pt-2">
        <div className="col-md-6 col-12 pe-2">
          <div className="font-color-black fw-600 fs-16">
            {" "}
            <img src={preview} alt="preview-icon" className="pe-2" /> Key Skills{" "}
          </div>
          <div className="pt-1 pb-3 d-flex flex-wrap">
            {props.jobDetails.skillsRequired?.map((skill, index) => {
              return (
                <div className="font-color-blue p-1 ps-2 pe-2 mt-2" key={index}>
                  {skill}
                </div>
              );
            })}
            {/* <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              Web Development
            </div>
            <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              Market Research
            </div>
            <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              Critical Thinking
            </div>
            <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              {" "}
              Leadership{" "}
            </div>
            <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              {" "}
              Presentation{" "}
            </div>
            <div className="font-color-blue p-1 ps-2 pe-2 mt-2">
              {" "}
              Communication{" "}
            </div> */}
          </div>
          <hr className="mt-2"></hr>
        </div>
        <div className="col-md-6 col-12 ps-2">
          <div className="font-color-black fw-600 fs-16">
            <img src={shock} alt="shock-icon" className="pe-2" />
            Your Superpowers
          </div>
          <div className="pt-1 pb-3 d-flex flex-wrap">
            {props.jobDetails.jobPower?.map((power, index) => {
              return (
                <div className="font-color-red p-1 ps-2 pe-2 mt-2" key={index}>
                  {" "}
                  {power}
                </div>
              );
            })}

            {/* <div className="font-color-red p-1 ps-2 pe-2 mt-2">
              {" "}
              Bug Basher{" "}
            </div>
            <div className="font-color-red p-1 ps-2 pe-2 mt-2">
              {" "}
              Team Leader{" "}
            </div> */}
            {/* <div className="font-color-red p-1 ps-2 pe-2 mt-2">
              {" "}
              Critical Thinking{" "}
            </div> */}
          </div>
          <hr className="mt-2"></hr>
        </div>
      </div>

      <div className="row pt-2 pt-2">
        <div className="col-md-6 col-12 pe-2">
          <span className="font-color-black fw-600 fs-16">
            <img src={star} alt="preview-icon" className="pe-2" /> Why should
            you look at this role?
          </span>
          <div style={{ paddingLeft: "11px" }}>
            <ul className="p-2 style-done">
              {props.jobDetails.jobAdvantage?.map((advantage, index) => {
                return (
                  <li className="font-medium-gray pb-1 ps-3" key={index}>
                    {" "}
                    {advantage}
                  </li>
                );
              })}
            </ul>
          </div>

          <hr className="mt-2"></hr>
        </div>
        <div className="col-md-6 col-12">
          <span className="font-color-black fw-600 fs-16 mt-3">
            <img src={product} alt="preview-icon" className="pe-2" /> What you
            will do everyday?
          </span>
          <div style={{ paddingLeft: "11px" }}>
            <ul className="p-2 style-done">
              {props.jobDetails.jobEveryDayTask?.map((task, index) => {
                return (
                  <li className="font-medium-gray pb-1 ps-3" key={index}>
                    {" "}
                    {task}
                  </li>
                );
              })}

              {/* <li className="font-medium-gray pb-1">
              {" "}
              Explore Designs based on the requirements{" "}
            </li>
            <li className="font-medium-gray pb-1">
              {" "}
              Conduct User research interviews{" "}
            </li>
            <li className="font-medium-gray pb-1">
              {" "}
              Present your findings, insights and designs to managers and
              leadership{" "}
            </li> */}
            </ul>
          </div>

          <hr className="mt-2"></hr>
        </div>
      </div>

      <div className="row pt-2 pt-2">
        <div className="col-md-6 col-12 pe-2">
          <span className="font-color-black fw-600 fs-16">
            <img src={process} alt="preview-icon" className="pe-2" /> Screening
            Process
          </span>
          <ul className=" ps-4 ">
            {/* {props.jobDetails.screeningProcess} */}
            {props?.jobDetails?.screeningProcess?.map((processes, index) => {
              return (
                <div className="screening-process-list">
                  <li className="font-medium-gray pb-1 ps-2" key={index}>
                    {" "}
                    {processes}{" "}
                  </li>
                  <br />
                </div>
              );
            })}
            {/*
            <li className="font-medium-gray pb-1">
              {" "}
              Pass the resume screening{" "}
            </li>
          
            <li className="font-medium-gray pb-1">
              {" "}
              Pass the phone screenings (1-2 rounds){" "}
            </li>
            <li className="font-medium-gray pb-1">
              {" "}
              Pass the on-site interviews (4-5 rounds){" "}
            </li>
            <li className="font-medium-gray pb-1">
              {" "}
              Pass the executive reviews and get the offer{" "}
            </li> */}
          </ul>
          <hr className="mt-2"></hr>
        </div>
        <div className="col-md-6 col-12 pt-2">
          <span className="font-color-black fw-600 fs-16 mt-3">
            <img src={flag} alt="preview-icon" className="pe-2" /> Career Path
          </span>
          <div className="d-flex pt-2">
            <div
              style={{
                height: `${
                  props?.jobDetails?.jobCareerPath
                    ? `${props?.jobDetails?.jobCareerPath?.length * 26}px`
                    : "auto"
                }`,
              }}
              className="multicolor-background"
            ></div>
            <ul className=" style-circle">
              {props?.jobDetails?.jobCareerPath?.map((path, index) => {
                return (
                  <li className="font-medium-gray" key={index}>
                    {path}
                  </li>
                );
              })}

              {/* <li className="font-medium-gray pb-1"> Senior UX Designer </li>
              <li className="font-medium-gray pb-1"> UX Designer II </li>
              <li className="font-medium-gray pb-1"> This Role </li>
              <li className="font-medium-gray pb-1"> Design Manager </li>
              <li className="font-medium-gray pb-1"> Senior UX Designer </li>
              <li className="font-medium-gray pb-1"> UX Designer II </li>
              <li className="font-medium-gray pb-1"> This Role </li> */}
            </ul>
          </div>
          <hr className="mt-2"></hr>
        </div>
      </div>

      <div className="row pt-2 pt-2">
        <div className="col-md-6 col-12 pe-2">
          <span className="font-color-black fw-600 fs-16">
            <img src={people} alt="preview-icon" className="pe-2" /> Reporting
            Structure
          </span>
          <div className="p-2 ps-0">
            <span className="medium-text-dark-gray fw-400">
              Who will be reporting to this role?
            </span>
            <br />
            <span className="font-medium-gray fs-12">
              {/* {props?.jobDetails?.reportingStructure?.length &&
                props?.jobDetails?.reportingStructure[0]} */}
              {props?.jobDetails?.reportingStructure?.length &&
                props?.jobDetails?.reportingStructure?.toString().split(",")[0]}
            </span>
          </div>
          <div className="p-2 ps-0">
            <span className="medium-text-dark-gray fw-400">
              This role will be reporting to
            </span>
            <br />
            <span className="font-medium-gray fs-12">
              {/* {props?.jobDetails?.reportingStructure?.length > 1
                ? props?.jobDetails?.reportingStructure[1]
                : NOT_MENTIONED} */}
              {props?.jobDetails?.reportingRole?.length
                ? props?.jobDetails?.reportingRole?.toString().split(",")[0]
                : // reportingStructure[1]
                  NOT_MENTIONED}
            </span>
            <br />
          </div>
        </div>
        <div className="col-md-6 col-12 pt-2">
          <span className="font-color-black fw-600 fs-16 mt-3">
            <img src={whatElse} alt="preview-icon" className="pe-2" /> What else
          </span>
          <p className="p-2 mt-2 font-medium-gray lh-base">
            {props.jobDetails.additionalRemarks}
          </p>
        </div>
      </div>

      <div
        style={{ marginBottom: "40px" }}
        className="banner mt-4 position-relative"
      >
        <div className="d-md-flex  gap-4">
          <div className="col-md-3 col-12">
            <img
              src={banner}
              alt="banner-img"
              className="bg-white w-100 p-3"
              style={{ borderRadius: "12px" }}
            />
          </div>
          <div className="col-md-9 col-12 p-3">
            <p className="banner-text ">
              Not right for you, but know <br /> someone it would be perfect
              for?
            </p>
            <p className="pt-1 banner-refertext">
              {" "}
              Refer this job and earn ₹ {props?.jobDetails?.referralBonus}{" "}
            </p>
            <div className="d-flex justify-content-end pt-5">
              <input
                type="button"
                value=" Refer this Role "
                className="btn-black me-sm-4 refer-this-job-btn text-center"
                onClick={() => {
                  // if (token) {
                  props?.showReferJobDialog();
                  // } else {
                  //   navigate("/login");
                  // }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
