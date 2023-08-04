import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notificationIcon1 from "./../assests/icons/thumbnail-message-1.svg";
import notificationIcon2 from "./../assests/icons/thumbnail-message-2.svg";
import notificationIcon3 from "./../assests/icons/thumbnail-message-3.svg";
import notificationCloseIcon from "./../assests/icons/ic-close-24.svg";
import RefereeProfileEditDialog from "./referrals-preferences-edit/referrals-preferences-edit-dialog";
import { FAILED_TO_LOAD } from "../constants/keys";
import { convertToInternationalCurrencySystem } from "../utils/utils";
import { REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE } from "../constants/page-routes";

const ScreenNotification = ({
  isShowfirstPrompt,
  setIsShowfirstPrompt,
  isShowSecondPrompt,
  setIsShowSecondPrompt,
  isShowThirdPrompt,
  setIsShowThirdPrompt,
  isShowfourthPrompt,
  setIsShowfourthPrompt,
  referralEarnedObject,
}) => {
  const [isShowRefereeDialog, setIsShowRefereeDialog] = useState(false);

  const onClickAddRefereePreference = () => {
    setIsShowRefereeDialog(true);
  };

  // useEffect(() => {}, [
  //   isShowfirstPrompt,
  //   isShowSecondPrompt,
  //   isShowThirdPrompt,
  //   isShowfourthPrompt,
  // ]);

  return (
    <React.Fragment>
      {isShowfirstPrompt && (
        <div className="screen-notification warning">
          <div
            onClick={() => {
              setIsShowfirstPrompt(false);
            }}
            className="notification-close"
          >
            <button type="button">
              <img src={notificationCloseIcon} alt="" />
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="notification-icon">
              <img src={notificationIcon1} alt="" />
            </div>
            <div className="notification-text">
              <b>₹ 18,580 </b>is the average bonus a referee receives when a
              referral is converted.{" "}
              <Link
                to=""
                onClick={() => {
                  onClickAddRefereePreference();
                }}
              >
                Add your referral preferences and start referring.
              </Link>
            </div>
          </div>
        </div>
      )}
      {isShowSecondPrompt && (
        <div className="screen-notification warning">
          <div className="notification-close">
            <button
              type="button"
              onClick={() => {
                setIsShowSecondPrompt(false);
              }}
            >
              <img src={notificationCloseIcon} alt="" />
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="notification-icon">
              <img src={notificationIcon2} alt="" />
            </div>
            <div className="notification-text">
              Congrats on your first referral. See "{" "}
              <Link to={REFEREE_RECOMMENDED_JOBS_PAGE_ROUTE}>
                Refer these jobs
              </Link>
              " section to keep it going.
            </div>
          </div>
        </div>
      )}
      {isShowThirdPrompt && (
        <div className="screen-notification warning">
          <div className="notification-close">
            <button
              type="button"
              onClick={() => {
                setIsShowThirdPrompt(false);
              }}
            >
              <img src={notificationCloseIcon} alt="" />
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="notification-icon">
              <img src={notificationIcon3} alt="" />
            </div>
            <div className="notification-text">
              Fantastic! Your referral joined and you'll receive a bonus of
              {referralEarnedObject?.referralAmount
                ? ` ${convertToInternationalCurrencySystem(
                    referralEarnedObject?.referralAmount,
                    referralEarnedObject?.referalCurrency
                  )}`
                : FAILED_TO_LOAD}
              . Keep it going.
            </div>
          </div>
        </div>
      )}
      {isShowfourthPrompt && (
        <div className="screen-notification warning">
          <div className="notification-close">
            <button
              type="button"
              onClick={() => {
                setIsShowfourthPrompt(false);
              }}
            >
              <img src={notificationCloseIcon} alt="" />
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="notification-icon">
              <img src={notificationIcon1} alt="" />
            </div>
            <div className="notification-text">
              <b>₹ 18,580 </b>is the average bonus a referee receives when a
              referral is converted.{" "}
              <Link to="/candidate/recommended-jobs">
                See recommended jobs for you to refer
              </Link>
            </div>
          </div>
        </div>
      )}
      <RefereeProfileEditDialog
        show={isShowRefereeDialog}
        onDismissDialogClick={() => setIsShowRefereeDialog(false)}
        isShowFlow={true}
      />
    </React.Fragment>
  );
};
export default ScreenNotification;
