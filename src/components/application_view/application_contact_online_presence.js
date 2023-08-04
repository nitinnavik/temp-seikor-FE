import React from "react";
import icMail from "../../assests/icons/mail_icon.svg";
import icMailLogo from "../../assests/icons/ic_mail.svg";
import icPhone from "../../assests/icons/ic_phone.svg";
import icLocation from "../../assests/icons/ic_location12.svg";
import icLinkedin from "../../assests/icons/ic_linkedin.svg";
import icAttachment from "../../assests/icons/ic_attachment.svg";
import { isEmpty } from "../../utils/form_validators";
import { LINKEDIN_APPLICATION_EMPTY_MESSAGE } from "../../constants/message";

const ApplicationContactOnlinePresence = ({
  contactAndOnlinePresenceDetails,
}) => {
  return (
    <div className="mt-5">
      <div className="fw-bold fs-24 d-flex gap-2">
        <img src={icMail} alt="icon" />
        <span> Contact and Online Presence </span>
      </div>
      {contactAndOnlinePresenceDetails?.email && (
        <div className="mt-4 box-shadow border-radius p-3">
          <div className="fs-14 color-primary fw-600 d-flex gap-2">
            <img src={icMailLogo} alt="@svg" />
            <span>Email</span>
          </div>
          <div className="color-tertiary fw-400 fs-14 mt-2">
            {contactAndOnlinePresenceDetails?.email}
          </div>
        </div>
      )}

      {contactAndOnlinePresenceDetails?.mobile && (
        <div className="flex-1 box-shadow border-radius p-3 mt-3">
          <div className="fs-14 color-primary fw-600 d-flex gap-2 ">
            <img src={icPhone} alt="phone-icon" />
            <span>Phone</span>
          </div>
          <div className="color-tertiary fw-400 fs-14 mt-2">
            {contactAndOnlinePresenceDetails?.mobile}
          </div>
        </div>
      )}
      {contactAndOnlinePresenceDetails?.currentLocation && (
        <div className="flex-1 box-shadow border-radius p-3 mt-3">
          <div className="fs-14 color-primary fw-600 d-flex gap-2">
            <img src={icLocation} alt="phone-icon" />
            <span>Current Location</span>
          </div>
          <div className="color-tertiary fw-400 fs-14 mt-2">
            {contactAndOnlinePresenceDetails?.currentLocation}
          </div>
        </div>
      )}

      {/* Linkedin box */}
      {contactAndOnlinePresenceDetails?.socialLink?.length === 0 ? (
        <div>
          <div className="dark-pink-text fs-14">
            {LINKEDIN_APPLICATION_EMPTY_MESSAGE}
          </div>
        </div>
      ) : (
        <>
          {!isEmpty(contactAndOnlinePresenceDetails?.socialLink) && (
            <div className="box-shadow border-radius mt-3 pb-3 pl-3 pr-3 gap-2 pt-3 ">
              {contactAndOnlinePresenceDetails?.socialLink &&
                contactAndOnlinePresenceDetails?.socialLink?.map(
                  (link, index) => {
                    return (
                      <>
                        {!isEmpty(link?.linkUrl) && (
                          <>
                            <div className="d-flex" key={index}>
                              <div className="">
                                <img
                                  src={icLinkedin}
                                  alt="linkedin-icon"
                                  className="ps-4 p-1"
                                />
                              </div>
                              <div className="">
                                <div className="ps-2">
                                  <div className="fs-16 fw-600 color-primary">
                                    {" "}
                                    {link?.linkTitle}{" "}
                                  </div>
                                  <div className="fs-14 color-tertiary fw-400 text-break pe-3">
                                    {link?.linkUrl}{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index !==
                              contactAndOnlinePresenceDetails?.socialLink
                                ?.length -
                                1 && <hr className="mx-4"></hr>}
                          </>
                        )}
                      </>
                    );
                  }
                )}
            </div>
          )}
        </>
      )}
      {/* <div className="d-flex gap-2 ">
          <div className="col-1">
            <img src={icAttachment} alt="linkedin-icon" className="ps-4 p-1" />
          </div>
          <div className="col-11">
            <div className="fs-16 fw-600 color-primary"> My Stack Profile </div>
            <div className="fs-14 color-tertiary fw-400">
              behance.net/user849y92
            </div>
          </div>
        </div>
        <hr className="ms-4 me-4"></hr>
        <div className="d-flex gap-2 ">
          <div className="col-1">
            <img src={icAttachment} alt="linkedin-icon" className="ps-4 p-1" />
          </div>
          <div className="col-11">
            <div className="fs-16 fw-600 color-primary"> My Stack Profile </div>
            <div className="fs-14 color-tertiary fw-400">
              behance.net/user849y92
            </div>
          </div>
        </div>
        <hr className="ms-4 me-4"></hr>
        <div className="d-flex gap-2 ">
          <div className="col-1">
            <img src={icAttachment} alt="linkedin-icon" className="ps-4 p-1" />
          </div>
          <div className="col-11">
            <div className="fs-16 fw-600 color-primary"> My Stack Profile </div>
            <div className="fs-14 color-tertiary fw-400">
              behance.net/user849y92
            </div>
          </div>
        </div> */}
    </div>
  );
};

export default ApplicationContactOnlinePresence;
