import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import yellowstar from "../assests/icons/ic_yellowstar.svg";
import more from "../assests/icons/ic_more.svg";
import glassdoor from "../assests/icons/ic_glassdoor.svg";
import left from "../assests/icons/ic_left.svg";
import right from "../assests/icons/ic_right.svg";
import { EMPTY_REVIEWS_BOX } from "../constants/message";

function ReviewCarousel(props) {
  const [reviews, setReviews] = useState(
    props?.jobDetails?.companyProfile?.glassdoorReviews
  );
  const [index, setIndex] = useState(0);
  const prev = () => {
    if (index >= 1) setIndex(index - 1);
    else setIndex(reviews?.length - 1);
  };
  const next = () => {
    if (index < reviews?.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };
  return (
    <>
      <div className="col-12">
        <span className="font-color-black fw-700 fs-12">
          {" "}
          Ratings & Reviews{" "}
        </span>
        <br />
        <div className="d-flex justify-content-between pt-2 pb-2">
          <div>
            <span className="medium-text-dark-gray fs-12 lglh">
              {" "}
              OverAll {props?.jobDetails?.companyProfile?.glassdoorRating}{" "}
              <img src={yellowstar} alt="yellowstar-icon" />{" "}
            </span>
            <span>
              {" "}
              <img src={glassdoor} alt="glassdoor-icon" />
              {/*  */}
              <a
                href={props?.jobDetails?.companyProfile?.glassdoorUrl}
                target="_blank"
              >
                <img src={more} alt="more-icon" />{" "}
              </a>
            </span>
          </div>
          <div>
            <span className="header-gray-text">
              {" "}
              {index + 1}/{reviews?.length}{" "}
              <img
                src={left}
                alt="leftsidearrow"
                className="ps-2 mt-0 pointer "
                onClick={() => prev()}
              />
              <span className="ps-3 mt-0">
                <a>
                  <img
                    src={right}
                    alt="rightsidearrow"
                    className="pointer"
                    onClick={() => next()}
                  />{" "}
                </a>
              </span>
            </span>
          </div>
        </div>
      </div>
      {reviews?.length > 1 && (
        <Carousel
          className="px-0"
          activeIndex={index}
          controls={false}
          indicators={false}
        >
          {reviews?.map((review, i) => (
            <Carousel.Item key={i + 1}>
              <div className="mx-2">
                <div className="w-100 font-gray-div">{review}</div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
      {reviews?.length === 1 &&
        reviews?.map((review, i) => (
          <div className="mx-2">
            <div className="w-100 font-gray-div">{review}</div>
          </div>
        ))}
      {reviews?.length === 0 && (
        <div className="mx-2">
          <div className="w-100 font-gray-div">{EMPTY_REVIEWS_BOX}</div>
        </div>
      )}
    </>
  );
}

export default ReviewCarousel;
