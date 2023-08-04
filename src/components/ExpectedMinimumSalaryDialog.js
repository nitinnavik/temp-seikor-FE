import React, { useState, useEffect } from "react";
import close from "../assests/icons/ic-close-24.svg";
import SearchComboBox from "../components/SearchComboBox";
import downArrow from "../assests/icons/ic-chevron-down-16.svg";
import { useStoreState } from "easy-peasy";
import { getCurrency, getMaster } from "../_services/view.service";
import { MASTER_TYPE } from "../constants/keys";
import { GET_CURRENCY_ENDPOINT } from "../constants/api-endpoints";

const ExpectedMinimumSalaryDialog = ({
  setExpectedSalary,
  setSalaryCurrency,
  setSalaryType,
  salaryType,
}) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const salaryTypes = ["Annual", "Monthly"];
  const [selectSalaryType, setSelectSalaryType] = useState("");

  const [currencies, setCurrencies] = useState([]);
  const [curenciesStatic, setCurrenciesStatic] = useState([]);
  const [selectCurrency, setSelectCurrency] = useState();
  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();


  const getAllMasterData = async () => {
    const fetchCurrencies = await getCurrency(GET_CURRENCY_ENDPOINT);
    setCurrencies(
      fetchCurrencies?.map((item) => {
        return {
          name: item?.code,
          description: item?.name,
        };
      })
    );
    let currencystatic = fetchCurrencies?.filter((el) => {
      return el?.isRecent === true;
    });
    setCurrenciesStatic(currencystatic);
  };

  useEffect(() => {
    setSelectCurrency(candidateDetails?.userJobPreferences?.salaryCurrency);
    setExpectedSalary(candidateDetails?.userJobPreferences?.expectedSalary);
    setSelectSalaryType(candidateDetails?.userJobPreferences?.salaryType);
  }, [candidateDetails]);

  useEffect(() => {
    getAllMasterData();
  }, []);

  // useEffect(() => {
  //   if (selectSalaryType == "") {
  //     setSalaryType("Annual");
  //   }
  // }, [selectSalaryType]);

  if (selectCurrency) {
    setSalaryCurrency(selectCurrency);
  }

  return (
    <div className="model-gradient-background p-0 m-0 job-preferences-full-width">
      <div className="container p-2">
        <div className="job-preference-dialog-content">
          <div className="d-flex justify-content-center text-center">
            <div className="mt-5  ">
              <h2 className="color-primary fs-24 fw-700 mb-3 ">
                Expected Minimum Salary
              </h2>
              <br />

              <div className="d-flex justify-content-center">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="80"
                  maxLength="2"
                  defaultValue={`${
                    candidateDetails?.userJobPreferences?.expectedSalary
                      ? candidateDetails?.userJobPreferences?.expectedSalary
                      : 0
                  }`}
                  className="bg-white border-dark cursor-text input-group-text text-center min-salary-input"
                  onChange={(e) => {
                    //> 0 ? e.target.value : 0
                    setExpectedSalary(e.target.value);
                  }}
                  onKeyDown={blockInvalidChar}
                />
              </div>
              <div></div>

              <div className="grid justify-content-center gap-3">
                <div className="d-flex justify-content-center flex-wrap gap-3 mt-3  mb-3">
                  {curenciesStatic &&
                    curenciesStatic.length > 0 &&
                    curenciesStatic.map((roleOutputItem, index) => {
                      if (
                        roleOutputItem.code === "EUR" ||
                        roleOutputItem.code === "GBP" ||
                        roleOutputItem.code === "INR" ||
                        roleOutputItem.code === "USD"
                      ) {
                        return (
                          <div
                            key={index + 1}
                            className={
                              selectCurrency?.includes(
                                roleOutputItem?.code === null
                                  ? ""
                                  : roleOutputItem?.code
                              )
                                ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                                : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                            }
                            // className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline"
                            onClick={() => {
                              setSelectCurrency(roleOutputItem.code);
                              setSalaryCurrency(roleOutputItem.code);
                            }}
                          >
                            {roleOutputItem.code}
                          </div>
                        );
                      }
                    })}
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <SearchComboBox
                    inputData={currencies}
                    defaultValue={selectCurrency}
                    isMultiSelect={false}
                    inputCssClass={
                      "modal-input combo-search-box rounded-pill ps-3 bg-white border-0 fs-14 box-shadow "
                    }
                    wrapperCssClass={"text-start form-group "}
                    placeholder={"Currency"}
                    onSelect={async (event) => {
                      // let d = await currencies?.find((item) => {
                      //   return item.name === event[0];
                      // });
                      setSalaryCurrency(event);
                      setSelectCurrency(event);
                    }}
                    searchListHeight={150}
                    badgeThemeCssClass={"white p-2 fs-16 shadow-none"}
                    hideBadges={true}
                    isAllowUserDefined={false}
                  />
                </div>

                <div className="d-flex justify-content-center gap-3 mb-3">
                  {selectCurrency ? (
                    <div className="text-white rounded-pill fs-16 ps-4 pe-4 p-2 bg-black shadow-none d-inline">
                      <div className="d-flex flex-wrap">
                        <p>{selectCurrency}</p>
                        <button
                          onClick={() => {
                            if (selectCurrency) {
                              setSelectCurrency(null);
                              setSalaryCurrency(null);
                            }
                          }}
                          className=" btn-close-dropdown bg-transparent border-0 "
                        >
                          x
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="d-flex flex-wrap  gap-3 justify-content-center mt-3 mb-3">
                  {salaryTypes.map((salaryType, index) => {
                    return (
                      <div
                        className={
                          selectSalaryType?.toLocaleLowerCase() ===
                          salaryType?.toLocaleLowerCase()
                            ? "pointer rounded-pill bg-color-primary text-white fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                            : "pointer rounded-pill bg-white color-primary fs-16 p-2 ps-4 pe-4 box-shadow border-0"
                        }
                        onClick={(e) => {
                          if (
                            selectSalaryType?.toLocaleLowerCase() ===
                            salaryType?.toLocaleLowerCase()
                          ) {
                            setSelectSalaryType("");
                            setSalaryType("");
                          } else {
                            setSelectSalaryType(salaryType);
                            setSalaryType(salaryType);
                          }
                        }}
                        key={index}
                      >
                        {salaryType}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ExpectedMinimumSalaryDialog;
