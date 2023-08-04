import React from "react";
import icLock from "./../../../assests/icons/ic_lock.svg";
import icPasswordDot from "../../../assests/icons/ic_password_dots.svg";
import AccountChangePassword from "../../../components/account_change_password";
import { useState } from "react";

const AccountPage = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  return (
    <div className="mt-4">
      <div className="d-flex gap-3">
        <div className="mt-1">
          <img src={icLock} alt="account-icon" />
        </div>
        <div>
          <div className="color-primary fs-24 fw-700">Account</div>
          <div className="mt-4">
            <div className="color-tertiary fs-12"> Password </div>
            <div className="d-flex">
              <div className="d-flex p-2 ps-0 gap-1">
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
                <img src={icPasswordDot} alt="hidden password" />
              </div>
              <div className="ps-5 fs-12 color-primary-blue text-decoration-underline pointer">
                <div onClick={() => setPasswordShow(true)}>
                  Change password{" "}
                </div>
                <AccountChangePassword
                  show={passwordShow}
                  onChangePasswordClick={() => setPasswordShow(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
