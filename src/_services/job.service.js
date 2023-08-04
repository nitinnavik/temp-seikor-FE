import {
  CREATE_FEEDBACK_JOBS,
  FETCH_ALL_MESSAGES_ENDPOINT,
  FETCH_REFEREE_OVERVIEW_ENDPOINT,
  FETCH_REFEREE_RECOMMENDATION_ENDPOINT,
  FETCH_REFEREE_REFERED_JOBSDETAILS_ENDPOINT,
  FETCH_REFEREE_REFERED_JOBS_ENDPOINT,
  FETCH_REFEREE_SAVED_JOBS_ENDPOINT,
  GET_APPLICATION_RETRACT,
  GET_APPLIED_JOBS_ENDPOINT,
  GET_REFFERED_JOB_ENDPOINT,
  GET_SAVED_JOB_ENDPOINT,
  RETRACT_APPLICATION_ENDPOINT,
  SEND_MESSAGE_ENDPOINT,
  UPDATE_SAVED_AND_PIN_JOB_ENDPOINT,
} from "../constants/api-endpoints";
import api from "./api";
import { GET_APPLIED_JOBS_BY_ID_ENDPOINT } from "./../constants/api-endpoints";

const getSavedJobs = (filter) => {
  return api.post(GET_SAVED_JOB_ENDPOINT, filter).then((response) => {
    return response;
  });
};

const getAppliedJobs = (filter) => {
  return api.post(GET_APPLIED_JOBS_ENDPOINT, filter).then((response) => {
    return response;
  });
};

const getAppliedJobsById = (id) => {
  return api.get(`${GET_APPLIED_JOBS_BY_ID_ENDPOINT}${id}`).then((response) => {
    return response;
  });
};

const updateSavedAndPinJob = (jobId, isSave, isReferrer, isPin) => {
  return api
    .post(UPDATE_SAVED_AND_PIN_JOB_ENDPOINT, {
      jobId: jobId,
      isSave: isSave,
      isReferrer: isReferrer,
      isPin: isPin,
    })
    .then((response) => {
      return response.data;
    });
};
const getApplicationRetract = (id) => {
  return api.get(RETRACT_APPLICATION_ENDPOINT + id).then((response) => {
    return response;
  });
};
const getRefferedJobs = (filter) => {
  return api.post(GET_REFFERED_JOB_ENDPOINT, filter).then((response) => {
    return response;
  });
};

const fetchRefereeOverview = () => {
  return api.get(FETCH_REFEREE_OVERVIEW_ENDPOINT).then((response) => {
    return response;
  });
};

const fetchRefereeRecommendation = (data) => {
  return api
    .post(FETCH_REFEREE_RECOMMENDATION_ENDPOINT, data)
    .then((response) => {
      return response;
    });
};

const fetchRefereeSavedJobs = (filter) => {
  return api
    .post(FETCH_REFEREE_SAVED_JOBS_ENDPOINT, filter)
    .then((response) => {
      return response;
    });
};

const fetchRefereeReferrals = (filter) => {
  return api
    .post(FETCH_REFEREE_REFERED_JOBS_ENDPOINT, filter)
    .then((response) => {
      return response;
    });
};
const fetchReferedJobDetails = (referalId) => {
  return api
    .post(FETCH_REFEREE_REFERED_JOBSDETAILS_ENDPOINT, {
      referalId,
    })
    .then((response) => {
      return response;
    });
};
const giveFeedbackJobs = (data) => {
  return api
    .post(CREATE_FEEDBACK_JOBS, {
      jobId: data.jobId,
      jobAppId: data.jobAppId,
      userId: data.userId,
      feedback: data.feedback,
      rating: data.rating,
    })
    .then((response) => {
      return response;
    });
};

const sendMessage = (jobId, message, jobReffaralId) => {
  return api
    .post(SEND_MESSAGE_ENDPOINT, {
      message: message,
      jobId: jobId,
      jobReffaralId: jobReffaralId,
    })
    .then((response) => {
      return response.data;
    });
};

const fetchMessage = (pageNo, pageSize, jobId, jobReffaralId) => {
  return api
    .post(FETCH_ALL_MESSAGES_ENDPOINT, {
      pageNo: pageNo,
      pageSize: pageSize,
      jobId: jobId,
      jobReffaralId: jobReffaralId,
    })
    .then((response) => {
      return response.data;
    });
};

export {
  getSavedJobs,
  getAppliedJobs,
  updateSavedAndPinJob,
  getRefferedJobs,
  fetchRefereeOverview,
  fetchRefereeRecommendation,
  fetchRefereeSavedJobs,
  fetchRefereeReferrals,
  getAppliedJobsById,
  giveFeedbackJobs,
  getApplicationRetract,
  fetchReferedJobDetails,
  sendMessage,
  fetchMessage,
};
