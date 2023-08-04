import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import close from "../assests/icons/ic-close-24.svg";
import RequestPaymentDoneDialog from "./request_payment_done_dialog copy";
import IcDoneWhite from "../assests/icons/ic_done_white.svg";
import {
  getAccountDetails,
  getPaymentAccountDetails,
  getRequestPayment,
} from "../_services/view.service";
import toaster from "../utils/toaster";
import { useEffect } from "react";
import {
  initialiseFormData,
  isEmpty,
  onFormFeildsChange,
  validateField,
} from "../utils/form_validators";
import {
  PAYMENT_MODE,
  PAYMODE,
  REQUIRED,
  SOMETHING_WENT_WRONG,
  STATUS_SUCCESS,
} from "../constants/keys";
import {
  ACCOUNT_NO_NOT_MATCHING,
  GENERAL_ERROR_MESSAGE,
} from "../constants/message";
import { useStoreState } from "easy-peasy";
import Loader from "./common/loader";

const RequestPaymentDialog = (props) => {
  const [showSendReferral, setShowSendReferral] = useState(false);
  const [sendPaymentRequest, setsendPaymentRequest] = useState();
  const [filterSelect, setFilterSelect] = useState("BHIM UPI");
  const [payMode, setPayMode] = useState("UPI");
  const [payModeId, setPayModeId] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountStatus, setAccountStatus] = useState(false);
  const [satus, setStatus] = useState(false);
  const [userPaymentAccountDetails, setUserPaymentAccountDetails] = useState();
  const [disableSendRequestBtn, setDisableSendRequestBtn] = useState(true);
  const [savedUserAccounts, setSavedUserAccounts] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const referral = props?.refereeReferrals[0];

  const candidateDetails = useStoreState(
    (state) => state.candidate.candidateDetails
  );

  const [filter, setFilter] = useState(null);
  const [getdetails, setGetDetails] = useState();

  // const getPaymentDetails =()=>{
  //   getAccountDetails().then(
  //     (res)=>{
  //       setGetDetails(res?.data?.data);
  //     },
  //     (error) => {
  //         toaster(
  //           "error",
  //           error?.data?.message ? error?.data?.message : GENERAL_ERROR_MESSAGE
  //         );
  //       }
  //   );

  // }
  // console.log(getdetails,"Details---->>>>");

  //send Data API
  const fetchPaymentRequest = (filter) => {
    // if (validateaccount(formData, setFormData)) {
    setShowLoader(true);

    getRequestPayment(filter).then(
      (res) => {
        if (res?.data?.status == STATUS_SUCCESS) {
          setsendPaymentRequest(res);
          setShowSendReferral(true);
          props?.setApiRefresh(true);

          props.onClickRequestDismiss();
          setPayModeId(null);
          setShowLoader(false);
        } else {
          toaster(
            "error",
            res?.data?.message ? res?.data?.message : GENERAL_ERROR_MESSAGE
          );
          props?.setApiRefresh(false);
        }
      },
      (error) => {
        toaster(
          "error",
          error?.data?.message ? error?.data?.message : GENERAL_ERROR_MESSAGE
        );
        setShowLoader(false);
        props?.setApiRefresh(false);
      }
    );
    // }
  };

  const confirmAccountCheckHandler = () => {
    if (
      formData?.accountNo?.valueText === formData?.confirmAccountNo?.valueText
    ) {
      let copyFormData = { ...formData };
      copyFormData.confirmAccountNo.errorText = "";
      setFormData(copyFormData);
      setFilter({
        ...filter,
        accountNumber: formData?.confirmAccountNo?.valueText,
      });
    } else {
      let copyFormData = { ...formData };
      copyFormData.confirmAccountNo.errorText = ACCOUNT_NO_NOT_MATCHING;
      setFormData(copyFormData);
    }
    setAccountNumber(formData?.accountNo?.valueText);
  };

  const paymentMethodSelection = [
    { name: "BHIM UPI", value: PAYMODE.UPI },
    { name: "GPay VPA", value: PAYMODE.VPA },
    { name: "Bank Account", value: PAYMODE.BANK_ACCOUNT },
    { name: "PayPal", value: PAYMODE.PAY_PAL },
  ];
  let initialFormData = {
    accountNo: {
      valueText: [],
      initial: [],
      errorText: "",
      check: ["required"],
    },
    confirmAccountNo: {
      valueText: [],
      initial: [],
      errorText: "",
      check: [""],
    },
    ifscCode: {
      valueText: [],
      initial: [],
      errorText: "",
      check: [""],
    },
    holderName: {
      valueText: [],
      initial: [],
      errorText: "",
      check: [""],
    },
  };
  const [formData, setFormData] = useState(initialFormData);
  const validateaccount = (formData, setFormData) => {
    let isValid = true;
    if (filterSelect == "Bank Account" || filterSelect == "PayPal") {
      if (
        formData?.accountNo?.valueText !== formData?.confirmAccountNo?.valueText
      ) {
        isValid = false;
      } else {
        isValid = true;
      }
      setFormData(formData);
    }

    return isValid;
  };

  const selectedValue = (value, name) => {
    let event = { target: { value: "", name: "" } };
    event.target.value = value;
    event.target.name = name;
    onFormFeildsChange(event, formData, setFormData);
    if (name == "accountNo") {
      setAccountNumber(value);
    }
  };

  const sendRequestHandler = () => {
    setShowLoader(true);

    var isValid = true;
    Object.keys(formData)?.forEach((key) => {
      if (!validateField(key, formData, setFormData)) {
        isValid = false;
      }
    });

    if (isValid && validateaccount(formData, setFormData)) {
      const newFilter = { ...filter };

      newFilter.paymentStatus = PAYMENT_MODE.REQUEST_PAYMENT;
      newFilter.payMode = payMode;
      newFilter.payModeId = payModeId;
      newFilter.isAccountSave = accountStatus ? accountStatus : false;
      newFilter.accountNumber = accountNumber ? accountNumber : "";
      newFilter.ifscCode = ifscCode ? ifscCode : "";
      newFilter.accountHolderName = accountHolderName;
      console.log("accountHolderName", accountNumber, accountNumber);
      //? accountHolderName : ""
      console.log(newFilter);
      fetchPaymentRequest(newFilter);
      setFilter(newFilter);
      setShowLoader(false);
      // props?.setApiRefresh(true);
    } else {
      toaster("error", "Invalid Input");
      setShowLoader(false);
      // props?.setApiRefresh(false);
    }
  };

  const checkErrorText = (fieldName, formDataOrignal) => {
    const formData = {
      ...formDataOrignal,
    };

    const checkValidationArray = formData[fieldName]["check"];
    const fieldValue = formData[fieldName]["valueText"];
    let isValid = true;

    if (checkValidationArray.includes(REQUIRED) && isEmpty(fieldValue)) {
      isValid = false;
    } else {
      formData[fieldName]["errorText"] = "";
    }
    return isValid;
  };

  useEffect(() => {
    let isValid = true;
    Object.keys(formData)?.forEach((key) => {
      if (!checkErrorText(key, formData)) {
        isValid = false;
      }
    });

    if (isValid) {
      setDisableSendRequestBtn(false);
    } else {
      setDisableSendRequestBtn(true);
    }
  }, [formData]);

  const [dataDetils, setDataDetils] = useState();
  const [VPAValue, setVPAValue] = useState();

  //fetch API
  const getPaymentDetailsData = () => {
    getPaymentAccountDetails().then(
      (res) => {
        // if (res?.data?.status === STATUS_SUCCESS && !isEmpty(res?.data?.data)) {
        setGetDetails(res?.data?.data);
        const { data } = res?.data;
        console.log(data, "data");
        setSavedUserAccounts(res?.data?.data);
        res?.data?.data?.map((data) => {
          console.log(res?.data?.data, "response--->data");

          if (data?.payMode == "UPI") {
            setPayModeId(data?.id);
            setDataDetils(data?.accountNumber);
            setStatus(true);
          }
          // if(data?.payMode=="VPA"){

          // }
        });
        // const dataFilterByUserId = data.filter(
        //   (list) =>
        //     list.userId === candidateDetails?.userRegistrationDetails?.userId
        // );
        if (res?.data?.data?.length > 0) {
          setUserPaymentAccountDetails(res?.data?.data);
        } else {
          setUserPaymentAccountDetails([]);
        }
        // }
      },
      (error) => {
        toaster("error", SOMETHING_WENT_WRONG);
      }
    );
  };
  console.log("get data---->", getdetails, dataDetils);
  const paymentAccountHandler = (accountType) => {
    if (!isEmpty(userPaymentAccountDetails)) {
      if (accountType === PAYMODE.UPI) {
        const findAccountDetails = userPaymentAccountDetails.find(
          (list) => list.payMode === PAYMODE.UPI
        );
        preFilledForm(findAccountDetails);
      } else if (accountType === PAYMODE.VPA) {
        const findAccountDetails = userPaymentAccountDetails.find(
          (list) => list.payMode === PAYMODE.VPA
        );
        preFilledForm(findAccountDetails);
      } else if (accountType === PAYMODE.BANK_ACCOUNT) {
        const findAccountDetails = userPaymentAccountDetails.find(
          (list) => list.payMode === PAYMODE.BANK_ACCOUNT
        );
        preFilledForm(findAccountDetails);
      } else {
        const findAccountDetails = userPaymentAccountDetails.find(
          (list) => list.payMode === PAYMODE.PAY_PAL
        );
        preFilledForm(findAccountDetails);
      }
    }
  };

  const preFilledForm = (findAccountDetails) => {
    let copyFormData = { ...formData };
    copyFormData.accountNo.initial = findAccountDetails
      ? findAccountDetails?.accountNumber
      : [];
    copyFormData.confirmAccountNo.initial = findAccountDetails
      ? findAccountDetails?.accountNumber
      : [];
    copyFormData.ifscCode.initial = findAccountDetails
      ? findAccountDetails?.ifscCode
      : [];
    copyFormData.holderName.initial = findAccountDetails
      ? findAccountDetails?.accountHolderName
      : [];
    setFormData(copyFormData);
  };

  // useEffect(() => {
  //   fetchPaymentRequest(filter);
  // }, [filter]);

  useEffect(() => {
    paymentAccountHandler(PAYMODE.UPI);
  }, [userPaymentAccountDetails]);

  const clearFormData = () => {
    initialiseFormData(formData, setFormData);
    let copyFormData = { ...formData };
    if (filterSelect === "BHIM UPI" || filterSelect === "GPay VPA") {
      copyFormData.confirmAccountNo.check = [];
      copyFormData.ifscCode.check = [];
      copyFormData.holderName.check = [];
      setFormData(copyFormData);
    } else if (filterSelect === "PayPal") {
      copyFormData.ifscCode.check = [];
      copyFormData.confirmAccountNo.check = ["required"];
      copyFormData.accountNo.check = ["required"];
      copyFormData.holderName.check = ["required"];
      setFormData(copyFormData);
    } else {
      copyFormData.accountNo.check = ["required"];
      copyFormData.confirmAccountNo.check = ["required"];
      copyFormData.ifscCode.check = ["required"];
      copyFormData.holderName.check = ["required"];
      setFormData(copyFormData);
    }
  };

  useEffect(() => {
    clearFormData();
    setPayModeId(null);

    if (filterSelect == "BHIM UPI") {
      savedUserAccounts?.map((data) => {
        if (data?.payMode == "UPI") {
          setPayModeId(data?.id);
          setDataDetils(data?.accountNumber);
          setStatus(true);
        }
      });
    }
    if (filterSelect == "GPay VPA") {
      savedUserAccounts?.map((data) => {
        if (data?.payMode == "VPA") {
          setPayModeId(data?.id);
          setVPAValue(data?.accountNumber);
        }
      });
    }
    if (filterSelect == "Bank Account") {
      savedUserAccounts?.map((data) => {
        if (data?.payMode == "BANK_ACCOUNT") {
          setDataDetils(data);
          setPayModeId(data?.id);
        }
      });
    }
    if (filterSelect == "PayPal") {
      savedUserAccounts?.map((data) => {
        if (data?.payMode == "PAY_PAL") {
          setDataDetils(data);
          setPayModeId(data?.id);
        }
      });
    }
  }, [filterSelect]);

  useEffect(() => {
    getPaymentDetailsData();
  }, [candidateDetails]);

  useEffect(() => {
    setFilter({
      initiateBy: candidateDetails?.userRegistrationDetails?.name
        ? candidateDetails?.userRegistrationDetails?.name
        : "",
      jobId: referral?.jobId ? referral?.jobId : "",
      amount: referral?.referralAmount ? referral?.referralAmount : "",
      refereeId: referral?.referalId ? referral?.referalId : "",
      applicationId: referral?.applicationId ? referral?.applicationId : "",
      paymentStatus: "",
      isAccountSave: null,
      payModeId: null,
      payMode: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      redeemRewardPointId: "",
    });
   
  }, [candidateDetails, referral]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [props.showRequestPayment]);

  return (
    <div>
      {showLoader && <Loader />}
      <Modal
        show={props.showRequestPayment}
        onHide={() => {
          props.onClickRequestDismiss();
          initialiseFormData(formData, setFormData);
          setFilterSelect("BHIM UPI");
        }}
        onExit={() => {
          setFilterSelect("BHIM UPI");
        }}
        size="lg"
        fullscreen="lg-down"
        id="request-payment"
        className="dialog-wrapper lg-dialog-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0 d-flex justify-content-end">
          <img
            src={close}
            alt="close-icon"
            className="rounded-circle border-2 p-1 text-black pt-1 pb-1 forgot-round end-0 me-3 pointer"
            onClick={() => {
              props.onClickRequestDismiss();
              setFilterSelect("BHIM UPI");
            }}
          />
        </Modal.Header>

        <Modal.Body className="px-5 pt-0 dialog-body mt-0">
          <div>
            <div className="fs-24 fw-700 color-primary">Request Payment</div>
            <div className="fs-14 color-tertiary">₹ {props.referralAmount}</div>
            <div className="pt-3 fs-12 color-tertiary">
              Select where you want to receive the payment
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center pt-3 pb-3">
              {paymentMethodSelection?.map((payment, index) => {
                return (
                  <div
                    className="btn page-filter-button bg-white text-center d-flex justify-content-center"
                    key={index}
                    onClick={() => {
                      setFilterSelect(payment.name);
                      setPayMode(payment.value);
                      paymentAccountHandler(payment.value);
                    }}
                  >
                    <div
                      style={{ width: "20px", height: "20px" }}
                      className={
                        filterSelect === payment.name
                          ? "p-1 pt-0 pb-0 bg-black rounded-circle me-1 d-block"
                          : "d-none"
                      }
                    >
                      <img src={IcDoneWhite} alt="whitedone-icon" />
                    </div>
                    <div> {payment.name} </div>
                  </div>
                );
              })}
            </div>
            {/* input box for upi  */}
            <div
              className={
                filterSelect === "BHIM UPI" ? "pt-3 d-block" : "d-none"
              }
            >
              <div className="medium-text-dark-gray fw-700">
                Enter UPI Address
              </div>
              <div className="pt-3">
                <input
                  name="accountNo"
                  type="text"
                  placeholder="Write here"
                  // value={formData?.accountNo?.valueText}
                  className={
                    (formData?.accountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  defaultValue={dataDetils}
                  onChange={($event) => {
                    selectedValue($event.target.value, "accountNo");
                    // setAccountNumber(formData?.accountNo?.valueText);
                  }}
                />
                {formData?.accountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.accountNo?.errorText}
                  </div>
                )}
              </div>
            </div>
            {/* input box for gpay */}
            <div
              className={
                filterSelect === "GPay VPA" ? "pt-3 d-block" : "d-none"
              }
            >
              <div className="medium-text-dark-gray fw-700">Enter GPay VPA</div>
              <div className="pt-3">
                <input
                  name="accountNo"
                  type="text"
                  placeholder="Write here"
                  // value={formData?.accountNo?.valueText}
                  defaultValue={VPAValue}
                  className={
                    (formData?.accountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "accountNo");
                    setAccountNumber(formData?.accountNo?.valueText);
                  }}
                />
                {formData?.accountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.accountNo?.errorText}
                  </div>
                )}
              </div>
            </div>
            {/* Input boxes for bank account */}
            <div
              className={
                filterSelect === "Bank Account" ? "pt-3 d-block" : "d-none"
              }
            >
              <div className="medium-text-dark-gray fw-700">
                Bank Account Details
              </div>
              <div className="pt-3  row gap-3 ps-2">
                <input
                  name="account-no"
                  type="text"
                  placeholder="Account Number"
                  // value={formData?.accountNo?.valueText}
                  defaultValue={dataDetils?.accountNumber}
                  className={
                    (formData?.accountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "accountNo");
                  }}
                />
                {formData?.accountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.accountNo?.errorText}
                  </div>
                )}
                <input
                  name="confirmAccountNo"
                  type="text"
                  placeholder="Confirm Account Number"
                  value={formData?.confirmAccountNo?.valueText}
                  className={
                    (formData?.confirmAccountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "confirmAccountNo");
                    confirmAccountCheckHandler();
                  }}
                />
                {formData?.confirmAccountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.confirmAccountNo?.errorText}
                  </div>
                )}
                <input
                  maxLength={200}
                  name="ifscCode"
                  type="name"
                  placeholder="Branch IFSC Code"
                  // value={formData?.ifscCode?.valueText}
                  defaultValue={dataDetils?.ifscCode}
                  className={
                    (formData?.ifscCode?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "ifscCode");
                    setIfscCode($event.target.value);
                  }}
                />
                {formData?.ifscCode?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.ifscCode?.errorText}
                  </div>
                )}
                <input
                  name="holderName"
                  type="text"
                  placeholder="Account Holder Name"
                  // value={formData?.holderName?.valueText}
                  defaultValue={dataDetils?.accountHolderName}
                  className={
                    (formData?.holderName?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "holderName");
                    setAccountHolderName($event.target.value);
                  }}
                />
                {formData?.holderName?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.holderName?.errorText}
                  </div>
                )}
              </div>
            </div>
            {/* input boxes for paypal */}
            <div
              className={filterSelect === "PayPal" ? "pt-3 d-block" : "d-none"}
            >
              <div className="medium-text-dark-gray fw-700">Paypal Details</div>
              <div className="pt-3 ps-2 row gap-3">
                <input
                  name="account-no"
                  type="text"
                  placeholder="Account Number"
                  // value={formData?.accountNo?.valueText}
                  defaultValue={dataDetils?.accountNumber}
                  className={
                    (formData?.accountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "accountNo");
                  }}
                />
                {formData?.accountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.accountNo?.errorText}
                  </div>
                )}
                <input
                  name="confirmAccountNo"
                  type="text"
                  placeholder="Confirm Account Number"
                  value={formData?.confirmAccountNo?.valueText}
                  className={
                    (formData?.confirmAccountNo?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "confirmAccountNo");
                    confirmAccountCheckHandler();
                  }}
                />
                {formData?.confirmAccountNo?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.confirmAccountNo?.errorText}
                  </div>
                )}

                <input
                  name="holderName"
                  type="text"
                  placeholder="Account Holder Name"
                  // value={formData?.holderName?.valueText}
                  defaultValue={dataDetils?.accountHolderName}
                  className={
                    (formData?.holderName?.errorText ? "error" : "") +
                    " form-control fs-12 modal-form-input"
                  }
                  onChange={($event) => {
                    selectedValue($event.target.value, "holderName");
                    setAccountHolderName($event.target.value);
                  }}
                />
                {formData?.holderName?.errorText && (
                  <div className="field-error mt-1">
                    {formData?.holderName?.errorText}
                  </div>
                )}
              </div>
            </div>
            {/* end checkbox div */}
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-dialog-footer d-flex justify-content-sm-between justify-content-center">
          <div className="form-check d-flex gap-2 px-5 pe-sm-0 pe-md-5 align-items-center save-btn-div">
            <input
              type="checkbox"
              className="form-check-input"
              id="save-future-payment"
              onClick={() => {
                setAccountStatus(!accountStatus);
              }}
              defaultChecked={satus === true ? true : filter?.isAccountSave}
            />
            <label
              className="form-check-label fs-12 color-tertiary"
              for="save-future-payment"
            >
              Save my details for future payments
            </label>
          </div>
          <div className="mt-3 mt-md-0 ms-md-0 pe-sm-5 px-5 px-sm-0 px-md-5 send-request-div">
            <Button
              disabled={disableSendRequestBtn}
              className="btn-primary btn-rounded ps-5 pe-5 btn-send-payment-request"
              onClick={() => {
                sendRequestHandler();
              }}
            >
              Send Request
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <RequestPaymentDoneDialog
        showSendReferral={showSendReferral}
        showLoader={showLoader}
        onSendReferralClick={() => setShowSendReferral(false)}
        referralAmount={referral?.referralAmount}
        currencyType={referral?.currencyType}
      />
    </div>
  );
};

export default RequestPaymentDialog;
