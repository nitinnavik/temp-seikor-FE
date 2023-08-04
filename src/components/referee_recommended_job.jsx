import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./common/loader";
import { DEFAULT_PAGE_SIZE } from "../constants/config";
import { isEmpty } from "../utils/form_validators";
import { filterfeaturedJobs } from "./../utils/featured_job_layout";
import toaster from "../utils/toaster";
import featuredImage from "./../assests/images/job-featured.jpg";
import JobCard from "../components/JobCard";
import JobCardCompany from "../components/JobCardCompany";
import JobCardExperience from "../components/JobCardExperience";
import JobCardLocation from "../components/JobCardLocation";
import JobCardReferralBonus from "../components/JobCardReferralBonus";
import JobCardSalary from "../components/JobCardSalary";
import JobCardSave from "../components/JobCardSave";
import JobCardWhyLook from "../components/JobCardWhyLook";
import jobCompanyLogo from "./../assests/images/job-company-logo.png";
import { convertInThousand } from "./../utils/utils";
import { Link } from "react-router-dom";
import NoDataFoundCard from "./common/no_data_found_card";
import ReferAJobDialog from "./refer_a_job_dialog";
import RecommendedJobDialog from "./recommended_job_dialog";
import { REFEREE_RECOMMENDED_EMPTY_MESSAGE } from "../constants/message";
import { JOB_DETAILS_PAGE_REFEREE_ROUTE } from "../constants/page-routes";
import { useStoreActions } from "easy-peasy";

