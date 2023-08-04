import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { isEmpty } from "../../utils/form_validators";
import { getLocations, getMaster } from "../../_services/view.service";
import { MASTER_TYPE } from "./../../constants/keys";
import SearchComboBox from "./../SearchComboBox";

const AddWorkModeRefrralsPreferencesModal = ({
  setPreferedLocation,
  setPreferedWorkmode,
}) => {
  const [workModes, setWorkModes] = useState([]);
  const [locationStatic, setLocationStatic] = useState();
  const [locationList, setLocationList] = useState([]);
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [selectedWorkMode, setselectedWorkMode] = useState();
  const [selectCity, setSelectCity] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const getAllMasterData = async () => {
    const workmodes = await getMaster(MASTER_TYPE.WORKMODE);
    let workmode = workmodes.map((el) => {
      return { name: el.masterValue, description: el.masterCode };
    });
    setWorkModes(workmode);
    const locations = await getLocations(MASTER_TYPE.LOCATION);
    let location = locations?.data
    // ?.map((el) => {
      // return { name: el.masterValue, description: el.Code };
    // });
    setLocationList(location);
    // const locationsStatic = await getMaster(MASTER_TYPE.LOCATION);
    // let locationStatic = locationsStatic?.filter((el) => {
    //   return el?.isRecent === true;
    // });
    // setLocationStatic(locationStatic);

    
  };
  // getLocations().then((res) => {
  //   setLocationList(res?.data);

  //   //  let locationStatic = res?.data?.filter((el) => {
  //   //   return el?.isRecent === true;
  //   // });
  //   //  setLocationStatic(locationStatic);
  //   //  console.log(locationStatic,"locationStatic");
  //    return res;
  // });
  useEffect(() => {
    setselectedWorkMode(
      candidateDetails?.refereePreferencesResponse?.preferedWorkmode
    );
    setSelectCity(
      candidateDetails?.refereePreferencesResponse?.preferedLocation
    );
    setSelectedLocation(
      candidateDetails?.refereePreferencesResponse?.preferedLocation
    );
  }, [candidateDetails]);

  useEffect(() => {
    getAllMasterData();
  }, []);
  if (selectedLocation?.length > 0) {
    setPreferedLocation(selectCity);
  }
  if (selectedWorkMode?.length > 0) {
    setPreferedWorkmode(selectedWorkMode);
  }
  return (
    <div className="job-preference-second-screen p-0 m-0 job-preferences-full-height">
      <div className="container p-2">
        <div className="job-preference-dialog-content">
          <div className="my-5 text-center d-flex justify-content-center align-content-center">
            <div>
              <div className="large-text-dark mt-4 mb-3">
                Work modes you want to see
              </div>
              <div className="row justify-content-center gap-3 mt-4">
                {workModes.map((workMode, index) => {
                  return (
                    <button
                      className={
                        selectedWorkMode?.includes(
                          workMode?.name === null ? "" : workMode?.name
                        )
                          ? "btn rounded-pill text-center form-select-width bg-black text-white p-2 ps-4 pe-4 fs-16"
                          : "btn rounded-pill bg-white text-center border-0 form-select-width p-2 ps-4 pe-4 fs-16"
                      }
                      onClick={(e) => {
                        if (!isEmpty(selectedWorkMode)) {
                          let itemIndex = selectedWorkMode.findIndex(
                            (tm) => tm === workMode?.name
                          );
                          const newSelectedWorkMode = [...selectedWorkMode];
                          if (newSelectedWorkMode.includes(workMode?.name)) {
                            newSelectedWorkMode.splice(itemIndex, 1);
                          } else {
                            newSelectedWorkMode.push(workMode?.name);
                          }
                          setselectedWorkMode(newSelectedWorkMode);
                          setPreferedWorkmode(newSelectedWorkMode);
                        } else {
                          setselectedWorkMode([workMode?.name]);
                          setPreferedWorkmode([workMode?.name]);
                        }
                      }}
                    >
                      {workMode?.name}
                    </button>
                  );
                })}
              </div>

              <div
                className="fs-20 fw-700 mt-5 mb-2"
                style={{ color: "#000000" }}
              >
                Preferred location
              </div>

              <div className="d-flex justify-content-center flex-wrap mt-4 gap-3">
                {locationStatic?.map((city, index) => {
                  return (
                    <div
                      className={
                        selectCity?.includes(
                          city?.masterValue === null ? "" : city?.masterValue
                        )
                          ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                          : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                      }
                      key={index}
                      onClick={() => {
                        if (!isEmpty(selectCity)) {
                          let itemIndex = selectCity.findIndex(
                            (tm) => tm === city?.masterValue
                          );
                          const newSelectCity = [...selectCity];
                          if (newSelectCity.includes(city?.masterValue)) {
                            newSelectCity.splice(itemIndex, 1);
                          } else {
                            newSelectCity.push(city?.masterValue);
                          }
                          setSelectCity(newSelectCity);
                          setPreferedLocation(newSelectCity);
                        } else {
                          setSelectCity([city?.masterValue]);
                          setPreferedLocation([city?.masterValue]);
                        }
                      }}
                    >
                      {city?.masterValue}
                    </div>
                  );
                })}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <SearchComboBox
                  inputData={locationList}
                  defaultValue={selectCity}
                  isMultiSelect={true}
                  inputCssClass={
                    "modal-input combo-search-box rounded-pill ps-5 bg-white mb-2 border-0 fs-14 box-shadow searchbox-fixed-width add-search-icon"
                  }
                  wrapperCssClass={"form-group text-start"}
                  placeholder={"Search or Select"}
                  onSelect={(event) => {
                    setSelectedLocation(event);
                    setSelectCity(event);
                    setPreferedLocation(event);
                  }}
                  searchListHeight={150}
                  badgeThemeCssClass={
                    "bg-black text-white rounded-pill ps-4 pe-4 p-2 fs-16 shadow-none"
                  }
                  hideBadges={true}
                  isAllowUserDefined={true}
                />
              </div>
              <div className="d-flex justify-content-center gap-3">
                {selectCity &&
                  selectCity.length > 0 &&
                  selectCity.map((city, index) => {
                    if (city !== "") {
                      return (
                        <div
                          key={index + 1}
                          className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline"
                          // onClick={() => setroleOutputListItem(city)}
                        >
                          <div className="d-flex flex-wrap">
                            <p>{city}</p>
                            <button
                              onClick={() => {
                                const newSelectCity = [...selectCity];
                                if (newSelectCity.includes(city)) {
                                  let itemIndex = newSelectCity.findIndex(
                                    (tm) => tm === city
                                  );
                                  newSelectCity.splice(itemIndex, 1);
                                  setSelectCity(newSelectCity);
                                  setPreferedLocation(newSelectCity);
                                }
                              }}
                              className=" btn-close-dropdown bg-transparent border-0 "
                            >
                              x
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorkModeRefrralsPreferencesModal;
