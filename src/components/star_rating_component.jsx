import icFeedbackStar from "./../assests/icons/ic_feedback_star.svg";
import icFeedbackYellowStar from "./../assests/icons/ic_feedback_yellow_star.svg";
import { useEffect } from "react";

export const StarRating = ({
  totalStars,
  setRating,
  rating,
  customClasses,
}) => {
  // This Component will take {totalStars, setRating, rating} this parameter to make Star Rating.
  return (
    <div className={`${customClasses} mt-3 d-flex `}>
      {[...new Array(totalStars)].map((arr, index) => {
        // [..new Array(totalStars)] will create array based on totalStars value {eg.5}
        return index < rating ? (
          <img
            className="pointer"
            src={icFeedbackYellowStar}
            alt="Star-icon"
            onClick={() => {
              setRating(index + 1);
            }}
          />
        ) : (
          <img
            className="pointer"
            src={icFeedbackStar}
            alt="Star-icon"
            onClick={() => {
              setRating(index + 1);
            }}
          />
        );
      })}
    </div>
  );
};
