/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Modal from "react-bootstrap/Modal";
import icClose from "../assests/icons/ic-close-24.svg";
import { fetchMessage, sendMessage } from "../_services/job.service";
import toaster from "./../utils/toaster";
import { useEffect } from "react";
import { useState } from "react";
import {
  EMPTY_MESSEGE_BOX,
  SUCCESSFULLY_MESSAGE_SENT,
} from "../constants/message";
import { downloadFile } from "../_services/view.service";
import { useStoreState } from "easy-peasy";
import ProfileImage from "./profile_image";

const ViewMessagesDialog = (props) => {
  const candidateDetails = useStoreState(
    (state) => state?.candidate?.candidateDetails
  );
  let referrerName = candidateDetails?.basicDetailsResponse?.name;
  let [inputText, setInputText] = useState("");
  const [referrerSrc, setReferrerSrc] = useState(null);
  const [recruiterSrc, setRecruiterSrc] = useState(null);
  const [filter, setFilter] = useState({
    pageNo: 1,
    pageSize: 200,
  });
  // const dummyData = [
  //   {
  //     senderProfilePic: "/api/core/download/PROFILE/26871_1669879708716.jpg",
  //     receiverProfilePic: null,
  //     senderName: "Mayur Auti",
  //     receiverName: null,
  //     message: "hey i am recruter",
  //     messageDate: "08-Dec-2022 13:27:10",
  //     recruiter: true,
  //   },
  //   {
  //     senderProfilePic: "/api/core/download/PROFILE/21022_1670498639630.png",
  //     receiverProfilePic: "/api/core/download/PROFILE/26871_1669879708716.jpg",
  //     senderName: "rinku dhore",
  //     receiverName: "Mayur Auti",
  //     message: "hey i am sender",
  //     messageDate: "08-Dec-2022 13:27:06",
  //     recruiter: false,
  //   },
  // ];

  const [senderMessages, setSenderMessages] = useState([]);
  const fetchAllMessages = () => {
    // let jobId = "12102";
    // let jobReffaralId = "13511";
    let jobId, jobReffaralId;
    if (props?.refereeReferrals?.length > 0) {
      jobId = props?.refereeReferrals[0].jobId;
      jobReffaralId = props?.refereeReferrals[0].referrerId;
    }
    fetchMessage(filter.pageNo, filter.pageSize, jobId, jobReffaralId).then(
      (res) => {
        let msgData = res?.data?.reverse();
        setSenderMessages(msgData);
        props?.setMessageCount(res?.totalRecord);
        if (res?.data.length > 0) {
          downloadPicture(
            res?.data[0]?.senderProfilePic,
            res?.data[0]?.receiverProfilePic
          );
        }
      },
      (error) => {
        toaster("error", error);
      }
    );
  };
  const downloadPicture = async (sender, receiver) => {
    downloadFile(sender).then((res) => {
      if (res) {
        setReferrerSrc(res);
      }
    });
    downloadFile(receiver).then((res) => {
      if (res) {
        setRecruiterSrc(res);
      }
    });
  };

  useEffect(() => {
      fetchAllMessages();
  }, [props?.refereeReferrals]);

  useEffect(() => {
    fetchAllMessages(filter);
  }, [senderMessages.length < 0]);

  const handleSendBtn = () => {
    let jobId = props?.refereeReferrals[0].jobId;
    let jobReffaralId = props?.refereeReferrals[0].referrerId;
    sendMessage(jobId, inputText, jobReffaralId)
      .then((res) => {
        // toaster("success", SUCCESSFULLY_MESSAGE_SENT);
        setInputText("");
        fetchAllMessages();
      })
      .catch((err) => {
        toaster("Error", err);
      });
  };

  return (
    <div>
      <Modal
        show={props.showViewMessages}
        onHide={() => props.onClickMessagesDismiss()}
        aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        fullscreen="lg-down"
        scrollable={true}
        className="lg-dialog-modal"
      >
        <Modal.Header className="mb-2 border-end m-0 p-1 w-100 ">
          <div className="d-flex justify-content-between w-100">
            <div className="p-4 pb-1">
              <div className="large-text-dark">Message to recruiter</div>
              <div className="small-text-medium-gray">
                Send a message to the recruiter
              </div>
            </div>
            <div className="pt-0 mt-0">
              <img
                src={icClose}
                alt="close-icon"
                className="pointer rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-2 mt-2"
                onClick={() => props.onClickMessagesDismiss()}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4 pt-0">
            {/* <div className="d-flex justify-content-center">
              <div className="date-show"> 21 July</div>
            </div> */}
            <div>
              {senderMessages?.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center font-medium-gray fw-600">
                  {EMPTY_MESSEGE_BOX}
                </div>
              ) : (
                <>
                  {senderMessages?.map((sms, index) => {
                    return (
                      <div key={index} className="w-100">
                        {sms?.recruiter=== true ? (
                          <div className="d-flex gap-2 pt-1 pb-2 left-data align-items-center">
                            <ProfileImage
                              // src={recruiterSrc}
                              src={referrerSrc}
                              name={sms.senderName}
                              width="40px"
                              height="40px"
                              initialsContainerClass="rounded-circle"
                            />
                            <div>
                              <div>{sms?.message}</div>
                              <div className="small-text-gray">
                                {sms?.messageDate}
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {sms?.recruiter=== false ? (
                          <div className="d-flex gap-2 pt-1 pb-2 justify-content-end right-data align-items-center">
                            <div>
                              <div>{sms?.message}</div>
                              <div className="small-text-gray text-end">
                                {sms?.messageDate}
                              </div>
                            </div>
                            <ProfileImage
                            src={recruiterSrc}
                              // src={referrerSrc}
                              name={sms.receiverName}
                              width="40px"
                              height="40px"
                              initialsContainerClass="rounded-circle"
                            />
                          </div>
                        ):(
                          ""
                        
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="w-100">
          <div className="d-flex gap-2 w-100 flex-sm-row flex-column">
            <input
              type="text"
              value={inputText}
              className="btn cursor-text fs-12 bg-white border-dark text-start w-100 p-3"
              placeholder="Write your message"
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              className="btn btn-outline-dark fs-12 fw-700 text-white bg-dark ps-5 pe-5 p-3"
              onClick={handleSendBtn}
            >
              Send
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewMessagesDialog;
