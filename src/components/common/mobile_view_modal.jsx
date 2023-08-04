import icChevronRight from "../../assests/icons/ic_chevron_right16.svg";
import Modal from "react-bootstrap/Modal";
import logo from "../../assests/ic_seikorfull.svg";
import logo2 from "../../assests/ic_skrcolor.svg";

import { Link } from "react-router-dom";
const MobileViewModal = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        centered
        fullscreen="xl-down"
        onHide={() => props.setShow(false)}
        className="rounded-0 d-xl-none d-block"
      >
        <Modal.Header closeButton>
          {" "}
          <img style={{ height: "25px" }} src={logo2} alt="logo" />
        </Modal.Header>
        <div className="container-fluid ">
          <div className="row">
            <Link
              to="/candidate"
              className="col-12 sidebarPadding text-decoration-none"
              onClick={() => props.setShow(false)}
            >
              <div className=" color-primary">My View</div>
              <img className="sidebarImage" src={icChevronRight} alt="" />
            </Link>
            <Link
              to="/candidate/all-jobs"
              className="col-12 sidebarPadding text-decoration-none"
              onClick={() => props.setShow(false)}
            >
              <div className="color-primary">All Jobs</div>
              <img className="sidebarImage" src={icChevronRight} alt="" />
            </Link>
            <Link
              to="/candidate/recommended-jobs"
              className="col-12 sidebarPadding text-decoration-none"
              onClick={() => props.setShow(false)}
            >
              <div className="color-primary">Recommended Jobs</div>
              <img className="sidebarImage" src={icChevronRight} alt="" />
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MobileViewModal;
