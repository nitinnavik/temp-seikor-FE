/* eslint-disable jsx-a11y/alt-text */
import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/ic_seikorWhite.svg";
import Blacklogo from "../assests/ic_seikorfull.svg";
import logo2 from "../assests/ic_skrcolor.svg";
import useWindowDimensions from "../utils/use_window_dimension";
import logoSiemens from "../assests/siemens_logo.png";
import logoAirbnb from "../assests/airbnb_logo.png";
import logoAmazon from "../assests/amazon_logo.png";
import logoDecathon from "../assests/decathon_logo.png";
import logoMicrosoft from "../assests/microsoft_logo.png";
import logoSnapchat from "../assests/snapchat_logo.png";
import logoStarbuck from "../assests/starbuck_logo.png";
import logoMomspresso from "../assests/momspresso_logo.png";
import LoginForm from "../components/login_form";
import LoginEmailVerifyForm from "../components/login_email_verify_form";
import { useState } from "react";
import RegistrationVerifyForm from "../components/registration_verify_form";
import RegistrationForm from "../components/registration_form";
import icClose from "../assests/icons/ic_closeroundbtn.svg";

const RegistrationPage = (props) => {
  // const BREAKPOINT_HIDE_LEFT_SECTION = 1000;
  const COMPANY_LOGOS = [
    logoAirbnb,
    logoAmazon,
    logoDecathon,
    logoMicrosoft,
    logoMomspresso,
    logoSiemens,
    logoSnapchat,
    logoStarbuck,
  ];

  const [childData, setChildData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [refNumberEmail, setRefNumberEmail] = useState("");
  const [refNumberPhone, setRefNumberPhone] = useState("");
  const [isEmailOtpResent, setIsEmailOtpResent] = useState(false);
  const [isPhoneOtpResent, setIsPhoneOtpResent] = useState(false);

  const [isVerificationNeeded, setVerificationNeeded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  // const { height, width } = useWindowDimensions();

  return (
    <div className="d-flex align-items-stretch flex-grow-1 registration-page-container">
      {/* Left section */}
      <div className="flex-grow-1 registration-page-left-block d-lg-flex flex-column align-items-stretch justify-content-between d-none">
        <div>
          {/* Logo */}
          <a className="registration-page-logo-container" href="https://site.seikor.com/index.html">
            <img src={logo} className="mb-5 registration-page-logo" />
          </a>
        </div>
      </div>

      {/* Right section */}
      <div className="flex-shrink-0 registration-page-right-section flex-column d-flex px-4 px-sm-5">
        {/* Logo */}

        <div className="container">
          <div className=" position-relative">
            <div className="d-lg-none d-block my-5 pb-1">
              <img src={logo2} className="registration-page-logo" />
            </div>
            <div className="position-absolute end-0 top-0 mt-lg-4 mt-2">
              <Link to={-1} className="mt-5 mt-lg-0">
                <img src={icClose} alt="close-btn" width="26px" />
              </Link>
            </div>
          </div>

          <div className="registration-page-right-content-block">
            {/* Form */}
            <div>
              {isVerificationNeeded ? (
                <RegistrationVerifyForm
                  sentParentToChild={childData}
                  refNumberEmail={refNumberEmail}
                  refNumberPhone={refNumberPhone}
                  isEmailOtpResent={isEmailOtpResent}
                  setIsEmailOtpResent={setIsEmailOtpResent}
                  isPhoneOtpResent={isPhoneOtpResent}
                  setIsPhoneOtpResent={setIsPhoneOtpResent}
                  setRefNumberEmail={setRefNumberEmail}
                  setRefNumberPhone={setRefNumberPhone}
                  redirectUrl={redirectUrl}
                  setRedirectUrl={setRedirectUrl}
                />
              ) : (
                <RegistrationForm
                  setRefNumberEmail={setRefNumberEmail}
                  setRefNumberPhone={setRefNumberPhone}
                  verificationNeeded={(email, phone, password) => {
                    setVerificationNeeded(true);
                    setChildData({ email, phone, password });
                  }}
                  setIsEmailOtpResent={setIsEmailOtpResent}
                  setIsPhoneOtpResent={setIsPhoneOtpResent}
                  redirectUrl={redirectUrl}
                  setRedirectUrl={setRedirectUrl}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
