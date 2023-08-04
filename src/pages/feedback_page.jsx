import React from "react";
import ApplicationCompanyCard from "./../components/application_company_card";
import FeedbackHeader from "./../components/common/feedback_header";
import FeedbackComponent from "./../components/FeedbackComponent";

const FeedbackPage = () => {
  return (
    <div className="w-100 bg-white">
      <div className="container">
        <FeedbackHeader />
        <div className="d-flex justify-content-center">
          <div className="mt-3 col-lg-6 col-12 p-2">
            <div>
              <ApplicationCompanyCard />
            </div>
            <div className="mb-4">
              <FeedbackComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
