import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { AddSocialMedia } from "../_services/member-profile.service";
import { useStoreState, useStoreActions } from "easy-peasy";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import { TOKEN, URL_PATTERN, USER_ID } from "../constants/keys";
import { isEmpty } from "../utils/form_validators";
import { LINK_ALREADY_EXIST, TITLE_ALREADY_EXIST } from "../constants/message";
import isURL from "validator/lib/isURL";

const SocialMediaDialog = (props) => {
  let token = getLocalStorage(TOKEN);
  const [flagInitialIsEmpty, setflagInitialIsEmpty] = useState(true);
  let linkIndex = 0;
  const [linkedInData, setLinkedInData] = useState({
    id: "",
    linkUrl: "",
    linkTitle: "linkedin",
    errorUrl: "",
    errorTitle: "",
  });
  const [linksData, setLinksData] = useState([]);
  const [newFinalArray, setNewFinalArray] = useState([]);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const [linkExistIndex, setLinkExistIndex] = useState(null);
  const [linkedInLinkInvalid, setLinkedInLinkInvalid] = useState(false);

  useEffect(() => {
    if (!props?.show) {
      setLinkExistIndex(null);
      setLinkedInLinkInvalid(false);
    }
  }, [props]);

  useEffect(() => {
    if (candidateDetails?.socialLinksResponses) {
      let initialCondition = candidateDetails?.socialLinksResponses.find(
        (element) => element.linkUrl !== ""
      );

      if (initialCondition) {
        setflagInitialIsEmpty(false);
      }
      for (let i = 0; i < candidateDetails?.socialLinksResponses.length; i++) {
        if (
          candidateDetails?.socialLinksResponses[i].linkTitle === "linkedin"
        ) {
          setLinkedInData(candidateDetails?.socialLinksResponses[i]);
        }
      }
      setLinksData(candidateDetails?.socialLinksResponses);
    }

    if (!candidateDetails?.socialLinksResponses) {
      let tempArr = [];
      for (let i = 0; i < 3; i++) {
        tempArr.push({
          id: "",
          linkUrl: "",
          linkTitle: "",
          errorUrl: "",
          errorTitle: "",
        });
      }
      setLinksData(tempArr);
    }
    if (candidateDetails?.socialLinksResponses?.length > 0) {
      let tempArr = [];
      for (let i = 0; i < candidateDetails?.socialLinksResponses?.length; i++) {
        if (
          candidateDetails?.socialLinksResponses[i].linkTitle !== "linkedin"
        ) {
          tempArr.push(candidateDetails?.socialLinksResponses[i]);
        }
      }
      setLinksData(tempArr);
    } else if (
      !candidateDetails?.socialLinksResponses &&
      props?.newCandidateDetails?.socialLinksResponses
    ) {
      let tempArr = [];
      for (
        let i = 0;
        i < props?.newCandidateDetails?.socialLinksResponses?.length;
        i++
      ) {
        if (
          props?.newCandidateDetails?.socialLinksResponses[i].linkTitle !==
          "linkedin"
        ) {
          if (props?.newCandidateDetails?.socialLinksResponses[i]?.linkTitle) {
            if (props?.newCandidateDetails?.socialLinksResponses[i]?.linkUrl) {
              tempArr.push(props?.newCandidateDetails?.socialLinksResponses[i]);
            } else {
              tempArr.push({
                id: "",
                linkUrl: "",
                linkTitle: "",
                errorUrl: "",
                errorTitle: "",
              });
            }
          } else {
            tempArr.push({
              id: "",
              linkUrl: "",
              linkTitle: "",
              errorUrl: "",
              errorTitle: "",
            });
          }
        }
        if (
          props?.newCandidateDetails?.socialLinksResponses[i].linkTitle ===
          "linkedin"
        ) {
          setLinkedInData(props?.newCandidateDetails?.socialLinksResponses[i]);
        }
      }
      setLinksData(tempArr);
    }
  }, [candidateDetails?.socialLinksResponses, props.show]);

  useEffect(() => {
    if (candidateDetails?.socialLinksResponses?.length < 3) {
      let tempArr = [];
      let iterator =
        candidateDetails?.socialLinksResponses?.length > 3
          ? candidateDetails?.socialLinksResponses?.length
          : 3;
      for (let i = 0; i < iterator; i++) {
        if (candidateDetails?.socialLinksResponses[i] !== undefined) {
          if (
            candidateDetails?.socialLinksResponses[i].linkTitle !== "linkedin"
          ) {
            tempArr.push(candidateDetails?.socialLinksResponses[i]);
          }
        } else {
          tempArr.push({
            id: "",
            linkUrl: "",
            linkTitle: "",
            errorUrl: "",
            errorTitle: "",
          });
        }
      }
      setLinksData(tempArr);
    }
  }, [linksData?.length < 3]);

  const handleLinksDataInputFirstChange = (id, target, value, key) => {
    removeErrorSpan(`linkTitle${key}`);
    let copyLinksData = [...linksData];
    copyLinksData[key].linkTitle = value;
    setLinksData(copyLinksData);
    // linksData[key].linkTitle = value;
  };

  const handleLinksDataInputSecondChange = (id, target, value, key) => {
    // if (!validation()) {
    removeErrorSpan(`linkUrl${key}`);

    removeErrorSpan(id);

    let copyLinksData = [...linksData];
    copyLinksData[key].linkUrl = value;
    setLinksData(copyLinksData);
  };

  const createErrorSpan = (field, message) => {
    removeErrorSpan(field);
    let elem = document.createElement("span");
    elem.innerHTML = message;
    elem.className = "error-span";
    elem.id = `error-${field}`;
    let div = document.getElementById(field);
    div.parentNode.insertBefore(elem, div.nextSibling);
  };

  const removeErrorSpan = (field) => {
    let elem = document.getElementById(`error-${field}`);
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };

  const validation = () => {
    let checkValueFlag = [];
    for (let i = 0; i < linksData.length; i++) {
      if (!isEmpty(linksData[i].linkTitle)) {
        if (isEmpty(linksData[i].linkUrl)) {
          createErrorSpan(`linkUrl${i}`, "Field is required");
          checkValueFlag.push(true);
        } else {
          removeErrorSpan(`linkUrl${i}`);

          var match = isURL(linksData[i].linkUrl);
          if (!match) {
            createErrorSpan(`linkUrl${i}`, "Link is not valid");
            checkValueFlag.push(true);
          }
        }
      } else {
        removeErrorSpan(`linkUrl${i}`);
      }
      if (!isEmpty(linksData[i].linkUrl)) {
        if (isEmpty(linksData[i].linkTitle)) {
          createErrorSpan(`linkTitle${i}`, "Field is required");
          checkValueFlag.push(true);
        } else {
          removeErrorSpan(`linkTitle${i}`);
        }
      } else {
        removeErrorSpan(`linkTitle${i}`);
      }
    }
    if (checkValueFlag.includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  const valueAlreadyExist = (finalArray, checkKey) => {
    for (let i = 0; i < finalArray?.length; i++) {
      for (let j = 1; j < finalArray?.length; j++) {
        if (
          finalArray[i]?.[checkKey] != "" &&
          finalArray[j]?.[checkKey] != "" &&
          i != j
        ) {
          if (finalArray[i]?.[checkKey] == finalArray[j]?.[checkKey]) {
            if (checkKey == "linkUrl") {
              setLinkExistIndex(j - 1);
            }
            return true;
          }
        }
      }
    }
    return false;
  };
  const onSaveClick = () => {
    let finalArr = [...linksData];
    if (isURL(linkedInData?.linkUrl)) {
      finalArr.unshift(linkedInData);
    } else {
      toaster("Error", "Link is not valid");
      setLinkedInLinkInvalid(true);
      setLinkedInData({
        id: "",
        linkUrl: "",
        linkTitle: "linkedin",
        errorUrl: "",
        errorTitle: "",
      });
      return;
    }

    const findLinkUrl = finalArr.find((element) => element.linkUrl !== "");
    if (!findLinkUrl && flagInitialIsEmpty) {
      if (flagInitialIsEmpty) {
        toaster("error", "At least one social media url is required");
        return;
      } else {
        setflagInitialIsEmpty(true);
      }
    }

    if (valueAlreadyExist(finalArr, "linkTitle")) {
      toaster("error", TITLE_ALREADY_EXIST);
      return;
    }

    if (valueAlreadyExist(finalArr, "linkUrl")) {
      toaster("error", LINK_ALREADY_EXIST);
      return;
    }
    if (!validation()) {
      if (props?.isApplyForJobComponent && !props?.isCheck) {
        let temp = [];
        temp = finalArr.map((finalObj, index) => {
          if (finalObj?.linkUrl.length > 0)
            return {
              id: finalObj.id,
              linkTitle: finalObj.linkTitle,
              linkUrl: finalObj.linkUrl,
            };
          else {
            return {
              id: finalObj.id,
              linkTitle: finalObj.linkTitle,
              linkUrl: finalObj.linkUrl,
            };
          }
        });
        props?.setNewCandidateDetails({
          ...props?.newCandidateDetails,
          socialLinksResponses: [...temp],
        });
        props?.setShow(false);
      } else {
        AddSocialMedia(finalArr)
          .then((res) => {
            setflagInitialIsEmpty(true);
            props.setShowLoader(false);
            if (res?.status === 200) {
              toaster("success", "Details Updated successfully!");
              if (props?.isApplyForJobComponent) {
                let temp = [];
                temp = finalArr.map((finalObj, index) => {
                  if (finalObj?.linkUrl.length > 0)
                    return {
                      id: new Date().valueOf() + index,
                      linkTitle: finalObj.linkTitle,
                      linkUrl: finalObj.linkUrl,
                    };
                  else {
                    return {
                      id: finalObj.id,
                      linkTitle: finalObj.linkTitle,
                      linkUrl: finalObj.linkUrl,
                    };
                  }
                });
                props?.setNewCandidateDetails({
                  ...props?.newCandidateDetails,
                  socialLinksResponses: [...temp],
                });
              }
            }
            const userId = getLocalStorage(USER_ID);
            if (userId) {
              saveCandidateDetails(userId);
            }
            props?.setShow(false);
          })
          .catch((err) => {
            setflagInitialIsEmpty(true);
            props.setShowLoader(false);
            toaster("error", err);
            props?.setShow(false);
          });
      }
    }
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
          // setSocialData(initialFormData?.current);
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
          if (props?.setHideMainModal) {
            props?.setHideMainModal(false);
          }
          setLinkedInData({
            id: "",
            linkUrl: "",
            linkTitle: "linkedin",
            errorUrl: "",
            errorTitle: "",
          });
        }}
        backdrop="static"
        fullscreen="lg-down"
        centered
        keyboard={false}
        className="lg-dialog-modal"
        scrollable={true}
      >
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">Social Media</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <label className="modalLabel" style={{ color: "#3E3E3E" }}>
            Linkedin
          </label>

          {props.isApplyForJobComponent ? (
            <>
              <input
                type="text"
                className={`form-control mb-3 linkedinInput fs-12 ${
                  linkedInLinkInvalid ? "error" : ""
                }`}
                // className="form-control mb-3 linkedinInput fs-12"
                name="linkedin"
                // placeholder="https://www.youtube.com/"
                defaultValue={
                  linkedInData?.linkUrl ? linkedInData?.linkUrl : ""
                }
                onChange={($event) => {
                  linkedInData.linkUrl = $event.target.value;
                  setLinkedInData(linkedInData);
                }}
              />
              <h6 style={{ color: "#1C1C1C" }}>Other Links</h6>
              <div style={{ fontSize: "14px", color: "#808080" }}>
                {" "}
                Add upto 3 other links to your professional profiles, portfolios
                etc
              </div>
              {linksData?.map((socialLink, index) => {
                linkIndex = index + 1;
                return (
                  <>
                    <div className="row mb-4">
                      <div className="col-5">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link {linkIndex} Title
                        </label>

                        <input
                          id={`linkTitle${index}`}
                          type="text"
                          className="form-control mb-1 linkInput fs-12"
                          name={`linkTitle${index}`}
                          // placeholder="Youtube"
                          defaultValue={socialLink?.linkTitle}
                          onChange={($event) => {
                            handleLinksDataInputFirstChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                      <div className="col-7">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link
                        </label>
                        <input
                          id={`linkUrl${index}`}
                          type="text"
                          className="form-control mb-1 fs-12"
                          name={`linkUrl${index}`}
                          defaultValue={socialLink?.linkUrl}
                          onChange={($event) => {
                            handleLinksDataInputSecondChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <>
              <input
                type="text"
                className={`form-control mb-3 linkedinInput fs-12 ${
                  linkedInLinkInvalid ? "error" : ""
                }`}
                name="linkedin"
                // placeholder=" https://careers.linkedin.com"
                defaultValue={
                  linkedInData?.linkUrl ? linkedInData?.linkUrl : ""
                }
                onChange={($event) => {
                  linkedInData.linkUrl = $event.target.value;
                  setLinkedInData(linkedInData);
                }}
              />
              <h6 style={{ color: "#1C1C1C" }}>Other Links</h6>
              <div
                className="mb-3"
                style={{ fontSize: "12px", color: "#808080" }}
              >
                {" "}
                Add upto 3 other links to your professional profiles, portfolios
                etc
              </div>
              {linksData?.map((socialLink, index) => {
                linkIndex = index + 1;
                return (
                  <>
                    <div className="row mb-4">
                      <div className="col-5">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link {linkIndex} Title
                        </label>

                        <input
                          id={`linkTitle${index}`}
                          type="text"
                          className="form-control mb-1 linkInput fs-12"
                          name={`linkTitle${index}`}
                          // placeholder=" https://careers.linkedin.com"
                          defaultValue={socialLink?.linkTitle}
                          onChange={($event) => {
                            handleLinksDataInputFirstChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                      <div className="col-7">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link
                        </label>
                        <input
                          id={`linkUrl${index}`}
                          type="text"
                          className={`${
                            index == linkExistIndex ? `error` : ""
                          } form-control mb-1 fs-12`}
                          name={`linkUrl${index}`}
                          // placeholder=" https://careers.linkedin.com"
                          defaultValue={socialLink?.linkUrl}
                          onChange={($event) => {
                            handleLinksDataInputSecondChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}

          {/* <input
            type="text"
            className="form-control mb-3 linkedinInput fs-12"
            name="linkedin"
                defaultValue={
                  linkedInData?.linkUrl ? linkedInData?.linkUrl : ""
                }
                onChange={($event) => {
                  linkedInData.linkUrl = $event.target.value;
                  setLinkedInData(linkedInData);
                }}
              />
              <h6 style={{ color: "#1C1C1C" }}>Other Links</h6>
              <div style={{ fontSize: "14px", color: "#808080" }}>
                {" "}
                Add upto 3 other links to your professional profiles, portfolios
                etc
              </div>
              {linksData?.map((socialLink, index) => {
                linkIndex = index + 1;
                return (
                  <>
                    <div className="row mb-4">
                      <div className="col-5">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link {linkIndex} Title
                        </label>

                        <input
                          id={`linkTitle${index}`}
                          type="text"
                          className="form-control mb-1 linkInput fs-12"
                          name={`linkTitle${index}`}
                          defaultValue={socialLink?.linkTitle}
                          onChange={($event) => {
                            handleLinksDataInputFirstChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                      <div className="col-7">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link
                        </label>
                        <input
                          id={`linkUrl${index}`}
                          type="text"
                          className="form-control mb-1 fs-12"
                          name={`linkUrl${index}`}
                          defaultValue={socialLink?.linkUrl}
                          onChange={($event) => {
                            handleLinksDataInputSecondChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <>
              <input
                type="text"
                className="form-control mb-3 linkedinInput fs-12"
                name="linkedin"
                defaultValue={
                  linkedInData?.linkUrl ? linkedInData?.linkUrl : ""
                }
                onChange={($event) => {
                  linkedInData.linkUrl = $event.target.value;
                  setLinkedInData(linkedInData);
                }}
              />
              <h6 style={{ color: "#1C1C1C" }}>Other Links</h6>
              <div style={{ fontSize: "14px", color: "#808080" }}>
                {" "}
                Add upto 3 other links to your professional profiles, portfolios
                etc
              </div>
              {linksData?.map((socialLink, index) => {
                linkIndex = index + 1;
                return (
                  <>
                    <div className="row mb-4">
                      <div className="col-5">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link {linkIndex} Title
                        </label>

                        <input
                          id={`linkTitle${index}`}
                          type="text"
                          className="form-control mb-1 linkInput fs-12"
                          name={`linkTitle${index}`}
                          defaultValue={socialLink?.linkTitle}
                          onChange={($event) => {
                            handleLinksDataInputFirstChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                      <div className="col-7">
                        <label
                          className="modalLabel"
                          style={{ color: "#3E3E3E" }}
                        >
                          Link
                        </label>
                        <input
                          id={`linkUrl${index}`}
                          type="text"
                          className="form-control mb-1 fs-12"
                          name={`linkUrl${index}`}
                          defaultValue={socialLink?.linkUrl}
                          onChange={($event) => {
                            handleLinksDataInputSecondChange(
                              socialLink?.id,
                              $event,
                              $event.target.value,
                              index
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}

          {/* <input
            type="text"
            className="form-control mb-3 linkedinInput fs-12"
            name="linkedin"
            defaultValue={linkedInData?.linkUrl ? linkedInData?.linkUrl : ""}
            onChange={($event) => {
              linkedInData.linkUrl = $event.target.value;
              setLinkedInData(linkedInData);
            }}
          />
          <h6 style={{ color: "#1C1C1C" }}>Other Links</h6>
          <div style={{ fontSize: "14px", color: "#808080" }}>
            {" "}
            Add upto 3 other links to your professional profiles, portfolios etc
          </div>
          {linksData?.map((socialLink, index) => {
            linkIndex = index + 1;
            return (
              <>
                <div className="row mb-4">
                  <div className="col-5">
                    <label className="modalLabel" style={{ color: "#3E3E3E" }}>
                      Link {linkIndex} Title
                    </label>

                    <input
                      id={`linkTitle${index}`}
                      type="text"
                      className="form-control mb-1 linkInput fs-12"
                      name={`linkTitle${index}`}
                      defaultValue={socialLink?.linkTitle}
                      onChange={($event) => {
                        handleLinksDataInputFirstChange(
                          socialLink?.id,
                          $event,
                          $event.target.value,
                          index
                        );
                      }}
                    />
                  </div>
                  <div className="col-7">
                    <label className="modalLabel" style={{ color: "#3E3E3E" }}>
                      Link
                    </label>
                    <input
                      id={`linkUrl${index}`}
                      type="text"
                      className="form-control mb-1 fs-12"
                      name={`linkUrl${index}`}
                      defaultValue={socialLink?.linkUrl}
                      onChange={($event) => {
                        handleLinksDataInputSecondChange(
                          socialLink?.id,
                          $event,
                          $event.target.value,
                          index
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            );
          })} */}
          {props.isApplyForJobComponent && token && (
            <div className="dialog-footer-checkbox">
              <label>
                <input
                  type="checkbox"
                  onChange={() => props.setIsCheck(!props.isCheck)}
                  defaultChecked={props.isCheck}
                  className="mt-2 me-2 pt-1 mb-3 "
                />
                Save this to profile
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            onClick={() => {
              props.setShow(false);
              // setSocialData(initialFormData?.current);
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
            }}
            className="btn btn-cancel"
          >
            Close
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              onSaveClick();
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SocialMediaDialog;
