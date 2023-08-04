import {
  USEREXIST,
  REGISTRATION_ENDPOINT,
  PROFILE_ABOUTME,
  COMPANY_DROPDOWN,
  CURRENT_ROLE_DROPDOWN,
  CURRENT_DESIGNATION,
  RETRIEVE_PASSWORD,
  NEW_PASSWORD,
  ADD_BASIC_DETAILS_ENDPOINT,
  UPDATE_CANDIDATE_NAME,
  CHANGE_PASSWORD,
  DELETE_RESUME,
  GET_COUNTRY_MASTER_ENDPOINT,
} from "../constants/api-endpoints";
import { EMAIL_EXIST, MOBILE_EXIST } from "../constants/message";
import api from "./api";
const registerCandiate = (name, email, mobile, password, whatsappAlert) => {
  return api
    .post(REGISTRATION_ENDPOINT, {
      userType: "Candidate",
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      username: "",
      company: "catseye",
      isWhatsAppAlert: whatsappAlert,
    })
    .then((response) => {
      return response;
    });
};

const userMessage = (aboutMe) => {
  return api.post(PROFILE_ABOUTME, { aboutMe }).then((response) => {
    console.log("response", response);
    return response;
  });
};

const userCurrentDetails = (currentDesignation, company, jobSearchStatus) => {
  return api
    .post(CURRENT_DESIGNATION, { currentDesignation, company, jobSearchStatus })
    .then((response) => {
      console.log("response", response);
      return response;
    });
};

const companyDropdown = () => {
  return api.get(COMPANY_DROPDOWN).then((response) => {
    console.log("response", response);
    return response;
  });
};

const roleDropdown = () => {
  return api.get(CURRENT_ROLE_DROPDOWN).then((response) => {
    console.log("response", response);
    return response;
  });
};

const emailValidation = (formData, setFormData) => {
  return api
    .post(USEREXIST, {
      user: formData?.email?.valueText,
    })
    .then((response) => {
      let isValid = true;
      if (response.data) {
        formData.email.errorText = EMAIL_EXIST;
        isValid = false;
      } else {
        formData.email.errorText = "";
        isValid = true;
      }
      setFormData(formData);
      return response;
    });
};
const emailFinding = (email) => {
  return api
    .post(USEREXIST, {
      user: email,
    })
    .then((response) => {
      return response;
    });
};
const mobileValidation = (formData, setFormData) => {
  return api
    .post(USEREXIST, {
      user: formData?.countrycode?.valueText + formData?.phonenumber?.valueText,
    })
    .then((response) => {
      let isValid = true;
      if (response.data) {
        formData.phonenumber.errorText = MOBILE_EXIST;
        isValid = false;
      } else {
        formData.phonenumber.errorText = "";
        isValid = true;
      }
      setFormData(formData);
      return response;
    });
};

const mobileValidationWithCode = (formData, setFormData) => {
  return api
    .post(USEREXIST, {
      user: formData?.mobile?.valueText,
    })
    .then((response) => {
      let isValid = true;
      if (response.data) {
        formData.mobile.errorText = MOBILE_EXIST;
        isValid = false;
      } else {
        formData.mobile.errorText = "";
        isValid = true;
      }
      setFormData(formData);
      return response;
    });
};

const newPassword = (userName, password, token) => {
  return api
    .post(NEW_PASSWORD, {
      userName,
      password,
      token,
    })
    .then((response) => {
      // console.log("response", response);
      return response;
    })
    .catch((error) => {
      console.log(error.response);
    });
};

const retrievePassword = (email) => {
  return api
    .post(RETRIEVE_PASSWORD, {
      email: email,
    })
    .then((response) => {
      console.log("response", response);
      return response;
    })
    .catch((error) => {
      console.log(error.response);
    });
};
const changePassword = (username, oldPassword, newPassword) => {
  return api
    .post(CHANGE_PASSWORD, {
      username,
      oldPassword,
      newPassword,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error.response);
    });
};
const updateProfilePicture = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(ADD_BASIC_DETAILS_ENDPOINT, obj, {
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

const updateCandidateName = (obj) => {
  let token = localStorage.getItem("token");
  return api
    .post(UPDATE_CANDIDATE_NAME, obj, {
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

const deleteCandidateResume = (fileId) => {
  let token = localStorage.getItem("token");
  return api
    .get(DELETE_RESUME + `${fileId}`, {
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

const getCountryMaster = () => {
  return api.get(GET_COUNTRY_MASTER_ENDPOINT).then((response) => {
    return response;
  });
};

export {
  emailValidation,
  mobileValidation,
  registerCandiate,
  userMessage,
  companyDropdown,
  roleDropdown,
  userCurrentDetails,
  newPassword,
  retrievePassword,
  updateProfilePicture,
  updateCandidateName,
  changePassword,
  deleteCandidateResume,
  getCountryMaster,
  mobileValidationWithCode,
};
