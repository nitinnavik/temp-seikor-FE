import React from "react";
import { Modal } from "react-bootstrap";

const PrivacyPolicyDialog = (props) => {
  return (
    <div>
      <Modal
        show={props.showPrivacy}
        size="lg"
        className="border-radius-16 dialog-wrapper lg-dialog-modal"
        onHide={() => {
          props.onClickHidePrivacy();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-24 fw-700 color-primary">
            Privacy Policy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <div className="color-primary">
            <div className="fs-16 fw-700">1 - Heading</div>
            <div className="fs-14 fw-600 pt-3">1.1 Subheading</div>
            <div className="fs-12 row gap-3 pt-3">
              <p>
                Today's business world is largely dependent on data and the
                information that is derived from that data.
              </p>
              <p>
                Data is critical for businesses that process that information to
                provide services and products to their customers. From a
                corporate context, in a company - from the top executive level
                right down to the operational level - just about everyone relies
                heavily on information.
              </p>
              <p>
                In a complex environment where so much depends on the data that
                businesses collect and process, protecting that information
                becomes increasingly important. Among the steps business owners
                take to protect the data of their users, drafting a clear and
                concise Privacy Policy agreement holds central importance.
              </p>
              <p>
                In this article, we will discuss the elements of a Privacy
                Policy to help you better understand the constructs of an
                effective Privacy Policy agreement that instills faith and trust
                in your customers and protects you from a number of liability
                issues.
              </p>
            </div>
            <div className="fs-14 fw-600 pt-3">1.2 Subheading</div>
            <div className="fs-12 row gap-3 pt-3">
              <p>
                Today's business world is largely dependent on data and the
                information that is derived from that data.
              </p>
              <p>
                Data is critical for businesses that process that information to
                provide services and products to their customers. From a
                corporate context, in a company - from the top executive level
                right down to the operational level - just about everyone relies
                heavily on information.
              </p>
              <p>
                In a complex environment where so much depends on the data that
                businesses collect and process, protecting that information
                becomes increasingly important. Among the steps business owners
                take to protect the data of their users, drafting a clear and
                concise Privacy Policy agreement holds central importance.
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PrivacyPolicyDialog;
