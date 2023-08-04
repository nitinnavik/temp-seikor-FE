import React, { useEffect, useState } from "react";
import deleteIcon from "../assests/icons/delete.svg";
import editIcon from "../assests/icons/edit-icon.svg";
import { TOKEN, USER_ID } from "../constants/keys";
import { getLocalStorage } from "../utils/storage";
import toaster from "../utils/toaster";
import { deleteWorkExperience } from "../_services/view.service";
import Loader from "./common/loader";
import { useStoreActions, useStoreState } from "easy-peasy";
import NoDataFoundCard from "./common/no_data_found_card";
import { propTypes } from "react-bootstrap/esm/Image";
import { NO_EXPERIENCE_ADDED } from "../constants/message";

const ProfessionalExperience = ({
  candidateDetails,
  setModalShow,
  onEditClick,
  isReadOnlyProp,
  fromViewRefrral,
  isApplyForJobComponent,
  setNewCandidateDetails,
  newCandidateDetails,
  isCheck,
}) => {
  const token = getLocalStorage(TOKEN);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  const deletework = (id) => {
    if (isApplyForJobComponent && !isCheck) {
      var index = newCandidateDetails?.workExperienceResponse?.findIndex(
        (x) => x.id === id
      );
      if (index == -1 || id == null) {
        toaster("Invalid Input");
      } else {
        setNewCandidateDetails({
          ...newCandidateDetails,
          workExperienceResponse: [
            ...newCandidateDetails?.workExperienceResponse.slice(0, index),
            ...newCandidateDetails?.workExperienceResponse.slice(index + 1),
          ],
        });
      }
    } else {
      setShowLoader(true);
      deleteWorkExperience(id)
        .then((res) => {
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }

          if (isApplyForJobComponent && isCheck)
            setNewCandidateDetails({
              ...newCandidateDetails,
              workExperienceResponse: [
                ...candidateDetails?.workExperienceResponse,
              ],
            });

          setShowLoader(false);
          toaster("success", "Data delete");
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
        });
    }
  };
  useEffect(() => {
    if (isReadOnlyProp) {
      setIsReadOnly(isReadOnlyProp);
    }
  }, [isReadOnlyProp]);

  return (
    <div className=" mb-3">
      {isApplyForJobComponent && !isCheck ? (
        newCandidateDetails?.workExperienceResponse?.length == 0 ? (
          <div className="no-data-found-width">
            <NoDataFoundCard text={NO_EXPERIENCE_ADDED} />
          </div>
        ) : (
          <div className={!fromViewRefrral ? "card-parent-container" : "p-2"}>
            {newCandidateDetails?.workExperienceResponse?.map((el, key) => {
              return (
                <div
                  className={!fromViewRefrral ? "card-container p-3" : "ps-2"}
                  key={key}
                >
                  <div className="pt-3 ps-2">
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="card-badge">
                          {el?.startDate} -{" "}
                          {el?.isOngoing ? "Present" : el?.endDate}
                        </div>
                      </div>
                      <div>
                        {!isReadOnly ? (
                          <div className="ms-4" style={{ minWidth: "80px" }}>
                            <img
                              className="pointer mx-2 me-4"
                              src={deleteIcon}
                              onClick={() => deletework(el?.id)}
                              style={{ height: "18px", width: "16px" }}
                              alt="Delete Icon"
                            />

                            <img
                              className="pointer p-1"
                              src={editIcon}
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop1"
                              style={{
                                border: "1px solid #E5E5E5",
                                borderRadius: "8px",
                              }}
                              alt="Edit Icon"
                              onClick={(e) => {
                                setModalShow(true);
                                onEditClick(el);
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="title-card py-3">
                      {el?.jobRole ? `${el?.jobRole} ` : ""}
                    </div>
                    <div className="card-subtitle">
                      {el?.companyName ? el?.companyName : ""}
                      {el?.jobLocation ? ` | ${el?.jobLocation} ` : ""}
                      {el?.jobType ? ` | ${el?.jobType} ` : ""}
                      {el?.jobFunction ? ` | ${el?.jobFunction} ` : ""}
                    </div>
                    <div className="card-content text-break">
                      {el?.jobSummary}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : candidateDetails?.workExperienceResponse?.length == 0 ||
        candidateDetails?.workExperienceResponse == null ? (
        <div className="no-data-found-width">
          <NoDataFoundCard text="No experience is added" />
        </div>
      ) : (
        <div className={!fromViewRefrral ? "card-parent-container" : "p-2"}>
          {candidateDetails?.workExperienceResponse?.map((el, key) => {
            return (
              <div
                className={!fromViewRefrral ? "card-container p-3" : "ps-2"}
                key={key}
              >
                <div className="pt-3 ps-2 w-100">
                  <div className="d-flex justify-content-between w-100">
                    <div className="">
                      <div className="card-badge">
                        {el?.startDate} -{" "}
                        {el?.isOngoing ? "Present" : el?.endDate}
                      </div>
                    </div>
                    <div>
                      {!isReadOnly ? (
                        <div className="" style={{ minWidth: "80px" }}>
                          <img
                            className="pointer mx-2 me-sm-4 me-2"
                            src={deleteIcon}
                            onClick={() => deletework(el?.id)}
                            style={{ height: "18px", width: "16px" }}
                            alt="Delete Icon"
                          />

                          <img
                            className="pointer p-1"
                            src={editIcon}
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            style={{
                              border: "1px solid #E5E5E5",
                              borderRadius: "8px",
                            }}
                            alt="Edit Icon"
                            onClick={(e) => {
                              setModalShow(true);
                              onEditClick(el);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="title-card py-3">
                    {el?.jobRole ? `${el?.jobRole} ` : ""}
                  </div>
                  <div className="card-subtitle">
                    {el?.companyName ? el?.companyName : ""}
                    {el?.jobLocation ? ` | ${el?.jobLocation} ` : ""}
                    {el?.jobType ? ` | ${el?.jobType} ` : ""}
                    {el?.jobFunction ? ` | ${el?.jobFunction} ` : ""}
                  </div>
                  <div className="card-content text-break">
                    {el?.jobSummary}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* {candidateDetails?.workExperienceResponse?.length == 0 ? (
        <NoDataFoundCard text="No experience is added" />
      ) : (
        <div className={!fromViewRefrral ? "card-parent-container" : "p-2"}>
          {candidateDetails?.workExperienceResponse?.map((el, key) => {
            return (
              <div className={!fromViewRefrral ? "card-container p-3" : "ps-2"}>
                <div className="pt-3 ps-2">
                  <div>
                    <span className="card-badge">
                      {el?.startDate} -{" "}
                      {el?.isOngoing ? "Present" : el?.endDate}
                    </span>
                  </div>
                  <div className="title-card py-3">
                    {el?.jobRole ? `${el?.jobRole} ` : ""}
                  </div>
                  <div className="card-subtitle">
                    {el?.companyName ? el?.companyName : ""}
                    {el?.jobLocation ? ` | ${el?.jobLocation} ` : ""}
                    {el?.jobType ? ` | ${el?.jobType} ` : ""}
                    {el?.jobFunction ? ` | ${el?.jobFunction} ` : ""}
                  </div>
                  <div className="card-content">{el?.jobSummary}</div>
                </div>
                {!isReadOnly ? (
                  <div className="pt-4 pe-1" style={{ minWidth: "102px" }}>
                    <img
                      className="pointer mx-2 me-4"
                      src={deleteIcon}
                      onClick={() => deletework(el?.id)}
                      style={{ height: "18px", width: "16px" }}
                      alt="Delete Icon"
                    />

                    <img
                      className="pointer p-1"
                      src={editIcon}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop1"
                      style={{
                        border: "1px solid #E5E5E5",
                        borderRadius: "8px",
                      }}
                      alt="Edit Icon"
                      onClick={(e) => {
                        setModalShow(true);
                        onEditClick(el);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
};

export default ProfessionalExperience;
