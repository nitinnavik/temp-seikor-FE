import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/ic_seikorfull.svg";
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
import zeptoLogo from "../assests/zepto_logo.svg";
import stashfinLogo from "../assests/stashfin_logo.svg";
import lbbLogo from "../assests/lbb_logo.svg";
import inShortsLogo from "../assests/inshorts_logo.svg";
import gripLogo from "../assests/grip_logo.svg";
import hsbcLogo from "../assests/hsbc_logo.svg";
import clearTaxLogo from "../assests/clear_tax_logo.svg";
import adityaBirlaLogo from "../assests/aditya_birla_logo.svg";
import LoginForm from "../components/login_form";
import LoginEmailVerifyForm from "../components/login_email_verify_form";
import { useEffect, useState } from "react";
import { setLocalStorage } from "../utils/storage";
import { TOKEN, USER_ID } from "../constants/keys";

const LoginPage = (props) => {
  // const BREAKPOINT_HIDE_LEFT_SECTION = 1000;
  const COMPANY_LOGOS = [
    zeptoLogo,
    stashfinLogo,
    lbbLogo,
    inShortsLogo,
    gripLogo,
    hsbcLogo,
    clearTaxLogo,
    adityaBirlaLogo,
  ];

  const [email, setEmail] = useState("");

  const [isVerificationNeeded, setVerificationNeeded] = useState(false);
  // const { height, width } = useWindowDimensions();
  useEffect(() => {
    setLocalStorage(TOKEN, "");
    setLocalStorage(USER_ID, "");
  }, []);

  return (
    <div className="d-flex align-items-stretch flex-grow-1 login-page-container">
      {/* Left section */}
      <div className="flex-grow-1 login-page-left-block d-lg-flex flex-column align-items-stretch justify-content-between d-none">
        <div>
          {/* Logo */}
          
          <a className="login-page-logo-container" href="https://site.seikor.com/index.html">
            <img src={logo2} className="mb-5 login-page-logo" alt="" />
          </a>
          
          <div className="login-page-content-block login-page-left-content-block ">
            <div className="subtitle">While you were away,</div>
            <div className="heading1">
              we have handpicked jobs from top-notch companies
            </div>
          </div>
        </div>

        {/* Companies logos */}
        <div className="d-flex justify-content-center company-logos-container flex-wrap">
          {COMPANY_LOGOS.map((logo, index) => (
            <div
              style={{ width: "76px", height: "76px" }}
              className="company-logo d-flex justify-content-center align-items-center"
              key={index + 1}
            >
              <img
                style={{ borderRadius: "11px" }}
                width="64px"
                src={logo}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex-shrink-0 login-page-right-section flex-column d-flex px-5">
        {/* Logo */}
        <div className="container">
          <div className="d-lg-none d-block my-5">
            <img src={logo2} className="login-page-logo" alt="" />
          </div>

          <div className="login-page-content-block login-page-right-content-block">
            {/* Login block */}

            {isVerificationNeeded ? (
              <LoginEmailVerifyForm
                email={email}
                setVerificationNeeded={setVerificationNeeded}
              />
            ) : (
              <LoginForm
                email={email}
                setEmail={setEmail}
                verificationNeeded={() => {
                  setVerificationNeeded(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
