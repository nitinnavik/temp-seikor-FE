import React from "react";
import close from "./../../assests/icons/ic-close-24.svg";
import logo from "../../assests/ic_seikorfull.svg";
import logo2 from "../../assests/ic_skrcolor.svg";
import { Link } from "react-router-dom";

const HeaderTwo = ({
  preferencesWelcome,
  onDismissDialogClick,
  onClickCloseDialog,
}) => {
  return (
    <header className="w-100">
      <div className="container w-100">
        <div className="d-flex justify-content-between pt-4 pb-2">
          <span className=" ms-4">
            <img style={{ height: "25px" }} src={logo2} alt="logo" />
          </span>

          {preferencesWelcome ? (
            <div className="pointer rounded-circle border-2 p-2 text-black pt-1 pb-1 forgot-round end-0 me-4">
              {" "}
              <img
                src={close}
                onClick={() => onDismissDialogClick()}
                alt="close-icon"
              />
            </div>
          ) : (
            <div
              className={
                onClickCloseDialog
                  ? "d-none"
                  : "pointer rounded-circle border-2 p-2 text-black pt-1 pb-1 forgot-round end-0 me-4 d-block"
              }
            >
              <Link to="/login">
                <img src={close} alt="close-icon" />
              </Link>
            </div>
          )}
          {onClickCloseDialog ? (
            <div className="pointer rounded-circle border-2 p-2 text-black pt-1 pb-1 forgot-round end-0 me-md-5 d-block">
              <img
                src={close}
                alt="close-icon"
                onClick={() => onClickCloseDialog()}
              />
            </div>
          ) : null}
        </div>
      </div>
      <hr></hr>
    </header>
  );
};

export default HeaderTwo;
