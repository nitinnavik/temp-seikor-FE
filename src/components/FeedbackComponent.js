/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import icFeedbackStar from "./../assests/icons/ic_feedback_star.svg";
import icFeedbackYellowStar from "./../assests/icons/ic_feedback_yellow_star.svg";
import { useState } from "react";
import { getAppliedJobsById, giveFeedbackJobs } from "../_services/job.service";
import toaster from "./../utils/toaster";
import { useStoreActions } from "easy-peasy";
import { getLocalStorage } from "./../utils/storage";
import { USER_ID } from "../constants/keys";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "./common/loader";
import { validateField } from "../utils/form_validators";
import { StarRating } from "./star_rating_component";

const FeedbackComponent = (props) => {
  let { id } = useParams();
  const [feedbackDetails, setFeedbackDetails] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [isfeedbackShow, setIsfeedbackShow] = useState(false);
  const [formData, setFormData] = useState({
    ratingvalue: { valueText: "", errorText: "" },
  });
  const [formError, setFormError] = useState({
    ratingvalue: "",
  });
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState();

  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const validateRating = (formData, setFormData) => {
    let isValid = true;
    if (rating === null) {
      setFormError({
        ratingvalue: "Please Add Overall Experience",
      });
      isValid = false;
    } else {
      setFormError({
        ratingvalue: "",
      });
      isValid = true;
    }
    setFormData(formData);
    return isValid;
  };
  const fetchRefereeFeedbackDetails = () => {
    getAppliedJobsById(id)
      .then((res) => {
        setFeedbackDetails(res?.data?.data);
        setRating(res?.data?.data?.feedback?.rating);
        setFeedback(res?.data?.data?.feedback?.feedback);
      })
      .catch((err) => {
        toaster("error", err);
      });
  };
  useEffect(() => {
    fetchRefereeFeedbackDetails();
  }, []);
  const handleSubmit = () => {
    if (!rating) {
      toaster("error", "Please Add Overall Experience");
    } else {
      // if (validateRating(formData, setFormData)) {
      setShowLoader(true);
      giveFeedbackJobs({
        jobId: feedbackDetails?.jobApplication?.jobId
          ? feedbackDetails?.jobApplication?.jobId
          : null,
        jobAppId: feedbackDetails?.jobApplication?.applicationId
          ? feedbackDetails?.jobApplication?.applicationId
          : null,
        userId: feedbackDetails?.jobApplication?.userId
          ? feedbackDetails?.jobApplication?.userId
          : null,
        feedback: feedback,
        rating: rating,
      })
        .then((response) => {
          setShowLoader(false);

          if (response?.status === 200) {
            props?.onJobFeedback("sucess");
            toaster("success", "Saved successfully!");
          }
          const userId = getLocalStorage(USER_ID);

          if (userId) {
            saveCandidateDetails(userId);
          }
        })
        .catch((error) => {
          setShowLoader(false);

          toaster("error", error);
        });
    }
  };

  useEffect(() => {}, [saveCandidateDetails]);

  return (
    <div className=" box-shadow p-sm-5 p-3 pe-4 mt-3 feedback-background">
      {showLoader && <Loader />}
      <div className="d-flex gap-3 border-bottom">
        <div className="col-8">
          <div className="fs-32 fw-700 color-primary feedback-large-font">
            Your feedback matters
          </div>
          <div className="fs-16 color-tertiary feedback-medium-font">
            Let us know how we did on the hiring process
          </div>
        </div>
        <div className="col-4">
          <div className="d-flex align-items-end h-100">
            <img
              src={require("./../assests/images/feedback.png")}
              alt="feedback-image"
              width="100%"
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="fs-14 fw-600 color-primary">
          Overall Experience <span className="text-danger">* </span>
        </h4>
        <StarRating
          totalStars={5}
          setRating={setRating}
          rating={rating}
          customClasses={"gap-2"}
        />
        <p className="field-error mt-1">{formError.ratingvalue}</p>
      </div>

      <div className="mt-5">
        <h4 className="fs-14 fw-600 color-primary"> Your feedback </h4>
        <div className="mt-3">
          <textarea
            className="w-100 p-3 fs-12 fw-400 color-tertiary border"
            placeholder="Write here"
            rows={5}
            defaultValue={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
          ></textarea>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          {/* {isfeedbackShow ? ( */}
          <button
            className="btn btn-primary feedback-btn-padding fs-12 fw-700 verify-btn"
            onClick={() => {
              handleSubmit();
            }}
          >
            {" "}
            Submit{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent;