const RefereeRecommendedJobPage = forwardRef((props, ref) => {
  const [showLoader, setShowLoader] = useState(false);
  // const [dataCount, setDataCount] = useState(0);
  const [currentOffset, setCurrentOffSet] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [isPromotedModalShow, setIsPromotedModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [jobMessage, setJobMessage] = useState();
  const [referJobShow, setReferJobShow] = useState(false);
  const [jobIdProps, setJobIdProps] = useState();
  const [referButtonClicked, setReferButtonClicked] = useState();
  const [disableReferralBtn, setDisableReferralBtn] = useState(false);
  const setNonLoginReferData = useStoreActions(
    (state) => state.setNonLoginReferData
  );
  useImperativeHandle(ref, () => ({
    refresh() {
      props?.setPage(0);
      props?.fetchRefereeRecommendedJobs();
    },
  }));

  // const fetchMoreData = () => {
  //   setShowLoader(true);

  //   props?.setAllRefereeFilterData({
  //     ...props?.allRefereeFilterData,
  //     pageNo: props?.allRefereeFilterData?.pageNo + 1,
  //     pageSize: DEFAULT_PAGE_SIZE,
  //   });
  //   props?.setCount(props?.allRefereeFilterData.pageNo);
  //   props?.fetchRefereeRecommendedJobs(props?.allRefereeFilterData);
  //   setShowLoader(false);
  // };

  useEffect(() => {
    // fetchMoreData();
    // props?.onJobSaved();
    props?.fetchRefereeRecommendedJobs(props?.allRefereeFilterData);
  }, []);

  const SetJobDetailsObject = (jobDetails) => {
    const jobTitle = jobDetails?.jobTitle;
    const companyName = jobDetails?.companyName;
    const companyLogo = jobDetails?.companyLogo;

    props?.setJobDetailsProps({
      ...props?.jobDetailsProps,
      jobTitle,
      companyName,
      companyLogo,
    });
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={props?.dataCount}
        next={() => props?.onJobSaved()}
        hasMore={props?.dataCount > props?.count}
        className="container-fluid"
      >
        {props?.showLoader && <Loader headerLess={true} />}
        {props?.refereeJobList &&
        props?.refereeJobList?.length === 0 &&
        showLoader === false ? (
          <NoDataFoundCard
            text={
              props?.refereeJobMessage
                ? props?.refereeJobMessage
                : REFEREE_RECOMMENDED_EMPTY_MESSAGE
            }
          />
        ) : (
          <div className="row jobs">
            {props.refereeJobList?.map((item, index) => {
              if (item?.isPromoted === true) {
                console.log(item,"recommended job")
                return (
                  <div
                    className="col-12 col-sm-12 col-md-12 col-lg-6 mb-4"
                    key={index}
                  >
                    <div
                      className="featured-job-card h-100"
                      style={{
                        backgroundImage: `url(${featuredImage})`,
                      }}
                    >
                      <div className="card-tag-and-save">
                        <div className="d-flex align-items-center">
                          {item?.isPromoted === true && (
                            <div className="tag">
                              <span className="badge custom-red">
                                {item?.jobStatus}
                              </span>
                            </div>
                          )}
                          <div className="save-job-wrapper ms-2">
                            <div className="save-job-action">
                              <JobCardSave
                                saveStatus={item?.isSavedApplied}
                                jobId={item?.jobId}
                                isReferer={item?.isSavedReferal}
                                onJobSaved={() => {
                                  if (props?.onJobSaved) {
                                    props?.onJobSaved();
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="job-company-logo-wrapper">
                        <div className="job-company-logo">
                          {/* <img
                          src={`data:image/jpeg;base64 , ${item?.companyLogo}`}
                          alt=""
                          width="50px"
                          height="50px"
                        /> */}
                          <JobCardCompany
                            logo={item?.companyLogo}
                            companyName={item?.companyName}
                            name={item?.jobTitle}
                            display="column"
                          />
                        </div>
                      </div>
                      <div className="job-content">
                        <p className="sub-heading">{item?.companyName}</p>
                        <h3 className="heading">{item?.jobTitle}</h3>
                        <div className="job-other-info d-flex align-content-start flex-wrap">
                          <div className="location-wrapper">
                            <JobCardLocation text={item?.jobLocation} />
                          </div>
                          <div className="experience-wrapper">
                            <JobCardExperience
                              text={`${Math.floor(item?.jobMinExp)}-
                              ${Math.floor(item?.jobMaxExp)} yrs`}
                            />
                          </div>
                          <div className="package-wrapper">
                            <JobCardSalary
                              // text={`${convertInThousand(item?.jobMinSalary)}-
                              //   ${convertInThousand(item?.jobMaxSalary)}K`}
                              data={item}
                            />
                          </div>
                          <div className="package-wrapper">
                            <JobCardReferralBonus
                              text={Number(item?.referalBonus)}
                              currencyType={item?.salaryCurrency}
                            />
                          </div>
                        </div>
                        <div className="description">
                          {item?.jobAdvantages ? item?.jobAdvantages[0] : null}
                        </div>
                      </div>
                      <div className="feature-job-actions">
                        <div className="row gx-3 gy-3">
                          <div className="col-6 col-sm-6 col-md-3">
                            <RecommendedJobDialog
                              id={item?.jobId}
                              applicationStatus={item?.applicationStatus}
                              onJobApplied={() => {
                                if (props?.onJobApplied) {
                                  props?.onJobApplied();
                                }
                              }}
                              refererId={item?.refererId}
                            />
                          </div>

                          <div className="col-6 col-sm-6 col-md-3">
                            <button
                              type="button"
                              className="btn btn-light w-100 alljobs-applied-btn"
                              onClick={() => {
                                setReferJobShow(true);
                                setJobIdProps(item?.jobId);
                                SetJobDetailsObject(item);
                              }}
                            >
                              Refer
                            </button>
                          </div>
                          <div className="col-12 col-sm-12 col-md-6">
                            <Link
                              style={{ height: "40px" }}
                              to={`/job/${item?.jobId}`}
                              type="button"
                              className="d-flex align-items-center justify-content-center btn btn-primary w-100 fs-12 fw-700"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">
                    <JobCard>
                      <div className="save-job-action">
                        <div className="d-flex justify-content-end align-items-center">
                          <span className="badge custom-red me-2">
                            {item?.jobStatus}
                          </span>
                          <JobCardSave
                            saveStatus={item?.isSavedApplied}
                            jobId={item?.jobId}
                            isReferer={item?.isSavedReferal}
                            onJobSaved={() => {
                              if (props?.onJobSaved) {
                                props?.onJobSaved();
                              }
                            }}
                          />
                        </div>
                      </div>
                      {(item?.companyLogo || item?.companyName) && (
                        <JobCardCompany
                          logo={item?.companyLogo}
                          companyName={item?.companyName}
                          name={item?.jobTitle}
                          display="column"
                        />
                      )}

                      <div className="job-other-info d-flex align-content-start flex-wrap">
                        <div className="location-wrapper">
                          <JobCardLocation text={item?.jobLocation} />
                        </div>
                        <div className="experience-wrapper">
                          <JobCardExperience
                            text={`${Math.floor(item?.jobMinExp)}-
                              ${Math.floor(item?.jobMaxExp)} yrs`}
                          />
                        </div>
                      </div>
                      <div className="job-other-info d-flex align-content-start flex-wrap mt-0">
                        <div className="package-wrapper">
                          <JobCardSalary
                            // text={`${convertInThousand(item?.jobMinSalary)}-
                            //     ${convertInThousand(item?.jobMaxSalary)}K`}
                            data={item}
                          />
                        </div>

                        <div className="package-wrapper">
                          <JobCardReferralBonus
                            text={Number(item?.referalBonus)}
                            currencyType={item?.salaryCurrency}
                          />
                        </div>
                      </div>
                      <div className="why-look-job">
                        <JobCardWhyLook
                          text={
                            item?.jobAdvantages ? item?.jobAdvantages[0] : null
                          }
                        />
                      </div>
                      <div className="key-skills mt-3">
                        <p className="fs-12 fw-400 color-secondar">
                          Key Skills
                        </p>
                        {item?.skillRequired &&
                          item?.skillRequired?.length > 0 && (
                            <div className="d-flex flex-wrap mt-2 gap-2">
                              {item?.skillRequired?.map((skill, index) => (
                                <div className="job-tag" key={index}>
                                  {skill}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="all-job-action">
                        <div className="d-flex gap-2">
                          <div className="col-6">
                            <RecommendedJobDialog
                              id={item?.jobId}
                              applicationStatus={item?.applicationStatus}
                              onJobApplied={() => {
                                if (props?.onJobApplied) {
                                  props?.onJobApplied();
                                }
                              }}
                            />
                          </div>

                          <div className="col-6">
                            <button
                              type="button"
                              className="btn btn-outline-dark w-100 alljobs-applied-btn"
                              onClick={() => {
                                setReferJobShow(true);
                                setJobIdProps(item?.jobId);
                                SetJobDetailsObject(item);
                              }}
                            >
                              Refer
                            </button>
                          </div>
                        </div>
                        <div className="row pt-2 ps-2">
                          <Link
                            style={{ height: "40px" }}
                            to={{
                              pathname: `/job/${item?.jobId}${JOB_DETAILS_PAGE_REFEREE_ROUTE}`,
                            }}
                            type="button"
                            className="d-flex align-items-center justify-content-center btn btn-dark w-100 fs-12 fw-700"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </JobCard>
                  </div>
                );
              }
            })}
          </div>
        )}
      </InfiniteScroll>
      <ReferAJobDialog
        onClosedButtonClick={() => {
          setReferJobShow(false);
          setNonLoginReferData();
        }}
        isShow={referJobShow}
        referButtonClicked={referButtonClicked}
        setReferButtonClicked={setReferButtonClicked}
        disableReferralBtn={disableReferralBtn}
        setDisableReferralBtn={setDisableReferralBtn}
        referJobId={jobIdProps}
        referJobShow={referJobShow}
        setReferJobShow={setReferJobShow}
        jobDetailsProps={props?.jobDetailsProps}
      />
    </div>
  );
});

export default RefereeRecommendedJobPage;
