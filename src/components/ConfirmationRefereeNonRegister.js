import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { LOGIN, REGISTRATION } from "../constants/keys";
import { useNavigate } from "react-router";

const ConfirmationRefereeNonRegister = ({ show, onHide, title }) => {
  const navigate = useNavigate();
  console.log(show, onHide, title);
  return (
    <Modal
      show={show}
      backdrop="static"
      // fullscreen="lg-down"
      keyboard={false}
      centered
      onHide={() => {
        onHide(false);
      }}
    >
      <Modal.Header
        closeButton
        className="dialog-header"
        style={{ marginBottom: 40 }}
      >
        <Modal.Title className="dialog-title">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Footer className="dialog-footer justify-content-between">
        <button
          // style={{ border: "1px solid black" }}
          className="btn btn-cancel"
          onClick={() => {
            onHide(false);
            navigate(`/${REGISTRATION}`);
          }}
        >
          Register
        </button>
        <button
          className="btn btn-dark btn-save"
          onClick={() => {
            onHide(false);
            navigate(`/${LOGIN}`);
          }}
        >
          Log in
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationRefereeNonRegister;
