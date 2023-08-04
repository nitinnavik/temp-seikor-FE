import React, { useState, useEffect } from "react";
import { useStoreState } from "easy-peasy";
import { getCurrency } from "../../_services/view.service";
import { GET_CURRENCY_ENDPOINT } from "./../../constants/api-endpoints";
import SearchComboBox from "./../SearchComboBox";

const MinimumRefferalBonusJobReferralModal = ({
  setMinReferralBonus,
  setReferralCurrency,
}) => {
  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );
  const [currencies, setCurrencies] = useState([]);
  const [curenciesStatic, setCurrenciesStatic] = useState([]);
  const [selectCurrency, setSelectCurrency] = useState();
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
    const fetchCurrenciesStatic = await getCurrency(GET_CURRENCY_ENDPOINT);
    let currencystatic = fetchCurrenciesStatic?.filter((el) => {
      return el?.isRecent === true;
    });
    setCurrenciesStatic(currencystatic);
  };
  useEffect(() => {
    setSelectCurrency(
      candidateDetails?.refereePreferencesResponse?.referralCurrency
    );
    setMinReferralBonus(
      candidateDetails?.refereePreferencesResponse?.minReferralBonus
    );
  }, [candidateDetails]);
  useEffect(() => {
    getAllMasterData();
  }, []);
  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  return (
    <div className="model-gradient-background p-0 m-0 job-preferences-full-height overflow-scroll">
      <div className="container p-2">
        <div className="job-preference-dialog-content">
          <div className="d-flex justify-content-center text-center">
            <div className="mt-5  ">
              <h2 className="color-primary fs-24 fw-700 mb-3 ">
                Recommend jobs with minimum referral bonus as
              </h2>
              <br />

              <div className="d-flex justify-content-center">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="80"
                  maxLength="2"
                  // pattern="[0-9]*"
                  defaultValue={`${
                    candidateDetails?.refereePreferencesResponse
                      ?.minReferralBonus
                      ? candidateDetails?.refereePreferencesResponse
                          ?.minReferralBonus
                      : 0
                  }`}
                  className="btn input-border-black p-2 text-center"
                  onKeyDown={blockInvalidChar}
                  onChange={(e) => {
                    setMinReferralBonus(e.target.value);
                  }}
                  
                />
              </div>
              <div></div>

              <div className="grid justify-content-center gap-3">
                <div className="d-flex justify-content-center flex-wrap gap-3 mt-3  mb-3">
                  {curenciesStatic &&
                    curenciesStatic.length > 0 &&
                    curenciesStatic.map((roleOutputItem, index) => {
                      console.log(roleOutputItem);
                      console.log(selectCurrency);
                      if(roleOutputItem.code==="EUR" || roleOutputItem.code==="GBP" || roleOutputItem.code==="INR" || roleOutputItem.code==="USD" ) { 
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
                          onClick={() => {
                            setSelectCurrency(roleOutputItem.code);
                            setReferralCurrency(roleOutputItem.code);
                          }}
                        >
                          {roleOutputItem.code}
                        </div>
                      );
                        }
                    })}
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <SearchComboBox
                    inputData={currencies}
                    defaultValue={selectCurrency}
                    isMultiSelect={false}
                    inputCssClass={
                      " modal-input combo-search-box rounded-pill ps-3 bg-white border-0 fs-14 box-shadow "
                    }
                    wrapperCssClass={"text-start form-group "}
                    placeholder={"Currency"}
                    onSelect={async (event) => {
                      setReferralCurrency(event);
                      setSelectCurrency(event);
                    }}
                    searchListHeight={150}
                    badgeThemeCssClass={"white p-2 fs-16 shadow-none"}
                    hideBadges={true}
                    isAllowUserDefined={true}
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
                              setReferralCurrency(null);
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimumRefferalBonusJobReferralModal;
