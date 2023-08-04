import React, { useEffect, useState } from "react";
import {
  convertInThousand,
  convertToInternationalCurrencySystem,
} from "../utils/utils";
import salaryIcon from "./../assests/icons/ic-salary.svg";

const JobCardSalary = (props) => {
  const [text, setText] = useState(false);

  let minSal = convertToInternationalCurrencySystem(
    props?.data?.jobMinSalary,
    props?.data?.salaryCurrency
  );
  let maxSal = convertToInternationalCurrencySystem(
    props?.data?.jobMaxSalary,
    props?.data?.salaryCurrency
  );

  useEffect(() => {
    if (props?.text) {
      setText(true);
    } else {
      setText(false);
    }
  }, [props]);

  return (
    <div className="package d-flex align-items-center">
      <img src={salaryIcon} alt="salary" />
      &nbsp;
      {text
        ? props?.text
        : `${minSal ? minSal : Number(props?.data?.jobMinSalary)} - ${
            maxSal ? maxSal : Number(props?.data?.jobMaxSalary)
          } ${props?.data?.salaryCurrency} ${props?.data?.salaryType}`}
    </div>
  );
};
export default JobCardSalary;
