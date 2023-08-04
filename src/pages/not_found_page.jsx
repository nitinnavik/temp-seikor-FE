import React from "react";
import { Link } from "react-router-dom";
import Header from "./../components/common/header";

const NotFoundPage = (props) => {
  return (
    <>
      <div className="d-flex flex-column align-items-stretch flex-grow-1">
        {props?.hideHeader ? (
          <div className="d-none">
            <Header />
          </div>
        ) : (
          <div className="">
            <Header />
          </div>
        )}
        <div className="flex-grow-1 background-404-image px-4">
          <div className="container">
            <div className="d-flex align-items-end align-items-md-center text-white non-found-height-404">
              <div className="">
                <div className="fs-64 fw-700 "> Error 404 </div>
                <div className="fs-32 pt-0">
                  {" "}
                  Looks like you have found a glitch
                </div>
                <div className="fs-16 pt-5">
                  This is not the place you are looking for.
                  <br /> Use the navigation above to navigate or go Home
                </div>
                <Link
                  to="/candidate"
                  className="btn-primary btn fs-12 mt-4 w-35 p-2"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
