import { isEmpty } from "./form_validators";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { NOT_MENTIONED, NO_DETAILS_AVAILABLE } from "../constants/message";

export const convertInThousand = (data) => data / 1000;
export const convertToInternationalCurrencySystem = (value, currency = 0) => {
  if (currency == "INR") {
    if (Math.abs(Number(value)) >= 1.0e9) {
      let num = Math.abs(Number(value)) / 1.0e9;
      return parseFloat(num?.toFixed(2)) + "B";
    } else if (Math.abs(Number(value)) >= 1.0e7) {
      let num = Math.abs(Number(value)) / 1.0e7;
      return parseFloat(num?.toFixed(2)) + "Cr";
    } else if (Math.abs(Number(value)) >= 1.0e5) {
      let num = Math.abs(Number(value)) / 1.0e5;
      return parseFloat(num?.toFixed(2)) + "L";
    } else if (Math.abs(Number(value)) >= 1.0e3) {
      let num = Math.abs(Number(value)) / 1.0e3;
      return parseFloat(num?.toFixed(2)) + "K";
    } else {
      let num = Math.abs(Number(value));
      return parseFloat(num?.toFixed(2));
    }
  } else {
    if (Math.abs(Number(value)) >= 1.0e9) {
      let num = Math.abs(Number(value)) / 1.0e9;
      return parseFloat(num?.toFixed(2)) + "B";
    } else if (Math.abs(Number(value)) >= 1.0e6) {
      let num = Math.abs(Number(value)) / 1.0e6;
      return parseFloat(num?.toFixed(2)) + "M";
    } else if (Math.abs(Number(value)) >= 1.0e3) {
      let num = Math.abs(Number(value)) / 1.0e3;
      return parseFloat(num?.toFixed(2)) + "K";
    } else {
      let num = Math.abs(Number(value));
      return parseFloat(num?.toFixed(2));
    }
  }
};

export const monthConversion = (minExp = 0, maxExp = 0) => {
  let startYears, endYears;
  startYears = Math.round((minExp / 12) * 2) / 2;
  endYears = Math.round((maxExp / 12) * 2) / 2;

  if (startYears > 0 && endYears > 0) {
    return `${startYears} to ${endYears} ${endYears > 1 ? "years" : "year"}`;
  } else if (startYears > 0 && endYears == 0) {
    return `${startYears} ${startYears > 1 ? "years" : "year"} or more`;
  } else if (endYears > 0 && startYears == 0) {
    return `${endYears} ${endYears > 1 ? "years" : "year"} or less`;
  } else {
    return "Flexible";
  }
  // if (maxExp != null) {
  //   let endYears = Math.floor(maxExp / 12);
  //   let endMonths = maxExp % 12;
  //   if (startYears >= 1) {
  //     if (startMonths >= 1) {
  //       if (endMonths >= 1) {
  //         if (maxExp != null)
  //           return `${startYears}.${startMonths} - ${endYears}.${endMonths} yrs`;
  //         else return `${startYears}.${startMonths} yrs`;
  //       }
  //     }
  //   } else {
  //     if (endYears > 0) {
  //       if (endMonths > 0) return `${0}-${endYears}.${endMonths}yrs`;
  //       else return `${0}-${endMonths}month`;
  //     } else {
  //       if (endMonths > 0) {
  //         return `${startMonths}-${endMonths}month `;
  //       }
  //     }
  //   }
  // }

  // if (startYears > 1) {
  //   if (startMonths > 1)
  //     return `${startYears} startYears ${startMonths} months`;
  //   else return `${startYears} startYears ${startMonths} month`;
  // } else {
  //   if (startYears == 0) {
  //     if (startMonths > 1) return `${startMonths} months`;
  //     else return `${startMonths} month`;
  //   }
  //   if (startMonths > 1) return `${startYears} year ${startMonths} months`;
  //   else return `${startYears} year ${startMonths} month`;
  // }
};

export const isCheckValue = (value) => {
  const valueType = typeof value;
  if (valueType === "string") {
    if (isEmpty(value)) {
      return false;
    } else {
      return true;
    }
  } else if (valueType === "object") {
    const condition = Array.isArray(value);
    if (condition && value?.length > 0) {
      if (value.length === 1) {
        if (isEmpty(value[0])) {
          return false;
        } else {
          return true;
        }
      } else {
        if (isEmpty(value[1])) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
};

export const checkPhoneNumberValid = (phoneNumber, countryCode = 0) => {
  let value;
  if (countryCode === 0) {
    value = phoneNumber;
  } else {
    value = countryCode + phoneNumber;
  }
  let result = isPossiblePhoneNumber(value);
  return result;
};

// const getSalary = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "INR",
//   maximumFractionDigits: 0,
//   roundingIncrement: 5,
// });

export const imageOnError = (event) => {
  event.target.onerror = null;
  return (event.target.src = window.location.origin + "/placeholder.png");
};

export const yearConversion = (minExp, maxExp) => {
  if (!maxExp) {
    return `${minExp} Year${minExp > 1 ? "s" : ""}`;
  } else if (minExp && maxExp) {
    return `${minExp} to ${maxExp} Year${maxExp > 1 ? "s" : ""}`;
  } else {
    return NOT_MENTIONED;
  }
};
