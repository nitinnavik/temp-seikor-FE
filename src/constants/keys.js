export const TOKEN = "token";
export const QUICKAPPLYMODALSHOW = "quickApplyModalShow";
export const USER_ID = "userId";
export const MASTER_TYPE = {
  JOBROLE: "JOBROLE",
  COMPANY: "COMPANY",
  JOBSTATUS: "JOBSTATUS",
  LOCATION: "LOCATION",
  KEYSKILLS: "KEYSKILLS",
  INDUSTRIES: "INDUSTRIES",
  FUNCTIONS: "FUNCTIONS",
  JOBTYPES: "JOBTYPES",
  QUALIFICATION: "QUALIFICATION",
  DEGREE: "DEGREE",
  SPECIALIZATION: "SPECIALIZATION",
  WORKMODE: "WORKMODE",
  WORKSTATUS: "WORKSTATUS",
  SALARYTYPE: "SALARYTYPE",
};
// --------------------------------------------------------------------------------------
export const REQUIRED = "required";
export const PASSWORD = "password";
export const EMAIL_PATTERN =
  /^([^@\s\."'\(\)\[\]\{\}\\/,:;]+\.)*[^@\s\."'\(\)\[\]\{\}\\/,:;]+@[^@\s\."'\(\)\{\}\\/,:;]+(\.[^@\s\."'\(\)\{\}\\/,:;]+)+$/;
export const PHONE_NUMBER_PATTERN = /^[0-9+]{10,15}$/;
export const OTP_PATTERN = /^[0-9]{4}$/;
// export const PASSWROD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
export const pattern = (regExp, errorMsg = "Pattern not matched") => {
  return { pattern: regExp, errorMsg };
};
export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8}$/;
export const NAME_PATTERN = /^[a-zA-Z0-9-]+[a-z A-Z 0-9 -]*$/;
export const YEAR_PATTERN = /^(19|20)\d{2}$/;
export const PHONE_NUMBER_PATTERN_REGISTRATION = /^[0-9+]{5,13}$/;
export const PHONE_NUMBER_PATTERN_LOGIN = /^[0-9+]{9,19}$/;
export const PHONE_CHECK = "International Phone Check";
export const ALPHABET_CHECK = /[a-zA-Z]/;
export const NUMBER_PATTERN = /^[0-9]*$/;
// --------------------------------------------------------------------------------------

export const INVALID_YEAR = "Invalid Year";
export const INVALID_MONTH = "Invalid Month";
export const INVALID_VALUE = "Invalid Value";
export const URL_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const FORM_VALIDATION_MESSAGE = {
  REQUIRED: "Field is required",
  EMAIL: "Email address is invalid",
  PHONE: "Phone number is invalid",
  NAME: "Please enter alphabet only.",
};

export const PASSWORD_VALIDATION_MESSAGE = {
  LENGTH: "Password must contain atleast 8 characters",
  LOWERCASE: "Password must include atleast one lowercase letter",
  UPPERCASE: "Password must include atleast one uppercase letter",
  NUMBER: "Password must include atleast one number",
  CHARACTER: "Password must include atleast one special character",
};

export const CHOICE_QUESTION = "Y_N";
export const FREE_TEXT = "F_T";
export const YES = "YES";
export const NO = "NO";
export const FAILED_TO_LOAD = "Failed to Load";
export const STATUS_200 = 200;
export const WRONG_CREDENTIALS = "Wrong Credentials";
export const SOMETHING_WENT_WRONG = "Something Went Wrong";
export const STATUS_SUCCESS = "SUCCESS";
export const APPLIED = "APPLIED";
export const JOINED = "JOINED";

export const APPLY_STATUS = {
  APPLIED: "APPLIED",
  NOT_APPLIED: "NOT_APPLIED",
  WAITING_INTERVIEW: "WAITING_INTERVIEW",
  SELECTED: "SELECTED",
  PLACED: "PLACED",
  RETRACTED: "RETRACTED",
  JOINED: "JOINED",
};

export const SORT = {
  LATEST_FIRST: "LATEST_FIRST",
  SALARY_HIGH: "SALARY_HIGH",
  REFERAL_HIGH: "REFERAL_HIGH",
  EXPIRIANCE_HIGH: "EXPERIENCE_HIGH",
  EXPIRIANCE_LOW: "EXPERIENCE_LOW",
  JOB_TITLE_ASC: "JOB_TITLE_ASC",
};

// Status
export const STATUS = {
  ACTIVE: "active",
  CLOSED: "closed",
};

export const PAYMENT_MODE = {
  REQUEST_PAYMENT: "REQUEST_PAYMENT",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  PAYMENT_PROCESSED: "PAYMENT_PROCESSED",
  PAYMENT_REJECTED: "PAYMENT_REJECTED",
  PAYMENT_ACCEPTED: "PAYMENT_ACCEPTED",
};

export const PAYMODE = {
  UPI: "UPI",
  VPA: "VPA",
  BANK_ACCOUNT: "BANK_ACCOUNT",
  PAY_PAL: "PAY_PAL",
};

export const LOGIN = "Login";
export const REGISTRATION = "Registration";
export const INPUT_BOX_MAX_LENGTH = 500;

export const getPhoneNumberPattern = (type) => {
  if (type === LOGIN) {
    return PHONE_NUMBER_PATTERN_LOGIN;
  } else {
    return PHONE_NUMBER_PATTERN_REGISTRATION;
  }
};

export const PREV_NOTIFICATION_COUNT = "prevNotificationCount";

export const NOTIFICATION_TYPE = {
  FEEDBACK: "FEEDBACK_CANDIDATE",
  VIEW_JOB_CANDIDATE: "VIEW_JOB_DETAILS_CANDIDATE",
  VIEW_JOB_CANDIDATE_2: "RECOMMENDED_JOB_CANDIDATE",
  VIEW_JOB_BUSINESS: "VIEW_JOB_DETAILS_BUSINESS",
  ADD_REFEREE_RECOMMENDATION: "JOB_RECOMMENDATION_REFEREE",
  JOB_RECOMMENDATION_REFEREE: "JOB_RECOMMENDATION_REFEREE",
};
