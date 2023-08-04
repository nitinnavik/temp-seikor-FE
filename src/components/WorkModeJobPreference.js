import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import close from "../assests/icons/ic-close-24.svg";
import SearchComboBox from "../components/SearchComboBox";
import { isEmpty } from "../utils/form_validators";
import { getLocations, getMaster } from "../_services/view.service";
import { MASTER_TYPE } from "./../constants/keys";

const WorkModeJobPreference = ({
  setPreferedLocation,
  setPreferedWorkmode,
}) => {
  const [locationStatic, setLocationStatic] = useState();

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [selectedWorkMode, setselectedWorkMode] = useState();
  const [selectCity, setSelectCity] = useState();

  const [locationList, setLocationList] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(
    candidateDetails?.userJobPreferences?.preferedLocation.map((item) => {
      return item;
    })
  );
  const [workModes, setWorkModes] = useState([]);

  const getAllMasterData = async () => {
    const workmodes = await getMaster(MASTER_TYPE.WORKMODE);
    let workmode = workmodes.map((el) => {
      return { name: el.masterValue, description: el.masterCode };
    });
    // const removeIndex = workmode?.indexOf("Open to all");
    // workmode?.splice(removeIndex, 1);

    setWorkModes(workmode);
    const locations = await getLocations(MASTER_TYPE.LOCATION);
    let location = locations?.data
    // ?.map((el) => {
      // return { name: el.masterValue, description: el.Code };
    // });
    setLocationList(location);
    // const locationsStatic = await getLocations(MASTER_TYPE.LOCATION);
    // let locationStatic = locationsStatic?.data?.filter((el) => {
    //   return el?.isRecent === true;
    // });
    // setLocationStatic(locationStatic);
  };
  
  useEffect(() => {
    setselectedWorkMode(candidateDetails?.userJobPreferences?.preferedWorkmode);
    setSelectCity(candidateDetails?.userJobPreferences?.preferedLocation);
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
    <div className="job-preference-second-screen p-0 m-0">
      <div className="container p-2">
        <div className="job-preference-dialog-content">
          <div className="my-5 text-center d-flex justify-content-center align-content-center">
            <div>
              <div className="large-text-dark mt-4 mb-3">
                What’s your preferred workmode?
              </div>
              <div className="d-flex justify-content-center flex-wrap mt-4 gap-3">
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
                      // key={index}
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
                if(city.masterValue==="Mumbai" || city.masterValue==="Delhi" || city.masterValue==="Bangalore" || city.masterValue==="Pune" || city.masterValue==="Hyderabad" ) { 
                  return (
                    <div
                    className="pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                      // className={
                      //   selectCity?.includes(
                      //     city?.masterValue === null ? "" : city?.masterValue
                      //   )
                      //     ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                      //     : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                      // }
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
                    }
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
                  isAllowUserDefined={false}
                />
              </div>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
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
                          <div className="d-flex gap-md-2 gap-1 align-items-center">
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
                              className="btn-close-dropdown bg-transparent border-0 "
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

export default WorkModeJobPreference;
