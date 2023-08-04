import { LINKEDIN } from "../constants/api-endpoints";
import {
  EMAIL_PATTERN,
  FORM_VALIDATION_MESSAGE,
  OTP_PATTERN,
  PHONE_NUMBER_PATTERN,
  REQUIRED,
  PASSWORD_PATTERN,
  PASSWORD_VALIDATION_MESSAGE,
  PASSWORD,
  NAME_PATTERN,
  YEAR_PATTERN,
  INVALID_YEAR,
  PHONE_NUMBER_PATTERN_LOGIN,
  PHONE_NUMBER_PATTERN_REGISTRATION,
  PHONE_CHECK,
  ALPHABET_CHECK,
  NUMBER_PATTERN,
  INVALID_VALUE,
  INVALID_MONTH,
} from "../constants/keys";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { checkPhoneNumberValid } from "./utils";
import { monthValue } from "../components/month_picker";

const onFormFeildsChange = (event, formData, setFormData) => {
  const { value, name } = event.target;
  const newFormData = { ...formData };
  newFormData[name]["valueText"] = value;
  validateField(name, newFormData, setFormData);
  setFormData(newFormData);
};

const enableShouldErrorShow = (event, formData, setFormData) => {
  const { name } = event?.target;
  const newFormData = { ...formData };
  newFormData[name]["shouldShowError"] = true;
  setFormData(newFormData);
};

const disableShouldErrorShow = (event, formData, setFormData) => {
  const { name } = event?.target;
  const newFormData = { ...formData };
  newFormData[name]["shouldShowError"] = false;
  setFormData(newFormData);
};

const validateField = (fieldName, formDataOrignal, setFormData) => {
  const formData = {
    ...formDataOrignal,
  };
  const checkValidationArray = formData[fieldName]["check"];
  const fieldValue = formData[fieldName]["valueText"];
  let isValid = true;

  if (checkValidationArray.includes(REQUIRED) && isEmpty(fieldValue)) {
    formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.REQUIRED;
    isValid = false;
  } else {
    formData[fieldName]["errorText"] = "";
  }

  if (!isEmpty(fieldValue) && checkValidationArray.includes(PHONE_CHECK)) {
    if (!ALPHABET_CHECK.test(formData?.username?.valueText)) {
      if (checkPhoneNumberValid(fieldValue)) {
        isValid = true;
      } else {
        formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.PHONE;
        console.log(formData[fieldName]["errorText"], "Error is added");
        isValid = false;
      }
    }
  }

  if (checkValidationArray.includes(YEAR_PATTERN)) {
    const d = new Date();
    let year = d?.getFullYear();
    if (!YEAR_PATTERN?.test(fieldValue)) {
      formData[fieldName]["errorText"] = INVALID_YEAR;
      isValid = false;
    } else {
      formData[fieldName]["errorText"] = "";
    }
    if (
      Number(formDataOrignal?.courseStartYear?.valueText) > Number(year) ||
      Number(formDataOrignal?.courseEndYear?.valueText) > Number(year)
    ) {
      formData[fieldName]["errorText"] = INVALID_YEAR;
      isValid = false;
    }
    if (fieldName == "courseEndYear") {
      if (
        formDataOrignal?.courseStartYear?.valueText >
        formDataOrignal?.courseEndYear?.valueText
      ) {
        formData[fieldName]["errorText"] = INVALID_YEAR;
        isValid = false;
      }
    }
  }

  //Aman's Code

  if (
    formDataOrignal?.courseStartYear?.valueText &&
    formDataOrignal?.courseEndYear?.valueText &&
    formDataOrignal?.courseStartMonth?.valueText &&
    formDataOrignal?.courseStartYear?.valueText ===
      formDataOrignal?.courseEndYear?.valueText &&
    monthValue(formDataOrignal?.courseStartMonth?.valueText) >=
      monthValue(formDataOrignal?.courseEndMonth?.valueText)
  ) {
    formData["courseEndMonth"]["errorText"] = INVALID_MONTH;
    isValid = false;
  } else if (
    formDataOrignal?.courseStartYear?.valueText &&
    formDataOrignal?.courseEndYear?.valueText
  ) {
    formData["courseEndMonth"]["errorText"] = "";
    isValid = true;
  }

  // if (checkValidationArray.includes(NUMBER_PATTERN)) {
  //   if (!NUMBER_PATTERN?.test(fieldValue)) {
  //     formData[fieldName]["errorText"] = INVALID_VALUE;
  //     isValid = false;
  //   } else {
  //     formData[fieldName]["errorText"] = "";
  //   }
  //   if (
  //     Number(formDataOrignal?.minExperience?.valueText) ||
  //     Number(formDataOrignal?.maxExperience?.valueText)
  //   ) {
  //     formData[fieldName]["errorText"] = INVALID_VALUE;
  //     isValid = false;
  //   }
  //   if (fieldName == "maxExperience") {
  //     if (
  //       formDataOrignal?.minExperience?.valueText >
  //       formDataOrignal?.maxExperience?.valueText
  //     ) {
  //       formData[fieldName]["errorText"] = INVALID_VALUE;
  //       isValid = false;
  //     }
  //   }
  // }
  if (checkValidationArray.includes(PASSWORD)) {
    const errorTextPswd = isPasswordValid(fieldValue);
    if (errorTextPswd) {
      formData[fieldName]["errorText"] = errorTextPswd;
      isValid = false;
    } else {
      formData[fieldName]["errorText"] = "";
    }
  }
  // if (checkValidationArray.includes(NAME_PATTERN)) {
  //   const errorTextname = isNameValid(fieldValue);
  //   if (errorTextname) {
  //     formData[fieldName]["errorText"] = "";
  //     isValid = false;
  //   } else {
  //     formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.NAME;
  //   }
  // }

  if (
    checkValidationArray.includes(EMAIL_PATTERN) &&
    (checkValidationArray.includes(PHONE_NUMBER_PATTERN) ||
      checkValidationArray.includes(PHONE_NUMBER_PATTERN_LOGIN) ||
      checkValidationArray.includes(PHONE_NUMBER_PATTERN_REGISTRATION)) &&
    !isEmpty(fieldValue)
  ) {
    if (
      isEmailValid(fieldValue) ||
      isPhoneValid(fieldValue, checkValidationArray)
    ) {
      isValid = true;
    } else {
      const convertNumber = Number(fieldValue);
      if (isNaN(convertNumber) && convertNumber !== 0) {
        formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.EMAIL;
        isValid = false;
      } else {
        formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.PHONE;
        isValid = false;
      }
    }
  } else {
    if (
      checkValidationArray.includes(EMAIL_PATTERN) &&
      !isEmpty(fieldValue) &&
      !isEmailValid(fieldValue) &&
      ALPHABET_CHECK.test(fieldValue)
    ) {
      formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.EMAIL;
      isValid = false;
    }
    if (
      (checkValidationArray.includes(PHONE_NUMBER_PATTERN) ||
        checkValidationArray.includes(PHONE_NUMBER_PATTERN_LOGIN) ||
        checkValidationArray.includes(PHONE_NUMBER_PATTERN_REGISTRATION)) &&
      !isEmpty(fieldValue) &&
      !isPhoneValid(fieldValue, checkValidationArray)
    ) {
      formData[fieldName]["errorText"] = FORM_VALIDATION_MESSAGE.PHONE;
      isValid = false;
    }
  }

  for (const check of checkValidationArray) {
    if (typeof check === "object" && check["pattern"]) {
      if (!isEmpty(fieldValue) && !check["pattern"].test(fieldValue)) {
        formData[fieldName]["errorText"] = check["errorMsg"];
        isValid = false;
      }
    }
  }
  setFormData(formData);
  return isValid;
};

