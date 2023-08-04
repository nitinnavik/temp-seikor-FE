import { action, thunk } from "easy-peasy";
import { getCandidateDetails } from "./../_services/view.service";

export const candidateModel = {
  // isLoading: false,
  candidateDetails: {},

  // addIsLoading: action((state, payload) => {
  //   return (state.isLoading = payload);
  // }),

  addCandidateDetails: action((state, payload) => {
    return {
      ...state,
      candidateDetails: payload,
    };
  }),
  clearCandidateDetails: action((state, payload) => {
    return {
      ...state,
      candidateDetails: null,
    };
  }),
  saveCandidateDetails: thunk(async (actions, payload) => {
    // actions.addIsLoading(true);
    const { data } = await getCandidateDetails(payload);
    if (data.status === "SUCCESS") {
      actions.addCandidateDetails(data?.data);
    }
    // actions.addIsLoading(false);
  }),
  clearCandidateData: thunk((actions) => {
    actions.clearCandidateDetails();
  }),
};
