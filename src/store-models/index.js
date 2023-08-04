import { action, thunk } from "easy-peasy";
// import { LOGIN_ENDPOINT } from "../constants/api-endpoints";
// import api from "./../_services/api";
import { candidateModel } from "./candidate";

export const model = {
  // loggedIn: {},
  // addLoggedIn: action((state, payload) => {
  //   return {
  //     ...state,
  //     loggedIn: payload,
  //   };
  // }),
  // saveLoggedIn: thunk(async (actions, payload) => {
  //   const { data } = await api.post(LOGIN_ENDPOINT, payload);
  //   actions.addLoggedIn(data);
  // }),
  candidate: candidateModel,
  isNewlyRegistered: false,
  setNewlyRegister: action((state, payload) => {
    return {
      ...state,
      isNewlyRegistered: payload,
    };
  }),
  isApplyingWithOutLogin: false,
  setIsApplyingWithOutLogin: action((state, payload) => {
    return {
      ...state,
      isApplyingWithOutLogin: payload,
    };
  }),
  applyForJobNonLoginUser: null,
  setApplyForJobNonLoginUser: action((state, payload) => {
    return {
      ...state,
      applyForJobNonLoginUser: payload,
    };
  }),
  currentJobDetails: {},
  setCurrentJobDetails: action((state, payload) => {
    return {
      ...state,
      currentJobDetails: payload,
    };
  }),
  nonLoginSaveForApplying: null,
  setNonLoginSaveForApplying: action((state, payload) => {
    return {
      ...state,
      nonLoginSaveForApplying: payload,
    };
  }),
  isNonLoginUserApplyDetailJob: false,
  setIsNonLoginUserApplyDetailJob: action((state, payload) => {
    return {
      ...state,
      isNonLoginUserApplyDetailJob: payload,
    };
  }),
  isReferringWithOutLogin: false,
  setIsReferringWithOutLogin: action((state, payload) => {
    return {
      ...state,
      isReferringWithOutLogin: payload,
    };
  }),
  isReferringFromDetailsWithOutLogin: false,
  setIsReferringFromDetailsWithOutLogin: action((state, payload) => {
    return {
      ...state,
      isReferringFromDetailsWithOutLogin: payload,
    };
  }),
  nonLoginReferData: null,
  setNonLoginReferData: action((state, payload) => {
    return {
      ...state,
      nonLoginReferData: payload,
    };
  }),
  tempQuestions: null,
  setTempQuestions: action((state, payload) => {
    return {
      ...state,
      tempQuestions: payload,
    };
  }),
};
