import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import mobileLogo from "../../assests/ic_seikor.svg";
import logo from "../../assests/ic_seikorfull.svg";
import logo2 from "../../assests/ic_skrcolor.svg";
import icHumburger from "../../assests/ic_humburger.svg";
import icNotifications from "../../assests/ic_notifications.svg";
import icChevronDown from "../../assests/ic_chevron_down24.svg";
import useWindowDimensions from "../../utils/use_window_dimension";
import icChevronRight from "../../assests/icons/ic_chevron_right16.svg";
import Modal from "react-bootstrap/Modal";
import HeaderDropDown from "./header_drop_down";
import MobileViewModal from "./mobile_view_modal";
import {
  ALL_JOBS_PAGE_ROUTE,
  CANDIDATE_MY_VIEW_PAGE_ROUTE,
  RECOMMENDED_JOBS_PAGE_ROUTE,
} from "../../constants/page-routes";
import Notifications from "../notifications_dropdown";
import NotificationsDropdown from "../notifications_dropdown";
import { useStoreState } from "easy-peasy";
import ProfileImage from "./../profile_image";
import { downloadFile, getNotifications } from "../../_services/view.service";
import { isEmpty } from "../../utils/form_validators";
import toaster from "../../utils/toaster";
import { NOTIFICATION_REFRESH_INTERVAL_IN_MINUTES } from "../../constants/config";
import { NOTIFICATIONS_UPDATE_MESSAGE } from "../../constants/message";
import { getSessionStorage, setSessionStorage } from "../../utils/storage";
import { PREV_NOTIFICATION_COUNT } from "../../constants/keys";
import RefereeProfileEditDialog from "../referrals-preferences-edit/referrals-preferences-edit-dialog";

