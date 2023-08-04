import React, { useEffect, useRef, useState } from "react";
import icRetract from "./../assests/icons/ic_retract.svg";
import icCloseBtnSmall from "./../assests/icons/ic_closebtnsmall.svg";
import icPinkDot from "./../assests/icons/ic_pink_dot.svg";
import Dropdown from "react-bootstrap/Dropdown";
import toaster from "../utils/toaster";
import {
  getClearNotifications,
  getReadNotifications,
} from "../_services/view.service";
import {
  GENERAL_ERROR_MESSAGE,
  NOTIFICATION_EMPTY_MESSAGE,
} from "../constants/message";
import icDeleteIcon from "../assests/icons/ic_delete_gray.svg";

import { isEmpty } from "../utils/form_validators";
import Loader from "./common/loader";
import { NOTIFICATION_TYPE } from "../constants/keys";
import {
  CANDIDATE_MY_VIEW_PAGE_ROUTE,
  JOB_DETAILS_PAGE_REFEREE_ROUTE,
  JOB_DETAILS_PAGE_ROUTE,
  VIEW_FEEDBACK_FORM,
  VIEW_REFERRAL,
} from "../constants/page-routes";
import { useNavigate } from "react-router";

const NotificationsDropdown = (props) => {
  const [notificationId, setNotificationId] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [notifications, setNotifications] = useState([props?.notification]);

  let navigate = useNavigate();

  useEffect(() => {
    let notificationsId = props?.notification?.map((data, index) => {
      return data?.notificationId;
    });

    setNotificationId(notificationsId);
  }, [props]);

  const readNotificationHandler = (id) => {
    setShowLoader(true);
    getReadNotifications(id).then(
      (res) => {
        setShowLoader(true);
        if (!isEmpty(res) && res?.status === "SUCCESS") {
          setShowLoader(false);
        } else {
          setNotifications([]);

          setErrorMessage(res?.message);
          setShowLoader(false);
        }
        props.onNotificationRefreshNeeded();
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };

  const clearNotificationHandler = (id) => {
    setShowLoader(true);
    getClearNotifications(id).then(
      (res) => {
        setShowLoader(true);
        if (!isEmpty(res) && res?.status === 200) {
          setShowLoader(false);
        } else {
          setNotifications([]);
          setErrorMessage(
            res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
          );
          setShowLoader(false);
        }
        props.onNotificationRefreshNeeded();
      },
      (error) => {
        toaster("error", error);
        setShowLoader(false);
      }
    );
  };

  // useEffect(() => {
  //   props.onNotificationRefreshNeeded();
  // }, [notifications]);

  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        props.show &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !props?.parentRef?.current?.contains(e?.target)
      ) {
        props.onNotoficationDropdownClose();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [props.show]);

  const redirectToPage = (type, additionalData) => {
    console.log(type, additionalData);
    if (type == NOTIFICATION_TYPE?.FEEDBACK) {
      navigate(
        `${CANDIDATE_MY_VIEW_PAGE_ROUTE}${VIEW_FEEDBACK_FORM}/${additionalData?.id}`
      );
    } else if (type == NOTIFICATION_TYPE?.ADD_REFEREE_RECOMMENDATION) {
      navigate(
        `${CANDIDATE_MY_VIEW_PAGE_ROUTE}${VIEW_REFERRAL}/${additionalData?.id}`
      );
    } else if (type == NOTIFICATION_TYPE?.VIEW_JOB_BUSINESS) {
      navigate(
        `/${JOB_DETAILS_PAGE_ROUTE}/${additionalData?.id}${JOB_DETAILS_PAGE_REFEREE_ROUTE}`
      );
    } else if (
      type == NOTIFICATION_TYPE?.VIEW_JOB_CANDIDATE ||
      type == NOTIFICATION_TYPE?.VIEW_JOB_CANDIDATE_2
    ) {
      navigate(`/${JOB_DETAILS_PAGE_ROUTE}/${additionalData?.id}`);
    }
  };

  return (
    <div>
      {showLoader && <Loader />}
      <div
        className={props.show ? "bg-white notification-box d-block" : "d-none"}
        ref={ref}
      >
        <div className="container">
          <div className="d-flex justify-content-between p-2 pt-3">
            <div className="fw-600 fs-16 text-black">Notifications </div>
            <div className="d-flex gap-4">
              <Dropdown className="p-0 m-0 notification-dropdown" align="end">
                {props.notification?.length > 0 ? (
                  <Dropdown.Toggle
                    variant="none"
                    id="dropdown-basic"
                    className="p-0 m-0 border-0 bg-transparent text-end"
                    style={{ width: "100px" }}
                  >
                    <img
                      src={icRetract}
                      alt="menu-icon"
                      className="sortbtn-background"
                    />
                  </Dropdown.Toggle>
                ) : (
                  <div style={{ width: "100px" }}></div>
                )}

                <Dropdown.Menu className="fs-12 text-secondary mt-2 notification-sort-dropdown ">
                  <Dropdown.Item
                    className="fs-12 fw-400 color-primary pe-5"
                    onClick={() => {
                      readNotificationHandler(notificationId);
                    }}
                  >
                    Mark all as read
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="fs-12 fw-400 dark-pink-text pe-5"
                    onClick={() => {
                      clearNotificationHandler([]);
                    }}
                  >
                    Clear all
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div
                onClick={() => {
                  props.onNotoficationDropdownClose();
                }}
              >
                <img src={icCloseBtnSmall} alt="close-icon" />
              </div>
            </div>
          </div>
        </div>
        <hr className="m-0"></hr>
        {props.notification?.length === 0 ? (
          <div className="p-3 pt-4">
            {errorMessage ? errorMessage : NOTIFICATION_EMPTY_MESSAGE}
          </div>
        ) : (
          <div className="notification-height">
            {props.notification?.length > 0 &&
              props.notification?.map((notification, index) => {
                return (
                  <>
                    {notification?.notificationContent !== null ? (
                      <div
                        key={index}
                        className={
                          notification?.viewFlag === true
                            ? " notification-hide "
                            : ""
                        }
                      >
                        <div className="px-2 border-end py-4 d-flex justify-content-between">
                          <div
                            className="d-flex gap-3"
                            onClick={() => {
                              readNotificationHandler([
                                notification?.notificationId,
                              ]);
                              redirectToPage(
                                notification?.redirectType,
                                notification?.relatedData
                              );
                            }}
                          >
                            <div className="text-center ps-2">
                              {notification?.viewFlag === true ? (
                                ""
                              ) : (
                                <img
                                  src={icPinkDot}
                                  alt="pinkdot-icon"
                                  height="6px"
                                />
                              )}
                            </div>
                            <div>
                              <div
                                className={
                                  notification?.viewFlag === true
                                    ? "inactive fs-12"
                                    : "small-text-dark-gray fw-400"
                                }
                              >
                                {notification?.notificationContent}
                              </div>
                              <div className="fs-12 small-text-medium-gray">
                                {" "}
                                {notification?.notificationDate}
                              </div>
                            </div>
                          </div>
                          <div className="pt-0 top-0 ps-2 pe-2">
                            <img
                              src={icDeleteIcon}
                              alt="delete-icon"
                              onClick={() => {
                                clearNotificationHandler([
                                  notification?.notificationId,
                                ]);
                              }}
                            />
                          </div>
                        </div>
                        <hr className="m-0"></hr>
                      </div>
                    ) : null}
                  </>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
