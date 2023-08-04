import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { APPLIED, QUICKAPPLYMODALSHOW, TOKEN } from "../constants/keys";
import { getLocalStorage } from "../utils/storage";
import QuickApplyJob from "./QuickApplyJob";

const RecommendedJobDialog = (props) => {
  let quickApplyModalShow = getLocalStorage(QUICKAPPLYMODALSHOW);
  const [isModalCheck, setIsModalCheck] = useState(quickApplyModalShow);
  const [isModalShow, setIsModalShow] = useState();
  const [showQuickApplyModal2, setShowQuickApplyModal2] = useState(false);
  const token = getLocalStorage(TOKEN);
  const navigate = useNavigate();

  const [openReviewApplicationModal, setOpenReviewApplicationModal] =
    useState(false);

  const shouldQuickApplyModalShow = () => {
    if (token) {
      if (isModalCheck == "true") {
        setIsModalShow(false);
        setShowQuickApplyModal2(true);
      } else {
        setIsModalShow(true);
      }
    } else {
      setOpenReviewApplicationModal(true);
    }
  };
  useEffect(() => {
    let quickApplyModalShow = getLocalStorage(QUICKAPPLYMODALSHOW);
    setIsModalCheck(quickApplyModalShow);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`alljobs-applied-btn btn btn-outline-dark btn-light w-100 ${
          props?.applicationStatus === APPLIED
            ? "recom-featured-applied-btn"
            : ""
        } `}
        onClick={() => {
          shouldQuickApplyModalShow();
          props?.setCurrentJobDetails(props?.item);
        }}
        disabled={props?.applicationStatus === APPLIED ? true : false}
      >
        {props?.applicationStatus === APPLIED
          ? "Applied"
          : props?.applicationStatus !== APPLIED && token
          ? "Quick Apply "
          : "Apply"}
      </button>
      <QuickApplyJob
        id={props?.id}
        modalShow={isModalShow}
        setModalShow={setIsModalShow}
        companyLogo={props?.companyLogo}
        onJobApplied={() => {
          if (props?.onJobApplied) {
            props?.onJobApplied();
          }
        }}
        isModalCheck={isModalCheck}
        setIsModalCheck={setIsModalCheck}
        showQuickApplyModal2={showQuickApplyModal2}
        setShowQuickApplyModal2={setShowQuickApplyModal2}
        openReviewApplicationModal={openReviewApplicationModal}
        setOpenReviewApplicationModal={setOpenReviewApplicationModal}
        refererId={props?.refererId}
      />
    </>
  );
};
export default RecommendedJobDialog;
