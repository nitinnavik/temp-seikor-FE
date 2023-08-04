/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
// import save from "./../assests/icons/ic-save.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import HeaderTwo from "../components/common/headerTwo";
import { newPassword, retrievePassword } from "../_services/candidate.service";
import { PASSWORD, REQUIRED } from "../constants/keys";
import toaster from "../utils/toaster";
import { Router, hashHistory } from "react-router-dom";
import Loader from "../components/common/loader";
import { onFormFeildsChange, validateField } from "../utils/form_validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPasswordLinkPage = () => {
  const { tokenId } = useParams();
  const [formData, setFormData] = useState({
    password: { valueText: "", errorText: "", check: [REQUIRED, PASSWORD] },
  });
  const [username, setuserName] = useState("");
  const [token, settoken] = useState(tokenId);
  const [isSaved, setIsSaved] = useState(true);
  const [isPasswordShown, setIsPasswordShown] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(<FaEyeSlash />);

  const togglePasswordVisiblity = () => {
    if (isPasswordShown === "password") {
      setIsPasswordShown("text");
      setPasswordIcon(FaEye);
    } else {
      setIsPasswordShown("password");
      setPasswordIcon(FaEyeSlash);
    }
  };
  useEffect(() => {
    newPassword(username, formData?.password?.valueText, token)
      .then((res) => {
        console.log(res);
        settoken(tokenId);
        console.log(tokenId);
        setuserName(res.data.data.username);
        //toaster("success", " token Valid ");
      })
      .catch((err) => {
        toaster("error", err);
      });
  }, [username]);

  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const submitPassword = () => {
    if (validateField("password", formData, setFormData)) {
      setShowLoader(true);
      newPassword(username, formData?.password?.valueText, token)
        .then((res) => {
          setuserName(username);
          setShowLoader(false);

          if (res.data.status === "SUCCESS") {
            if (isSaved === true) {
              setIsSaved(false);
            }
            console.log(res.data.message);
            toaster("success", res.data.message);
          } else {
            toaster("error", res.data.message);
          }
        })
        .catch((err) => {
          setShowLoader(false);
          toaster("error", err);
        });
    }
  };

  const showPopupHandler = () => {
    setIsSaved({
      isSaved: true,
    });
    // if (tokenId == true) {
    // if (isSaved === true) {
    //   setIsSaved(false);
    // } else {
    //   setIsSaved(true);
    //   document.getElementById("create-password").style.display = "none";
    //   document.getElementById("save-btn").style.display = "none";
    // }
  };
  return (
    <div className="h-auto w-100">
      {showLoader && <Loader />}
      <HeaderTwo />

      <div className="container ">
        <div className="d-flex justify-content-center non-found-height align-items-center px-4">
          <div className="">
            <h4 className="fw-bold fs-4"> Create New Password </h4>
            <br />
            <br />
            <span className="text-secondary"> Registered ID</span>
            <br />
            <span className="m-0 mt-3">
              <b>{username}</b>
            </span>
            <br />
            <br />
            {isSaved && (
              <div
                className="mt-3 mb-3"
                id="create-password"
                style={{ color: "#3E3E3E" }}
              >
                <div className="pb-2 fw-700">Create New Password </div>
                <div className="position-relative">
                  <div>
                    <input
                      // type={isPasswordShown ? "text" : "password"}
                      type={isPasswordShown}
                      className={
                        (formData?.password?.errorText ? "error" : "") +
                        " form-control "
                      }
                      name="password"
                      onChange={($event) => {
                        onFormFeildsChange($event, formData, setFormData);
                      }}
                      required
                    />
                  </div>
                  <div
                    className="icons-span me-2"
                    onClick={togglePasswordVisiblity}
                  >
                    {passwordIcon}
                  </div>
                </div>

                {formData.password.errorText && (
                  <div className="field-error mt-1">
                    {formData.password.errorText}
                  </div>
                )}
              </div>
            )}
            <br />
            <br />
            {isSaved ? (
              <input
                type="button"
                id="save-btn"
                value="Save"
                className="w-100 btn-rounded btn-primary"
                onClick={submitPassword}
                // onClick={(submitPassword) => setIsSaved(false)}
              />
            ) : (
              <Link to="/login">
                <input
                  type="button"
                  id="save-btn"
                  value="Log in now"
                  className="w-100 btn-rounded btn-primary"
                  // className={
                  //   isSaved
                  //     ? "d-block w-100 btn-rounded btn-primary"
                  //     : "d-none w-100 btn-rounded btn-primary"
                  // }
                  onClick={showPopupHandler}
                  //onClick={(showPopupHandler) => setIsSaved(true)}
                />
              </Link>
            )}
            <br />
            <br />
          </div>

          {/* <div className={isSaved ?'container d-block' :'container d-none'} id='pop-up'>
                <div className='d-flex justify-content-center'>
                <div className='bg-primary ps-2 rounded-3 position-absolute bottom-align'>
                  <div className='d-flex justify-content-between rounded-3 password-updated p-3 ' style={{width : '300px'}}>
                    <span className='text-white d-flex'>
                      <span className=''><img src={save} alt='save-icon' /></span>
                      <span className='mt-1 ps-3'> Password updated</span>
                    </span>
                    <span className='rounded-circle end-0 text-white btn-close-white p-2 pt-0 pb-1 border close-border'><img src={close} alt='close-icon' style={{width: '10px'}}/></span>
                  </div>
                  </div>
                </div>    
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordLinkPage;
