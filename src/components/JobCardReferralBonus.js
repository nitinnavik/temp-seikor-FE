import React from "react";
import { NOT_MENTIONED } from "../constants/message";
import { convertToInternationalCurrencySystem } from "../utils/utils";
import bonusIcon from "./../assests/icons/ic-bonus.svg";

const JobCardReferralBonus = ({ text, currencyType }) => {
  return (
    <div className="package d-flex align-items-center">
      <img src={bonusIcon} alt="salary" />
      &nbsp;
      {`Referral Bonus - ${
        text
          ? `${currencyType} ${convertToInternationalCurrencySystem(
              text,
              currencyType
            )}`
          : NOT_MENTIONED
      }`}
    </div>
  );
};
export default JobCardReferralBonus;