const Header = ({ candidateDetails }) => {
  const BREAKPOINT_COLLAPSING_MENU = 1000;
  const BREAKPOINT_SHOWING_MOBILE_LOGO = 600;
  const { height, width } = useWindowDimensions();
  const [showDropDown, setShowDropDown] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [profileSrc, setProfileSrc] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notification, setNotification] = useState();
  const [jobMessage, setJobMessage] = useState();
  const location = useLocation();
  const [showRefereePreferencesDialog, setShowRefereePreferencesDialog] =
    useState(false);

  const dropDownRef = useRef();
  const notificationRef = useRef();

  const notificationHandler = () => {
    setShowNotification(!showNotification);
  };

  const profileDropdownHandler = () => {
    setShowDropDown(!showDropDown);
  };

  const downloadPicture = async (downloadedUrl) => {
    downloadFile(downloadedUrl).then((res) => {
      if (res) {
        setProfileSrc(res);
      } else {
        setProfileSrc(null);
      }
    });
  };

  let pageSize = 10;

  // notification api call
  const fetchNotification = (pageNo, pageSize) => {
    getNotifications(pageNo, pageSize).then(
      (res) => {
        if (!isEmpty(res) && res?.status === 200) {
          setNotification(res?.data?.data);
          setNotificationCount(res?.data?.newRecordCount);
          const previousNotificationCount = getSessionStorage(
            PREV_NOTIFICATION_COUNT
          );
          if (previousNotificationCount < res?.data?.totalRecord) {
            toaster("success", NOTIFICATIONS_UPDATE_MESSAGE);
          }
          setSessionStorage(PREV_NOTIFICATION_COUNT, res?.data?.totalRecord);
        } else {
          setNotification([]);
          setJobMessage(res?.data?.message);
        }
      },
      (error) => {
        toaster("error", error);
      }
    );
  };

  useEffect(() => {
    fetchNotification(1, pageSize);

    const interval = setInterval(() => {
      fetchNotification(1, pageSize);
    }, NOTIFICATION_REFRESH_INTERVAL_IN_MINUTES * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (candidateDetails?.basicDetailsResponse) {
      downloadPicture(
        candidateDetails?.basicDetailsResponse?.profilePicDownloadURL
      );
    }
    let candidateName = candidateDetails?.userRegistrationDetails?.name;
    let candidateInitials =
      candidateName?.split(" ")[0]?.charAt(0)?.toUpperCase() +
      candidateName?.split(" ")[1]?.charAt(0)?.toUpperCase();
    setUserInitials(candidateInitials);
  }, [candidateDetails]);

  return (
    <nav className="navbar navbar-expand-lg header-container p-0">
      <div className="container py-0">
        <div className="d-flex pointer my-2">
          <img
            src={icHumburger}
            alt=""
            className={
              width >= BREAKPOINT_COLLAPSING_MENU
                ? "d-none"
                : "d-block me-2 pointer"
            }
            onClick={() => {
              setFullscreen(true);
              setShow(true);
            }}
          />
          <Link className="navbar-brand" to="/">
            <img
              style={{ height: "25px" }}
              src={width < BREAKPOINT_SHOWING_MOBILE_LOGO ? logo2 : logo2}
              alt=""
            />
          </Link>
        </div>
        <div className="d-flex align-items-center">
          {/* Navbar */}
          <div
            className={
              width >= BREAKPOINT_COLLAPSING_MENU
                ? "d-flex align-items-stretch"
                : "d-none"
            }
          >
            <div
              className={
                (location?.pathname == CANDIDATE_MY_VIEW_PAGE_ROUTE
                  ? "active "
                  : "") + "d-flex align-items-center nav-menu-holder"
              }
            >
              <Link
                className="nav-menu-link"
                aria-current="page"
                to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
                My View
              </Link>
            </div>
            <div
              className={
                (location?.pathname === ALL_JOBS_PAGE_ROUTE ? "active " : "") +
                "d-flex align-items-center nav-menu-holder"
              }
            >
              <Link className="nav-menu-link" to={ALL_JOBS_PAGE_ROUTE}>
                All Jobs
              </Link>
            </div>
            <div
              className={
                (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                  ? "active "
                  : "") + "d-flex align-items-center nav-menu-holder"
              }
            >
              <Link className="nav-menu-link" to={RECOMMENDED_JOBS_PAGE_ROUTE}>
                Recommended Jobs
              </Link>
            </div>
          </div>
          {/* Notification Icon */}
          <div className="d-flex align-items-center me-3" ref={notificationRef}>
            <div
              className="notification-button position-relative"
              data-bs-toggle="notification"
              role="button"
              aria-expanded="false"
              aria-controls="notification"
            >
              <div
                className="d-flex position-relative"
                onClick={() => {
                  notificationHandler();
                }}
              >
                <img src={icNotifications} alt="" />
                <div
                  className={
                    notificationCount > 0
                      ? "count-badge d-flex justify-content-center align-items-center d-block"
                      : "d-none count-badge "
                  }
                >
                  {notificationCount}
                </div>
              </div>

              <NotificationsDropdown
                show={showNotification}
                onNotoficationDropdownClose={() => setShowNotification(false)}
                notification={notification}
                notificationUpdate={setNotification}
                onNotificationRefreshNeeded={() => fetchNotification()}
                parentRef={notificationRef}
              />
            </div>
          </div>

          {/* Username and dropdown */}
          <div className="position-relative" ref={dropDownRef}>
            <div
              onClick={() => profileDropdownHandler()}
              className="d-flex align-items-center border rounded p-1 gap-1 pointer"
            >
              {/* <img className="profile-pic me-1" src={userInitials} alt="" /> */}
              <div className="defaultProfileDiv profile-pic">
                <ProfileImage
                  src={profileSrc}
                  name={candidateDetails?.userRegistrationDetails?.name}
                  initialsContainerClass="initialsStyle2"
                />
              </div>
              <div
                style={{ maxWidth: "150px", maxHeight: "21px" }}
                className="text-capitalize d-none d-sm-block user-select-none header-ellipse-1"
              >
                {candidateDetails?.userRegistrationDetails?.name}
              </div>
              <div>
                <img className="pointer mx-1" src={icChevronDown} alt="" />
              </div>
            </div>

            {showDropDown && (
              <HeaderDropDown
                show={showDropDown}
                onProfileDropdownClose={() => setShowDropDown(false)}
                setShowRefereePreferencesDialog={
                  setShowRefereePreferencesDialog
                }
                parentRef={dropDownRef}
              />
            )}

            <MobileViewModal
              show={show}
              setShow={setShow}
              fullscreen={fullscreen}
            />
          </div>
        </div>
      </div>
      <RefereeProfileEditDialog
        show={showRefereePreferencesDialog}
        onDismissDialogClick={() => setShowRefereePreferencesDialog(false)}
        isShowFlow={true}
      />
    </nav>
  );
};
export default Header;
