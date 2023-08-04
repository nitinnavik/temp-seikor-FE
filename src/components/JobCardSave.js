import React, { useEffect, useState } from "react";
import { updateSavedAndPinJob } from "../_services/job.service";
import toaster from "../utils/toaster";
import Loader from "./common/loader";
import icThreeDots from "../assests/icons/ic_retract.svg";
import icBlackDone from "./../assests/icons/ic_blackdone.svg";
import { Dropdown } from "react-bootstrap";
import {
  JOB_SAVED_SUCCESS,
  JOB_SAVE_REFERRAL,
  JOB_UNSAVED_SUCCESS,
} from "../constants/message";
import { TOKEN } from "../constants/keys";
import { getLocalStorage } from "../utils/storage";
import { useNavigate } from "react-router";

const JobCardSave = (props) => {
  const [isSavedJob, setIsSavedJob] = useState(props.saveStatus);
  const [isReferer, setIsReferer] = useState(props.isReferer);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // setIsSavedJob(props?.saveStatus);
    // setIsReferer(props?.isReferer);
    // console.log("saved ref", isSavedJob, isReferer);
  }, [props]);

  const callsaveUnsaveApi = (isSave, isRefer) => {
    setShowLoader(true);
    updateSavedAndPinJob(props?.jobId, isSave, isRefer, false)
      .then((res) => {
        setShowLoader(false);
        if (isSavedJob === false && res?.isSave === true) {
          toaster("success", JOB_SAVED_SUCCESS);
          setIsSavedJob(true);
          if (props?.onJobSaved) {
            props?.onJobSaved();
          }
        } else if (isReferer === false && res?.isReferrer === true) {
          toaster("success", JOB_SAVED_SUCCESS);
          setIsReferer(true);
          if (props?.onJobSaved) {
            props?.onJobSaved();
          }
        } else if (isSavedJob === true && res?.isSave === false) {
          setIsSavedJob(false);
          toaster("success", JOB_UNSAVED_SUCCESS);
          if (props?.onJobSaved) {
            props?.onJobSaved();
          }
        } else if ((isReferer === true && res?.isReferrer) === false) {
          setIsReferer(false);
          toaster("success", JOB_UNSAVED_SUCCESS);
          if (props?.onJobSaved) {
            props?.onJobSaved();
          }
        }
      })
      .catch((err) => {
        setShowLoader(false);
        toaster("Error", err);
      });

  };

  // const onButtonClick = () => {
  //   callsaveUnsaveApi();
  // };
  const token = getLocalStorage(TOKEN);
  const navigate = useNavigate();
  return (
    <>
      {showLoader && <Loader />}
     
      <div className="job-card-action-select">
        <Dropdown className="d-flex align-items-center justify-content-center  down-btn-remove">
          <Dropdown.Toggle
            style={{ background: "none" }}
            variant="none"
            id="dropdown-basic"
            className="d-flex p-0 m-0 border-0 bg-transparent "
          >
            <img className="px-2 py-1" src={icThreeDots} alt="retract-icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu className="fs-12 text-secondary mt-2 border-dark ">
            <Dropdown.Item
              onClick={() => {
                // setIsSavedJob(!isSavedJob);
                // onButtonClick();
                if(token){ 
                callsaveUnsaveApi(!isSavedJob, isReferer);
                }
                else{
                  navigate("/login");
                }
              }}
              className="d-flex pb-2 pt-2"
            >
              <div className="d-flex gap-2">
                {isSavedJob ? (
                  <img src={icBlackDone} alt="blackdone-icon" className="" />
                ) : (
                  ""
                )}
                <span className={isSavedJob ? "fw-700" : ""}>
                  Save For Applying
                </span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                // setIsReferer(!isReferer);
                // onButtonClick();
                // {token}
                
                
                 
                  if(token){ 
                    callsaveUnsaveApi(isSavedJob, !isReferer)
                    }
                    else{
                      navigate("/login");
                    }
              }}
              className="d-flex pb-2 pt-2"
            >
              <div className="d-flex gap-2">
                {isReferer ? (
                  <img src={icBlackDone} alt="blackdone-icon" className="" />
                ) : (
                  ""
                )}
                <span className={isReferer ? "fw-700" : ""}>
                  Save For Referring
                </span>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* </div> */}
      </div>
      


    </>
  );
};
export default JobCardSave;
