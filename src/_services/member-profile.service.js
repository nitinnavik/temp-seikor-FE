import {
  GEN_OTP_ENDPOINT,
  VERIFY_OTP_ENDPOINT,
  UPDATE_LOCATION_ENDPOINT,
  ADD_SOCIAL_MEDIA_ENDPOINT,
  LINKEDIN,
  UPDATE_EMAIL_ENDPOINT,
  UPDATE_PHONE_ENDPOINT,
  GET_ALL_MASTER_ENDPOINT,
  ADD_EDUCATION_ENDPOINT,
  UPDATE_PRIVACY,
  GET_JOB_DETAILS_ENDPOINT,
  REFER_JOB_ENDPOINT,
  ADD_RECOMMENDATION,
  GET_BY_EMAIL_ENDPOINT,
  GET_BY_NAME_ENDPOINT,
  GET_BY_MOBILE_ENDPOINT,
  APPLY_FOR_JOBS_ENDPOINT,
  UPDATE_JOB_PREFERENCES_ENDPOINT,
  NOTIFICATION_PREFERENCE_ENDPOINT,
} from "../constants/api-endpoints";
import api from "./api";
import { UPDATE_REFEREE_PREFERENCES_ENDPOINT } from "./../constants/api-endpoints";

const GenerateOtp = (data, type, prevValue = null) => {
  let token = localStorage.getItem("token");
  return api
    .post(
      GEN_OTP_ENDPOINT,
      { otpType: type, value: data, prevValue: prevValue },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "true",
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      localStorage.setItem("refNumber", response.data.refNumber);
      return response.data;
    });
};

const UpdateMailNumber = (value, type, data) => {};

const OtpVerification = (value, refNum, secret, type, prevValue = null) => {
  // let token = localStorage.getItem("token");
  // console.log("token", token);
  // console.log("OTP", secret);
  return api
    .post(VERIFY_OTP_ENDPOINT, {
      value: value,
      refNumber: refNum,
      secret: secret,
      prevValue: prevValue,
    })
    .then((response) => {
      // console.log("this is from OTP Verification function", response.data);
      // let userId = localStorage.getItem("userId");

      // let url = "";
      // let dataObj = { userId: userId };
      // if (type === "email") {
      //   url = UPDATE_EMAIL_ENDPOINT;
      //   dataObj.email = value;
      // } else {
      //   url = UPDATE_PHONE_ENDPOINT;
      //   dataObj.mobile = value;
      // }
      // console.log("Inside Update email/number function", response.data.data);
      // if (!response.data.data.verifyStatus) {

      // } else {
      //   return response;
      // }
      console.log("OTP Verification ", response.data.data.verifyStatus);
      return response.data;
    });
};

const updateEmail = (email) => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = 2;
  }

  let dataObj = { userId: userId, email: email };

  return api
    .post(UPDATE_EMAIL_ENDPOINT, dataObj, {})
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const updateMobile = (mobile) => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = 2;
  }

  let dataObj = { userId: userId, mobile: mobile };

  return api
    .post(UPDATE_PHONE_ENDPOINT, dataObj, {})
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const AddLocation = (location) => {
  let id = localStorage.getItem("userId");

  return api
    .post(UPDATE_LOCATION_ENDPOINT, { userId: id, currentLocation: location })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const AddSocialMedia = (arr) => {
  return api
    .post(ADD_SOCIAL_MEDIA_ENDPOINT, arr)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const fetchJobDetails = (id) => {
  let url = GET_JOB_DETAILS_ENDPOINT + "/" + id;
  return api
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const applyingForJob = (data) => {
  return api
    .post(APPLY_FOR_JOBS_ENDPOINT, data)
    .then((res) => res.data)
    .catch((err) => err);
};

const FetchAllLocation = () => {
  let token = localStorage.getItem("token");
  return api
    .post(
      GET_ALL_MASTER_ENDPOINT,
      {
        mType: "LOCATION",
        pageNo: 0,
        pageSize: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "true",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res;
    });
};

const addEducationDetails = (
  id,
  qualification,
  degreeName,
  specialization,
  institute,
  courseStartDate,
  courseEndDate,
  outcome,
  isCompleted
) => {
  return api
    .post(ADD_EDUCATION_ENDPOINT, {
      id,
      qualification: qualification,
      degreeName: degreeName,
      specialization: specialization,
      institute: institute,
      courseStartDate: courseStartDate,
      courseEndDate: courseEndDate,
      outcome: outcome,
      isCompleted: isCompleted,
    })
    .then((res) => {
      return res;
    });
};

const referJob = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(REFER_JOB_ENDPOINT, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    });
};

const addRecommendation = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(ADD_RECOMMENDATION, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    });
};

