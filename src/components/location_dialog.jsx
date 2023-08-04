import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { onFormFeildsChange } from "../utils/form_validators";
import { AddLocation } from "../_services/member-profile.service";
import { validateField } from "../utils/form_validators";
import AutoComplete from "./auto-complete";
import { useStoreActions, useStoreState } from "easy-peasy";
import toaster from "../utils/toaster";
import { getLocalStorage } from "../utils/storage";
import { SOMETHING_WENT_WRONG, TOKEN, USER_ID } from "../constants/keys";
import { getLocations, getMaster } from "../_services/view.service";
import { MASTER_TYPE } from "../constants/keys";
import Loader from "./common/loader";
import { INVALID_INPUT } from "../constants/message";

const LocationDialog = (props) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );
  const isLoading = useStoreState((state) => state.candidate.isLoading);

  const token = getLocalStorage(TOKEN);

  const [locationList, setLocationList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const getLocation = async () => {
    const locations = await getLocations(MASTER_TYPE.LOCATION);
    let location = locations?.data;
    // ?.map((el) => {
    // return { name: el.masterValue, description: el.Code };
    // });
    setLocationList(location);
  };
  // getLocations().then((res) => {
  //   setLocationList(res?.data);
  //    return res;
  // });

  useEffect(() => {
    getLocation();
  }, []);
  const [location, setLocation] = useState(
    candidateDetails?.additionalInfoProfileResponse?.currentLocation
  );

  const onChangeLocation = (event) => {
    setLocation(event);
    let e = {
      target: {
        value: event,
        name: "currentLocation",
      },
    };
    onFormFeildsChange(e, locationData, setLocationData);
  };

  const [locationData, setLocationData] = useState({
    currentLocation: {
      valueText: "",
      errorText: "",
      check: ["required"],
    },
  });

  const updateLocation = () => {
    props.setShow3(false);

    props.setShowLoader(true);
    if (props?.isApplyForJobComponent && !props?.isCheck) {
      props?.setNewCandidateDetails({
        ...props?.newCandidateDetails,
        additionalInfoProfileResponse: {
          ...props?.newCandidateDetails?.additionalInfoProfileResponse,
          currentLocation: locationData?.currentLocation?.valueText,
        },
      });
      props?.setShow3(false);
      props?.setShowLoader(false);
    } else {
      AddLocation(locationData?.currentLocation?.valueText)
        .then((res) => {
          props.setShowLoader(false);
          toaster("success", "Details Updated successfully!");
          if (props?.isApplyForJobComponent) {
            props?.setNewCandidateDetails({
              ...props?.newCandidateDetails,
              additionalInfoProfileResponse: {
                ...props?.newCandidateDetails?.additionalInfoProfileResponse,
                currentLocation: locationData?.currentLocation?.valueText,
              },
            });
          }
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
        })
        .catch((err) => {
          props.setShowLoader(false);
          toaster("error", err);
        });
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <Modal
        show={props.show3}
        onHide={() => {
          props.setShow3(false);
          if (props?.setHideMainModal) {
            props?.setHideMainModal(false);
          }
        }}
        backdrop="static"
        fullscreen="lg-down"
        centered
        keyboard={false}
        className="lg-dialog-modal"
      >
        <Modal.Header closeButton className="dialog-header">
          <Modal.Title className="dialog-title">Location</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <label className="modalLabel" style={{ color: "#3E3E3E" }}>
            Current Location*
          </label>
          <AutoComplete
            inputData={locationList}
            defaultValue={
              props.isApplyForJobComponent
                ? props.newCandidateDetails?.additionalInfoProfileResponse
                    ?.currentLocation
                : candidateDetails?.additionalInfoProfileResponse
                    ?.currentLocation
            }
            inputCssClass={"modal-input"}
            wrapperCssClass={""}
            placeholder={"Search City Name"}
            onChange={(event) => {
              onChangeLocation(event);
            }}
            name="currentLocation"
            searchListHeight={150}
          />
          {props.isApplyForJobComponent && token && (
            <div className="dialog-footer-checkbox mt-2">
              <label>
                <input
                  type="checkbox"
                  onChange={() => props.setIsCheck(!props.isCheck)}
                  defaultChecked={props.isCheck}
                  className="mt-2 me-2 pt-1 mb-3 "
                />
                Save this to profile
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          <button
            onClick={() => {
              props.setShow3(false);
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
            }}
            className="btn btn-cancel"
          >
            Close
          </button>
          <button
            className="btn btn-dark btn-save"
            onClick={() => {
              // if (token) {
              //   updateLocation();
              //   if (props?.setHideMainModal) {
              //     props?.setHideMainModal(false);
              //   }
              // } else {
              updateLocation();
              props.setShow3(false);
              if (props?.setHideMainModal) {
                props?.setHideMainModal(false);
              }
              toaster("success", "Location saved!");
              // }
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LocationDialog;
