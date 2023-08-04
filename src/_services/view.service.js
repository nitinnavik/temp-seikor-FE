import {
  ADD_SKILLS,
  DOWNLOAD_FILE,
  ADD_WORK_EXPERIENCE,
  GET_MASTER,
  GET_WORK_EXPERIENCE,
  UPDATE_RESUME,
  UPLOAD_FILE,
  VIWECANDIDATE,
  GET_APPLIED_JOBS,
  GET_RECOMMENDED_JOBS,
  GET_ALL_JOBS,
  DELETE_EDUCATION_EXPERIENCE,
  DELETE_WORK_EXPERIENCE,
  FETCH_NOTIFICATIONS_ENDPOINT,
  FETCH_READ_NOTIFICATIONS_ENDPOINT,
  FETCH_CLEAR_NOTIFICATIONS_ENDPOINT,
  REQUEST_PAYMENT_ENDPOINT,
  FETCH_PAYMENT_DETAILS_ENDPOINT,
  GET_USER_ACCOUTDETAILS_ENDPOINT,
  GET_LOCATION_MASTER_ENDPOINT,
} from "../constants/api-endpoints";
import api from "./api";
import { GET_CURRENCY_ENDPOINT } from "./../constants/api-endpoints";

const UserName = (id) => {
  return api
    .get(VIWECANDIDATE + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      console.log("response", response);

      return response;
    });
};
const deleteEducationalExperience = (id) => {
  return api
    .get(DELETE_EDUCATION_EXPERIENCE + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      return response;
    });
};

const deleteWorkExperience = (id) => {
  return api
    .get(DELETE_WORK_EXPERIENCE + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      return response;
    });
};
const Education = (id) => {
  return api
    .get(VIWECANDIDATE + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      console.log("response", response);

      return response;
    });
};

const getWorkExperience = (id) => {
  return api
    .get(GET_WORK_EXPERIENCE + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      return response;
    });
};

const getCandidateDetails = (id) => {
  return api.get(VIWECANDIDATE + id).then((response) => {
    return response;
  });
};

const getMaster = (type) => {
  return api
    .post(GET_MASTER, {
      mType: type,
      pageNo: 0,
      pageSize: 0,
    })
    .then((response) => {
      if (
        response?.status === 200 &&
        response?.data?.data &&
        response?.data?.data?.length > 0
      ) {
        return response?.data?.data;
      } else {
        return [];
      }
    });
};
const getLocations = () => {
  return api.get(GET_LOCATION_MASTER_ENDPOINT).then((response) => {
    return response;
  });
};

const uploadFile = (data) => {
  console.log("data", data);
  return api
    .post(UPLOAD_FILE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      if (response?.status === 200 && response?.data) {
        return response?.data;
      } else {
        return null;
      }
    });
};

const updateResume = (data) => {
  return api.post(UPDATE_RESUME, data).then((response) => {
    if (response?.status === 200 && response?.data) {
      return response?.data;
    } else {
      return null;
    }
  });
};

const addCandidateSkills = (data) => {
  return api.post(ADD_SKILLS, data).then((response) => {
    console.log("response", response);
    if (response?.status === 200 && response?.data?.data) {
      return response?.data?.data;
    } else {
      return null;
    }
  });
};

const downloadFile = async (url) => {
  return api
    .get(url, {
      responseType: "blob",
      // headers: {
      //   Accept: "application/pdf",
      //   "Content-Type": "application/pdf",
      // },
    })
    .then((response) => {
      if (response?.status === 200 && response?.data) {
        // let fileName = response["headers"]["content-disposition"];
        // fileName = fileName && fileName.replace("attachment; filename=", "");
        // fileName = fileName && JSON.parse(fileName);
        // const fileExtension =
        //   fileName && fileName.length > 0 && fileName.split(".")[1];
        // const obj = {
        //   fileName,
        //   fileExtension,
        //   blobData: response?.data,
        // };
        // console.log(obj);
        // console.log(response?.data);
        return URL.createObjectURL(response?.data);
        // return obj;
      } else {
        return null;
      }
    });
};

const addCandidateWorkExperience = (data) => {
  return api.post(ADD_WORK_EXPERIENCE, data).then((response) => {
    if (response?.status === 200 && response?.data?.data) {
      return response;
    } else if (response?.status === 400 && response?.data?.data) {
      return response;
    } else {
      return null;
    }
  });
};

const getAppliedJobs = (data) => {
  return api.post(GET_APPLIED_JOBS, data).then((response) => {
    if (response?.status === 200 && response?.data?.data) {
      return response?.data?.data;
    } else {
      return [];
    }
  });
};

const getRecommendedJobs = (data) => {
  return api.post(GET_RECOMMENDED_JOBS, data).then((response) => {
    if (response?.status === 200 && response?.data?.data) {
      return {
        data: response?.data?.data,
        totalCount: response?.data?.totalRecord,
        message: response?.data?.message,
        status: response?.status,
      };
    } else {
      return {
        data: [],
        message: response?.data?.message,
        status: response?.status,
      };
    }
  });
};

const getAllJobs = (data) => {
  return api.post(GET_ALL_JOBS, data).then((response) => {
    if (
      response?.status === 200 &&
      response?.data?.data &&
      response?.data?.data?.length > 0
    ) {
      return {
        data: response?.data?.data,
        totalCount: response?.data?.totalRecord,
        status: response?.status,
      };
    } else {
      return {
        data: [],
        message: response?.data?.message,
        status: response?.data?.status,
      };
    }
  });
};

const getCurrency = () => {
  return api.get(GET_CURRENCY_ENDPOINT).then((response) => {
    if (response?.status === 200 && response?.data) {
      return response?.data;
    } else {
      return [];
    }
  });
};

const getNotifications = (pageNo, pageSize) => {
  return api
    .post(FETCH_NOTIFICATIONS_ENDPOINT, {
      pageNo: pageNo,
      pageSize: pageSize,
    })
    .then((response) => {
      return response;
    });
};
const getReadNotifications = (notificationId) => {
  return api
    .post(FETCH_READ_NOTIFICATIONS_ENDPOINT, {
      notificationId: notificationId,
    })
    .then((response) => {
      return response;
    });
};

const getClearNotifications = (notificationId) => {
  return api
    .post(FETCH_CLEAR_NOTIFICATIONS_ENDPOINT, {
      notificationId: notificationId,
    })
    .then((response) => {
      return response;
    });
};

const getRequestPayment = (data) => {
  return api.post(REQUEST_PAYMENT_ENDPOINT, data).then((response) => {
    return response;
  });
};

// const getAccountDetails=()=>{
//   return api.get(GET_USER_ACCOUTDETAILS_ENDPOINT).then((response) => {
//     return response;
//   });
// };

const getPaymentAccountDetails = () => {
  return api.get(FETCH_PAYMENT_DETAILS_ENDPOINT).then((response) => {
    return response;
  });
};

export {
  getLocations,
  UserName,
  Education,
  getCandidateDetails,
  getMaster,
  uploadFile,
  updateResume,
  addCandidateSkills,
  downloadFile,
  getWorkExperience,
  addCandidateWorkExperience,
  getAppliedJobs,
  getRecommendedJobs,
  deleteEducationalExperience,
  deleteWorkExperience,
  getAllJobs,
  getCurrency,
  getNotifications,
  getReadNotifications,
  getRequestPayment,
  getClearNotifications,
  getPaymentAccountDetails,
  // getAccountDetails,
};
