import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.scss";
import Candidate from "./pages/candidate/candidate";
import ContactPage from "./pages/contact_page";
import LoginPage from "./pages/login_page";
import NotFoundPage from "./pages/not_found_page";
import reportWebVitals from "./reportWebVitals";
import CandidateProfileModule from "./pages/candidate/member-profile/candidate_profile_module";
import CandidateProfilePage from "./pages/candidate/my-view/candidate_profile_page";
import RegistrationPage from "./pages/registration_page";
// import MemberProfile from "./components/routes";
import ForgetPasswordPage from "./pages/forget_password_page";
import ForgetPasswordLinkPage from "./pages/forget_password_link_page";
import JobDetailsPage from "./pages/job_details_page";
import JobSearchRecommondationPreferencePage from "./pages/job-search-recommondation-preference-page";
import AllJobsPage from "./pages/all_jobs_page";
import RecommendedJobsPage from "./pages/recommended_jobs_page";
import AllSavedJobs from "./pages/candidate/all_saved_jobs_page";
import MyApplicationsPage from "./pages/candidate/my_applications_page";
import AuthGuard from "./_services/authguard/auth-guard";
import MyApplicationDetailedViewPage from "./pages/candidate/my_application_detailed_view_page";
import FeedbackPage from "./pages/feedback_page";
import LinkInvalid from "./pages/link_invalid";
import AllReferredJobPage from "./pages/candidate/all_reffered_jobs_page";
import ReferralSavedJobsPage from "./pages/candidate/referral_saved_jobs_page";
import ReferralReferredJobsPage from "./pages/candidate/referral_referred_jobs_page";
import ViewReferralPage from "./pages/candidate/view_referral_page";
import ChangePasswordPage from "./pages/change_password_page";
import PrivateRoutes from "./_services/authguard/private-route";
import { JOB_DETAILS_PAGE_ROUTE } from "./constants/page-routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route element={<PrivateRoutes />}>
          <Route path="" element={<LoginPage />} exact />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="forget-password" element={<ForgetPasswordPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route
          path="forget-password-link/:tokenId"
          element={<ForgetPasswordLinkPage />}
        />
        <Route path="registration" element={<RegistrationPage />} />

        {/*<Route path="candidate/" element={<Candidate />}>*/}
        <Route path="" element={<CandidateProfilePage Candidate />} />

        <Route
          path={`${JOB_DETAILS_PAGE_ROUTE}/:id`}
          element={<JobDetailsPage />}
        />
        <Route element={<AuthGuard />}>
          {/* <Route
            path={`${JOB_DETAILS_PAGE_ROUTE}/:id`}
            element={<JobDetailsPage />}
          /> */}
          <Route path="candidate/" element={<Candidate />}>
            <Route path="" element={<CandidateProfilePage />} />
            <Route path="profile/*" element={<CandidateProfileModule />} />
            {/* <Route path="all-jobs" element={<AllJobsPage />} /> */}

            <Route path="saved-jobs" element={<AllSavedJobs />} />
            <Route
              path="referral-saved-jobs"
              element={<ReferralSavedJobsPage />}
            />
            <Route
              path="referral-referred-jobs"
              element={<ReferralReferredJobsPage />}
            />
            <Route path="view-referral/:id" element={<ViewReferralPage />} />
            <Route path="reffered-jobs" element={<AllReferredJobPage />} />
            <Route path="my-applications" element={<MyApplicationsPage />} />
            {/* <Route path="recommended-jobs" element={<RecommendedJobsPage />} /> */}
            <Route
              path="application-detailed-view/:id"
              element={<MyApplicationDetailedViewPage />}
            />
          </Route>
        </Route>

        <Route
          path="welcome"
          element={<JobSearchRecommondationPreferencePage />}
        />
        <Route path="feedback-page" element={<FeedbackPage />} />
        <Route path="link-invalid" element={<LinkInvalid />} />
        <Route path="candidate/all-jobs" element={<AllJobsPage Candidate />} />
        {/* <Route path="candidate/" element={<Candidate />}> */}
        <Route
          path="candidate/recommended-jobs"
          element={<RecommendedJobsPage Candidate />}
        />
        {/* </Route> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
