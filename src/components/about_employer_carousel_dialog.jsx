import React from "react";
import { Carousel, Modal } from "react-bootstrap";
import closeImg from "../assests/icons/ic_closeroundbtn.svg";
import { imageOnError } from "../utils/utils";

function AboutEmployerCarouselDialog(props) {
  return (
    <div>
      <Modal
        animation={false}
        dialogClassName=""
        contentClassName=""
        bsPrefix="modal"
        show={props?.show}
        onHide={() => props?.setIsSeeMore(false)}
        aria-labelledby=""
        // scrollable={true}
        fullscreen={"md-down"}
        centered
      >
        <Modal.Body className="p-5">
          <div className="">
            <Carousel>
              {props?.jobDetails?.companyProfile?.potentialImagesUrl?.length >
                5 &&
                props?.jobDetails?.companyProfile?.potentialImagesUrl?.map(
                  (image, index) => {
                    return (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={`${process.env.REACT_APP_API_URL}${image.replace(
                            "/",
                            ""
                          )}`}
                          alt="First slide"
                          height="280px"
                          onError={(e) => imageOnError(e)}
                        />
                      </Carousel.Item>
                    );
                  }
                )}
            </Carousel>
            <div
              className="position-absolute top-0 end-0 pt-2 pe-2 pointer"
              onClick={() => props?.setIsSeeMore(false)}
            >
              <img src={closeImg} alt="close-btn" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AboutEmployerCarouselDialog;
