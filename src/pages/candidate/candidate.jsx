import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "../../components/common/header";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLocalStorage } from "../../utils/storage";
import { USER_ID } from "../../constants/keys";
import Loader from "../../components/common/loader";
import { useState } from "react";

const Candidate = () => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  // const isLoading = useStoreState((state) => state.candidate.isLoading);

  useEffect(() => {
    const userId = getLocalStorage(USER_ID);
    if (userId) {
      saveCandidateDetails(userId);
    }
  }, []);
  return (
    <div className="d-flex flex-column align-items-stretch flex-grow-1">
      <div className="">
        {/* {isLoading && <Loader />} */}
        <Header candidateDetails={candidateDetails} />
      </div>
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Candidate;
