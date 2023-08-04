import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
const InputOtp = (props) => {
  const handleChange = (otp) => props.setOtp(otp);
  useEffect(() => {}, [props.isDisabled, props?.isInputSecure]);
  return (
    <>
      <OtpInput
        value={props.otp}
        onChange={handleChange}
        numInputs={4}
        isInputNum={true}
        isInputSecure={props?.isInputSecure}
        separator={<span>&nbsp;&nbsp;&nbsp;</span>}
        className="input-otp"
        isDisabled={props.isDisabled}
      />
    </>
  );
};
export default InputOtp;