const isPasswordValid = (value) => {
  let length = value?.length;

  if (!value) {
    return FORM_VALIDATION_MESSAGE?.REQUIRED;
  } else if (!/[A-Z]/.test(value)) {
    return PASSWORD_VALIDATION_MESSAGE?.UPPERCASE;
  } else if (!/[a-z]/.test(value)) {
    return PASSWORD_VALIDATION_MESSAGE?.LOWERCASE;
  } else if (!/[0-9]/.test(value)) {
    return PASSWORD_VALIDATION_MESSAGE?.NUMBER;
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
    return PASSWORD_VALIDATION_MESSAGE?.CHARACTER;
  } else if (length < 8) {
    return PASSWORD_VALIDATION_MESSAGE?.LENGTH;
  } else {
    return null;
  }
};

const isEmailValid = (value) => {
  const pattern = EMAIL_PATTERN;
  if (pattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const isNameValid = (value) => {
  const pattern = NAME_PATTERN;
  if (pattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const isPhoneValid = (value, checkValidationArray) => {
  let pattern;
  if (checkValidationArray?.includes(PHONE_NUMBER_PATTERN_LOGIN)) {
    pattern = PHONE_NUMBER_PATTERN_LOGIN;
  } else if (
    checkValidationArray?.includes(PHONE_NUMBER_PATTERN_REGISTRATION)
  ) {
    pattern = PHONE_NUMBER_PATTERN_REGISTRATION;
  } else {
    pattern = PHONE_NUMBER_PATTERN;
  }

  if (pattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const isOtpValid = (value) => {
  const pattern = OTP_PATTERN;
  if (pattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const emptyProxyObject = new Proxy({}, {});
const isEmpty = (val) => {
  if (val === emptyProxyObject) return true;
  if (val === undefined) return true;

  if (
    typeof val == "function" ||
    typeof val == "number" ||
    typeof val == "boolean" ||
    Object.prototype.toString.call(val) === "[object Date]"
  )
    return false;

  if (val == null || val.length === 0)
    // null or 0 length array
    return true;

  if (typeof val == "object") if (Object.keys(val).length === 0) return true;

  return false;
};

const initialiseFormData = (formData, setFormData) => {
  let newFormData = { ...formData };
  Object.values(newFormData)?.forEach((field) => {
    field.valueText = field?.initial;
    field.errorText = "";
  });
  setFormData(newFormData);
};

const validateForm = (formData, setFormData) => {
  let isValid = true;
  if (
    formData?.newPassword?.valueText !== formData?.confirmPassword?.valueText
  ) {
    formData["errorText"] = "Confirm password should be match with password";
    isValid = false;
  } else {
    formData.confirmPassword.errorText = "";
    isValid = true;
  }
  setFormData(formData);
};

export {
  onFormFeildsChange,
  enableShouldErrorShow,
  disableShouldErrorShow,
  validateField,
  isEmailValid,
  isPhoneValid,
  isOtpValid,
  isEmpty,
  initialiseFormData,
  validateForm,
  isPasswordValid,
};
