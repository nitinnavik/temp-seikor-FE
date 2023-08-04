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

const StaticHeader = ({ candidateDetails }) => {
  const BREAKPOINT_COLLAPSING_MENU = 1000;
  const BREAKPOINT_SHOWING_MOBILE_LOGO = 600;
  const { height, width } = useWindowDimensions();
  const location = useLocation();
 
  const dropDownRef = useRef();
  const notificationRef = useRef();


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
            // onClick={() => {
            //   setFullscreen(true);
            //   setShow(true);
            // }}
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
                  : "") + 
                  "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 href="https://site.seikor.com/index.html"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
                Home
              </a>
            </div>


            <div
              className={
                (location?.pathname === ALL_JOBS_PAGE_ROUTE ? "active " : "") +
                "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://uat.seikor.com/candidate/all-jobs"
                
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
               Explore Jobs
              </a>
              
            </div>
            <div
              className={
                // (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                //   ? "active "
                //   : "") +
                  "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://site.seikor.com/for_employers.html"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
              For Employers
              </a>
            </div>

            <div
              className={
                // (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                //   ? "active "
                //   : "") + 
                  "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://blogs.seikor.com"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
              Blogs
              </a>
            </div>


            <div
              className={
                // (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                //   ? "active "
                //   : "") + 
                  "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://site.seikor.com/about.html"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
              About
              </a>
            </div>

            <div
              className={
                // (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                //   ? "active "
                //   : "") + 
                  "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://uat.seikor.com/login"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
              Log In / Register
              </a>
            </div>

            {/* <a href="reffer_jobs.html" class="btn-primary">Refer Jobs & Earn</a></li>         
    </ul> */}

<div
              className={
                // (location?.pathname === RECOMMENDED_JOBS_PAGE_ROUTE
                //   ? "active "
                //   : "") +
                   "d-flex align-items-center nav-menu-holder"
              }
            >
              <a
                className="nav-menu-link"
                 aria-current="page"
                 
                 href="https://site.seikor.com/reffer_jobs.html"
                //  to={CANDIDATE_MY_VIEW_PAGE_ROUTE}
              >
              Refer Jobs & Earn
              </a>
            </div>
          </div>

          
         

          </div>
          
          
        {/* </div> */}
      </div>
    </nav>
  );
};
export default StaticHeader;
