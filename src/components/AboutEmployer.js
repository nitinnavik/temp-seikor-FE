/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import globe from "../assests/icons/ic_globe.svg";
import aicon from "../assests/icons/ic_aicon.svg";
import twitter from "../assests/icons/ic_twitter.svg";
import youtube from "../assests/icons/ic_youtube.svg";
import playstore from "../assests/icons/ic_playstore.svg";
import vicon from "../assests/icons/ic_vicon.svg";
import linkedin from "../assests/icons/ic_linkedin.svg";
import facebook from "../assests/icons/ic_facebook.svg";
import { Link } from "react-router-dom";
import ReviewCarousel from "./ReviewCarousel";
import Carousel from "react-bootstrap/Carousel";
import closeImg from "../assests/icons/ic_closeroundbtnwhite.svg";
import AboutEmployerCarouselDialog from "./about_employer_carousel_dialog";
import NoDataFoundCard from "./common/no_data_found_card";
import useWindowDimensions from "../utils/use_window_dimension";
import CompanyImage from "./company_image";
import { imageOnError } from "../utils/utils";

const AboutEmployer = (props) => {
  const [isSeeMore, setIsSeeMore] = useState(false);

  const youtubePlayerContainerRef = useRef(null);
  const [youtubePlayerHeight, setYoutubePlayerHeight] = useState(0);
  const [youtubePlayerWidth, setYoutubePlayerWidth] = useState(0);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    // The 'current' property contains info of the reference:
    // align, title, ... , width, height, etc.
    // console.log("ref", youtubePlayerContainerRef);
    if (youtubePlayerContainerRef?.current) {
      setYoutubePlayerHeight(
        youtubePlayerContainerRef?.current?.offsetWidth / 1.77
      );
      setYoutubePlayerWidth(youtubePlayerContainerRef?.current?.offsetWidth);
    }
  }, [width, props?.isEmployer]);

  return (
    <div className="pt-4 about-employer-container">
      <div className="d-flex justify-content-between">
        <h2 className="large-text-black">
          {" "}
          Life at {props?.jobDetails?.companyProfile?.companyName}
        </h2>
        {/* <img
          src={`data:image/jpeg;base64 , ${props?.jobDetails?.companyProfile?.companyLogo}`}
          alt="airbnblogo"
          className="bg-white p-2 rounded shadow"
          width="40px"
          height="40px"
        /> */}
        <div>
          <CompanyImage
            src={props?.jobDetails?.companyProfile?.companyLogo}
            name={props?.jobDetails?.companyProfile?.companyName}
            initialsContainerClass={"bg-white p-2 rounded shadow"}
            width={"40px"}
            height={"40px"}
          />
        </div>
      </div>

      <div className="d-flex gap-2 align-items-start">
        {props?.jobDetails?.companyProfile?.presence?.WEBSITE && (
          <a
            href={`https://${props?.jobDetails?.companyProfile?.presence?.WEBSITE}`}
            target="_blank"
          >
            <img src={globe} alt="globe-icon" className="" />
          </a>
        )}

        {/* <Link to="/" className="small-text-gray">
            {props?.jobDetails?.companyProfile?.website}
          </Link>
        </img> */}

        <div className="d-flex gap-3 ps-3 flex-wrap">
          {props?.jobDetails?.companyProfile?.presence?.APPLESTORE && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.APPLESTORE}`}
              target="_blank"
            >
              <img src={aicon} alt="aicon-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.PLAYSTORE && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.PLAYSTORE}`}
              target="_blank"
            >
              <img src={playstore} alt="playstore-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.TWITTER && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.TWITTER}`}
              target="_blank"
            >
              <img src={twitter} alt="twitter-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.FACEBOOK && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.FACEBOOK}`}
              target="_blank"
            >
              <img src={facebook} alt="facebook-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.YOUTUBE && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.YOUTUBE}`}
              target="_blank"
            >
              <img src={youtube} alt="youtube-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.VICON && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.VICON}`}
              target="_blank"
            >
              <img src={vicon} alt="vicon-icon" />
            </a>
          )}
          {props?.jobDetails?.companyProfile?.presence?.LINKEDIN && (
            <a
              href={`https://${props?.jobDetails?.companyProfile?.presence?.LINKEDIN}`}
              target="_blank"
            >
              <img src={linkedin} alt="linkedin-icon" />
            </a>
          )}
        </div>
      </div>
      <hr></hr>
      <div className="row gap-2">
        <div className="col-12 pb-2 ps-4 ">
          {props?.jobDetails?.companyProfile?.industries?.length > 0 &&
            props?.jobDetails?.companyProfile?.industries?.map(
              (data, index) => {
                if (data != "") {
                  return (
                    <span
                      key={index}
                      className="small-text-dark-gray fw-400 me-2"
                    >
                      {data}
                    </span>
                  );
                }
              }
            )}
        </div>
        <div className="col-12">
          <p className="large-text-gray fs-12">
            {props?.jobDetails?.companyProfile?.companyDesc}
          </p>
        </div>
        <div className="col-12 row">
          <div className="col-md-6 col-12 pt-4">
            {/* <img
              src={props?.mainImage}
              className="w-100 rounded-3"
              alt="main-image"
            /> 
             props?.jobDetails?.companyProfile?.companyVideoId
            ${props?.jobDetails?.companyProfile?.companyVideoId}*/}

            {props?.jobDetails?.companyProfile?.videoLink ? (
              <div
                // className="ps-3 pt-2 col-md-6 col-12"
                ref={youtubePlayerContainerRef}
              >
                <iframe
                  id="ytplayer"
                  type="text/html"
                  width={youtubePlayerWidth}
                  height={youtubePlayerHeight}
                  src={props?.jobDetails?.companyProfile?.videoLink}
                  frameborder="0"
                  webkitAllowFullScreen
                  mozallowfullscreen
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <NoDataFoundCard text={"Video Not Added"} />
            )}
          </div>
          <div className="col-md-6 col-12 pt-4">
            <span className="font-color-black fw-600 fs-16">
              {" "}
              Employee Benefits{" "}
            </span>{" "}
            <br />
            <div className="pt-3 pb-5">
              <span className="font-color-pink p-1 ps-2 pe-2">
                {props?.jobDetails?.companyProfile?.employeeBenefits?.join(
                  ", "
                )}
              </span>
              {/* <span className="font-color-pink p-1 ps-2 pe-2">
                {" "}
                Market Research{" "}
              </span>
              <span className="font-color-pink p-1 ps-2 pe-2">
                {" "}
                Critical Thinking{" "}
              </span>{" "}
              <br />
              <br />
              <span className="font-color-pink p-1 ps-2 pe-2">
                {" "}
                Leadership{" "}
              </span>
              <span className="font-color-pink p-1 ps-2 pe-2">
                {" "}
                Presentation{" "}
              </span>
              <span className="font-color-pink p-1 ps-2 pe-2">
                {" "}
                Communication{" "}
              </span> */}
            </div>
            <hr className="mt-lg-5"></hr>
            <div className="d-flex">
              <div className="col-6">
                <span className="font-color-black  fs-12 fw-700">
                  {" "}
                  Headcount{" "}
                </span>{" "}
                <br />
                <span className="large-text-gray fs-12">
                  {" "}
                  {props?.jobDetails?.companyProfile?.headcount}{" "}
                </span>
                <br />
              </div>
              <div className="col-6">
                <span className="font-color-black  fs-12 fw-700">
                  {" "}
                  Funding Status{" "}
                </span>{" "}
                <br />
                <span className="large-text-gray fs-12">
                  {" "}
                  {props?.jobDetails?.companyProfile?.funding}
                </span>
              </div>
            </div>
            <hr></hr>
          </div>
        </div>

        <ReviewCarousel jobDetails={props.jobDetails} />

        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-12 col-md-6">
              <span className="fw-700 fs-12 color-primary">
                {" "}
                Your Potential Colleagues{" "}
              </span>
              <br></br>
              <a
                href={props?.jobDetails?.companyProfile?.potentialLink}
                target="_blank"
                className="font-gray-link pt-3"
              >
                {" "}
                {/* airbnb.io/updatesfromourteams{" "} */}
                {props?.jobDetails?.companyProfile?.potentialLink}
              </a>
              <p className="company-desc-width large-text-gray fs-12 pt-3">
                {/* Our teams go above and beyond the regular work. If you didnt
                know, our design team killed GIFs usage in web by introducing
                Lottie and then making it Opensource - Lottie is now the
                industry standard for animations on the web and apps. */}
                {props?.jobDetails?.companyProfile?.potentialDescription}
              </p>
            </div>
            <div className="col-12 col-md-6 pt-3">
              <div className="d-flex position-relative">
                {props?.jobDetails?.companyProfile?.potentialImagesUrl
                  ?.length === 1 && (
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                      <div className="col-6 mx-3">
                        <img
                          src={`${
                            process.env.REACT_APP_API_URL
                          }${(props?.jobDetails?.companyProfile?.potentialImagesUrl[0]).replace(
                            "/",
                            ""
                          )}`}
                          className="w-100 rounded-3"
                          alt="1st-img"
                          onError={(e) => imageOnError(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {props?.jobDetails?.companyProfile?.potentialImagesUrl
                  ?.length === 2 && (
                  <div className="d-flex justify-content-end">
                    {props?.jobDetails?.companyProfile?.potentialImagesUrl?.map(
                      (image, index) => {
                        return (
                          <div className="col-6 pe-2" key={index}>
                            <img
                              src={`${
                                process.env.REACT_APP_API_URL
                              }${image.replace("/", "")}`}
                              className="w-100 rounded-3"
                              alt={`${index}img2`}
                              key={index}
                              onError={(e) => imageOnError(e)}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                {props?.jobDetails?.companyProfile?.potentialImagesUrl
                  ?.length === 3 && (
                  <div className="w-100 d-flex justify-content-start justify-content-md-end flex-wrap flex-lg-nowrap">
                    {props?.jobDetails?.companyProfile?.potentialImagesUrl?.map(
                      (image, index) => {
                        return (
                          <div className="col-6">
                            <img
                              src={`${
                                process.env.REACT_APP_API_URL
                              }${image.replace("/", "")}`}
                              className={
                                index === 0
                                  ? "w-100 pe-2 pb-2"
                                  : "h-50 w-100 pe-2 pb-2"
                              }
                              alt={`${index}img3`}
                              key={index}
                              onError={(e) => imageOnError(e)}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                {props?.jobDetails?.companyProfile?.potentialImagesUrl
                  ?.length === 4 && (
                  <div className="w-100 d-flex justify-content-end flex-wrap flex-lg-nowrap">
                    {props?.jobDetails?.companyProfile?.potentialImagesUrl?.map(
                      (image, index) => {
                        return (
                          <img
                            src={`${
                              process.env.REACT_APP_API_URL
                            }${image.replace("/", "")}`}
                            className="h-50 w-50 d-block pe-2 pb-2"
                            alt={`${index}img4`}
                            key={index}
                            onError={(e) => imageOnError(e)}
                          />
                        );
                      }
                    )}
                  </div>
                )}
                {props?.jobDetails?.companyProfile?.potentialImagesUrl
                  ?.length >= 5 && (
                  <div className="w-100 row justify-content-end">
                    <div className="col-4">
                      <img
                        src={`${
                          process.env.REACT_APP_API_URL
                        }${props?.jobDetails?.companyProfile?.potentialImagesUrl[0].replace(
                          "/",
                          ""
                        )}`}
                        onError={(e) => imageOnError(e)}
                        className="w-100 h-100 rounded-3"
                      />
                    </div>
                    <div className="col-4 ps-3">
                      <div className="pb-3">
                        <img
                          src={`${
                            process.env.REACT_APP_API_URL
                          }${props?.jobDetails?.companyProfile?.potentialImagesUrl[1].replace(
                            "/",
                            ""
                          )}`}
                          className="w-100 h-50 rounded-3"
                          onError={(e) => imageOnError(e)}
                        />
                      </div>
                      <div className="h-50">
                        <img
                          src={`${
                            process.env.REACT_APP_API_URL
                          }${props?.jobDetails?.companyProfile?.potentialImagesUrl[2].replace(
                            "/",
                            ""
                          )}`}
                          className="w-100 rounded-3"
                          onError={(e) => imageOnError(e)}
                        />
                      </div>
                    </div>
                    <div className="col-4 ps-3">
                      <div className="pb-3">
                        <img
                          src={`${
                            process.env.REACT_APP_API_URL
                          }${props?.jobDetails?.companyProfile?.potentialImagesUrl[3].replace(
                            "/",
                            ""
                          )}`}
                          className="w-100 h-50 rounded-3"
                          onError={(e) => imageOnError(e)}
                        />
                      </div>
                      <div className="h-50">
                        <img
                          src={`${
                            process.env.REACT_APP_API_URL
                          }${props?.jobDetails?.companyProfile?.potentialImagesUrl[4].replace(
                            "/",
                            ""
                          )}`}
                          className="w-100 rounded-3"
                          onError={(e) => imageOnError(e)}
                        />
                        <div
                          className={
                            props?.jobDetails?.companyProfile
                              ?.potentialImagesUrl?.length > 5
                              ? "d-block"
                              : "d-none"
                          }
                        >
                          <div
                            className="position-absolute end-0 bottom-0 translate-middle-y text-white pe-5 me-sm-5 see-more-btn-div pointer"
                            onClick={() => setIsSeeMore(true)}
                          >
                            +
                            {props?.jobDetails?.companyProfile
                              ?.potentialImagesUrl.length - 5}{" "}
                            More
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <div>
          <span className="font-color-black fs-12 fw-700"> In the News </span>
          <br />
          <ul className="style-icon p-2 ps-4">
            {props?.jobDetails?.companyProfile?.newsLinks?.map(
              (news, index) => {
                return (
                  <>
                    <li className="p-1" key={index}>
                      <a
                        href={news}
                        target="_blank"
                        className="small-text-dark-gray fw-400"
                      >
                        {news}
                      </a>{" "}
                    </li>
                  </>
                );
              }
            )}
          </ul>
        </div>
        <br />
        <br />
      </div>
      <AboutEmployerCarouselDialog
        show={isSeeMore}
        setIsSeeMore={setIsSeeMore}
        jobDetails={props?.jobDetails}
      />
    </div>
  );
};

export default AboutEmployer;