const getCandidateByEmail = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(GET_BY_EMAIL_ENDPOINT, obj, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    });
};

const getCandidateByName = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(GET_BY_NAME_ENDPOINT, obj, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    });
};

const getCandidateByMobile = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(GET_BY_MOBILE_ENDPOINT, obj, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    });
};

const updatePrivacy = (
  location,
  workHistory,
  education,
  workStatus,
  email,
  whatsApp
) => {
  return api
    .post(UPDATE_PRIVACY, {
      location: location,
      workHistory: workHistory,
      education: education,
      workStatus: workStatus,
      email: email,
      whatsApp: whatsApp,
    })
    .then((response) => {
      return response;
    });
};

// const updateNotificationPreference = (
//   updateOnEmail,
//   updateOnWhatsApp,
//   updateOnSms
// ) => {
//   return api
//     .post(NOTIFICATION_PREFERENCE_ENDPOINT, {
//       updateOnEmail: updateOnEmail,
//       updateOnWhatsApp: updateOnWhatsApp,
//       updateOnSms: updateOnSms,
//     })
//     .then((response) => {
//       return response;
//     });
// };

const updateJobPreferences = (
  preferedRoles,
  preferedTeams,
  preferedLocation,
  preferedWorkmode,
  salaryCurrency,
  expectedSalary,
  salaryType,
  minExperience,
  maxExperience,
  dreamCompany
) => {
  return api
    .post(UPDATE_JOB_PREFERENCES_ENDPOINT, {
      preferedRoles: preferedRoles,
      preferedTeams: preferedTeams,
      preferedLocation: preferedLocation,
      preferedWorkmode: preferedWorkmode,
      salaryCurrency: salaryCurrency,
      expectedSalary: expectedSalary,
      salaryType: salaryType,
      minExperience: minExperience,
      maxExperience: maxExperience,
      dreamCompany: dreamCompany,
    })
    .then((res) => {
      return res;
    });
};

const updateRefereePreferences = (
  preferedRoles,
  preferedTeams,
  preferedLocation,
  preferedWorkmode,
  referralCurrency,
  minReferralBonus,
  minExperience,
  maxExperience
) => {
  return api
    .post(UPDATE_REFEREE_PREFERENCES_ENDPOINT, {
      preferedRoles: preferedRoles,
      preferedTeams: preferedTeams,
      preferedLocation: preferedLocation,
      preferedWorkmode: preferedWorkmode,
      referralCurrency: referralCurrency,
      minReferralBonus: minReferralBonus,
      minExperience: minExperience,
      maxExperience: maxExperience,
    })
    .then((res) => {
      return res;
    });
};

export {
  GenerateOtp,
  OtpVerification,
  AddLocation,
  AddSocialMedia,
  UpdateMailNumber,
  FetchAllLocation,
  addEducationDetails,
  updateEmail,
  updateMobile,
  fetchJobDetails,
  referJob,
  applyingForJob,
  getCandidateByName,
  getCandidateByEmail,
  getCandidateByMobile,
  updatePrivacy,
  updateJobPreferences,
  updateRefereePreferences,
  addRecommendation,
  // updateNotificationPreference,
};
