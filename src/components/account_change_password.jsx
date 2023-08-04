import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ChangePasswordPage from "../pages/change_password_page";
import ForgetPasswordPage from "../pages/forget_password_page";

const AccountChangePassword = (props) => {
  const [changePassword] = useState(true);
  return (
    <div>
      <Modal
        show={props.show}
        fullscreen
        onHide={() => props.onChangePasswordClick()}
        className="rounded-0 p-0 m-0"
      >
        <Modal.Header className="border-0 pt-0 mt-0"></Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-content-center pt-0 mt-0">
          <ChangePasswordPage
            changePassword={changePassword}
            onClickCloseDialog={() => props.onChangePasswordClick()}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AccountChangePassword;
